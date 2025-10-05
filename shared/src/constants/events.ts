// shared/src/constants/events.ts

/**
 * Socket.IO event names shared between client and server
 */
export const SOCKET_EVENTS = {
  // Connection Events
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  CONNECT: 'connect',
  CONNECT_ERROR: 'connect_error',
  RECONNECT: 'reconnect',
  RECONNECT_ATTEMPT: 'reconnect_attempt',
  RECONNECT_ERROR: 'reconnect_error',
  RECONNECT_FAILED: 'reconnect_failed',
  PING: 'ping',
  PONG: 'pong',

  // Authentication Events
  AUTH_REQUEST: 'auth:request',
  AUTH_SUCCESS: 'auth:success',
  AUTH_FAILURE: 'auth:failure',
  AUTH_LOGOUT: 'auth:logout',
  AUTH_REFRESH_TOKEN: 'auth:refresh_token',
  AUTH_SESSION_EXPIRED: 'auth:session_expired',

  // User Events
  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',
  USER_STATUS_UPDATE: 'user:status:update',
  USER_PROFILE_UPDATE: 'user:profile:update',
  USER_TYPING_START: 'user:typing:start',
  USER_TYPING_STOP: 'user:typing:stop',
  USER_PRESENCE_UPDATE: 'user:presence:update',
  USER_ACTIVITY_UPDATE: 'user:activity:update',
  USER_SETTINGS_UPDATE: 'user:settings:update',

  // Message Events
  MESSAGE_SEND: 'message:send',
  MESSAGE_RECEIVE: 'message:receive',
  MESSAGE_UPDATE: 'message:update',
  MESSAGE_DELETE: 'message:delete',
  MESSAGE_BULK_DELETE: 'message:bulk:delete',
  MESSAGE_REACTION_ADD: 'message:reaction:add',
  MESSAGE_REACTION_REMOVE: 'message:reaction:remove',
  MESSAGE_PIN: 'message:pin',
  MESSAGE_UNPIN: 'message:unpin',
  MESSAGE_THREAD_CREATE: 'message:thread:create',
  MESSAGE_FORWARD: 'message:forward',
  MESSAGE_REPORT: 'message:report',

  // Channel Events
  CHANNEL_CREATE: 'channel:create',
  CHANNEL_UPDATE: 'channel:update',
  CHANNEL_DELETE: 'channel:delete',
  CHANNEL_JOIN: 'channel:join',
  CHANNEL_LEAVE: 'channel:leave',
  CHANNEL_INVITE: 'channel:invite',
  CHANNEL_KICK: 'channel:kick',
  CHANNEL_BAN: 'channel:ban',
  CHANNEL_UNBAN: 'channel:unban',
  CHANNEL_PERMISSION_UPDATE: 'channel:permission:update',
  CHANNEL_PINS_UPDATE: 'channel:pins:update',

  // Server Events
  SERVER_CREATE: 'server:create',
  SERVER_UPDATE: 'server:update',
  SERVER_DELETE: 'server:delete',
  SERVER_JOIN: 'server:join',
  SERVER_LEAVE: 'server:leave',
  SERVER_MEMBER_ADD: 'server:member:add',
  SERVER_MEMBER_REMOVE: 'server:member:remove',
  SERVER_MEMBER_UPDATE: 'server:member:update',
  SERVER_ROLE_CREATE: 'server:role:create',
  SERVER_ROLE_UPDATE: 'server:role:update',
  SERVER_ROLE_DELETE: 'server:role:delete',
  SERVER_BAN_ADD: 'server:ban:add',
  SERVER_BAN_REMOVE: 'server:ban:remove',
  SERVER_EMOJI_CREATE: 'server:emoji:create',
  SERVER_EMOJI_UPDATE: 'server:emoji:update',
  SERVER_EMOJI_DELETE: 'server:emoji:delete',
  SERVER_BOOST: 'server:boost',

  // Voice/Video Events
  VOICE_STATE_UPDATE: 'voice:state:update',
  VOICE_CHANNEL_JOIN: 'voice:channel:join',
  VOICE_CHANNEL_LEAVE: 'voice:channel:leave',
  VOICE_CHANNEL_MOVE: 'voice:channel:move',
  VOICE_SPEAKING: 'voice:speaking',
  VOICE_MUTE: 'voice:mute',
  VOICE_UNMUTE: 'voice:unmute',
  VOICE_DEAFEN: 'voice:deafen',
  VOICE_UNDEAFEN: 'voice:undeafen',
  VIDEO_STREAM_START: 'video:stream:start',
  VIDEO_STREAM_STOP: 'video:stream:stop',
  SCREEN_SHARE_START: 'screen:share:start',
  SCREEN_SHARE_STOP: 'screen:share:stop',

  // WebRTC Events
  WEBRTC_OFFER: 'webrtc:offer',
  WEBRTC_ANSWER: 'webrtc:answer',
  WEBRTC_ICE_CANDIDATE: 'webrtc:ice:candidate',
  WEBRTC_NEGOTIATE: 'webrtc:negotiate',
  WEBRTC_PEER_CONNECT: 'webrtc:peer:connect',
  WEBRTC_PEER_DISCONNECT: 'webrtc:peer:disconnect',

  // Direct Message Events
  DM_CREATE: 'dm:create',
  DM_RECEIVE: 'dm:receive',
  DM_UPDATE: 'dm:update',
  DM_DELETE: 'dm:delete',
  DM_TYPING: 'dm:typing',
  DM_READ: 'dm:read',

  // Friend Events
  FRIEND_REQUEST_SEND: 'friend:request:send',
  FRIEND_REQUEST_RECEIVE: 'friend:request:receive',
  FRIEND_REQUEST_ACCEPT: 'friend:request:accept',
  FRIEND_REQUEST_DECLINE: 'friend:request:decline',
  FRIEND_REQUEST_CANCEL: 'friend:request:cancel',
  FRIEND_REMOVE: 'friend:remove',
  FRIEND_BLOCK: 'friend:block',
  FRIEND_UNBLOCK: 'friend:unblock',

  // Notification Events
  NOTIFICATION_CREATE: 'notification:create',
  NOTIFICATION_UPDATE: 'notification:update',
  NOTIFICATION_DELETE: 'notification:delete',
  NOTIFICATION_MARK_READ: 'notification:mark:read',
  NOTIFICATION_MARK_ALL_READ: 'notification:mark:all:read',

  // File Events
  FILE_UPLOAD_START: 'file:upload:start',
  FILE_UPLOAD_PROGRESS: 'file:upload:progress',
  FILE_UPLOAD_COMPLETE: 'file:upload:complete',
  FILE_UPLOAD_ERROR: 'file:upload:error',
  FILE_DELETE: 'file:delete',

  // Admin Events
  ADMIN_USER_BAN: 'admin:user:ban',
  ADMIN_USER_UNBAN: 'admin:user:unban',
  ADMIN_USER_WARN: 'admin:user:warn',
  ADMIN_USER_TIMEOUT: 'admin:user:timeout',
  ADMIN_SERVER_LOCKDOWN: 'admin:server:lockdown',
  ADMIN_BROADCAST: 'admin:broadcast',
  ADMIN_MAINTENANCE: 'admin:maintenance',

  // System Events
  SYSTEM_ANNOUNCEMENT: 'system:announcement',
  SYSTEM_MAINTENANCE: 'system:maintenance',
  SYSTEM_UPDATE: 'system:update',
  SYSTEM_ERROR: 'system:error',
  SYSTEM_WARNING: 'system:warning',

  // Game Events
  GAME_INVITE: 'game:invite',
  GAME_START: 'game:start',
  GAME_END: 'game:end',
  GAME_UPDATE: 'game:update',

  // Bot Events
  BOT_COMMAND: 'bot:command',
  BOT_RESPONSE: 'bot:response',
  BOT_JOIN: 'bot:join',
  BOT_LEAVE: 'bot:leave',

  // Webhook Events
  WEBHOOK_CREATE: 'webhook:create',
  WEBHOOK_UPDATE: 'webhook:update',
  WEBHOOK_DELETE: 'webhook:delete',
  WEBHOOK_EXECUTE: 'webhook:execute',

  // Analytics Events
  ANALYTICS_TRACK: 'analytics:track',
  ANALYTICS_PAGE_VIEW: 'analytics:page:view',
  ANALYTICS_EVENT: 'analytics:event',

  // Error Events
  ERROR: 'error',
  ERROR_MESSAGE: 'error:message',
  ERROR_VALIDATION: 'error:validation',
  ERROR_PERMISSION: 'error:permission',
  ERROR_RATE_LIMIT: 'error:rate_limit',
} as const;

