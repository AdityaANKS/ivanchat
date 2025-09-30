const mongoose = require('mongoose');
const crypto = require('crypto');

const AuditLogSchema = new mongoose.Schema({
  // Event Identification
  eventId: {
    type: String,
    required: true,
    unique: true,
    default: () => crypto.randomUUID()
  },

  eventType: {
    type: String,
    required: true,
    index: true,
    enum: [
      // Authentication Events
      'auth.login', 'auth.logout', 'auth.failed', 'auth.locked',
      'auth.mfa_enabled', 'auth.mfa_disabled', 'auth.mfa_failed',
      'auth.password_changed', 'auth.password_reset',
      
      // Authorization Events
      'authz.granted', 'authz.denied', 'authz.elevated', 'authz.revoked',
      
      // User Management
      'user.created', 'user.updated', 'user.deleted', 'user.suspended',
      'user.activated', 'user.deactivated', 'user.verified',
      
      // Data Operations
      'data.created', 'data.read', 'data.updated', 'data.deleted',
      'data.exported', 'data.imported', 'data.shared',
      
      // Security Events
      'security.breach_attempt', 'security.vulnerability_detected',
      'security.encryption_failed', 'security.key_rotated',
      'security.suspicious_activity', 'security.blocked',
      
      // System Events
      'system.startup', 'system.shutdown', 'system.error', 'system.warning',
      'system.config_changed', 'system.backup', 'system.restore',
      
      // Compliance Events
      'compliance.consent_given', 'compliance.consent_withdrawn',
      'compliance.data_request', 'compliance.data_deleted',
      
      // Admin Actions
      'admin.config_changed', 'admin.user_modified', 'admin.system_reset',
      'admin.audit_exported', 'admin.logs_cleared'
    ]
  },

  severity: {
    type: String,
    required: true,
    enum: ['debug', 'info', 'warning', 'error', 'critical', 'emergency'],
    index: true
  },

  // Actor Information
  actor: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SecureUser',
      index: true
    },
    username: String,
    email: String,
    role: String,
    sessionId: String,
    apiKeyId: String,
    serviceAccount: String,
    system: {
      type: Boolean,
      default: false
    }
  },

  // Target Information
  target: {
    type: {
      type: String,
      enum: ['user', 'resource', 'system', 'api', 'file', 'configuration']
    },
    id: String,
    name: String,
    description: String,
    previousValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed,
    changes: [{
      field: String,
      oldValue: mongoose.Schema.Types.Mixed,
      newValue: mongoose.Schema.Types.Mixed
    }]
  },

  // Context Information
  context: {
    ipAddress: {
      type: String,
      index: true
    },
    userAgent: String,
    requestId: String,
    correlationId: String,
    traceId: String,
    spanId: String,
    sessionId: String,
    apiEndpoint: String,
    httpMethod: String,
    httpStatusCode: Number,
    responseTime: Number,
    requestSize: Number,
    responseSize: Number
  },

  // Location Data
  location: {
    country: String,
    countryCode: String,
    region: String,
    city: String,
    postalCode: String,
    latitude: Number,
    longitude: Number,
    timezone: String,
    isp: String,
    vpn: Boolean,
    proxy: Boolean,
    tor: Boolean
  },

  // Result Information
  result: {
    success: {
      type: Boolean,
      required: true
    },
    errorCode: String,
    errorMessage: String,
    errorStack: String,
    affectedResources: [String],
    rollbackPerformed: Boolean
  },

  // Security Context
  security: {
    threatLevel: {
      type: String,
      enum: ['none', 'low', 'medium', 'high', 'critical']
    },
    attackType: String,
    attackVector: String,
    blocked: Boolean,
    quarantined: Boolean,
    encrypted: Boolean,
    signature: String,
    integrityCheck: String
  },

  // Compliance
  compliance: {
    regulated: Boolean,
    regulations: [String], // GDPR, HIPAA, PCI-DSS, etc.
    dataClassification: {
      type: String,
      enum: ['public', 'internal', 'confidential', 'restricted']
    },
    retentionRequired: Boolean,
    retentionPeriod: Number, // days
    legalHold: Boolean
  },

  // Additional Data
  metadata: {
    tags: [String],
    labels: Map,
    custom: mongoose.Schema.Types.Mixed,
    rawData: mongoose.Schema.Types.Mixed
  },

  // Performance Metrics
  performance: {
    duration: Number, // milliseconds
    cpuUsage: Number,
    memoryUsage: Number,
    diskIO: Number,
    networkIO: Number
  },

  // Related Events
  relationships: {
    parentEventId: String,
    childEventIds: [String],
    relatedEventIds: [String],
    causedBy: String,
    causes: [String]
  },

  // Data Integrity
  integrity: {
    hash: {
      type: String,
      required: true
    },
    previousHash: String,
    chainValid: Boolean,
    signed: Boolean,
    signature: String,
    signedBy: String,
    signedAt: Date,
    verified: Boolean,
    verifiedBy: String,
    verifiedAt: Date
  },

  // Retention and Archival
  retention: {
    expiresAt: Date,
    archived: {
      type: Boolean,
      default: false
    },
    archivedAt: Date,
    archiveLocation: String,
    compressed: Boolean,
    encrypted: Boolean,
    deletionScheduled: Date
  },

  // Alert and Notification
  alert: {
    generated: Boolean,
    alertId: String,
    notificationsSent: [{
      channel: String,
      recipient: String,
      sentAt: Date,
      delivered: Boolean
    }],
    acknowledged: Boolean,
    acknowledgedBy: String,
    acknowledgedAt: Date,
    escalated: Boolean,
    escalationLevel: Number
  },

  // Review and Investigation
  review: {
    required: Boolean,
    reviewed: Boolean,
    reviewedBy: String,
    reviewedAt: Date,
    findings: String,
    actionTaken: String,
    ticketId: String,
    falsePositive: Boolean
  },

  // Timestamps
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },

  receivedAt: {
    type: Date,
    default: Date.now
  },

  processedAt: Date

}, {
  timestamps: false, // We manage our own timestamps
  collection: 'audit_logs'
});

