// server/routes/admin.js
import express from 'express';
import { isAdmin, isModerator } from '../middleware/roles.js';
import User from '../models/User.js';
import Server from '../models/Server.js';
import Message from '../models/Message.js';
import Report from '../models/Report.js';

const router = express.Router();

// Admin middleware
router.use(isAdmin);

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      users: {
        total: await User.countDocuments(),
        active: await User.countDocuments({ 
          lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }),
        banned: await User.countDocuments({ banned: true }),
        verified: await User.countDocuments({ verified: true }),
      },
      servers: {
        total: await Server.countDocuments(),
        public: await Server.countDocuments({ isPublic: true }),
        verified: await Server.countDocuments({ verified: true }),
      },
      messages: {
        total: await Message.countDocuments(),
        today: await Message.countDocuments({
          createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        }),
        flagged: await Message.countDocuments({ flagged: true }),
      },
      reports: {
        pending: await Report.countDocuments({ status: 'pending' }),
        resolved: await Report.countDocuments({ status: 'resolved' }),
      },
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User management
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 50, search, filter } = req.query;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (filter) {
      switch (filter) {
        case 'banned':
          query.banned = true;
          break;
        case 'verified':
          query.verified = true;
          break;
        case 'moderator':
          query.roles = 'moderator';
          break;
      }
    }
    
    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ban/Unban user
router.post('/users/:userId/ban', async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason, duration } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      {
        banned: true,
        banReason: reason,
        banExpires: duration ? new Date(Date.now() + duration * 1000) : null,
      },
      { new: true }
    );
    
    // Disconnect user from all active sessions
    io.to(userId).emit('banned', { reason, duration });
    
    // Log admin action
    await AdminLog.create({
      admin: req.user._id,
      action: 'ban_user',
      target: userId,
      details: { reason, duration },
    });
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Server management
router.get('/servers', async (req, res) => {
  try {
    const servers = await Server.find()
      .populate('owner', 'username email')
      .sort({ memberCount: -1 });
    
    res.json(servers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Feature flags
router.get('/features', async (req, res) => {
  try {
    const features = await FeatureFlag.find();
    res.json(features);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/features/:featureId', async (req, res) => {
  try {
    const { featureId } = req.params;
    const { enabled, rolloutPercentage } = req.body;
    
    const feature = await FeatureFlag.findByIdAndUpdate(
      featureId,
      { enabled, rolloutPercentage },
      { new: true }
    );
    
    res.json(feature);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reports management
router.get('/reports', async (req, res) => {
  try {
    const reports = await Report.find({ status: 'pending' })
      .populate('reporter', 'username')
      .populate('reported', 'username')
      .sort({ createdAt: -1 });
    
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/reports/:reportId', async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status, action, notes } = req.body;
    
    const report = await Report.findByIdAndUpdate(
      reportId,
      {
        status,
        resolvedBy: req.user._id,
        resolvedAt: new Date(),
        action,
        notes,
      },
      { new: true }
    );
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;