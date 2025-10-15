const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Report Schema
 * Handles all types of reports in the system including users, messages, servers, etc.
 */
const reportSchema = new Schema({
  // Report Type and Target
  type: {
    type: String,
    required: true,
    enum: [
      'user',
      'message',
      'server',
      'channel',
      'voice_abuse',
      'dm_spam',
      'profile',
      'discovery_listing',
      'bot',
      'emoji',
      'attachment',
      'webhook'
    ],
    index: true
  },

  // Target Information (Polymorphic reference)
  targetId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true
  },

  targetModel: {
    type: String,
    required: true,
    enum: ['User', 'Message', 'Server', 'Channel', 'DiscoveryListing', 'Bot', 'Upload']
  },

  // Additional target context
  targetContext: {
    serverId: {
      type: Schema.Types.ObjectId,
      ref: 'Server'
    },
    channelId: {
      type: Schema.Types.ObjectId,
      ref: 'Channel'
    },
    messageContent: String, // Store deleted message content
    username: String, // Store username at time of report
    displayName: String
  },

  // Reporter Information
  reportedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  reporterIp: {
    type: String,
    select: false // Only visible to admins
  },

  reporterUserAgent: String,

  isAnonymous: {
    type: Boolean,
    default: false
  },

  // Report Details
  category: {
    type: String,
    required: true,
    enum: [
      // Content violations
      'spam',
      'harassment',
      'hate_speech',
      'nsfw_content',
      'gore_violence',
      'self_harm',
      'illegal_content',
      'child_safety',
      
      // Behavior violations
      'threats',
      'doxxing',
      'impersonation',
      'ban_evasion',
      'raid_brigading',
      'manipulation',
      
      // Platform violations
      'scam_phishing',
      'malware',
      'copyright',
      'privacy_violation',
      'underage_user',
      'tos_violation',
      
      // Other
      'false_information',
      'other'
    ],
    index: true
  },

  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
    index: true
  },

  description: {
    type: String,
    required: true,
    maxlength: 2000
  },

  // Evidence
  evidence: [{
    type: {
      type: String,
      enum: ['screenshot', 'link', 'message_id', 'user_id', 'text', 'video', 'audio']
    },
    content: String, // URL or ID
    description: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    verified: {
      type: Boolean,
      default: false
    }
  }],

  screenshots: [{
    url: String,
    thumbnailUrl: String,
    uploadedAt: Date,
    size: Number,
    hash: String // For duplicate detection
  }],

  // Related Reports
  relatedReports: [{
    type: Schema.Types.ObjectId,
    ref: 'Report'
  }],

  duplicateOf: {
    type: Schema.Types.ObjectId,
    ref: 'Report'
  },

  // Status and Resolution
  status: {
    type: String,
    enum: [
      'pending',
      'reviewing',
      'under_investigation',
      'awaiting_info',
      'escalated',
      'resolved',
      'dismissed',
      'false_report',
      'auto_resolved'
    ],
    default: 'pending',
    index: true
  },

  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 10,
    index: true
  },

  resolution: {
    action: {
      type: String,
      enum: [
        'no_action',
        'warning_issued',
        'content_removed',
        'user_timeout',
        'user_banned',
        'server_removed',
        'channel_deleted',
        'ip_banned',
        'reported_to_authorities',
        'account_suspended',
        'other'
      ]
    },
    notes: String,
    actionDetails: {
      type: Map,
      of: Schema.Types.Mixed
    },
    resolvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: Date,
    timeToResolve: Number // in minutes
  },

  // Moderation Information
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },

  assignedAt: Date,

  moderatorNotes: [{
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    isInternal: {
      type: Boolean,
      default: true
    }
  }],

  // Escalation
  escalation: {
    isEscalated: {
      type: Boolean,
      default: false
    },
    escalatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    escalatedAt: Date,
    escalationReason: String,
    escalationLevel: {
      type: Number,
      default: 1,
      min: 1,
      max: 3
    },
    escalatedTo: {
      type: String,
      enum: ['senior_moderator', 'admin', 'legal', 'trust_safety']
    }
  },

  // Auto-moderation
  autoModeration: {
    detected: {
      type: Boolean,
      default: false
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1
    },
    flags: [String],
    aiAnalysis: {
      type: Map,
      of: Schema.Types.Mixed
    },
    autoAction: {
      taken: Boolean,
      action: String,
      timestamp: Date
    }
  },

  // User Response
  userResponse: {
    responded: {
      type: Boolean,
      default: false
    },
    response: String,
    respondedAt: Date,
    attachments: [String]
  },

  // Appeal
  appeal: {
    requested: {
      type: Boolean,
      default: false
    },
    reason: String,
    requestedAt: Date,
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'approved', 'denied']
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: Date,
    reviewNotes: String
  },

  // Metrics
  metrics: {
    viewCount: {
      type: Number,
      default: 0
    },
    lastViewedAt: Date,
    lastViewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    processingTime: Number, // Time from creation to first review in minutes
    totalHandlingTime: Number // Total time to resolution in minutes
  },

  // Legal/Compliance
  legal: {
    requiresLegalReview: {
      type: Boolean,
      default: false
    },
    legalReviewed: Boolean,
    legalNotes: {
      type: String,
      select: false // Only visible to legal team
    },
    lawEnforcementInvolved: Boolean,
    caseNumber: String,
    jurisdiction: String
  },

  // Report Validity
  validity: {
    isValid: Boolean,
    isFalseReport: Boolean,
    isAbuse: Boolean,
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: Date
  },

  // System Flags
  flags: {
    isUrgent: {
      type: Boolean,
      default: false
    },
    requiresAdminReview: {
      type: Boolean,
      default: false
    },
    isSystemGenerated: {
      type: Boolean,
      default: false
    },
    isBulkReport: {
      type: Boolean,
      default: false
    },
    isTestReport: {
      type: Boolean,
      default: false
    }
  },

  // Affected Users (for tracking impact)
  affectedUsers: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    impact: {
      type: String,
      enum: ['victim', 'witness', 'mentioned', 'other']
    }
  }],

  // Tags for categorization
  tags: [String],

  // Metadata
  metadata: {
    source: {
      type: String,
      enum: ['app', 'web', 'mobile', 'api', 'auto_detect', 'admin_panel'],
      default: 'app'
    },
    reportVersion: {
      type: String,
      default: '1.0'
    },
    clientInfo: {
      platform: String,
      version: String,
      locale: String
    }
  },

  // Deletion flag (soft delete)
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  },

  deletedAt: Date,
  deletedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }

}, {
  timestamps: true,
  collection: 'reports'
});

