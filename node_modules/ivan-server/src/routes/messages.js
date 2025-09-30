const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({
  limits: { 
    fileSize: 100 * 1024 * 1024, // 100MB for premium users
    files: 10
  },
  fileFilter: (req, file, cb) => {
    // Check file types based on user subscription
    const allowedMimes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm', 'video/quicktime',
      'audio/mpeg', 'audio/wav', 'audio/ogg',
      'application/pdf', 'application/zip',
      'text/plain', 'text/markdown'
    ];
    cb(null, allowedMimes.includes(file.mimetype));
  }
});

// Middleware
const { authenticate } = require('../middleware/auth');
const { checkPermission, checkChannelAccess } = require('../middleware/roles');
const { validate } = require('../middleware/validation');
const { rateLimiter } = require('../middleware/rateLimiter');
const { messageEncryption } = require('../middleware/encryption');

// Controllers
const {
  sendMessage,
  getMessage,
  editMessage,
  deleteMessage,
  getMessages,
  searchMessages,
  addReaction,
  removeReaction,
  getReactions,
  bulkDeleteMessages,
  createThread,
  replyToMessage,
  forwardMessage,
  translateMessage,
  scheduleMessage,
  getScheduledMessages,
  updateScheduledMessage,
  deleteScheduledMessage,
  summarizeMessages,
  pinMessage,
  unpinMessage,
  reportMessage,
  flagMessage,
  getMessageHistory,
  restoreMessage,
  createPoll,
  votePoll,
  closePoll,
  sendDirectMessage,
  getDirectMessages,
  getDirectMessageHistory,
  markAsRead,
  markAsUnread,
  getUnreadCount,
  createMessageBackup,
  exportMessages,
  importMessages,
  getMessageAnalytics,
  transcribeAudioMessage,
  generateMessageEmbed,
  updateMessageEmbed,
  crosspostMessage,
  getMessageContext,
  createAnnouncement,
  acknowledgeAnnouncement
} = require('../controllers/messageController');

// Validation schemas
const { body, params, query } = require('express-validator');

// ========================
// Channel Messages
// ========================

// Send message to channel
router.post('/channels/:channelId',
  authenticate,
  checkChannelAccess,
  messageEncryption,
  validate([
    params('channelId').isMongoId(),
    body('content').optional().isString().isLength({ min: 1, max: 4000 }),
    body('embeds').optional().isArray().isLength({ max: 10 }),
    body('attachments').optional().isArray(),
    body('mentions').optional().isArray(),
    body('replyTo').optional().isMongoId(),
    body('silent').optional().isBoolean(),
    body('ephemeral').optional().isBoolean()
  ]),
  rateLimiter({ 
    windowMs: 1 * 60 * 1000, 
    max: (req) => req.user?.subscription?.type === 'premium' ? 60 : 30 
  }),
  sendMessage
);

// Send message with file attachments
router.post('/channels/:channelId/upload',
  authenticate,
  checkChannelAccess,
  upload.array('files', 10),
  validate([
    params('channelId').isMongoId(),
    body('content').optional().isString().isLength({ min: 1, max: 4000 })
  ]),
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 10 }),
  async (req, res, next) => {
    try {
      const message = await require('../controllers/messageController')
        .sendMessageWithAttachments(
          req.params.channelId,
          req.user.id,
          req.body,
          req.files
        );
      res.status(201).json(message);
    } catch (error) {
      next(error);
    }
  }
);

// Get messages from channel
router.get('/channels/:channelId',
  authenticate,
  checkChannelAccess,
  validate([
    params('channelId').isMongoId(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('before').optional().isMongoId(),
    query('after').optional().isMongoId(),
    query('around').optional().isMongoId()
  ]),
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 60 }),
  getMessages
);

// Search messages in channel
router.get('/channels/:channelId/search',
  authenticate,
  checkChannelAccess,
  validate([
    params('channelId').isMongoId(),
    query('q').isString().isLength({ min: 2, max: 100 }),
    query('author').optional().isMongoId(),
    query('mentions').optional().isMongoId(),
    query('has').optional().isIn(['link', 'embed', 'file', 'video', 'image', 'poll']),
    query('before').optional().isISO8601(),
    query('after').optional().isISO8601(),
    query('limit').optional().isInt({ min: 1, max: 50 })
  ]),
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 30 }),
  searchMessages
);

