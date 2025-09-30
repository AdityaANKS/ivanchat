// server/socket/handlers.js
import jwt from 'jsonwebtoken';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { translateMessage } from '../services/translationService.js';
import { moderateContent } from '../services/ModerationService.js';

export function setupSocketHandlers(io) {
  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`User ${socket.user.username} connected`);

    // Update user status
    await User.findByIdAndUpdate(socket.userId, {
      status: 'online',
      lastActive: new Date(),
    });

    // Join user's channels
    socket.on('join-channels', async (channelIds) => {
      for (const channelId of channelIds) {
        socket.join(`channel:${channelId}`);
      }
    });

    // Handle sending messages
    socket.on('send-message', async (data) => {
      try {
        const { channelId, content, attachments, replyTo } = data;

        // Content moderation
        const moderationResult = await moderateContent(content);
        if (moderationResult.blocked) {
          socket.emit('message-blocked', {
            reason: moderationResult.reason,
          });
          return;
        }

        // Create message
        const message = new Message({
          content: moderationResult.filteredContent || content,
          author: socket.userId,
          channel: channelId,
          attachments,
          replyTo,
        });

        await message.save();
        await message.populate('author', 'username avatar');

        // Auto-translate for users with different languages
        const translatedVersions = await translateMessage(content);
        message.translatedContent = translatedVersions;

        // Emit to channel members
        io.to(`channel:${channelId}`).emit('new-message', {
          message: message.toObject(),
          translations: translatedVersions,
        });

        // Update channel's last message
        await Channel.findByIdAndUpdate(channelId, {
          lastMessageId: message._id,
        });
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle message reactions
    socket.on('add-reaction', async (data) => {
      const { messageId, emoji } = data;
      
      await Message.findByIdAndUpdate(
        messageId,
        {
          $addToSet: {
            [`reactions.${emoji}.users`]: socket.userId,
          },
        },
        { upsert: true }
      );

      io.to(`message:${messageId}`).emit('reaction-added', {
        messageId,
        emoji,
        userId: socket.userId,
      });
    });

    // Handle typing indicators
    socket.on('typing-start', ({ channelId }) => {
      socket.to(`channel:${channelId}`).emit('user-typing', {
        userId: socket.userId,
        username: socket.user.username,
        channelId,
      });
    });

    socket.on('typing-stop', ({ channelId }) => {
      socket.to(`channel:${channelId}`).emit('user-stopped-typing', {
        userId: socket.userId,
        channelId,
      });
    });

    // Voice channel handling
    socket.on('join-voice', async ({ channelId }) => {
      socket.join(`voice:${channelId}`);
      socket.to(`voice:${channelId}`).emit('user-joined-voice', {
        userId: socket.userId,
        username: socket.user.username,
      });
    });

    socket.on('voice-signal', ({ channelId, signal, to }) => {
      io.to(to).emit('voice-signal', {
        signal,
        from: socket.userId,
      });
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log(`User ${socket.user.username} disconnected`);
      
      await User.findByIdAndUpdate(socket.userId, {
        status: 'offline',
        lastActive: new Date(),
      });

      // Notify channels of user going offline
      io.emit('user-status-changed', {
        userId: socket.userId,
        status: 'offline',
      });
    });
  });
}