// Indexes
AuditLogSchema.index({ timestamp: -1 });
AuditLogSchema.index({ 'actor.userId': 1, timestamp: -1 });
AuditLogSchema.index({ eventType: 1, timestamp: -1 });
AuditLogSchema.index({ severity: 1, timestamp: -1 });
AuditLogSchema.index({ 'context.correlationId': 1 });
AuditLogSchema.index({ 'retention.expiresAt': 1 }, { expireAfterSeconds: 0 });
AuditLogSchema.index({ 'alert.generated': 1, 'alert.acknowledged': 1 });
AuditLogSchema.index({ 'review.required': 1, 'review.reviewed': 1 });

// Compound indexes for common queries
AuditLogSchema.index({ 
  eventType: 1, 
  'actor.userId': 1, 
  timestamp: -1 
});

AuditLogSchema.index({ 
  severity: 1, 
  'result.success': 1, 
  timestamp: -1 
});

// Methods
AuditLogSchema.methods.generateHash = function() {
  const data = {
    eventId: this.eventId,
    eventType: this.eventType,
    timestamp: this.timestamp,
    actor: this.actor,
    target: this.target,
    result: this.result,
    previousHash: this.integrity.previousHash
  };
  
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(data))
    .digest('hex');
};

AuditLogSchema.methods.sign = function(privateKey) {
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(this.integrity.hash);
  
  this.integrity.signature = sign.sign(privateKey, 'hex');
  this.integrity.signed = true;
  this.integrity.signedAt = new Date();
  
  return this.integrity.signature;
};

AuditLogSchema.methods.verify = function(publicKey) {
  if (!this.integrity.signed || !this.integrity.signature) {
    return false;
  }
  
  const verify = crypto.createVerify('RSA-SHA256');
  verify.update(this.integrity.hash);
  
  const isValid = verify.verify(publicKey, this.integrity.signature, 'hex');
  
  this.integrity.verified = isValid;
  this.integrity.verifiedAt = new Date();
  
  return isValid;
};

AuditLogSchema.methods.shouldAlert = function() {
  // Determine if this event should trigger an alert
  const alertableSeverities = ['error', 'critical', 'emergency'];
  const alertableEvents = [
    'auth.locked',
    'security.breach_attempt',
    'security.vulnerability_detected',
    'data.deleted',
    'admin.system_reset'
  ];
  
  return alertableSeverities.includes(this.severity) ||
         alertableEvents.includes(this.eventType) ||
         (this.security && this.security.threatLevel === 'critical');
};

