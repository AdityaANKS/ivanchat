// shared/types/socket.ts
import {
  User,
  Message,
  Channel,
  Server,
  VoiceState,
  UserPresence,
  ServerMember,
  Role,
  Reaction
} from './models';

// Socket Events
export enum SocketEvent {
  // Connection Events
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  RECONNECT = 'reconnect',
  ERROR = 'error',
  
  // Auth Events
  AUTH_SUCCESS = 'auth:success',
  AUTH_ERROR = 'auth:error',
  AUTH_LOGOUT = 'auth:logout',
  
  // User Events
  USER_UPDATE = 'user:update',
  USER_PRESENCE_UPDATE = 'user:presence:update',
  USER_STATUS_UPDATE = 'user:status:update',
  USER_TYPING_START = 'user:typing:start',
  USER_TYPING_STOP = 'user:typing:stop',
  
  // Message Events
  MESSAGE_CREATE = 'message:create',
  MESSAGE_UPDATE = 'message:update',
  MESSAGE_DELETE = 'message:delete',
  MESSAGE_DELETE_BULK = 'message:delete:bulk',
  MESSAGE_REACTION_ADD = 'message:reaction:add',
  MESSAGE_REACTION_REMOVE = 'message:reaction:remove',
  MESSAGE_REACTION_REMOVE_ALL = 'message:reaction:remove:all',
  
  // Channel Events
  CHANNEL_CREATE = 'channel:create',
  CHANNEL_UPDATE = 'channel:update',
  CHANNEL_DELETE = 'channel:delete',
  CHANNEL_JOIN = 'channel:join',
  CHANNEL_LEAVE = 'channel:leave',
  CHANNEL_PINS_UPDATE = 'channel:pins:update',
  
  // Server Events
  SERVER_CREATE = 'server:create',
  SERVER_UPDATE = 'server:update',
  SERVER_DELETE = 'server:delete',
  SERVER_MEMBER_ADD = 'server:member:add',
  SERVER_MEMBER_UPDATE = 'server:member:update',
  SERVER_MEMBER_REMOVE = 'server:member:remove',
  SERVER_BAN_ADD = 'server:ban:add',
  SERVER_BAN_REMOVE = 'server:ban:remove',
  SERVER_ROLE_CREATE = 'server:role:create',
  SERVER_ROLE_UPDATE = 'server:role:update',
  SERVER_ROLE_DELETE = 'server:role:delete',
  SERVER_EMOJI_UPDATE = 'server:emoji:update',
  SERVER_BOOST = 'server:boost',
  
  // Voice Events
  VOICE_STATE_UPDATE = 'voice:state:update',
  VOICE_SERVER_UPDATE = 'voice:server:update',
  VOICE_CHANNEL_JOIN = 'voice:channel:join',
  VOICE_CHANNEL_LEAVE = 'voice:channel:leave',
  VOICE_CHANNEL_MOVE = 'voice:channel:move',
  VOICE_SPEAKING = 'voice:speaking',
  
  // WebRTC Events
  WEBRTC_OFFER = 'webrtc:offer',
  WEBRTC_ANSWER = 'webrtc:answer',
  WEBRTC_ICE_CANDIDATE = 'webrtc:ice:candidate',
  WEBRTC_NEGOTIATE = 'webrtc:negotiate',
  
  // DM Events
  DM_CREATE = 'dm:create',
  DM_DELETE = 'dm:delete',
  
  // Friend Events
  FRIEND_REQUEST_SEND = 'friend:request:send',
  FRIEND_REQUEST_ACCEPT = 'friend:request:accept',
  FRIEND_REQUEST_DECLINE = 'friend:request:decline',
  FRIEND_REMOVE = 'friend:remove',
  
  // Notification Events
  NOTIFICATION_CREATE = 'notification:create',
  NOTIFICATION_UPDATE = 'notification:update',
  NOTIFICATION_DELETE = 'notification:delete',
  
  // Admin Events
  ADMIN_BROADCAST = 'admin:broadcast',
  ADMIN_MAINTENANCE = 'admin:maintenance',
  ADMIN_SHUTDOWN = 'admin:shutdown'
}

// Socket Event Payloads
export interface SocketEventMap {
  [SocketEvent.CONNECT]: void;
  [SocketEvent.DISCONNECT]: { reason: string };
  [SocketEvent.RECONNECT]: { attempt: number };
  [SocketEvent.ERROR]: { error: Error };
  
  [SocketEvent.AUTH_SUCCESS]: { user: User; token: string };
  [SocketEvent.AUTH_ERROR]: { error: string };
  [SocketEvent.AUTH_LOGOUT]: void;
  
  [SocketEvent.USER_UPDATE]: { user: User };
  [SocketEvent.USER_PRESENCE_UPDATE]: { userId: string; presence: UserPresence };
  [SocketEvent.USER_STATUS_UPDATE]: { userId: string; status: string };
  [SocketEvent.USER_TYPING_START]: { userId: string; channelId: string };
  [SocketEvent.USER_TYPING_STOP]: { userId: string; channelId: string };
  
  [SocketEvent.MESSAGE_CREATE]: { message: Message };
  [SocketEvent.MESSAGE_UPDATE]: { message: Message };
  [SocketEvent.MESSAGE_DELETE]: { messageId: string; channelId: string };
  [SocketEvent.MESSAGE_DELETE_BULK]: { messageIds: string[]; channelId: string };
  [SocketEvent.MESSAGE_REACTION_ADD]: { messageId: string; userId: string; reaction: Reaction };
  [SocketEvent.MESSAGE_REACTION_REMOVE]: { messageId: string; userId: string; emoji: string };
  [SocketEvent.MESSAGE_REACTION_REMOVE_ALL]: { messageId: string };
  
