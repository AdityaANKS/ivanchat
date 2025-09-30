import Message from '../models/Message.js';
import Channel from '../models/Channel.js';
import { moderateContent } from '../services/ModerationService.js';
import { translateMessage } from '../services/TranslationService.js';
import { io } from '../index.js';
import { scheduleMessage, cancelScheduledMessage } from '../temporal/client';
import { ScheduledMessage } from '../models/ScheduledMessage';

export const scheduleMessageController = async (req, res) => {
  try {
    const { channelId, content, scheduledAt, recurring } = req.body;
    const userId = req.user.id;

    // Create scheduled message record
    const scheduledMessage = await ScheduledMessage.create({
      channelId,
      userId,
      content,
      scheduledAt,
      recurring,
      status: 'scheduled',
    });

    // Start Temporal workflow
    const workflowId = await scheduleMessage({
      messageId: scheduledMessage._id.toString(),
      channelId,
      userId,
      content,
      scheduledAt: new Date(scheduledAt),
      recurring,
    });

    // Update with workflow ID
    scheduledMessage.workflowId = workflowId;
    await scheduledMessage.save();

    res.json({
      success: true,
      scheduledMessage,
      workflowId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cancelScheduledMessageController = async (req, res) => {
  try {
    const { messageId } = req.params;
    
    const scheduledMessage = await ScheduledMessage.findById(messageId);
    if (!scheduledMessage) {
      return res.status(404).json({ error: 'Scheduled message not found' });
    }

    if (scheduledMessage.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Cancel Temporal workflow
    await cancelScheduledMessage(scheduledMessage.workflowId);

    // Update status
    scheduledMessage.status = 'cancelled';
    await scheduledMessage.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

class MessageController {
  // Get messages
  async getMessages(req, res) {
    try {
      const { channelId } = req.params;
      const { limit = 50, before, after } = req.query;

      const query = { channel: channelId, deleted: false };

      if (before) {
        query._id = { $lt: before };
      } else if (after) {
        query._id = { $gt: after };
      }

      const messages = await Message.find(query)
        .populate('author', 'username avatar status')
        .populate('replyTo')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));

      res.json(messages.reverse());
    } catch (error) {
      console.error('Get messages error:', error);
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  }

  // Send message
  async sendMessage(req, res) {
    try {
      const { channelId } = req.params;
      const { content, attachments, replyTo } = req.body;

      // Check channel access
      const channel = await Channel.findById(channelId);
      if (!channel) {
        return res.status(404).json({ error: 'Channel not found' });
      }

      // Moderate content
      const moderation = await moderateContent(content);
      if (moderation.blocked) {
        return res.status(400).json({
          error: 'Message blocked',
          reason: moderation.reason,
        });
      }

      // Create message
      const message = await Message.create({
        content: moderation.filteredContent || content,
        author: req.user._id,
        channel: channelId,
        attachments,
        replyTo,
      });

      await message.populate('author', 'username avatar status');

      // Translate message
      const translations = await translateMessage(content);
      message.translatedContent = translations;

      // Emit to channel
      io.to(`channel:${channelId}`).emit('new-message', {
        message: message.toObject(),
      });

      // Update channel last message
      channel.lastMessageId = message._id;
      await channel.save();

      res.status(201).json(message);
    } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  }

  // Edit message
  async editMessage(req, res) {
    try {
      const { messageId } = req.params;
      const { content } = req.body;

      const message = await Message.findById(messageId);

      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }

      if (message.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Cannot edit others\' messages' });
      }

      // Moderate edited content
      const moderation = await moderateContent(content);
      if (moderation.blocked) {
        return res.status(400).json({
          error: 'Edit blocked',
          reason: moderation.reason,
        });
      }

      message.content = moderation.filteredContent || content;
      message.edited = true;
      message.editedAt = new Date();
      await message.save();

      io.to(`channel:${message.channel}`).emit('message-updated', {
        messageId,
        content: message.content,
        editedAt: message.editedAt,
      });

      res.json(message);
    } catch (error) {
      console.error('Edit message error:', error);
      res.status(500).json({ error: 'Failed to edit message' });
    }
  }

  // Delete message
  async deleteMessage(req, res) {
    try {
      const { messageId } = req.params;

      const message = await Message.findById(messageId);

      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }

      // Check permissions
      const canDelete = message.author.toString() === req.user._id.toString() ||
                       req.user.roles?.includes('moderator') ||
                       req.user.roles?.includes('admin');

      if (!canDelete) {
        return res.status(403).json({ error: 'Cannot delete this message' });
      }

      message.deleted = true;
      await message.save();

      io.to(`channel:${message.channel}`).emit('message-deleted', {
        messageId,
      });

      res.json({ message: 'Message deleted' });
    } catch (error) {
      console.error('Delete message error:', error);
      res.status(500).json({ error: 'Failed to delete message' });
    }
  }

  // Add reaction
  async addReaction(req, res) {
    try {
      const { messageId } = req.params;
      const { emoji } = req.body;

      const message = await Message.findById(messageId);

      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }

      // Find or create reaction
      let reaction = message.reactions.find(r => r.emoji === emoji);
      
      if (!reaction) {
        reaction = { emoji, users: [] };
        message.reactions.push(reaction);
      }

      // Toggle user's reaction
      const userIndex = reaction.users.indexOf(req.user._id);
      
      if (userIndex > -1) {
        reaction.users.splice(userIndex, 1);
      } else {
        reaction.users.push(req.user._id);
      }

      // Remove reaction if no users
      if (reaction.users.length === 0) {
        message.reactions = message.reactions.filter(r => r.emoji !== emoji);
      }

      await message.save();

      io.to(`channel:${message.channel}`).emit('reaction-updated', {
        messageId,
        emoji,
        users: reaction.users,
      });

      res.json(message);
    } catch (error) {
      console.error('Add reaction error:', error);
      res.status(500).json({ error: 'Failed to add reaction' });
    }
  }

  // Pin message
  async pinMessage(req, res) {
    try {
      const { messageId } = req.params;

      const message = await Message.findById(messageId);

      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }

      message.pinned = !message.pinned;
      await message.save();

      io.to(`channel:${message.channel}`).emit('message-pinned', {
        messageId,
        pinned: message.pinned,
      });

      res.json(message);
    } catch (error) {
      console.error('Pin message error:', error);
      res.status(500).json({ error: 'Failed to pin message' });
    }
  }

  // Search messages
  async searchMessages(req, res) {
    try {
      const { q, channelId, authorId, hasAttachment, before, after, limit = 25 } = req.query;

      const query = { deleted: false };

      if (q) {
        query.$text = { $search: q };
      }

      if (channelId) {
        query.channel = channelId;
      }

      if (authorId) {
        query.author = authorId;
      }

      if (hasAttachment === 'true') {
        query.attachments = { $exists: true, $ne: [] };
      }

      if (before) {
        query.createdAt = { ...query.createdAt, $lt: new Date(before) };
      }

      if (after) {
        query.createdAt = { ...query.createdAt, $gt: new Date(after) };
      }

      const messages = await Message.find(query)
        .populate('author', 'username avatar')
        .populate('channel', 'name')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));

      res.json(messages);
    } catch (error) {
      console.error('Search messages error:', error);
      res.status(500).json({ error: 'Failed to search messages' });
    }
  }
}

export default new MessageController();