// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
export const CDN_URL = import.meta.env.VITE_CDN_URL || 'http://localhost:3001/cdn';

// App Configuration
export const APP_NAME = 'Ivan Chat';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';
export const APP_DESCRIPTION = 'Next-generation chat platform';
export const DEFAULT_LOCALE = 'en-US';
export const SUPPORTED_LOCALES = ['en-US', 'es-ES', 'fr-FR', 'de-DE', 'ja-JP', 'zh-CN'];

// Authentication
export const TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const TOKEN_EXPIRY = 15 * 60 * 1000; // 15 minutes
export const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// User Roles & Permissions
export const USER_ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  PREMIUM: 'premium',
  USER: 'user',
  GUEST: 'guest'
};

export const ROLE_HIERARCHY = {
  [USER_ROLES.ADMIN]: 4,
  [USER_ROLES.MODERATOR]: 3,
  [USER_ROLES.PREMIUM]: 2,
  [USER_ROLES.USER]: 1,
  [USER_ROLES.GUEST]: 0
};

export const PERMISSIONS = {
  // Server permissions
  CREATE_SERVER: 'create_server',
  DELETE_SERVER: 'delete_server',
  MANAGE_SERVER: 'manage_server',
  MANAGE_CHANNELS: 'manage_channels',
  MANAGE_ROLES: 'manage_roles',
  MANAGE_MEMBERS: 'manage_members',
  BAN_MEMBERS: 'ban_members',
  KICK_MEMBERS: 'kick_members',
  
  // Channel permissions
  VIEW_CHANNEL: 'view_channel',
  SEND_MESSAGES: 'send_messages',
  MANAGE_MESSAGES: 'manage_messages',
  EMBED_LINKS: 'embed_links',
  ATTACH_FILES: 'attach_files',
  ADD_REACTIONS: 'add_reactions',
  USE_EXTERNAL_EMOJIS: 'use_external_emojis',
  MENTION_EVERYONE: 'mention_everyone',
  
  // Voice permissions
  CONNECT: 'connect',
  SPEAK: 'speak',
  VIDEO: 'video',
  MUTE_MEMBERS: 'mute_members',
  DEAFEN_MEMBERS: 'deafen_members',
  MOVE_MEMBERS: 'move_members',
  USE_VAD: 'use_vad', // Voice Activity Detection
  PRIORITY_SPEAKER: 'priority_speaker',
  
  // Admin permissions
  ADMINISTRATOR: 'administrator',
  VIEW_AUDIT_LOG: 'view_audit_log',
  VIEW_SERVER_INSIGHTS: 'view_server_insights',
  MANAGE_WEBHOOKS: 'manage_webhooks'
};

// Message Types
export const MESSAGE_TYPES = {
  DEFAULT: 'default',
  REPLY: 'reply',
  SYSTEM: 'system',
  JOIN: 'join',
  LEAVE: 'leave',
  CALL: 'call',
  PIN: 'pin',
  SUBSCRIPTION: 'subscription',
  EDIT: 'edit',
  DELETE: 'delete'
};

// Channel Types
export const CHANNEL_TYPES = {
  TEXT: 'text',
  VOICE: 'voice',
  VIDEO: 'video',
  ANNOUNCEMENT: 'announcement',
  STAGE: 'stage',
  FORUM: 'forum',
  THREAD: 'thread',
  PRIVATE: 'private'
};

// Server Categories
export const SERVER_CATEGORIES = {
  GAMING: 'gaming',
  MUSIC: 'music',
  EDUCATION: 'education',
  SCIENCE_TECH: 'science_tech',
  ENTERTAINMENT: 'entertainment',
  ANIME_MANGA: 'anime_manga',
  COMMUNITY: 'community',
  LANGUAGE: 'language',
  PROGRAMMING: 'programming',
  ART: 'art',
  SPORTS: 'sports',
  OTHER: 'other'
};

// User Status
export const USER_STATUS = {
  ONLINE: 'online',
  IDLE: 'idle',
  DO_NOT_DISTURB: 'dnd',
  INVISIBLE: 'invisible',
  OFFLINE: 'offline'
};

export const STATUS_COLORS = {
  [USER_STATUS.ONLINE]: '#43b581',
  [USER_STATUS.IDLE]: '#faa61a',
  [USER_STATUS.DO_NOT_DISTURB]: '#f04747',
  [USER_STATUS.INVISIBLE]: '#747f8d',
  [USER_STATUS.OFFLINE]: '#747f8d'
};

