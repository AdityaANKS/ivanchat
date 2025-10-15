// server/src/middleware/validation.js

import Joi from 'joi'; // Ensure Joi is imported as an ES Module
// If xss and validator are used, ensure they are compatible ES module imports or handle CommonJS require if necessary
// Assuming they are not strictly needed in this specific Joi context, but if they were,
// you might need 'import * as xss from "xss";' or adjust package.json "type" or use .cjs
import DOMPurify from 'isomorphic-dompurify'; // Ensure DOMPurify is imported as an ES Module
import logger from '../utils/logger.js'; // Assuming logger is also an ES Module

/**
 * Comprehensive validation middleware for Ivanchat
 * Handles request validation, sanitization, and security checks
 */

// Custom Joi extensions
const customJoi = Joi.extend((joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.noSQL': '{{#label}} contains potentially unsafe characters',
    'string.noXSS': '{{#label}} contains potentially unsafe HTML/Script content',
    'string.username': '{{#label}} must be a valid username',
    'string.channelName': '{{#label}} must be a valid channel name',
    'string.serverName': '{{#label}} must be a valid server name'
  },
  rules: {
    noSQL: {
      validate(value, helpers) {
        // Check for NoSQL injection patterns
        const sqlPatterns = /(\$ne|\$gt|\$gte|\$lt|\$lte|\$in|\$nin|\$and|\$or|\$not|\$nor|\$exists|\$type|\$all|\$elemMatch|\$size|\$regex|\$where)/i;
        if (sqlPatterns.test(value)) {
          return helpers.error('string.noSQL');
        }
        return value;
      }
    },
    noXSS: {
      validate(value, helpers) {
        const cleaned = DOMPurify.sanitize(value, { ALLOWED_TAGS: [] });
        if (cleaned !== value) {
          return helpers.error('string.noXSS');
        }
        return value;
      }
    },
    username: {
      validate(value, helpers) {
        if (!/^[a-zA-Z0-9_.-]{3,32}$/.test(value)) {
          return helpers.error('string.username');
        }
        return value;
      }
    },
    channelName: {
      validate(value, helpers) {
        if (!/^[a-zA-Z0-9-_]{2,100}$/.test(value)) {
          return helpers.error('string.channelName');
        }
        return value;
      }
    },
    serverName: {
      validate(value, helpers) {
        if (value.length < 2 || value.length > 100) {
          return helpers.error('string.serverName');
        }
        return value;
      }
    }
  }
}));

