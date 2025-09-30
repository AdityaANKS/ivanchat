const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ 
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    cb(null, allowedMimes.includes(file.mimetype));
  }
});

// Middleware
const { authenticate, optionalAuth } = require('../middleware/auth');
const { checkRole, checkServerPermission, isServerOwner, isServerMember } = require('../middleware/roles');
const { validate } = require('../middleware/validation');
const { rateLimiter } = require('../middleware/rateLimiter');

// Controllers
const {
  createServer,
  getServer,
  updateServer,
  deleteServer,
  getServerMembers,
  getServerChannels,
  getServerRoles,
  createServerRole,
  updateServerRole,
  deleteServerRole,
  updateMemberRoles,
  kickMember,
  banMember,
  unbanMember,
  getServerBans,
  getServerInvites,
  createServerInvite,
  deleteServerInvite,
  getServerSettings,
  updateServerSettings,
  getServerEmojis,
  createServerEmoji,
  deleteServerEmoji,
  getServerStickers,
  createServerSticker,
  deleteServerSticker,
  getServerAuditLog,
  getServerAnalytics,
  getServerWebhooks,
  createServerWebhook,
  getServerTemplates,
  createServerTemplate,
  createServerFromTemplate,
  getServerDiscoveryInfo,
  updateServerDiscoveryInfo,
  boostServer,
  getServerBoosts,
  getServerVanityUrl,
  updateServerVanityUrl,
  getServerWidgetSettings,
  updateServerWidgetSettings,
  getServerPruneCount,
  pruneServerMembers,
  getServerVoiceRegions,
  updateServerVoiceRegion,
  getServerIntegrations,
  createServerIntegration,
  updateServerIntegration,
  deleteServerIntegration,
  getServerScheduledEvents,
  createServerScheduledEvent,
  updateServerScheduledEvent,
  deleteServerScheduledEvent,
  exportServerData,
  getServerBackups,
  createServerBackup,
  restoreServerBackup
} = require('../controllers/serverController');

// Validation schemas
const { body, params, query } = require('express-validator');

// ========================
// Discovery & Public Routes
// ========================

// Get discoverable servers
router.get('/discover',
  optionalAuth,
  validate([
    query('category').optional().isString(),
    query('sort').optional().isIn(['members', 'recent', 'relevance']),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('offset').optional().isInt({ min: 0 })
  ]),
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }),
  async (req, res, next) => {
    try {
      const servers = await require('../services/DiscoveryService')
        .getDiscoverableServers(req.query, req.user?.id);
      res.json(servers);
    } catch (error) {
      next(error);
    }
  }
);

// Get featured servers
router.get('/featured',
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }),
  async (req, res, next) => {
    try {
      const servers = await require('../services/DiscoveryService')
        .getFeaturedServers();
      res.json(servers);
    } catch (error) {
      next(error);
    }
  }
);

// Search servers
router.get('/search',
  optionalAuth,
  validate([
    query('q').isString().isLength({ min: 2, max: 100 }),
    query('limit').optional().isInt({ min: 1, max: 20 })
  ]),
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 30 }),
  async (req, res, next) => {
    try {
      const servers = await require('../controllers/serverController')
        .searchServers(req.query.q, req.query.limit);
      res.json(servers);
    } catch (error) {
      next(error);
    }
  }
);

// ========================
// Server Templates
// ========================

// Get public server templates
router.get('/templates',
  validate([
    query('category').optional().isString(),
    query('sort').optional().isIn(['popular', 'recent', 'name'])
  ]),
  getServerTemplates
);

// Get template by code
router.get('/templates/:templateCode',
  validate(params('templateCode').isString()),
  async (req, res, next) => {
    try {
      const template = await require('../controllers/serverController')
        .getTemplateByCode(req.params.templateCode);
      res.json(template);
    } catch (error) {
      next(error);
    }
  }
);

// Create server from template
router.post('/templates/:templateCode',
  authenticate,
  validate([
    params('templateCode').isString(),
    body('name').isString().isLength({ min: 2, max: 100 }),
    body('icon').optional().isString()
  ]),
  rateLimiter({ windowMs: 60 * 60 * 1000, max: 10 }),
  createServerFromTemplate
);

