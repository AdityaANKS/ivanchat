// shared/src/constants/urls.ts

/**
 * API version
 */
export const API_VERSION = 'v1';

/**
 * Base URL paths
 */
export const BASE_PATHS = {
  API: `/api/${API_VERSION}`,
  AUTH: `/api/${API_VERSION}/auth`,
  USERS: `/api/${API_VERSION}/users`,
  MESSAGES: `/api/${API_VERSION}/messages`,
  CHANNELS: `/api/${API_VERSION}/channels`,
  SERVERS: `/api/${API_VERSION}/servers`,
  FILES: `/api/${API_VERSION}/files`,
  WEBHOOKS: `/api/${API_VERSION}/webhooks`,
  ADMIN: `/api/${API_VERSION}/admin`,
  ANALYTICS: `/api/${API_VERSION}/analytics`,
  SEARCH: `/api/${API_VERSION}/search`,
  NOTIFICATIONS: `/api/${API_VERSION}/notifications`,
  VOICE: `/api/${API_VERSION}/voice`,
  PAYMENTS: `/api/${API_VERSION}/payments`,
} as const;

/**
 * Authentication endpoints
 */
export const AUTH_ENDPOINTS = {
  LOGIN: `${BASE_PATHS.AUTH}/login`,
  LOGOUT: `${BASE_PATHS.AUTH}/logout`,
  REGISTER: `${BASE_PATHS.AUTH}/register`,
  REFRESH: `${BASE_PATHS.AUTH}/refresh`,
  VERIFY_EMAIL: `${BASE_PATHS.AUTH}/verify-email`,
  RESEND_VERIFICATION: `${BASE_PATHS.AUTH}/resend-verification`,
  FORGOT_PASSWORD: `${BASE_PATHS.AUTH}/forgot-password`,
  RESET_PASSWORD: `${BASE_PATHS.AUTH}/reset-password`,
  CHANGE_PASSWORD: `${BASE_PATHS.AUTH}/change-password`,
  TWO_FACTOR_ENABLE: `${BASE_PATHS.AUTH}/2fa/enable`,
  TWO_FACTOR_DISABLE: `${BASE_PATHS.AUTH}/2fa/disable`,
  TWO_FACTOR_VERIFY: `${BASE_PATHS.AUTH}/2fa/verify`,
  OAUTH_GOOGLE: `${BASE_PATHS.AUTH}/oauth/google`,
  OAUTH_GITHUB: `${BASE_PATHS.AUTH}/oauth/github`,
  OAUTH_DISCORD: `${BASE_PATHS.AUTH}/oauth/discord`,
} as const;

/**
 * User endpoints
 */
export const USER_ENDPOINTS = {
  PROFILE: `${BASE_PATHS.USERS}/profile`,
  UPDATE_PROFILE: `${BASE_PATHS.USERS}/profile`,
  DELETE_ACCOUNT: `${BASE_PATHS.USERS}/account`,
  GET_USER: (userId: string) => `${BASE_PATHS.USERS}/${userId}`,
  SEARCH_USERS: `${BASE_PATHS.USERS}/search`,
  BLOCK_USER: (userId: string) => `${BASE_PATHS.USERS}/${userId}/block`,
  UNBLOCK_USER: (userId: string) => `${BASE_PATHS.USERS}/${userId}/unblock`,
  REPORT_USER: (userId: string) => `${BASE_PATHS.USERS}/${userId}/report`,
  GET_FRIENDS: `${BASE_PATHS.USERS}/friends`,
  SEND_FRIEND_REQUEST: `${BASE_PATHS.USERS}/friends/request`,
  ACCEPT_FRIEND_REQUEST: (requestId: string) => `${BASE_PATHS.USERS}/friends/request/${requestId}/accept`,
  DECLINE_FRIEND_REQUEST: (requestId: string) => `${BASE_PATHS.USERS}/friends/request/${requestId}/decline`,
  REMOVE_FRIEND: (userId: string) => `${BASE_PATHS.USERS}/friends/${userId}`,
  GET_BLOCKED_USERS: `${BASE_PATHS.USERS}/blocked`,
  UPDATE_SETTINGS: `${BASE_PATHS.USERS}/settings`,
  UPDATE_STATUS: `${BASE_PATHS.USERS}/status`,
  UPDATE_ACTIVITY: `${BASE_PATHS.USERS}/activity`,
} as const;

/**
 * Message endpoints
 */
