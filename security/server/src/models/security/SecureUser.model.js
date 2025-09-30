const mongoose = require('mongoose');
const crypto = require('crypto');

const SecureUserSchema = new mongoose.Schema({
  // Basic Information
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    index: true,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9_-]+$/.test(v);
      },
      message: 'Username can only contain letters, numbers, underscores, and hyphens'
    }
  },
  
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
    encrypted: true, // Custom encryption flag
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email format'
    }
  },

  // Security Credentials
  passwordHash: {
    type: String,
    required: true,
    select: false // Never return in queries by default
  },

  passwordHistory: [{
    hash: String,
    changedAt: Date
  }],

  passwordChangedAt: Date,
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: Date,

  // Multi-Factor Authentication
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  
  twoFactorSecret: {
    type: String,
    select: false,
    encrypted: true
  },
  
  backupCodes: [{
    code: String,
    used: Boolean,
    usedAt: Date
  }],

  // Biometric Data
  biometricEnabled: {
    type: Boolean,
    default: false
  },
  
  biometricCredentials: [{
    credentialId: String,
    publicKey: String,
    counter: Number,
    deviceType: String,
    createdAt: Date,
    lastUsed: Date,
    name: String
  }],

  // Account Security
  accountStatus: {
    type: String,
    enum: ['active', 'suspended', 'locked', 'deleted', 'pending'],
    default: 'pending'
  },

  emailVerified: {
    type: Boolean,
    default: false
  },
  
  emailVerificationToken: String,
  emailVerificationExpires: Date,

  phoneNumber: {
    type: String,
    encrypted: true,
    sparse: true,
    unique: true
  },
  
  phoneVerified: {
    type: Boolean,
    default: false
  },

  // Session Management
  activeSessions: [{
    sessionId: String,
    deviceId: String,
    deviceName: String,
    ipAddress: String,
    location: {
      country: String,
      city: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    userAgent: String,
    createdAt: Date,
    lastActivity: Date,
    expiresAt: Date
  }],

  // Security Settings
  securitySettings: {
    loginNotifications: {
      type: Boolean,
      default: true
    },
    unusualActivityAlerts: {
      type: Boolean,
      default: true
    },
    requirePasswordChange: {
      type: Boolean,
      default: false
    },
    allowedIPs: [String],
    blockedIPs: [String],
    trustedDevices: [{
      deviceId: String,
      deviceName: String,
      addedAt: Date,
      lastSeen: Date,
      fingerprint: String
    }]
  },

  // Login Attempts
  loginAttempts: {
    count: {
      type: Number,
      default: 0
    },
    lastAttempt: Date,
    lockedUntil: Date,
    history: [{
      timestamp: Date,
      ipAddress: String,
      userAgent: String,
      success: Boolean,
      reason: String
    }]
  },

  // Encryption Keys
  encryptionKeys: {
    publicKey: {
      type: String,
      required: true
    },
    privateKey: {
      type: String,
      required: true,
      encrypted: true,
      select: false
    },
    keyVersion: {
      type: Number,
      default: 1
    },
    keyRotatedAt: Date
  },

  // Permissions and Roles
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin', 'superadmin'],
    default: 'user'
  },

  permissions: [{
    resource: String,
    actions: [String],
    conditions: mongoose.Schema.Types.Mixed
  }],

  // Privacy Settings
  privacySettings: {
    profileVisibility: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'friends'
    },
    showOnlineStatus: {
      type: Boolean,
      default: true
    },
    allowDirectMessages: {
      type: String,
      enum: ['everyone', 'friends', 'none'],
      default: 'friends'
    },
    dataRetention: {
      deleteMessagesAfter: Number, // days
      deleteFilesAfter: Number // days
    }
  },

  // Compliance
  consent: {
    termsAccepted: {
      type: Boolean,
      required: true
    },
    termsAcceptedAt: Date,
    termsVersion: String,
    privacyAccepted: {
      type: Boolean,
      required: true
    },
    privacyAcceptedAt: Date,
    privacyVersion: String,
    marketingOptIn: {
      type: Boolean,
      default: false
    },
    dataProcessingAgreement: {
      type: Boolean,
      default: false
    }
  },

  // Account Recovery
  recoveryEmail: {
    type: String,
    encrypted: true
  },
  
  recoveryQuestions: [{
    question: String,
    answerHash: String
  }],

  // Metadata
  metadata: {
    createdFrom: {
      ipAddress: String,
      userAgent: String,
      referrer: String
    },
    lastPasswordChange: Date,
    last2FAChange: Date,
    accountAge: Number,
    trustScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },

  // Audit Trail
  lastLogin: Date,
  lastLogout: Date,
  lastActivity: Date,
  totalLogins: {
    type: Number,
    default: 0
  },

  // Deletion
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  deletionReason: String,
  dataExportRequested: Boolean,
  dataExportedAt: Date

}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.passwordHash;
      delete ret.twoFactorSecret;
      delete ret.passwordResetToken;
      delete ret.encryptionKeys.privateKey;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes
