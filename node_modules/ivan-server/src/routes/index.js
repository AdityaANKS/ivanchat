import express from 'express';
import authRoutes from './auth.js';
import userRoutes from './users.js';
import serverRoutes from './servers.js';
import channelRoutes from './channels.js';
import messageRoutes from './messages.js';
import adminRoutes from './admin.js';
import webhookRoutes from './webhooks.js';
import marketplaceRoutes from './marketplace.js';
import uploadRoutes from './upload.js';
import aiRoutes from './ai.js';
import analyticsRoutes from './analytics.js';
import discoveryRoutes from './discovery.js';

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

export default router;