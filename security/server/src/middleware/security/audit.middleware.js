const crypto = require('crypto');
const AuditService = require('../../services/security/AuditService');

class AuditMiddleware {
  constructor() {
    this.auditService = new AuditService();
    this.sensitiveEndpoints = new Set([
      '/api/auth/login',
      '/api/auth/register',
      '/api/users/profile',
      '/api/messages/send',
      '/api/keys/generate',
      '/api/admin'
    ]);
  }

  // Main audit middleware
  middleware() {
    return async (req, res, next) => {
      const auditEntry = {
        requestId: this.generateRequestId(),
        timestamp: new Date(),
        method: req.method,
        path: req.path,
        ip: this.getClientIp(req),
        userAgent: req.get('user-agent'),
        userId: req.user?.id || null,
        sessionId: req.session?.id || null
      };

      // Attach audit entry to request
      req.audit = auditEntry;

      // Log request start
      await this.logRequestStart(auditEntry, req);

      // Capture response
      const originalSend = res.send;
      res.send = function(data) {
        res.send = originalSend;
        
        // Log response
        auditEntry.statusCode = res.statusCode;
        auditEntry.responseTime = Date.now() - auditEntry.timestamp.getTime();
        
        // Log based on status code
        if (res.statusCode >= 400) {
          auditEntry.level = 'error';
          auditEntry.error = data;
        } else {
          auditEntry.level = 'info';
        }
        
        // Async log without blocking response
        setImmediate(() => {
          this.logRequestEnd(auditEntry, req, res);
        },bind(this));
        
        return res.send(data);
      }.bind(this);

      next();
    };
  }

  // Security event logging
  securityEventLogger() {
    return async (req, res, next) => {
      // Check for security events
      const securityEvents = [];

      // Failed authentication attempts
      if (req.path === '/api/auth/login' && req.method === 'POST') {
        const originalJson = res.json;
        res.json = function(data) {
          if (data.error || res.statusCode === 401) {
            securityEvents.push({
              type: 'FAILED_LOGIN',
              severity: 'medium',
              details: {
                username: req.body.username,
                ip: this.getClientIp(req)
              }
            });
          }
          return originalJson.call(this, data);
        }.bind(this);
      }

      // Suspicious patterns
      if (this.detectSuspiciousActivity(req)) {
        securityEvents.push({
          type: 'SUSPICIOUS_ACTIVITY',
          severity: 'high',
          details: {
            pattern: this.getSuspiciousPattern(req),
            ip: this.getClientIp(req)
          }
        });
      }

      // Log security events
      for (const event of securityEvents) {
        await this.auditService.logSecurityEvent(event);
      }

      next();
    };
  }

  // Data access audit
  dataAccessAudit() {
    return async (req, res, next) => {
      if (this.isSensitiveEndpoint(req.path)) {
        const accessLog = {
          userId: req.user?.id,
          resource: req.path,
          action: req.method,
          timestamp: new Date(),
          ip: this.getClientIp(req),
          data: this.sanitizeData(req.body)
        };

        await this.auditService.logDataAccess(accessLog);
      }

      next();
    };
  }

  // Admin action audit
  adminActionAudit() {
    return async (req, res, next) => {
      if (req.path.startsWith('/api/admin')) {
        const adminLog = {
          adminId: req.user?.id,
          action: `${req.method} ${req.path}`,
          target: req.body?.targetUserId || req.params?.userId,
          changes: this.sanitizeData(req.body),
          timestamp: new Date(),
          ip: this.getClientIp(req)
        };

        await this.auditService.logAdminAction(adminLog);
      }

      next();
    };
  }

  // Helper methods
  generateRequestId() {
    return crypto.randomBytes(16).toString('hex');
  }

  getClientIp(req) {
    return req.ip || 
           req.headers['x-forwarded-for']?.split(',')[0] || 
           req.connection.remoteAddress;
  }

  async logRequestStart(auditEntry, req) {
    if (this.shouldLogRequest(req)) {
      await this.auditService.logRequest({
        ...auditEntry,
        phase: 'start',
        body: this.sanitizeData(req.body),
        query: this.sanitizeData(req.query),
        headers: this.sanitizeHeaders(req.headers)
      });
    }
  }

  async logRequestEnd(auditEntry, req, res) {
    if (this.shouldLogRequest(req) || auditEntry.statusCode >= 400) {
      await this.auditService.logRequest({
        ...auditEntry,
        phase: 'end'
      });
    }
  }

  shouldLogRequest(req) {
    // Log all sensitive endpoints
    if (this.isSensitiveEndpoint(req.path)) {
      return true;
    }

    // Log all mutations
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      return true;
    }

    // Log admin endpoints
    if (req.path.startsWith('/api/admin')) {
      return true;
    }

    return false;
  }

  isSensitiveEndpoint(path) {
    return Array.from(this.sensitiveEndpoints).some(endpoint => 
      path.startsWith(endpoint)
    );
  }

  detectSuspiciousActivity(req) {
    // SQL injection patterns
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)\b)/i,
      /(--|\||;|\/\*|\*\/)/
    ];

    // XSS patterns
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi
    ];

    // Path traversal patterns
    const pathPatterns = [
      /\.\.\//g,
      /\.\.\\/, 
    ];

    const checkPatterns = (str, patterns) => {
      if (!str) return false;
      const strToCheck = typeof str === 'string' ? str : JSON.stringify(str);
      return patterns.some(pattern => pattern.test(strToCheck));
    };

    // Check various request parts
    return checkPatterns(req.path, [...sqlPatterns, ...pathPatterns]) ||
           checkPatterns(req.query, [...sqlPatterns, ...xssPatterns]) ||
           checkPatterns(req.body, [...sqlPatterns, ...xssPatterns]);
  }

  getSuspiciousPattern(req) {
    // Return the type of suspicious pattern detected
    const patterns = [];
    
    if (/(\b(SELECT|INSERT|UPDATE|DELETE|DROP)\b)/i.test(JSON.stringify(req.body))) {
      patterns.push('SQL_INJECTION');
    }
    
    if (/<script|javascript:/i.test(JSON.stringify(req.body))) {
      patterns.push('XSS');
    }
    
    if (/\.\.\//.test(req.path)) {
      patterns.push('PATH_TRAVERSAL');
    }
    
    return patterns.join(', ');
  }

  sanitizeData(data) {
    if (!data) return null;
    
    const sensitiveFields = [
      'password',
      'token',
      'secret',
      'apiKey',
      'creditCard',
      'ssn',
      'privateKey'
    ];

    const sanitized = { ...data };
    
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    }
    
    return sanitized;
  }

  sanitizeHeaders(headers) {
    const sanitized = { ...headers };
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
    
    for (const header of sensitiveHeaders) {
      if (sanitized[header]) {
        sanitized[header] = '***REDACTED***';
      }
    }
    
    return sanitized;
  }
}

// Export singleton instance
const auditMiddleware = new AuditMiddleware();

module.exports = {
  auditMiddleware: auditMiddleware.middleware.bind(auditMiddleware),
  securityEventLogger: auditMiddleware.securityEventLogger.bind(auditMiddleware),
  dataAccessAudit: auditMiddleware.dataAccessAudit.bind(auditMiddleware),
  adminActionAudit: auditMiddleware.adminActionAudit.bind(auditMiddleware)
};