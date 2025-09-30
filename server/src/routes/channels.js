const express = require('express');
const router = express.Router();

// Middleware
const { authenticate, optionalAuth } = require('../middleware/auth');
const { checkRole, checkPermission } = require('../middleware/roles');
const { validate } = require('../middleware/validation');
const { rateLimiter } = require('../middleware/rateLimiter');

// Controllers
const {
  createChannel,
  getChannel,
  updateChannel,
  deleteChannel,
  getChannelMessages,
  getChannelMembers,
  joinChannel,
  leaveChannel,
  inviteToChannel,
  kickFromChannel,
  updateMemberRole,
  getChannelInvites,
  createChannelInvite,
  deleteChannelInvite,
  updateChannelPermissions,
  getChannelPermissions,
  pinMessage,
  unpinMessage,
  getPinnedMessages,
  startTyping,
  stopTyping,
  markAsRead,
  muteChannel,
  archiveChannel,
  searchChannelMessages,
  getChannelStats,
  createThread,
  getThreads,
  createForumPost,
  getForumPosts,
  getChannelWebhooks,
  createChannelWebhook,
  updateChannelWebhook,
  deleteChannelWebhook,
  getVoiceChannelUsers,
  updateVoiceState,
  moveUserToVoiceChannel,
  setChannelSlowMode,
  createChannelCategory,
  updateChannelPosition,
  bulkDeleteMessages,
  exportChannelData,
  getChannelAuditLog
} = require('../controllers/channelController');

// Validation schemas
const {
  createChannelSchema,
  updateChannelSchema,
  channelIdSchema,
  inviteSchema,
  permissionSchema,
  messageQuerySchema,
  threadSchema,
  forumPostSchema,
  webhookSchema,
  voiceStateSchema
} = require('../utils/validators');

// ========================
// Public/Discovery Routes
// ========================

// Get public/discoverable channels
router.get('/discover',
  optionalAuth,
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }),
  async (req, res, next) => {
    try {
      const { category, sort, limit = 20, offset = 0, search } = req.query;
      const channels = await require('../services/DiscoveryService')
        .getDiscoverableChannels({
          category,
          sort,
          limit: Math.min(limit, 50),
          offset,
          search,
          userId: req.user?.id
        });
      res.json(channels);
    } catch (error) {
      next(error);
    }
  }
);

// Get trending channels
router.get('/trending',
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }),
  async (req, res, next) => {
    try {
      const channels = await require('../services/DiscoveryService')
        .getTrendingChannels();
      res.json(channels);
    } catch (error) {
      next(error);
    }
  }
);

// ========================
// Server Channel Routes (Nested under server)
// ========================

// Get all channels in a server
router.get('/server/:serverId',
  authenticate,
  validate(params('serverId').isMongoId()),
  async (req, res, next) => {
    try {
      const channels = await require('../controllers/channelController')
        .getServerChannels(req.params.serverId, req.user.id);
      res.json(channels);
    } catch (error) {
      next(error);
    }
  }
);

// Create a new channel in a server
router.post('/server/:serverId',
  authenticate,
  checkPermission('MANAGE_CHANNELS'),
  validate(createChannelSchema),
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }),
  createChannel
);

// Create channel category
router.post('/server/:serverId/category',
  authenticate,
  checkPermission('MANAGE_CHANNELS'),
  validate(body('name').isString().isLength({ min: 1, max: 100 })),
  createChannelCategory
);

// Update channel positions/order
router.patch('/server/:serverId/positions',
  authenticate,
  checkPermission('MANAGE_CHANNELS'),
  validate(body('channels').isArray()),
  updateChannelPosition
);

// ========================
// Individual Channel Routes
// ========================

// Get channel details
router.get('/:channelId',
  authenticate,
  validate(channelIdSchema),
  getChannel
);

// Update channel
router.patch('/:channelId',
  authenticate,
  checkPermission('MANAGE_CHANNELS'),
  validate(updateChannelSchema),
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }),
  updateChannel
);

// Delete channel
router.delete('/:channelId',
  authenticate,
  checkPermission('MANAGE_CHANNELS'),
  validate(channelIdSchema),
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 5 }),
  deleteChannel
);

// Archive/Unarchive channel
router.patch('/:channelId/archive',
  authenticate,
  checkPermission('MANAGE_CHANNELS'),
  validate(channelIdSchema),
  archiveChannel
);

// ========================
// Channel Messages
// ========================

// Get channel messages
router.get('/:channelId/messages',
  authenticate,
  validate(channelIdSchema),
  validate(messageQuerySchema),
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 60 }),
  getChannelMessages
);

// Search messages in channel
router.get('/:channelId/messages/search',
  authenticate,
  validate(channelIdSchema),
  validate(query('q').isString().isLength({ min: 2, max: 100 })),
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 30 }),
  searchChannelMessages
);

