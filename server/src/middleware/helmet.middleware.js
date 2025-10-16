// server/src/middleware/helmet.middleware.js

const helmet = require('helmet');
const crypto = require('crypto');
const logger = require('../utils/logger');

/**
 * Comprehensive Helmet Security Middleware for Ivanchat
 * Implements all security headers and CSP policies
 */

class HelmetMiddleware {
  constructor(options = {}) {
    this.environment = process.env.NODE_ENV || 'development';
    this.isDevelopment = this.environment === 'development';
    this.isProduction = this.environment === 'production';
    
    // Domain configuration
    this.trustedDomains = options.trustedDomains || [
      process.env.CLIENT_URL || 'https://ivanchat.com',
      process.env.API_URL || 'https://api.ivanchat.com',
      process.env.CDN_URL || 'https://cdn.ivanchat.com',
      process.env.WEBSOCKET_URL || 'wss://ws.ivanchat.com'
    ];

    // CSP nonce for inline scripts
    this.generateNonce = options.generateNonce !== false;
    
    // Custom configurations
    this.customConfig = options.customConfig || {};
  }

  /**
   * Generate CSP nonce for each request
   */
  generateCSPNonce(req, res, next) {
    if (this.generateNonce) {
      res.locals.cspNonce = crypto.randomBytes(16).toString('base64');
    }
    next();
  }

  /**
   * Get Content Security Policy configuration
   */
  getCSPConfig() {
    const nonce = this.generateNonce ? "'nonce-${nonce}'" : '';
    
    const directives = {
      defaultSrc: ["'self'", ...this.trustedDomains],
      
      scriptSrc: [
        "'self'",
        ...this.trustedDomains,
        this.isDevelopment ? "'unsafe-inline'" : nonce,
        "'unsafe-eval'", // Remove in production if possible
        'https://cdn.jsdelivr.net', // For libraries
        'https://unpkg.com',
        'https://www.google-analytics.com',
        'https://www.googletagmanager.com',
        'https://www.google.com/recaptcha/',
        'https://www.gstatic.com/recaptcha/',
        'https://hcaptcha.com',
        'https://*.hcaptcha.com',
        'blob:' // For web workers
      ],
      
      styleSrc: [
        "'self'",
        ...this.trustedDomains,
        "'unsafe-inline'", // Required for many UI libraries
        'https://fonts.googleapis.com',
        'https://cdn.jsdelivr.net',
        'https://unpkg.com'
      ],
      
      imgSrc: [
        "'self'",
        'data:',
        'blob:',
        ...this.trustedDomains,
        'https://*.githubusercontent.com',
        'https://*.gravatar.com',
        'https://*.googleusercontent.com',
        'https://*.discordapp.com',
        'https://*.twimg.com',
        'https://i.imgur.com'
      ],
      
      fontSrc: [
        "'self'",
        'data:',
        ...this.trustedDomains,
        'https://fonts.gstatic.com',
        'https://cdn.jsdelivr.net'
      ],
      
      connectSrc: [
        "'self'",
        ...this.trustedDomains,
        'https://api.github.com',
        'https://*.google-analytics.com',
        'https://*.doubleclick.net',
        'https://sentry.io',
        'https://*.sentry.io',
        'wss://*.ivanchat.com',
        this.isDevelopment ? 'ws://localhost:*' : '',
        this.isDevelopment ? 'http://localhost:*' : ''
      ].filter(Boolean),
      
      mediaSrc: [
        "'self'",
        'blob:',
        ...this.trustedDomains,
        'https://*.youtube.com',
        'https://*.vimeo.com',
        'https://*.soundcloud.com',
        'https://*.spotify.com',
        'mediastream:' // For WebRTC
      ],
      
      objectSrc: ["'none'"],
      
      childSrc: [
        "'self'",
        'blob:',
        ...this.trustedDomains,
        'https://www.google.com/recaptcha/',
        'https://hcaptcha.com',
        'https://*.hcaptcha.com',
        'https://www.youtube.com',
        'https://player.vimeo.com'
      ],
      
      frameSrc: [
        "'self'",
        ...this.trustedDomains,
        'https://www.google.com/recaptcha/',
        'https://recaptcha.google.com',
        'https://hcaptcha.com',
        'https://*.hcaptcha.com',
        'https://www.youtube.com',
        'https://player.vimeo.com',
        'https://embed.spotify.com'
      ],
      
      workerSrc: [
        "'self'",
        'blob:',
        ...this.trustedDomains
      ],
      
      manifestSrc: [
        "'self'",
        ...this.trustedDomains
      ],
      
      formAction: [
        "'self'",
        ...this.trustedDomains,
        'https://accounts.google.com',
        'https://github.com/login/oauth/authorize',
        'https://discord.com/api/oauth2/authorize'
      ],
      
      frameAncestors: ["'none'"], // Prevent embedding
      
      baseUri: ["'self'"],
      
      upgradeInsecureRequests: this.isProduction ? [] : null,
      
      blockAllMixedContent: this.isProduction ? [] : null,
      
      reportUri: process.env.CSP_REPORT_URI || '/api/csp-report'
    };

    // Remove empty arrays (they represent boolean directives)
    Object.keys(directives).forEach(key => {
      if (Array.isArray(directives[key]) && directives[key].length === 0) {
        directives[key] = null;
      }
    });

    return directives;
  }

