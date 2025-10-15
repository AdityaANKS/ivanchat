const express = require('express');
const authRoutes = require('./auth.js');
const userRoutes = require('./users.js');
const serverRoutes = require('./servers.js');
const channelRoutes = require('./channels.js');
const messageRoutes = require('./messages.js');
const adminRoutes = require('./admin.js');
const webhookRoutes = require('./webhooks.js');
const marketplaceRoutes = require('./marketplace.js');
const uploadRoutes = require('./upload.js');
const aiRoutes = require('./ai.js');
const analyticsRoutes = require('./analytics.js');
const discoveryRoutes = require('./discovery.js');

const router = express.Router();

// Public routes
router.use('/auth', authRoutes);
router.use('/discovery', discoveryRoutes);

// Protected routes (add auth middleware as needed)
router.use('/users', userRoutes);
router.use('/servers', serverRoutes);
router.use('/channels', channelRoutes);
router.use('/messages', messageRoutes);
router.use('/upload', uploadRoutes);
router.use('/ai', aiRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/marketplace', marketplaceRoutes);

// Admin routes
router.use('/admin', adminRoutes);

// API info
router.get('/', (req, res) => {
  res.json({
    name: 'Ivan Chat API',
    version: '1.0.0',
    status: 'operational',
    documentation: '/api/docs',
  });
});

module.exports = router;