// Bulk delete messages
router.post('/:channelId/messages/bulk-delete',
  authenticate,
  checkPermission('MANAGE_MESSAGES'),
  validate(body('messageIds').isArray().isLength({ min: 2, max: 100 })),
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 5 }),
  bulkDeleteMessages
);

// Get pinned messages
router.get('/:channelId/pins',
  authenticate,
  validate(channelIdSchema),
  getPinnedMessages
);

// Pin a message
router.put('/:channelId/pins/:messageId',
  authenticate,
  checkPermission('MANAGE_MESSAGES'),
  validate(params('messageId').isMongoId()),
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }),
  pinMessage
);

// Unpin a message
router.delete('/:channelId/pins/:messageId',
  authenticate,
  checkPermission('MANAGE_MESSAGES'),
  validate(params('messageId').isMongoId()),
  unpinMessage
);

// ========================
// Channel Members
// ========================

// Get channel members
router.get('/:channelId/members',
  authenticate,
  validate(channelIdSchema),
  getChannelMembers
);

// Join public channel
router.post('/:channelId/join',
  authenticate,
  validate(channelIdSchema),
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }),
  joinChannel
);

// Leave channel
router.post('/:channelId/leave',
  authenticate,
  validate(channelIdSchema),
  leaveChannel
);

// Kick member from channel
router.delete('/:channelId/members/:userId',
  authenticate,
  checkPermission('KICK_MEMBERS'),
  validate(params('userId').isMongoId()),
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }),
  kickFromChannel
);

// Update member role in channel
router.patch('/:channelId/members/:userId/role',
  authenticate,
  checkPermission('MANAGE_ROLES'),
  validate(body('roleId').isMongoId()),
  updateMemberRole
);

// ========================
// Channel Permissions
// ========================

// Get channel permissions
router.get('/:channelId/permissions',
  authenticate,
  validate(channelIdSchema),
  getChannelPermissions
);

// Update channel permissions
router.put('/:channelId/permissions/:targetId',
  authenticate,
  checkPermission('MANAGE_ROLES'),
  validate(permissionSchema),
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }),
  updateChannelPermissions
);

// Delete channel permission overwrite
router.delete('/:channelId/permissions/:targetId',
  authenticate,
  checkPermission('MANAGE_ROLES'),
  validate(params('targetId').isMongoId()),
  async (req, res, next) => {
    try {
      await require('../controllers/channelController')
        .deleteChannelPermission(req.params.channelId, req.params.targetId, req.user.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

// ========================
// Channel Invites
// ========================

// Get channel invites
router.get('/:channelId/invites',
  authenticate,
  checkPermission('MANAGE_CHANNELS'),
  validate(channelIdSchema),
  getChannelInvites
);

// Create channel invite
router.post('/:channelId/invites',
  authenticate,
  checkPermission('CREATE_INVITES'),
  validate(inviteSchema),
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }),
  createChannelInvite
);

// Delete channel invite
router.delete('/:channelId/invites/:inviteCode',
  authenticate,
  checkPermission('MANAGE_CHANNELS'),
  validate(params('inviteCode').isString()),
  deleteChannelInvite
);

// Use invite code to join
router.post('/invite/:inviteCode',
  authenticate,
  validate(params('inviteCode').isString()),
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 5 }),
  async (req, res, next) => {
    try {
      const result = await require('../controllers/channelController')
        .useInvite(req.params.inviteCode, req.user.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// ========================
// Voice Channels
// ========================

// Get voice channel users
router.get('/:channelId/voice/users',
  authenticate,
  validate(channelIdSchema),
  getVoiceChannelUsers
);

// Update voice state (mute, deafen, etc.)
router.patch('/:channelId/voice/state',
  authenticate,
  validate(voiceStateSchema),
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 30 }),
  updateVoiceState
);

// Move user to different voice channel
router.post('/:channelId/voice/move/:userId',
  authenticate,
  checkPermission('MOVE_MEMBERS'),
  validate(params('userId').isMongoId()),
  validate(body('targetChannelId').isMongoId()),
  moveUserToVoiceChannel
);

// Request to speak (for stage channels)
router.post('/:channelId/voice/request-speak',
  authenticate,
  validate(channelIdSchema),
  async (req, res, next) => {
    try {
      await require('../controllers/channelController')
        .requestToSpeak(req.params.channelId, req.user.id);
      res.json({ message: 'Request sent' });
    } catch (error) {
      next(error);
    }
  }
);

// ========================
// Threads & Forums
// ========================

// Get threads in channel
router.get('/:channelId/threads',
  authenticate,
  validate(channelIdSchema),
  validate(query('archived').optional().isBoolean()),
  getThreads
);

// Create thread
router.post('/:channelId/threads',
  authenticate,
  validate(threadSchema),
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 5 }),
  createThread
);

// Get forum posts
router.get('/:channelId/forum-posts',
  authenticate,
  validate(channelIdSchema),
  validate(query('sort').optional().isIn(['latest', 'top', 'unanswered'])),
  getForumPosts
);