// ========================
// User's Servers
// ========================

// Get user's servers
router.get('/me',
  authenticate,
  async (req, res, next) => {
    try {
      const servers = await require('../controllers/serverController')
        .getUserServers(req.user.id);
      res.json(servers);
    } catch (error) {
      next(error);
    }
  }
);

// Create new server
router.post('/',
  authenticate,
  validate([
    body('name').isString().isLength({ min: 2, max: 100 }),
    body('icon').optional().isString(),
    body('region').optional().isString(),
    body('template').optional().isString()
  ]),
  rateLimiter({ windowMs: 60 * 60 * 1000, max: 10 }),
  createServer
);

// Join server via invite
router.post('/join/:inviteCode',
  authenticate,
  validate(params('inviteCode').isString()),
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }),
  async (req, res, next) => {
    try {
      const server = await require('../controllers/serverController')
        .joinServerByInvite(req.params.inviteCode, req.user.id);
      res.json(server);
    } catch (error) {
      next(error);
    }
  }
);

// ========================
// Individual Server Routes
// ========================

// Get server details
router.get('/:serverId',
  authenticate,
  isServerMember,
  validate(params('serverId').isMongoId()),
  getServer
);

// Update server
router.patch('/:serverId',
  authenticate,
  checkServerPermission('MANAGE_SERVER'),
  validate([
    params('serverId').isMongoId(),
    body('name').optional().isString().isLength({ min: 2, max: 100 }),
    body('description').optional().isString().isLength({ max: 1000 }),
    body('region').optional().isString(),
    body('verificationLevel').optional().isInt({ min: 0, max: 4 }),
    body('explicitContentFilter').optional().isInt({ min: 0, max: 2 }),
    body('afkChannelId').optional().isMongoId(),
    body('afkTimeout').optional().isInt({ min: 60, max: 3600 }),
    body('systemChannelId').optional().isMongoId()
  ]),
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }),
  updateServer
);

// Delete server (owner only)
router.delete('/:serverId',
  authenticate,
  isServerOwner,
  validate(params('serverId').isMongoId()),
  rateLimiter({ windowMs: 60 * 60 * 1000, max: 5 }),
  deleteServer
);

// Leave server
router.post('/:serverId/leave',
  authenticate,
  isServerMember,
  validate(params('serverId').isMongoId()),
  async (req, res, next) => {
    try {
      await require('../controllers/serverController')
        .leaveServer(req.params.serverId, req.user.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

// Transfer ownership
router.post('/:serverId/transfer-ownership',
  authenticate,
  isServerOwner,
  validate([
    params('serverId').isMongoId(),
    body('userId').isMongoId()
  ]),
  rateLimiter({ windowMs: 24 * 60 * 60 * 1000, max: 2 }),
  async (req, res, next) => {
    try {
      await require('../controllers/serverController')
        .transferOwnership(req.params.serverId, req.user.id, req.body.userId);
      res.json({ message: 'Ownership transferred successfully' });
    } catch (error) {
      next(error);
    }
  }
);

// ========================
// Server Members
// ========================

// Get server members
router.get('/:serverId/members',
  authenticate,
  isServerMember,
  validate([
    params('serverId').isMongoId(),
    query('limit').optional().isInt({ min: 1, max: 1000 }),
    query('after').optional().isMongoId()
  ]),
  getServerMembers
);

// Get member details
router.get('/:serverId/members/:userId',
  authenticate,
  isServerMember,
  validate([
    params('serverId').isMongoId(),
    params('userId').isMongoId()
  ]),
  async (req, res, next) => {
    try {
      const member = await require('../controllers/serverController')
        .getServerMember(req.params.serverId, req.params.userId);
      res.json(member);
    } catch (error) {
      next(error);
    }
  }
);

// Update member (nickname, roles, etc.)
router.patch('/:serverId/members/:userId',
  authenticate,
  checkServerPermission('MANAGE_MEMBERS'),
  validate([
    params('serverId').isMongoId(),
    params('userId').isMongoId(),
    body('nickname').optional().isString().isLength({ max: 32 }),
    body('roles').optional().isArray(),
    body('mute').optional().isBoolean(),
    body('deaf').optional().isBoolean()
  ]),
  updateMemberRoles
);

// Kick member
router.delete('/:serverId/members/:userId',
  authenticate,
  checkServerPermission('KICK_MEMBERS'),
  validate([
    params('serverId').isMongoId(),
    params('userId').isMongoId(),
    body('reason').optional().isString().isLength({ max: 512 })
  ]),
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }),
  kickMember
);

// ========================
// Server Bans
// ========================

// Get server bans
router.get('/:serverId/bans',
  authenticate,
  checkServerPermission('BAN_MEMBERS'),
  validate(params('serverId').isMongoId()),
  getServerBans
);

// Ban member
router.put('/:serverId/bans/:userId',
  authenticate,
  checkServerPermission('BAN_MEMBERS'),
  validate([
    params('serverId').isMongoId(),
    params('userId').isMongoId(),
    body('reason').optional().isString().isLength({ max: 512 }),
    body('deleteMessageDays').optional().isInt({ min: 0, max: 7 })
  ]),
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }),
  banMember
);

