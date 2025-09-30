const { EventEmitter } = require('events');
const Redis = require('ioredis');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const Filter = require('bad-words');
const axios = require('axios');
const natural = require('natural');

// Initialize Redis
const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  keyPrefix: 'modbot:'
});

// Initialize profanity filter
const profanityFilter = new Filter();

// Sentiment analyzer
const sentiment = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');

class ModerationBot extends EventEmitter {
  constructor() {
    super();
    
    this.autoModRules = new Map();
    this.warnings = new Map();
    this.mutes = new Map();
    this.bans = new Map();
    this.raidProtection = new Map();
    this.messageCache = new Map();
    this.userViolations = new Map();
    
    this.initializeBot();
  }

  async initializeBot() {
    // Load moderation settings
    await this.loadModerationSettings();
    
    // Initialize auto-moderation rules
    this.initializeAutoModRules();
    
    // Start violation cleanup
    this.startViolationCleanup();
    
    console.log('Moderation Bot initialized');
  }

  // ========================
  // Auto-Moderation Rules
  // ========================

  initializeAutoModRules() {
    // Default auto-mod rules
    this.registerAutoModRule('profanity', this.checkProfanity.bind(this));
    this.registerAutoModRule('spam', this.checkSpam.bind(this));
    this.registerAutoModRule('caps', this.checkCaps.bind(this));
    this.registerAutoModRule('links', this.checkLinks.bind(this));
    this.registerAutoModRule('mentions', this.checkMentions.bind(this));
    this.registerAutoModRule('emojis', this.checkEmojis.bind(this));
    this.registerAutoModRule('attachments', this.checkAttachments.bind(this));
    this.registerAutoModRule('invites', this.checkInvites.bind(this));
    this.registerAutoModRule('raid', this.checkRaid.bind(this));
    this.registerAutoModRule('phishing', this.checkPhishing.bind(this));
    this.registerAutoModRule('nsfw', this.checkNSFW.bind(this));
    this.registerAutoModRule('toxicity', this.checkToxicity.bind(this));
  }

  registerAutoModRule(name, handler) {
    this.autoModRules.set(name, {
      name,
      handler,
      enabled: true,
      config: {}
    });
  }

  // ========================
  // Message Processing
  // ========================

  async processMessage(message, context) {
    const { userId, serverId, channelId, content, attachments } = message;
    
    // Skip if user is moderator or admin
    if (context.isModerator || context.isAdmin) {
      return { allowed: true };
    }
    
    // Get server moderation settings
    const settings = await this.getServerModerationSettings(serverId);
    
    // Track message for pattern analysis
    this.trackMessage(userId, message);
    
    // Run auto-moderation checks
    const violations = [];
    
    for (const [ruleName, rule] of this.autoModRules) {
      if (!settings[ruleName]?.enabled) continue;
      
      const result = await rule.handler(message, context, settings[ruleName]);
      
      if (result.violated) {
        violations.push({
          rule: ruleName,
          severity: result.severity || 'low',
          reason: result.reason,
          action: result.action
        });
      }
    }
    
    // Process violations
    if (violations.length > 0) {
      return await this.handleViolations(violations, message, context);
    }
    
    return { allowed: true };
  }

  // ========================
  // Auto-Mod Checks
  // ========================

  async checkProfanity(message, context, config) {
    const { content } = message;
    
    // Check for profanity
    if (profanityFilter.isProfane(content)) {
      return {
        violated: true,
        severity: 'medium',
        reason: 'Message contains profanity',
        action: 'delete'
      };
    }
    
    // Check custom banned words
    const bannedWords = config.bannedWords || [];
    for (const word of bannedWords) {
      if (content.toLowerCase().includes(word.toLowerCase())) {
        return {
          violated: true,
          severity: 'medium',
          reason: `Message contains banned word: ${word}`,
          action: 'delete'
        };
      }
    }
    
    return { violated: false };
  }

