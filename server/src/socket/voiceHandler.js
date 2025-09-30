import Channel from '../models/Channel.js';
import { SpatialAudioService } from '../services/SpatialAudioService.js';

const spatialAudio = new SpatialAudioService();

export function setupVoiceHandlers(io, socket) {
  // Join voice channel
  socket.on('join-voice', async (data) => {
    try {
      const { channelId } = data;

      const channel = await Channel.findById(channelId);
      
      if (!channel || channel.type !== 'voice') {
        return socket.emit('error', { message: 'Invalid voice channel' });
      }

      // Leave current voice channel if in one
      const currentVoice = socket.rooms.find(room => room.startsWith('voice:'));
      if (currentVoice) {
        socket.leave(currentVoice);
        io.to(currentVoice).emit('user-left-voice', {
          userId: socket.userId,
        });
      }

      // Join new voice channel
      socket.join(`voice:${channelId}`);

      // Add to active voice users
      if (!channel.activeVoiceUsers.includes(socket.userId)) {
        channel.activeVoiceUsers.push(socket.userId);
        await channel.save();
      }

      // Get other users in channel
      const voiceUsers = await io.in(`voice:${channelId}`).fetchSockets();
      const peers = voiceUsers
        .filter(s => s.id !== socket.id)
        .map(s => ({
          socketId: s.id,
          userId: s.userId,
          username: s.user.username,
        }));

      // Notify others
      socket.to(`voice:${channelId}`).emit('user-joined-voice', {
        userId: socket.userId,
        username: socket.user.username,
        socketId: socket.id,
      });

      // Send peer list to joining user
      socket.emit('voice-peers', { peers });

      // Initialize spatial audio if enabled
      if (channel.spatialAudio) {
        spatialAudio.createSpace(channelId);
      }
    } catch (error) {
      console.error('Join voice error:', error);
      socket.emit('error', { message: 'Failed to join voice channel' });
    }
  });

  // Leave voice channel
  socket.on('leave-voice', async (data) => {
    try {
      const { channelId } = data;

      socket.leave(`voice:${channelId}`);

      // Remove from active voice users
      const channel = await Channel.findById(channelId);
      if (channel) {
        channel.activeVoiceUsers = channel.activeVoiceUsers.filter(
          userId => userId.toString() !== socket.userId
        );
        await channel.save();
      }

      io.to(`voice:${channelId}`).emit('user-left-voice', {
        userId: socket.userId,
        socketId: socket.id,
      });
    } catch (error) {
      console.error('Leave voice error:', error);
      socket.emit('error', { message: 'Failed to leave voice channel' });
    }
  });

  // WebRTC signaling
  socket.on('voice-signal', async (data) => {
    try {
      const { to, signal } = data;
      
      io.to(to).emit('voice-signal', {
        from: socket.id,
        signal,
      });
    } catch (error) {
      console.error('Voice signal error:', error);
    }
  });

  // Update voice state
  socket.on('voice-state-update', async (data) => {
    try {
      const { muted, deafened, video, streaming } = data;

      socket.user.voiceState = {
        muted,
        deafened,
        video,
        streaming,
      };

      // Notify channel members
      const voiceChannel = Array.from(socket.rooms).find(room => room.startsWith('voice:'));
      
      if (voiceChannel) {
        io.to(voiceChannel).emit('user-voice-state-updated', {
          userId: socket.userId,
          voiceState: socket.user.voiceState,
        });
      }
    } catch (error) {
      console.error('Voice state update error:', error);
    }
  });

  // Spatial audio position update
  socket.on('spatial-position-update', async (data) => {
    try {
      const { channelId, position } = data;

      spatialAudio.updateUserPosition(socket.userId, channelId, position);

      // Get audio adjustments
      const nearbyUsers = spatialAudio.getUsersInRange(socket.userId);

      socket.emit('spatial-audio-update', {
        nearbyUsers,
      });

      // Notify nearby users
      nearbyUsers.forEach(user => {
        io.to(user.socketId).emit('spatial-neighbor-update', {
          userId: socket.userId,
          position,
          distance: user.distance,
        });
      });
    } catch (error) {
      console.error('Spatial position update error:', error);
    }
  });

  // Screen share
  socket.on('start-screen-share', async (data) => {
    try {
      const { channelId } = data;

      socket.to(`voice:${channelId}`).emit('user-started-screen-share', {
        userId: socket.userId,
        username: socket.user.username,
      });
    } catch (error) {
      console.error('Screen share error:', error);
    }
  });

  socket.on('stop-screen-share', async (data) => {
    try {
      const { channelId } = data;

      socket.to(`voice:${channelId}`).emit('user-stopped-screen-share', {
        userId: socket.userId,
      });
    } catch (error) {
      console.error('Stop screen share error:', error);
    }
  });
}