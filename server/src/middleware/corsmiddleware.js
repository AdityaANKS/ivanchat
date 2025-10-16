// server/src/middleware/cors.middleware.js

const cors = require('cors');
const logger = require('../utils/logger');

/**
 * Comprehensive CORS Middleware for Ivanchat
 * Implements strict CORS policies with dynamic origin validation
 */

class CORSMiddleware {
  constructor(options = {}) {
    this.environment = process.env.NODE_ENV || 'development';
    this.isDevelopment = this.environment === 'development';
    this.isProduction = this.environment === 'production';

    // Allowed origins configuration
    this.allowedOrigins = new Set([
      process.env.CLIENT_URL || 'https://ivanchat.com',
      process.env.MOBILE_URL || 'https://mobile.ivanchat.com',
      process.env.DESKTOP_URL || 'https://desktop.ivanchat.com',
      process.env.ADMIN_URL || 'https://admin.ivanchat.com',
      'https://www.ivanchat.com',
      'https://app.ivanchat.com',
      ...(options.additionalOrigins || [])
    ]);

    // Development origins
    if (this.isDevelopment) {
      this.allowedOrigins.add('http://localhost:3000');
      this.allowedOrigins.add('http://localhost:3001');
      this.allowedOrigins.add('http://localhost:5173'); // Vite
      this.allowedOrigins.add('http://127.0.0.1:3000');
      this.allowedOrigins.add('http://192.168.1.100:3000'); // Local network
      this.allowedOrigins.add('http://localhost:19006'); // Expo
      this.allowedOrigins.add('exp://localhost:19000'); // Expo
    }

    // Subdomain patterns
    this.subdomainPatterns = [
      /^https:\/\/([a-z0-9]+[.])*ivanchat\.com$/,
      /^https:\/\/ivanchat-[a-z0-9]+-[a-z0-9]+\.vercel\.app$/,
      /^https:\/\/[a-z0-9]+-ivanchat\.netlify\.app$/
    ];

    // Partner domains (if any)
    this.partnerDomains = new Set(options.partnerDomains || []);

    // Credentials configuration
    this.credentialsRequired = options.credentialsRequired !== false;

    // Custom options
    this.customOptions = options.customOptions || {};

    // Request tracking for debugging
    this.requestLog = new Map();
    this.maxLogSize = 1000;
  }

  /**
   * Dynamic origin validation
   */
  validateOrigin(origin, callback) {
    // Allow requests with no origin (e.g., mobile apps, Postman)
    if (!origin) {
      // In production, you might want to restrict this
      if (this.isProduction) {
        logger.warn('Request with no origin header received');
        return callback(null, false);
      }
      return callback(null, true);
    }

    // Check exact match in allowed origins
    if (this.allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    // Check subdomain patterns
    for (const pattern of this.subdomainPatterns) {
      if (pattern.test(origin)) {
        // Dynamically add validated subdomain to allowed origins
        this.allowedOrigins.add(origin);
        logger.info(`Dynamically allowed subdomain: ${origin}`);
        return callback(null, true);
      }
    }

    // Check partner domains
    if (this.partnerDomains.has(origin)) {
      return callback(null, true);
    }

    // Check for local development IPs
    if (this.isDevelopment) {
      const localIPPattern = /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?$/;
      if (localIPPattern.test(origin)) {
        return callback(null, true);
      }
    }

    // Log rejected origin
    this.logRejectedOrigin(origin);

    // Reject the origin
    logger.warn(`CORS: Rejected origin: ${origin}`);
    callback(new Error(`Origin ${origin} not allowed by CORS`));
  }

  /**
   * Get CORS configuration
   */
  getCORSConfig() {
    return {
      origin: this.validateOrigin.bind(this),
      
      credentials: this.credentialsRequired,
      
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
      
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'X-Access-Token',
        'X-Refresh-Token',
        'X-CSRF-Token',
        'X-Socket-ID',
        'X-Client-Version',
        'X-Client-Platform',
        'X-Device-ID',
        'X-Session-ID',
        'X-Request-ID',
        'X-Timezone',
        'X-Language',
        'X-Forwarded-For',
        'X-Real-IP',
        'Cache-Control',
        'If-None-Match',
        'If-Modified-Since',
        'Range', // For partial content requests
        'Content-Range',
        'Content-Disposition', // For file downloads
        'X-Encryption-Key', // For E2E encryption
        'X-Public-Key',
        'X-Signature'
      ],
      
      exposedHeaders: [
        'X-Total-Count',
        'X-Page-Count',
        'X-Current-Page',
        'X-Per-Page',
        'X-RateLimit-Limit',
        'X-RateLimit-Remaining',
        'X-RateLimit-Reset',
        'X-Request-ID',
        'X-Response-Time',
        'X-Server-Version',
        'Content-Range',
        'Accept-Ranges',
        'Content-Disposition',
        'Location',
        'ETag',
        'Last-Modified',
        'Cache-Control',
        'Expires',
        'X-Content-Type-Options',
        'X-Frame-Options',
        'X-XSS-Protection',
        'Retry-After'
      ],
      
      maxAge: this.isProduction ? 86400 : 3600, // 24 hours in production, 1 hour in dev
      
      preflightContinue: false,
      
      optionsSuccessStatus: 204
    };
  }