export const MESSAGE_ENDPOINTS = {
  SEND_MESSAGE: `${BASE_PATHS.MESSAGES}`,
  GET_MESSAGES: (channelId: string) => `${BASE_PATHS.MESSAGES}/channel/${channelId}`,
  GET_MESSAGE: (messageId: string) => `${BASE_PATHS.MESSAGES}/${messageId}`,
  UPDATE_MESSAGE: (messageId: string) => `${BASE_PATHS.MESSAGES}/${messageId}`,
  DELETE_MESSAGE: (messageId: string) => `${BASE_PATHS.MESSAGES}/${messageId}`,
  BULK_DELETE: `${BASE_PATHS.MESSAGES}/bulk-delete`,
  PIN_MESSAGE: (messageId: string) => `${BASE_PATHS.MESSAGES}/${messageId}/pin`,
  UNPIN_MESSAGE: (messageId: string) => `${BASE_PATHS.MESSAGES}/${messageId}/unpin`,
  ADD_REACTION: (messageId: string) => `${BASE_PATHS.MESSAGES}/${messageId}/reactions`,
  REMOVE_REACTION: (messageId: string, emoji: string) => `${BASE_PATHS.MESSAGES}/${messageId}/reactions/${emoji}`,
  GET_REACTIONS: (messageId: string) => `${BASE_PATHS.MESSAGES}/${messageId}/reactions`,
  FORWARD_MESSAGE: (messageId: string) => `${BASE_PATHS.MESSAGES}/${messageId}/forward`,
  REPORT_MESSAGE: (messageId: string) => `${BASE_PATHS.MESSAGES}/${messageId}/report`,
  SEARCH_MESSAGES: `${BASE_PATHS.MESSAGES}/search`,
} as const;

/**
 * Channel endpoints
 */
export const CHANNEL_ENDPOINTS = {
  CREATE_CHANNEL: `${BASE_PATHS.CHANNELS}`,
  GET_CHANNEL: (channelId: string) => `${BASE_PATHS.CHANNELS}/${channelId}`,
  UPDATE_CHANNEL: (channelId: string) => `${BASE_PATHS.CHANNELS}/${channelId}`,
  DELETE_CHANNEL: (channelId: string) => `${BASE_PATHS.CHANNELS}/${channelId}`,
  JOIN_CHANNEL: (channelId: string) => `${BASE_PATHS.CHANNELS}/${channelId}/join`,
  LEAVE_CHANNEL: (channelId: string) => `${BASE_PATHS.CHANNELS}/${channelId}/leave`,
  GET_MEMBERS: (channelId: string) => `${BASE_PATHS.CHANNELS}/${channelId}/members`,
  INVITE_MEMBER: (channelId: string) => `${BASE_PATHS.CHANNELS}/${channelId}/invite`,
  KICK_MEMBER: (channelId: string, userId: string) => `${BASE_PATHS.CHANNELS}/${channelId}/members/${userId}/kick`,
  BAN_MEMBER: (channelId: string, userId: string) => `${BASE_PATHS.CHANNELS}/${channelId}/members/${userId}/ban`,
  UNBAN_MEMBER: (channelId: string, userId: string) => `${BASE_PATHS.CHANNELS}/${channelId}/members/${userId}/unban`,
  UPDATE_PERMISSIONS: (channelId: string) => `${BASE_PATHS.CHANNELS}/${channelId}/permissions`,
  GET_PINNED_MESSAGES: (channelId: string) => `${BASE_PATHS.CHANNELS}/${channelId}/pins`,
  START_TYPING: (channelId: string) => `${BASE_PATHS.CHANNELS}/${channelId}/typing`,
  CREATE_THREAD: (channelId: string) => `${BASE_PATHS.CHANNELS}/${channelId}/threads`,
} as const;

/**
 * Server endpoints
 */
