

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const speakeasy = require('speakeasy');
const { authenticator } = require('otplib');
const geoip = require('geoip-lite');
const UAParser = require('ua-parser-js');
const bcrypt = require('bcryptjs');
const argon2 = require('argon2');
const { RateLimiterRedis } = require('rate-limiter-flexible');
const Redis = require('ioredis');
const { WebAuthnServer } = require('@simplewebauthn/server');
const logger = require('../utils/logger');
const User = require('../models/User');

/**
 * Implements multiple layers of security with zero-trust architecture
 */

class AuthMiddleware {
  constructor(options = {}) {
    // Environment configuration
    this.environment = process.env.NODE_ENV || 'development';
    this.isDevelopment = this.environment === 'development';
    this.isProduction = this.environment === 'production';

    // Redis client for session and token management
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      db: 1, // Use separate DB for auth
      retryStrategy: (times) => Math.min(times * 50, 2000),
      enableOfflineQueue: false,
      keyPrefix: 'auth:'
    });

    // JWT Configuration
    this.jwtConfig = {
      accessTokenSecret: process.env.JWT_ACCESS_SECRET || crypto.randomBytes(64).toString('hex'),
      refreshTokenSecret: process.env.JWT_REFRESH_SECRET || crypto.randomBytes(64).toString('hex'),
      accessTokenExpiry: options.accessTokenExpiry || '15m',
      refreshTokenExpiry: options.refreshTokenExpiry || '7d',
      issuer: 'ivanchat.com',
      audience: 'ivanchat-users',
      algorithm: 'RS256' // Use RSA for production
    };

    // Security configuration
    this.securityConfig = {
      maxLoginAttempts: options.maxLoginAttempts || 5,
      lockoutDuration: options.lockoutDuration || 30 * 60 * 1000, // 30 minutes
      sessionTimeout: options.sessionTimeout || 30 * 60 * 1000, // 30 minutes
      requireMFA: options.requireMFA || false,
      requireDeviceVerification: options.requireDeviceVerification !== false,
      requireIPValidation: options.requireIPValidation !== false,
      maxDevicesPerUser: options.maxDevicesPerUser || 5,
      maxSessionsPerUser: options.maxSessionsPerUser || 10,
      passwordHistoryCount: options.passwordHistoryCount || 5,
      tokenRotation: options.tokenRotation !== false,
      biometricEnabled: options.biometricEnabled || false,
      webAuthnEnabled: options.webAuthnEnabled || true
    };

    // Initialize rate limiters
    this.initializeRateLimiters();

    // Session store
    this.sessions = new Map();
    
    // Token blacklist
    this.tokenBlacklist = new Set();

    // Device fingerprint cache
    this.deviceCache = new Map();

    // Suspicious activity patterns
    this.suspiciousPatterns = this.initializeSuspiciousPatterns();

    // Initialize WebAuthn
    this.initializeWebAuthn();

    // Setup cleanup intervals
    this.setupCleanup();

    // Generate RSA keys for JWT if not present
    this.initializeRSAKeys();
  }

  /**
   * Initialize RSA keys for JWT signing
   */
  async initializeRSAKeys() {
    const { generateKeyPairSync } = require('crypto');
    
    if (!this.rsaKeys) {
      const { publicKey, privateKey } = generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
          cipher: 'aes-256-cbc',
          passphrase: process.env.RSA_PASSPHRASE || 'ivanchat-secret-passphrase'
        }
      });

      this.rsaKeys = { publicKey, privateKey };
      
      // Store keys securely
      await this.redis.set('rsa:public', publicKey);
      await this.redis.set('rsa:private', privateKey);
      
      logger.info('RSA keys initialized for JWT signing');
    }
  }

  /**
   * Initialize rate limiters for various auth operations
   */
  initializeRateLimiters() {
    // Login rate limiter
    this.loginLimiter = new RateLimiterRedis({
      storeClient: this.redis,
      keyPrefix: 'login',
      points: 5, // Number of attempts
      duration: 900, // Per 15 minutes
      blockDuration: 1800 // Block for 30 minutes
    });

    // Token refresh rate limiter
    this.refreshLimiter = new RateLimiterRedis({
      storeClient: this.redis,
      keyPrefix: 'refresh',
      points: 10,
      duration: 3600, // Per hour
      blockDuration: 3600
    });

    // Password reset rate limiter
    this.passwordResetLimiter = new RateLimiterRedis({
      storeClient: this.redis,
      keyPrefix: 'password-reset',
      points: 3,
      duration: 3600,
      blockDuration: 7200
    });

    // MFA rate limiter
    this.mfaLimiter = new RateLimiterRedis({
      storeClient: this.redis,
      keyPrefix: 'mfa',
      points: 5,
      duration: 300,
      blockDuration: 900
    });

    // API key rate limiter
    this.apiKeyLimiter = new RateLimiterRedis({
      storeClient: this.redis,
      keyPrefix: 'api-key',
      points: 1000,
      duration: 3600
    });
  }

  /**
   * Initialize WebAuthn configuration
   */
  initializeWebAuthn() {
    this.webAuthnConfig = {
      rpName: 'Ivanchat',
      rpID: process.env.WEBAUTHN_RP_ID || 'ivanchat.com',
      origin: process.env.WEBAUTHN_ORIGIN || 'https://ivanchat.com',
      attestationType: 'direct',
      userVerification: 'required',
      timeout: 60000,
      authenticatorSelection: {
        authenticatorAttachment: 'cross-platform',
        requireResidentKey: false,
        userVerification: 'required'
      }
    };
  }

  /**
   * Initialize suspicious activity patterns
   */
  initializeSuspiciousPatterns() {
    return {
      rapidLocationChange: {
        maxDistanceKm: 1000,
        minTimeMinutes: 60
      },
      unusualLoginTime: {
        startHour: 2,
        endHour: 5
      },
      suspiciousUserAgents: [
        /bot/i,
        /crawler/i,
        /spider/i,
        /scraper/i,
        /curl/i,
        /wget/i,
        /python/i,
        /java/i,
        /ruby/i
      ],
      vpnProviders: new Set([
        'nordvpn',
        'expressvpn',
        'cyberghost',
        'surfshark',
        'privateinternetaccess'
      ]),
      torExitNodes: new Set() // Load from external source
    };
  }

  /**
   * Main authentication middleware
   */
  async authenticate(options = {}) {
    return async (req, res, next) => {
      try {
        // Extract token from various sources
        const token = this.extractToken(req);
        
        if (!token) {
          return this.handleAuthError(res, 'NO_TOKEN', 'Authentication required');
        }

        // Check if token is blacklisted
        if (await this.isTokenBlacklisted(token)) {
          return this.handleAuthError(res, 'TOKEN_BLACKLISTED', 'Token has been revoked');
        }

        // Verify and decode token
        const decoded = await this.verifyToken(token, 'access');
        
        if (!decoded) {
          return this.handleAuthError(res, 'INVALID_TOKEN', 'Invalid authentication token');
        }

        // Load user from database with caching
        const user = await this.loadUser(decoded.userId);
        
        if (!user) {
          return this.handleAuthError(res, 'USER_NOT_FOUND', 'User not found');
        }

        // Check if user is active and not banned
        if (!user.isActive || user.isBanned) {
          await this.blacklistToken(token);
          return this.handleAuthError(res, 'ACCOUNT_DISABLED', 'Account is disabled');
        }

        // Verify session
        const session = await this.verifySession(decoded.sessionId, user.id);
        
        if (!session) {
          return this.handleAuthError(res, 'INVALID_SESSION', 'Session expired or invalid');
        }

        // Perform security checks
        const securityCheck = await this.performSecurityChecks(req, user, session, options);
        
        if (!securityCheck.passed) {
          await this.handleSecurityViolation(req, user, securityCheck);
          return this.handleAuthError(res, securityCheck.code, securityCheck.message);
        }

        // Check for required permissions
        if (options.permissions) {
          const hasPermission = await this.checkPermissions(user, options.permissions);
          if (!hasPermission) {
            return this.handleAuthError(res, 'INSUFFICIENT_PERMISSIONS', 'Insufficient permissions');
          }
        }

        // Check for required roles
        if (options.roles) {
          const hasRole = await this.checkRoles(user, options.roles);
          if (!hasRole) {
            return this.handleAuthError(res, 'INSUFFICIENT_ROLE', 'Insufficient role privileges');
          }
        }

        // Update session activity
        await this.updateSessionActivity(session.id, req);

        // Rotate token if configured
        if (this.securityConfig.tokenRotation) {
          const newToken = await this.rotateTokenIfNeeded(token, decoded, user);
          if (newToken) {
            res.setHeader('X-New-Token', newToken);
          }
        }

        // Attach user and session to request
        req.user = this.sanitizeUser(user);
        req.session = session;
        req.token = token;
        req.tokenPayload = decoded;

        // Set security headers
        this.setSecurityHeaders(res, user, session);

        // Log successful authentication
        await this.logAuthEvent('authentication_success', user.id, req);

        next();

      } catch (error) {
        logger.error('Authentication error:', error);
        
        if (error.name === 'TokenExpiredError') {
          return this.handleAuthError(res, 'TOKEN_EXPIRED', 'Token has expired');
        }
        
        if (error.name === 'JsonWebTokenError') {
          return this.handleAuthError(res, 'INVALID_TOKEN', 'Malformed token');
        }

        return this.handleAuthError(res, 'AUTH_ERROR', 'Authentication failed');
      }
    };
  }

  /**
   * Extract token from request
   */
  extractToken(req) {
    // Check Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Check custom header
    if (req.headers['x-access-token']) {
      return req.headers['x-access-token'];
    }

    // Check query parameter (only for specific endpoints like downloads)
    if (req.query.token && this.isTokenAllowedInQuery(req.path)) {
      return req.query.token;
    }

    // Check cookies (for web clients)
    if (req.cookies && req.cookies.access_token) {
      return req.cookies.access_token;
    }

    return null;
  }

  /**
   * Verify JWT token
   */
  async verifyToken(token, type = 'access') {
    try {
      const secret = type === 'access' 
        ? this.jwtConfig.accessTokenSecret 
        : this.jwtConfig.refreshTokenSecret;

      const decoded = jwt.verify(token, secret, {
        issuer: this.jwtConfig.issuer,
        audience: this.jwtConfig.audience,
        algorithms: [this.jwtConfig.algorithm]
      });

      // Additional token validation
      if (decoded.type !== type) {
        throw new Error('Invalid token type');
      }

      // Check token binding (if implemented)
      if (decoded.fingerprint && !this.verifyTokenFingerprint(decoded.fingerprint)) {
        throw new Error('Token fingerprint mismatch');
      }

      return decoded;

    } catch (error) {
      logger.warn('Token verification failed:', error.message);
      return null;
    }
  }

  /**
   * Perform comprehensive security checks
   */
  async performSecurityChecks(req, user, session, options = {}) {
    const checks = [];

    // 1. Device verification
    if (this.securityConfig.requireDeviceVerification) {
      checks.push(this.verifyDevice(req, user, session));
    }

    // 2. IP validation
    if (this.securityConfig.requireIPValidation) {
      checks.push(this.validateIP(req, session));
    }

    // 3. Check for suspicious activity
    checks.push(this.detectSuspiciousActivity(req, user, session));

    // 4. MFA verification if required
    if (this.shouldRequireMFA(user, options)) {
      checks.push(this.verifyMFA(req, user));
    }

    // 5. Check session integrity
    checks.push(this.verifySessionIntegrity(session, req));

    // 6. Rate limiting check
    checks.push(this.checkRateLimit(req, user));

    // 7. Check for concurrent sessions
    checks.push(this.checkConcurrentSessions(user));

    // 8. Verify user agent consistency
    checks.push(this.verifyUserAgent(req, session));

    // 9. Check for replay attacks
    checks.push(this.checkReplayAttack(req));

    // 10. Validate CSRF token for state-changing operations
    if (this.isStateChangingOperation(req)) {
      checks.push(this.validateCSRFToken(req));
    }

    // Execute all checks in parallel
    const results = await Promise.all(checks);
    
    // Find any failed checks
    const failedCheck = results.find(result => !result.passed);
    
    return failedCheck || { passed: true };
  }

  /**
   * Verify device fingerprint
   */
  async verifyDevice(req, user, session) {
    try {
      const fingerprint = this.generateDeviceFingerprint(req);
      const storedFingerprint = await this.redis.get(`device:${user.id}:${session.deviceId}`);

      if (!storedFingerprint) {
        // New device, require additional verification
        await this.redis.setex(
          `device:${user.id}:${session.deviceId}`,
          86400 * 30, // 30 days
          fingerprint
        );

        // Send notification about new device
        await this.notifyNewDevice(user, req);

        // Require additional verification for sensitive operations
        if (this.isSensitiveOperation(req)) {
          return {
            passed: false,
            code: 'NEW_DEVICE',
            message: 'Additional verification required for new device'
          };
        }
      }

      // Check if fingerprint matches
      const similarity = this.calculateFingerprintSimilarity(fingerprint, storedFingerprint);
      
      if (similarity < 0.7) { // 70% similarity threshold
        await this.logAuthEvent('device_mismatch', user.id, req);
        
        return {
          passed: false,
          code: 'DEVICE_MISMATCH',
          message: 'Device verification failed'
        };
      }

      return { passed: true };

    } catch (error) {
      logger.error('Device verification error:', error);
      return { passed: true }; // Fail open for now
    }
  }

  /**
   * Generate device fingerprint
   */
  generateDeviceFingerprint(req) {
    const ua = new UAParser(req.headers['user-agent']);
    const browser = ua.getBrowser();
    const os = ua.getOS();
    const device = ua.getDevice();

    const components = [
      req.headers['user-agent'],
      req.headers['accept-language'],
      req.headers['accept-encoding'],
      req.headers['accept'],
      browser.name,
      browser.version,
      os.name,
      os.version,
      device.type || 'desktop',
      device.vendor,
      device.model,
      req.headers['sec-ch-ua'],
      req.headers['sec-ch-ua-mobile'],
      req.headers['sec-ch-ua-platform'],
      this.getScreenResolution(req),
      this.getTimezone(req),
      this.getPlugins(req),
      this.getCanvas(req)
    ].filter(Boolean);

    return crypto
      .createHash('sha256')
      .update(components.join('|'))
      .digest('hex');
  }

  /**
   * Validate IP address
   */
  async validateIP(req, session) {
    try {
      const currentIP = this.getClientIP(req);
      const sessionIP = session.ipAddress;

      // Check if IP has changed
      if (currentIP !== sessionIP) {
        // Get geolocation for both IPs
        const currentGeo = geoip.lookup(currentIP);
        const sessionGeo = geoip.lookup(sessionIP);

        if (currentGeo && sessionGeo) {
          // Calculate distance between locations
          const distance = this.calculateDistance(
            currentGeo.ll[0], currentGeo.ll[1],
            sessionGeo.ll[0], sessionGeo.ll[1]
          );

          // Check for impossible travel
          const timeDiff = (Date.now() - session.lastActivity) / 1000 / 60; // minutes
          const speed = distance / timeDiff * 60; // km/h

          if (speed > 900) { // Faster than commercial flight
            await this.logAuthEvent('impossible_travel', session.userId, req);
            
            return {
              passed: false,
              code: 'IMPOSSIBLE_TRAVEL',
              message: 'Suspicious location change detected'
            };
          }
        }

        // Check if IP is from VPN/Proxy/Tor
        if (await this.isProxyIP(currentIP)) {
          await this.logAuthEvent('proxy_detected', session.userId, req);
          
          // More lenient for premium users
          if (!session.isPremium) {
            return {
              passed: false,
              code: 'PROXY_DETECTED',
              message: 'VPN/Proxy usage detected'
            };
          }
        }

        // Update session IP if validation passes
        await this.updateSessionIP(session.id, currentIP);
      }

      return { passed: true };

    } catch (error) {
      logger.error('IP validation error:', error);
      return { passed: true }; // Fail open
    }
  }

  /**
   * Detect suspicious activity
   */
  async detectSuspiciousActivity(req, user, session) {
    try {
      const indicators = [];

      // Check user agent
      const ua = req.headers['user-agent'];
      if (this.suspiciousPatterns.suspiciousUserAgents.some(pattern => pattern.test(ua))) {
        indicators.push('suspicious_user_agent');
      }

      // Check login time
      const hour = new Date().getHours();
      if (hour >= this.suspiciousPatterns.unusualLoginTime.startHour &&
          hour <= this.suspiciousPatterns.unusualLoginTime.endHour) {
        indicators.push('unusual_login_time');
      }

      // Check for rapid requests
      const requestCount = await this.redis.incr(`requests:${user.id}:${Date.now() / 1000 | 0}`);
      await this.redis.expire(`requests:${user.id}:${Date.now() / 1000 | 0}`, 1);
      
      if (requestCount > 30) { // More than 30 requests per second
        indicators.push('rapid_requests');
      }

      // Check for account enumeration attempts
      const failedAttempts = await this.redis.get(`failed:${user.id}`);
      if (failedAttempts > 10) {
        indicators.push('multiple_failed_attempts');
      }

      // Calculate risk score
      const riskScore = indicators.length * 25;

      if (riskScore >= 75) {
        await this.logAuthEvent('high_risk_activity', user.id, req, { indicators });
        
        // Require additional verification
        return {
          passed: false,
          code: 'HIGH_RISK',
          message: 'Additional verification required'
        };
      }

      if (riskScore >= 50) {
        // Log medium risk but allow
        await this.logAuthEvent('medium_risk_activity', user.id, req, { indicators });
      }

      return { passed: true };

    } catch (error) {
      logger.error('Suspicious activity detection error:', error);
      return { passed: true };
    }
  }

  /**
   * Verify MFA if required
   */
  async verifyMFA(req, user) {
    try {
      // Check if MFA is enabled for user
      if (!user.mfaEnabled) {
        return { passed: true };
      }

      // Check if MFA was recently verified
      const mfaVerified = await this.redis.get(`mfa:verified:${user.id}`);
      if (mfaVerified) {
        return { passed: true };
      }

      // Extract MFA code from request
      const mfaCode = req.headers['x-mfa-code'] || req.body?.mfaCode;
      
      if (!mfaCode) {
        return {
          passed: false,
          code: 'MFA_REQUIRED',
          message: 'Multi-factor authentication required'
        };
      }

      // Rate limit MFA attempts
      try {
        await this.mfaLimiter.consume(user.id);
      } catch (rateLimitError) {
        return {
          passed: false,
          code: 'MFA_RATE_LIMIT',
          message: 'Too many MFA attempts'
        };
      }

      // Verify TOTP code
      const verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token: mfaCode,
        window: 2 // Allow 2 time steps tolerance
      });

      if (!verified) {
        await this.logAuthEvent('mfa_failed', user.id, req);
        
        return {
          passed: false,
          code: 'INVALID_MFA',
          message: 'Invalid MFA code'
        };
      }

      // Cache MFA verification
      await this.redis.setex(`mfa:verified:${user.id}`, 300, '1'); // 5 minutes

      return { passed: true };

    } catch (error) {
      logger.error('MFA verification error:', error);
      return {
        passed: false,
        code: 'MFA_ERROR',
        message: 'MFA verification failed'
      };
    }
  }

  /**
   * Check rate limiting
   */
  async checkRateLimit(req, user) {
    try {
      const key = `${user.id}:${this.getClientIP(req)}`;
      
      // Use different limiters based on user type
      const limiter = user.isPremium ? this.apiKeyLimiter : this.loginLimiter;
      
      await limiter.consume(key);
      
      return { passed: true };

    } catch (error) {
      if (error instanceof Error) {
        return {
          passed: false,
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests'
        };
      }
      return { passed: true };
    }
  }

  /**
   * Validate CSRF token
   */
  async validateCSRFToken(req) {
    try {
      const token = req.headers['x-csrf-token'] || req.body?._csrf;
      const sessionToken = req.session?.csrfToken;

      if (!token || !sessionToken) {
        return {
          passed: false,
          code: 'CSRF_TOKEN_MISSING',
          message: 'CSRF token required'
        };
      }

      // Constant-time comparison to prevent timing attacks
      const valid = crypto.timingSafeEqual(
        Buffer.from(token),
        Buffer.from(sessionToken)
      );

      if (!valid) {
        await this.logAuthEvent('csrf_validation_failed', req.user?.id, req);
        
        return {
          passed: false,
          code: 'CSRF_TOKEN_INVALID',
          message: 'Invalid CSRF token'
        };
      }

      return { passed: true };

    } catch (error) {
      logger.error('CSRF validation error:', error);
      return {
        passed: false,
        code: 'CSRF_ERROR',
        message: 'CSRF validation failed'
      };
    }
  }

  /**
   * Generate secure tokens
   */
  async generateTokens(user, session, deviceInfo = {}) {
    const tokenId = crypto.randomBytes(16).toString('hex');
    const fingerprint = crypto.randomBytes(32).toString('hex');

    // Create token payload
    const payload = {
      userId: user.id,
      email: user.email,
      sessionId: session.id,
      tokenId,
      fingerprint: this.hashFingerprint(fingerprint),
      deviceId: deviceInfo.deviceId,
      roles: user.roles || [],
      permissions: user.permissions || [],
      iat: Math.floor(Date.now() / 1000),
      jti: tokenId // JWT ID for tracking
    };

    // Generate access token
    const accessToken = jwt.sign(
      { ...payload, type: 'access' },
      this.jwtConfig.accessTokenSecret,
      {
        expiresIn: this.jwtConfig.accessTokenExpiry,
        issuer: this.jwtConfig.issuer,
        audience: this.jwtConfig.audience,
        algorithm: this.jwtConfig.algorithm
      }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { ...payload, type: 'refresh' },
      this.jwtConfig.refreshTokenSecret,
      {
        expiresIn: this.jwtConfig.refreshTokenExpiry,
        issuer: this.jwtConfig.issuer,
        audience: this.jwtConfig.audience,
        algorithm: this.jwtConfig.algorithm
      }
    );

    // Store token metadata in Redis
    await this.storeTokenMetadata(tokenId, user.id, session.id, deviceInfo);

    // Store refresh token
    await this.storeRefreshToken(refreshToken, user.id, session.id);

    return {
      accessToken,
      refreshToken,
      fingerprint,
      expiresIn: this.getTokenExpiry(this.jwtConfig.accessTokenExpiry),
      tokenType: 'Bearer'
    };
  }

  /**
   * Create secure session
   */
  async createSession(user, req, options = {}) {
    const sessionId = crypto.randomBytes(32).toString('hex');
    const csrfToken = crypto.randomBytes(32).toString('hex');
    const deviceId = crypto.randomBytes(16).toString('hex');

    const session = {
      id: sessionId,
      userId: user.id,
      deviceId,
      ipAddress: this.getClientIP(req),
      userAgent: req.headers['user-agent'],
      fingerprint: this.generateDeviceFingerprint(req),
      csrfToken,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      expiresAt: Date.now() + this.securityConfig.sessionTimeout,
      isPersistent: options.rememberMe || false,
      mfaVerified: false,
      riskScore: 0,
      metadata: {
        browser: this.getBrowserInfo(req),
        os: this.getOSInfo(req),
        location: await this.getLocation(req)
      }
    };

    // Store session in Redis
    await this.redis.setex(
      `session:${sessionId}`,
      this.securityConfig.sessionTimeout / 1000,
      JSON.stringify(session)
    );

    // Add to user's session list
    await this.redis.sadd(`user:sessions:${user.id}`, sessionId);

    // Enforce maximum sessions per user
    await this.enforceMaxSessions(user.id);

    return session;
  }

  /**
   * Password validation with advanced requirements
   */
  async validatePassword(password, user = null) {
    const requirements = {
      minLength: 12,
      maxLength: 128,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      prohibitCommonPasswords: true,
      prohibitUserInfo: true,
      prohibitRepeatingChars: true,
      prohibitSequentialChars: true,
      checkPwnedPasswords: this.isProduction
    };

    const errors = [];

    // Length check
    if (password.length < requirements.minLength) {
      errors.push(`Password must be at least ${requirements.minLength} characters`);
    }
    if (password.length > requirements.maxLength) {
      errors.push(`Password must not exceed ${requirements.maxLength} characters`);
    }

    // Character requirements
    if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain uppercase letters');
    }
    if (requirements.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain lowercase letters');
    }
    if (requirements.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain numbers');
    }
    if (requirements.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain special characters');
    }

    // Prohibit repeating characters (e.g., "aaa")
    if (requirements.prohibitRepeatingChars && /(.)\1{2,}/.test(password)) {
      errors.push('Password must not contain repeating characters');
    }

    // Prohibit sequential characters (e.g., "abc", "123")
    if (requirements.prohibitSequentialChars) {
      const hasSequential = this.hasSequentialCharacters(password);
      if (hasSequential) {
        errors.push('Password must not contain sequential characters');
      }
    }

    // Check against common passwords
    if (requirements.prohibitCommonPasswords) {
      const isCommon = await this.isCommonPassword(password);
      if (isCommon) {
        errors.push('Password is too common');
      }
    }

    // Check for user information in password
    if (requirements.prohibitUserInfo && user) {
      const userInfo = [
        user.username,
        user.email.split('@')[0],
        user.firstName,
        user.lastName
      ].filter(Boolean);

      for (const info of userInfo) {
        if (info && password.toLowerCase().includes(info.toLowerCase())) {
          errors.push('Password must not contain personal information');
          break;
        }
      }
    }

    // Check against previous passwords
    if (user) {
      const isReused = await this.isPasswordReused(password, user.id);
      if (isReused) {
        errors.push('Password has been used recently');
      }
    }

    // Check HaveIBeenPwned API
    if (requirements.checkPwnedPasswords) {
      const isPwned = await this.checkPwnedPassword(password);
      if (isPwned) {
        errors.push('Password has been exposed in a data breach');
      }
    }

    // Calculate password strength score
    const strengthScore = this.calculatePasswordStrength(password);

    return {
      valid: errors.length === 0,
      errors,
      strengthScore,
      suggestions: this.getPasswordSuggestions(strengthScore)
    };
  }

  /**
   * Hash password with Argon2id
   */
  async hashPassword(password) {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536, // 64 MB
      timeCost: 3,
      parallelism: 4,
      saltLength: 32
    });
  }

  /**
   * Verify password with timing attack protection
   */
  async verifyPassword(password, hash) {
    try {
      // Add random delay to prevent timing attacks
      const delay = crypto.randomInt(100, 500);
      await new Promise(resolve => setTimeout(resolve, delay));

      return await argon2.verify(hash, password);
    } catch (error) {
      logger.error('Password verification error:', error);
      return false;
    }
  }

  /**
   * WebAuthn registration
   */
  async registerWebAuthn(user, req) {
    try {
      const challenge = crypto.randomBytes(32);
      
      const registrationOptions = {
        rpName: this.webAuthnConfig.rpName,
        rpID: this.webAuthnConfig.rpID,
        userID: user.id,
        userName: user.username,
        userDisplayName: user.displayName || user.username,
        challenge,
        attestationType: this.webAuthnConfig.attestationType,
        authenticatorSelection: this.webAuthnConfig.authenticatorSelection,
        timeout: this.webAuthnConfig.timeout,
        excludeCredentials: await this.getUserCredentials(user.id)
      };

      // Store challenge for verification
      await this.redis.setex(
        `webauthn:challenge:${user.id}`,
        300, // 5 minutes
        challenge.toString('base64')
      );

      return registrationOptions;

    } catch (error) {
      logger.error('WebAuthn registration error:', error);
      throw error;
    }
  }

  /**
   * Handle authentication errors
   */
  handleAuthError(res, code, message, statusCode = 401) {
    res.status(statusCode).json({
      error: 'Authentication Error',
      code,
      message,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Set security headers for authenticated responses
   */
  setSecurityHeaders(res, user, session) {
    res.setHeader('X-User-ID', user.id);
    res.setHeader('X-Session-ID', session.id);
    res.setHeader('X-Auth-Level', this.getAuthLevel(user, session));
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  /**
   * Cleanup expired sessions and tokens
   */
  setupCleanup() {
    // Clean expired sessions every 5 minutes
    setInterval(async () => {
      try {
        const keys = await this.redis.keys('session:*');
        for (const key of keys) {
          const session = await this.redis.get(key);
          if (session) {
            const parsed = JSON.parse(session);
            if (parsed.expiresAt < Date.now()) {
              await this.redis.del(key);
              await this.redis.srem(`user:sessions:${parsed.userId}`, parsed.id);
            }
          }
        }
      } catch (error) {
        logger.error('Session cleanup error:', error);
      }
    }, 5 * 60 * 1000);

    // Clean token blacklist every hour
    setInterval(async () => {
      try {
        const keys = await this.redis.keys('blacklist:*');
        for (const key of keys) {
          const ttl = await this.redis.ttl(key);
          if (ttl <= 0) {
            await this.redis.del(key);
          }
        }
      } catch (error) {
        logger.error('Blacklist cleanup error:', error);
      }
    }, 60 * 60 * 1000);
  }

  /**
   * Helper methods
   */

  getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0] ||
           req.headers['x-real-ip'] ||
           req.connection.remoteAddress ||
           req.socket.remoteAddress ||
           req.ip;
  }

  async isProxyIP(ip) {
    // Implement proxy detection logic
    // Could use external services or maintain a list of known proxy IPs
    return false;
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  hashFingerprint(fingerprint) {
    return crypto
      .createHash('sha256')
      .update(fingerprint)
      .digest('hex');
  }

  isStateChangingOperation(req) {
    return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
  }

  isSensitiveOperation(req) {
    const sensitivePaths = [
      '/api/auth/password',
      '/api/users/delete',
      '/api/admin',
      '/api/billing',
      '/api/security'
    ];
    return sensitivePaths.some(path => req.path.startsWith(path));
  }

  async logAuthEvent(event, userId, req, metadata = {}) {
    const log = {
      event,
      userId,
      timestamp: new Date().toISOString(),
      ip: this.getClientIP(req),
      userAgent: req.headers['user-agent'],
      path: req.path,
      method: req.method,
      ...metadata
    };

    await this.redis.lpush('auth:logs', JSON.stringify(log));
    await this.redis.ltrim('auth:logs', 0, 9999); // Keep last 10000 logs
    
    logger.info('Auth event:', log);
  }

  sanitizeUser(user) {
    const { 
      password, 
      mfaSecret, 
      passwordHistory,
      __v,
      ...sanitized 
    } = user.toObject ? user.toObject() : user;
    
    return sanitized;
  }

  /**
   * Close connections
   */
  async close() {
    await this.redis.quit();
    logger.info('Auth middleware closed');
  }
}

// Create singleton instance
const authMiddleware = new AuthMiddleware();

// Export middleware functions
module.exports = {
  // Main authentication middleware
  authenticate: (options) => authMiddleware.authenticate(options),
  
  // Specific authentication levels
  requireAuth: authMiddleware.authenticate(),
  requireAdmin: authMiddleware.authenticate({ roles: ['admin'] }),
  requireModerator: authMiddleware.authenticate({ roles: ['admin', 'moderator'] }),
  requirePremium: authMiddleware.authenticate({ permissions: ['premium'] }),
  
  // MFA middleware
  requireMFA: authMiddleware.authenticate({ requireMFA: true }),
  
  // Instance for direct access
  authMiddleware,
  
  // Helper functions
  generateTokens: (user, session, deviceInfo) => 
    authMiddleware.generateTokens(user, session, deviceInfo),
  
  createSession: (user, req, options) => 
    authMiddleware.createSession(user, req, options),
  
  validatePassword: (password, user) => 
    authMiddleware.validatePassword(password, user),
  
  hashPassword: (password) => 
    authMiddleware.hashPassword(password),
  
  verifyPassword: (password, hash) => 
    authMiddleware.verifyPassword(password, hash),
  
  registerWebAuthn: (user, req) => 
    authMiddleware.registerWebAuthn(user, req)
};