// Unban member
router.delete('/:serverId/bans/:userId',
  authenticate,
  checkServerPermission('BAN_MEMBERS'),
  validate([
    params('serverId').isMongoId(),
    params('userId').isMongoId()
  ]),
  unbanMember
);

// ========================
// Server Roles
// ========================

// Get server roles
router.get('/:serverId/roles',
  authenticate,
  isServerMember,
  validate(params('serverId').isMongoId()),
  getServerRoles
);

// Create role
router.post('/:serverId/roles',
  authenticate,
  checkServerPermission('MANAGE_ROLES'),
  validate([
    params('serverId').isMongoId(),
    body('name').isString().isLength({ min: 1, max: 100 }),
    body('color').optional().matches(/^#[0-9A-F]{6}$/i),
    body('permissions').optional().isArray(),
    body('mentionable').optional().isBoolean(),
    body('hoist').optional().isBoolean()
  ]),
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }),
  createServerRole
);

// Update role
router.patch('/:serverId/roles/:roleId',
  authenticate,
  checkServerPermission('MANAGE_ROLES'),
  validate([
    params('serverId').isMongoId(),
    params('roleId').isMongoId()
  ]),
  updateServerRole
);

// Delete role
router.delete('/:serverId/roles/:roleId',
  authenticate,
  checkServerPermission('MANAGE_ROLES'),
  validate([
    params('serverId').isMongoId(),
    params('roleId').isMongoId()
  ]),
  deleteServerRole
);

// Update role positions
router.patch('/:serverId/roles/positions',
  authenticate,
  checkServerPermission('MANAGE_ROLES'),
  validate([
    params('serverId').isMongoId(),
    body('roles').isArray()
  ]),
  async (req, res, next) => {
    try {
      await require('../controllers/serverController')
        .updateRolePositions(req.params.serverId, req.body.roles);
      res.json({ message: 'Role positions updated' });
    } catch (error) {
      next(error);
    }
  }
);

// ========================
// Server Channels
// ========================

// Get server channels
router.get('/:serverId/channels',
  authenticate,
  isServerMember,
  validate(params('serverId').isMongoId()),
  getServerChannels
);

// ========================
// Server Invites
// ========================

// Get server invites
router.get('/:serverId/invites',
  authenticate,
  checkServerPermission('MANAGE_SERVER'),
  validate(params('serverId').isMongoId()),
  getServerInvites
);

// Create server invite
router.post('/:serverId/invites',
  authenticate,
  checkServerPermission('CREATE_INVITES'),
  validate([
    params('serverId').isMongoId(),
    body('maxAge').optional().isInt({ min: 0, max: 604800 }),
    body('maxUses').optional().isInt({ min: 0, max: 100 }),
    body('temporary').optional().isBoolean(),
    body('unique').optional().isBoolean()
  ]),
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }),
  createServerInvite
);

// Delete server invite
router.delete('/:serverId/invites/:inviteCode',
  authenticate,
  checkServerPermission('MANAGE_SERVER'),
  validate([
    params('serverId').isMongoId(),
    params('inviteCode').isString()
  ]),
  deleteServerInvite
);

// ========================
// Server Emojis & Stickers
// ========================

