// shared/src/types/message.ts
import { User, PublicUser } from './user';
import { MessageStatus } from '../enums/messageStatus';

export interface Message {
  id: string;
  channelId: string;
  serverId?: string;
  author: PublicUser;
  content: string;
  timestamp: Date;
  editedTimestamp?: Date;
  tts: boolean;
  mentionEveryone: boolean;
  mentions: MessageMention[];
  mentionRoles: string[];
  mentionChannels: ChannelMention[];
  attachments: Attachment[];
  embeds: Embed[];
  reactions: Reaction[];
  nonce?: string;
  pinned: boolean;
  webhookId?: string;
  type: MessageType;
  activity?: MessageActivity;
  application?: MessageApplication;
  applicationId?: string;
  messageReference?: MessageReference;
  flags: number;
  referencedMessage?: Message;
  interaction?: MessageInteraction;
  thread?: Thread;
  components?: MessageComponent[];
  stickers?: Sticker[];
  position?: number;
  roleSubscriptionData?: RoleSubscriptionData;
  status: MessageStatus;
  deletedAt?: Date;
  encryption?: MessageEncryption;
}

export interface MessageMention extends PublicUser {
  member?: {
    nickname?: string;
    roles: string[];
    joinedAt: Date;
  };
}

export interface ChannelMention {
  id: string;
  serverId: string;
  type: number;
  name: string;
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
  durationSecs?: number;
  waveform?: string;
  flags?: number;
}

export interface Embed {
  title?: string;
  type?: EmbedType;
  description?: string;
  url?: string;
  timestamp?: Date;
  color?: number;
  footer?: EmbedFooter;
  image?: EmbedImage;
  thumbnail?: EmbedThumbnail;
  video?: EmbedVideo;
  provider?: EmbedProvider;
  author?: EmbedAuthor;
  fields?: EmbedField[];
}

export type EmbedType = 'rich' | 'image' | 'video' | 'gifv' | 'article' | 'link' | 'poll';

export interface EmbedFooter {
  text: string;
  iconUrl?: string;
  proxyIconUrl?: string;
}

export interface EmbedImage {
  url: string;
  proxyUrl?: string;
  height?: number;
  width?: number;
}

export interface EmbedThumbnail {
  url: string;
  proxyUrl?: string;
  height?: number;
  width?: number;
}

export interface EmbedVideo {
  url?: string;
  proxyUrl?: string;
  height?: number;
  width?: number;
}

export interface EmbedProvider {
  name?: string;
  url?: string;
}

export interface EmbedAuthor {
  name: string;
  url?: string;
  iconUrl?: string;
  proxyIconUrl?: string;
}

export interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface Reaction {
  count: number;
  me: boolean;
  emoji: ReactionEmoji;
  users?: string[];
}

export interface ReactionEmoji {
  id?: string;
  name: string;
  animated?: boolean;
}

export enum MessageType {
  DEFAULT = 0,
  RECIPIENT_ADD = 1,
  RECIPIENT_REMOVE = 2,
  CALL = 3,
  CHANNEL_NAME_CHANGE = 4,
  CHANNEL_ICON_CHANGE = 5,
  CHANNEL_PINNED_MESSAGE = 6,
  USER_JOIN = 7,
  GUILD_BOOST = 8,
  GUILD_BOOST_TIER_1 = 9,
  GUILD_BOOST_TIER_2 = 10,
  GUILD_BOOST_TIER_3 = 11,
  CHANNEL_FOLLOW_ADD = 12,
  GUILD_DISCOVERY_DISQUALIFIED = 14,
  GUILD_DISCOVERY_REQUALIFIED = 15,
  GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING = 16,
  GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING = 17,
  THREAD_CREATED = 18,
  REPLY = 19,
  CHAT_INPUT_COMMAND = 20,
  THREAD_STARTER_MESSAGE = 21,
  GUILD_INVITE_REMINDER = 22,
  CONTEXT_MENU_COMMAND = 23,
  AUTO_MODERATION_ACTION = 24,
  ROLE_SUBSCRIPTION_PURCHASE = 25,
  INTERACTION_PREMIUM_UPSELL = 26,
  STAGE_START = 27,
  STAGE_END = 28,
  STAGE_SPEAKER = 29,
  STAGE_TOPIC = 31,
  GUILD_APPLICATION_PREMIUM_SUBSCRIPTION = 32,
}

