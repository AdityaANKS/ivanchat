const { expect } = require('chai');
const sinon = require('sinon');
const Redis = require('ioredis-mock');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const MessageController = require('../../server/src/controllers/messageController');
const Message = require('../../server/src/models/Message');
const User = require('../../server/src/models/User');
const Channel = require('../../server/src/models/Channel');
const EncryptionService = require('../../server/src/services/EncryptionService');
const AnalyticsService = require('../../server/src/services/AnalyticsService');
const ModerationBot = require('../../server/src/bot/ModerationBot');

describe('Integration: Message Service', () => {
  let mongoServer;
  let redisClient;
  let messageController;
  let testUser, testChannel;

  before(async () => {
    // Setup in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Setup mock Redis
    redisClient = new Redis();

    // Initialize controller
    messageController = MessageController;
  });

  beforeEach(async () => {
    // Clear database
    await Message.deleteMany({});
    await User.deleteMany({});
    await Channel.deleteMany({});

    // Create test data
    testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      discriminator: '0001'
    });

    testChannel = await Channel.create({
      name: 'test-channel',
      type: 'text',
      serverId: new mongoose.Types.ObjectId()
    });
  });

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    redisClient.disconnect();
  });

  describe('Message Creation', () => {
    it('should create and encrypt a message', async () => {
      const messageData = {
        content: 'Test message',
        authorId: testUser._id,
        channelId: testChannel._id
      };

      const encryptSpy = sinon.spy(EncryptionService, 'encryptMessage');
      const analyticsSpy = sinon.spy(AnalyticsService, 'trackMessage');

      const message = await messageController.sendMessage(messageData);

      expect(message).to.have.property('_id');
      expect(message.content).to.equal('Test message');
      expect(message.authorId.toString()).to.equal(testUser._id.toString());
      
      // Check encryption was called
      expect(encryptSpy.calledOnce).to.be.true;
      
      // Check analytics tracking
      expect(analyticsSpy.calledOnce).to.be.true;

      encryptSpy.restore();
      analyticsSpy.restore();
    });

    it('should validate message content', async () => {
      const invalidMessages = [
        { content: '', authorId: testUser._id, channelId: testChannel._id },
        { content: 'a'.repeat(4001), authorId: testUser._id, channelId: testChannel._id },
        { authorId: testUser._id, channelId: testChannel._id }
      ];

      for (const messageData of invalidMessages) {
        try {
          await messageController.sendMessage(messageData);
          expect.fail('Should have thrown validation error');
        } catch (error) {
          expect(error.name).to.equal('ValidationError');
        }
      }
    });

    it('should apply auto-moderation', async () => {
      const messageData = {
        content: 'This contains profanity: damn',
        authorId: testUser._id,
        channelId: testChannel._id
      };

      const moderationSpy = sinon.spy(ModerationBot, 'processMessage');

      const result = await messageController.sendMessage(messageData);

      expect(moderationSpy.calledOnce).to.be.true;
      
      // Message might be blocked or modified
      if (result.blocked) {
        expect(result.reason).to.include('profanity');
      }

      moderationSpy.restore();
    });

    it('should handle attachments', async () => {
      const messageData = {
        content: 'Message with attachment',
        authorId: testUser._id,
        channelId: testChannel._id,
        attachments: [{
          filename: 'test.png',
          size: 1024,
          url: 'https://example.com/test.png',
          mimeType: 'image/png'
        }]
      };

      const message = await messageController.sendMessage(messageData);

      expect(message.attachments).to.have.lengthOf(1);
      expect(message.attachments[0].filename).to.equal('test.png');
    });
  });

  describe('Message Retrieval', () => {
    beforeEach(async () => {
      // Create test messages
      for (let i = 0; i < 30; i++) {
        await Message.create({
          content: `Message ${i}`,
          authorId: testUser._id,
          channelId: testChannel._id,
          createdAt: new Date(Date.now() - i * 60000)
        });
      }
    });

    it('should retrieve messages with pagination', async () => {
      const messages = await messageController.getMessages(testChannel._id, {
        limit: 10,
        before: null
      });

      expect(messages).to.have.lengthOf(10);
      expect(messages[0].content).to.equal('Message 0');
      expect(messages[9].content).to.equal('Message 9');
    });

    it('should retrieve messages before a specific message', async () => {
      const referenceMessage = await Message.findOne({ content: 'Message 10' });
      
      const messages = await messageController.getMessages(testChannel._id, {
        limit: 5,
        before: referenceMessage._id
      });

      expect(messages).to.have.lengthOf(5);
      expect(messages[0].content).to.equal('Message 11');
    });

    it('should retrieve messages after a specific message', async () => {
      const referenceMessage = await Message.findOne({ content: 'Message 20' });
      
      const messages = await messageController.getMessages(testChannel._id, {
        limit: 5,
        after: referenceMessage._id
      });

      expect(messages).to.have.lengthOf(5);
      expect(messages[0].content).to.equal('Message 19');
    });

    it('should cache retrieved messages', async () => {
      const cacheSetSpy = sinon.spy(redisClient, 'setex');
      
      await messageController.getMessages(testChannel._id, { limit: 10 });
      
      expect(cacheSetSpy.called).to.be.true;
      
      // Second call should use cache
      const cacheGetSpy = sinon.spy(redisClient, 'get');
      await messageController.getMessages(testChannel._id, { limit: 10 });
      
      expect(cacheGetSpy.called).to.be.true;
      
      cacheSetSpy.restore();
      cacheGetSpy.restore();
    });
  });

  describe('Message Updates', () => {
    let testMessage;

    beforeEach(async () => {
      testMessage = await Message.create({
        content: 'Original content',
        authorId: testUser._id,
        channelId: testChannel._id
      });
    });

    it('should edit message content', async () => {
      const updatedMessage = await messageController.editMessage(
        testMessage._id,
        testUser._id,
        { content: 'Edited content' }
      );

      expect(updatedMessage.content).to.equal('Edited content');
      expect(updatedMessage.edited).to.be.true;
      expect(updatedMessage.editHistory).to.have.lengthOf(1);
      expect(updatedMessage.editHistory[0].content).to.equal('Original content');
    });

    it('should prevent editing by non-author', async () => {
      const otherUser = await User.create({
        username: 'otheruser',
        email: 'other@example.com',
        password: 'password123',
        discriminator: '0002'
      });

      try {
        await messageController.editMessage(
          testMessage._id,
          otherUser._id,
          { content: 'Hacked!' }
        );
        expect.fail('Should have thrown authorization error');
      } catch (error) {
        expect(error.message).to.include('authorized');
      }
    });

    it('should delete message', async () => {
      await messageController.deleteMessage(testMessage._id, testUser._id);

      const deletedMessage = await Message.findById(testMessage._id);
      expect(deletedMessage.deleted).to.be.true;
      expect(deletedMessage.content).to.be.null;
    });
  });

  describe('Message Reactions', () => {
    let testMessage;

    beforeEach(async () => {
      testMessage = await Message.create({
        content: 'React to this',
        authorId: testUser._id,
        channelId: testChannel._id
      });
    });

    it('should add reaction to message', async () => {
      const updatedMessage = await messageController.addReaction(
        testMessage._id,
        testUser._id,
        '👍'
      );

      expect(updatedMessage.reactions).to.have.lengthOf(1);
      expect(updatedMessage.reactions[0].emoji).to.equal('👍');
      expect(updatedMessage.reactions[0].users).to.include(testUser._id.toString());
    });

    it('should increment existing reaction', async () => {
      // First user adds reaction
      await messageController.addReaction(testMessage._id, testUser._id, '❤️');

      // Second user adds same reaction
      const secondUser = await User.create({
        username: 'user2',
        email: 'user2@example.com',
        password: 'password123',
        discriminator: '0002'
      });

      const updatedMessage = await messageController.addReaction(
        testMessage._id,
        secondUser._id,
        '❤️'
      );

      expect(updatedMessage.reactions).to.have.lengthOf(1);
      expect(updatedMessage.reactions[0].count).to.equal(2);
      expect(updatedMessage.reactions[0].users).to.have.lengthOf(2);
    });

    it('should remove reaction', async () => {
      // Add reaction
      await messageController.addReaction(testMessage._id, testUser._id, '😀');

      // Remove reaction
      const updatedMessage = await messageController.removeReaction(
        testMessage._id,
        testUser._id,
        '😀'
      );

      expect(updatedMessage.reactions).to.have.lengthOf(0);
    });
  });

  describe('Message Search', () => {
    beforeEach(async () => {
      // Create diverse messages for search
      await Message.create([
        {
          content: 'Hello world',
          authorId: testUser._id,
          channelId: testChannel._id
        },
        {
          content: 'JavaScript is awesome',
          authorId: testUser._id,
          channelId: testChannel._id
        },
        {
          content: 'Testing search functionality',
          authorId: testUser._id,
          channelId: testChannel._id
        }
      ]);
    });

    it('should search messages by content', async () => {
      const results = await messageController.searchMessages({
        query: 'JavaScript',
        channelId: testChannel._id
      });

      expect(results).to.have.lengthOf(1);
      expect(results[0].content).to.include('JavaScript');
    });

    it('should search with filters', async () => {
      const results = await messageController.searchMessages({
        query: 'world',
        channelId: testChannel._id,
        authorId: testUser._id
      });

      expect(results).to.have.lengthOf(1);
      expect(results[0].content).to.equal('Hello world');
    });

    it('should support regex search', async () => {
      const results = await messageController.searchMessages({
        query: '/test.*/i',
        channelId: testChannel._id
      });

      expect(results).to.have.lengthOf(1);
      expect(results[0].content).to.include('Testing');
    });
  });

  describe('Message Threading', () => {
    let parentMessage;

    beforeEach(async () => {
      parentMessage = await Message.create({
        content: 'Start a thread here',
        authorId: testUser._id,
        channelId: testChannel._id
      });
    });

    it('should create thread from message', async () => {
      const thread = await messageController.createThread(
        parentMessage._id,
        testUser._id,
        {
          name: 'Discussion Thread',
          autoArchiveDuration: 1440
        }
      );

      expect(thread).to.have.property('_id');
      expect(thread.name).to.equal('Discussion Thread');
      expect(thread.parentMessageId.toString()).to.equal(parentMessage._id.toString());
    });

    it('should add messages to thread', async () => {
      const thread = await messageController.createThread(
        parentMessage._id,
        testUser._id,
        { name: 'Thread' }
      );

      const threadMessage = await messageController.sendMessage({
        content: 'Reply in thread',
        authorId: testUser._id,
        channelId: testChannel._id,
        threadId: thread._id
      });

      expect(threadMessage.threadId.toString()).to.equal(thread._id.toString());
    });
  });

  describe('Message Scheduling', () => {
    it('should schedule a message', async () => {
      const scheduledTime = new Date(Date.now() + 3600000); // 1 hour from now
      
      const scheduledMessage = await messageController.scheduleMessage({
        content: 'Scheduled message',
        authorId: testUser._id,
        channelId: testChannel._id,
        scheduledTime
      });

      expect(scheduledMessage.scheduled).to.be.true;
      expect(scheduledMessage.scheduledTime).to.eql(scheduledTime);
      expect(scheduledMessage.sent).to.be.false;
    });

    it('should send scheduled messages at the right time', async function() {
      this.timeout(5000);

      const scheduledTime = new Date(Date.now() + 1000); // 1 second from now
      
      await messageController.scheduleMessage({
        content: 'Quick scheduled message',
        authorId: testUser._id,
        channelId: testChannel._id,
        scheduledTime
      });

      // Wait for scheduled time
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check if message was sent
      const sentMessage = await Message.findOne({
        content: 'Quick scheduled message',
        sent: true
      });

      expect(sentMessage).to.not.be.null;
    });
  });
});