// Validation schemas (still an internal object)
const schemas = {
  // Auth schemas
  auth: {
    register: customJoi.object({
      username: customJoi.string().username().required(),
      email: customJoi.string().email().lowercase().required(),
      password: customJoi.string()
        .min(8)
        .max(128)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .required()
        .messages({
          'string.pattern.base': 'Password must contain uppercase, lowercase, number and special character'
        }),
      confirmPassword: customJoi.string().valid(customJoi.ref('password')).required(),
      displayName: customJoi.string().min(1).max(32).noXSS().optional(),
      dateOfBirth: customJoi.date().max('now').optional(),
      acceptTerms: customJoi.boolean().valid(true).required()
    }),

    login: customJoi.object({
      email: customJoi.string().email().required(),
      password: customJoi.string().required(),
      rememberMe: customJoi.boolean().optional(),
      captcha: customJoi.string().when('$requireCaptcha', {
        is: true,
        then: customJoi.required()
      })
    }),

    forgotPassword: customJoi.object({
      email: customJoi.string().email().required()
    }),

    resetPassword: customJoi.object({
      token: customJoi.string().required(),
      password: customJoi.string()
        .min(8)
        .max(128)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .required(),
      confirmPassword: customJoi.string().valid(customJoi.ref('password')).required()
    }),

    twoFactor: customJoi.object({
      code: customJoi.string().length(6).pattern(/^\d+$/).required()
    })
  },

  // User schemas
  user: {
    updateProfile: customJoi.object({
      displayName: customJoi.string().min(1).max(32).noXSS().optional(),
      bio: customJoi.string().max(500).noXSS().optional(),
      avatar: customJoi.string().uri().optional(),
      banner: customJoi.string().uri().optional(),
      status: customJoi.string().valid('online', 'idle', 'dnd', 'invisible').optional(),
      customStatus: customJoi.string().max(128).noXSS().optional(),
      timezone: customJoi.string().optional(),
      language: customJoi.string().length(2).optional(),
      theme: customJoi.string().valid('light', 'dark', 'auto').optional()
    }),

    updateSettings: customJoi.object({
      notifications: customJoi.object({
        messages: customJoi.boolean(),
        mentions: customJoi.boolean(),
        serverUpdates: customJoi.boolean(),
        friendRequests: customJoi.boolean(),
        sounds: customJoi.boolean()
      }).optional(),
      privacy: customJoi.object({
        showOnlineStatus: customJoi.boolean(),
        showActivity: customJoi.boolean(),
        allowDirectMessages: customJoi.string().valid('everyone', 'friends', 'none'),
        allowFriendRequests: customJoi.boolean()
      }).optional(),
      security: customJoi.object({
        twoFactorEnabled: customJoi.boolean(),
        sessionTimeout: customJoi.number().min(5).max(1440)
      }).optional()
    }),

    search: customJoi.object({
      query: customJoi.string().min(1).max(100).noSQL().noXSS().required(),
      type: customJoi.string().valid('users', 'messages', 'channels', 'servers').optional(),
      limit: customJoi.number().min(1).max(50).default(20),
      offset: customJoi.number().min(0).default(0)
    })
  },

  // Message schemas
  message: {
    create: customJoi.object({
      content: customJoi.string().min(1).max(2000).noXSS().required(),
      channelId: customJoi.string().pattern(/^[a-f\d]{24}$/i).required(),
      attachments: customJoi.array().items(
        customJoi.object({
          filename: customJoi.string().max(255).required(),
          size: customJoi.number().max(100 * 1024 * 1024).required(), // 100MB max
          contentType: customJoi.string().required(),
          url: customJoi.string().uri().required()
        })
      ).max(10).optional(),
      embeds: customJoi.array().items(
        customJoi.object({
          title: customJoi.string().max(256).optional(),
          description: customJoi.string().max(4096).optional(),
          url: customJoi.string().uri().optional(),
          color: customJoi.number().optional(),
          fields: customJoi.array().items(
            customJoi.object({
              name: customJoi.string().max(256).required(),
              value: customJoi.string().max(1024).required(),
              inline: customJoi.boolean().optional()
            })
          ).max(25).optional()
        })
      ).max(10).optional(),
      mentions: customJoi.array().items(
        customJoi.string().pattern(/^[a-f\d]{24}$/i)
      ).max(50).optional(),
      replyTo: customJoi.string().pattern(/^[a-f\d]{24}$/i).optional(),
      isPrivate: customJoi.boolean().optional(),
      scheduledAt: customJoi.date().min('now').optional()
    }),

    update: customJoi.object({
      content: customJoi.string().min(1).max(2000).noXSS().required(),
      edited: customJoi.boolean().valid(true).optional()
    }),

    delete: customJoi.object({
      messageId: customJoi.string().pattern(/^[a-f\d]{24}$/i).required()
    }),

    reaction: customJoi.object({
      messageId: customJoi.string().pattern(/^[a-f\d]{24}$/i).required(),
      emoji: customJoi.string().max(100).required()
    }),

    search: customJoi.object({
      query: customJoi.string().min(1).max(100).noSQL().noXSS().optional(),
      channelId: customJoi.string().pattern(/^[a-f\d]{24}$/i).optional(),
      authorId: customJoi.string().pattern(/^[a-f\d]{24}$/i).optional(),
      hasAttachment: customJoi.boolean().optional(),
      hasEmbed: customJoi.boolean().optional(),
      before: customJoi.date().optional(),
      after: customJoi.date().optional(),
      limit: customJoi.number().min(1).max(100).default(50),
      sort: customJoi.string().valid('asc', 'desc').default('desc')
    }),

    bulkDelete: customJoi.object({
      messageIds: customJoi.array()
        .items(customJoi.string().pattern(/^[a-f\d]{24}$/i))
        .min(2)
        .max(100)
        .required()
    })
  },

  // Channel schemas
  channel: {
    create: customJoi.object({
      name: customJoi.string().channelName().required(),
      type: customJoi.string().valid('text', 'voice', 'announcement', 'stage', 'forum').required(),
      serverId: customJoi.string().pattern(/^[a-f\d]{24}$/i).required(),
      categoryId: customJoi.string().pattern(/^[a-f\d]{24}$/i).optional(),
      description: customJoi.string().max(1024).noXSS().optional(),
      isPrivate: customJoi.boolean().optional(),
      isNSFW: customJoi.boolean().optional(),
      position: customJoi.number().min(0).optional(),
      permissions: customJoi.array().items(
        customJoi.object({
          roleId: customJoi.string().pattern(/^[a-f\d]{24}$/i).required(),
          allow: customJoi.array().items(customJoi.string()).optional(),
          deny: customJoi.array().items(customJoi.string()).optional()
        })
      ).optional(),
      slowMode: customJoi.number().min(0).max(21600).optional(), // Max 6 hours
      userLimit: customJoi.number().min(0).max(99).optional(),
      bitrate: customJoi.number().min(8000).max(384000).optional(),
      videoQuality: customJoi.string().valid('auto', '720p', '1080p').optional()
    }),

    update: customJoi.object({
      name: customJoi.string().channelName().optional(),
      description: customJoi.string().max(1024).noXSS().optional(),
      position: customJoi.number().min(0).optional(),
      slowMode: customJoi.number().min(0).max(21600).optional(),
      isNSFW: customJoi.boolean().optional(),
      isPrivate: customJoi.boolean().optional(),
      permissions: customJoi.array().items(
        customJoi.object({
          roleId: customJoi.string().pattern(/^[a-f\d]{24}$/i).required(),
          allow: customJoi.array().items(customJoi.string()).optional(),
          deny: customJoi.array().items(customJoi.string()).optional()
        })
      ).optional()
    }),

    invite: customJoi.object({
      maxUses: customJoi.number().min(0).max(100).optional(),
      maxAge: customJoi.number().min(0).max(604800).optional(), // Max 7 days
      temporary: customJoi.boolean().optional(),
      unique: customJoi.boolean().optional()
    })
  },

  // Server schemas
  server: {
    create: customJoi.object({
      name: customJoi.string().serverName().required(),
      description: customJoi.string().max(1024).noXSS().optional(),
      icon: customJoi.string().uri().optional(),
      banner: customJoi.string().uri().optional(),
      isPublic: customJoi.boolean().optional(),
      verificationLevel: customJoi.string()
        .valid('none', 'low', 'medium', 'high', 'highest')
        .optional(),
      defaultNotifications: customJoi.string()
        .valid('all', 'mentions')
        .optional(),
      explicitContentFilter: customJoi.string()
        .valid('disabled', 'no_role', 'all')
        .optional(),
      features: customJoi.array().items(customJoi.string()).optional(),
      systemChannelId: customJoi.string().pattern(/^[a-f\d]{24}$/i).optional(),
      rulesChannelId: customJoi.string().pattern(/^[a-f\d]{24}$/i).optional(),
      preferredLocale: customJoi.string().optional(),
      templateId: customJoi.string().pattern(/^[a-f\d]{24}$/i).optional()
    }),

    update: customJoi.object({
      name: customJoi.string().serverName().optional(),
      description: customJoi.string().max(1024).noXSS().optional(),
      icon: customJoi.string().uri().optional(),
      banner: customJoi.string().uri().optional(),
      isPublic: customJoi.boolean().optional(),
      verificationLevel: customJoi.string()
        .valid('none', 'low', 'medium', 'high', 'highest')
        .optional(),
      defaultNotifications: customJoi.string()
        .valid('all', 'mentions')
        .optional(),
      explicitContentFilter: customJoi.string()
        .valid('disabled', 'no_role', 'all')
        .optional()
    }),

    member: customJoi.object({
      userId: customJoi.string().pattern(/^[a-f\d]{24}$/i).required(),
      roles: customJoi.array()
        .items(customJoi.string().pattern(/^[a-f\d]{24}$/i))
        .optional(),
      nickname: customJoi.string().max(32).noXSS().optional(),
      mute: customJoi.boolean().optional(),
      deaf: customJoi.boolean().optional()
    }),

    ban: customJoi.object({
      userId: customJoi.string().pattern(/^[a-f\d]{24}$/i).required(),
      reason: customJoi.string().max(512).noXSS().optional(),
      deleteMessageDays: customJoi.number().min(0).max(7).optional()
    }),

    role: customJoi.object({
      name: customJoi.string().min(1).max(100).noXSS().required(),
      color: customJoi.number().min(0).max(16777215).optional(),
      hoist: customJoi.boolean().optional(),
      position: customJoi.number().min(0).optional(),
      permissions: customJoi.array().items(customJoi.string()).optional(),
      mentionable: customJoi.boolean().optional(),
      icon: customJoi.string().uri().optional(),
      unicodeEmoji: customJoi.string().max(100).optional()
    })
  },

  // File upload schemas
  file: {
    upload: customJoi.object({
      filename: customJoi.string().max(255).required(),
      mimetype: customJoi.string().required(),
      size: customJoi.number().max(100 * 1024 * 1024).required() // 100MB
    }),

    avatar: customJoi.object({
      mimetype: customJoi.string()
        .valid('image/jpeg', 'image/png', 'image/gif', 'image/webp')
        .required(),
      size: customJoi.number().max(8 * 1024 * 1024).required() // 8MB
    })
  },

  // Voice schemas
  voice: {
    join: customJoi.object({
      channelId: customJoi.string().pattern(/^[a-f\d]{24}$/i).required(),
      selfMute: customJoi.boolean().optional(),
      selfDeaf: customJoi.boolean().optional()
    }),

    state: customJoi.object({
      mute: customJoi.boolean().optional(),
      deaf: customJoi.boolean().optional(),
      selfMute: customJoi.boolean().optional(),
      selfDeaf: customJoi.boolean().optional(),
      video: customJoi.boolean().optional(),
      streaming: customJoi.boolean().optional()
    })
  },

  // Admin schemas
  admin: {
    userAction: customJoi.object({
      userId: customJoi.string().pattern(/^[a-f\d]{24}$/i).required(),
      action: customJoi.string()
        .valid('warn', 'mute', 'kick', 'ban', 'unban', 'verify', 'unverify')
        .required(),
      reason: customJoi.string().max(512).noXSS().optional(),
      duration: customJoi.number().min(0).optional(),
      deleteMessages: customJoi.boolean().optional()
    }),

    serverAction: customJoi.object({
      serverId: customJoi.string().pattern(/^[a-f\d]{24}$/i).required(),
      action: customJoi.string()
        .valid('feature', 'unfeature', 'verify', 'unverify', 'suspend', 'unsuspend')
        .required(),
      reason: customJoi.string().max(512).noXSS().optional()
    }),

    announcement: customJoi.object({
      title: customJoi.string().max(256).noXSS().required(),
      content: customJoi.string().max(4096).noXSS().required(),
      type: customJoi.string()
        .valid('info', 'warning', 'critical', 'maintenance')
        .required(),
      targetAudience: customJoi.string()
        .valid('all', 'server_owners', 'premium', 'specific')
        .required(),
      targetIds: customJoi.array()
        .items(customJoi.string().pattern(/^[a-f\d]{24}$/i))
        .when('targetAudience', {
          is: 'specific',
          then: customJoi.required()
        })
    })
  },

  // Webhook schemas
  webhook: {
    create: customJoi.object({
      name: customJoi.string().min(1).max(80).noXSS().required(),
      avatar: customJoi.string().uri().optional(),
      channelId: customJoi.string().pattern(/^[a-f\d]{24}$/i).required()
    }),

    execute: customJoi.object({
      content: customJoi.string().max(2000).optional(),
      username: customJoi.string().min(1).max(80).noXSS().optional(),
      avatarUrl: customJoi.string().uri().optional(),
      tts: customJoi.boolean().optional(),
      embeds: customJoi.array().items(
        customJoi.object({
          title: customJoi.string().max(256).optional(),
          description: customJoi.string().max(4096).optional(),
          url: customJoi.string().uri().optional(),
          color: customJoi.number().optional()
        })
      ).max(10).optional()
    })
  },

  // Query parameter schemas
  query: {
    pagination: customJoi.object({
      page: customJoi.number().min(1).default(1),
      limit: customJoi.number().min(1).max(100).default(20),
      sort: customJoi.string().optional(),
      order: customJoi.string().valid('asc', 'desc').default('desc')
    }),

    filter: customJoi.object({
      search: customJoi.string().max(100).noSQL().noXSS().optional(),
      startDate: customJoi.date().optional(),
      endDate: customJoi.date().min(customJoi.ref('startDate')).optional(),
      status: customJoi.string().optional(),
      type: customJoi.string().optional()
    })
  }
};

