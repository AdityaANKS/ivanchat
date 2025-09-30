import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
});

// Default rate limiter
export const defaultRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:default:',
  }),
});

// Auth rate limiter (stricter)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later',
  skipSuccessfulRequests: true,
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:auth:',
  }),
});

// Message rate limiter
export const messageRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 messages per minute
  message: 'You are sending messages too quickly',
  keyGenerator: (req) => req.user?._id || req.ip,
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:message:',
  }),
});

// File upload rate limiter
export const uploadRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 uploads per hour
  message: 'Upload limit exceeded, please try again later',
  keyGenerator: (req) => req.user?._id || req.ip,
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:upload:',
  }),
});

// API rate limiter
export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: 'API rate limit exceeded',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?._id || req.ip,
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:api:',
  }),
});

// Dynamic rate limiter factory
export const createRateLimiter = (options) => {
  const defaults = {
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
      client: redisClient,
      prefix: `rl:custom:${options.name || 'default'}:`,
    }),
  };

  return rateLimit({ ...defaults, ...options });
};

// Socket.IO rate limiter
export class SocketRateLimiter {
  constructor(options = {}) {
    this.windowMs = options.windowMs || 60000; // 1 minute
    this.maxEvents = options.maxEvents || 100;
    this.clients = new Map();
  }

  middleware() {
    return (socket, next) => {
      const clientId = socket.handshake.auth?.userId || socket.id;
      
      if (!this.clients.has(clientId)) {
        this.clients.set(clientId, {
          events: [],
          blocked: false,
        });
      }

      const client = this.clients.get(clientId);

      if (client.blocked) {
        return next(new Error('Rate limit exceeded'));
      }

      // Clean old events
      const now = Date.now();
      client.events = client.events.filter(
        timestamp => now - timestamp < this.windowMs
      );

      if (client.events.length >= this.maxEvents) {
        client.blocked = true;
        setTimeout(() => {
          client.blocked = false;
        }, this.windowMs);
        return next(new Error('Rate limit exceeded'));
      }

      client.events.push(now);
      next();
    };
  }

  eventLimiter(eventName, maxPerWindow = 10) {
    const eventClients = new Map();

    return (socket, next) => {
      const clientId = socket.handshake.auth?.userId || socket.id;
      const key = `${clientId}:${eventName}`;

      if (!eventClients.has(key)) {
        eventClients.set(key, []);
      }

      const events = eventClients.get(key);
      const now = Date.now();

      // Clean old events
      const recentEvents = events.filter(
        timestamp => now - timestamp < this.windowMs
      );

      if (recentEvents.length >= maxPerWindow) {
        return next(new Error(`Rate limit exceeded for ${eventName}`));
      }

      recentEvents.push(now);
      eventClients.set(key, recentEvents);
      next();
    };
  }
}

export const rateLimiter = createRateLimiter;