AuditLogSchema.methods.generateAlert = async function(notificationService) {
  if (!this.shouldAlert()) return null;
  
  this.alert.generated = true;
  this.alert.alertId = crypto.randomUUID();
  
  // Send notifications
  const recipients = await this.determineRecipients();
  
  for (const recipient of recipients) {
    const notification = {
      channel: recipient.channel,
      recipient: recipient.address,
      sentAt: new Date(),
      delivered: false
    };
    
    try {
      await notificationService.send(recipient, this);
      notification.delivered = true;
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
    
    this.alert.notificationsSent.push(notification);
  }
  
  return this.alert;
};

AuditLogSchema.methods.determineRecipients = async function() {
  // Logic to determine who should be notified
  const recipients = [];
  
  if (this.severity === 'emergency') {
    recipients.push({
      channel: 'email',
      address: 'security@company.com',
      priority: 'high'
    });
  }
  
  if (this.eventType.startsWith('security.')) {
    recipients.push({
      channel: 'slack',
      address: '#security-alerts',
      priority: 'medium'
    });
  }
  
  return recipients;
};

AuditLogSchema.methods.archive = async function() {
  if (this.retention.archived) return;
  
  // Compress data
  const compressed = await this.compress();
  
  // Encrypt if required
  if (this.compliance.dataClassification !== 'public') {
    await this.encrypt();
  }
  
  this.retention.archived = true;
  this.retention.archivedAt = new Date();
  this.retention.compressed = compressed;
  
  return this.save();
};

AuditLogSchema.methods.compress = async function() {
  // Implement compression logic
  return true;
};

AuditLogSchema.methods.encrypt = async function() {
  // Implement encryption logic
  this.retention.encrypted = true;
  return true;
};

// Middleware
AuditLogSchema.pre('save', function(next) {
  if (this.isNew) {
    // Generate integrity hash
    this.integrity.hash = this.generateHash();
    
    // Set retention based on compliance requirements
    if (this.compliance.retentionRequired) {
      const days = this.compliance.retentionPeriod || 2555; // 7 years default
      this.retention.expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    } else {
      // Default retention: 90 days
      this.retention.expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    }
  }
  
  next();
});

// Static Methods
AuditLogSchema.statics.logEvent = async function(eventData) {
  const log = new this(eventData);
  
  // Get previous log for hash chaining
  const previousLog = await this.findOne()
    .sort('-timestamp')
    .select('integrity.hash')
    .limit(1);
  
  if (previousLog) {
    log.integrity.previousHash = previousLog.integrity.hash;
  }
  
  return log.save();
};

AuditLogSchema.statics.verifyChain = async function(startDate, endDate) {
  const logs = await this.find({
    timestamp: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort('timestamp');
  
  let valid = true;
  let brokenLink = null;
  
  for (let i = 1; i < logs.length; i++) {
    const currentLog = logs[i];
    const previousLog = logs[i - 1];
    
    if (currentLog.integrity.previousHash !== previousLog.integrity.hash) {
      valid = false;
      brokenLink = {
        current: currentLog.eventId,
        previous: previousLog.eventId,
        timestamp: currentLog.timestamp
      };
      break;
    }
    
    // Verify individual log integrity
    const calculatedHash = currentLog.generateHash();
    if (calculatedHash !== currentLog.integrity.hash) {
      valid = false;
      brokenLink = {
        tampered: currentLog.eventId,
        timestamp: currentLog.timestamp
      };
      break;
    }
  }
  
  return { valid, brokenLink, logsChecked: logs.length };
};

AuditLogSchema.statics.generateComplianceReport = async function(startDate, endDate, regulations = []) {
  const query = {
    timestamp: {
      $gte: startDate,
      $lte: endDate
    }
  };
  
  if (regulations.length > 0) {
    query['compliance.regulations'] = { $in: regulations };
  }
  
  const logs = await this.find(query);
  
  const report = {
    period: { start: startDate, end: endDate },
    totalEvents: logs.length,
    regulations,
    summary: {
      byEventType: {},
      bySeverity: {},
      byDataClassification: {},
      failures: 0,
      successes: 0
    },
    criticalEvents: [],
    complianceViolations: []
  };
  
  logs.forEach(log => {
    // Aggregate by event type
    report.summary.byEventType[log.eventType] = 
      (report.summary.byEventType[log.eventType] || 0) + 1;
    
    // Aggregate by severity
    report.summary.bySeverity[log.severity] = 
      (report.summary.bySeverity[log.severity] || 0) + 1;
    
    // Aggregate by data classification
    if (log.compliance.dataClassification) {
      report.summary.byDataClassification[log.compliance.dataClassification] = 
        (report.summary.byDataClassification[log.compliance.dataClassification] || 0) + 1;
    }
    
    // Count successes and failures
    if (log.result.success) {
      report.summary.successes++;
    } else {
      report.summary.failures++;
    }
    
    // Collect critical events
    if (log.severity === 'critical' || log.severity === 'emergency') {
      report.criticalEvents.push({
        eventId: log.eventId,
        eventType: log.eventType,
        timestamp: log.timestamp,
        actor: log.actor.username || log.actor.userId,
        result: log.result.success ? 'success' : 'failure'
      });
    }
    
    // Check for compliance violations
    if (log.eventType.startsWith('compliance.') && !log.result.success) {
      report.complianceViolations.push({
        eventId: log.eventId,
        violation: log.eventType,
        timestamp: log.timestamp,
        regulations: log.compliance.regulations
      });
    }
  });
  
  return report;
};

module.exports = mongoose.model('AuditLog', AuditLogSchema);