// Get server emojis
router.get('/:serverId/emojis',
  authenticate,
  isServerMember,
  validate(params('serverId').isMongoId()),
  getServerEmojis
);

// Upload emoji
router.post('/:serverId/emojis',
  authenticate,
  checkServerPermission('MANAGE_EMOJIS'),
  upload.single('image'),
  validate([
    params('serverId').isMongoId(),
    body('name').isString().matches(/^[a-zA-Z0-9_]{2,32}$/)
  ]),
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }),
  createServerEmoji
);

// Delete emoji
router.delete('/:serverId/emojis/:emojiId',
  authenticate,
  checkServerPermission('MANAGE_EMOJIS'),
  validate([
    params('serverId').isMongoId(),
    params('emojiId').isMongoId()
  ]),
  deleteServerEmoji
);

// Get server stickers
router.get('/:serverId/stickers',
  authenticate,
  isServerMember,
  validate(params('serverId').isMongoId()),
  getServerStickers
);

// Upload sticker
router.post('/:serverId/stickers',
  authenticate,
  checkServerPermission('MANAGE_EMOJIS'),
  upload.single('file'),
  validate([
    params('serverId').isMongoId(),
    body('name').isString().isLength({ min: 2, max: 30 }),
    body('tags').isString().isLength({ min: 1, max: 200 }),
    body('description').optional().isString().isLength({ max: 100 })
  ]),
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 5 }),
  createServerSticker
);

// Delete sticker
router.delete('/:serverId/stickers/:stickerId',
  authenticate,
  checkServerPermission('MANAGE_EMOJIS'),
  validate([
    params('serverId').isMongoId(),
    params('stickerId').isMongoId()
  ]),
  deleteServerSticker
);

// ========================
// Server Settings & Features
// ========================

// Get server settings
router.get('/:serverId/settings',
  authenticate,
  checkServerPermission('MANAGE_SERVER'),
  validate(params('serverId').isMongoId()),
  getServerSettings
);

// Update server settings
router.patch('/:serverId/settings',
  authenticate,
  checkServerPermission('MANAGE_SERVER'),
  validate(params('serverId').isMongoId()),
  updateServerSettings
);

// Get/Update vanity URL
router.get('/:serverId/vanity-url',
  authenticate,
  isServerMember,
  validate(params('serverId').isMongoId()),
  getServerVanityUrl
);

router.patch('/:serverId/vanity-url',
  authenticate,
  checkServerPermission('MANAGE_SERVER'),
  validate([
    params('serverId').isMongoId(),
    body('code').isString().matches(/^[a-zA-Z0-9-]{3,32}$/)
  ]),
  rateLimiter({ windowMs: 60 * 60 * 1000, max: 5 }),
  updateServerVanityUrl
);

// Server widget settings
router.get('/:serverId/widget',
  validate(params('serverId').isMongoId()),
  getServerWidgetSettings
);

router.patch('/:serverId/widget',
  authenticate,
  checkServerPermission('MANAGE_SERVER'),
  validate([
    params('serverId').isMongoId(),
    body('enabled').optional().isBoolean(),
    body('channelId').optional().isMongoId()
  ]),
  updateServerWidgetSettings
);

// ========================
// Server Discovery
// ========================

// Get server discovery settings
router.get('/:serverId/discovery',
  authenticate,
  checkServerPermission('MANAGE_SERVER'),
  validate(params('serverId').isMongoId()),
  getServerDiscoveryInfo
);

// Update server discovery settings
router.patch('/:serverId/discovery',
  authenticate,
  checkServerPermission('MANAGE_SERVER'),
  validate([
    params('serverId').isMongoId(),
    body('description').optional().isString().isLength({ min: 120, max: 240 }),
    body('categories').optional().isArray(),
    body('primaryCategory').optional().isString(),
    body('keywords').optional().isArray(),
    body('emojiDiscoverabilityEnabled').optional().isBoolean()
  ]),
  rateLimiter({ windowMs: 60 * 60 * 1000, max: 10 }),
  updateServerDiscoveryInfo
);

// ========================
// Server Boosts
// ========================

// Get server boosts
router.get('/:serverId/boosts',
  authenticate,
  isServerMember,
  validate(params('serverId').isMongoId()),
  getServerBoosts
);

