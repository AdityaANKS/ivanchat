// shared/types/api.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: ResponseMetadata;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  stack?: string;
  timestamp: Date;
}

export interface ResponseMetadata {
  timestamp: Date;
  requestId: string;
  version: string;
  pagination?: PaginationMetadata;
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface SearchParams extends PaginationParams {
  q?: string;
  filters?: Record<string, any>;
}

// Auth API
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
  captchaToken?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  displayName?: string;
  acceptTerms: boolean;
  captchaToken?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ResetPasswordRequest {
  email: string;
  captchaToken?: string;
}

export interface ConfirmResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface Enable2FARequest {
  password: string;
}

export interface Enable2FAResponse {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface Verify2FARequest {
  code: string;
  trust?: boolean;
}

export interface OAuth2AuthorizeRequest {
  provider: 'google' | 'github' | 'discord' | 'twitter' | 'facebook';
  redirectUri?: string;
  state?: string;
}

// User API
export interface UpdateUserRequest {
  displayName?: string;
  bio?: string;
  avatar?: string;
  banner?: string;
  status?: UserStatus;
  settings?: Partial<UserSettings>;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface SearchUsersRequest extends SearchParams {
  username?: string;
  email?: string;
  serverId?: string;
}

// Message API
export interface SendMessageRequest {
  content: string;
  attachments?: string[];
  embeds?: Embed[];
  replyTo?: string;
  mentions?: string[];
  ephemeral?: boolean;
  encrypted?: boolean;
}

export interface EditMessageRequest {
  content?: string;
  embeds?: Embed[];
  attachments?: string[];
}

export interface SearchMessagesRequest extends SearchParams {
  channelId?: string;
  authorId?: string;
  content?: string;
  hasAttachment?: boolean;
  hasEmbed?: boolean;
  before?: Date;
  after?: Date;
}

// Channel API
export interface CreateChannelRequest {
  name: string;
  type: ChannelType;
  topic?: string;
  parentId?: string;
  position?: number;
  nsfw?: boolean;
  rateLimitPerUser?: number;
  bitrate?: number;
  userLimit?: number;
  permissions?: ChannelPermission[];
}

export interface UpdateChannelRequest {
  name?: string;
  topic?: string;
  position?: number;
  nsfw?: boolean;
  rateLimitPerUser?: number;
  bitrate?: number;
  userLimit?: number;
  permissions?: ChannelPermission[];
}

// Server API
export interface CreateServerRequest {
  name: string;
  icon?: string;
  description?: string;
  template?: string;
  channels?: CreateChannelRequest[];
  roles?: CreateRoleRequest[];
}

export interface UpdateServerRequest {
  name?: string;
  icon?: string;
  banner?: string;
  description?: string;
  verificationLevel?: VerificationLevel;
  explicitContentFilter?: ExplicitContentFilter;
  defaultMessageNotifications?: 'all' | 'mentions';
  afkChannelId?: string;
  afkTimeout?: number;
  systemChannelId?: string;
  rulesChannelId?: string;
  publicUpdatesChannelId?: string;
  preferredLocale?: string;
}

export interface CreateRoleRequest {
  name: string;
  color?: number;
  hoist?: boolean;
  mentionable?: boolean;
  permissions?: string[];
  position?: number;
}

export interface UpdateRoleRequest {
  name?: string;
  color?: number;
  hoist?: boolean;
  mentionable?: boolean;
  permissions?: string[];
  position?: number;
}

export interface CreateInviteRequest {
  maxAge?: number;
  maxUses?: number;
  temporary?: boolean;
  unique?: boolean;
  targetType?: number;
  targetUserId?: string;
  targetApplicationId?: string;
}

// Voice API
export interface JoinVoiceChannelRequest {
  channelId: string;
  selfMute?: boolean;
  selfDeaf?: boolean;
}

export interface UpdateVoiceStateRequest {
  selfMute?: boolean;
  selfDeaf?: boolean;
  selfVideo?: boolean;
  selfStream?: boolean;
}

// File Upload API
export interface UploadFileRequest {
  file: File | Blob;
  filename?: string;
  contentType?: string;
  maxSize?: number;
  allowedTypes?: string[];
}

export interface UploadResponse {
  id: string;
  url: string;
  filename: string;
  size: number;
  contentType: string;
  thumbnailUrl?: string;
  metadata?: Record<string, any>;
}

// Webhook API
export interface CreateWebhookRequest {
  name: string;
  avatar?: string;
  channelId: string;
}

export interface ExecuteWebhookRequest {
  content?: string;
  username?: string;
  avatarUrl?: string;
  tts?: boolean;
  embeds?: Embed[];
  allowedMentions?: AllowedMentions;
  components?: MessageComponent[];
  files?: File[];
  attachments?: Attachment[];
  flags?: number;
  threadName?: string;
}

export interface AllowedMentions {
  parse?: ('roles' | 'users' | 'everyone')[];
  roles?: string[];
  users?: string[];
  repliedUser?: boolean;
}

// Analytics API
export interface AnalyticsQuery {
  metric: string;
  dimensions?: string[];
  filters?: Record<string, any>;
  startDate: Date;
  endDate: Date;
  granularity?: 'minute' | 'hour' | 'day' | 'week' | 'month';
}

export interface AnalyticsResponse {
  metric: string;
  data: AnalyticsDataPoint[];
  summary: AnalyticsSummary;
}

export interface AnalyticsDataPoint {
  timestamp: Date;
  value: number;
  dimensions?: Record<string, any>;
}

export interface AnalyticsSummary {
  total: number;
  average: number;
  min: number;
  max: number;
  count: number;
}

// Import user types from models
import {
  User,
  UserStatus,
  UserSettings,
  Message,
  Channel,
  ChannelType,
  ChannelPermission,
  Server,
  Role,
  Embed,
  Attachment,
  MessageComponent,
  VerificationLevel,
  ExplicitContentFilter
} from './models';

// Re-export for convenience
export * from './models';