// File Upload
export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/webm',
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'application/pdf',
  'application/zip',
  'text/plain',
  'text/html',
  'text/css',
  'text/javascript',
  'application/json'
];

export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const VIDEO_TYPES = ['video/mp4', 'video/webm'];
export const AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg'];

// Limits
export const LIMITS = {
  MESSAGE_LENGTH: 2000,
  USERNAME_MIN: 3,
  USERNAME_MAX: 32,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 128,
  CHANNEL_NAME_MIN: 1,
  CHANNEL_NAME_MAX: 100,
  SERVER_NAME_MIN: 2,
  SERVER_NAME_MAX: 100,
  DESCRIPTION_MAX: 1024,
  BIO_MAX: 256,
  NICKNAME_MAX: 32,
  ROLE_NAME_MAX: 100,
  MAX_ROLES_PER_SERVER: 250,
  MAX_CHANNELS_PER_SERVER: 500,
  MAX_MEMBERS_PER_SERVER: 250000,
  MAX_REACTIONS_PER_MESSAGE: 20,
  MAX_ATTACHMENTS_PER_MESSAGE: 10,
  MAX_EMBEDS_PER_MESSAGE: 10,
  MAX_PINNED_MESSAGES: 50,
  MAX_SERVERS_PER_USER: 100,
  MAX_DM_RECIPIENTS: 10,
  RATE_LIMIT_MESSAGES: 5, // messages per 5 seconds
  RATE_LIMIT_WINDOW: 5000 // 5 seconds
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  MESSAGES_PER_LOAD: 50,
  MEMBERS_PER_PAGE: 30,
  SERVERS_PER_PAGE: 10
};

// WebRTC Configuration
export const WEBRTC_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' }
  ],
  iceCandidatePoolSize: 10,
  offerOptions: {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
  }
};

// Voice Settings
export const VOICE_SETTINGS = {
  DEFAULT_BITRATE: 64000,
  MAX_BITRATE: 128000,
  MIN_BITRATE: 8000,
  DEFAULT_SAMPLE_RATE: 48000,
  ECHO_CANCELLATION: true,
  NOISE_SUPPRESSION: true,
  AUTO_GAIN_CONTROL: true,
  VAD_THRESHOLD: -50, // Voice Activity Detection threshold in dB
  MAX_VOICE_PARTICIPANTS: 99
};

// Video Settings
export const VIDEO_SETTINGS = {
  DEFAULT_RESOLUTION: '720p',
  RESOLUTIONS: {
    '360p': { width: 640, height: 360, frameRate: 30 },
    '480p': { width: 854, height: 480, frameRate: 30 },
    '720p': { width: 1280, height: 720, frameRate: 30 },
    '1080p': { width: 1920, height: 1080, frameRate: 30 }
  },
  MAX_FRAME_RATE: 60,
  MIN_FRAME_RATE: 15,
  DEFAULT_BITRATE: 1500000, // 1.5 Mbps
  SCREEN_SHARE_FRAME_RATE: 30
};

// Notification Types
export const NOTIFICATION_TYPES = {
  MESSAGE: 'message',
  MENTION: 'mention',
  FRIEND_REQUEST: 'friend_request',
  SERVER_INVITE: 'server_invite',
  SYSTEM: 'system',
  UPDATE: 'update',
  WARNING: 'warning',
  ERROR: 'error'
};

// Emoji
export const EMOJI_CATEGORIES = [
  'smileys',
  'people',
  'animals',
  'food',
  'travel',
  'activities',
  'objects',
  'symbols',
  'flags',
  'custom'
];

export const DEFAULT_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

// Themes
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
  CUSTOM: 'custom'
};

export const THEME_COLORS = {
  primary: '#5865F2',
  secondary: '#4752C4',
  success: '#3BA55D',
  danger: '#ED4245',
  warning: '#FAA81A',
  info: '#00AFF4',
  light: '#F2F3F5',
  dark: '#2C2F33',
  darker: '#23272A'
};

// Gamification
export const LEVEL_SYSTEM = {
  BASE_XP: 100,
  XP_MULTIPLIER: 1.5,
  MESSAGE_XP: 10,
  REACTION_XP: 2,
  VOICE_MINUTE_XP: 5,
  DAILY_BONUS_XP: 100,
  STREAK_MULTIPLIER: 1.1
};

