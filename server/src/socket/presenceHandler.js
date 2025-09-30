import User from '../models/User.js';

export function setupPresenceHandlers(io, socket) {
  // Update user status
  socket.on('update-status', async (data) => {
    try {
      const { status, customStatus } = data;

      socket.user.status = status;
      
      if (customStatus) {
        socket.user.customStatus = customStatus;
      }

      await User.findByIdAndUpdate(socket.userId, {
        status,
        customStatus,
        lastActive: new Date(),
      });

      // Broadcast to all connected users
      io.emit('user-status-changed', {
        userId: socket.userId,
        status,
        customStatus,
      });
    } catch (error) {
      console.error('Update status error:', error);
    }
  });

  // Update activity
  socket.on('update-activity', async (data) => {
    try {
      const { type, name, details, state, timestamps } = data;

      socket.user.activity = {
        type, // 'playing', 'streaming', 'listening', 'watching'
        name,
        details,
        state,
        timestamps,
      };

      // Broadcast to friends/server members
      socket.broadcast.emit('user-activity-changed', {
        userId: socket.userId,
        activity: socket.user.activity,
      });
    } catch (error) {
      console.error('Update activity error:', error);
    }
  });

  // Typing indicators
  socket.on('typing-start', async (data) => {
    try {
      const { channelId } = data;

      socket.to(`channel:${channelId}`).emit('user-typing', {
        userId: socket.userId,
        username: socket.user.username,
        channelId,
      });

      // Auto-stop typing after 10 seconds
      if (socket.typingTimeout) {
        clearTimeout(socket.typingTimeout);
      }

      socket.typingTimeout = setTimeout(() => {
        socket.to(`channel:${channelId}`).emit('user-stopped-typing', {
          userId: socket.userId,
          channelId,
        });
      }, 10000);
    } catch (error) {
      console.error('Typing start error:', error);
    }
  });

  socket.on('typing-stop', async (data) => {
    try {
      const { channelId } = data;

      if (socket.typingTimeout) {
        clearTimeout(socket.typingTimeout);
        socket.typingTimeout = null;
      }

      socket.to(`channel:${channelId}`).emit('user-stopped-typing', {
        userId: socket.userId,
        channelId,
      });
    } catch (error) {
      console.error('Typing stop error:', error);
    }
  });

  // Get online users
  socket.on('get-online-users', async (data) => {
    try {
      const { userIds } = data;

      const sockets = await io.fetchSockets();
      const onlineUserIds = sockets.map(s => s.userId);

      const onlineUsers = userIds.filter(id => onlineUserIds.includes(id));

      socket.emit('online-users', { users: onlineUsers });
    } catch (error) {
      console.error('Get online users error:', error);
    }
  });

  // Heartbeat
  socket.on('heartbeat', async () => {
    try {
      socket.user.lastHeartbeat = new Date();
      
      await User.findByIdAndUpdate(socket.userId, {
        lastActive: new Date(),
      });

      socket.emit('heartbeat-ack');
    } catch (error) {
      console.error('Heartbeat error:', error);
    }
  });
}