// Create forum post
router.post('/:channelId/forum-posts',
  authenticate,
  validate(forumPostSchema),
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 5 }),
  createForumPost
);

// ========================
// Channel Settings
// ========================

// Set slow mode
router.patch('/:channelId/slowmode',
  authenticate,
  checkPermission('MANAGE_CHANNELS'),
  validate(body('seconds').isInt({ min: 0, max: 21600 })),
  setChannelSlowMode
);

// Mute/unmute channel for user
router.patch('/:channelId/mute',
  authenticate,
  validate(body('muted').isBoolean()),
  validate(body('duration').optional().isInt()),
  muteChannel
);

// Mark channel as read
router.post('/:channelId/read',
  authenticate,
  validate(channelIdSchema),
  markAsRead
);

// ========================
// Typing Indicators
// ========================

// Start typing
router.post('/:channelId/typing',
  authenticate,
  validate(channelIdSchema),
  rateLimiter({ windowMs: 10 * 1000, max: 10 }),
  startTyping
);

// Stop typing
router.delete('/:channelId/typing',
  authenticate,
  validate(channelIdSchema),
  stopTyping
);

// ========================
// Webhooks
// ========================

// Get channel webhooks
router.get('/:channelId/webhooks',
  authenticate,
  checkPermission('MANAGE_WEBHOOKS'),
  validate(channelIdSchema),
  getChannelWebhooks
);

// Create webhook
router.post('/:channelId/webhooks',
  authenticate,
  checkPermission('MANAGE_WEBHOOKS'),
  validate(webhookSchema),
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 5 }),
  createChannelWebhook
);

// Update webhook
router.patch('/:channelId/webhooks/:webhookId',
  authenticate,
  checkPermission('MANAGE_WEBHOOKS'),
  validate(params('webhookId').isMongoId()),
  updateChannelWebhook
);

// Delete webhook
router.delete('/:channelId/webhooks/:webhookId',
  authenticate,
  checkPermission('MANAGE_WEBHOOKS'),
  validate(params('webhookId').isMongoId()),
  deleteChannelWebhook
);

// ========================
// Analytics & Moderation
// ========================

// Get channel statistics
router.get('/:channelId/stats',
  authenticate,
  checkPermission('VIEW_ANALYTICS'),
  validate(channelIdSchema),
  getChannelStats
);

// Get channel audit log
router.get('/:channelId/audit-log',
  authenticate,
  checkPermission('VIEW_AUDIT_LOG'),
  validate(channelIdSchema),
  validate(query('limit').optional().isInt({ min: 1, max: 100 })),
  getChannelAuditLog
);

// Export channel data
router.post('/:channelId/export',
  authenticate,
  checkPermission('MANAGE_CHANNELS'),
  validate(channelIdSchema),
  validate(body('format').optional().isIn(['json', 'csv', 'txt'])),
  rateLimiter({ windowMs: 60 * 60 * 1000, max: 2 }),
  exportChannelData
);

// ========================
// Live Features
// ========================

// Start live streaming in voice channel
router.post('/:channelId/stream/start',
  authenticate,
  validate(channelIdSchema),
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 2 }),
  async (req, res, next) => {
    try {
      const stream = await require('../controllers/channelController')
        .startStream(req.params.channelId, req.user.id, req.body);
      res.json(stream);
    } catch (error) {
      next(error);
    }
  }
);

// Stop live streaming
router.post('/:channelId/stream/stop',
  authenticate,
  validate(channelIdSchema),
  async (req, res, next) => {
    try {
      await require('../controllers/channelController')
        .stopStream(req.params.channelId, req.user.id);
      res.json({ message: 'Stream stopped' });
    } catch (error) {
      next(error);
    }
  }
);

// ========================
// Events & Scheduling
// ========================

// Get scheduled events for channel
router.get('/:channelId/events',
  authenticate,
  validate(channelIdSchema),
  async (req, res, next) => {
    try {
      const events = await require('../controllers/channelController')
        .getChannelEvents(req.params.channelId, req.query);
      res.json(events);
    } catch (error) {
      next(error);
    }
  }
);

// Create scheduled event
router.post('/:channelId/events',
  authenticate,
  checkPermission('MANAGE_EVENTS'),
  validate(body('name').isString().isLength({ min: 1, max: 100 })),
  validate(body('scheduledStartTime').isISO8601()),
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }),
  async (req, res, next) => {
    try {
      const event = await require('../controllers/channelController')
        .createChannelEvent(req.params.channelId, req.user.id, req.body);
      res.json(event);
    } catch (error) {
      next(error);
    }
  }
);

// ========================
// Helper Middleware
// ========================

// Helper functions for validation
const { body, params, query } = require('express-validator');

// Error handler for this router
router.use((error, req, res, next) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: error.errors
    });
  }
  next(error);
});

module.exports = router;