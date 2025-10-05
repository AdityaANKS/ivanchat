// shared/types/models.ts
export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar?: string;
  banner?: string;
  bio?: string;
  status: UserStatus;
  presence: UserPresence;
  verified: boolean;
  twoFactorEnabled: boolean;
  roles: Role[];
  servers: string[];
  friends: string[];
  blockedUsers: string[];
  settings: UserSettings;
  gamification?: UserGamification;
  createdAt: Date;
  updatedAt: Date;
  lastSeenAt?: Date;
}

export interface UserStatus {
  type: 'online' | 'idle' | 'dnd' | 'invisible' | 'offline';
  message?: string;
  emoji?: string;
  expiresAt?: Date;
}

export interface UserPresence {
  status: 'online' | 'idle' | 'dnd' | 'invisible' | 'offline';
  activities: Activity[];
  clientStatus: {
    desktop?: 'online' | 'idle' | 'dnd';
    mobile?: 'online' | 'idle' | 'dnd';
    web?: 'online' | 'idle' | 'dnd';
  };
}

export interface Activity {
  name: string;
  type: 'playing' | 'streaming' | 'listening' | 'watching' | 'custom' | 'competing';
  url?: string;
  details?: string;
  state?: string;
  timestamps?: {
    start?: number;
    end?: number;
  };
  applicationId?: string;
  party?: {
    id?: string;
    size?: [number, number];
  };
  assets?: {
    largeImage?: string;
    largeText?: string;
    smallImage?: string;
    smallText?: string;
  };
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  accessibility: AccessibilitySettings;
  appearance: AppearanceSettings;
}

export interface NotificationSettings {
  desktop: boolean;
  email: boolean;
  push: boolean;
  sounds: boolean;
  messagePreview: boolean;
  directMessages: 'all' | 'friends' | 'none';
  serverMessages: 'all' | 'mentions' | 'none';
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  onlineStatus: boolean;
  readReceipts: boolean;
  typingIndicators: boolean;
  activityStatus: boolean;
}

export interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  highContrast: boolean;
  screenReaderMode: boolean;
  colorBlindMode?: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

export interface AppearanceSettings {
  compactMode: boolean;
  showAvatars: boolean;
  showEmbeds: boolean;
  animatedEmojis: boolean;
  gifAutoplay: boolean;
  customCSS?: string;
}

