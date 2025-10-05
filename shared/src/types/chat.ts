// shared/src/types/chat.ts
import { User, PublicUser } from './user';
import { Message } from './message';
import { ServerRole } from '../constants/roles';

export interface Server {
  id: string;
  name: string;
  icon?: string;
  iconHash?: string;
  splash?: string;
  discoverySplash?: string;
  owner: boolean;
  ownerId: string;
  permissions?: bigint;
  region?: string;
  afkChannelId?: string;
  afkTimeout: number;
  widgetEnabled?: boolean;
  widgetChannelId?: string;
  verificationLevel: VerificationLevel;
  defaultMessageNotifications: DefaultMessageNotificationLevel;
  explicitContentFilter: ExplicitContentFilterLevel;
  roles: Role[];
  emojis: Emoji[];
  features: ServerFeature[];
  mfaLevel: MFALevel;
  applicationId?: string;
  systemChannelId?: string;
  systemChannelFlags: number;
  rulesChannelId?: string;
  maxPresences?: number;
  maxMembers?: number;
  vanityUrlCode?: string;
  description?: string;
  banner?: string;
  premiumTier: PremiumTier;
  premiumSubscriptionCount?: number;
  preferredLocale: string;
  publicUpdatesChannelId?: string;
  maxVideoChannelUsers?: number;
  approximateMemberCount?: number;
  approximatePresenceCount?: number;
  welcomeScreen?: WelcomeScreen;
  nsfwLevel: NSFWLevel;
  stickers?: Sticker[];
  premiumProgressBarEnabled: boolean;
  createdAt: Date;
  channels: Channel[];
  members: ServerMember[];
  memberCount: number;
  presenceCount: number;
  templates?: ServerTemplate[];
  invites?: Invite[];
  bans?: Ban[];
  integrations?: Integration[];
  webhooks?: Webhook[];
  scheduledEvents?: ScheduledEvent[];
}

export interface Channel {
  id: string;
  type: ChannelType;
  serverId?: string;
  position?: number;
  permissionOverwrites?: PermissionOverwrite[];
  name?: string;
  topic?: string;
  nsfw?: boolean;
  lastMessageId?: string;
  bitrate?: number;
  userLimit?: number;
  rateLimitPerUser?: number;
  recipients?: PublicUser[];
  icon?: string;
  ownerId?: string;
  applicationId?: string;
  parentId?: string;
  lastPinTimestamp?: Date;
  rtcRegion?: string;
  videoQualityMode?: VideoQualityMode;
  messageCount?: number;
  memberCount?: number;
  threadMetadata?: ThreadMetadata;
  member?: ThreadMember;
  defaultAutoArchiveDuration?: number;
  permissions?: bigint;
  flags?: number;
  totalMessageSent?: number;
  availableTags?: ForumTag[];
  appliedTags?: string[];
  defaultReactionEmoji?: DefaultReaction;
  defaultThreadRateLimitPerUser?: number;
  defaultSortOrder?: SortOrderType;
  defaultForumLayout?: ForumLayoutType;
  createdAt: Date;
  updatedAt: Date;
}

export enum ChannelType {
  GUILD_TEXT = 0,
  DM = 1,
  GUILD_VOICE = 2,
  GROUP_DM = 3,
  GUILD_CATEGORY = 4,
  GUILD_ANNOUNCEMENT = 5,
  ANNOUNCEMENT_THREAD = 10,
  PUBLIC_THREAD = 11,
  PRIVATE_THREAD = 12,
  GUILD_STAGE_VOICE = 13,
  GUILD_DIRECTORY = 14,
  GUILD_FORUM = 15,
  GUILD_MEDIA = 16,
}

export interface PermissionOverwrite {
  id: string;
  type: OverwriteType;
  allow: bigint;
  deny: bigint;
}

export enum OverwriteType {
  ROLE = 0,
  MEMBER = 1,
}

export interface Role {
  id: string;
  name: string;
  color: number;
  hoist: boolean;
  icon?: string;
  unicodeEmoji?: string;
  position: number;
  permissions: bigint;
  managed: boolean;
  mentionable: boolean;
  tags?: RoleTags;
  flags: number;
}

export interface RoleTags {
  botId?: string;
  integrationId?: string;
  premiumSubscriber?: boolean;
  subscriptionListingId?: string;
  availableForPurchase?: boolean;
  guildConnections?: boolean;
}