  /**
   * Create CORS middleware
   */
  create() {
    const config = {
      ...this.getCORSConfig(),
      ...this.customOptions
    };

    return cors(config);
  }

  /**
   * Strict CORS for sensitive endpoints
   */
  createStrict(allowedOrigins = []) {
    const strictOrigins = new Set([
      process.env.CLIENT_URL || 'https://ivanchat.com',
      ...allowedOrigins
    ]);

    return cors({
      origin: (origin, callback) => {
        if (!origin || strictOrigins.has(origin)) {
          callback(null, true);
        } else {
          logger.warn(`Strict CORS: Rejected origin: ${origin}`);
          callback(new Error('Not allowed by strict CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
      maxAge: 300 // 5 minutes for strict endpoints
    });
  }

  /**
   * Public CORS for open endpoints
   */
  createPublic() {
    return cors({
      origin: '*',
      credentials: false,
      methods: ['GET', 'HEAD', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Accept'],
      exposedHeaders: ['Content-Type', 'Content-Length'],
      maxAge: 86400
    });
  }

  /**
   * WebSocket CORS handler
   */
  handleWebSocketCORS(request, socket, head) {
    const origin = request.headers.origin;
    
    if (!origin) {
      // Allow connections without origin in development
      if (this.isDevelopment) {
        return true;
      }
      socket.end('HTTP/1.1 403 Forbidden\r\n\r\n');
      return false;
    }

    // Validate origin
    let isAllowed = false;
    
    this.validateOrigin(origin, (err, allowed) => {
      isAllowed = !err && allowed;
    });

    if (!isAllowed) {
      logger.warn(`WebSocket CORS: Rejected origin: ${origin}`);
      socket.end('HTTP/1.1 403 Forbidden\r\n\r\n');
      return false;
    }

    return true;
  }

  /**
   * Pre-flight request handler
   */
  handlePreflight() {
    return (req, res, next) => {
      if (req.method === 'OPTIONS') {
        const origin = req.headers.origin;
        
        this.validateOrigin(origin, (err, allowed) => {
          if (err || !allowed) {
            return res.status(403).json({
              error: 'CORS Error',
              message: 'Origin not allowed'
            });
          }

          // Set CORS headers for preflight
          res.header('Access-Control-Allow-Origin', origin);
          res.header('Access-Control-Allow-Credentials', 'true');
          res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
          res.header('Access-Control-Allow-Headers', this.getCORSConfig().allowedHeaders.join(', '));
          res.header('Access-Control-Max-Age', String(this.getCORSConfig().maxAge));
          
          res.status(204).end();
        });
      } else {
        next();
      }
    };
  }

  /**
   * CORS error handler
   */
  errorHandler() {
    return (err, req, res, next) => {
      if (err && err.message && err.message.includes('CORS')) {
        logger.error('CORS Error:', {
          origin: req.headers.origin,
          method: req.method,
          path: req.path,
          error: err.message
        });

        return res.status(403).json({
          error: 'CORS Error',
          message: 'Cross-Origin Request Blocked',
          origin: req.headers.origin
        });
      }
      next(err);
    };
  }

  /**
   * Log rejected origins for monitoring
   */
  logRejectedOrigin(origin) {
    const now = Date.now();
    
    if (!this.requestLog.has(origin)) {
      this.requestLog.set(origin, {
        count: 0,
        firstSeen: now,
        lastSeen: now
      });
    }

    const log = this.requestLog.get(origin);
    log.count++;
    log.lastSeen = now;

    // Clean up old entries if log is too large
    if (this.requestLog.size > this.maxLogSize) {
      const oldestKey = this.requestLog.keys().next().value;
      this.requestLog.delete(oldestKey);
    }

    // Alert if suspicious activity
    if (log.count > 100) {
      logger.error('Potential CORS attack detected:', {
        origin,
        attempts: log.count,
        firstSeen: new Date(log.firstSeen),
        lastSeen: new Date(log.lastSeen)
      });
    }
  }

  /**
   * Add origin to allowed list dynamically
   */
  addAllowedOrigin(origin) {
    this.allowedOrigins.add(origin);
    logger.info(`Added origin to allowed list: ${origin}`);
  }

  /**
   * Remove origin from allowed list
   */
  removeAllowedOrigin(origin) {
    this.allowedOrigins.delete(origin);
    logger.info(`Removed origin from allowed list: ${origin}`);
  }

  /**
   * Get statistics about CORS requests
   */
  getStatistics() {
    const stats = {
      allowedOrigins: Array.from(this.allowedOrigins),
      partnerDomains: Array.from(this.partnerDomains),
      rejectedOrigins: []
    };

    for (const [origin, data] of this.requestLog.entries()) {
      stats.rejectedOrigins.push({
        origin,
        ...data
      });
    }

    stats.rejectedOrigins.sort((a, b) => b.count - a.count);

    return stats;
  }

  /**
   * Clear request log
   */
  clearRequestLog() {
    this.requestLog.clear();
    logger.info('CORS request log cleared');
  }

  /**
   * Create all CORS middleware as an array
   */
  createAll() {
    return [
      this.handlePreflight(),
      this.create(),
      this.errorHandler()
    ];
  }
}

// Create singleton instance
const corsMiddleware = new CORSMiddleware();

module.exports = corsMiddleware;
module.exports.CORSMiddleware = CORSMiddleware;