  async checkSpam(message, context, config) {
    const { userId, content, channelId } = message;
    const maxMessages = config.maxMessages || 5;
    const timeWindow = config.timeWindow || 5000; // 5 seconds
    
    // Get user's recent messages
    const userMessages = this.messageCache.get(userId) || [];
    const now = Date.now();
    
    // Filter messages within time window
    const recentMessages = userMessages.filter(msg => 
      now - msg.timestamp < timeWindow
    );
    
    // Check for spam patterns
    if (recentMessages.length >= maxMessages) {
      return {
        violated: true,
        severity: 'high',
        reason: `Sending messages too quickly (${recentMessages.length} in ${timeWindow/1000}s)`,
        action: 'timeout'
      };
    }
    
    // Check for duplicate messages
    const duplicates = recentMessages.filter(msg => 
      msg.content === content
    );
    
    if (duplicates.length >= 3) {
      return {
        violated: true,
        severity: 'medium',
        reason: 'Sending duplicate messages',
        action: 'delete'
      };
    }
    
    // Check for channel hopping spam
    const differentChannels = new Set(recentMessages.map(msg => msg.channelId));
    if (differentChannels.size >= 5 && recentMessages.length >= 5) {
      return {
        violated: true,
        severity: 'high',
        reason: 'Spamming across multiple channels',
        action: 'timeout'
      };
    }
    
    return { violated: false };
  }

  async checkCaps(message, context, config) {
    const { content } = message;
    const minLength = config.minLength || 10;
    const maxPercentage = config.maxPercentage || 70;
    
    if (content.length < minLength) {
      return { violated: false };
    }
    
    const capsCount = (content.match(/[A-Z]/g) || []).length;
    const letterCount = (content.match(/[a-zA-Z]/g) || []).length;
    
    if (letterCount === 0) {
      return { violated: false };
    }
    
    const capsPercentage = (capsCount / letterCount) * 100;
    
    if (capsPercentage > maxPercentage) {
      return {
        violated: true,
        severity: 'low',
        reason: `Excessive caps (${Math.round(capsPercentage)}%)`,
        action: 'warn'
      };
    }
    
    return { violated: false };
  }

  async checkLinks(message, context, config) {
    const { content } = message;
    const allowedDomains = config.allowedDomains || [];
    const blockAllLinks = config.blockAllLinks || false;
    
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const urls = content.match(urlRegex);
    
    if (!urls) {
      return { violated: false };
    }
    
    if (blockAllLinks) {
      return {
        violated: true,
        severity: 'medium',
        reason: 'Links are not allowed',
        action: 'delete'
      };
    }
    
    // Check if URLs are from allowed domains
    for (const url of urls) {
      try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname;
        
        if (!allowedDomains.some(allowed => domain.includes(allowed))) {
          return {
            violated: true,
            severity: 'medium',
            reason: `Link from unauthorized domain: ${domain}`,
            action: 'delete'
          };
        }
      } catch (e) {
        // Invalid URL
      }
    }
    
