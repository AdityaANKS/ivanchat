const DOMPurify = require('isomorphic-dompurify');
const validator = require('validator');
const mongoSanitize = require('mongo-sanitize');

class SanitizationMiddleware {
  constructor(securityServices, config) {
    this.security = securityServices;
    this.config = config;
    this.setupDOMPurify();
  }

  setupDOMPurify() {
    // Configure DOMPurify
    this.purifyConfig = {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
      ALLOWED_ATTR: ['href', 'target'],
      ALLOW_DATA_ATTR: false,
      SAFE_FOR_TEMPLATES: true,
      WHOLE_DOCUMENT: false,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
      FORCE_BODY: false,
      SANITIZE_DOM: true,
      KEEP_CONTENT: true
    };
  }

  // General input sanitization
  sanitizeInput(options = {}) {
    return (req, res, next) => {
      try {
        // Sanitize body
        if (req.body) {
          req.body = this.sanitizeObject(req.body, options);
        }

        // Sanitize query parameters
        if (req.query) {
          req.query = this.sanitizeObject(req.query, options);
        }

        // Sanitize URL parameters
        if (req.params) {
          req.params = this.sanitizeObject(req.params, options);
        }

        // Sanitize headers
        if (options.sanitizeHeaders) {
          req.headers = this.sanitizeHeaders(req.headers);
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // HTML sanitization
  sanitizeHTML(options = {}) {
    const config = { ...this.purifyConfig, ...options };
    
    return (req, res, next) => {
      try {
        if (req.body) {
          req.body = this.sanitizeHTMLInObject(req.body, config);
        }
        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // NoSQL injection prevention
  preventNoSQLInjection() {
    return (req, res, next) => {
      try {
        // Remove any keys that start with '$' or contain '.'
        if (req.body) req.body = mongoSanitize(req.body);
        if (req.query) req.query = mongoSanitize(req.query);
        if (req.params) req.params = mongoSanitize(req.params);

        // Additional checks for common NoSQL operators
        const checkForOperators = (obj) => {
          if (typeof obj !== 'object' || obj === null) return obj;
          
          const cleaned = Array.isArray(obj) ? [] : {};
          
          for (const [key, value] of Object.entries(obj)) {
            // Block MongoDB operators
            if (key.startsWith('$') || key.includes('.')) {
              this.security.audit.logEvent({
                type: 'security.nosql_injection_blocked',
                severity: 'warning',
                field: key,
                userId: req.user?.id
              });
              continue;
            }
            
            // Recursively clean nested objects
            cleaned[key] = checkForOperators(value);
          }
          
          return cleaned;
        };

        if (req.body) req.body = checkForOperators(req.body);
        if (req.query) req.query = checkForOperators(req.query);

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // XSS prevention
  preventXSS(options = {}) {
    return (req, res, next) => {
      try {
        const sanitize = (value) => {
          if (typeof value !== 'string') return value;
          
          // Remove script tags and javascript: protocol
          let cleaned = value
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '');
          
          // Escape HTML entities
          if (options.escapeHtml !== false) {
            cleaned = validator.escape(cleaned);
          }
          
          return cleaned;
        };

        const sanitizeObj = (obj) => {
          if (typeof obj !== 'object' || obj === null) {
            return typeof obj === 'string' ? sanitize(obj) : obj;
          }
          
          const result = Array.isArray(obj) ? [] : {};
          
          for (const [key, value] of Object.entries(obj)) {
            result[key] = sanitizeObj(value);
          }
          
          return result;
        };

        if (req.body) req.body = sanitizeObj(req.body);
        if (req.query) req.query = sanitizeObj(req.query);
        if (req.params) req.params = sanitizeObj(req.params);

        // Set security headers
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('X-Content-Type-Options', 'nosniff');

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // File name sanitization
  sanitizeFileName() {
    return (req, res, next) => {
      try {
        if (!req.file && !req.files) {
          return next();
        }

        const sanitize = (filename) => {
          // Remove path traversal attempts
          let safe = filename.replace(/\.\./g, '');
          
          // Remove special characters
          safe = safe.replace(/[^a-zA-Z0-9._-]/g, '_');
          
          // Limit length
          const maxLength = 255;
          if (safe.length > maxLength) {
            const ext = safe.substring(safe.lastIndexOf('.'));
            safe = safe.substring(0, maxLength - ext.length) + ext;
          }
          
          // Add timestamp to prevent collisions
          const timestamp = Date.now();
          const nameParts = safe.split('.');
          if (nameParts.length > 1) {
            const ext = nameParts.pop();
            safe = `${nameParts.join('.')}_${timestamp}.${ext}`;
          } else {
            safe = `${safe}_${timestamp}`;
          }
          
          return safe;
        };

        const files = req.files || [req.file];
        files.forEach(file => {
          file.originalname = sanitize(file.originalname);
          file.filename = sanitize(file.filename || file.originalname);
        });

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // URL sanitization
  sanitizeURL() {
    return (req, res, next) => {
      try {
        const sanitizeUrl = (url) => {
          if (typeof url !== 'string') return url;
          
          // Remove javascript: and data: protocols
          let safe = url.replace(/^(javascript|data):/gi, '');
          
          // Validate URL
          if (!validator.isURL(safe, {
            protocols: ['http', 'https'],
            require_protocol: false
          })) {
            return '';
          }
          
          // Encode special characters
          try {
            const parsed = new URL(safe);
            return parsed.toString();
          } catch {
            return encodeURI(safe);
          }
        };

        // Sanitize URLs in body
        const sanitizeUrls = (obj) => {
          if (typeof obj !== 'object' || obj === null) return obj;
          
          const result = Array.isArray(obj) ? [] : {};
          
          for (const [key, value] of Object.entries(obj)) {
            if (key.toLowerCase().includes('url') || key.toLowerCase().includes('link')) {
              result[key] = typeof value === 'string' ? sanitizeUrl(value) : value;
            } else if (typeof value === 'object') {
              result[key] = sanitizeUrls(value);
            } else {
              result[key] = value;
            }
          }
          
          return result;
        };

        if (req.body) req.body = sanitizeUrls(req.body);
        if (req.query) req.query = sanitizeUrls(req.query);

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // Email sanitization
  sanitizeEmail() {
    return (req, res, next) => {
      try {
        const sanitize = (email) => {
          if (typeof email !== 'string') return email;
          
          // Normalize email
          let normalized = validator.normalizeEmail(email, {
            all_lowercase: true,
            gmail_remove_dots: true,
            gmail_remove_subaddress: false,
            gmail_convert_googlemaildotcom: true,
            outlookdotcom_remove_subaddress: false,
            yahoo_remove_subaddress: false,
            icloud_remove_subaddress: false
          });
          
          // Validate
          if (!validator.isEmail(normalized)) {
            throw new Error(`Invalid email: ${email}`);
          }
          
          return normalized;
        };

        const sanitizeEmails = (obj) => {
          if (typeof obj !== 'object' || obj === null) return obj;
          
          const result = Array.isArray(obj) ? [] : {};
          
          for (const [key, value] of Object.entries(obj)) {
            if (key.toLowerCase().includes('email')) {
              result[key] = typeof value === 'string' ? sanitize(value) : value;
            } else if (typeof value === 'object') {
              result[key] = sanitizeEmails(value);
            } else {
              result[key] = value;
            }
          }
          
          return result;
        };

        if (req.body) req.body = sanitizeEmails(req.body);

        next();
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    };
  }

  // Phone number sanitization
  sanitizePhoneNumber() {
    return (req, res, next) => {
      try {
        const sanitize = (phone) => {
          if (typeof phone !== 'string') return phone;
          
          // Remove all non-numeric characters except + at the beginning
          let cleaned = phone.replace(/[^\d+]/g, '');
          
          // Ensure + is only at the beginning
          if (cleaned.includes('+')) {
            const hasLeadingPlus = cleaned[0] === '+';
            cleaned = cleaned.replace(/\+/g, '');
            if (hasLeadingPlus) cleaned = '+' + cleaned;
          }
          
          // Validate length (international numbers can be 7-15 digits)
          if (cleaned.replace('+', '').length < 7 || cleaned.replace('+', '').length > 15) {
            throw new Error(`Invalid phone number: ${phone}`);
          }
          
          return cleaned;
        };

        const sanitizePhones = (obj) => {
          if (typeof obj !== 'object' || obj === null) return obj;
          
          const result = Array.isArray(obj) ? [] : {};
          
          for (const [key, value] of Object.entries(obj)) {
            if (key.toLowerCase().includes('phone') || key.toLowerCase().includes('mobile')) {
              result[key] = typeof value === 'string' ? sanitize(value) : value;
            } else if (typeof value === 'object') {
              result[key] = sanitizePhones(value);
            } else {
              result[key] = value;
            }
          }
          
          return result;
        };

        if (req.body) req.body = sanitizePhones(req.body);

        next();
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    };
  }

  // Credit card sanitization (PCI compliance)
  sanitizeCreditCard() {
    return (req, res, next) => {
      try {
        const maskCard = (cardNumber) => {
          if (typeof cardNumber !== 'string') return cardNumber;
          
          // Remove spaces and dashes
          const cleaned = cardNumber.replace(/[\s-]/g, '');
          
          // Validate card number
          if (!validator.isCreditCard(cleaned)) {
            throw new Error('Invalid credit card number');
          }
          
          // Mask all but last 4 digits
          const last4 = cleaned.slice(-4);
          const masked = '*'.repeat(cleaned.length - 4) + last4;
          
          // Log PCI compliance event
          this.security.audit.logEvent({
            type: 'compliance.pci_data_masked',
            severity: 'info',
            userId: req.user?.id
          });
          
          return masked;
        };

        const sanitizeCards = (obj) => {
          if (typeof obj !== 'object' || obj === null) return obj;
          
          const result = Array.isArray(obj) ? [] : {};
          
          for (const [key, value] of Object.entries(obj)) {
            const lowerKey = key.toLowerCase();
            if (lowerKey.includes('card') || lowerKey.includes('credit') || lowerKey === 'pan') {
              result[key] = typeof value === 'string' ? maskCard(value) : value;
            } else if (typeof value === 'object') {
              result[key] = sanitizeCards(value);
            } else {
              result[key] = value;
            }
          }
          
          return result;
        };

        if (req.body) req.body = sanitizeCards(req.body);

        next();
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    };
  }

  // Helper methods
  sanitizeObject(obj, options = {}) {
    if (typeof obj !== 'object' || obj === null) {
      return this.sanitizeValue(obj, options);
    }

    const sanitized = Array.isArray(obj) ? [] : {};

    for (const [key, value] of Object.entries(obj)) {
      // Skip keys that shouldn't be sanitized
      if (options.skipKeys && options.skipKeys.includes(key)) {
        sanitized[key] = value;
        continue;
      }

      if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeObject(value, options);
      } else {
        sanitized[key] = this.sanitizeValue(value, options);
      }
    }

    return sanitized;
  }

  sanitizeValue(value, options = {}) {
    if (typeof value !== 'string') return value;

    let sanitized = value;

    // Trim whitespace
    if (options.trim !== false) {
      sanitized = sanitized.trim();
    }

    // Remove null bytes
    sanitized = sanitized.replace(/\0/g, '');

    // Remove control characters
    if (options.removeControlChars !== false) {
      sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');
    }

    // Limit length
    if (options.maxLength) {
      sanitized = sanitized.substring(0, options.maxLength);
    }

    // Remove or encode special characters
    if (options.encode) {
      sanitized = encodeURIComponent(sanitized);
    }

    return sanitized;
  }

  sanitizeHTMLInObject(obj, config) {
    if (typeof obj === 'string') {
      return DOMPurify.sanitize(obj, config);
    }

    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    const sanitized = Array.isArray(obj) ? [] : {};

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeHTMLInObject(value, config);
      } else if (typeof value === 'string') {
        sanitized[key] = DOMPurify.sanitize(value, config);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  sanitizeHeaders(headers) {
    const sanitized = {};
    const allowedHeaders = this.config.allowedHeaders || [
      'accept',
      'accept-language',
      'content-type',
      'content-length',
      'user-agent',
      'authorization',
      'x-requested-with',
      'x-forwarded-for',
      'x-real-ip'
    ];

    for (const [key, value] of Object.entries(headers)) {
      const lowerKey = key.toLowerCase();
      
      if (allowedHeaders.includes(lowerKey)) {
        // Sanitize header value
        sanitized[key] = typeof value === 'string' 
          ? value.replace(/[\r\n]/g, '').substring(0, 8192)
          : value;
      }
    }

    return sanitized;
  }
}

module.exports = SanitizationMiddleware;