// ========================
// Individual Message Operations
// ========================

// Get specific message
router.get('/:messageId',
  authenticate,
  validate(params('messageId').isMongoId()),
  getMessage
);

// Edit message
router.patch('/:messageId',
  authenticate,
  validate([
    params('messageId').isMongoId(),
    body('content').optional().isString().isLength({ min: 1, max: 4000 }),
    body('embeds').optional().isArray().isLength({ max: 10 }),
    body('attachments').optional().isArray()
  ]),
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 30 }),
  editMessage
);

// Delete message
router.delete('/:messageId',
  authenticate,
  validate(params('messageId').isMongoId()),
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 30 }),
  deleteMessage
);

// Get message edit history
router.get('/:messageId/history',
  authenticate,
  validate(params('messageId').isMongoId()),
  getMessageHistory
);

// Restore deleted message (within time limit)
router.post('/:messageId/restore',
  authenticate,
  validate(params('messageId').isMongoId()),
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }),
  restoreMessage
);

// ========================
// Message Reactions
// ========================

// Add reaction to message
router.put('/:messageId/reactions/:emoji',
  authenticate,
  validate([
    params('messageId').isMongoId(),
    params('emoji').isString()
  ]),
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 60 }),
  addReaction
);

// Remove own reaction
router.delete('/:messageId/reactions/:emoji/@me',
  authenticate,
  validate([
    params('messageId').isMongoId(),
    params('emoji').isString()
  ]),
  removeReaction
);

// Remove user's reaction (requires permission)
router.delete('/:messageId/reactions/:emoji/:userId',
  authenticate,
  checkPermission('MANAGE_MESSAGES'),
  validate([
    params('messageId').isMongoId(),
    params('emoji').isString(),
    params('userId').isMongoId()
  ]),
  removeReaction
);

// Get users who reacted with emoji
router.get('/:messageId/reactions/:emoji',
  authenticate,
  validate([
    params('messageId').isMongoId(),
    params('emoji').isString(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('after').optional().isMongoId()
  ]),
  getReactions
);

// Remove all reactions
router.delete('/:messageId/reactions',
  authenticate,
  checkPermission('MANAGE_MESSAGES'),
  validate(params('messageId').isMongoId()),
  async (req, res, next) => {
    try {
      await require('../controllers/messageController')
        .removeAllReactions(req.params.messageId, req.user.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

// ========================
// Message Threads & Replies
// ========================

// Create thread from message
router.post('/:messageId/threads',
  authenticate,
  validate([
    params('messageId').isMongoId(),
    body('name').isString().isLength({ min: 1, max: 100 }),
    body('autoArchiveDuration').optional().isIn([60, 1440, 4320, 10080])
  ]),
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 5 }),
  createThread
);

// Reply to message
router.post('/:messageId/reply',
  authenticate,
  validate([
    params('messageId').isMongoId(),
    body('content').isString().isLength({ min: 1, max: 4000 }),
    body('mentions').optional().isArray()
  ]),
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 30 }),
  replyToMessage
);

// Get message context (thread/replies)
router.get('/:messageId/context',
  authenticate,
  validate([
    params('messageId').isMongoId(),
    query('limit').optional().isInt({ min: 1, max: 50 })
  ]),
  getMessageContext
);

// ========================
// Message Actions
// ========================

// Forward message
router.post('/:messageId/forward',
  authenticate,
  validate([
    params('messageId').isMongoId(),
    body('channelIds').isArray().isLength({ min: 1, max: 10 }),
    body('message').optional().isString().isLength({ max: 1000 })
  ]),
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 10 }),
  forwardMessage
);

// Crosspost message to other servers
router.post('/:messageId/crosspost',
  authenticate,
  checkPermission('MANAGE_MESSAGES'),
  validate([
    params('messageId').isMongoId(),
    body('channelIds').isArray().isLength({ min: 1, max: 5 })
  ]),
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }),
  crosspostMessage
);

// Pin message
router.put('/:messageId/pin',
  authenticate,
  checkPermission('MANAGE_MESSAGES'),
  validate(params('messageId').isMongoId()),
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }),
  pinMessage
);

// Unpin message
router.delete('/:messageId/pin',
  authenticate,
  checkPermission('MANAGE_MESSAGES'),
  validate(params('messageId').isMongoId()),
  unpinMessage
);

// ========================
// Message Translation & Accessibility
// ========================

