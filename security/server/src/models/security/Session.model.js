const mongoose = require('mongoose');
const crypto = require('crypto');

const SessionSchema = new mongoose.Schema({
  // Session Identification
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true,
    default: () => crypto.randomBytes(32).toString('hex')
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SecureUser',
    required: true,
    index: true
  },

  // Token Management
  tokens: {
    accessToken: {
      jti: String,
      issuedAt: Date,
      expiresAt: Date,
      lastUsed: Date,
      useCount: {
        type: Number,
        default: 0
      }
    },
    refreshToken: {
      token: String,
      issuedAt: Date,
      expiresAt: Date,
      rotationCount: {
        type: Number,
        default: 0
      },
      family: String // Token family for rotation tracking
    },
    csrfToken: {
      token: String,
      issuedAt: Date
    }
  },

  // Device Information
  device: {
    id: {
      type: String,
      required: true,
      index: true
    },
    name: String,
    type: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet', 'browser', 'api', 'unknown'],
      default: 'unknown'
    },
    os: {
      name: String,
      version: String
    },
    browser: {
      name: String,
      version: String
    },
    fingerprint: String,
    trusted: {
      type: Boolean,
      default: false
    },
    trustScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },

  // Network Information
  network: {
    ipAddress: {
      type: String,
      required: true,
      index: true
    },
    ipVersion: {
      type: String,
      enum: ['IPv4', 'IPv6']
    },
    userAgent: String,
    acceptLanguage: String,
    acceptEncoding: String,
    dnt: Boolean,
    connectionType: String,
    protocol: String,
    port: Number
  },

  // Geolocation
  location: {
    country: String,
    countryCode: String,
    region: String,
    city: String,
    postalCode: String,
    timezone: String,
    coordinates: {
      latitude: Number,
      longitude: Number,
      accuracy: Number
    },
    isp: String,
    org: String,
    as: String,
    proxy: Boolean,
    vpn: Boolean,
    tor: Boolean,
    hosting: Boolean
  },

  // Session State
  state: {
    active: {
      type: Boolean,
      default: true
    },
    locked: {
      type: Boolean,
      default: false
    },
    lockedReason: String,
    suspended: {
      type: Boolean,
      default: false
    },
    suspendedUntil: Date,
    terminated: {
      type: Boolean,
      default: false
    },
    terminatedAt: Date,
    terminatedBy: String,
    terminationReason: String
  },

  // Security Features
  security: {
    mfaVerified: {
      type: Boolean,
      default: false
    },
    mfaVerifiedAt: Date,
    biometricVerified: {
      type: Boolean,
      default: false
    },
    biometricVerifiedAt: Date,
    elevatedPrivileges: {
      type: Boolean,
      default: false
    },
    elevatedUntil: Date,
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low'
    },
    riskScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    anomalyDetected: {
      type: Boolean,
      default: false
    },
    anomalies: [{
      type: String,
      detectedAt: Date,
      severity: String,
      description: String
    }]
  },

  // Activity Tracking
  activity: {
    createdAt: {
      type: Date,
      default: Date.now
    },
    lastActivity: {
      type: Date,
      default: Date.now
    },
    lastHeartbeat: Date,
    pageViews: {
      type: Number,
      default: 0
    },
    apiCalls: {
      type: Number,
      default: 0
    },
    bandwidth: {
      uploaded: {
        type: Number,
        default: 0
      },
      downloaded: {
        type: Number,
        default: 0
      }
    },
    actions: [{
      action: String,
      resource: String,
      timestamp: Date,
      success: Boolean,
      responseTime: Number
    }],
    idleTime: {
      type: Number,
      default: 0
    },
    activeTime: {
      type: Number,
      default: 0
    }
  },

  // Session Configuration
  config: {
    timeout: {
      idle: {
        type: Number,
        default: 30 * 60 * 1000 // 30 minutes
      },
      absolute: {
        type: Number,
        default: 24 * 60 * 60 * 1000 // 24 hours
      }
    },
    renewable: {
      type: Boolean,
      default: true
    },
    singleUse: {
      type: Boolean,
      default: false
    },
    bindToIp: {
      type: Boolean,
      default: false
    },
    bindToDevice: {
      type: Boolean,
      default: true
    },
    requireMfa: {
      type: Boolean,
      default: false
    }
  },

  // Consent and Permissions
  permissions: {
    granted: [String],
    denied: [String],
    temporary: [{
      permission: String,
      expiresAt: Date
    }]
  },

  // Session Data Storage
  data: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },

  // Encryption
  encryption: {
    enabled: {
      type: Boolean,
      default: true
    },
    algorithm: {
      type: String,
      default: 'aes-256-gcm'
    },
    keyId: String,
    keyVersion: Number
  },

  // Rate Limiting
  rateLimit: {
    requests: [{
      endpoint: String,
      count: Number,
      windowStart: Date
    }],
    violations: {
      type: Number,
      default: 0
    },
    throttled: {
      type: Boolean,
      default: false
    },
    throttledUntil: Date
  },

  // Audit
  audit: {
    loginMethod: {
      type: String,
      enum: ['password', 'oauth', 'sso', 'biometric', 'passwordless', 'api'],
      required: true
    },
    loginProvider: String,
    verificationMethods: [String],
    failedAttempts: {
      type: Number,
      default: 0
    },
    suspiciousActivities: [{
      activity: String,
      timestamp: Date,
      resolved: Boolean
    }]
  },

  // Metadata
  metadata: {
    clientVersion: String,
    sdkVersion: String,
    apiVersion: String,
    experimentGroups: [String],
    tags: [String],
    custom: mongoose.Schema.Types.Mixed
  },

  // Expiration
  expiresAt: {
    type: Date,
    required: true,
    index: true
  }

}, {
  timestamps: true,
  collection: 'sessions'
});