// Validation middleware factory
export const validate = (schema, options = {}) => { // <-- EXPORT `validate` directly
  return async (req, res, next) => {
    try {
      const {
        body = true,
        query = false,
        params = false,
        headers = false,
        files = false,
        sanitize = true,
        abortEarly = false,
        stripUnknown = true,
        context = {}
      } = options;

      const toValidate = {};

      // Collect data to validate
      if (body && req.body) toValidate.body = req.body;
      if (query && req.query) toValidate.query = req.query;
      if (params && req.params) toValidate.params = req.params;
      if (headers && req.headers) toValidate.headers = req.headers;
      if (files && req.files) toValidate.files = req.files;

      // Determine which schema to use
      let validationSchema;
      if (typeof schema === 'string') {
        const schemaParts = schema.split('.');
        validationSchema = schemaParts.reduce((acc, part) => {
          if (!acc || !acc[part]) { // Added safety check
              throw new Error(`Invalid schema path: ${schema} at part ${part}`);
          }
          return acc[part];
        }, schemas);
      } else if (typeof schema === 'object' && schema.isJoi) {
        validationSchema = schema;
      } else {
        validationSchema = customJoi.object(schema);
      }

      if (!validationSchema) {
        logger.error(`Validation schema not found: ${schema}`);
        return next(new Error('Validation schema not found'));
      }

      // Create a dynamic schema for `toValidate` based on what's being passed in.
      // This allows Joi to validate the structure of `toValidate` itself.
      const dynamicSchemaKeys = {};
      if (body) dynamicSchemaKeys.body = validationSchema; // If validating body, use the main schema
      if (query) dynamicSchemaKeys.query = schemas.query.pagination; // For queries, might apply generic pagination or a specific one
      if (params) dynamicSchemaKeys.params = customJoi.any(); // Params are often simple strings, validate individually or via specific schemas
      if (headers) dynamicSchemaKeys.headers = customJoi.any();
      if (files) dynamicSchemaKeys.files = customJoi.any();

      const finalSchema = customJoi.object(dynamicSchemaKeys).unknown(stripUnknown ? false : true); // Adjust unknown based on stripUnknown

      // Validate
      const { value, error } = await finalSchema.validateAsync(
        toValidate,
        {
          abortEarly,
          stripUnknown, // stripUnknown applies to the top-level object (toValidate) and its keys
          context: {
            ...context,
            requireCaptcha: req.session?.failedLoginAttempts > 3
          }
        }
      );

      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
          type: detail.type
        }));

        logger.warn('Validation failed:', {
          ip: req.ip,
          path: req.path,
          errors
        });

        return res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid input data',
          errors
        });
      }

      // Sanitize if enabled
      if (sanitize) {
        if (value.body) req.body = sanitizeData(value.body);
        if (value.query) req.query = sanitizeData(value.query);
        if (value.params) req.params = sanitizeData(value.params);
      } else {
        // If not sanitizing, still ensure validated data is used
        if (value.body) req.body = value.body;
        if (value.query) req.query = value.query;
        if (value.params) req.params = value.params;
      }

      // Store validated data
      req.validated = value;

      next();
    } catch (error) {
      logger.error('Validation middleware error:', error);

      if (error.isJoi) {
        const errors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
          type: detail.type
        }));

        return res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid input data',
          errors
        });
      }

      next(error);
    }
  };
};

