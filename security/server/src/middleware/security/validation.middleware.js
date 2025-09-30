const validator = require('validator');
const xss = require('xss');

class ValidationMiddleware {
  constructor(securityServices, config) {
    this.security = securityServices;
    this.config = config;
    this.customValidators = new Map();
  }

  // Input validation with schema
  validateInput(schema) {
    return async (req, res, next) => {
      try {
        const errors = [];
        const validated = {};

        // Validate body
        if (schema.body) {
          const bodyErrors = await this.validateObject(req.body, schema.body, 'body');
          errors.push(...bodyErrors);
          if (bodyErrors.length === 0) {
            validated.body = this.sanitizeObject(req.body, schema.body);
          }
        }

        // Validate params
        if (schema.params) {
          const paramErrors = await this.validateObject(req.params, schema.params, 'params');
          errors.push(...paramErrors);
          if (paramErrors.length === 0) {
            validated.params = this.sanitizeObject(req.params, schema.params);
          }
        }

        // Validate query
        if (schema.query) {
          const queryErrors = await this.validateObject(req.query, schema.query, 'query');
          errors.push(...queryErrors);
          if (queryErrors.length === 0) {
            validated.query = this.sanitizeObject(req.query, schema.query);
          }
        }

        // Validate headers
        if (schema.headers) {
          const headerErrors = await this.validateObject(req.headers, schema.headers, 'headers');
          errors.push(...headerErrors);
        }

        if (errors.length > 0) {
          await this.security.audit.logEvent({
            type: 'validation.failed',
            severity: 'warning',
            errors,
            path: req.path,
            userId: req.user?.id
          });

          return res.status(400).json({
            error: 'Validation failed',
            details: errors
          });
        }

        // Replace with validated and sanitized data
        if (validated.body) req.body = validated.body;
        if (validated.params) req.params = validated.params;
        if (validated.query) req.query = validated.query;

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // SQL injection prevention
  preventSQLInjection() {
    return (req, res, next) => {
      const checkValue = (value) => {
        if (typeof value !== 'string') return true;
        
        const sqlPatterns = [
          /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC|EXECUTE)\b)/gi,
          /(--|#|\/\*|\*\/)/g,
          /(\bOR\b\s*\d+\s*=\s*\d+)/gi,
          /(\bAND\b\s*\d+\s*=\s*\d+)/gi,
          /(';|";)/g,
          /(\bWHERE\b.*\b=\b)/gi
        ];

        return !sqlPatterns.some(pattern => pattern.test(value));
      };

      const checkObject = (obj, path = '') => {
        const issues = [];
        
        for (const [key, value] of Object.entries(obj)) {
          const currentPath = path ? `${path}.${key}` : key;
          
          if (typeof value === 'object' && value !== null) {
            issues.push(...checkObject(value, currentPath));
          } else if (!checkValue(value)) {
            issues.push({
              path: currentPath,
              value: value.substring(0, 50),
              type: 'sql_injection'
            });
          }
        }
        
        return issues;
      };

      const issues = [
        ...checkObject(req.body || {}),
        ...checkObject(req.query || {}),
        ...checkObject(req.params || {})
      ];

      if (issues.length > 0) {
        this.security.audit.logEvent({
          type: 'security.sql_injection_attempt',
          severity: 'critical',
          issues,
          ipAddress: req.ip,
          userId: req.user?.id
        });

        return res.status(400).json({
          error: 'Invalid input detected'
        });
      }

      next();
    };
  }

  // NoSQL injection prevention
  preventNoSQLInjection() {
    return (req, res, next) => {
      const sanitize = (obj) => {
        if (typeof obj !== 'object' || obj === null) return obj;
        
        const cleaned = Array.isArray(obj) ? [] : {};
        
        for (const [key, value] of Object.entries(obj)) {
          // Remove MongoDB operators
          if (key.startsWith('$')) {
            continue;
          }
          
          if (typeof value === 'object' && value !== null) {
            cleaned[key] = sanitize(value);
          } else {
            cleaned[key] = value;
          }
        }
        
        return cleaned;
      };

      if (req.body) req.body = sanitize(req.body);
      if (req.query) req.query = sanitize(req.query);
      
      next();
    };
  }

  // Command injection prevention
  preventCommandInjection() {
    return (req, res, next) => {
      const dangerous = [
        '|', '&', ';', '$', '>', '<', '`', '\\', '!', '\n', '\r',
        '$(', '${', '&&', '||', '>>', '<<', '#'
      ];

      const checkValue = (value) => {
        if (typeof value !== 'string') return true;
        return !dangerous.some(char => value.includes(char));
      };

      const validate = (obj) => {
        for (const value of Object.values(obj || {})) {
          if (typeof value === 'object' && value !== null) {
            if (!validate(value)) return false;
          } else if (!checkValue(value)) {
            return false;
          }
        }
        return true;
      };

      if (!validate(req.body) || !validate(req.query) || !validate(req.params)) {
        this.security.audit.logEvent({
          type: 'security.command_injection_attempt',
          severity: 'critical',
          ipAddress: req.ip
        });

        return res.status(400).json({
          error: 'Invalid characters detected'
        });
      }

      next();
    };
  }

  // Path traversal prevention
  preventPathTraversal() {
    return (req, res, next) => {
      const patterns = [
        /\.\./g,
        /\.\.\\/, 
        /%2e%2e/gi,
        /%252e%252e/gi,
        /\.\//g,
        /\.\\/, 
        /%2e\//gi,
        /%2e\\/gi
      ];

      const checkPath = (value) => {
        if (typeof value !== 'string') return true;
        return !patterns.some(pattern => pattern.test(value));
      };

      const paths = [
        req.path,
        ...Object.values(req.params || {}),
        ...Object.values(req.query || {})
      ].filter(v => typeof v === 'string');

      for (const path of paths) {
        if (!checkPath(path)) {
          this.security.audit.logEvent({
            type: 'security.path_traversal_attempt',
            severity: 'critical',
            path,
            ipAddress: req.ip
          });

          return res.status(400).json({
            error: 'Invalid path'
          });
        }
      }

      next();
    };
  }

  // File upload validation
  validateFileUpload(options = {}) {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
      allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'],
      scanVirus = true
    } = options;

    return async (req, res, next) => {
      try {
        if (!req.files && !req.file) {
          return next();
        }

        const files = req.files || [req.file];
        
        for (const file of files) {
          // Check file size
          if (file.size > maxSize) {
            return res.status(400).json({
              error: `File too large. Maximum size: ${maxSize / 1024 / 1024}MB`
            });
          }

          // Check MIME type
          if (!allowedTypes.includes(file.mimetype)) {
            return res.status(400).json({
              error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}`
            });
          }

          // Check extension
          const ext = require('path').extname(file.originalname).toLowerCase();
          if (!allowedExtensions.includes(ext)) {
            return res.status(400).json({
              error: `Invalid file extension. Allowed: ${allowedExtensions.join(', ')}`
            });
          }

          // Verify file signature (magic numbers)
          if (!this.verifyFileSignature(file.buffer, file.mimetype)) {
            return res.status(400).json({
              error: 'File content does not match declared type'
            });
          }

          // Virus scan
          if (scanVirus) {
            const isSafe = await this.scanForVirus(file.buffer);
            if (!isSafe) {
              await this.security.audit.logEvent({
                type: 'security.malware_detected',
                severity: 'critical',
                filename: file.originalname,
                userId: req.user?.id
              });

              return res.status(400).json({
                error: 'Malicious file detected'
              });
            }
          }

          // Generate safe filename
          file.safeName = this.generateSafeFilename(file.originalname);
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // JSON validation
  validateJSON() {
    return (req, res, next) => {
      if (req.headers['content-type']?.includes('application/json') && req.body) {
        try {
          // Check for JSON depth to prevent DoS
          const depth = this.getJsonDepth(req.body);
          if (depth > 10) {
            return res.status(400).json({
              error: 'JSON structure too deep'
            });
          }

          // Check for circular references
          JSON.stringify(req.body);
          
          next();
        } catch (error) {
          return res.status(400).json({
            error: 'Invalid JSON'
          });
        }
      } else {
        next();
      }
    };
  }

  // Type validation helpers
  async validateObject(obj, schema, path) {
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = obj[field];
      const fieldPath = `${path}.${field}`;

      // Required check
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push({
          field: fieldPath,
          message: 'Field is required'
        });
        continue;
      }

      // Skip optional empty fields
      if (!rules.required && (value === undefined || value === null)) {
        continue;
      }

      // Type validation
      if (rules.type) {
        const typeValid = this.validateType(value, rules.type);
        if (!typeValid) {
          errors.push({
            field: fieldPath,
            message: `Expected type ${rules.type}, got ${typeof value}`
          });
          continue;
        }
      }

      // String validations
      if (typeof value === 'string') {
        if (rules.minLength && value.length < rules.minLength) {
          errors.push({
            field: fieldPath,
            message: `Minimum length is ${rules.minLength}`
          });
        }

        if (rules.maxLength && value.length > rules.maxLength) {
          errors.push({
            field: fieldPath,
            message: `Maximum length is ${rules.maxLength}`
          });
        }

        if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
          errors.push({
            field: fieldPath,
            message: 'Invalid format'
          });
        }

        if (rules.email && !validator.isEmail(value)) {
          errors.push({
            field: fieldPath,
            message: 'Invalid email'
          });
        }

        if (rules.url && !validator.isURL(value)) {
          errors.push({
            field: fieldPath,
            message: 'Invalid URL'
          });
        }

        if (rules.uuid && !validator.isUUID(value)) {
          errors.push({
            field: fieldPath,
            message: 'Invalid UUID'
          });
        }
      }

      // Number validations
      if (typeof value === 'number') {
        if (rules.min !== undefined && value < rules.min) {
          errors.push({
            field: fieldPath,
            message: `Minimum value is ${rules.min}`
          });
        }

        if (rules.max !== undefined && value > rules.max) {
          errors.push({
            field: fieldPath,
            message: `Maximum value is ${rules.max}`
          });
        }
      }

      // Array validations
      if (Array.isArray(value)) {
        if (rules.minItems && value.length < rules.minItems) {
          errors.push({
            field: fieldPath,
            message: `Minimum items is ${rules.minItems}`
          });
        }

        if (rules.maxItems && value.length > rules.maxItems) {
          errors.push({
            field: fieldPath,
            message: `Maximum items is ${rules.maxItems}`
          });
        }

        if (rules.items) {
          for (let i = 0; i < value.length; i++) {
            const itemErrors = await this.validateObject(
              { item: value[i] },
              { item: rules.items },
              `${fieldPath}[${i}]`
            );
            errors.push(...itemErrors);
          }
        }
      }

      // Custom validation
      if (rules.custom) {
        const customValid = await rules.custom(value, obj);
        if (customValid !== true) {
          errors.push({
            field: fieldPath,
            message: customValid || 'Custom validation failed'
          });
        }
      }
    }

    return errors;
  }

  validateType(value, type) {
    switch (type) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'array':
        return Array.isArray(value);
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      case 'date':
        return value instanceof Date || !isNaN(Date.parse(value));
      default:
        return true;
    }
  }

  sanitizeObject(obj, schema) {
    const sanitized = {};

    for (const [field, rules] of Object.entries(schema)) {
      let value = obj[field];

      if (value === undefined || value === null) {
        continue;
      }

      // String sanitization
      if (typeof value === 'string') {
        if (rules.trim !== false) {
          value = value.trim();
        }

        if (rules.lowercase) {
          value = value.toLowerCase();
        }

        if (rules.uppercase) {
          value = value.toUpperCase();
        }

        if (rules.escape !== false) {
          value = validator.escape(value);
        }

        if (rules.stripHtml) {
          value = value.replace(/<[^>]*>/g, '');
        }
      }

      // Number sanitization
      if (rules.type === 'number' && typeof value === 'string') {
        value = parseFloat(value);
      }

      // Boolean sanitization
      if (rules.type === 'boolean' && typeof value === 'string') {
        value = value === 'true';
      }

      sanitized[field] = value;
    }

    return sanitized;
  }

  verifyFileSignature(buffer, mimeType) {
    const signatures = {
      'image/jpeg': [0xFF, 0xD8, 0xFF],
      'image/png': [0x89, 0x50, 0x4E, 0x47],
      'image/gif': [0x47, 0x49, 0x46],
      'application/pdf': [0x25, 0x50, 0x44, 0x46]
    };

    const signature = signatures[mimeType];
    if (!signature) return true;

    for (let i = 0; i < signature.length; i++) {
      if (buffer[i] !== signature[i]) {
        return false;
      }
    }

    return true;
  }

  async scanForVirus(buffer) {
    // Integrate with antivirus service
    // For now, just check for suspicious patterns
    const suspicious = [
      Buffer.from('4D5A'), // EXE
      Buffer.from('504B0304'), // ZIP
      Buffer.from('526172211A0700'), // RAR
    ];

    for (const pattern of suspicious) {
      if (buffer.indexOf(pattern) !== -1) {
        return false;
      }
    }

    return true;
  }

  generateSafeFilename(originalName) {
    const ext = require('path').extname(originalName);
    const name = require('path').basename(originalName, ext);
    const safeName = name.replace(/[^a-zA-Z0-9]/g, '_');
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    
    return `${safeName}_${timestamp}_${random}${ext}`;
  }

  getJsonDepth(obj) {
    if (typeof obj !== 'object' || obj === null) return 0;
    
    const depths = Object.values(obj).map(v => this.getJsonDepth(v));
    return 1 + Math.max(0, ...depths);
  }
}

module.exports = ValidationMiddleware;