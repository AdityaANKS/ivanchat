import User from '../models/User.js';
import UserGamification from '../models/UserGamification.js';
import StorageService from '../services/StorageService.js';

class UserController {
  // Get user profile
  async getProfile(req, res) {
    try {
      const { userId } = req.params;
      
      const user = await User.findById(userId || req.user._id)
        .select('-password -email -refreshTokens')
        .populate('badges')
        .populate('servers', 'name icon');

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get gamification data
      const gamification = await UserGamification.findOne({ user: user._id });

      res.json({
        ...user.toObject(),
        gamification,
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }

  // Update profile
  async updateProfile(req, res) {
    try {
      const updates = req.body;
      const allowedUpdates = ['username', 'bio', 'status', 'customStatus', 'theme'];
      
      const filteredUpdates = {};
      allowedUpdates.forEach(field => {
        if (updates[field] !== undefined) {
          filteredUpdates[field] = updates[field];
        }
      });

      const user = await User.findByIdAndUpdate(
        req.user._id,
        filteredUpdates,
        { new: true }
      ).select('-password -refreshTokens');

      res.json(user);
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }

  // Update avatar
  async updateAvatar(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const result = await StorageService.uploadImage(req.file, 'avatars', {
        sizes: [
          { name: 'small', width: 64, height: 64 },
          { name: 'medium', width: 128, height: 128 },
          { name: 'large', width: 256, height: 256 },
        ],
        public: true,
      });

      req.user.avatar = result.medium.url;
      req.user.avatarVersions = result;
      await req.user.save();

      res.json({
        message: 'Avatar updated successfully',
        avatar: result.medium.url,
      });
    } catch (error) {
      console.error('Update avatar error:', error);
      res.status(500).json({ error: 'Failed to update avatar' });
    }
  }

  // Get user settings
  async getSettings(req, res) {
    try {
      const user = await User.findById(req.user._id)
        .select('settings theme notifications privacy');

      res.json(user.settings || {});
    } catch (error) {
      console.error('Get settings error:', error);
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  }

  // Update settings
  async updateSettings(req, res) {
    try {
      const { settings } = req.body;

      req.user.settings = {
        ...req.user.settings,
        ...settings,
      };
      await req.user.save();

      res.json(req.user.settings);
    } catch (error) {
      console.error('Update settings error:', error);
      res.status(500).json({ error: 'Failed to update settings' });
    }
  }

  // Block user
  async blockUser(req, res) {
    try {
      const { userId } = req.params;

      if (userId === req.user._id.toString()) {
        return res.status(400).json({ error: 'Cannot block yourself' });
      }

      if (!req.user.blockedUsers) {
        req.user.blockedUsers = [];
      }

      if (!req.user.blockedUsers.includes(userId)) {
        req.user.blockedUsers.push(userId);
        await req.user.save();
      }

      res.json({ message: 'User blocked' });
    } catch (error) {
      console.error('Block user error:', error);
      res.status(500).json({ error: 'Failed to block user' });
    }
  }

  // Unblock user
  async unblockUser(req, res) {
    try {
      const { userId } = req.params;

      req.user.blockedUsers = req.user.blockedUsers.filter(
        id => id.toString() !== userId
      );
      await req.user.save();

      res.json({ message: 'User unblocked' });
    } catch (error) {
      console.error('Unblock user error:', error);
      res.status(500).json({ error: 'Failed to unblock user' });
    }
  }

  // Get user's servers
  async getUserServers(req, res) {
    try {
      const servers = await Server.find({
        'members.user': req.user._id,
      })
        .select('name icon description memberCount')
        .sort({ 'members.joinedAt': -1 });

      res.json(servers);
    } catch (error) {
      console.error('Get user servers error:', error);
      res.status(500).json({ error: 'Failed to fetch servers' });
    }
  }

  // Get user activity
  async getUserActivity(req, res) {
    try {
      const { userId } = req.params;
      const { limit = 20 } = req.query;

      const messages = await Message.find({
        author: userId || req.user._id,
        deleted: false,
      })
        .populate('channel', 'name')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));

      res.json(messages);
    } catch (error) {
      console.error('Get user activity error:', error);
      res.status(500).json({ error: 'Failed to fetch activity' });
    }
  }
}

export default new UserController();