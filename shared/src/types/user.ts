// shared/src/types/user.ts
import { ServerRole, SystemRole } from '../constants/roles';

export interface User {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  discriminator: string; // e.g., "0001" for username#0001
  avatar?: string;
  banner?: string;
  bio?: string;
  status: UserStatus;
  presence: UserPresence;
  settings: UserSettings;
  profile: UserProfile;
  security: UserSecurity;
  subscription?: UserSubscription;
  flags: number;
  verified: boolean;
  bot: boolean;
  system: boolean;
  mfaEnabled: boolean;
  locale: string;
  premiumType: PremiumType;
  publicFlags: number;
  createdAt: Date;
  updatedAt: Date;
  lastSeenAt?: Date;
  deletedAt?: Date;
}

export interface UserStatus {
  type: 'online' | 'idle' | 'dnd' | 'invisible' | 'offline';
  message?: string;
  emoji?: string;
  expiresAt?: Date;
  setBy: 'user' | 'system';
}

export interface UserPresence {
  status: 'online' | 'idle' | 'dnd' | 'invisible' | 'offline';
  activities: Activity[];
  clientStatus: ClientStatus;
  lastSeen?: Date;
}

export interface Activity {
  id: string;
  name: string;
  type: ActivityType;
  url?: string;
  createdAt: Date;
  timestamps?: {
    start?: Date;
    end?: Date;
  };
  applicationId?: string;
  details?: string;
  state?: string;
  emoji?: {
    name: string;
    id?: string;
    animated?: boolean;
  };
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
  secrets?: {
    join?: string;
    spectate?: string;
    match?: string;
  };
  instance?: boolean;
  flags?: number;
  buttons?: string[];
}

export enum ActivityType {
  PLAYING = 0,
  STREAMING = 1,
  LISTENING = 2,
  WATCHING = 3,
  CUSTOM = 4,
  COMPETING = 5,
}

export interface ClientStatus {
  desktop?: 'online' | 'idle' | 'dnd' | 'offline';
  mobile?: 'online' | 'idle' | 'dnd' | 'offline';
  web?: 'online' | 'idle' | 'dnd' | 'offline';
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  dateFormat: string;
  messageDisplay: 'cozy' | 'compact';
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  accessibility: AccessibilitySettings;
  appearance: AppearanceSettings;
  voice: VoiceSettings;
  keybinds: KeybindSettings[];
  folders: ServerFolder[];
}

export interface NotificationSettings {
  desktop: boolean;
  email: boolean;
  push: boolean;
  sounds: boolean;
  messagePreview: boolean;
  inAppSounds: boolean;
  directMessages: 'all' | 'friends' | 'none';
  serverMessages: 'all' | 'mentions' | 'none';
  friendRequests: boolean;
  serverInvites: boolean;
  quietHours?: {
    enabled: boolean;
    start: string; // "22:00"
    end: string; // "08:00"
  };
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  onlineStatus: boolean;
  readReceipts: boolean;
  typingIndicators: boolean;
  activityStatus: boolean;
  directMessagesFrom: 'anyone' | 'friends' | 'none';
  friendRequestsFrom: 'anyone' | 'friends-of-friends' | 'none';
  dataCollection: boolean;
  analyticsTracking: boolean;
}

export interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  zoom: number; // 50-200
  reducedMotion: boolean;
  highContrast: boolean;
  colorBlindMode?: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  screenReaderMode: boolean;
  keyboardNavigation: boolean;
  focusIndicators: boolean;
}

export interface AppearanceSettings {
  compactMode: boolean;
  showAvatars: boolean;
  showEmbeds: boolean;
  showAttachmentPreview: boolean;
  animatedEmojis: boolean;
  animatedStickers: boolean;
  gifAutoplay: boolean;
  emojiReactionSkin: number; // 1-6
  customCSS?: string;
  font?: string;
}

export interface VoiceSettings {
  inputDevice?: string;
  outputDevice?: string;
  inputVolume: number; // 0-100
  outputVolume: number; // 0-100
  echoCancellation: boolean;
  noiseSuppression: boolean;
  automaticGainControl: boolean;
  pushToTalk: boolean;
  pushToTalkKey?: string;
  voiceActivityDetection: boolean;
  sensitivity: number; // 0-100
  qosHighPacketPriority: boolean;
  silenceWarning: boolean;
  deaf: boolean;
  mute: boolean;
}

export interface KeybindSettings {
  action: string;
  keys: string[];
  enabled: boolean;
}

export interface ServerFolder {
  id: string;
  name?: string;
  serverIds: string[];
  color?: string;
}

export interface UserProfile {
  pronouns?: string;
  birthday?: Date;
  location?: string;
  occupation?: string;
  company?: string;
  website?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
    twitch?: string;
    spotify?: string;
    reddit?: string;
    steam?: string;
  };
  interests?: string[];
  badges?: Badge[];
  customStatus?: CustomStatus;
  accentColor?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  obtainedAt: Date;
}

export interface CustomStatus {
  text?: string;
  emoji?: {
    id?: string;
    name: string;
    animated?: boolean;
  };
  expiresAt?: Date;
}

export interface UserSecurity {
  twoFactorEnabled: boolean;
  twoFactorType?: 'totp' | 'sms' | 'email';
  securityKeys?: SecurityKey[];
  sessions: Session[];
  passwordChangedAt?: Date;
  loginAttempts: number;
  lockedUntil?: Date;
  backupCodes?: string[];
  trustedDevices?: TrustedDevice[];
}

export interface SecurityKey {
  id: string;
  name: string;
  type: 'webauthn' | 'u2f';
  createdAt: Date;
  lastUsedAt?: Date;
}

export interface Session {
  id: string;
  token: string;
  ip: string;
  userAgent: string;
  device?: {
    type: 'desktop' | 'mobile' | 'tablet';
    os?: string;
    browser?: string;
  };
  location?: {
    country?: string;
    city?: string;
  };
  createdAt: Date;
  expiresAt: Date;
  lastActivityAt: Date;
}

export interface TrustedDevice {
  id: string;
  name: string;
  fingerprint: string;
  addedAt: Date;
  lastUsedAt: Date;
}

export interface UserSubscription {
  id: string;
  type: 'free' | 'plus' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  features: SubscriptionFeatures;
  paymentMethod?: PaymentMethod;
  invoices?: Invoice[];
}

export interface SubscriptionFeatures {
  maxServers: number;
  maxFileSize: number; // in MB
  customEmojis: boolean;
  animatedAvatar: boolean;
  customBanner: boolean;
  hdVideoStreaming: boolean;
  increasedMessageLength: number;
  serverBoosts: number;
  prioritySupport: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'crypto';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

export interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  createdAt: Date;
  paidAt?: Date;
}

export enum PremiumType {
  NONE = 0,
  NITRO_CLASSIC = 1,
  NITRO = 2,
  NITRO_BASIC = 3,
}

export interface PublicUser {
  id: string;
  username: string;
  discriminator: string;
  displayName: string;
  avatar?: string;
  banner?: string;
  bio?: string;
  verified: boolean;
  bot: boolean;
  publicFlags: number;
  premiumType: PremiumType;
}

export interface Friend {
  id: string;
  user: PublicUser;
  nickname?: string;
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: Date;
}

export interface FriendRequest {
  id: string;
  from: PublicUser;
  to: PublicUser;
  message?: string;
  createdAt: Date;
}

export interface BlockedUser {
  id: string;
  user: PublicUser;
  reason?: string;
  blockedAt: Date;
}