// Indexes
SessionSchema.index({ userId: 1, 'state.active': 1 });
SessionSchema.index({ 'device.id': 1, userId: 1 });
SessionSchema.index({ 'network.ipAddress': 1, userId: 1 });
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
SessionSchema.index({ 'activity.lastActivity': -1 });
SessionSchema.index({ 'security.riskLevel': 1, 'state.active': 1 });

// Virtual Properties
SessionSchema.virtual('isExpired').get(function() {
  return this.expiresAt < new Date();
});

SessionSchema.virtual('isIdle').get(function() {
  const idleTimeout = this.config.timeout.idle;
  return Date.now() - this.activity.lastActivity > idleTimeout;
});

SessionSchema.virtual('duration').get(function() {
  return this.activity.lastActivity - this.activity.createdAt;
});

// Methods
SessionSchema.methods.updateActivity = async function(action = null) {
  this.activity.lastActivity = new Date();
  this.activity.lastHeartbeat = new Date();
  
  if (action) {
    this.activity.actions.push({
      action: action.type,
      resource: action.resource,
      timestamp: new Date(),
      success: action.success !== false,
      responseTime: action.responseTime
    });
    
    // Keep only last 100 actions
    if (this.activity.actions.length > 100) {
      this.activity.actions = this.activity.actions.slice(-100);
    }
  }
  
  return this.save();
};

SessionSchema.methods.verifyMFA = async function(method) {
  this.security.mfaVerified = true;
  this.security.mfaVerifiedAt = new Date();
  this.audit.verificationMethods.push(method);
  return this.save();
};

SessionSchema.methods.elevatePrivileges = async function(duration = 15 * 60 * 1000) {
  this.security.elevatedPrivileges = true;
  this.security.elevatedUntil = new Date(Date.now() + duration);
  return this.save();
};

SessionSchema.methods.calculateRiskScore = function() {
  let score = 0;
  
  // Location risk
  if (this.location.vpn) score += 20;
  if (this.location.tor) score += 30;
  if (this.location.proxy) score += 15;
  if (this.location.hosting) score += 25;
  
  // Device risk
  if (!this.device.trusted) score += 10;
  if (this.device.trustScore < 50) score += 15;
  
  // Activity risk
  if (this.activity.apiCalls > 1000) score += 10;
  if (this.audit.failedAttempts > 3) score += 20;
  if (this.security.anomalyDetected) score += 30;
  
  // Rate limit violations
  if (this.rateLimit.violations > 0) score += this.rateLimit.violations * 5;
  
  // Cap at 100
  score = Math.min(100, score);
  
  // Determine risk level
  let level = 'low';
  if (score >= 75) level = 'critical';
  else if (score >= 50) level = 'high';
  else if (score >= 25) level = 'medium';
  
  this.security.riskScore = score;
  this.security.riskLevel = level;
  
  return { score, level };
};

