const crypto = require('crypto');

class RateLimitMiddleware {
  constructor(securityServices, config) {
    this.security = securityServices;
    this.config = config;
    this.stores = new Map();
    this.blacklist = new Set();
    this.whitelist = new Set(config.rateLimit?.whitelist || []);
  }

  // Standard rate limiting
  standard(options = {}) {
    const {
      windowMs = 15 * 60 * 1000, // 15 minutes
      max = 100,
      message = 'Too many requests',
      skipSuccessfulRequests = false,
      skipFailedRequests = false,
      keyGenerator = (req) => this.getClientIdentifier(req),
      handler = null
    } = options;

    return async (req, res, next) => {
      try {
        const key = await keyGenerator(req);
        
        // Skip if whitelisted
        if (this.whitelist.has(key)) {
          return next();
        }

        // Block if blacklisted
        if (this.blacklist.has(key)) {
          return res.status(429).json({ error: 'Access blocked due to abuse' });
        }

        const store = this.getStore('standard');
        const record = store.get(key) || { count: 0, resetTime: Date.now() + windowMs };

        // Reset if window expired
        if (Date.now() > record.resetTime) {
          record.count = 0;
          record.resetTime = Date.now() + windowMs;
        }

        // Increment counter
        if (!skipSuccessfulRequests || !skipFailedRequests) {
          record.count++;
        }

        store.set(key, record);

        // Set rate limit headers
        res.setHeader('X-RateLimit-Limit', max);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, max - record.count));
        res.setHeader('X-RateLimit-Reset', new Date(record.resetTime).toISOString());

        // Check if limit exceeded
        if (record.count > max) {
          await this.handleLimitExceeded(req, key, record);
          
          if (handler) {
            return handler(req, res, next);
          }
          
          return res.status(429).json({ 
            error: message,
            retryAfter: Math.ceil((record.resetTime - Date.now()) / 1000)
          });
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // Sliding window rate limiting
  slidingWindow(options = {}) {
    const {
      windowMs = 60 * 1000, // 1 minute
      max = 10,
      message = 'Rate limit exceeded'
    } = options;

    return async (req, res, next) => {
      try {
        const key = this.getClientIdentifier(req);
        const now = Date.now();
        const windowStart = now - windowMs;

        const store = this.getStore('sliding');
        let requests = store.get(key) || [];
        
        // Remove old requests outside window
        requests = requests.filter(timestamp => timestamp > windowStart);
        
        // Add current request
        requests.push(now);
        
        store.set(key, requests);

        // Check limit
        if (requests.length > max) {
          await this.handleLimitExceeded(req, key, { count: requests.length });
          
          return res.status(429).json({
            error: message,
            retryAfter: Math.ceil((requests[0] + windowMs - now) / 1000)
          });
        }

        res.setHeader('X-RateLimit-Limit', max);
        res.setHeader('X-RateLimit-Remaining', max - requests.length);

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // Token bucket algorithm
  tokenBucket(options = {}) {
    const {
      capacity = 10,
      refillRate = 1, // tokens per second
      consumeTokens = 1
    } = options;

    return async (req, res, next) => {
      try {
        const key = this.getClientIdentifier(req);
        const now = Date.now();

        const store = this.getStore('bucket');
        let bucket = store.get(key) || {
          tokens: capacity,
          lastRefill: now
        };

        // Refill tokens
        const timePassed = (now - bucket.lastRefill) / 1000;
        const tokensToAdd = timePassed * refillRate;
        bucket.tokens = Math.min(capacity, bucket.tokens + tokensToAdd);
        bucket.lastRefill = now;

        // Consume tokens
        if (bucket.tokens >= consumeTokens) {
          bucket.tokens -= consumeTokens;
          store.set(key, bucket);
          
          res.setHeader('X-RateLimit-Remaining', Math.floor(bucket.tokens));
          next();
        } else {
          const timeToWait = (consumeTokens - bucket.tokens) / refillRate;
          
          return res.status(429).json({
            error: 'Rate limit exceeded',
            retryAfter: Math.ceil(timeToWait)
          });
        }
      } catch (error) {
        next(error);
      }
    };
  }

  // Distributed rate limiting (using Redis or similar)
  distributed(options = {}) {
    return async (req, res, next) => {
      try {
        const key = `ratelimit:${this.getClientIdentifier(req)}`;
        const limit = options.max || 100;
        const window = options.windowMs || 60000;

        // Simulate distributed storage (replace with Redis in production)
        const current = await this.getDistributedCount(key);
        
        if (current >= limit) {
          return res.status(429).json({
            error: 'Rate limit exceeded',
            retryAfter: Math.ceil(window / 1000)
          });
        }

        await this.incrementDistributedCount(key, window);
        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // Progressive rate limiting (increases with violations)
  progressive(options = {}) {
    const {
      baseLimit = 100,
      windowMs = 60000,
      multiplier = 0.5 // Reduce limit by 50% for each violation
    } = options;

    return async (req, res, next) => {
      try {
        const key = this.getClientIdentifier(req);
        const store = this.getStore('progressive');
        
        let record = store.get(key) || {
          violations: 0,
          currentLimit: baseLimit,
          resetTime: Date.now() + windowMs,
          requests: 0
        };

        // Reset if window expired
        if (Date.now() > record.resetTime) {
          if (record.requests <= record.currentLimit) {
            // Good behavior, increase limit
            record.violations = Math.max(0, record.violations - 1);
            record.currentLimit = Math.min(baseLimit, record.currentLimit * (1 / multiplier));
          }
          record.requests = 0;
          record.resetTime = Date.now() + windowMs;
        }

        record.requests++;
        
        if (record.requests > record.currentLimit) {
          record.violations++;
          record.currentLimit = Math.max(1, Math.floor(record.currentLimit * multiplier));
          
          store.set(key, record);
          
          // Auto-blacklist after too many violations
          if (record.violations >= 5) {
            await this.addToBlacklist(key, 'Excessive rate limit violations');
          }
          
          return res.status(429).json({
            error: 'Rate limit exceeded',
            violations: record.violations,
            newLimit: record.currentLimit
          });
        }

        store.set(key, record);
        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // API endpoint specific rate limiting
  endpointSpecific(limits = {}) {
    return async (req, res, next) => {
      try {
        const endpoint = `${req.method}:${req.route?.path || req.path}`;
        const config = limits[endpoint] || limits.default || { max: 100, windowMs: 60000 };
        
        const key = `${this.getClientIdentifier(req)}:${endpoint}`;
        const store = this.getStore('endpoint');
        
        let record = store.get(key) || {
          count: 0,
          resetTime: Date.now() + config.windowMs
        };

        if (Date.now() > record.resetTime) {
          record.count = 0;
          record.resetTime = Date.now() + config.windowMs;
        }

        record.count++;
        
        if (record.count > config.max) {
          await this.security.audit.logEvent({
            type: 'rateLimit.exceeded',
            severity: 'warning',
            endpoint,
            clientId: this.getClientIdentifier(req),
            limit: config.max
          });
          
          return res.status(429).json({
            error: `Rate limit exceeded for ${endpoint}`,
            limit: config.max,
            retryAfter: Math.ceil((record.resetTime - Date.now()) / 1000)
          });
        }

        store.set(key, record);
        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // Cost-based rate limiting
  costBased(options = {}) {
    const {
      maxCost = 1000,
      windowMs = 60000,
      costs = {}
    } = options;

    return async (req, res, next) => {
      try {
        const key = this.getClientIdentifier(req);
        const endpoint = `${req.method}:${req.path}`;
        const cost = costs[endpoint] || 1;

        const store = this.getStore('cost');
        let record = store.get(key) || {
          totalCost: 0,
          resetTime: Date.now() + windowMs
        };

        if (Date.now() > record.resetTime) {
          record.totalCost = 0;
          record.resetTime = Date.now() + windowMs;
        }

        if (record.totalCost + cost > maxCost) {
          return res.status(429).json({
            error: 'Rate limit exceeded (cost-based)',
            remainingCost: Math.max(0, maxCost - record.totalCost),
            resetAt: new Date(record.resetTime).toISOString()
          });
        }

        record.totalCost += cost;
        store.set(key, record);

        res.setHeader('X-RateLimit-Cost', cost);
        res.setHeader('X-RateLimit-Remaining-Cost', maxCost - record.totalCost);

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // User tier-based rate limiting
  tierBased(tiers = {}) {
    return async (req, res, next) => {
      try {
        const user = req.user;
        const tier = user?.tier || 'free';
        const limits = tiers[tier] || tiers.free || { max: 10, windowMs: 60000 };

        const key = user ? `user:${user.id}` : this.getClientIdentifier(req);
        const store = this.getStore('tier');
        
        let record = store.get(key) || {
          count: 0,
          resetTime: Date.now() + limits.windowMs
        };

        if (Date.now() > record.resetTime) {
          record.count = 0;
          record.resetTime = Date.now() + limits.windowMs;
        }

        record.count++;
        
        if (record.count > limits.max) {
          return res.status(429).json({
            error: 'Rate limit exceeded',
            tier,
            limit: limits.max,
            upgradeAvailable: tier !== 'premium'
          });
        }

        store.set(key, record);
        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // Adaptive rate limiting based on server load
  adaptive(options = {}) {
    return async (req, res, next) => {
      try {
        const baseLimit = options.baseLimit || 100;
        const load = await this.getServerLoad();
        
        // Adjust limit based on load
        const adjustedLimit = Math.floor(baseLimit * (1 - load));
        const key = this.getClientIdentifier(req);
        
        const store = this.getStore('adaptive');
        let record = store.get(key) || {
          count: 0,
          resetTime: Date.now() + 60000
        };

        if (Date.now() > record.resetTime) {
          record.count = 0;
          record.resetTime = Date.now() + 60000;
        }

        record.count++;
        
        if (record.count > adjustedLimit) {
          return res.status(429).json({
            error: 'Server under high load, please retry later',
            serverLoad: Math.round(load * 100) + '%',
            retryAfter: 30
          });
        }

        store.set(key, record);
        res.setHeader('X-Server-Load', Math.round(load * 100) + '%');
        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // Helper methods
  getClientIdentifier(req) {
    if (req.user) {
      return `user:${req.user.id}`;
    }
    
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.connection.remoteAddress;
    const userAgent = crypto.createHash('md5').update(req.headers['user-agent'] || '').digest('hex');
    
    return `${ip}:${userAgent}`;
  }

  getStore(name) {
    if (!this.stores.has(name)) {
      this.stores.set(name, new Map());
    }
    return this.stores.get(name);
  }

  async handleLimitExceeded(req, key, record) {
    await this.security.audit.logEvent({
      type: 'rateLimit.exceeded',
      severity: 'warning',
      clientId: key,
      count: record.count,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      path: req.path
    });

    // Auto-blacklist if excessive violations
    if (record.count > (record.limit || 100) * 3) {
      await this.addToBlacklist(key, 'Excessive rate limit violations');
    }
  }

  async addToBlacklist(key, reason) {
    this.blacklist.add(key);
    
    await this.security.audit.logEvent({
      type: 'security.blacklist',
      severity: 'critical',
      clientId: key,
      reason
    });

    // Schedule removal after 24 hours
    setTimeout(() => {
      this.blacklist.delete(key);
    }, 24 * 60 * 60 * 1000);
  }

  async getDistributedCount(key) {
    // Implement with Redis or similar
    // Simulated for now
    return this.getStore('distributed').get(key) || 0;
  }

  async incrementDistributedCount(key, ttl) {
    // Implement with Redis INCR and EXPIRE
    const store = this.getStore('distributed');
    const current = store.get(key) || 0;
    store.set(key, current + 1);
    
    setTimeout(() => {
      store.delete(key);
    }, ttl);
    
    return current + 1;
  }

  async getServerLoad() {
    // Get actual server load
    const os = require('os');
    const loadAvg = os.loadavg()[0];
    const cpuCount = os.cpus().length;
    return Math.min(1, loadAvg / cpuCount);
  }

  // Cleanup old records
  cleanup() {
    const now = Date.now();
    
    for (const [name, store] of this.stores.entries()) {
      for (const [key, record] of store.entries()) {
        if (record.resetTime && now > record.resetTime + 3600000) {
          store.delete(key);
        }
      }
    }
  }
}

module.exports = RateLimitMiddleware;