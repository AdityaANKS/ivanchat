const jwt = require('jsonwebtoken');

class AuthorizationMiddleware {
  constructor(securityServices, config) {
    this.security = securityServices;
    this.config = config;
    this.roleHierarchy = {
      admin: 100,
      moderator: 50,
      user: 10,
      guest: 1
    };
  }

  // Role-based access control
  requireRole(requiredRole) {
    return async (req, res, next) => {
      try {
        const user = req.user;
        
        if (!user) {
          return res.status(401).json({ error: 'Authentication required' });
        }

        const userRoleLevel = this.roleHierarchy[user.role] || 0;
        const requiredRoleLevel = this.roleHierarchy[requiredRole] || 100;

        if (userRoleLevel < requiredRoleLevel) {
          await this.security.audit.logEvent({
            type: 'authorization.denied',
            severity: 'warning',
            userId: user.id,
            resource: req.path,
            requiredRole,
            userRole: user.role
          });

          return res.status(403).json({ error: 'Insufficient permissions' });
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // Permission-based access control
  requirePermission(permission) {
    return async (req, res, next) => {
      try {
        const user = req.user;
        
        if (!user) {
          return res.status(401).json({ error: 'Authentication required' });
        }

        const hasPermission = await this.checkPermission(user.id, permission);

        if (!hasPermission) {
          await this.security.audit.logEvent({
            type: 'authorization.denied',
            severity: 'warning',
            userId: user.id,
            resource: req.path,
            permission
          });

          return res.status(403).json({ error: `Permission required: ${permission}` });
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // Resource-based access control
  requireResourceAccess(resourceType, accessLevel = 'read') {
    return async (req, res, next) => {
      try {
        const user = req.user;
        const resourceId = req.params.id || req.params.resourceId;

        if (!user) {
          return res.status(401).json({ error: 'Authentication required' });
        }

        const hasAccess = await this.checkResourceAccess(
          user.id,
          resourceType,
          resourceId,
          accessLevel
        );

        if (!hasAccess) {
          await this.security.audit.logEvent({
            type: 'authorization.denied',
            severity: 'warning',
            userId: user.id,
            resource: `${resourceType}:${resourceId}`,
            accessLevel
          });

          return res.status(403).json({ error: 'Access denied to resource' });
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // Scope-based access (OAuth-style)
  requireScope(scope) {
    return async (req, res, next) => {
      try {
        const token = req.token;
        
        if (!token || !token.scopes) {
          return res.status(401).json({ error: 'Token with scopes required' });
        }

        const hasScope = token.scopes.includes(scope) || token.scopes.includes('*');

        if (!hasScope) {
          await this.security.audit.logEvent({
            type: 'authorization.denied',
            severity: 'warning',
            tokenId: token.jti,
            requiredScope: scope,
            tokenScopes: token.scopes
          });

          return res.status(403).json({ error: `Scope required: ${scope}` });
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // IP whitelist/blacklist
  ipRestriction(options = {}) {
    return async (req, res, next) => {
      try {
        const clientIp = this.getClientIp(req);
        
        // Check blacklist
        if (options.blacklist && options.blacklist.includes(clientIp)) {
          await this.security.audit.logEvent({
            type: 'authorization.blocked',
            severity: 'warning',
            ipAddress: clientIp,
            reason: 'blacklisted'
          });

          return res.status(403).json({ error: 'Access denied' });
        }

        // Check whitelist
        if (options.whitelist && !options.whitelist.includes(clientIp)) {
          await this.security.audit.logEvent({
            type: 'authorization.blocked',
            severity: 'warning',
            ipAddress: clientIp,
            reason: 'not_whitelisted'
          });

          return res.status(403).json({ error: 'Access denied' });
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // Time-based access control
  timeRestriction(options = {}) {
    return async (req, res, next) => {
      try {
        const now = new Date();
        const hour = now.getHours();
        const day = now.getDay();

        // Check time window
        if (options.hours) {
          const { start, end } = options.hours;
          if (hour < start || hour >= end) {
            return res.status(403).json({ 
              error: `Access only allowed between ${start}:00 and ${end}:00` 
            });
          }
        }

        // Check day restrictions
        if (options.days && !options.days.includes(day)) {
          return res.status(403).json({ 
            error: 'Access not allowed on this day' 
          });
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // Geographic restriction
  geoRestriction(options = {}) {
    return async (req, res, next) => {
      try {
        const clientIp = this.getClientIp(req);
        const location = await this.getGeoLocation(clientIp);

        if (options.countries) {
          if (options.blacklist && options.countries.includes(location.country)) {
            return res.status(403).json({ error: 'Access denied from your location' });
          }
          
          if (options.whitelist && !options.countries.includes(location.country)) {
            return res.status(403).json({ error: 'Access denied from your location' });
          }
        }

        req.geoLocation = location;
        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // Device restriction
  deviceRestriction(options = {}) {
    return async (req, res, next) => {
      try {
        const user = req.user;
        const deviceId = req.headers['x-device-id'];
        
        if (!deviceId) {
          return res.status(403).json({ error: 'Device identification required' });
        }

        const isRegistered = await this.checkDeviceRegistration(user.id, deviceId);
        
        if (!isRegistered) {
          if (options.allowRegistration) {
            await this.registerDevice(user.id, deviceId, req.headers['user-agent']);
          } else {
            return res.status(403).json({ error: 'Unregistered device' });
          }
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // API key authentication
  apiKeyAuth(options = {}) {
    return async (req, res, next) => {
      try {
        const apiKey = req.headers['x-api-key'] || req.query.apiKey;
        
        if (!apiKey) {
          return res.status(401).json({ error: 'API key required' });
        }

        const keyData = await this.validateApiKey(apiKey);
        
        if (!keyData.valid) {
          await this.security.audit.logEvent({
            type: 'authorization.failed',
            severity: 'warning',
            reason: 'invalid_api_key',
            apiKey: apiKey.substring(0, 8) + '...'
          });

          return res.status(401).json({ error: 'Invalid API key' });
        }

        // Check rate limits for API key
        if (keyData.rateLimit) {
          const withinLimit = await this.checkApiKeyRateLimit(apiKey, keyData.rateLimit);
          if (!withinLimit) {
            return res.status(429).json({ error: 'API rate limit exceeded' });
          }
        }

        req.apiKey = keyData;
        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // Multi-factor authorization
  multiFactorAuth(factors = []) {
    return async (req, res, next) => {
      try {
        const user = req.user;
        const validFactors = [];
        const requiredFactors = factors.length || 2;

        // Check various factors
        if (factors.includes('password') && req.body.password) {
          const valid = await this.security.password.verifyPassword(
            req.body.password,
            user.passwordHash
          );
          if (valid) validFactors.push('password');
        }

        if (factors.includes('totp') && req.body.totpCode) {
          const valid = this.security.twoFactor.verifyToken(
            req.body.totpCode,
            user.totpSecret
          );
          if (valid) validFactors.push('totp');
        }

        if (factors.includes('biometric') && req.body.biometric) {
          const valid = await this.security.biometric.verifyAuthentication(
            user.id,
            req.body.biometric
          );
          if (valid.verified) validFactors.push('biometric');
        }

        if (validFactors.length < requiredFactors) {
          return res.status(403).json({ 
            error: 'Multi-factor authentication required',
            required: requiredFactors,
            provided: validFactors.length
          });
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // Helper methods
  async checkPermission(userId, permission) {
    // Implement based on your permission system
    return true;
  }

  async checkResourceAccess(userId, resourceType, resourceId, accessLevel) {
    // Implement based on your resource access control
    return true;
  }

  getClientIp(req) {
    return req.headers['x-forwarded-for']?.split(',')[0] || 
           req.connection.remoteAddress;
  }

  async getGeoLocation(ip) {
    // Implement using GeoIP service
    return { country: 'US', city: 'Unknown' };
  }

  async checkDeviceRegistration(userId, deviceId) {
    // Implement device registration check
    return true;
  }

  async registerDevice(userId, deviceId, userAgent) {
    // Implement device registration
  }

  async validateApiKey(apiKey) {
    // Implement API key validation
    return { valid: true, rateLimit: 100 };
  }

  async checkApiKeyRateLimit(apiKey, limit) {
    // Implement rate limiting for API keys
    return true;
  }
}

module.exports = AuthorizationMiddleware;