// Translate message
router.post('/:messageId/translate',
  authenticate,
  validate([
    params('messageId').isMongoId(),
    body('targetLanguage').isString().isLength({ min: 2, max: 5 })
  ]),
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 30 }),
  translateMessage
);

// Transcribe audio message
router.post('/:messageId/transcribe',
  authenticate,
  validate(params('messageId').isMongoId()),
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 10 }),
  transcribeAudioMessage
);

// Generate text-to-speech
router.post('/:messageId/tts',
  authenticate,
  validate([
    params('messageId').isMongoId(),
    body('voice').optional().isString(),
    body('speed').optional().isFloat({ min: 0.5, max: 2.0 })
  ]),
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 20 }),
  async (req, res, next) => {
    try {
      const audio = await require('../services/TranscriptionService')
        .generateTTS(req.params.messageId, req.body);
      res.json(audio);
    } catch (error) {
      next(error);
    }
  }
);

// ========================
// Message Embeds
// ========================

// Generate embed preview
router.post('/embed/preview',
  authenticate,
  validate([
    body('url').isURL(),
    body('type').optional().isIn(['link', 'image', 'video', 'rich'])
  ]),
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 30 }),
  generateMessageEmbed
);

// Update message embed
router.patch('/:messageId/embed',
  authenticate,
  validate([
    params('messageId').isMongoId(),
    body('embed').isObject()
  ]),
  updateMessageEmbed
);

// ========================
// Polls
// ========================

// Create poll
router.post('/poll',
  authenticate,
  validate([
    body('channelId').isMongoId(),
    body('question').isString().isLength({ min: 1, max: 500 }),
    body('options').isArray().isLength({ min: 2, max: 10 }),
    body('duration').optional().isInt({ min: 1, max: 10080 }), // max 7 days
    body('multipleChoice').optional().isBoolean()
  ]),
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 5 }),
  createPoll
);

// Vote on poll
router.post('/:messageId/poll/vote',
  authenticate,
  validate([
    params('messageId').isMongoId(),
    body('optionIds').isArray().isLength({ min: 1, max: 10 })
  ]),
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 10 }),
  votePoll
);

// Close poll early
router.post('/:messageId/poll/close',
  authenticate,
  validate(params('messageId').isMongoId()),
  closePoll
);

// ========================
// Scheduled Messages
// ========================

// Schedule a message
router.post('/schedule',
  authenticate,
  validate([
    body('channelId').isMongoId(),
    body('content').isString().isLength({ min: 1, max: 4000 }),
    body('scheduledTime').isISO8601().custom(value => {
      const scheduledDate = new Date(value);
      const now = new Date();
      const maxFuture = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
      if (scheduledDate <= now || scheduledDate > maxFuture) {
        throw new Error('Scheduled time must be in the future and within 1 year');
      }
      return true;
    }),
    body('timezone').optional().isString(),
    body('recurring').optional().isObject()
  ]),
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }),
  scheduleMessage
);

// Get scheduled messages
router.get('/scheduled',
  authenticate,
  validate([
    query('channelId').optional().isMongoId(),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ]),
  getScheduledMessages
);

// Update scheduled message
router.patch('/scheduled/:scheduledMessageId',
  authenticate,
  validate([
    params('scheduledMessageId').isMongoId(),
    body('content').optional().isString().isLength({ min: 1, max: 4000 }),
    body('scheduledTime').optional().isISO8601()
  ]),
  updateScheduledMessage
);

// Cancel scheduled message
router.delete('/scheduled/:scheduledMessageId',
  authenticate,
  validate(params('scheduledMessageId').isMongoId()),
  deleteScheduledMessage
);

// ========================
// Direct Messages
// ========================

// Send direct message
router.post('/direct/:userId',
  authenticate,
  validate([
    params('userId').isMongoId(),
    body('content').isString().isLength({ min: 1, max: 4000 }),
    body('attachments').optional().isArray()
  ]),
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 30 }),
  sendDirectMessage
);

