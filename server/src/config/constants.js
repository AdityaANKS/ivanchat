export const CONSTANTS = {
  // App
  APP_NAME: process.env.APP_NAME || 'Ivan Chat',
  APP_VERSION: process.env.APP_VERSION || '1.0.0',
  APP_URL: process.env.APP_URL || 'http://localhost:3000',
  API_URL: process.env.API_URL || 'http://localhost:5000',

  // Limits
  MAX_MESSAGE_LENGTH: 2000,
  MAX_USERNAME_LENGTH: 30,
  MIN_USERNAME_LENGTH: 3,
  MAX_CHANNEL_NAME_LENGTH: 100,
  MAX_SERVER_NAME_LENGTH: 100,
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_AVATAR_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_MESSAGES_PER_FETCH: 50,

  // Timeouts
  TYPING_TIMEOUT: 10000, // 10 seconds
  VOICE_TIMEOUT: 30000, // 30 seconds
  SESSION_TIMEOUT: 7 * 24 * 60 * 60 * 1000, // 7 days

  // Rate limits
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,
  MESSAGE_RATE_LIMIT: 30, // messages per minute
  
  // Permissions
  PERMISSIONS: {
    ADMINISTRATOR: 1 << 0,
    VIEW_CHANNELS: 1 << 1,
    MANAGE_CHANNELS: 1 << 2,
    MANAGE_ROLES: 1 << 3,
    MANAGE_SERVER: 1 << 4,
    CREATE_INVITE: 1 << 5,
    CHANGE_NICKNAME: 1 << 6,
    MANAGE_NICKNAMES: 1 << 7,
    KICK_MEMBERS: 1 << 8,
    BAN_MEMBERS: 1 << 9,
    SEND_MESSAGES: 1 << 10,
    SEND_TTS_MESSAGES: 1 << 11,
    MANAGE_MESSAGES: 1 << 12,
    EMBED_LINKS: 1 << 13,
    ATTACH_FILES: 1 << 14,
    READ_MESSAGE_HISTORY: 1 << 15,
    MENTION_EVERYONE: 1 << 16,
    USE_EXTERNAL_EMOJIS: 1 << 17,
    ADD_REACTIONS: 1 << 18,
    CONNECT: 1 << 19,
    SPEAK: 1 << 20,
    MUTE_MEMBERS: 1 << 21,
    DEAFEN_MEMBERS: 1 << 22,
    MOVE_MEMBERS: 1 << 23,
    USE_VAD: 1 << 24,
    PRIORITY_SPEAKER: 1 << 25,
    STREAM: 1 << 26,
  },

  // Channel types
  CHANNEL_TYPES: {
    TEXT: 'text',
    VOICE: 'voice',
    VIDEO: 'video',
    ANNOUNCEMENT: 'announcement',
    FORUM: 'forum',
  },

  // Message types
  MESSAGE_TYPES: {
    TEXT: 'text',
    IMAGE: 'image',
    VIDEO: 'video',
    FILE: 'file',
    SYSTEM: 'system',
    EMBED: 'embed',
  },

  // User status
  USER_STATUS: {
    ONLINE: 'online',
    IDLE: 'idle',
    DND: 'dnd',
    OFFLINE: 'offline',
  },

  // Verification levels
  VERIFICATION_LEVELS: {
    NONE: 0,
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
    VERY_HIGH: 4,
  },

  // Badge types
  BADGE_TYPES: {
    VERIFIED: 'verified',
    PARTNER: 'partner',
    DEVELOPER: 'developer',
    MODERATOR: 'moderator',
    SUPPORTER: 'supporter',
    EARLY_ADOPTER: 'early_adopter',
    BUG_HUNTER: 'bug_hunter',
  },

  // Regex patterns
  PATTERNS: {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    USERNAME: /^[a-zA-Z0-9_-]{3,30}$/,
    CHANNEL_NAME: /^[a-zA-Z0-9-_]{1,100}$/,
    HEX_COLOR: /^#[0-9A-F]{6}$/i,
    URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
    MENTION: /@([a-zA-Z0-9_-]+)/g,
    CHANNEL_MENTION: /#([a-zA-Z0-9-_]+)/g,
    EMOJI: /:\w+:/g,
  },

  // Error codes
  ERROR_CODES: {
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    CHANNEL_NOT_FOUND: 'CHANNEL_NOT_FOUND',
    SERVER_NOT_FOUND: 'SERVER_NOT_FOUND',
    PERMISSION_DENIED: 'PERMISSION_DENIED',
    RATE_LIMITED: 'RATE_LIMITED',
    INVALID_TOKEN: 'INVALID_TOKEN',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
  },

  // Cache keys
  CACHE_KEYS: {
    USER: (id) => `user:${id}`,
    CHANNEL: (id) => `channel:${id}`,
    SERVER: (id) => `server:${id}`,
    MESSAGES: (channelId) => `messages:${channelId}`,
    ONLINE_USERS: 'online_users',
    TRENDING: 'trending_channels',
  },

  // Events
  SOCKET_EVENTS: {
    // Connection
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    ERROR: 'error',
    
    // Messages
    MESSAGE_CREATE: 'message:create',
    MESSAGE_UPDATE: 'message:update',
    MESSAGE_DELETE: 'message:delete',
    
    // Typing
    TYPING_START: 'typing:start',
    TYPING_STOP: 'typing:stop',
    
    // Voice
    VOICE_JOIN: 'voice:join',
    VOICE_LEAVE: 'voice:leave',
    VOICE_STATE_UPDATE: 'voice:state:update',
    
    // Presence
    PRESENCE_UPDATE: 'presence:update',
    STATUS_UPDATE: 'status:update',
  },
};

export default CONSTANTS;