export interface Emoji {
  id?: string;
  name?: string;
  roles?: string[];
  user?: PublicUser;
  requireColons?: boolean;
  managed?: boolean;
  animated?: boolean;
  available?: boolean;
}

export interface ServerMember {
  user?: PublicUser;
  userId: string;
  nick?: string;
  avatar?: string;
  roles: string[];
  joinedAt: Date;
  premiumSince?: Date;
  deaf: boolean;
  mute: boolean;
  flags: number;
  pending?: boolean;
  permissions?: bigint;
  communicationDisabledUntil?: Date;
}

export interface VoiceState {
  serverId?: string;
  channelId?: string;
  userId: string;
  member?: ServerMember;
  sessionId: string;
  deaf: boolean;
  mute: boolean;
  selfDeaf: boolean;
  selfMute: boolean;
  selfStream?: boolean;
  selfVideo: boolean;
  suppress: boolean;
  requestToSpeakTimestamp?: Date;
}

export interface Invite {
  code: string;
  guild?: Partial<Server>;
  channel?: Partial<Channel>;
  inviter?: PublicUser;
  targetType?: InviteTargetType;
  targetUser?: PublicUser;
  targetApplication?: Partial<Application>;
  approximatePresenceCount?: number;
  approximateMemberCount?: number;
  expiresAt?: Date;
  stageInstance?: StageInstance;
  guildScheduledEvent?: ScheduledEvent;
  uses?: number;
  maxUses?: number;
  maxAge?: number;
  temporary?: boolean;
  createdAt?: Date;
}

export enum InviteTargetType {
  STREAM = 1,
  EMBEDDED_APPLICATION = 2,
}

export interface Ban {
  reason?: string;
  user: PublicUser;
}

export interface WelcomeScreen {
  description?: string;
  welcomeChannels: WelcomeScreenChannel[];
}

export interface WelcomeScreenChannel {
  channelId: string;
  description: string;
  emojiId?: string;
  emojiName?: string;
}

export interface ServerTemplate {
  code: string;
  name: string;
  description?: string;
  usageCount: number;
  creatorId: string;
  creator: PublicUser;
  createdAt: Date;
  updatedAt: Date;
  sourceGuildId: string;
  serializedSourceGuild: Partial<Server>;
  isDirty?: boolean;
}

export interface Integration {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  syncing?: boolean;
  roleId?: string;
  enableEmoticons?: boolean;
  expireBehavior?: IntegrationExpireBehavior;
  expireGracePeriod?: number;
  user?: PublicUser;
  account: IntegrationAccount;
  syncedAt?: Date;
  subscriberCount?: number;
  revoked?: boolean;
  application?: IntegrationApplication;
  scopes?: string[];
}

export interface IntegrationAccount {
  id: string;
  name: string;
}

export interface IntegrationApplication {
  id: string;
  name: string;
  icon?: string;
  description: string;
  bot?: PublicUser;
}

export enum IntegrationExpireBehavior {
  REMOVE_ROLE = 0,
  KICK = 1,
}

export interface Webhook {
  id: string;
  type: WebhookType;
  serverId?: string;
  channelId?: string;
  user?: PublicUser;
  name?: string;
  avatar?: string;
  token?: string;
  applicationId?: string;
  sourceGuild?: Partial<Server>;
  sourceChannel?: Partial<Channel>;
  url?: string;
}

export enum WebhookType {
  INCOMING = 1,
  CHANNEL_FOLLOWER = 2,
  APPLICATION = 3,
}

export interface ThreadMetadata {
  archived: boolean;
  autoArchiveDuration: number;
  archiveTimestamp: Date;
  locked: boolean;
  invitable?: boolean;
  createTimestamp?: Date;
}

export interface ThreadMember {
  id?: string;
  userId?: string;
  joinTimestamp: Date;
  flags: number;
  member?: ServerMember;
}

export interface StageInstance {
  id: string;
  guildId: string;
  channelId: string;
  topic: string;
  privacyLevel: PrivacyLevel;
  discoverableDisabled: boolean;
  guildScheduledEventId?: string;
}

export interface ScheduledEvent {
  id: string;
  guildId: string;
  channelId?: string;
  creatorId?: string;
  name: string;
  description?: string;
  scheduledStartTime: Date;
  scheduledEndTime?: Date;
  privacyLevel: PrivacyLevel;
  status: ScheduledEventStatus;
  entityType: ScheduledEventEntityType;
  entityId?: string;
  entityMetadata?: ScheduledEventEntityMetadata;
  creator?: PublicUser;
  userCount?: number;
  image?: string;
}