// Boost server
router.post('/:serverId/boost',
  authenticate,
  isServerMember,
  validate(params('serverId').isMongoId()),
  rateLimiter({ windowMs: 60 * 60 * 1000, max: 5 }),
  boostServer
);

// ========================
// Server Templates
// ========================

// Get server templates
router.get('/:serverId/templates',
  authenticate,
  checkServerPermission('MANAGE_SERVER'),
  validate(params('serverId').isMongoId()),
  async (req, res, next) => {
    try {
      const templates = await require('../controllers/serverController')
        .getServerTemplates(req.params.serverId);
      res.json(templates);
    } catch (error) {
      next(error);
    }
  }
);

// Create server template
router.post('/:serverId/templates',
  authenticate,
  checkServerPermission('MANAGE_SERVER'),
  validate([
    params('serverId').isMongoId(),
    body('name').isString().isLength({ min: 1, max: 100 }),
    body('description').optional().isString().isLength({ max: 120 })
  ]),
  rateLimiter({ windowMs: 60 * 60 * 1000, max: 5 }),
  createServerTemplate
);

// ========================
// Server Webhooks
// ========================

// Get server webhooks
router.get('/:serverId/webhooks',
  authenticate,
  checkServerPermission('MANAGE_WEBHOOKS'),
  validate(params('serverId').isMongoId()),
  getServerWebhooks
);

// Create server webhook
router.post('/:serverId/webhooks',
  authenticate,
  checkServerPermission('MANAGE_WEBHOOKS'),
  validate([
    params('serverId').isMongoId(),
    body('name').isString().isLength({ min: 1, max: 80 }),
    body('channelId').isMongoId()
  ]),
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }),
  createServerWebhook
);

// ========================
// Server Integrations
// ========================

// Get server integrations
router.get('/:serverId/integrations',
  authenticate,
  checkServerPermission('MANAGE_SERVER'),
  validate(params('serverId').isMongoId()),
  getServerIntegrations
);

// Add integration
router.post('/:serverId/integrations',
  authenticate,
  checkServerPermission('MANAGE_SERVER'),
  validate([
    params('serverId').isMongoId(),
    body('type').isString(),
    body('config').isObject()
  ]),
  rateLimiter({ windowMs: 60 * 60 * 1000, max: 10 }),
  createServerIntegration
);

// Update integration
router.patch('/:serverId/integrations/:integrationId',
  authenticate,
  checkServerPermission('MANAGE_SERVER'),
  validate([
    params('serverId').isMongoId(),
    params('integrationId').isMongoId()
  ]),
  updateServerIntegration
);

// Delete integration
router.delete('/:serverId/integrations/:integrationId',
  authenticate,
  checkServerPermission('MANAGE_SERVER'),
  validate([
    params('serverId').isMongoId(),
    params('integrationId').isMongoId()
  ]),
  deleteServerIntegration
);

// ========================
// Server Events
// ========================

// Get scheduled events
router.get('/:serverId/scheduled-events',
  authenticate,
  isServerMember,
  validate([
    params('serverId').isMongoId(),
    query('withUserCount').optional().isBoolean()
  ]),
  getServerScheduledEvents
);

// Create scheduled event
router.post('/:serverId/scheduled-events',
  authenticate,
  checkServerPermission('MANAGE_EVENTS'),
  validate([
    params('serverId').isMongoId(),
    body('name').isString().isLength({ min: 1, max: 100 }),
    body('description').optional().isString().isLength({ max: 1000 }),
    body('scheduledStartTime').isISO8601(),
    body('scheduledEndTime').optional().isISO8601(),
    body('entityType').isIn(['STAGE_INSTANCE', 'VOICE', 'EXTERNAL']),
    body('channelId').optional().isMongoId(),
    body('entityMetadata').optional().isObject()
  ]),
  rateLimiter({ windowMs: 60 * 60 * 1000, max: 10 }),
  createServerScheduledEvent
);

// Update scheduled event
router.patch('/:serverId/scheduled-events/:eventId',
  authenticate,
  checkServerPermission('MANAGE_EVENTS'),
  validate([
    params('serverId').isMongoId(),
    params('eventId').isMongoId()
  ]),
  updateServerScheduledEvent
);

