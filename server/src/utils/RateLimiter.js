// server/src/utils/RateLimiter.js

const Redis = require('ioredis');
const crypto = require('crypto');
const logger = require('./logger');

/**
 * Advanced Rate Limiter with multiple strategies and Redis support
 * Supports sliding window, token bucket, and fixed window algorithms
 */
class RateLimiter {
  constructor(options = {}) {
    this.redis = options.redis || new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times) => Math.min(times * 50, 2000),
      enableOfflineQueue: false
    });

    // Default configurations for different operations
    this.limits = {
      // API endpoints
      api: {
        default: { points: 100, duration: 60, blockDuration: 60 },
        auth: { points: 5, duration: 60, blockDuration: 300 },
        message: { points: 30, duration: 60, blockDuration: 60 },
        fileUpload: { points: 10, duration: 300, blockDuration: 300 },
        voiceJoin: { points: 5, duration: 60, blockDuration: 60 },
        serverCreate: { points: 2, duration: 3600, blockDuration: 3600 },
        channelCreate: { points: 10, duration: 3600, blockDuration: 300 },
        reaction: { points: 50, duration: 60, blockDuration: 30 },
        search: { points: 20, duration: 60, blockDuration: 60 },
        userUpdate: { points: 5, duration: 300, blockDuration: 300 },
      },
      // WebSocket events
      ws: {
        message: { points: 60, duration: 60, blockDuration: 60 },
        typing: { points: 10, duration: 60, blockDuration: 30 },
        presence: { points: 20, duration: 60, blockDuration: 30 },
        voiceState: { points: 10, duration: 60, blockDuration: 60 },
      },
      // User role multipliers
      roleMultipliers: {
        admin: 10,
        moderator: 5,
        premium: 2,
        verified: 1.5,
        default: 1
      },
      // Global limits
      global: {
        ipLimit: { points: 1000, duration: 3600, blockDuration: 3600 },
        userLimit: { points: 500, duration: 3600, blockDuration: 1800 }
      }
    };

    // Merge custom limits
    if (options.limits) {
      this.limits = this.deepMerge(this.limits, options.limits);
    }

    // Penalty system for repeated violations
    this.penaltyMultiplier = options.penaltyMultiplier || 2;
    this.maxPenalty = options.maxPenalty || 86400; // 24 hours max block

    // Whitelist and blacklist
    this.whitelist = new Set(options.whitelist || []);
    this.blacklist = new Set(options.blacklist || []);

    // Cache for performance
    this.cache = new Map();
    this.cacheExpiry = options.cacheExpiry || 1000; // 1 second cache

    // Monitoring
    this.metrics = {
      allowed: 0,
      blocked: 0,
      errors: 0
    };

    // Cleanup interval
    this.setupCleanup();
  }

  /**
   * Main rate limiting check
   */
  async checkLimit(identifier, operation = 'default', options = {}) {
    try {
      // Check blacklist
      if (this.isBlacklisted(identifier)) {
        await this.recordBlock(identifier, operation, 'blacklisted');
        return { 
          allowed: false, 
          reason: 'blacklisted',
          retryAfter: this.maxPenalty 
        };
      }

      // Check whitelist
      if (this.isWhitelisted(identifier)) {
        this.metrics.allowed++;
        return { 
          allowed: true, 
          remaining: Infinity,
          resetAt: null 
        };
      }

      // Get rate limit configuration
      const config = this.getConfig(operation, options.role);
      
      // Check cache first
      const cached = this.getCached(identifier, operation);
      if (cached !== null) {
        return cached;
      }

      // Perform rate limit check based on algorithm
      const algorithm = options.algorithm || 'sliding-window';
      let result;

      switch (algorithm) {
        case 'token-bucket':
          result = await this.tokenBucketCheck(identifier, operation, config, options);
          break;
        case 'fixed-window':
          result = await this.fixedWindowCheck(identifier, operation, config, options);
          break;
        case 'sliding-window':
        default:
          result = await this.slidingWindowCheck(identifier, operation, config, options);
          break;
      }

      // Cache result
      this.setCached(identifier, operation, result);

      // Update metrics
      if (result.allowed) {
        this.metrics.allowed++;
      } else {
        this.metrics.blocked++;
        await this.recordBlock(identifier, operation, result.reason);
      }

      return result;

    } catch (error) {
      logger.error('Rate limiter error:', error);
      this.metrics.errors++;
      
      // Fail open or closed based on configuration
      const failOpen = options.failOpen !== false;
      return { 
        allowed: failOpen, 
        error: error.message 
      };
    }
  }

  /**
   * Sliding window rate limit algorithm
   */
  async slidingWindowCheck(identifier, operation, config, options = {}) {
    const key = this.getKey(identifier, operation);
    const now = Date.now();
    const window = config.duration * 1000;
    const oldTimestamp = now - window;

    // Use Redis pipeline for atomic operations
    const pipeline = this.redis.pipeline();
    
    // Remove old entries
    pipeline.zremrangebyscore(key, '-inf', oldTimestamp);
    
    // Count current entries
    pipeline.zcard(key);
    
    // Add new entry with unique ID to handle concurrent requests
    const uniqueId = `${now}-${crypto.randomBytes(4).toString('hex')}`;
    pipeline.zadd(key, now, uniqueId);
    
    // Set expiry
    pipeline.expire(key, config.duration + 1);
    
    const results = await pipeline.exec();
    const currentCount = results[1][1];

    if (currentCount >= config.points) {
      // Get oldest entry to calculate retry time
      const oldestEntry = await this.redis.zrange(key, 0, 0, 'WITHSCORES');
      const oldestTimestamp = oldestEntry[1] ? parseInt(oldestEntry[1]) : now;
      const retryAfter = Math.ceil((oldestTimestamp + window - now) / 1000);

      // Check for penalties
      const penalty = await this.getPenalty(identifier);
      const actualRetryAfter = Math.max(retryAfter, penalty);

      return {
        allowed: false,
        reason: 'rate_limit_exceeded',
        limit: config.points,
        remaining: 0,
        resetAt: new Date(now + actualRetryAfter * 1000),
        retryAfter: actualRetryAfter
      };
    }

    return {
      allowed: true,
      limit: config.points,
      remaining: Math.max(0, config.points - currentCount - 1),
      resetAt: new Date(oldestTimestamp + window)
    };
  }

  /**
   * Token bucket algorithm
   */
  async tokenBucketCheck(identifier, operation, config, options = {}) {
    const key = this.getKey(identifier, operation, 'bucket');
    const now = Date.now();
    const refillRate = config.points / config.duration; // tokens per second

    // Get current bucket state
    const bucketData = await this.redis.get(key);
    let bucket = bucketData ? JSON.parse(bucketData) : {
      tokens: config.points,
      lastRefill: now
    };

    // Calculate tokens to add based on time passed
    const timePassed = (now - bucket.lastRefill) / 1000;
    const tokensToAdd = timePassed * refillRate;
    bucket.tokens = Math.min(config.points, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;

    // Check if request can be processed
    const tokensRequired = options.cost || 1;
    
    if (bucket.tokens >= tokensRequired) {
      bucket.tokens -= tokensRequired;
      await this.redis.setex(
        key, 
        config.duration * 2, 
        JSON.stringify(bucket)
      );

      return {
        allowed: true,
        limit: config.points,
        remaining: Math.floor(bucket.tokens),
        resetAt: new Date(now + (config.points - bucket.tokens) / refillRate * 1000)
      };
    }

    // Calculate when enough tokens will be available
    const tokensNeeded = tokensRequired - bucket.tokens;
    const retryAfter = Math.ceil(tokensNeeded / refillRate);

    return {
      allowed: false,
      reason: 'insufficient_tokens',
      limit: config.points,
      remaining: Math.floor(bucket.tokens),
      retryAfter,
      resetAt: new Date(now + retryAfter * 1000)
    };
  }

  /**
   * Fixed window algorithm
   */
  async fixedWindowCheck(identifier, operation, config, options = {}) {
    const window = Math.floor(Date.now() / (config.duration * 1000));
    const key = this.getKey(identifier, operation, `window:${window}`);

    const current = await this.redis.incr(key);
    
    if (current === 1) {
      await this.redis.expire(key, config.duration);
    }

    if (current > config.points) {
      const ttl = await this.redis.ttl(key);
      
      return {
        allowed: false,
        reason: 'rate_limit_exceeded',
        limit: config.points,
        remaining: 0,
        retryAfter: ttl > 0 ? ttl : config.duration,
        resetAt: new Date(Date.now() + ttl * 1000)
      };
    }

    return {
      allowed: true,
      limit: config.points,
      remaining: config.points - current,
      resetAt: new Date((window + 1) * config.duration * 1000)
    };
  }

  /**
   * Check multiple limits (user, IP, global)
   */
  async checkMultipleLimit(identifiers, operation, options = {}) {
    const checks = await Promise.all(
      identifiers.map(id => this.checkLimit(id, operation, options))
    );

    // Return the most restrictive result
    const blocked = checks.find(check => !check.allowed);
    return blocked || checks[0];
  }

  /**
   * Reset rate limit for an identifier
   */
  async reset(identifier, operation = null) {
    if (operation) {
      const key = this.getKey(identifier, operation);
      await this.redis.del(key);
    } else {
      // Reset all operations for identifier
      const pattern = `ratelimit:${identifier}:*`;
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    }
    
    // Clear cache
    this.clearCache(identifier, operation);
    
    logger.info(`Rate limit reset for ${identifier}${operation ? `:${operation}` : ''}`);
  }

  /**
   * Get current usage statistics
   */
  async getUsage(identifier, operation) {
    const config = this.getConfig(operation);
    const key = this.getKey(identifier, operation);
    const now = Date.now();
    const window = config.duration * 1000;

    const count = await this.redis.zcount(
      key, 
      now - window, 
      now
    );

    return {
      used: count,
      limit: config.points,
      remaining: Math.max(0, config.points - count),
      percentage: (count / config.points) * 100
    };
  }

  /**
   * Dynamic rate limiting based on server load
   */
  async getDynamicLimit(baseConfig, serverLoad = {}) {
    const { cpu = 50, memory = 50, connections = 1000 } = serverLoad;
    
    let multiplier = 1;
    
    // Reduce limits under high load
    if (cpu > 80) multiplier *= 0.5;
    else if (cpu > 60) multiplier *= 0.75;
    
    if (memory > 80) multiplier *= 0.75;
    
    if (connections > 5000) multiplier *= 0.5;
    else if (connections > 3000) multiplier *= 0.75;

    return {
      ...baseConfig,
      points: Math.max(1, Math.floor(baseConfig.points * multiplier))
    };
  }

  /**
   * Record rate limit violation
   */
  async recordBlock(identifier, operation, reason) {
    const key = `ratelimit:violations:${identifier}`;
    const violation = {
      operation,
      reason,
      timestamp: Date.now()
    };

    await this.redis.lpush(key, JSON.stringify(violation));
    await this.redis.ltrim(key, 0, 99); // Keep last 100 violations
    await this.redis.expire(key, 86400); // Expire after 24 hours

    // Apply penalty for repeated violations
    const violationCount = await this.redis.llen(key);
    if (violationCount > 5) {
      await this.applyPenalty(identifier, violationCount);
    }

    // Emit event for monitoring
    this.emit('violation', { identifier, operation, reason, count: violationCount });
  }

  /**
   * Apply penalty for repeated violations
   */
  async applyPenalty(identifier, violationCount) {
    const penaltyDuration = Math.min(
      this.maxPenalty,
      Math.pow(this.penaltyMultiplier, Math.min(violationCount - 5, 10)) * 60
    );

    const key = `ratelimit:penalty:${identifier}`;
    await this.redis.setex(key, penaltyDuration, violationCount);

    logger.warn(`Penalty applied to ${identifier}: ${penaltyDuration}s`);
  }

  /**
   * Get current penalty duration
   */
  async getPenalty(identifier) {
    const key = `ratelimit:penalty:${identifier}`;
    const ttl = await this.redis.ttl(key);
    return ttl > 0 ? ttl : 0;
  }

  /**
   * Add to whitelist
   */
  addToWhitelist(identifier) {
    this.whitelist.add(identifier);
    logger.info(`Added ${identifier} to whitelist`);
  }

  /**
   * Remove from whitelist
   */
  removeFromWhitelist(identifier) {
    this.whitelist.delete(identifier);
    logger.info(`Removed ${identifier} from whitelist`);
  }

  /**
   * Add to blacklist
   */
  async addToBlacklist(identifier, duration = 86400) {
    this.blacklist.add(identifier);
    
    // Store in Redis for persistence
    const key = `ratelimit:blacklist:${identifier}`;
    await this.redis.setex(key, duration, Date.now());
    
    logger.warn(`Added ${identifier} to blacklist for ${duration}s`);
  }

  /**
   * Remove from blacklist
   */
  async removeFromBlacklist(identifier) {
    this.blacklist.delete(identifier);
    
    const key = `ratelimit:blacklist:${identifier}`;
    await this.redis.del(key);
    
    logger.info(`Removed ${identifier} from blacklist`);
  }

  /**
   * Check if identifier is whitelisted
   */
  isWhitelisted(identifier) {
    return this.whitelist.has(identifier);
  }

  /**
   * Check if identifier is blacklisted
   */
  async isBlacklisted(identifier) {
    if (this.blacklist.has(identifier)) {
      return true;
    }

    // Check Redis for persistent blacklist
    const key = `ratelimit:blacklist:${identifier}`;
    const exists = await this.redis.exists(key);
    
    if (exists) {
      this.blacklist.add(identifier); // Add to memory cache
      return true;
    }

    return false;
  }

  /**
   * Get rate limit configuration for operation and role
   */
  getConfig(operation, role = 'default') {
    const [category, action] = operation.split('.');
    
    let config = this.limits.api.default;
    
    if (category === 'ws' && this.limits.ws[action]) {
      config = this.limits.ws[action];
    } else if (this.limits.api[operation]) {
      config = this.limits.api[operation];
    } else if (this.limits.api[category]) {
      config = this.limits.api[category];
    }

    // Apply role multiplier
    const multiplier = this.limits.roleMultipliers[role] || 1;
    
    return {
      ...config,
      points: Math.floor(config.points * multiplier)
    };
  }

  /**
   * Generate Redis key for rate limiting
   */
  getKey(identifier, operation, suffix = '') {
    const base = `ratelimit:${identifier}:${operation}`;
    return suffix ? `${base}:${suffix}` : base;
  }

  /**
   * Get cached result
   */
  getCached(identifier, operation) {
    const key = `${identifier}:${operation}`;
    const cached = this.cache.get(key);
    
    if (cached && cached.expires > Date.now()) {
      return cached.result;
    }
    
    this.cache.delete(key);
    return null;
  }

  /**
   * Set cached result
   */
  setCached(identifier, operation, result) {
    const key = `${identifier}:${operation}`;
    this.cache.set(key, {
      result,
      expires: Date.now() + this.cacheExpiry
    });
  }

  /**
   * Clear cache
   */
  clearCache(identifier = null, operation = null) {
    if (identifier && operation) {
      this.cache.delete(`${identifier}:${operation}`);
    } else if (identifier) {
      for (const key of this.cache.keys()) {
        if (key.startsWith(`${identifier}:`)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      cacheSize: this.cache.size,
      whitelistSize: this.whitelist.size,
      blacklistSize: this.blacklist.size
    };
  }

  /**
   * Reset metrics
   */
  resetMetrics() {
    this.metrics = {
      allowed: 0,
      blocked: 0,
      errors: 0
    };
  }

  /**
   * Setup periodic cleanup
   */
  setupCleanup() {
    // Clear expired cache entries
    setInterval(() => {
      const now = Date.now();
      for (const [key, value] of this.cache.entries()) {
        if (value.expires <= now) {
          this.cache.delete(key);
        }
      }
    }, 60000); // Every minute

    // Clean up old Redis keys
    setInterval(async () => {
      try {
        const patterns = [
          'ratelimit:*:window:*',
          'ratelimit:violations:*',
          'ratelimit:penalty:*'
        ];

        for (const pattern of patterns) {
          const keys = await this.redis.keys(pattern);
          for (const key of keys) {
            const ttl = await this.redis.ttl(key);
            if (ttl === -1) {
              // No expiry set, set a default
              await this.redis.expire(key, 3600);
            }
          }
        }
      } catch (error) {
        logger.error('Cleanup error:', error);
      }
    }, 3600000); // Every hour
  }

  /**
   * Deep merge objects
   */
  deepMerge(target, source) {
    const output = { ...target };
    
    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach(key => {
        if (isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = this.deepMerge(target[key], source[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    
    return output;
  }

  /**
   * Express middleware factory
   */
  middleware(operation = 'default', options = {}) {
    return async (req, res, next) => {
      // Build identifier from IP and user ID
      const identifiers = [];
      
      // IP-based limiting
      const ip = req.ip || req.connection.remoteAddress;
      identifiers.push(`ip:${ip}`);
      
      // User-based limiting
      if (req.user && req.user.id) {
        identifiers.push(`user:${req.user.id}`);
        options.role = req.user.role || 'default';
      }

      // Check rate limits
      const result = await this.checkMultipleLimit(identifiers, operation, options);

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', result.limit || 0);
      res.setHeader('X-RateLimit-Remaining', result.remaining || 0);
      
      if (result.resetAt) {
        res.setHeader('X-RateLimit-Reset', Math.floor(result.resetAt.getTime() / 1000));
      }

      if (!result.allowed) {
        res.setHeader('Retry-After', result.retryAfter || 60);
        return res.status(429).json({
          error: 'Too Many Requests',
          message: 'Rate limit exceeded',
          retryAfter: result.retryAfter
        });
      }

      next();
    };
  }

  /**
   * Socket.io middleware factory
   */
  socketMiddleware(operation = 'ws.default') {
    return async (socket, next) => {
      const identifier = `socket:${socket.id}`;
      const userId = socket.userId || socket.handshake.auth?.userId;
      
      const identifiers = [identifier];
      if (userId) {
        identifiers.push(`user:${userId}`);
      }

      const result = await this.checkMultipleLimit(
        identifiers, 
        operation,
        { role: socket.userRole }
      );

      if (!result.allowed) {
        return next(new Error('RATE_LIMIT_EXCEEDED'));
      }

      next();
    };
  }

  /**
   * Close Redis connection
   */
  async close() {
    await this.redis.quit();
    this.cache.clear();
    logger.info('Rate limiter closed');
  }
}

// Helper function
function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

// Create singleton instance
const rateLimiter = new RateLimiter();

// Event emitter functionality
const EventEmitter = require('events');
Object.setPrototypeOf(RateLimiter.prototype, EventEmitter.prototype);

export default rateLimiter;
export { RateLimiter };