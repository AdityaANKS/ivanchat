const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');
const Redis = require('ioredis');
const User = require('../../models/security/SecureUser.model');
const securityConfig = require('../../config/security.config');
const AuditService = require('../../services/security/AuditService');

class AuthenticationMiddleware {
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      keyPrefix: 'auth:',
    });
    
    this.jwtConfig = securityConfig.jwt;
  }

  /**
   * Verify JWT token
   */
  verifyToken = async (req, res, next) => {
    try {
      // Get token from header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          error: 'No token provided',
          code: 'NO_TOKEN',
        });
      }

      const token = authHeader.substring(7);

      // Check if token is blacklisted
      const isBlacklisted = await this.redis.get(`blacklist:${token}`);
      if (isBlacklisted) {
        return res.status(401).json({
          error: 'Token has been revoked',
          code: 'TOKEN_REVOKED',
        });
      }

      // Verify token
      const decoded = jwt.verify(token, this.jwtConfig.publicKey, {
        algorithms: [this.jwtConfig.algorithm],
        issuer: this.jwtConfig.accessToken.issuer,
        audience: this.jwtConfig.accessToken.audience,
      });

      // Check if user exists and is active
      const user = await User.findById(decoded.userId)
        .select('+securitySettings.sessions')
        .lean();

      if (!user) {
        return res.status(401).json({
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        });
      }

      if (user.status === 'suspended' || user.status === 'banned') {
        return res.status(403).json({
          error: 'Account suspended',
          code: 'ACCOUNT_SUSPENDED',
        });
      }

      // Check if session is valid
      const session = user.securitySettings.sessions.find(
        s => s.token === token
      );

      if (!session || new Date(session.expiresAt) < new Date()) {
        return res.status(401).json({
          error: 'Session expired',
          code: 'SESSION_EXPIRED',
        });
      }

      // Attach user to request
      req.user = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      };

      req.token = token;
      req.session = session;

      // Log successful authentication
      await AuditService.log({
        event: 'authentication.success',
        userId: user._id,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        metadata: {
          endpoint: req.originalUrl,
          method: req.method,
        },
      });

      next();
    } catch (error) {
      // Log failed authentication
      await AuditService.log({
        event: 'authentication.failed',
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        error: error.message,
        metadata: {
          endpoint: req.originalUrl,
          method: req.method,
        },
      });

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          error: 'Token expired',
          code: 'TOKEN_EXPIRED',
        });
      }

      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          error: 'Invalid token',
          code: 'INVALID_TOKEN',
        });
      }

      return res.status(500).json({
        error: 'Authentication error',
        code: 'AUTH_ERROR',
      });
    }
  };

  /**
   * Verify API key
   */
  verifyApiKey = async (req, res, next) => {
    try {
      const apiKey = req.headers[securityConfig.api.apiKeyHeader.toLowerCase()];

      if (!apiKey) {
        return res.status(401).json({
          error: 'API key required',
          code: 'API_KEY_REQUIRED',
        });
      }

      // Validate API key format
      if (apiKey.length !== securityConfig.api.apiKeyLength * 2) {
        return res.status(401).json({
          error: 'Invalid API key format',
          code: 'INVALID_API_KEY_FORMAT',
        });
      }

      // Check cache first
      const cached = await this.redis.get(`apikey:${apiKey}`);
      if (cached) {
        req.apiClient = JSON.parse(cached);
        return next();
      }

      // Validate from database
      const hashedKey = crypto
        .createHash('sha256')
        .update(apiKey)
        .digest('hex');

      const client = await ApiClient.findOne({
        hashedKey,
        status: 'active',
      });

      if (!client) {
        return res.status(401).json({
          error: 'Invalid API key',
          code: 'INVALID_API_KEY',
        });
      }

      // Check rate limits for this API key
      const usage = await this.redis.incr(`apikey:usage:${apiKey}`);
      await this.redis.expire(`apikey:usage:${apiKey}`, 3600);

      if (usage > client.rateLimit) {
        return res.status(429).json({
          error: 'API rate limit exceeded',
          code: 'RATE_LIMIT_EXCEEDED',
        });
      }

      // Cache for performance
      await this.redis.setex(
        `apikey:${apiKey}`,
        300,
        JSON.stringify({
          id: client._id,
          name: client.name,
          permissions: client.permissions,
        })
      );

      req.apiClient = client;
      next();
    } catch (error) {
      console.error('API key verification error:', error);
      return res.status(500).json({
        error: 'API key verification failed',
        code: 'API_KEY_ERROR',
      });
    }
  };

  /**
   * Verify request signature
   */
  verifyRequestSignature = (req, res, next) => {
    if (!securityConfig.api.requestSigning) {
      return next();
    }

    const signature = req.headers[securityConfig.api.signatureHeader.toLowerCase()];
    const timestamp = req.headers[securityConfig.api.timestampHeader.toLowerCase()];

    if (!signature || !timestamp) {
      return res.status(401).json({
        error: 'Request signature required',
        code: 'SIGNATURE_REQUIRED',
      });
    }

    // Check timestamp to prevent replay attacks
    const requestTime = parseInt(timestamp);
    const currentTime = Date.now();

    if (Math.abs(currentTime - requestTime) > securityConfig.api.timestampTolerance) {
      return res.status(401).json({
        error: 'Request expired',
        code: 'REQUEST_EXPIRED',
      });
    }

    // Verify signature
    const payload = JSON.stringify(req.body) + timestamp;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.SIGNING_SECRET)
      .update(payload)
      .digest('hex');

    if (!crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )) {
      return res.status(401).json({
        error: 'Invalid signature',
        code: 'INVALID_SIGNATURE',
      });
    }

    next();
  };

  /**
   * Two-factor authentication verification
   */
  verify2FA = async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id)
        .select('+twoFactorAuth');

      if (!user.twoFactorAuth.enabled) {
        return next();
      }

      const token = req.headers['x-2fa-token'];
      if (!token) {
        return res.status(401).json({
          error: '2FA token required',
          code: '2FA_REQUIRED',
        });
      }

      const TwoFactorService = require('../../services/security/TwoFactorAuthService');
      const isValid = await TwoFactorService.verifyToken(user._id, token);

      if (!isValid) {
        return res.status(401).json({
          error: 'Invalid 2FA token',
          code: 'INVALID_2FA_TOKEN',
        });
      }

      next();
    } catch (error) {
      console.error('2FA verification error:', error);
      return res.status(500).json({
        error: '2FA verification failed',
        code: '2FA_ERROR',
      });
    }
  };

  /**
   * Device trust verification
   */
  verifyDeviceTrust = async (req, res, next) => {
    if (!securityConfig.zeroTrust.deviceTrust) {
      return next();
    }

    try {
      const deviceId = req.headers['x-device-id'];
      const deviceFingerprint = req.headers['x-device-fingerprint'];

      if (!deviceId || !deviceFingerprint) {
        return res.status(401).json({
          error: 'Device verification required',
          code: 'DEVICE_VERIFICATION_REQUIRED',
        });
      }

      const user = await User.findById(req.user.id)
        .select('+securitySettings.trustedDevices');

      const trustedDevice = user.securitySettings.trustedDevices.find(
        d => d.deviceId === deviceId && d.fingerprint === deviceFingerprint
      );

      if (!trustedDevice) {
        // Send verification email/SMS
        return res.status(401).json({
          error: 'Unknown device',
          code: 'UNKNOWN_DEVICE',
          action: 'VERIFY_DEVICE',
        });
      }

      // Update last used
      trustedDevice.lastUsed = new Date();
      await user.save();

      req.device = trustedDevice;
      next();
    } catch (error) {
      console.error('Device trust verification error:', error);
      return res.status(500).json({
        error: 'Device verification failed',
        code: 'DEVICE_VERIFICATION_ERROR',
      });
    }
  };

  /**
   * Refresh token
   */
  refreshToken = async (req, res) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({
          error: 'Refresh token required',
          code: 'REFRESH_TOKEN_REQUIRED',
        });
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, this.jwtConfig.publicKey, {
        algorithms: [this.jwtConfig.algorithm],
        issuer: this.jwtConfig.refreshToken.issuer,
        audience: this.jwtConfig.refreshToken.audience,
      });

      // Get user
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        });
      }

      // Generate new tokens
      const TokenService = require('../../services/security/TokenService');
      const tokens = await TokenService.generateTokens(user);

      res.json({
        success: true,
        tokens,
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      return res.status(401).json({
        error: 'Token refresh failed',
        code: 'TOKEN_REFRESH_ERROR',
      });
    }
  };

  /**
   * Logout
   */
  logout = async (req, res) => {
    try {
      const token = req.token;
      const user = req.user;

      // Blacklist token
      await this.redis.setex(
        `blacklist:${token}`,
        86400, // 24 hours
        'true'
      );

      // Remove session from user
      await User.updateOne(
        { _id: user.id },
        { $pull: { 'securitySettings.sessions': { token } } }
      );

      // Log logout
      await AuditService.log({
        event: 'logout',
        userId: user.id,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });

      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({
        error: 'Logout failed',
        code: 'LOGOUT_ERROR',
      });
    }
  };
}

module.exports = new AuthenticationMiddleware();