// Get direct messages with user
router.get('/direct/:userId',
  authenticate,
  validate([
    params('userId').isMongoId(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('before').optional().isMongoId(),
    query('after').optional().isMongoId()
  ]),
  getDirectMessages
);

// Get DM conversation history
router.get('/direct/:userId/history',
  authenticate,
  validate([
    params('userId').isMongoId(),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601()
  ]),
  getDirectMessageHistory
);

// ========================
// Message Status
// ========================

// Mark messages as read
router.post('/read',
  authenticate,
  validate([
    body('channelId').isMongoId(),
    body('messageId').isMongoId()
  ]),
  markAsRead
);

// Mark messages as unread
router.post('/unread',
  authenticate,
  validate([
    body('channelId').isMongoId(),
    body('messageId').isMongoId()
  ]),
  markAsUnread
);

// Get unread count
router.get('/unread/count',
  authenticate,
  validate(query('channelIds').optional().isArray()),
  getUnreadCount
);

// ========================
// Bulk Operations
// ========================

// Bulk delete messages
router.post('/bulk-delete',
  authenticate,
  checkPermission('MANAGE_MESSAGES'),
  validate([
    body('messageIds').isArray().isLength({ min: 2, max: 100 }),
    body('channelId').isMongoId()
  ]),
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 5 }),
  bulkDeleteMessages
);

// ========================
// Message Analytics
// ========================

// Get message analytics
router.get('/analytics',
  authenticate,
  checkPermission('VIEW_ANALYTICS'),
  validate([
    query('channelId').optional().isMongoId(),
    query('userId').optional().isMongoId(),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
    query('metrics').optional().isArray()
  ]),
  getMessageAnalytics
);

// ========================
// Message Summaries
// ========================

// Summarize message thread
router.post('/summarize',
  authenticate,
  validate([
    body('messageIds').isArray().isLength({ min: 2, max: 100 }),
    body('style').optional().isIn(['brief', 'detailed', 'bullets'])
  ]),
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }),
  summarizeMessages
);

// ========================
// Announcements
// ========================

// Create announcement
router.post('/announcement',
  authenticate,
  checkPermission('MANAGE_MESSAGES'),
  validate([
    body('channelIds').isArray().isLength({ min: 1, max: 10 }),
    body('content').isString().isLength({ min: 1, max: 4000 }),
    body('title').optional().isString().isLength({ max: 100 }),
    body('color').optional().matches(/^#[0-9A-F]{6}$/i),
    body('requireAcknowledgment').optional().isBoolean()
  ]),
  rateLimiter({ windowMs: 60 * 60 * 1000, max: 10 }),
  createAnnouncement
);

// Acknowledge announcement
router.post('/:messageId/acknowledge',
  authenticate,
  validate(params('messageId').isMongoId()),
  acknowledgeAnnouncement
);

// ========================
// Moderation
// ========================

// Report message
router.post('/:messageId/report',
  authenticate,
  validate([
    params('messageId').isMongoId(),
    body('reason').isIn(['spam', 'harassment', 'hate_speech', 'nsfw', 'other']),
    body('details').optional().isString().isLength({ max: 500 })
  ]),
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }),
  reportMessage
);

// Flag message for moderation
router.post('/:messageId/flag',
  authenticate,
  checkPermission('MODERATE_MESSAGES'),
  validate([
    params('messageId').isMongoId(),
    body('reason').isString(),
    body('action').optional().isIn(['warn', 'delete', 'timeout', 'ban'])
  ]),
  flagMessage
);

// ========================
// Import/Export
// ========================

// Export messages
router.post('/export',
  authenticate,
  checkPermission('MANAGE_MESSAGES'),
  validate([
    body('channelId').isMongoId(),
    body('format').isIn(['json', 'csv', 'txt', 'html']),
    body('startDate').optional().isISO8601(),
    body('endDate').optional().isISO8601(),
    body('includeAttachments').optional().isBoolean()
  ]),
  rateLimiter({ windowMs: 60 * 60 * 1000, max: 5 }),
  exportMessages
);

// Import messages
router.post('/import',
  authenticate,
  checkPermission('MANAGE_SERVER'),
  upload.single('file'),
  validate([
    body('channelId').isMongoId(),
    body('format').isIn(['json', 'csv'])
  ]),
  rateLimiter({ windowMs: 24 * 60 * 60 * 1000, max: 2 }),
  importMessages
);

// Create message backup
router.post('/backup',
  authenticate,
  checkPermission('MANAGE_SERVER'),
  validate([
    body('channelId').isMongoId(),
    body('description').optional().isString().isLength({ max: 200 })
  ]),
  rateLimiter({ windowMs: 24 * 60 * 60 * 1000, max: 3 }),
  createMessageBackup
);

module.exports = router;