// Sanitization function
export function sanitizeData(data) { // <-- EXPORT `sanitizeData`
  if (typeof data === 'string') {
    // Remove null bytes
    data = data.replace(/\0/g, '');

    // Trim whitespace
    data = data.trim();

    // Basic XSS prevention (more thorough sanitization should be context-specific)
    data = DOMPurify.sanitize(data, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    });
  } else if (Array.isArray(data)) {
    data = data.map(item => sanitizeData(item));
  } else if (data && typeof data === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      // Prevent prototype pollution
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }
      sanitized[key] = sanitizeData(value);
    }
    data = sanitized;
  }

  return data;
}

// File validation middleware
export const validateFile = (options = {}) => { // <-- EXPORT `validateFile`
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedMimeTypes = [],
    allowedExtensions = [],
    required = false
  } = options;

  return (req, res, next) => {
    // Handling req.files (express-fileupload or multer array) and req.file (multer single)
    const filesToValidate = [];
    if (req.files) {
        // For express-fileupload, req.files can be an object of arrays or a single object if only one field name
        // For multer, req.files is an object where keys are field names and values are arrays of files
        // Normalize to an array of file objects
        if (Array.isArray(req.files)) { // If req.files is already an array (e.g., from a specific multer setup)
            filesToValidate.push(...req.files);
        } else if (typeof req.files === 'object') {
            Object.values(req.files).forEach(fileEntry => {
                if (Array.isArray(fileEntry)) {
                    filesToValidate.push(...fileEntry);
                } else { // Single file for a field name
                    filesToValidate.push(fileEntry);
                }
            });
        }
    } else if (req.file) { // For single file upload (multer)
      filesToValidate.push(req.file);
    }

    if (filesToValidate.length === 0) {
      if (required) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'File is required'
        });
      }
      return next();
    }

    for (const file of filesToValidate) {
      // Check file size
      if (file.size > maxSize) {
        return res.status(400).json({
          error: 'Validation Error',
          message: `File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`
        });
      }

      // Check MIME type
      if (allowedMimeTypes.length > 0 && !allowedMimeTypes.includes(file.mimetype)) {
        return res.status(400).json({
          error: 'Validation Error',
          message: `File type ${file.mimetype} is not allowed. Allowed types: ${allowedMimeTypes.join(', ')}`
        });
      }

      // Check extension (ensure file.name exists if using busboy/formidable or similar)
      const fileName = file.originalname || file.name; // 'originalname' is common in Multer, 'name' in others
      if (allowedExtensions.length > 0 && fileName) {
        const ext = fileName.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(ext)) {
          return res.status(400).json({
            error: 'Validation Error',
            message: `File extension .${ext} is not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`
          });
        }
      }

      // Basic content sniffing for images
      if (file.mimetype.startsWith('image/')) {
        // Here you might integrate a more robust library like 'image-size' or 'file-type'
        // to verify the actual file content matches the declared MIME type.
        // For now, this is a placeholder.
      }
    }

    next();
  };
};