    return { violated: false };
  }

  async checkMentions(message, context, config) {
    const { content } = message;
    const maxMentions = config.maxMentions || 5;
    const maxRoleMentions = config.maxRoleMentions || 2;
    
    // Count user mentions
    const userMentions = (content.match(/<@!?\d+>/g) || []).length;
    
    // Count role mentions
    const roleMentions = (content.match(/<@&\d+>/g) || []).length;
    
    // Count @everyone and @here
    const everyoneMentions = (content.match(/@(everyone|here)/g) || []).length;
    
    if (everyoneMentions > 0 && !context.canMentionEveryone) {
      return {
        violated: true,
        severity: 'high',
        reason: 'Unauthorized @everyone or @here mention',
        action: 'delete'
      };
    }
    
    if (userMentions > maxMentions) {
      return {
        violated: true,
        severity: 'medium',
        reason: `Too many user mentions (${userMentions})`,
        action: 'delete'
      };
    }
    
    if (roleMentions > maxRoleMentions) {
      return {
        violated: true,
        severity: 'medium',
        reason: `Too many role mentions (${roleMentions})`,
        action: 'delete'
      };
    }
    
    return { violated: false };
  }

  async checkEmojis(message, context, config) {
    const { content } = message;
    const maxEmojis = config.maxEmojis || 10;
    
    // Count custom emojis
    const customEmojis = (content.match(/<a?:\w+:\d+>/g) || []).length;
    
    // Count unicode emojis
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
    const unicodeEmojis = (content.match(emojiRegex) || []).length;
    
    const totalEmojis = customEmojis + unicodeEmojis;
    
    if (totalEmojis > maxEmojis) {
      return {
        violated: true,
        severity: 'low',
        reason: `Too many emojis (${totalEmojis})`,
        action: 'warn'
      };
    }
    
    return { violated: false };
  }

  async checkInvites(message, context, config) {
    const { content } = message;
    const allowOwnServer = config.allowOwnServer || true;
    
    // Discord invite regex
    const inviteRegex = /(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/[a-zA-Z0-9]+/gi;
    const invites = content.match(inviteRegex);
    
    if (!invites) {
      return { violated: false };
    }
    
    // Check if invite is for current server
    if (allowOwnServer) {
      // Would need to validate against actual server invites
      // For now, block all external invites
    }
    
    return {
      violated: true,
      severity: 'high',
      reason: 'External server invites are not allowed',
      action: 'delete'
    };
  }

  async checkRaid(message, context, config) {
    const { serverId, userId } = message;
    const timeWindow = config.timeWindow || 10000; // 10 seconds
    const userThreshold = config.userThreshold || 5;
    const messageThreshold = config.messageThreshold || 20;
    
    const now = Date.now();
    const raidData = this.raidProtection.get(serverId) || {
      users: new Map(),
      messageCount: 0,
      startTime: now
    };
    
    // Reset if time window passed
    if (now - raidData.startTime > timeWindow) {
      raidData.users.clear();
      raidData.messageCount = 0;
      raidData.startTime = now;
    }
    
    // Track user
    raidData.users.set(userId, now);
    raidData.messageCount++;
    
    this.raidProtection.set(serverId, raidData);
    
    // Check for raid patterns
    if (raidData.users.size >= userThreshold && 
        raidData.messageCount >= messageThreshold) {
      
      // Trigger raid protection
      this.emit('raid:detected', {
        serverId,
        userCount: raidData.users.size,
        messageCount: raidData.messageCount
      });
      
      return {
        violated: true,
        severity: 'critical',
        reason: 'Raid detected',
        action: 'lockdown'
      };
    }
    
    return { violated: false };
  }

  async checkPhishing(message, context, config) {
    const { content } = message;
    
    // Common phishing patterns
    const phishingPatterns = [
      /free\s+nitro/gi,
      /steam\s+gift/gi,
      /click\s+here\s+to\s+claim/gi,
      /limited\s+time\s+offer/gi,
      /verify\s+your\s+account/gi
    ];
    
    for (const pattern of phishingPatterns) {
      if (pattern.test(content)) {
        // Check against phishing database
        const urls = content.match(/(https?:\/\/[^\s]+)/gi);
        if (urls) {
          for (const url of urls) {
            const isPhishing = await this.checkPhishingDatabase(url);
            if (isPhishing) {
              return {
                violated: true,
                severity: 'critical',
                reason: 'Phishing link detected',
                action: 'ban'
              };
            }
          }
        }
        
        return {
          violated: true,
          severity: 'high',
          reason: 'Suspicious phishing pattern detected',
          action: 'delete'
        };
      }
    }
    
    return { violated: false };
  }

  async checkNSFW(message, context, config) {
    const { attachments, channelId } = message;
    
    // Skip if channel is marked as NSFW
    if (context.isNSFWChannel) {
      return { violated: false };
    }
    
    if (!attachments || attachments.length === 0) {
      return { violated: false };
    }
    
    // Check image attachments for NSFW content
    for (const attachment of attachments) {
      if (this.isImageAttachment(attachment)) {
        // This would integrate with an NSFW detection API
        const isNSFW = await this.checkNSFWContent(attachment.url);
        
        if (isNSFW) {
          return {
            violated: true,
            severity: 'high',
            reason: 'NSFW content detected',
            action: 'delete'
          };
        }
      }
    }
    
    return { violated: false };
  }

  async checkToxicity(message, context, config) {
    const { content } = message;
    const threshold = config.threshold || 0.7;
    
    // Analyze sentiment
    const tokens = new natural.WordTokenizer().tokenize(content);
    const score = sentiment.getSentiment(tokens);
    
    // Check for toxic patterns
    const toxicPatterns = [
      /k(ill|ys)\s+yourself/gi,
      /go\s+die/gi,
      /hate\s+you/gi,
      /stupid|idiot|retard/gi
    ];
    
    let isToxic = false;
    for (const pattern of toxicPatterns) {
      if (pattern.test(content)) {
        isToxic = true;
        break;
      }
    }
    
    // Combined toxicity check
    if (score < -3 || isToxic) {
      // Use external toxicity API for better detection
      const toxicityScore = await this.checkToxicityAPI(content);
      
      if (toxicityScore > threshold) {
        return {
          violated: true,
          severity: 'high',
          reason: `Toxic behavior detected (score: ${toxicityScore.toFixed(2)})`,
          action: 'timeout'
        };
      }
    }
    
    return { violated: false };
  }

  async checkAttachments(message, context, config) {
    const { attachments } = message;
    const maxSize = config.maxSize || 8388608; // 8MB
    const allowedTypes = config.allowedTypes || [];
    
    if (!attachments || attachments.length === 0) {
      return { violated: false };
    }
    
    for (const attachment of attachments) {
      // Check file size
      if (attachment.size > maxSize) {
        return {
          violated: true,
          severity: 'low',
          reason: `File too large (${(attachment.size / 1048576).toFixed(2)}MB)`,
          action: 'delete'
        };
      }
      
      // Check file type
      if (allowedTypes.length > 0) {
        const fileExtension = attachment.filename.split('.').pop().toLowerCase();
        if (!allowedTypes.includes(fileExtension)) {
          return {
            violated: true,
            severity: 'medium',
            reason: `File type not allowed: .${fileExtension}`,
            action: 'delete'
          };
        }
      }
      
      // Check for malware (would integrate with virus scanning API)
      const isMalware = await this.scanForMalware(attachment);
      if (isMalware) {
        return {
          violated: true,
          severity: 'critical',
          reason: 'Malware detected in attachment',
          action: 'ban'
        };
      }
    }
    
    return { violated: false };
  }

  // ========================
  // Violation Handling
  // ========================

  async handleViolations(violations, message, context) {
    const { userId, serverId, channelId } = message;
    
    // Track user violations
    await this.trackUserViolation(userId, serverId, violations);
    
    // Determine most severe action
    const severityOrder = ['low', 'medium', 'high', 'critical'];
    const actionOrder = ['warn', 'delete', 'timeout', 'kick', 'ban', 'lockdown'];
    
    let highestSeverity = 'low';
    let strongestAction = 'warn';
    
    for (const violation of violations) {
      if (severityOrder.indexOf(violation.severity) > severityOrder.indexOf(highestSeverity)) {
        highestSeverity = violation.severity;
      }
      if (actionOrder.indexOf(violation.action) > actionOrder.indexOf(strongestAction)) {
        strongestAction = violation.action;
      }
    }
    
    // Execute action
    const result = await this.executeAction(strongestAction, message, context, violations);
    
    // Log moderation action
    await this.logModerationAction({
      action: strongestAction,
      userId,
      serverId,
      channelId,
      violations,
      timestamp: Date.now()
    });
    
    // Emit moderation event
    this.emit('moderation:action', {
      action: strongestAction,
      userId,
      serverId,
      violations,
      message
    });
    
    return result;
  }

  async executeAction(action, message, context, violations) {
    const { userId, serverId, channelId } = message;
    
    switch (action) {
      case 'warn':
        await this.warnUser(userId, serverId, violations[0].reason);
        return {
          allowed: true,
          warning: violations[0].reason
        };
      
      case 'delete':
        return {
          allowed: false,
          delete: true,
          reason: violations[0].reason
        };
      
      case 'timeout':
        await this.timeoutUser(userId, serverId, 600000); // 10 minutes
        return {
          allowed: false,
          delete: true,
          timeout: true,
          duration: 600000,
          reason: violations[0].reason
        };
      
      case 'kick':
        await this.kickUser(userId, serverId, violations[0].reason);
        return {
          allowed: false,
          delete: true,
          kick: true,
          reason: violations[0].reason
        };
      
      case 'ban':
        await this.banUser(userId, serverId, violations[0].reason);
        return {
          allowed: false,
          delete: true,
          ban: true,
          reason: violations[0].reason
        };
      
      case 'lockdown':
        await this.lockdownChannel(channelId, serverId);
        return {
          allowed: false,
          delete: true,
          lockdown: true,
          reason: 'Raid protection activated'
        };
      
      default:
        return {
          allowed: true
        };
    }
  }

  // ========================
  // Moderation Actions
  // ========================

  async warnUser(userId, serverId, reason) {
    const warningId = uuidv4();
    const warning = {
      id: warningId,
      userId,
      serverId,
      reason,
      timestamp: Date.now(),
      expiresAt: Date.now() + 2592000000 // 30 days
    };
    
    // Store warning
    await redisClient.setex(
      `warning:${warningId}`,
      2592000, // 30 days
      JSON.stringify(warning)
    );
    
    // Track user warnings
    const userWarnings = this.warnings.get(userId) || [];
    userWarnings.push(warning);
    this.warnings.set(userId, userWarnings);
    
    // Check for escalation
    if (userWarnings.length >= 3) {
      // Auto-timeout after 3 warnings
      await this.timeoutUser(userId, serverId, 3600000); // 1 hour
    }
    
    this.emit('moderation:warn', {
      userId,
      serverId,
      reason,
      warningCount: userWarnings.length
    });
  }

  async timeoutUser(userId, serverId, duration) {
    const timeoutId = uuidv4();
    const timeout = {
      id: timeoutId,
      userId,
      serverId,
      duration,
      startTime: Date.now(),
      endTime: Date.now() + duration
    };
    
    // Store timeout
    await redisClient.setex(
      `timeout:${userId}:${serverId}`,
      Math.ceil(duration / 1000),
      JSON.stringify(timeout)
    );
    
    this.mutes.set(`${userId}:${serverId}`, timeout);
    
    // Schedule unmute
    setTimeout(() => {
      this.unmute(userId, serverId);
    }, duration);
    
    this.emit('moderation:timeout', {
      userId,
      serverId,
      duration
    });
  }

  async kickUser(userId, serverId, reason) {
    this.emit('moderation:kick', {
      userId,
      serverId,
      reason
    });
  }

  async banUser(userId, serverId, reason, duration = null) {
    const banId = uuidv4();
    const ban = {
      id: banId,
      userId,
      serverId,
      reason,
      timestamp: Date.now(),
      permanent: !duration,
      expiresAt: duration ? Date.now() + duration : null
    };
    
    // Store ban
    const key = `ban:${userId}:${serverId}`;
    if (duration) {
      await redisClient.setex(key, Math.ceil(duration / 1000), JSON.stringify(ban));
    } else {
      await redisClient.set(key, JSON.stringify(ban));
    }
    
    this.bans.set(`${userId}:${serverId}`, ban);
    
    this.emit('moderation:ban', {
      userId,
      serverId,
      reason,
      duration
    });
  }

  async lockdownChannel(channelId, serverId) {
    this.emit('moderation:lockdown', {
      channelId,
      serverId
    });
    
    // Auto-unlock after 5 minutes
    setTimeout(() => {
      this.emit('moderation:unlock', {
        channelId,
        serverId
      });
    }, 300000);
  }

  async unmute(userId, serverId) {
    await redisClient.del(`timeout:${userId}:${serverId}`);
    this.mutes.delete(`${userId}:${serverId}`);
    
    this.emit('moderation:unmute', {
      userId,
      serverId
    });
  }

  // ========================
  // Utility Methods
  // ========================

  trackMessage(userId, message) {
    const userMessages = this.messageCache.get(userId) || [];
    
    userMessages.push({
      content: message.content,
      channelId: message.channelId,
      timestamp: Date.now()
    });
    
    // Keep only last 20 messages
    if (userMessages.length > 20) {
      userMessages.shift();
    }
    
    this.messageCache.set(userId, userMessages);
  }

  async trackUserViolation(userId, serverId, violations) {
    const key = `violations:${userId}:${serverId}`;
    const userViolations = await redisClient.get(key);
    
    const violationData = userViolations ? JSON.parse(userViolations) : {
      count: 0,
      violations: [],
      firstViolation: Date.now()
    };
    
    violationData.count++;
    violationData.violations.push({
      timestamp: Date.now(),
      violations
    });
    
    // Keep only last 10 violations
    if (violationData.violations.length > 10) {
      violationData.violations.shift();
    }
    
    await redisClient.setex(
      key,
      86400, // 24 hours
      JSON.stringify(violationData)
    );
    
    this.userViolations.set(`${userId}:${serverId}`, violationData);
  }

  async getServerModerationSettings(serverId) {
    const settings = await redisClient.get(`settings:${serverId}`);
    
    if (settings) {
      return JSON.parse(settings);
    }
    
    // Return default settings
    return {
      profanity: { enabled: true },
      spam: { enabled: true, maxMessages: 5, timeWindow: 5000 },
      caps: { enabled: true, minLength: 10, maxPercentage: 70 },
      links: { enabled: false, allowedDomains: [] },
      mentions: { enabled: true, maxMentions: 5 },
      emojis: { enabled: false, maxEmojis: 10 },
      invites: { enabled: true },
      raid: { enabled: true, userThreshold: 5, messageThreshold: 20 },
      phishing: { enabled: true },
      nsfw: { enabled: true },
      toxicity: { enabled: true, threshold: 0.7 },
      attachments: { enabled: false }
    };
  }

  async updateServerModerationSettings(serverId, settings) {
    await redisClient.set(
      `settings:${serverId}`,
      JSON.stringify(settings)
    );
  }

  async logModerationAction(action) {
    const logKey = `modlog:${action.serverId}`;
    await redisClient.zadd(
      logKey,
      action.timestamp,
      JSON.stringify(action)
    );
    
    // Keep only last 1000 entries
    await redisClient.zremrangebyrank(logKey, 0, -1001);
  }

  async getModerationLog(serverId, limit = 50) {
    const logs = await redisClient.zrevrange(
      `modlog:${serverId}`,
      0,
      limit - 1
    );
    
    return logs.map(log => JSON.parse(log));
  }

  async getUserWarnings(userId, serverId) {
    const warnings = [];
    const pattern = `warning:*`;
    const keys = await redisClient.keys(pattern);
    
    for (const key of keys) {
      const warning = JSON.parse(await redisClient.get(key));
      if (warning.userId === userId && warning.serverId === serverId) {
        warnings.push(warning);
      }
    }
    
    return warnings;
  }

  async clearUserWarnings(userId, serverId) {
    const warnings = await this.getUserWarnings(userId, serverId);
    
    for (const warning of warnings) {
      await redisClient.del(`warning:${warning.id}`);
    }
    
    this.warnings.delete(userId);
  }

  // ========================
  // External API Checks
  // ========================

  async checkPhishingDatabase(url) {
    // This would check against known phishing databases
    // For example, Google Safe Browsing API
    try {
      // Placeholder implementation
      const knownPhishingSites = [
        'phishing-site.com',
        'fake-discord.com',
        'steam-scam.com'
      ];
      
      const urlObj = new URL(url);
      return knownPhishingSites.includes(urlObj.hostname);
    } catch (error) {
      return false;
    }
  }

  async checkNSFWContent(imageUrl) {
    // This would use an NSFW detection API
    // For example, Google Cloud Vision API or similar
    try {
      // Placeholder implementation
      return false;
    } catch (error) {
      return false;
    }
  }

  async checkToxicityAPI(text) {
    // This would use a toxicity detection API
    // For example, Perspective API
    try {
      // Placeholder implementation - return random score for demo
      return Math.random();
    } catch (error) {
      return 0;
    }
  }

  async scanForMalware(attachment) {
    // This would use a virus scanning API
    // For example, VirusTotal API
    try {
      // Placeholder implementation
      return false;
    } catch (error) {
      return false;
    }
  }

  // ========================
  // Helper Methods
  // ========================

  isImageAttachment(attachment) {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
    const extension = attachment.filename.split('.').pop().toLowerCase();
    return imageExtensions.includes(extension);
  }

  startViolationCleanup() {
    // Clean up old violations every hour
    setInterval(() => {
      // Clear old message cache
      for (const [userId, messages] of this.messageCache) {
        const filtered = messages.filter(msg => 
          Date.now() - msg.timestamp < 60000 // Keep last minute
        );
        
        if (filtered.length === 0) {
          this.messageCache.delete(userId);
        } else {
          this.messageCache.set(userId, filtered);
        }
      }
      
      // Clear old raid protection data
      for (const [serverId, data] of this.raidProtection) {
        if (Date.now() - data.startTime > 60000) {
          this.raidProtection.delete(serverId);
        }
      }
    }, 60000); // Every minute
  }

  async loadModerationSettings() {
    // Load saved warnings
    const warningKeys = await redisClient.keys('warning:*');
    for (const key of warningKeys) {
      const warning = JSON.parse(await redisClient.get(key));
      
      const userWarnings = this.warnings.get(warning.userId) || [];
      userWarnings.push(warning);
      this.warnings.set(warning.userId, userWarnings);
    }
    
    // Load active timeouts
    const timeoutKeys = await redisClient.keys('timeout:*');
    for (const key of timeoutKeys) {
      const timeout = JSON.parse(await redisClient.get(key));
      const timeLeft = timeout.endTime - Date.now();
      
      if (timeLeft > 0) {
        this.mutes.set(`${timeout.userId}:${timeout.serverId}`, timeout);
        
        // Re-schedule unmute
        setTimeout(() => {
          this.unmute(timeout.userId, timeout.serverId);
        }, timeLeft);
      }
    }
    
    // Load active bans
    const banKeys = await redisClient.keys('ban:*');
    for (const key of banKeys) {
      const ban = JSON.parse(await redisClient.get(key));
      this.bans.set(`${ban.userId}:${ban.serverId}`, ban);
    }
    
    console.log(`Loaded ${this.warnings.size} warnings, ${this.mutes.size} timeouts, ${this.bans.size} bans`);
  }
}

// Create singleton instance
const moderationBot = new ModerationBot();

module.exports = moderationBot;