// Delete scheduled event
router.delete('/:serverId/scheduled-events/:eventId',
  authenticate,
  checkServerPermission('MANAGE_EVENTS'),
  validate([
    params('serverId').isMongoId(),
    params('eventId').isMongoId()
  ]),
  deleteServerScheduledEvent
);

// ========================
// Server Moderation
// ========================

// Get audit log
router.get('/:serverId/audit-logs',
  authenticate,
  checkServerPermission('VIEW_AUDIT_LOG'),
  validate([
    params('serverId').isMongoId(),
    query('userId').optional().isMongoId(),
    query('actionType').optional().isInt(),
    query('before').optional().isMongoId(),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ]),
  getServerAuditLog
);

// Get server prune count
router.get('/:serverId/prune',
  authenticate,
  checkServerPermission('KICK_MEMBERS'),
  validate([
    params('serverId').isMongoId(),
    query('days').optional().isInt({ min: 1, max: 30 }),
    query('includeRoles').optional().isArray()
  ]),
  getServerPruneCount
);

// Prune inactive members
router.post('/:serverId/prune',
  authenticate,
  checkServerPermission('KICK_MEMBERS'),
  validate([
    params('serverId').isMongoId(),
    body('days').isInt({ min: 1, max: 30 }),
    body('includeRoles').optional().isArray(),
    body('computePruneCount').optional().isBoolean()
  ]),
  rateLimiter({ windowMs: 24 * 60 * 60 * 1000, max: 1 }),
  pruneServerMembers
);

// ========================
// Server Analytics
// ========================

// Get server analytics
router.get('/:serverId/analytics',
  authenticate,
  checkServerPermission('VIEW_ANALYTICS'),
  validate([
    params('serverId').isMongoId(),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
    query('metrics').optional().isArray()
  ]),
  getServerAnalytics
);

// Get server insights
router.get('/:serverId/insights',
  authenticate,
  checkServerPermission('VIEW_ANALYTICS'),
  validate(params('serverId').isMongoId()),
  async (req, res, next) => {
    try {
      const insights = await require('../services/AnalyticsService')
        .getServerInsights(req.params.serverId);
      res.json(insights);
    } catch (error) {
      next(error);
    }
  }
);

// ========================
// Server Voice Regions
// ========================

// Get available voice regions
router.get('/:serverId/regions',
  authenticate,
  isServerMember,
  validate(params('serverId').isMongoId()),
  getServerVoiceRegions
);

// Update voice region
router.patch('/:serverId/voice-region',
  authenticate,
  checkServerPermission('MANAGE_SERVER'),
  validate([
    params('serverId').isMongoId(),
    body('region').isString()
  ]),
  updateServerVoiceRegion
);

// ========================
// Server Backup & Export
// ========================

// Get server backups
router.get('/:serverId/backups',
  authenticate,
  isServerOwner,
  validate(params('serverId').isMongoId()),
  getServerBackups
);

// Create server backup
router.post('/:serverId/backups',
  authenticate,
  isServerOwner,
  validate([
    params('serverId').isMongoId(),
    body('description').optional().isString().isLength({ max: 200 })
  ]),
  rateLimiter({ windowMs: 24 * 60 * 60 * 1000, max: 3 }),
  createServerBackup
);

// Restore server backup
router.post('/:serverId/backups/:backupId/restore',
  authenticate,
  isServerOwner,
  validate([
    params('serverId').isMongoId(),
    params('backupId').isMongoId()
  ]),
  rateLimiter({ windowMs: 24 * 60 * 60 * 1000, max: 1 }),
  restoreServerBackup
);

// Export server data
router.post('/:serverId/export',
  authenticate,
  isServerOwner,
  validate([
    params('serverId').isMongoId(),
    body('format').optional().isIn(['json', 'csv']),
    body('includeMessages').optional().isBoolean(),
    body('includeMembers').optional().isBoolean(),
    body('includeChannels').optional().isBoolean()
  ]),
  rateLimiter({ windowMs: 24 * 60 * 60 * 1000, max: 2 }),
  exportServerData
);

module.exports = router;