  /**
   * Get complete Helmet configuration
   */
  getHelmetConfig() {
    return {
      // Content Security Policy
      contentSecurityPolicy: {
        directives: this.getCSPConfig(),
        reportOnly: this.isDevelopment // Report only in development
      },

      // Cross-Origin Embedder Policy
      crossOriginEmbedderPolicy: {
        policy: this.isProduction ? "require-corp" : "unsafe-none"
      },

      // Cross-Origin Opener Policy
      crossOriginOpenerPolicy: {
        policy: "same-origin-allow-popups" // Allow OAuth popups
      },

      // Cross-Origin Resource Policy
      crossOriginResourcePolicy: {
        policy: "cross-origin" // Allow resources to be loaded cross-origin
      },

      // DNS Prefetch Control
      dnsPrefetchControl: {
        allow: true // Allow DNS prefetching for performance
      },

      // Expect-CT Header
      expectCt: this.isProduction ? {
        maxAge: 86400,
        enforce: true,
        reportUri: process.env.EXPECT_CT_REPORT_URI || '/api/expect-ct-report'
      } : false,

      // Frameguard - Prevent clickjacking
      frameguard: {
        action: 'deny' // Don't allow site to be embedded
      },

      // Hide X-Powered-By header
      hidePoweredBy: true,

      // HSTS - HTTP Strict Transport Security
      hsts: this.isProduction ? {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true
      } : false,

      // IE No Open
      ieNoOpen: true,

      // No Sniff - Prevent MIME type sniffing
      noSniff: true,

      // Origin Agent Cluster
      originAgentCluster: true,

      // Permitted Cross-Domain Policies
      permittedCrossDomainPolicies: {
        permittedPolicies: "none"
      },

      // Referrer Policy
      referrerPolicy: {
        policy: ["origin-when-cross-origin", "strict-origin-when-cross-origin"]
      },

      // X-XSS-Protection (deprecated but still used by some browsers)
      xssFilter: true
    };
  }

  /**
   * Create middleware with all security headers
   */
  create() {
    const config = { 
      ...this.getHelmetConfig(), 
      ...this.customConfig 
    };

    // Log security configuration in development
    if (this.isDevelopment) {
      logger.info('Helmet Security Configuration:', {
        environment: this.environment,
        cspReportOnly: config.contentSecurityPolicy?.reportOnly,
        hstsEnabled: !!config.hsts,
        trustedDomains: this.trustedDomains
      });
    }

    return helmet(config);
  }