export interface Server {
  id: string;
  name: string;
  icon?: string;
  banner?: string;
  description?: string;
  owner: string;
  members: ServerMember[];
  channels: Channel[];
  roles: Role[];
  emojis: CustomEmoji[];
  stickers: Sticker[];
  invites: Invite[];
  bans: Ban[];
  settings: ServerSettings;
  features: ServerFeature[];
  boostLevel: number;
  boostCount: number;
  verificationLevel: VerificationLevel;
  explicitContentFilter: ExplicitContentFilter;
  systemChannel?: string;
  rulesChannel?: string;
  publicUpdatesChannel?: string;
  maxMembers: number;
  memberCount: number;
  presenceCount: number;
  template?: ServerTemplate;
  vanityUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServerMember {
  userId: string;
  serverId: string;
  nickname?: string;
  roles: string[];
  joinedAt: Date;
  premiumSince?: Date;
  deaf: boolean;
  mute: boolean;
  pending: boolean;
  permissions: string[];
  communicationDisabledUntil?: Date;
}

export interface Channel {
  id: string;
  serverId?: string;
  name: string;
  type: ChannelType;
  topic?: string;
  icon?: string;
  position: number;
  permissions: ChannelPermission[];
  parentId?: string;
  nsfw: boolean;
  rateLimitPerUser?: number;
  bitrate?: number;
  userLimit?: number;
  rtcRegion?: string;
  videoQualityMode?: VideoQualityMode;
  messages: Message[];
  pinnedMessages: string[];
  lastMessageId?: string;
  lastPinTimestamp?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum ChannelType {
  TEXT = 0,
  VOICE = 1,
  CATEGORY = 2,
  NEWS = 3,
  STORE = 4,
  NEWS_THREAD = 5,
  PUBLIC_THREAD = 6,
  PRIVATE_THREAD = 7,
  STAGE = 8,
  DIRECTORY = 9,
  FORUM = 10
}

export interface Message {
  id: string;
  channelId: string;
  authorId: string;
  content: string;
  timestamp: Date;
  editedTimestamp?: Date;
  tts: boolean;
  mentionEveryone: boolean;
  mentions: string[];
  mentionRoles: string[];
  mentionChannels: string[];
  attachments: Attachment[];
  embeds: Embed[];
  reactions: Reaction[];
  nonce?: string;
  pinned: boolean;
  webhookId?: string;
  type: MessageType;
  activity?: MessageActivity;
  application?: Application;
  messageReference?: MessageReference;
  flags: MessageFlags;
  stickers: Sticker[];
  referencedMessage?: Message;
  interaction?: MessageInteraction;
  thread?: Channel;
  components: MessageComponent[];
  encrypted?: boolean;
  encryptionKeyId?: string;
}

export enum MessageType {
  DEFAULT = 0,
  RECIPIENT_ADD = 1,
  RECIPIENT_REMOVE = 2,
  CALL = 3,
  CHANNEL_NAME_CHANGE = 4,
  CHANNEL_ICON_CHANGE = 5,
  CHANNEL_PINNED_MESSAGE = 6,
  GUILD_MEMBER_JOIN = 7,
  USER_PREMIUM_GUILD_SUBSCRIPTION = 8,
  USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1 = 9,
  USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2 = 10,
  USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3 = 11,
  CHANNEL_FOLLOW_ADD = 12,
  GUILD_DISCOVERY_DISQUALIFIED = 14,
  GUILD_DISCOVERY_REQUALIFIED = 15,
  REPLY = 19,
  APPLICATION_COMMAND = 20,
  GUILD_INVITE_REMINDER = 22
}

export interface Attachment {
  id: string;
  filename: string;
  description?: string;
  contentType?: string;
  size: number;
  url: string;
  proxyUrl: string;
  height?: number;
  width?: number;
  ephemeral?: boolean;
  duration?: number;
  waveform?: string;
}

export interface Embed {
  title?: string;
  type?: 'rich' | 'image' | 'video' | 'gifv' | 'article' | 'link';
  description?: string;
  url?: string;
  timestamp?: Date;
  color?: number;
  footer?: {
    text: string;
    iconUrl?: string;
    proxyIconUrl?: string;
  };
  image?: {
    url?: string;
    proxyUrl?: string;
    height?: number;
    width?: number;
  };
  thumbnail?: {
    url?: string;
    proxyUrl?: string;
    height?: number;
    width?: number;
  };
  video?: {
    url?: string;
    proxyUrl?: string;
    height?: number;
    width?: number;
  };
  provider?: {
    name?: string;
    url?: string;
  };
  author?: {
    name?: string;
    url?: string;
    iconUrl?: string;
    proxyIconUrl?: string;
  };
  fields?: {
    name: string;
    value: string;
    inline?: boolean;
  }[];
}

export interface Reaction {
  count: number;
  me: boolean;
  emoji: {
    id?: string;
    name: string;
    animated?: boolean;
  };
  users: string[];
}

export interface Role {
  id: string;
  serverId: string;
  name: string;
  color: number;
  hoist: boolean;
  icon?: string;
  unicodeEmoji?: string;
  position: number;
  permissions: string[];
  managed: boolean;
  mentionable: boolean;
  tags?: RoleTags;
}

export interface RoleTags {
  botId?: string;
  integrationId?: string;
  premiumSubscriber?: boolean;
}

export interface CustomEmoji {
  id: string;
  name: string;
  roles: string[];
  user?: User;
  requireColons: boolean;
  managed: boolean;
  animated: boolean;
  available: boolean;
}

export interface Sticker {
  id: string;
  packId?: string;
  name: string;
  description?: string;
  tags: string;
  type: 'standard' | 'guild';
  formatType: 'png' | 'apng' | 'lottie';
  available?: boolean;
  guildId?: string;
  user?: User;
  sortValue?: number;
}

export interface Invite {
  code: string;
  guild?: Server;
  channel?: Channel;
  inviter?: User;
  targetType?: number;
  targetUser?: User;
  targetApplication?: Application;
  approximatePresenceCount?: number;
  approximateMemberCount?: number;
  expiresAt?: Date;
  uses?: number;
  maxUses?: number;
  maxAge?: number;
  temporary?: boolean;
  createdAt: Date;
}

export interface Ban {
  reason?: string;
  user: User;
}

export interface ServerSettings {
  defaultMessageNotifications: 'all' | 'mentions';
  explicitContentFilter: ExplicitContentFilter;
  verificationLevel: VerificationLevel;
  afkTimeout: number;
  afkChannel?: string;
  systemChannel?: string;
  systemChannelFlags: number;
  premiumTier: number;
  premiumSubscriptionCount: number;
  preferredLocale: string;
  publicUpdatesChannel?: string;
  maxVideoChannelUsers?: number;
  welcomeScreen?: WelcomeScreen;
  nsfwLevel: NSFWLevel;
}

export interface WelcomeScreen {
  description?: string;
  welcomeChannels: {
    channelId: string;
    description: string;
    emojiId?: string;
    emojiName?: string;
  }[];
}

export enum VerificationLevel {
  NONE = 0,
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  VERY_HIGH = 4
}

export enum ExplicitContentFilter {
  DISABLED = 0,
  MEMBERS_WITHOUT_ROLES = 1,
  ALL_MEMBERS = 2
}

export enum NSFWLevel {
  DEFAULT = 0,
  EXPLICIT = 1,
  SAFE = 2,
  AGE_RESTRICTED = 3
}

export enum VideoQualityMode {
  AUTO = 1,
  FULL = 2
}

export interface ServerFeature {
  name: string;
  enabled: boolean;
  config?: Record<string, any>;
}

export interface ServerTemplate {
  code: string;
  name: string;
  description?: string;
  usageCount: number;
  creatorId: string;
  creator: User;
  createdAt: Date;
  updatedAt: Date;
  sourceGuildId: string;
  serializedSourceGuild: Partial<Server>;
  isDirty?: boolean;
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
  owner?: User;
  summary: string;
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
  membershipState: number;
  permissions: string[];
  teamId: string;
  user: User;
}

export interface InstallParams {
  scopes: string[];
  permissions: string;
}

export interface MessageActivity {
  type: number;
  partyId?: string;
}

export interface MessageReference {
  messageId?: string;
  channelId?: string;
  guildId?: string;
  failIfNotExists?: boolean;
}

export interface MessageFlags {
  crossposted?: boolean;
  isCrosspost?: boolean;
  suppressEmbeds?: boolean;
  sourceMessageDeleted?: boolean;
  urgent?: boolean;
  hasThread?: boolean;
  ephemeral?: boolean;
  loading?: boolean;
  failedToMentionSomeRolesInThread?: boolean;
}

export interface MessageInteraction {
  id: string;
  type: number;
  name: string;
  user: User;
  member?: ServerMember;
}

export interface MessageComponent {
  type: ComponentType;
  customId?: string;
  disabled?: boolean;
  style?: ButtonStyle;
  label?: string;
  emoji?: {
    id?: string;
    name?: string;
    animated?: boolean;
  };
  url?: string;
  options?: SelectOption[];
  placeholder?: string;
  minValues?: number;
  maxValues?: number;
  components?: MessageComponent[];
}

export enum ComponentType {
  ACTION_ROW = 1,
  BUTTON = 2,
  SELECT_MENU = 3,
  TEXT_INPUT = 4
}

export enum ButtonStyle {
  PRIMARY = 1,
  SECONDARY = 2,
  SUCCESS = 3,
  DANGER = 4,
  LINK = 5
}

export interface SelectOption {
  label: string;
  value: string;
  description?: string;
  emoji?: {
    id?: string;
    name?: string;
    animated?: boolean;
  };
  default?: boolean;
}

export interface ChannelPermission {
  id: string;
  type: 'role' | 'member';
  allow: string[];
  deny: string[];
}

export interface UserGamification {
  level: number;
  experience: number;
  nextLevelExperience: number;
  badges: Badge[];
  achievements: Achievement[];
  quests: Quest[];
  statistics: UserStatistics;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  progress: number;
  maxProgress: number;
  completed: boolean;
  completedAt?: Date;
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  objectives: QuestObjective[];
  rewards: QuestReward[];
  expiresAt: Date;
  completed: boolean;
  completedAt?: Date;
}

export interface QuestObjective {
  id: string;
  description: string;
  progress: number;
  required: number;
  completed: boolean;
}

export interface QuestReward {
  type: 'experience' | 'badge' | 'currency' | 'item';
  value: string | number;
  quantity: number;
}

export interface UserStatistics {
  messagesSent: number;
  voiceMinutes: number;
  serversJoined: number;
  friendsAdded: number;
  reactionsGiven: number;
  filesShared: number;
  screenshotsShared: number;
  streamingHours: number;
}

export interface DirectMessage {
  id: string;
  participants: string[];
  messages: Message[];
  lastMessageId?: string;
  lastMessageTimestamp?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface VoiceState {
  channelId?: string;
  userId: string;
  serverId?: string;
  sessionId: string;
  deaf: boolean;
  mute: boolean;
  selfDeaf: boolean;
  selfMute: boolean;
  selfStream: boolean;
  selfVideo: boolean;
  suppress: boolean;
  requestToSpeakTimestamp?: Date;
}

export interface Webhook {
  id: string;
  type: WebhookType;
  guildId?: string;
  channelId?: string;
  user?: User;
  name?: string;
  avatar?: string;
  token?: string;
  applicationId?: string;
  sourceGuild?: Server;
  sourceChannel?: Channel;
  url?: string;
}

export enum WebhookType {
  INCOMING = 1,
  CHANNEL_FOLLOWER = 2,
  APPLICATION = 3
}

export interface AuditLog {
  webhooks: Webhook[];
  users: User[];
  auditLogEntries: AuditLogEntry[];
  integrations: Integration[];
}

export interface AuditLogEntry {
  targetId?: string;
  changes?: AuditLogChange[];
  userId?: string;
  id: string;
  actionType: number;
  options?: AuditLogOptions;
  reason?: string;
}

export interface AuditLogChange {
  newValue?: any;
  oldValue?: any;
  key: string;
}

export interface AuditLogOptions {
  deleteMemberDays?: string;
  membersRemoved?: string;
  channelId?: string;
  messageId?: string;
  count?: string;
  id?: string;
  type?: string;
  roleName?: string;
}

export interface Integration {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  syncing?: boolean;
  roleId?: string;
  enableEmoticons?: boolean;
  expireBehavior?: number;
  expireGracePeriod?: number;
  user?: User;
  account: IntegrationAccount;
  syncedAt?: Date;
  subscriberCount?: number;
  revoked?: boolean;
  application?: Application;
}

export interface IntegrationAccount {
  id: string;
  name: string;
}