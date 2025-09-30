const puppeteer = require('puppeteer');
const { expect } = require('chai');
const { io: ioClient } = require('socket.io-client');
const { connectDB, clearDB, closeDB } = require('../helpers/db');
const { 
  generateTestUser, 
  generateTestServer,
  generateTestChannel,
  loginUser 
} = require('../helpers/generators');

describe('E2E: Messaging Flow', () => {
  let browser;
  let page1, page2;
  let socket1, socket2;
  let server;
  let testServer, testChannel;
  let user1, user2;
  const baseURL = process.env.TEST_URL || 'http://localhost:3000';

  before(async () => {
    await connectDB();
    browser = await puppeteer.launch({
      headless: process.env.CI === 'true'
    });
    
    // Create test data
    testServer = await generateTestServer();
    testChannel = await generateTestChannel(testServer.id);
    user1 = await generateTestUser();
    user2 = await generateTestUser();
  });

  beforeEach(async () => {
    page1 = await browser.newPage();
    page2 = await browser.newPage();
  });

  afterEach(async () => {
    await page1.close();
    await page2.close();
    if (socket1) socket1.disconnect();
    if (socket2) socket2.disconnect();
  });

  after(async () => {
    await browser.close();
    await closeDB();
  });

  describe('Real-time Messaging', () => {
    it('should send and receive messages in real-time', async () => {
      // Login both users
      await loginUser(page1, user1);
      await loginUser(page2, user2);
      
      // Navigate to channel
      await page1.goto(`${baseURL}/servers/${testServer.id}/channels/${testChannel.id}`);
      await page2.goto(`${baseURL}/servers/${testServer.id}/channels/${testChannel.id}`);
      
      // User 1 sends message
      await page1.type('.message-input', 'Hello from User 1!');
      await page1.keyboard.press('Enter');
      
      // Check message appears for both users
      await page1.waitForSelector('.message:last-child');
      await page2.waitForSelector('.message:last-child');
      
      const message1 = await page1.$eval('.message:last-child .message-content', el => el.textContent);
      const message2 = await page2.$eval('.message:last-child .message-content', el => el.textContent);
      
      expect(message1).to.equal('Hello from User 1!');
      expect(message2).to.equal('Hello from User 1!');
    });

    it('should show typing indicators', async () => {
      await loginUser(page1, user1);
      await loginUser(page2, user2);
      
      await page1.goto(`${baseURL}/servers/${testServer.id}/channels/${testChannel.id}`);
      await page2.goto(`${baseURL}/servers/${testServer.id}/channels/${testChannel.id}`);
      
      // User 1 starts typing
      await page1.type('.message-input', 'Typing...');
      
      // User 2 should see typing indicator
      await page2.waitForSelector('.typing-indicator');
      const typingText = await page2.$eval('.typing-indicator', el => el.textContent);
      expect(typingText).to.include(user1.username);
      
      // Stop typing
      await page1.evaluate(() => {
        document.querySelector('.message-input').value = '';
      });
      
      // Typing indicator should disappear
      await page2.waitForSelector('.typing-indicator', { hidden: true });
    });

    it('should edit messages', async () => {
      await loginUser(page1, user1);
      
      await page1.goto(`${baseURL}/servers/${testServer.id}/channels/${testChannel.id}`);
      
      // Send message
      await page1.type('.message-input', 'Original message');
      await page1.keyboard.press('Enter');
      
      await page1.waitForSelector('.message:last-child');
      
      // Edit message
      await page1.hover('.message:last-child');
      await page1.click('.message-edit-button');
      
      await page1.keyboard.down('Control');
      await page1.keyboard.press('A');
      await page1.keyboard.up('Control');
      
      await page1.type('Edited message');
      await page1.keyboard.press('Enter');
      
      // Check edited message
      await page1.waitForSelector('.message:last-child .edited-tag');
      const editedContent = await page1.$eval('.message:last-child .message-content', el => el.textContent);
      expect(editedContent).to.equal('Edited message');
    });

    it('should delete messages', async () => {
      await loginUser(page1, user1);
      
      await page1.goto(`${baseURL}/servers/${testServer.id}/channels/${testChannel.id}`);
      
      // Send message
      await page1.type('.message-input', 'Message to delete');
      await page1.keyboard.press('Enter');
      
      await page1.waitForSelector('.message:last-child');
      
      // Delete message
      await page1.hover('.message:last-child');
      await page1.click('.message-delete-button');
      
      // Confirm deletion
      await page1.waitForSelector('.confirm-dialog');
      await page1.click('.confirm-delete-button');
      
      // Message should be removed
      await page1.waitForSelector('.message:last-child', { hidden: true });
    });
  });

  describe('Message Features', () => {
    it('should add reactions to messages', async () => {
      await loginUser(page1, user1);
      await loginUser(page2, user2);
      
      await page1.goto(`${baseURL}/servers/${testServer.id}/channels/${testChannel.id}`);
      await page2.goto(`${baseURL}/servers/${testServer.id}/channels/${testChannel.id}`);
      
      // Send message
      await page1.type('.message-input', 'React to this!');
      await page1.keyboard.press('Enter');
      
      await page1.waitForSelector('.message:last-child');
      await page2.waitForSelector('.message:last-child');
      
      // Add reaction
      await page1.hover('.message:last-child');
      await page1.click('.add-reaction-button');
      await page1.click('.emoji-picker [data-emoji="👍"]');
      
      // Check reaction appears for both users
      await page1.waitForSelector('.message:last-child .reaction');
      await page2.waitForSelector('.message:last-child .reaction');
      
      const reactionCount = await page2.$eval('.message:last-child .reaction-count', el => el.textContent);
      expect(reactionCount).to.equal('1');
    });

    it('should reply to messages', async () => {
      await loginUser(page1, user1);
      await loginUser(page2, user2);
      
      await page1.goto(`${baseURL}/servers/${testServer.id}/channels/${testChannel.id}`);
      await page2.goto(`${baseURL}/servers/${testServer.id}/channels/${testChannel.id}`);
      
      // User 1 sends message
      await page1.type('.message-input', 'Original message');
      await page1.keyboard.press('Enter');
      
      await page2.waitForSelector('.message:last-child');
      
      // User 2 replies
      await page2.hover('.message:last-child');
      await page2.click('.reply-button');
      
      await page2.type('.message-input', 'This is a reply');
      await page2.keyboard.press('Enter');
      
      // Check reply appears with reference
      await page1.waitForSelector('.message:last-child .reply-reference');
      const replyRef = await page1.$eval('.message:last-child .reply-reference', el => el.textContent);
      expect(replyRef).to.include('Original message');
    });

    it('should create threads from messages', async () => {
      await loginUser(page1, user1);
      
      await page1.goto(`${baseURL}/servers/${testServer.id}/channels/${testChannel.id}`);
      
      // Send message
      await page1.type('.message-input', 'Start a thread here');
      await page1.keyboard.press('Enter');
      
      await page1.waitForSelector('.message:last-child');
      
      // Create thread
      await page1.hover('.message:last-child');
      await page1.click('.create-thread-button');
      
      await page1.type('#thread-name', 'Discussion Thread');
      await page1.click('.create-thread-confirm');
      
      // Check thread is created
      await page1.waitForSelector('.thread-indicator');
      const threadName = await page1.$eval('.thread-indicator', el => el.textContent);
      expect(threadName).to.include('Discussion Thread');
    });

    it('should pin messages', async () => {
      await loginUser(page1, user1);
      
      await page1.goto(`${baseURL}/servers/${testServer.id}/channels/${testChannel.id}`);
      
      // Send message
      await page1.type('.message-input', 'Important message to pin');
      await page1.keyboard.press('Enter');
      
      await page1.waitForSelector('.message:last-child');
      
      // Pin message
      await page1.hover('.message:last-child');
      await page1.click('.message-menu-button');
      await page1.click('.pin-message-option');
      
      // Check pinned messages
      await page1.click('.pinned-messages-button');
      await page1.waitForSelector('.pinned-messages-panel');
      
      const pinnedMessage = await page1.$eval('.pinned-message .message-content', el => el.textContent);
      expect(pinnedMessage).to.equal('Important message to pin');
    });
  });

  describe('File Uploads', () => {
    it('should upload and send images', async () => {
      await loginUser(page1, user1);
      
      await page1.goto(`${baseURL}/servers/${testServer.id}/channels/${testChannel.id}`);
      
      // Upload file
      const fileInput = await page1.$('input[type="file"]');
      await fileInput.uploadFile('./tests/fixtures/test-image.png');
      
      // Add message with image
      await page1.type('.message-input', 'Check out this image!');
      await page1.keyboard.press('Enter');
      
      // Check image appears
      await page1.waitForSelector('.message:last-child .message-attachment');
      const hasImage = await page1.$('.message:last-child img.attachment-image');
      expect(hasImage).to.not.be.null;
    });

    it('should preview files before sending', async () => {
      await loginUser(page1, user1);
      
      await page1.goto(`${baseURL}/servers/${testServer.id}/channels/${testChannel.id}`);
      
      // Upload file
      const fileInput = await page1.$('input[type="file"]');
      await fileInput.uploadFile('./tests/fixtures/test-document.pdf');
      
      // Check preview appears
      await page1.waitForSelector('.file-preview');
      const fileName = await page1.$eval('.file-preview .file-name', el => el.textContent);
      expect(fileName).to.equal('test-document.pdf');
      
      // Remove file
      await page1.click('.file-preview .remove-file');
      await page1.waitForSelector('.file-preview', { hidden: true });
    });
  });

  describe('Search', () => {
    it('should search messages in channel', async () => {
      await loginUser(page1, user1);
      
      await page1.goto(`${baseURL}/servers/${testServer.id}/channels/${testChannel.id}`);
      
      // Send multiple messages
      const messages = ['First message', 'Second message', 'Third message with keyword'];
      for (const msg of messages) {
        await page1.type('.message-input', msg);
        await page1.keyboard.press('Enter');
        await page1.waitForTimeout(100);
      }
      
      // Open search
      await page1.click('.search-button');
      await page1.type('.search-input', 'keyword');
      await page1.keyboard.press('Enter');
      
      // Check search results
      await page1.waitForSelector('.search-results');
      const results = await page1.$$('.search-result');
      expect(results).to.have.lengthOf(1);
      
      const resultText = await page1.$eval('.search-result .message-content', el => el.textContent);
      expect(resultText).to.include('keyword');
    });
  });

  describe('Message Formatting', () => {
    it('should support markdown formatting', async () => {
      await loginUser(page1, user1);
      
      await page1.goto(`${baseURL}/servers/${testServer.id}/channels/${testChannel.id}`);
      
      // Send markdown message
      await page1.type('.message-input', '**Bold** *italic* `code` ~~strikethrough~~');
      await page1.keyboard.press('Enter');
      
      await page1.waitForSelector('.message:last-child');
      
      // Check formatting
      const hasBold = await page1.$('.message:last-child strong');
      const hasItalic = await page1.$('.message:last-child em');
      const hasCode = await page1.$('.message:last-child code');
      const hasStrike = await page1.$('.message:last-child del');
      
      expect(hasBold).to.not.be.null;
      expect(hasItalic).to.not.be.null;
      expect(hasCode).to.not.be.null;
      expect(hasStrike).to.not.be.null;
    });

    it('should support code blocks', async () => {
      await loginUser(page1, user1);
      
      await page1.goto(`${baseURL}/servers/${testServer.id}/channels/${testChannel.id}`);
      
      // Send code block
      const codeBlock = '```javascript\nconst hello = "world";\nconsole.log(hello);\n```';
      await page1.type('.message-input', codeBlock);
      await page1.keyboard.press('Enter');
      
      await page1.waitForSelector('.message:last-child .code-block');
      
      // Check syntax highlighting
      const hasHighlight = await page1.$('.message:last-child .hljs-keyword');
      expect(hasHighlight).to.not.be.null;
    });
  });
});