  /**
   * CSP Report Handler
   */
  cspReportHandler() {
    return (req, res) => {
      if (req.body) {
        const report = req.body['csp-report'] || req.body;
        
        logger.warn('CSP Violation Report:', {
          documentUri: report['document-uri'],
          violatedDirective: report['violated-directive'],
          blockedUri: report['blocked-uri'],
          lineNumber: report['line-number'],
          columnNumber: report['column-number'],
          sourceFile: report['source-file'],
          scriptSample: report['script-sample'],
          referrer: report.referrer,
          userAgent: req.headers['user-agent'],
          ip: req.ip
        });

        // You can also send this to a monitoring service
        // monitoringService.logCSPViolation(report);
      }
      
      res.status(204).end();
    };
  }

  /**
   * Additional security headers not covered by Helmet
   */
  additionalSecurityHeaders() {
    return (req, res, next) => {
      // Feature Policy / Permissions Policy
      res.setHeader('Permissions-Policy', this.getPermissionsPolicy());
      
      // Clear Site Data (for logout)
      if (req.path === '/api/auth/logout') {
        res.setHeader('Clear-Site-Data', '"cache", "cookies", "storage"');
      }
      
      // X-Content-Type-Options (additional to noSniff)
      res.setHeader('X-Content-Type-Options', 'nosniff');
      
      // X-Frame-Options (additional to frameguard)
      res.setHeader('X-Frame-Options', 'DENY');
      
      // X-Download-Options
      res.setHeader('X-Download-Options', 'noopen');
      
      // X-Permitted-Cross-Domain-Policies
      res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
      
      // Strict-Transport-Security (additional)
      if (this.isProduction) {
        res.setHeader(
          'Strict-Transport-Security',
          'max-age=63072000; includeSubDomains; preload'
        );
      }
      
      next();
    };
  }

  /**
   * Get Permissions Policy configuration
   */
  getPermissionsPolicy() {
    const policies = {
      accelerometer: [],
      'ambient-light-sensor': [],
      autoplay: ['self'],
      battery: [],
      camera: ['self'], // For video chat
      'cross-origin-isolated': ['self'],
      'display-capture': ['self'], // For screen sharing
      'document-domain': [],
      'encrypted-media': ['self'],
      'execution-while-not-rendered': ['self'],
      'execution-while-out-of-viewport': ['self'],
      fullscreen: ['self'],
      geolocation: [],
      gyroscope: [],
      keyboard: ['self'],
      magnetometer: [],
      microphone: ['self'], // For voice chat
      midi: [],
      'navigation-override': [],
      payment: [],
      'picture-in-picture': ['self'],
      'publickey-credentials-get': ['self'],
      'screen-wake-lock': ['self'],
      'sync-xhr': [],
      usb: [],
      'web-share': ['self'],
      'xr-spatial-tracking': [],
      clipboard: ['self'],
      'clipboard-read': ['self'],
      'clipboard-write': ['self'],
      gamepad: [],
      'speaker-selection': ['self'],
      'conversion-measurement': [],
      'focus-without-user-activation': [],
      hid: [],
      'idle-detection': [],
      'interest-cohort': [], // Disable FLoC
      serial: [],
      'sync-script': [],
      'trust-token-redemption': [],
      'window-placement': [],
      'vertical-scroll': ['self']
    };

    return Object.entries(policies)
      .map(([key, value]) => {
        if (value.length === 0) return `${key}=()`;
        return `${key}=(${value.join(' ')})`;
      })
      .join(', ');
  }

  /**
   * Rate limiting for security endpoints
   */
  securityRateLimit() {
    const rateLimit = require('express-rate-limit');
    
    return rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // Limit each IP to 5 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
        logger.warn('Security rate limit exceeded:', {
          ip: req.ip,
          path: req.path,
          headers: req.headers
        });
        
        res.status(429).json({
          error: 'Too Many Requests',
          message: 'Security rate limit exceeded',
          retryAfter: 900 // 15 minutes in seconds
        });
      }
    });
  }

  /**
   * Create all middleware as an array
   */
  createAll() {
    const middlewares = [
      this.generateCSPNonce.bind(this),
      this.create(),
      this.additionalSecurityHeaders()
    ];

    return middlewares;
  }
}

// Create singleton instance
const helmetMiddleware = new HelmetMiddleware();

module.exports = helmetMiddleware;
module.exports.HelmetMiddleware = HelmetMiddleware;