// Dynamic validation based on user role
export const validateWithRole = (schemaMap) => { // <-- EXPORT `validateWithRole`
  return async (req, res, next) => {
    const userRole = req.user?.role || 'guest';
    const schema = schemaMap[userRole] || schemaMap.default;

    if (!schema) {
      return next(new Error('No validation schema for user role'));
    }

    // Call the main validate middleware with the determined schema
    return validate(schema)(req, res, next);
  };
};

// Validation error handler
export const handleValidationError = (err, req, res, next) => { // <-- EXPORT `handleValidationError`
  if (err.isJoi || err.name === 'ValidationError') {
    const errors = err.details ? err.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
      type: detail.type
    })) : [{ message: err.message }];

    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid input data',
      errors
    });
  }
  next(err);
};

// Export `schemas` object and `customJoi` directly
export { schemas, customJoi }; // <-- EXPORT `schemas` and `customJoi`

// Convenience methods for common validations
export const validateAuth = { // <-- EXPORT `validateAuth` object
  register: validate('auth.register'),
  login: validate('auth.login', { context: { requireCaptcha: true } }), // Ensure context for captcha
  forgotPassword: validate('auth.forgotPassword'),
  resetPassword: validate('auth.resetPassword'),
  twoFactor: validate('auth.twoFactor')
};