SecureUserSchema.index({ email: 1, accountStatus: 1 });
SecureUserSchema.index({ username: 1, accountStatus: 1 });
SecureUserSchema.index({ 'activeSessions.sessionId': 1 });
SecureUserSchema.index({ createdAt: -1 });
SecureUserSchema.index({ lastActivity: -1 });

// Virtual properties
SecureUserSchema.virtual('isLocked').get(function() {
  return this.loginAttempts.lockedUntil && this.loginAttempts.lockedUntil > Date.now();
});

SecureUserSchema.virtual('requiresPasswordChange').get(function() {
  if (this.securitySettings.requirePasswordChange) return true;
  
  const daysSinceChange = this.passwordChangedAt 
    ? (Date.now() - this.passwordChangedAt) / (1000 * 60 * 60 * 24)
    : Infinity;
    
  return daysSinceChange > 90; // Require change every 90 days
});

// Methods
SecureUserSchema.methods.incrementLoginAttempts = async function() {
  // Reset attempts if lock has expired
  if (this.loginAttempts.lockedUntil && this.loginAttempts.lockedUntil < Date.now()) {
    return this.updateOne({
      $set: { 'loginAttempts.count': 1 },
      $unset: { 'loginAttempts.lockedUntil': 1 }
    });
  }
  
  const updates = { $inc: { 'loginAttempts.count': 1 } };
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours
  
  if (this.loginAttempts.count + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { 'loginAttempts.lockedUntil': Date.now() + lockTime };
  }
  
  return this.updateOne(updates);
};

SecureUserSchema.methods.resetLoginAttempts = async function() {
  return this.updateOne({
    $set: { 'loginAttempts.count': 0 },
    $unset: { 'loginAttempts.lockedUntil': 1 }
  });
};

SecureUserSchema.methods.createSession = async function(sessionData) {
  const session = {
    sessionId: crypto.randomBytes(32).toString('hex'),
    deviceId: sessionData.deviceId,
    deviceName: sessionData.deviceName,
    ipAddress: sessionData.ipAddress,
    location: sessionData.location,
    userAgent: sessionData.userAgent,
    createdAt: new Date(),
    lastActivity: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  };
  
  this.activeSessions.push(session);
  
  // Limit active sessions
  if (this.activeSessions.length > 10) {
    this.activeSessions = this.activeSessions
      .sort((a, b) => b.lastActivity - a.lastActivity)
      .slice(0, 10);
  }
  
  await this.save();
  return session;
};

SecureUserSchema.methods.terminateSession = async function(sessionId) {
  this.activeSessions = this.activeSessions.filter(s => s.sessionId !== sessionId);
  return this.save();
};

SecureUserSchema.methods.updateTrustScore = async function(action, value) {
  const actions = {
    verifyEmail: 10,
    verifyPhone: 10,
    enable2FA: 20,
    enableBiometric: 15,
    successfulLogin: 1,
    failedLogin: -5,
    suspiciousActivity: -20,
    reportedContent: -10,
    verifiedIdentity: 30
  };
  
  const change = actions[action] || value || 0;
  this.metadata.trustScore = Math.max(0, Math.min(100, this.metadata.trustScore + change));
  
  return this.save();
};

// Middleware
SecureUserSchema.pre('save', async function(next) {
  // Update account age
  if (this.isNew) {
    this.metadata.accountAge = 0;
  } else {
    this.metadata.accountAge = Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
  }
  
  next();
});

// Encryption middleware
SecureUserSchema.pre('save', async function(next) {
  const encryptionService = require('../../services/security/encryption.service');
  
  // Encrypt marked fields
  const fieldsToEncrypt = ['email', 'phoneNumber', 'recoveryEmail'];
  
  for (const field of fieldsToEncrypt) {
    if (this.isModified(field) && this[field]) {
      this[field] = await encryptionService.encryptField(this[field]);
    }
  }
  
  next();
});

// Cleanup expired sessions
SecureUserSchema.methods.cleanupSessions = async function() {
  const now = new Date();
  this.activeSessions = this.activeSessions.filter(s => s.expiresAt > now);
  return this.save();
};

module.exports = mongoose.model('SecureUser', SecureUserSchema);