  [SocketEvent.CHANNEL_CREATE]: { channel: Channel };
  [SocketEvent.CHANNEL_UPDATE]: { channel: Channel };
  [SocketEvent.CHANNEL_DELETE]: { channelId: string };
  [SocketEvent.CHANNEL_JOIN]: { channelId: string; userId: string };
  [SocketEvent.CHANNEL_LEAVE]: { channelId: string; userId: string };
  [SocketEvent.CHANNEL_PINS_UPDATE]: { channelId: string; lastPinTimestamp: Date };
  
  [SocketEvent.SERVER_CREATE]: { server: Server };
  [SocketEvent.SERVER_UPDATE]: { server: Server };
  [SocketEvent.SERVER_DELETE]: { serverId: string };
  [SocketEvent.SERVER_MEMBER_ADD]: { serverId: string; member: ServerMember };
  [SocketEvent.SERVER_MEMBER_UPDATE]: { serverId: string; member: ServerMember };
  [SocketEvent.SERVER_MEMBER_REMOVE]: { serverId: string; userId: string };
  [SocketEvent.SERVER_BAN_ADD]: { serverId: string; user: User };
  [SocketEvent.SERVER_BAN_REMOVE]: { serverId: string; user: User };
  [SocketEvent.SERVER_ROLE_CREATE]: { serverId: string; role: Role };
  [SocketEvent.SERVER_ROLE_UPDATE]: { serverId: string; role: Role };
  [SocketEvent.SERVER_ROLE_DELETE]: { serverId: string; roleId: string };
  [SocketEvent.SERVER_EMOJI_UPDATE]: { serverId: string; emojis: any[] };
  [SocketEvent.SERVER_BOOST]: { serverId: string; userId: string; level: number };
  
  [SocketEvent.VOICE_STATE_UPDATE]: { voiceState: VoiceState };
  [SocketEvent.VOICE_SERVER_UPDATE]: { token: string; serverId: string; endpoint: string };
  [SocketEvent.VOICE_CHANNEL_JOIN]: { channelId: string; userId: string };
  [SocketEvent.VOICE_CHANNEL_LEAVE]: { channelId: string; userId: string };
  [SocketEvent.VOICE_CHANNEL_MOVE]: { userId: string; oldChannelId: string; newChannelId: string };
  [SocketEvent.VOICE_SPEAKING]: { userId: string; speaking: boolean };
  
  [SocketEvent.WEBRTC_OFFER]: { from: string; offer: RTCSessionDescriptionInit };
  [SocketEvent.WEBRTC_ANSWER]: { from: string; answer: RTCSessionDescriptionInit };
  [SocketEvent.WEBRTC_ICE_CANDIDATE]: { from: string; candidate: RTCIceCandidateInit };
  [SocketEvent.WEBRTC_NEGOTIATE]: { from: string; data: any };
  
  [SocketEvent.DM_CREATE]: { dmChannel: Channel; participants: User[] };
  [SocketEvent.DM_DELETE]: { dmChannelId: string };
  
  [SocketEvent.FRIEND_REQUEST_SEND]: { from: User; to: User };
  [SocketEvent.FRIEND_REQUEST_ACCEPT]: { userId: string };
  [SocketEvent.FRIEND_REQUEST_DECLINE]: { userId: string };
  [SocketEvent.FRIEND_REMOVE]: { userId: string };
  
  [SocketEvent.NOTIFICATION_CREATE]: { notification: Notification };
  [SocketEvent.NOTIFICATION_UPDATE]: { notification: Notification };
  [SocketEvent.NOTIFICATION_DELETE]: { notificationId: string };
  
  [SocketEvent.ADMIN_BROADCAST]: { message: string; type: 'info' | 'warning' | 'error' };
  [SocketEvent.ADMIN_MAINTENANCE]: { startTime: Date; duration: number };
  [SocketEvent.ADMIN_SHUTDOWN]: { reason: string; countdown: number };
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  content: string;
  icon?: string;
  url?: string;
  read: boolean;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export enum NotificationType {
  MESSAGE = 'message',
  MENTION = 'mention',
  FRIEND_REQUEST = 'friend_request',
  SERVER_INVITE = 'server_invite',
  SYSTEM = 'system',
  ACHIEVEMENT = 'achievement',
  LEVEL_UP = 'level_up'
}

// Socket Middleware Types
export interface SocketMiddleware {
  (socket: any, next: (err?: Error) => void): void;
}

export interface SocketRequest {
  userId: string;
  sessionId: string;
  token: string;
  metadata?: Record<string, any>;
}

export interface SocketResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

// Socket Room Types
export enum SocketRoom {
  USER = 'user',
  CHANNEL = 'channel',
  SERVER = 'server',
  VOICE = 'voice',
  DM = 'dm',
  GLOBAL = 'global'
}

export interface SocketRoomJoin {
  room: SocketRoom;
  id: string;
}

export interface SocketRoomLeave {
  room: SocketRoom;
  id: string;
}

// Rate Limiting
export interface SocketRateLimit {
  event: SocketEvent;
  limit: number;
  window: number;
}

export const SOCKET_RATE_LIMITS: SocketRateLimit[] = [
  { event: SocketEvent.MESSAGE_CREATE, limit: 5, window: 5000 },
  { event: SocketEvent.MESSAGE_UPDATE, limit: 3, window: 5000 },
  { event: SocketEvent.MESSAGE_REACTION_ADD, limit: 10, window: 5000 },
  { event: SocketEvent.USER_TYPING_START, limit: 5, window: 10000 },
  { event: SocketEvent.VOICE_STATE_UPDATE, limit: 10, window: 5000 }
];