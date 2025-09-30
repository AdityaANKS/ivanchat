import Server from '../models/Server.js';
import Channel from '../models/Channel.js';
import Role from '../models/Role.js';
import { generateInviteCode } from '../utils/helpers.js';

class ServerController {
  // Get server
  async getServer(req, res) {
    try {
      const { serverId } = req.params;

      const server = await Server.findById(serverId)
        .populate('owner', 'username avatar')
        .populate('channels')
        .populate('roles')
        .populate('members.user', 'username avatar status');

      if (!server) {
        return res.status(404).json({ error: 'Server not found' });
      }

      res.json(server);
    } catch (error) {
      console.error('Get server error:', error);
      res.status(500).json({ error: 'Failed to fetch server' });
    }
  }

  // Create server
  async createServer(req, res) {
    try {
      const { name, description, icon, isPublic } = req.body;

      const server = await Server.create({
        name,
        description,
        icon,
        owner: req.user._id,
        isPublic,
        members: [{
          user: req.user._id,
          joinedAt: new Date(),
          roles: [],
        }],
      });

      // Create default role
      const everyoneRole = await Role.create({
        name: '@everyone',
        server: server._id,
        isDefault: true,
        position: 0,
      });

      // Create default channels
      const generalChannel = await Channel.create({
        name: 'general',
        type: 'text',
        server: server._id,
        position: 0,
      });

      const voiceChannel = await Channel.create({
        name: 'General Voice',
        type: 'voice',
        server: server._id,
        position: 1,
      });

      server.roles.push(everyoneRole._id);
      server.channels.push(generalChannel._id, voiceChannel._id);
      server.systemChannel = generalChannel._id;
      await server.save();

      res.status(201).json(server);
    } catch (error) {
      console.error('Create server error:', error);
      res.status(500).json({ error: 'Failed to create server' });
    }
  }

  // Update server
  async updateServer(req, res) {
    try {
      const { serverId } = req.params;
      const updates = req.body;

      const server = await Server.findById(serverId);

      if (!server) {
        return res.status(404).json({ error: 'Server not found' });
      }

      if (server.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      Object.assign(server, updates);
      await server.save();

      res.json(server);
    } catch (error) {
      console.error('Update server error:', error);
      res.status(500).json({ error: 'Failed to update server' });
    }
  }

  // Delete server
  async deleteServer(req, res) {
    try {
      const { serverId } = req.params;

      const server = await Server.findById(serverId);

      if (!server) {
        return res.status(404).json({ error: 'Server not found' });
      }

      if (server.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      // Delete all channels
      await Channel.deleteMany({ server: serverId });

      // Delete all roles
      await Role.deleteMany({ server: serverId });

      await server.remove();

      res.json({ message: 'Server deleted' });
    } catch (error) {
      console.error('Delete server error:', error);
      res.status(500).json({ error: 'Failed to delete server' });
    }
  }

  // Join server
  async joinServer(req, res) {
    try {
      const { inviteCode } = req.params;

      const server = await Server.findOne({
        'invites.code': inviteCode,
      });

      if (!server) {
        return res.status(404).json({ error: 'Invalid invite code' });
      }

      // Check if already a member
      const isMember = server.members.some(
        m => m.user.toString() === req.user._id.toString()
      );

      if (isMember) {
        return res.status(400).json({ error: 'Already a member' });
      }

      // Add member
      server.members.push({
        user: req.user._id,
        joinedAt: new Date(),
        roles: [],
      });

      // Update invite uses
      const invite = server.invites.find(i => i.code === inviteCode);
      if (invite) {
        invite.uses++;
      }

      await server.save();

      res.json({ message: 'Joined server successfully', server });
    } catch (error) {
      console.error('Join server error:', error);
      res.status(500).json({ error: 'Failed to join server' });
    }
  }

  // Leave server
  async leaveServer(req, res) {
    try {
      const { serverId } = req.params;

      const server = await Server.findById(serverId);

      if (!server) {
        return res.status(404).json({ error: 'Server not found' });
      }

      if (server.owner.toString() === req.user._id.toString()) {
        return res.status(400).json({ error: 'Owner cannot leave server' });
      }

      server.members = server.members.filter(
        m => m.user.toString() !== req.user._id.toString()
      );

      await server.save();

      res.json({ message: 'Left server successfully' });
    } catch (error) {
      console.error('Leave server error:', error);
      res.status(500).json({ error: 'Failed to leave server' });
    }
  }

  // Create invite
  async createInvite(req, res) {
    try {
      const { serverId } = req.params;
      const { maxUses, maxAge, temporary } = req.body;

      const server = await Server.findById(serverId);

      if (!server) {
        return res.status(404).json({ error: 'Server not found' });
      }

      const invite = {
        code: generateInviteCode(),
        creator: req.user._id,
        uses: 0,
        maxUses,
        maxAge,
        temporary,
        createdAt: new Date(),
      };

      if (maxAge) {
        invite.expiresAt = new Date(Date.now() + maxAge * 1000);
      }

      server.invites.push(invite);
      await server.save();

      res.json(invite);
    } catch (error) {
      console.error('Create invite error:', error);
      res.status(500).json({ error: 'Failed to create invite' });
    }
  }
}

export default new ServerController();