export interface MessageActivity {
  type: MessageActivityType;
  partyId?: string;
}

export enum MessageActivityType {
  JOIN = 1,
  SPECTATE = 2,
  LISTEN = 3,
  JOIN_REQUEST = 5,
}

export interface MessageApplication {
  id: string;
  coverImage?: string;
  description: string;
  icon?: string;
  name: string;
}

export interface MessageReference {
  messageId?: string;
  channelId?: string;
  serverId?: string;
  failIfNotExists?: boolean;
}

export interface MessageInteraction {
  id: string;
  type: InteractionType;
  name: string;
  user: PublicUser;
  member?: {
    nickname?: string;
    roles: string[];
    joinedAt: Date;
  };
}

export enum InteractionType {
  PING = 1,
  APPLICATION_COMMAND = 2,
  MESSAGE_COMPONENT = 3,
  APPLICATION_COMMAND_AUTOCOMPLETE = 4,
  MODAL_SUBMIT = 5,
}

export interface Thread {
  id: string;
  type: number;
  name: string;
  lastMessageId?: string;
  lastPinTimestamp?: Date;
  rateLimitPerUser?: number;
  ownerId: string;
  parentId: string;
  messageCount: number;
  memberCount: number;
  archived: boolean;
  autoArchiveDuration: number;
  archiveTimestamp: Date;
  locked: boolean;
  invitable?: boolean;
  createTimestamp: Date;
}

export interface MessageComponent {
  type: ComponentType;
  customId?: string;
  disabled?: boolean;
  style?: ButtonStyle;
  label?: string;
  emoji?: ComponentEmoji;
  url?: string;
  options?: SelectOption[];
  placeholder?: string;
  minValues?: number;
  maxValues?: number;
  components?: MessageComponent[];
  value?: string;
}

export enum ComponentType {
  ACTION_ROW = 1,
  BUTTON = 2,
  STRING_SELECT = 3,
  TEXT_INPUT = 4,
  USER_SELECT = 5,
  ROLE_SELECT = 6,
  MENTIONABLE_SELECT = 7,
  CHANNEL_SELECT = 8,
}

export enum ButtonStyle {
  PRIMARY = 1,
  SECONDARY = 2,
  SUCCESS = 3,
  DANGER = 4,
  LINK = 5,
}

export interface ComponentEmoji {
  id?: string;
  name?: string;
  animated?: boolean;
}

export interface SelectOption {
  label: string;
  value: string;
  description?: string;
  emoji?: ComponentEmoji;
  default?: boolean;
}

export interface Sticker {
  id: string;
  packId?: string;
  name: string;
  description?: string;
  tags: string;
  formatType: StickerFormatType;
  available?: boolean;
  serverId?: string;
  user?: PublicUser;
  sortValue?: number;
}

export enum StickerFormatType {
  PNG = 1,
  APNG = 2,
  LOTTIE = 3,
  GIF = 4,
}

export interface RoleSubscriptionData {
  roleSubscriptionListingId: string;
  tierName: string;
  totalMonthsSubscribed: number;
  isRenewal: boolean;
}

export interface MessageEncryption {
  enabled: boolean;
  keyId?: string;
  algorithm?: string;
  e2ee?: boolean;
}

export interface MessageDraft {
  channelId: string;
  content: string;
  attachments?: File[];
  replyTo?: string;
  mentions?: string[];
  timestamp: Date;
}

export interface MessageEdit {
  messageId: string;
  content?: string;
  embeds?: Embed[];
  attachments?: string[];
  components?: MessageComponent[];
  editedBy: string;
  editedAt: Date;
}

export interface MessageSearchOptions {
  content?: string;
  author?: string;
  mentions?: string;
  has?: ('link' | 'embed' | 'file' | 'video' | 'image' | 'sound')[];
  minId?: string;
  maxId?: string;
  channelId?: string;
  serverId?: string;
  limit?: number;
  offset?: number;
  includeNsfw?: boolean;
  sortBy?: 'relevance' | 'timestamp';
  sortOrder?: 'asc' | 'desc';
}

export interface MessageBulkDelete {
  channelId: string;
  messageIds: string[];
  reason?: string;
  deletedBy: string;
  deletedAt: Date;
}