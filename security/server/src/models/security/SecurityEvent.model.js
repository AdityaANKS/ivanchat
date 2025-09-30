const mongoose = require('mongoose');
const crypto = require('crypto');

const SecurityEventSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true,
    unique: true,
    default: () => crypto.randomBytes(16).toString('hex')
  },
  
  type: {
    type: String,
    required: true,
    enum: [
      'LOGIN_ATTEMPT',
      'LOGIN_SUCCESS',
      'LOGIN_FAILURE',
      'LOGOUT',
      'PASSWORD_CHANGE',
      'PASSWORD_RESET',
      'ACCOUNT_LOCKED',
      'ACCOUNT_UNLOCKED',
      'SUSPICIOUS_ACTIVITY',
      'UNAUTHORIZED_ACCESS',
      'DATA_BREACH_ATTEMPT',
      'PRIVILEGE_ESCALATION',
      'API_KEY_GENERATED',
      'API_KEY_REVOKED',
      'TWO_FACTOR_ENABLED',
      'TWO_FACTOR_DISABLED',
      'BIOMETRIC_REGISTERED',
      'ENCRYPTION_KEY_ROTATED',
      'SECURITY_SCAN',
      'ADMIN_ACTION',
      'USER_DELETED',
      'DATA_EXPORT',
      'RATE_LIMIT_EXCEEDED',
      'CSRF_ATTEMPT',
      'XSS_ATTEMPT',
      'SQL_INJECTION_ATTEMPT'
    ]
  },
  
  severity: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  
  targetUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  sessionId: {
    type: String,
    index: true
  },
  
  ipAddress: {
    type: String,
    required: true
  },
  
  userAgent: {
    type: String
  },
  
  location: {
    country: String,
    region: String,
    city: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  deviceInfo: {
    type: {
      deviceId: String,
      deviceType: String,
      os: String,
      browser: String,
      isMobile: Boolean,
      isTablet: Boolean
    }
  },
  
  details: {
    type: mongoose.Schema.Types.Mixed,
    // Store additional event-specific details
  },
  
  metadata: {
    endpoint: String,
    method: String,
    statusCode: Number,
    responseTime: Number,
    requestId: String
  },
  
  riskScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  
  resolved: {
    type: Boolean,
    default: false
  },
  
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  resolvedAt: {
    type: Date
  },
  
  resolutionNotes: {
    type: String
  },
  
  alerts: [{
    type: {
      alertType: String,
      sentTo: String,
      sentAt: Date,
      acknowledged: Boolean,
      acknowledgedAt: Date
    }
  }],
  
  relatedEvents: [{
    type: String, // Event IDs
    ref: 'SecurityEvent'
  }],
  
  tags: [{
    type: String
  }],
  
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
SecurityEventSchema.index({ type: 1, createdAt: -1 });
SecurityEventSchema.index({ severity: 1, resolved: 1 });
SecurityEventSchema.index({ userId: 1, type: 1, createdAt: -1 });
SecurityEventSchema.index({ ipAddress: 1, createdAt: -1 });
SecurityEventSchema.index({ riskScore: -1, resolved: 1 });

// Virtual for event age
SecurityEventSchema.virtual('age').get(function() {
  return Date.now() - this.createdAt.getTime();
});

// Methods
SecurityEventSchema.methods.calculateRiskScore = function() {
  let score = 0;
  
  // Severity-based scoring
  const severityScores = {
    low: 10,
    medium: 30,
    high: 60,
    critical: 90
  };
  score += severityScores[this.severity] || 0;
  
  // Event type scoring
  const highRiskEvents = [
    'DATA_BREACH_ATTEMPT',
    'PRIVILEGE_ESCALATION',
    'SQL_INJECTION_ATTEMPT',
    'UNAUTHORIZED_ACCESS'
  ];
  
  if (highRiskEvents.includes(this.type)) {
    score += 20;
  }
  
  // Pattern detection
  if (this.relatedEvents && this.relatedEvents.length > 5) {
    score += 10;
  }
  
  // Cap at 100
  this.riskScore = Math.min(score, 100);
  return this.riskScore;
};

SecurityEventSchema.methods.resolve = async function(userId, notes) {
  this.resolved = true;
  this.resolvedBy = userId;
  this.resolvedAt = new Date();
  this.resolutionNotes = notes;
  await this.save();
};

SecurityEventSchema.methods.addAlert = async function(alertType, sentTo) {
  this.alerts.push({
    alertType,
    sentTo,
    sentAt: new Date(),
    acknowledged: false
  });
  await this.save();
};

// Statics
SecurityEventSchema.statics.getRecentHighRiskEvents = function(hours = 24) {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  
  return this.find({
    createdAt: { $gte: since },
    $or: [
      { severity: { $in: ['high', 'critical'] } },
      { riskScore: { $gte: 70 } }
    ],
    resolved: false
  }).sort('-createdAt');
};

SecurityEventSchema.statics.getUserSecurityProfile = async function(userId) {
  const events = await this.find({ userId })
    .sort('-createdAt')
    .limit(100);
  
  const profile = {
    totalEvents: events.length,
    recentEvents: events.slice(0, 10),
    riskEvents: events.filter(e => e.riskScore > 50).length,
    eventTypes: {},
    lastActivity: events[0]?.createdAt
  };
  
  // Count event types
  events.forEach(event => {
    profile.eventTypes[event.type] = (profile.eventTypes[event.type] || 0) + 1;
  });
  
  return profile;
};

SecurityEventSchema.statics.detectPatterns = async function(ipAddress, timeWindow = 3600000) {
  const since = new Date(Date.now() - timeWindow);
  
  const events = await this.find({
    ipAddress,
    createdAt: { $gte: since }
  });
  
  const patterns = {
    bruteForce: events.filter(e => e.type === 'LOGIN_FAILURE').length > 5,
    scanning: events.filter(e => e.type === 'UNAUTHORIZED_ACCESS').length > 10,
    injection: events.some(e => 
      ['SQL_INJECTION_ATTEMPT', 'XSS_ATTEMPT'].includes(e.type)
    )
  };
  
  return patterns;
};

// Middleware
SecurityEventSchema.pre('save', function(next) {
  if (this.isNew) {
    this.calculateRiskScore();
  }
  next();
});

// Auto-alert for critical events
SecurityEventSchema.post('save', async function(doc) {
  if (doc.severity === 'critical' && !doc.resolved) {
    // Trigger alert system (implement based on your notification service)
    console.error('CRITICAL SECURITY EVENT:', doc);
  }
});

const SecurityEvent = mongoose.model('SecurityEvent', SecurityEventSchema);

module.exports = SecurityEvent;