SessionSchema.methods.terminate = async function(reason, terminatedBy = 'system') {
  this.state.terminated = true;
  this.state.terminatedAt = new Date();
  this.state.terminatedBy = terminatedBy;
  this.state.terminationReason = reason;
  this.state.active = false;
  
  return this.save();
};

SessionSchema.methods.renew = async function(duration = null) {
  if (!this.config.renewable) {
    throw new Error('Session is not renewable');
  }
  
  const extensionTime = duration || this.config.timeout.absolute;
  this.expiresAt = new Date(Date.now() + extensionTime);
  
  // Rotate tokens
  this.tokens.refreshToken.rotationCount++;
  
  return this.save();
};

SessionSchema.methods.detectAnomalies = async function(previousSessions) {
  const anomalies = [];
  
  // Check for unusual location
  const commonCountries = previousSessions
    .map(s => s.location.country)
    .filter(Boolean);
  
  if (commonCountries.length > 0 && !commonCountries.includes(this.location.country)) {
    anomalies.push({
      type: 'unusual_location',
      severity: 'medium',
      description: `Login from new country: ${this.location.country}`
    });
  }
  
  // Check for unusual device
  const knownDevices = previousSessions
    .map(s => s.device.fingerprint)
    .filter(Boolean);
  
  if (knownDevices.length > 0 && !knownDevices.includes(this.device.fingerprint)) {
    anomalies.push({
      type: 'new_device',
      severity: 'low',
      description: 'Login from unrecognized device'
    });
  }
  
  // Check for impossible travel
  const lastSession = previousSessions[0];
  if (lastSession) {
    const timeDiff = (this.activity.createdAt - lastSession.activity.lastActivity) / 1000 / 60; // minutes
    const distance = this.calculateDistance(
      lastSession.location.coordinates,
      this.location.coordinates
    );
    
    const speed = distance / (timeDiff / 60); // km/h
    if (speed > 1000) { // Faster than commercial flight
      anomalies.push({
        type: 'impossible_travel',
        severity: 'high',
        description: `Impossible travel detected: ${Math.round(distance)}km in ${Math.round(timeDiff)} minutes`
      });
    }
  }
  
  if (anomalies.length > 0) {
    this.security.anomalyDetected = true;
    this.security.anomalies = anomalies;
  }
  
  return anomalies;
};

SessionSchema.methods.calculateDistance = function(coord1, coord2) {
  if (!coord1 || !coord2) return 0;
  
  const R = 6371; // Earth's radius in km
  const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
  const dLon = (coord2.longitude - coord1.longitude) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.latitude * Math.PI / 180) * 
    Math.cos(coord2.latitude * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Middleware
SessionSchema.pre('save', function(next) {
  // Calculate risk score on save
  this.calculateRiskScore();
  
  // Update expiration based on risk
  if (this.isNew && this.security.riskLevel === 'high') {
    this.expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour for high risk
  }
  
  next();
});

// Static Methods
SessionSchema.statics.createSession = async function(userData) {
  const session = new this(userData);
  
  // Check for existing sessions
  const existingSessions = await this.find({
    userId: userData.userId,
    'state.active': true
  }).sort('-activity.createdAt').limit(10);
  
  // Detect anomalies
  await session.detectAnomalies(existingSessions);
  
  // Limit concurrent sessions
  if (existingSessions.length >= 5) {
    // Terminate oldest session
    await existingSessions[existingSessions.length - 1].terminate('max_sessions_reached');
  }
  
  return session.save();
};

SessionSchema.statics.cleanupExpired = async function() {
  const now = new Date();
  
  // Find and terminate expired sessions
  const expired = await this.updateMany(
    {
      expiresAt: { $lt: now },
      'state.terminated': false
    },
    {
      $set: {
        'state.terminated': true,
        'state.terminatedAt': now,
        'state.terminationReason': 'expired',
        'state.active': false
      }
    }
  );
  
  return expired.modifiedCount;
};

module.exports = mongoose.model('Session', SessionSchema);