// Indexes for performance
reportSchema.index({ type: 1, status: 1 });
reportSchema.index({ reportedBy: 1, createdAt: -1 });
reportSchema.index({ targetId: 1, targetModel: 1 });
reportSchema.index({ category: 1, severity: 1 });
reportSchema.index({ assignedTo: 1, status: 1 });
reportSchema.index({ 'escalation.isEscalated': 1, priority: -1 });
reportSchema.index({ createdAt: -1 });
reportSchema.index({ 'targetContext.serverId': 1, status: 1 });
reportSchema.index({ 'flags.isUrgent': 1, status: 1 });

// Compound indexes for common queries
reportSchema.index({ status: 1, priority: -1, createdAt: -1 });
reportSchema.index({ type: 1, category: 1, status: 1 });

// Text index for searching
reportSchema.index({ 
  description: 'text', 
  'moderatorNotes.content': 'text',
  tags: 'text' 
});

// Virtual for report age
reportSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60)); // in hours
});

// Virtual for is overdue
reportSchema.virtual('isOverdue').get(function() {
  if (this.status === 'resolved' || this.status === 'dismissed') return false;
  
  const maxResponseTime = {
    critical: 1, // 1 hour
    high: 6,     // 6 hours
    medium: 24,  // 24 hours
    low: 72      // 72 hours
  };
  
  const hours = Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60));
  return hours > (maxResponseTime[this.severity] || 24);
});

// Pre-save middleware
reportSchema.pre('save', async function(next) {
  // Auto-set severity based on category
  if (!this.severity) {
    const criticalCategories = ['child_safety', 'self_harm', 'threats', 'doxxing'];
    const highCategories = ['hate_speech', 'harassment', 'illegal_content', 'malware'];
    
    if (criticalCategories.includes(this.category)) {
      this.severity = 'critical';
    } else if (highCategories.includes(this.category)) {
      this.severity = 'high';
    }
  }

  // Auto-escalate based on category
  if (this.category === 'child_safety' || this.category === 'illegal_content') {
    this.escalation.isEscalated = true;
    this.escalation.escalationLevel = 3;
    this.flags.requiresAdminReview = true;
    this.legal.requiresLegalReview = true;
  }

  // Set priority based on severity
  if (!this.priority) {
    const priorityMap = {
      critical: 10,
      high: 7,
      medium: 5,
      low: 2
    };
    this.priority = priorityMap[this.severity] || 5;
  }

  next();
});

