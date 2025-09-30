const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  // Basic Information
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores and hyphens']
  },
  
  discriminator: {
    type: String,
    required: true,
    match: [/^\d{4}$/, 'Discriminator must be 4 digits']
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  
  password: {
    type: String,
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't return password by default
  },
  
  // Profile Information
  displayName: {
    type: String,
    maxlength: [32, 'Display name cannot exceed 32 characters']
  },
  
  avatar: {
    type: String,
    default: null
  },
  
  banner: {
    type: String,
    default: null
  },
  
  bio: {
    type: String,
    maxlength: [200, 'Bio cannot exceed 200 characters'],
    default: ''
  },
  
  // OAuth Integration
  oauth: {
    google: {
      id: String,
      email: String
    },
    github: {
      id: String,
      username: String
    },
    discord: {
      id: String,
      username: String
    }
  },
  
  // Status & Presence
  status: {
    type: String,
    enum: ['online', 'idle', 'dnd', 'invisible', 'offline'],
    default: 'offline'
  },
  
  customStatus: {
    text: {
      type: String,
      maxlength: [128, 'Custom status cannot exceed 128 characters']
    },
    emoji: String,
    expiresAt: Date
  },
  
  lastSeen: {
    type: Date,
    default: Date.now
  },
  
  // Gamification
  gamification: {
    level: {
      type: Number,
      default: 1,
      min: 1,
      max: 100
    },
    xp: {
      type: Number,
      default: 0,
      min: 0
    },
    totalXp: {
      type: Number,
      default: 0,
      min: 0
    },
    badges: [{
      id: String,
      name: String,
      description: String,
      icon: String,
      rarity: {
        type: String,
        enum: ['common', 'uncommon', 'rare', 'epic', 'legendary']
      },
      earnedAt: {
        type: Date,
        default: Date.now
      }
    }],
    achievements: [{
      id: String,
      progress: Number,
      completed: Boolean,
      completedAt: Date
    }],
    questProgress: [{
      questId: String,
      progress: Number,
      completed: Boolean,
      claimedReward: Boolean
    }],
    currency: {
      coins: {
        type: Number,
        default: 0,
        min: 0
      },
      gems: {
        type: Number,
        default: 0,
        min: 0
      }
    }
  },
  
  // Relationships
  servers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Server'
  }],
  
  ownedServers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Server'
  }],
  
  friends: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'blocked'],
      default: 'pending'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  blockedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  directMessages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DirectMessage'
  }],
  
  // Settings & Preferences
  settings: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'dark'
    },
    language: {
      type: String,
      default: 'en'
    },
    notifications: {
      desktop: {
        type: Boolean,
        default: true
      },
      mobile: {
        type: Boolean,
        default: true
      },
      email: {
        type: Boolean,
        default: false
      },
      sound: {
        type: Boolean,
        default: true
      },
      directMessages: {
        type: String,
        enum: ['all', 'friends', 'none'],
        default: 'all'
      },
      serverMessages: {
        type: String,
        enum: ['all', 'mentions', 'none'],
        default: 'mentions'
      }
    },
    privacy: {
      showOnlineStatus: {
        type: Boolean,
        default: true
      },
      allowDirectMessages: {
        type: String,
        enum: ['everyone', 'friends', 'none'],
        default: 'friends'
      },
      readReceipts: {
        type: Boolean,
        default: true
      },
      activityStatus: {
        type: Boolean,
        default: true
      }
    },
    accessibility: {
      reducedMotion: {
        type: Boolean,
        default: false
      },
      highContrast: {
        type: Boolean,
        default: false
      },
      fontSize: {
        type: String,
        enum: ['small', 'medium', 'large'],
        default: 'medium'
      }
    },
    voice: {
      inputDevice: String,
      outputDevice: String,
      inputVolume: {
        type: Number,
        default: 100,
        min: 0,
        max: 100
      },
      outputVolume: {
        type: Number,
        default: 100,
        min: 0,
        max: 100
      },
      noiseSuppression: {
        type: Boolean,
        default: true
      },
      echoCancellation: {
        type: Boolean,
        default: true
      },
      pushToTalk: {
        type: Boolean,
        default: false
      },
      pushToTalkKey: String
    }
  },
  
  // Security
  security: {
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    twoFactorSecret: {
      type: String,
      select: false
    },
    backupCodes: [{
      code: String,
      used: Boolean
    }],
    encryptionKeys: {
      publicKey: String,
      privateKey: {
        type: String,
        select: false
      }
    },
    sessions: [{
      token: String,
      device: String,
      ip: String,
      location: String,
      createdAt: {
        type: Date,
        default: Date.now
      },
      lastActive: Date
    }],
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerificationToken: String,
    emailVerificationExpires: Date
  },
  
  // Account Status
  verified: {
    email: {
      type: Boolean,
      default: false
    },
    phone: {
      type: Boolean,
      default: false
    }
  },
  
  phoneNumber: {
    type: String,
    select: false
  },
  
  accountStatus: {
    type: String,
    enum: ['active', 'suspended', 'banned', 'deleted'],
    default: 'active'
  },
  
  banInfo: {
    reason: String,
    bannedAt: Date,
    bannedUntil: Date,
    bannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // Subscription & Premium
  subscription: {
    type: {
      type: String,
      enum: ['free', 'premium', 'premium_plus'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date,
    autoRenew: {
      type: Boolean,
      default: false
    },
    paymentMethod: String,
    features: {
      maxServers: {
        type: Number,
        default: 100
      },
      maxFileSize: {
        type: Number,
        default: 8388608 // 8MB for free users
      },
      customEmojis: {
        type: Boolean,
        default: false
      },
      animatedAvatar: {
        type: Boolean,
        default: false
      },
      serverBoosts: {
        type: Number,
        default: 0
      }
    }
  },
  
  // Marketplace
  marketplace: {
    purchasedItems: [{
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MarketplaceItem'
      },
      purchasedAt: {
        type: Date,
        default: Date.now
      },
      price: Number,
      currency: String
    }],
    listedItems: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MarketplaceItem'
    }]
  },
  
  // Analytics & Metrics
  analytics: {
    messagesSent: {
      type: Number,
      default: 0
    },
    voiceMinutes: {
      type: Number,
      default: 0
    },
    serversJoined: {
      type: Number,
      default: 0
    },
    lastActiveAt: Date,
    dailyActiveStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    }
  },
  
  // Admin & Moderation
  roles: {
    isAdmin: {
      type: Boolean,
      default: false
    },
    isModerator: {
      type: Boolean,
      default: false
    },
    isSupport: {
      type: Boolean,
      default: false
    },
    isDeveloper: {
      type: Boolean,
      default: false
    }
  },
  
  warnings: [{
    reason: String,
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    issuedAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: Date
  }],
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  deletedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1, discriminator: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ 'gamification.level': -1 });
UserSchema.index({ 'gamification.totalXp': -1 });
UserSchema.index({ createdAt: -1 });