export interface ScheduledEventEntityMetadata {
  location?: string;
}

export interface Application {
  id: string;
  name: string;
  icon?: string;
  description: string;
  rpcOrigins?: string[];
  botPublic: boolean;
  botRequireCodeGrant: boolean;
  termsOfServiceUrl?: string;
  privacyPolicyUrl?: string;
  owner?: PublicUser;
  verifyKey: string;
  team?: Team;
  guildId?: string;
  primarySkuId?: string;
  slug?: string;
  coverImage?: string;
  flags?: number;
  tags?: string[];
  installParams?: InstallParams;
  customInstallUrl?: string;
}

export interface Team {
  icon?: string;
  id: string;
  members: TeamMember[];
  name: string;
  ownerUserId: string;
}

export interface TeamMember {
  membershipState: MembershipState;
  permissions: string[];
  teamId: string;
  user: PublicUser;
}

export interface InstallParams {
  scopes: string[];
  permissions: bigint;
}

export interface ForumTag {
  id: string;
  name: string;
  moderated: boolean;
  emojiId?: string;
  emojiName?: string;
}

export interface DefaultReaction {
  emojiId?: string;
  emojiName?: string;
}

export interface Sticker {
  id: string;
  packId?: string;
  name: string;
  description?: string;
  tags: string;
  type: StickerType;
  formatType: StickerFormatType;
  available?: boolean;
  guildId?: string;
  user?: PublicUser;
  sortValue?: number;
}

// Enums
export enum VerificationLevel {
  NONE = 0,
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  VERY_HIGH = 4,
}

export enum DefaultMessageNotificationLevel {
  ALL_MESSAGES = 0,
  ONLY_MENTIONS = 1,
}

export enum ExplicitContentFilterLevel {
  DISABLED = 0,
  MEMBERS_WITHOUT_ROLES = 1,
  ALL_MEMBERS = 2,
}

export enum MFALevel {
  NONE = 0,
  ELEVATED = 1,
}

export enum PremiumTier {
  NONE = 0,
  TIER_1 = 1,
  TIER_2 = 2,
  TIER_3 = 3,
}

export enum NSFWLevel {
  DEFAULT = 0,
  EXPLICIT = 1,
  SAFE = 2,
  AGE_RESTRICTED = 3,
}

export enum VideoQualityMode {
  AUTO = 1,
  FULL = 2,
}

export enum SortOrderType {
  LATEST_ACTIVITY = 0,
  CREATION_DATE = 1,
}

export enum ForumLayoutType {
  NOT_SET = 0,
  LIST_VIEW = 1,
  GALLERY_VIEW = 2,
}

export enum PrivacyLevel {
  PUBLIC = 1,
  GUILD_ONLY = 2,
}

export enum ScheduledEventStatus {
  SCHEDULED = 1,
  ACTIVE = 2,
  COMPLETED = 3,
  CANCELED = 4,
}

export enum ScheduledEventEntityType {
  STAGE_INSTANCE = 1,
  VOICE = 2,
  EXTERNAL = 3,
}

export enum MembershipState {
  INVITED = 1,
  ACCEPTED = 2,
}

export enum StickerType {
  STANDARD = 1,
  GUILD = 2,
}

export enum StickerFormatType {
  PNG = 1,
  APNG = 2,
  LOTTIE = 3,
  GIF = 4,
}

export type ServerFeature = 
  | 'ANIMATED_BANNER'
  | 'ANIMATED_ICON'
  | 'APPLICATION_COMMAND_PERMISSIONS_V2'
  | 'AUTO_MODERATION'
  | 'BANNER'
  | 'COMMUNITY'
  | 'DEVELOPER_SUPPORT_SERVER'
  | 'DISCOVERABLE'
  | 'FEATURABLE'
  | 'INVITES_DISABLED'
  | 'INVITE_SPLASH'
  | 'MEMBER_VERIFICATION_GATE_ENABLED'
  | 'MONETIZATION_ENABLED'
  | 'MORE_STICKERS'
  | 'NEWS'
  | 'PARTNERED'
  | 'PREVIEW_ENABLED'
  | 'ROLE_ICONS'
  | 'TICKETED_EVENTS_ENABLED'
  | 'VANITY_URL'
  | 'VERIFIED'
  | 'VIP_REGIONS'
  | 'WELCOME_SCREEN_ENABLED';