/**
 * REST API event names for logging/analytics
 */
export const API_EVENTS = {
  // Auth
  LOGIN: 'api:auth:login',
  LOGOUT: 'api:auth:logout',
  REGISTER: 'api:auth:register',
  PASSWORD_RESET: 'api:auth:password:reset',
  EMAIL_VERIFY: 'api:auth:email:verify',
  TOKEN_REFRESH: 'api:auth:token:refresh',
  TWO_FACTOR_ENABLE: 'api:auth:2fa:enable',
  TWO_FACTOR_VERIFY: 'api:auth:2fa:verify',

  // User
  USER_GET: 'api:user:get',
  USER_UPDATE: 'api:user:update',
  USER_DELETE: 'api:user:delete',
  USER_SEARCH: 'api:user:search',

  // Message
  MESSAGE_CREATE: 'api:message:create',
  MESSAGE_UPDATE: 'api:message:update',
  MESSAGE_DELETE: 'api:message:delete',
  MESSAGE_LIST: 'api:message:list',

  // Channel
  CHANNEL_CREATE: 'api:channel:create',
  CHANNEL_UPDATE: 'api:channel:update',
  CHANNEL_DELETE: 'api:channel:delete',
  CHANNEL_LIST: 'api:channel:list',

  // Server
  SERVER_CREATE: 'api:server:create',
  SERVER_UPDATE: 'api:server:update',
  SERVER_DELETE: 'api:server:delete',
  SERVER_LIST: 'api:server:list',

  // File
  FILE_UPLOAD: 'api:file:upload',
  FILE_DELETE: 'api:file:delete',
  FILE_GET: 'api:file:get',
} as const;

/**
 * Internal application events for event bus
 */
export const APP_EVENTS = {
  // Cache Events
  CACHE_INVALIDATE: 'cache:invalidate',
  CACHE_CLEAR: 'cache:clear',
  CACHE_UPDATE: 'cache:update',

  // Database Events
  DB_CONNECT: 'db:connect',
  DB_DISCONNECT: 'db:disconnect',
  DB_ERROR: 'db:error',

  // Queue Events
  QUEUE_JOB_ADD: 'queue:job:add',
  QUEUE_JOB_COMPLETE: 'queue:job:complete',
  QUEUE_JOB_FAILED: 'queue:job:failed',

  // Email Events
  EMAIL_SEND: 'email:send',
  EMAIL_SENT: 'email:sent',
  EMAIL_FAILED: 'email:failed',

  // Worker Events
  WORKER_START: 'worker:start',
  WORKER_STOP: 'worker:stop',
  WORKER_ERROR: 'worker:error',
} as const;

export type SocketEventName = typeof SOCKET_EVENTS[keyof typeof SOCKET_EVENTS];
export type ApiEventName = typeof API_EVENTS[keyof typeof API_EVENTS];
export type AppEventName = typeof APP_EVENTS[keyof typeof APP_EVENTS];