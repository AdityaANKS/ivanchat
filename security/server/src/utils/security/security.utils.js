const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { RateLimiter } = require('rate-limiter-flexible');

class SecurityUtils {
  constructor() {
    this.initializeRateLimiters();
    this.securityHeaders = this.getSecurityHeaders();
  }

  // Initialize rate limiters
  initializeRateLimiters() {
    // Login rate limiter
    this.loginLimiter = new RateLimiter({
      points: 5, // 5 attempts
      duration: 900, // per 15 minutes
      blockDuration: 900 // block for 15 minutes
    });

    // API rate limiter
    this.apiLimiter = new RateLimiter({
      points: 100, // 100 requests
      duration: 60, // per minute
      blockDuration: 60 // block for 1 minute
    });

    // File upload limiter
    this.uploadLimiter = new RateLimiter({
      points: 10, // 10 uploads
      duration: 3600, // per hour
      blockDuration: 3600 // block for 1 hour
    });
  }

  // Get security headers
  getSecurityHeaders() {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': "default-src 'self'",
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    };
  }

  // Generate CSRF token
  generateCSRFToken(sessionId) {
    const secret = process.env.CSRF_SECRET || 'default-csrf-secret';
    return crypto
      .createHmac('sha256', secret)
      .update(sessionId)
      .digest('hex');
  }

  // Verify CSRF token
  verifyCSRFToken(token, sessionId) {
    const expectedToken = this.generateCSRFToken(sessionId);
    return crypto.timingSafeEqual(
      Buffer.from(token),
      Buffer.from(expectedToken)
    );
  }

  // Check for common attack patterns
  detectAttackPatterns(request) {
    const patterns = {
      sqlInjection: [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)\b)/i,
        /(--|\||;|\/\*|\*\/)/
      ],
      xss: [
        /<script[^>]*>.*?<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi
      ],
      pathTraversal: [
        /\.\.\//g,
        /\.\.\\/, 
      ],
      commandInjection: [
        /[;&|`$]/,
        /\b(curl|wget|bash|sh|cmd|powershell)\b/i
      ]
    };

    const detected = [];

    const checkString = (str) => {
      if (!str) return;
      const strToCheck = typeof str === 'string' ? str : JSON.stringify(str);
      
      for (const [type, typePatterns] of Object.entries(patterns)) {
        for (const pattern of typePatterns) {
          if (pattern.test(strToCheck)) {
            detected.push(type);
            break;
          }
        }
      }
    };

    // Check various parts of request
    checkString(request.path);
    checkString(request.query);
    checkString(request.body);
    checkString(request.headers);

    return detected;
  }

  // IP-based security checks
  async checkIPSecurity(ip) {
    const checks = {
      isPrivate: this.isPrivateIP(ip),
      isBlacklisted: await this.isBlacklistedIP(ip),
      rateLimit: await this.checkIPRateLimit(ip),
      geoLocation: await this.getIPGeoLocation(ip)
    };

    return {
      ip,
      secure: !checks.isBlacklisted && checks.rateLimit.allowed,
      details: checks
    };
  }

  // Check if IP is private
  isPrivateIP(ip) {
    const privateRanges = [
      /^10\./,
      /^172\.(1[6-9]|2\d|3[01])\./,
      /^192\.168\./,
      /^127\./,
      /^::1$/,
      /^fe80:/i
    ];

    return privateRanges.some(range => range.test(ip));
  }

  // Check if IP is blacklisted
  async isBlacklistedIP(ip) {
    // Implement blacklist check
    // This could check against a database or external service
    const blacklist = process.env.IP_BLACKLIST?.split(',') || [];
    return blacklist.includes(ip);
  }

  // Check IP rate limit
  async checkIPRateLimit(ip) {
    try {
      await this.apiLimiter.consume(ip);
      return { allowed: true, remaining: this.apiLimiter.points };
    } catch (error) {
      return { allowed: false, retryAfter: error.msBeforeNext };
    }
  }

  // Get IP geolocation
  async getIPGeoLocation(ip) {
    // Implement geolocation lookup
    // This would typically use an external service
    return {
      country: 'Unknown',
      city: 'Unknown',
      suspicious: false
    };
  }

  // Session security
  generateSecureSessionId() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Validate session
  validateSession(session) {
    if (!session || !session.id) {
      return { valid: false, reason: 'No session' };
    }

    // Check session expiry
    if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
      return { valid: false, reason: 'Session expired' };
    }

    // Check session fingerprint
    if (session.fingerprint && !this.validateFingerprint(session)) {
      return { valid: false, reason: 'Fingerprint mismatch' };
    }

    return { valid: true };
  }

  // Generate device fingerprint
  generateFingerprint(request) {
    const components = [
      request.headers['user-agent'],
      request.headers['accept-language'],
      request.headers['accept-encoding'],
      request.ip
    ];

    return crypto
      .createHash('sha256')
      .update(components.join('|'))
      .digest('hex');
  }

  // Validate fingerprint
  validateFingerprint(session, request) {
    const currentFingerprint = this.generateFingerprint(request);
    return session.fingerprint === currentFingerprint;
  }

  // Token security
  generateSecureToken(payload, options = {}) {
    const secret = process.env.JWT_SECRET || 'default-secret';
    const defaults = {
      expiresIn: '1h',
      algorithm: 'HS256',
      issuer: 'secure-chat',
      audience: 'chat-users'
    };

    return jwt.sign(payload, secret, { ...defaults, ...options });
  }

  // Verify token
  verifySecureToken(token, options = {}) {
    const secret = process.env.JWT_SECRET || 'default-secret';
    const defaults = {
      algorithms: ['HS256'],
      issuer: 'secure-chat',
      audience: 'chat-users'
    };

    try {
      return {
        valid: true,
        payload: jwt.verify(token, secret, { ...defaults, ...options })
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  // Password policy check
  checkPasswordPolicy(password) {
    const policy = {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      prohibitedWords: ['password', 'admin', '123456']
    };

    const violations = [];

    if (password.length < policy.minLength) {
      violations.push(`Password must be at least ${policy.minLength} characters`);
    }

    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      violations.push('Password must contain uppercase letters');
    }

    if (policy.requireLowercase && !/[a-z]/.test(password)) {
      violations.push('Password must contain lowercase letters');
    }

    if (policy.requireNumbers && !/\d/.test(password)) {
      violations.push('Password must contain numbers');
    }

    if (policy.requireSpecialChars && !/[@$!%*?&#]/.test(password)) {
      violations.push('Password must contain special characters');
    }

    for (const word of policy.prohibitedWords) {
      if (password.toLowerCase().includes(word)) {
        violations.push(`Password cannot contain "${word}"`);
      }
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }

  // Generate secure random string
  generateSecureRandom(length = 32, type = 'hex') {
    const bytes = crypto.randomBytes(length);
    
    switch (type) {
      case 'hex':
        return bytes.toString('hex');
      case 'base64':
        return bytes.toString('base64');
      case 'base64url':
        return bytes.toString('base64url');
      case 'alphanumeric':
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
          result += chars[bytes[i] % chars.length];
        }
        return result;
      default:
        return bytes.toString('hex');
    }
  }

  // Content security
  checkContentSecurity(content) {
    const issues = [];

    // Check for executable content
    if (/<script|javascript:|onerror=|onclick=/i.test(content)) {
      issues.push('Potentially dangerous script content detected');
    }

    // Check for iframe injection
    if (/<iframe/i.test(content)) {
      issues.push('Iframe content detected');
    }

    // Check for object/embed tags
    if (/<object|<embed/i.test(content)) {
      issues.push('Embedded object detected');
    }

    return {
      secure: issues.length === 0,
      issues
    };
  }
}

module.exports = new SecurityUtils();