export const ACHIEVEMENT_CATEGORIES = {
  SOCIAL: 'social',
  ACTIVITY: 'activity',
  SPECIAL: 'special',
  SEASONAL: 'seasonal',
  HIDDEN: 'hidden'
};

export const BADGE_RARITY = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary'
};

// Marketplace
export const MARKETPLACE_CATEGORIES = {
  THEMES: 'themes',
  BADGES: 'badges',
  EMOTES: 'emotes',
  EFFECTS: 'effects',
  BOOSTS: 'boosts',
  PREMIUM: 'premium'
};

export const CURRENCY = {
  COINS: 'coins',
  GEMS: 'gems',
  CREDITS: 'credits'
};

// Error Codes
export const ERROR_CODES = {
  // Authentication errors (1000-1099)
  INVALID_CREDENTIALS: 1000,
  TOKEN_EXPIRED: 1001,
  TOKEN_INVALID: 1002,
  UNAUTHORIZED: 1003,
  FORBIDDEN: 1004,
  ACCOUNT_DISABLED: 1005,
  ACCOUNT_NOT_VERIFIED: 1006,
  TWO_FACTOR_REQUIRED: 1007,
  TWO_FACTOR_INVALID: 1008,
  
  // Validation errors (1100-1199)
  VALIDATION_ERROR: 1100,
  INVALID_INPUT: 1101,
  MISSING_REQUIRED_FIELD: 1102,
  INVALID_FORMAT: 1103,
  VALUE_TOO_SHORT: 1104,
  VALUE_TOO_LONG: 1105,
  
  // Resource errors (1200-1299)
  NOT_FOUND: 1200,
  ALREADY_EXISTS: 1201,
  CONFLICT: 1202,
  GONE: 1203,
  
  // Rate limiting (1300-1399)
  RATE_LIMITED: 1300,
  TOO_MANY_REQUESTS: 1301,
  
  // Server errors (1400-1499)
  INTERNAL_ERROR: 1400,
  SERVICE_UNAVAILABLE: 1401,
  DATABASE_ERROR: 1402,
  
  // WebSocket errors (1500-1599)
  WS_CONNECTION_FAILED: 1500,
  WS_DISCONNECTED: 1501,
  WS_RECONNECT_FAILED: 1502,
  
  // File errors (1600-1699)
  FILE_TOO_LARGE: 1600,
  INVALID_FILE_TYPE: 1601,
  UPLOAD_FAILED: 1602
};

// Regular Expressions
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME: /^[a-zA-Z0-9_]{3,32}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
  CHANNEL_NAME: /^[a-zA-Z0-9-_]{1,100}$/,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  MENTION_USER: /<@!?(\d+)>/g,
  MENTION_CHANNEL: /<#(\d+)>/g,
  MENTION_ROLE: /<@&(\d+)>/g,
  EMOJI: /:\w+:/g,
  CUSTOM_EMOJI: /<a?:\w+:\d+>/g
};

// Key Codes
export const KEY_CODES = {
  ENTER: 13,
  ESCAPE: 27,
  SPACE: 32,
  ARROW_UP: 38,
  ARROW_DOWN: 40,
  ARROW_LEFT: 37,
  ARROW_RIGHT: 39,
  TAB: 9,
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  DELETE: 46,
  BACKSPACE: 8
};

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'MM/DD/YYYY',
  LONG: 'MMMM DD, YYYY',
  FULL: 'MMMM DD, YYYY HH:mm:ss',
  TIME: 'HH:mm',
  TIME_WITH_SECONDS: 'HH:mm:ss',
  RELATIVE: 'relative', // e.g., "2 hours ago"
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ'
};

// Export default object
export default {
  API_BASE_URL,
  SOCKET_URL,
  CDN_URL,
  APP_NAME,
  APP_VERSION,
  USER_ROLES,
  PERMISSIONS,
  MESSAGE_TYPES,
  CHANNEL_TYPES,
  USER_STATUS,
  LIMITS,
  PAGINATION,
  WEBRTC_CONFIG,
  VOICE_SETTINGS,
  VIDEO_SETTINGS,
  NOTIFICATION_TYPES,
  THEMES,
  ERROR_CODES,
  REGEX
};