// Virtual for full username with discriminator
UserSchema.virtual('fullUsername').get(function() {
  return `${this.username}#${this.discriminator}`;
});

// Virtual for avatar URL
UserSchema.virtual('avatarUrl').get(function() {
  if (this.avatar) {
    return this.avatar.startsWith('http') ? this.avatar : `/api/avatars/${this.avatar}`;
  }
  return `/api/avatars/default/${this.discriminator % 5}.png`;
});

// Pre-save middleware to hash password
UserSchema.pre('save', async function(next) {
  // Only hash password if it's modified
  if (!this.isModified('password')) return next();
  
  // Generate salt and hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Pre-save middleware to generate discriminator for new users
UserSchema.pre('save', async function(next) {
  if (this.isNew && !this.discriminator) {
    // Find users with same username
    const users = await this.constructor.find({ username: this.username });
    const usedDiscriminators = users.map(u => u.discriminator);
    
    // Generate random discriminator not in use
    let discriminator;
    do {
      discriminator = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    } while (usedDiscriminators.includes(discriminator));
    
    this.discriminator = discriminator;
  }
  next();
});

// Instance method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate JWT token
UserSchema.methods.generateAuthToken = function() {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { 
      id: this._id,
      username: this.username,
      email: this.email
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Instance method to generate password reset token
UserSchema.methods.generatePasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.security.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  this.security.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
  
  return resetToken;
};

// Instance method to generate email verification token
UserSchema.methods.generateEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  this.security.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
    
  this.security.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  return verificationToken;
};

// Instance method to add XP and handle leveling
UserSchema.methods.addXP = async function(amount) {
  this.gamification.xp += amount;
  this.gamification.totalXp += amount;
  
  // Calculate level based on XP (100 * level^2 XP needed per level)
  const xpNeeded = 100 * Math.pow(this.gamification.level, 2);
  
  if (this.gamification.xp >= xpNeeded) {
    this.gamification.level += 1;
    this.gamification.xp -= xpNeeded;
    
    // Emit level up event
    const EventEmitter = require('events');
    const gameEvents = new EventEmitter();
    gameEvents.emit('levelUp', {
      userId: this._id,
      newLevel: this.gamification.level
    });
  }
  
  await this.save();
};

// Instance method to check if user has permission
UserSchema.methods.hasPermission = function(permission) {
  const adminPermissions = ['all'];
  const moderatorPermissions = ['ban', 'kick', 'mute', 'warn', 'manage_messages'];
  
  if (this.roles.isAdmin) return true;
  if (this.roles.isModerator && moderatorPermissions.includes(permission)) return true;
  
  return false;
};

// Static method to find by credentials
UserSchema.statics.findByCredentials = async function(email, password) {
  const user = await this.findOne({ email }).select('+password');
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }
  
  return user;
};

// Static method to search users
UserSchema.statics.searchUsers = async function(query, limit = 10) {
  return this.find({
    $or: [
      { username: { $regex: query, $options: 'i' } },
      { displayName: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } }
    ],
    accountStatus: 'active'
  })
  .limit(limit)
  .select('username discriminator displayName avatar status');
};

module.exports = mongoose.model('User', UserSchema);