// Methods
reportSchema.methods.escalate = async function(userId, reason, level = 1) {
  this.escalation.isEscalated = true;
  this.escalation.escalatedBy = userId;
  this.escalation.escalatedAt = new Date();
  this.escalation.escalationReason = reason;
  this.escalation.escalationLevel = Math.min(level, 3);
  
  // Increase priority
  this.priority = Math.min(this.priority + 3, 10);
  
  await this.save();
  return this;
};

reportSchema.methods.assign = async function(moderatorId) {
  this.assignedTo = moderatorId;
  this.assignedAt = new Date();
  this.status = 'reviewing';
  
  if (!this.metrics.processingTime) {
    this.metrics.processingTime = Math.floor(
      (Date.now() - this.createdAt) / (1000 * 60)
    );
  }
  
  await this.save();
  return this;
};

reportSchema.methods.resolve = async function(resolution, moderatorId) {
  this.status = 'resolved';
  this.resolution = {
    ...resolution,
    resolvedBy: moderatorId,
    resolvedAt: new Date(),
    timeToResolve: Math.floor((Date.now() - this.createdAt) / (1000 * 60))
  };
  
  this.metrics.totalHandlingTime = this.resolution.timeToResolve;
  
  await this.save();
  return this;
};

reportSchema.methods.addNote = async function(authorId, content, isInternal = true) {
  this.moderatorNotes.push({
    author: authorId,
    content,
    timestamp: new Date(),
    isInternal
  });
  
  await this.save();
  return this;
};

reportSchema.methods.markAsFalse = async function(moderatorId) {
  this.status = 'false_report';
  this.validity.isFalseReport = true;
  this.validity.verifiedBy = moderatorId;
  this.validity.verifiedAt = new Date();
  
  await this.save();
  return this;
};

// Statics
reportSchema.statics.findSimilar = async function(targetId, category, timeWindow = 24) {
  const since = new Date(Date.now() - timeWindow * 60 * 60 * 1000);
  
  return this.find({
    targetId,
    category,
    createdAt: { $gte: since },
    status: { $in: ['pending', 'reviewing', 'under_investigation'] }
  });
};

reportSchema.statics.getStats = async function(timeframe = 'day') {
  const now = new Date();
  let startDate;
  
  switch(timeframe) {
    case 'hour':
      startDate = new Date(now - 60 * 60 * 1000);
      break;
    case 'day':
      startDate = new Date(now - 24 * 60 * 60 * 1000);
      break;
    case 'week':
      startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now - 24 * 60 * 60 * 1000);
  }

  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        byStatus: {
          $push: '$status'
        },
        byCategory: {
          $push: '$category'
        },
        bySeverity: {
          $push: '$severity'
        },
        avgResolutionTime: {
          $avg: '$resolution.timeToResolve'
        }
      }
    },
    {
      $project: {
        total: 1,
        pending: {
          $size: {
            $filter: {
              input: '$byStatus',
              cond: { $eq: ['$$this', 'pending'] }
            }
          }
        },
        resolved: {
          $size: {
            $filter: {
              input: '$byStatus',
              cond: { $eq: ['$$this', 'resolved'] }
            }
          }
        },
        criticalCount: {
          $size: {
            $filter: {
              input: '$bySeverity',
              cond: { $eq: ['$$this', 'critical'] }
            }
          }
        },
        avgResolutionTime: { $round: ['$avgResolutionTime', 0] },
        topCategories: {
          $slice: [
            {
              $sortArray: {
                input: { $setUnion: ['$byCategory', []] },
                sortBy: -1
              }
            },
            5
          ]
        }
      }
    }
  ]);
};

reportSchema.statics.getModerationQueue = async function(moderatorId, filters = {}) {
  const query = {
    status: { $in: ['pending', 'reviewing', 'under_investigation'] },
    isDeleted: false
  };

  if (filters.type) query.type = filters.type;
  if (filters.category) query.category = filters.category;
  if (filters.severity) query.severity = filters.severity;
  if (filters.assigned) query.assignedTo = moderatorId;
  if (filters.urgent) query['flags.isUrgent'] = true;

  return this.find(query)
    .populate('reportedBy', 'username avatar')
    .populate('assignedTo', 'username')
    .sort({ priority: -1, createdAt: 1 })
    .limit(filters.limit || 50);
};

reportSchema.statics.checkDuplicate = async function(targetId, reportedBy, category) {
  const existingReport = await this.findOne({
    targetId,
    reportedBy,
    category,
    status: { $nin: ['resolved', 'dismissed', 'false_report'] }
  });
  
  return existingReport;
};

// Plugins
reportSchema.plugin(require('mongoose-aggregate-paginate-v2'));

const Report = mongoose.model('Report', reportSchema);

export default Report;