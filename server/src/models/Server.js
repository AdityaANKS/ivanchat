import mongoose from 'mongoose';

const serverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  description: {
    type: String,
    maxlength: 1000,
  },
  icon: String,
  banner: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  region: {
    type: String,
    default: 'us-east',
  },
  verificationLevel: {
    type: Number,
    default: 0, // 0: None, 1: Email, 2: 5 minutes, 3: 10 minutes, 4: Phone
  },
  defaultNotifications: {
    type: String,
    enum: ['all', 'mentions'],
    default: 'mentions',
  },
  explicitContentFilter: {
    type: Number,
    default: 0, // 0: Disabled, 1: Members without roles, 2: All members
  },
  features: [{
    type: String,
    enum: ['verified', 'partnered', 'community', 'commerce', 'discoverable', 'featurable'],
  }],
  rulesChannel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
  },
  systemChannel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
  },
  afkChannel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
  },
  afkTimeout: {
    type: Number,
    default: 300, // seconds
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    nickname: String,
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    roles: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
    }],
    deaf: { type: Boolean, default: false },
    mute: { type: Boolean, default: false },
  }],
  channels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
  }],
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  }],
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
  }],
  emojis: [{
    name: String,
    url: String,
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    requireColons: { type: Boolean, default: true },
    managed: { type: Boolean, default: false },
    animated: { type: Boolean, default: false },
  }],
  stickers: [{
    name: String,
    description: String,
    url: String,
    packId: String,
    tags: String,
    type: { type: String, enum: ['standard', 'guild'] },
    formatType: { type: String, enum: ['png', 'apng', 'lottie'] },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }],
  bans: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reason: String,
    bannedAt: {
      type: Date,
      default: Date.now,
    },
    bannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }],
  invites: [{
    code: {
      type: String,
      unique: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
    },
    uses: {
      type: Number,
      default: 0,
    },
    maxUses: Number,
    maxAge: Number, // seconds
    temporary: { type: Boolean, default: false },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: Date,
  }],
  vanityUrl: {
    type: String,
    unique: true,
    sparse: true,
  },
  splashImage: String,
  discoverySplash: String,
  isPublic: {
    type: Boolean,
    default: false,
  },
  nsfwLevel: {
    type: Number,
    default: 0, // 0: Default, 1: Explicit, 2: Safe, 3: Age restricted
  },
  premiumTier: {
    type: Number,
    default: 0, // 0: None, 1: Tier 1, 2: Tier 2, 3: Tier 3
  },
  premiumSubscriptionCount: {
    type: Number,
    default: 0,
  },
  preferredLocale: {
    type: String,
    default: 'en-US',
  },
  stats: {
    memberCount: { type: Number, default: 0 },
    onlineCount: { type: Number, default: 0 },
    messageCount: { type: Number, default: 0 },
  },
  verified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

serverSchema.index({ owner: 1 });
serverSchema.index({ 'members.user': 1 });
serverSchema.index({ isPublic: 1, verified: 1 });
serverSchema.index({ vanityUrl: 1 });

export default mongoose.model('Server', serverSchema);