export const validateMessage = { // <-- EXPORT `validateMessage` object
  create: validate('message.create'),
  update: validate('message.update'),
  delete: validate('message.delete'),
  reaction: validate('message.reaction'),
  search: validate('message.search', { body: false, query: true })
};

export const validateChannel = { // <-- EXPORT `validateChannel` object
  create: validate('channel.create'),
  update: validate('channel.update'),
  invite: validate('channel.invite')
};

export const validateServer = { // <-- EXPORT `validateServer` object
  create: validate('server.create'),
  update: validate('server.update'),
  member: validate('server.member'),
  ban: validate('server.ban'),
  role: validate('server.role')
};

export const validateUser = { // <-- EXPORT `validateUser` object
  updateProfile: validate('user.updateProfile'),
  updateSettings: validate('user.updateSettings'),
  search: validate('user.search', { body: false, query: true })
};

export const validateAdmin = { // <-- EXPORT `validateAdmin` object
  userAction: validate('admin.userAction'),
  serverAction: validate('admin.serverAction'),
  announcement: validate('admin.announcement')
};

export const validateWebhook = { // <-- EXPORT `validateWebhook` object
  create: validate('webhook.create'),
  execute: validate('webhook.execute')
};

// Common query validations
export const validatePagination = validate('query.pagination', { body: false, query: true }); // <-- EXPORT
export const validateFilter = validate('query.filter', { body: false, query: true }); // <-- EXPORT

// File validations
export const validateAvatar = validateFile({ // <-- EXPORT
  maxSize: 8 * 1024 * 1024, // 8MB
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  allowedExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp']
});

export const validateAttachment = validateFile({ // <-- EXPORT
  maxSize: 100 * 1024 * 1024, // 100MB
  allowedMimeTypes: [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/webm',
    'audio/mpeg', 'audio/ogg', 'audio/wav',
    'application/pdf', 'application/zip',
    'text/plain', 'text/html', 'text/css', 'text/javascript'
  ],
  allowedExtensions: [ // Good to add these for clarity and double-checking
    'jpg', 'jpeg', 'png', 'gif', 'webp',
    'mp4', 'webm',
    'mp3', 'ogg', 'wav',
    'pdf', 'zip',
    'txt', 'html', 'css', 'js'
  ]
});

// Individual middleware exports for registration, login, and profile update
// These are redundant if you export validateAuth, validateUser etc., but can be kept for direct access
export const validateRegistration = validate('auth.register');
export const validateLogin = validate('auth.login', { context: { requireCaptcha: true } }); // Pass context for captcha
export const validateUpdateProfile = validate('user.updateProfile');