export const SERVER_ENDPOINTS = {
  CREATE_SERVER: `${BASE_PATHS.SERVERS}`,
  GET_SERVER: (serverId: string) => `${BASE_PATHS.SERVERS}/${serverId}`,
  UPDATE_SERVER: (serverId: string) => `${BASE_PATHS.SERVERS}/${serverId}`,
  DELETE_SERVER: (serverId: string) => `${BASE_PATHS.SERVERS}/${serverId}`,
  JOIN_SERVER: `${BASE_PATHS.SERVERS}/join`,
  LEAVE_SERVER: (serverId: string) => `${BASE_PATHS.SERVERS}/${serverId}/leave`,
  GET_MEMBERS: (serverId: string) => `${BASE_PATHS.SERVERS}/${serverId}/members`,
  GET_CHANNELS: (serverId: string) => `${BASE_PATHS.SERVERS}/${serverId}/channels`,
  GET_ROLES: (serverId: string) => `${BASE_PATHS.SERVERS}/${serverId}/roles`,
  CREATE_ROLE: (serverId: string) => `${BASE_PATHS.SERVERS}/${serverId}/roles`,
  UPDATE_ROLE: (serverId: string, roleId: string) => `${BASE_PATHS.SERVERS}/${serverId}/roles/${roleId}`,
  DELETE_ROLE: (serverId: string, roleId: string) => `${BASE_PATHS.SERVERS}/${serverId}/roles/${roleId}`,
  ASSIGN_ROLE: (serverId: string, userId: string) => `${BASE_PATHS.SERVERS}/${serverId}/members/${userId}/roles`,
  CREATE_INVITE: (serverId: string) => `${BASE_PATHS.SERVERS}/${serverId}/invites`,
  GET_INVITES: (serverId: string) => `${BASE_PATHS.SERVERS}/${serverId}/invites`,
  DELETE_INVITE: (serverId: string, code: string) => `${BASE_PATHS.SERVERS}/${serverId}/invites/${code}`,
  GET_BANS: (serverId: string) => `${BASE_PATHS.SERVERS}/${serverId}/bans`,
  GET_AUDIT_LOG: (serverId: string) => `${BASE_PATHS.SERVERS}/${serverId}/audit-log`,
  GET_WEBHOOKS: (serverId: string) => `${BASE_PATHS.SERVERS}/${serverId}/webhooks`,
  CREATE_EMOJI: (serverId: string) => `${BASE_PATHS.SERVERS}/${serverId}/emojis`,
  DELETE_EMOJI: (serverId: string, emojiId: string) => `${BASE_PATHS.SERVERS}/${serverId}/emojis/${emojiId}`,
  BOOST_SERVER: (serverId: string) => `${BASE_PATHS.SERVERS}/${serverId}/boost`,
} as const;

/**
 * File endpoints
 */
export const FILE_ENDPOINTS = {
  UPLOAD: `${BASE_PATHS.FILES}/upload`,
  DOWNLOAD: (fileId: string) => `${BASE_PATHS.FILES}/${fileId}`,
  DELETE: (fileId: string) => `${BASE_PATHS.FILES}/${fileId}`,
  GET_METADATA: (fileId: string) => `${BASE_PATHS.FILES}/${fileId}/metadata`,
  GET_THUMBNAIL: (fileId: string) => `${BASE_PATHS.FILES}/${fileId}/thumbnail`,
} as const;

/**
 * WebSocket endpoints
 */
export const WEBSOCKET_ENDPOINTS = {
  MAIN: '/ws',
  VOICE: '/ws/voice',
  NOTIFICATIONS: '/ws/notifications',
} as const;

/**
 * CDN endpoints
 */
export const CDN_ENDPOINTS = {
  AVATAR: (userId: string, hash: string) => `/avatars/${userId}/${hash}`,
  SERVER_ICON: (serverId: string, hash: string) => `/icons/${serverId}/${hash}`,
  CHANNEL_ICON: (channelId: string, hash: string) => `/channel-icons/${channelId}/${hash}`,
  EMOJI: (emojiId: string) => `/emojis/${emojiId}`,
  STICKER: (stickerId: string) => `/stickers/${stickerId}`,
  BANNER: (id: string, hash: string) => `/banners/${id}/${hash}`,
  ATTACHMENT: (attachmentId: string) => `/attachments/${attachmentId}`,
} as const;

/**
 * External service URLs
 */
export const EXTERNAL_URLS = {
  DOCUMENTATION: 'https://docs.ivanchat.com',
  API_DOCS: 'https://api.ivanchat.com/docs',
  STATUS_PAGE: 'https://status.ivanchat.com',
  SUPPORT: 'https://support.ivanchat.com',
  DISCORD: 'https://discord.gg/ivanchat',
  GITHUB: 'https://github.com/ivanchat',
  TWITTER: 'https://twitter.com/ivanchat',
} as const;

export type ApiEndpoint = 
  | typeof AUTH_ENDPOINTS[keyof typeof AUTH_ENDPOINTS]
  | typeof USER_ENDPOINTS[keyof typeof USER_ENDPOINTS]
  | typeof MESSAGE_ENDPOINTS[keyof typeof MESSAGE_ENDPOINTS]
  | typeof CHANNEL_ENDPOINTS[keyof typeof CHANNEL_ENDPOINTS]
  | typeof SERVER_ENDPOINTS[keyof typeof SERVER_ENDPOINTS]
  | typeof FILE_ENDPOINTS[keyof typeof FILE_ENDPOINTS];