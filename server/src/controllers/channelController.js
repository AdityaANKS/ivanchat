import Channel from '../models/Channel.js';
import Server from '../models/Server.js';
import Message from '../models/Message.js';
import { io } from '../index.js';

class ChannelController {
  // Get channel
  async getChannel(req, res) {
    try {
      const { channelId } = req.params;

      const channel = await Channel.findById(channelId)
        .populate('server', 'name icon')
        .populate('category', 'name');

      if (!channel) {
        return res.status(404).json({ error: 'Channel not found' });
      }

      res.json(channel);
    } catch (error) {
      console.error('Get channel error:', error);
      res.status(500).json({ error: 'Failed to fetch channel' });
    }
  }

  // Create channel
  async createChannel(req, res) {
    try {
      const { serverId } = req.params;
      const { name, type, category, isPrivate, topic } = req.body;

      // Check server ownership or admin
      const server = await Server.findById(serverId);
      
      if (!server) {
        return res.status(404).json({ error: 'Server not found' });
      }

      if (server.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const channel = await Channel.create({
        name,
        type: type || 'text',
        server: serverId,
        category,
        isPrivate,
        topic,
      });

      // Add channel to server
      server.channels.push(channel._id);
      await server.save();

      // Notify server members
      io.to(`server:${serverId}`).emit('channel-created', {
        channel: channel.toObject(),
      });

      res.status(201).json(channel);
    } catch (error) {
      console.error('Create channel error:', error);
      res.status(500).json({ error: 'Failed to create channel' });
    }
  }

  // Update channel
  async updateChannel(req, res) {
    try {
      const { channelId } = req.params;
      const updates = req.body;

      const channel = await Channel.findByIdAndUpdate(
        channelId,
        updates,
        { new: true }
      );

      if (!channel) {
        return res.status(404).json({ error: 'Channel not found' });
      }

      io.to(`channel:${channelId}`).emit('channel-updated', {
        channel: channel.toObject(),
      });

      res.json(channel);
    } catch (error) {
      console.error('Update channel error:', error);
      res.status(500).json({ error: 'Failed to update channel' });
    }
  }

  // Delete channel
  async deleteChannel(req, res) {
    try {
      const { channelId } = req.params;

      const channel = await Channel.findById(channelId);

      if (!channel) {
        return res.status(404).json({ error: 'Channel not found' });
      }

      // Remove from server
      await Server.findByIdAndUpdate(channel.server, {
        $pull: { channels: channelId },
      });

      // Delete all messages in channel
      await Message.deleteMany({ channel: channelId });

      await channel.remove();

      io.to(`server:${channel.server}`).emit('channel-deleted', {
        channelId,
      });

      res.json({ message: 'Channel deleted' });
    } catch (error) {
      console.error('Delete channel error:', error);
      res.status(500).json({ error: 'Failed to delete channel' });
    }
  }

  // Get channel members
  async getChannelMembers(req, res) {
    try {
      const { channelId } = req.params;

      const channel = await Channel.findById(channelId)
        .populate({
          path: 'server',
          populate: {
            path: 'members.user',
            select: 'username avatar status',
          },
        });

      if (!channel) {
        return res.status(404).json({ error: 'Channel not found' });
      }

      res.json(channel.server.members);
    } catch (error) {
      console.error('Get channel members error:', error);
      res.status(500).json({ error: 'Failed to fetch members' });
    }
  }

  // Join voice channel
  async joinVoiceChannel(req, res) {
    try {
      const { channelId } = req.params;

      const channel = await Channel.findById(channelId);

      if (!channel || channel.type !== 'voice') {
        return res.status(404).json({ error: 'Voice channel not found' });
      }

      // Add user to active voice users
      if (!channel.activeVoiceUsers.includes(req.user._id)) {
        channel.activeVoiceUsers.push(req.user._id);
        await channel.save();
      }

      io.to(`server:${channel.server}`).emit('user-joined-voice', {
        channelId,
        userId: req.user._id,
        username: req.user.username,
      });

      res.json({ message: 'Joined voice channel' });
    } catch (error) {
      console.error('Join voice channel error:', error);
      res.status(500).json({ error: 'Failed to join voice channel' });
    }
  }

  // Leave voice channel
  async leaveVoiceChannel(req, res) {
    try {
      const { channelId } = req.params;

      const channel = await Channel.findById(channelId);

      if (!channel) {
        return res.status(404).json({ error: 'Channel not found' });
      }

      // Remove user from active voice users
      channel.activeVoiceUsers = channel.activeVoiceUsers.filter(
        userId => userId.toString() !== req.user._id.toString()
      );
      await channel.save();

      io.to(`server:${channel.server}`).emit('user-left-voice', {
        channelId,
        userId: req.user._id,
      });

      res.json({ message: 'Left voice channel' });
    } catch (error) {
      console.error('Leave voice channel error:', error);
      res.status(500).json({ error: 'Failed to leave voice channel' });
    }
  }
}

export default new ChannelController();