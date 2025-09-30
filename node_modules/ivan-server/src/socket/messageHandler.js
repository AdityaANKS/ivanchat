import Message from '../models/Message.js';
import Channel from '../models/Channel.js';
import { moderateContent } from '../services/ModerationService.js';
import { translateMessage } from '../services/TranslationService.js';

export function setupMessageHandlers(io, socket) {
  // Send message
  socket.on('send-message', async (data) => {
    try {
      const { channelId, content, attachments, replyTo } = data;

      // Validate channel access
      const channel = await Channel.findById(channelId);
      if (!channel) {
        return socket.emit('error', { message: 'Channel not found' });
      }

      // Moderate content
      const moderation = await moderateContent(content);
      if (moderation.blocked) {
        return socket.emit('message-blocked', {
          reason: moderation.reason,
        });
      }

      // Create message
      const message = new Message({
        content: moderation.filteredContent || content,
        author: socket.userId,
        channel: channelId,
        attachments,
        replyTo,
      });

      await message.save();
      await message.populate('author', 'username avatar status');

      // Auto-translate
      const translations = await translateMessage(content);
      message.translatedContent = translations;

      // Emit to channel members
      io.to(`channel:${channelId}`).emit('new-message', {
        message: message.toObject(),
      });

      // Update channel's last message
      channel.lastMessageId = message._id;
      await channel.save();

      // Track analytics
      socket.emit('message-sent', { messageId: message._id });
    } catch (error) {
      console.error('Send message error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Edit message
  socket.on('edit-message', async (data) => {
    try {
      const { messageId, content } = data;

      const message = await Message.findById(messageId);
      
      if (!message) {
        return socket.emit('error', { message: 'Message not found' });
      }

      if (message.author.toString() !== socket.userId) {
        return socket.emit('error', { message: 'Cannot edit others\' messages' });
      }

      // Moderate edited content
      const moderation = await moderateContent(content);
      if (moderation.blocked) {
        return socket.emit('edit-blocked', {
          reason: moderation.reason,
        });
      }

      message.content = moderation.filteredContent || content;
      message.edited = true;
      message.editedAt = new Date();
      await message.save();

      io.to(`channel:${message.channel}`).emit('message-edited', {
        messageId,
        content: message.content,
        editedAt: message.editedAt,
      });
    } catch (error) {
      console.error('Edit message error:', error);
      socket.emit('error', { message: 'Failed to edit message' });
    }
  });

  // Delete message
  socket.on('delete-message', async (data) => {
    try {
      const { messageId } = data;

      const message = await Message.findById(messageId);
      
      if (!message) {
        return socket.emit('error', { message: 'Message not found' });
      }

      // Check permissions
      const canDelete = message.author.toString() === socket.userId ||
                       socket.user.roles?.includes('moderator');

      if (!canDelete) {
        return socket.emit('error', { message: 'Cannot delete this message' });
      }

      message.deleted = true;
      await message.save();

      io.to(`channel:${message.channel}`).emit('message-deleted', {
        messageId,
      });
    } catch (error) {
      console.error('Delete message error:', error);
      socket.emit('error', { message: 'Failed to delete message' });
    }
  });

  // Add reaction
  socket.on('add-reaction', async (data) => {
    try {
      const { messageId, emoji } = data;

      const message = await Message.findById(messageId);
      
      if (!message) {
        return socket.emit('error', { message: 'Message not found' });
      }

      let reaction = message.reactions.find(r => r.emoji === emoji);
      
      if (!reaction) {
        reaction = { emoji, users: [] };
        message.reactions.push(reaction);
      }

      const userIndex = reaction.users.indexOf(socket.userId);
      
      if (userIndex > -1) {
        reaction.users.splice(userIndex, 1);
      } else {
        reaction.users.push(socket.userId);
      }

      if (reaction.users.length === 0) {
        message.reactions = message.reactions.filter(r => r.emoji !== emoji);
      }

      await message.save();

      io.to(`channel:${message.channel}`).emit('reaction-updated', {
        messageId,
        emoji,
        users: reaction.users,
      });
    } catch (error) {
      console.error('Add reaction error:', error);
      socket.emit('error', { message: 'Failed to add reaction' });
    }
  });

  // Start thread
  socket.on('start-thread', async (data) => {
    try {
      const { messageId, name } = data;

      const message = await Message.findById(messageId);
      
      if (!message || message.thread) {
        return socket.emit('error', { message: 'Cannot create thread' });
      }

      const thread = await Thread.create({
        name,
        parentChannel: message.channel,
        parentMessage: messageId,
        creator: socket.userId,
        members: [{ user: socket.userId }],
      });

      message.thread = thread._id;
      await message.save();

      io.to(`channel:${message.channel}`).emit('thread-created', {
        thread: thread.toObject(),
        messageId,
      });
    } catch (error) {
      console.error('Start thread error:', error);
      socket.emit('error', { message: 'Failed to create thread' });
    }
  });
}