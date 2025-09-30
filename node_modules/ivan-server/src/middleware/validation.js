import Joi from 'joi';

// Validation schemas
const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    rememberMe: Joi.boolean(),
    twoFactorCode: Joi.string().length(6),
  }),

  message: Joi.object({
    content: Joi.string().max(2000).required(),
    attachments: Joi.array().items(Joi.object({
      url: Joi.string().uri(),
      filename: Joi.string(),
      size: Joi.number(),
      mimeType: Joi.string(),
    })),
    replyTo: Joi.string().hex().length(24),
  }),

  channel: Joi.object({
    name: Joi.string().min(1).max(100).required(),
    type: Joi.string().valid('text', 'voice', 'video', 'announcement'),
    topic: Joi.string().max(1024),
    isPrivate: Joi.boolean(),
    slowMode: Joi.number().min(0).max(21600),
  }),

  server: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(1000),
    icon: Joi.string().uri(),
    isPublic: Joi.boolean(),
  }),

  fileUpload: Joi.object({
    filename: Joi.string().required(),
    contentType: Joi.string().required(),
    bucket: Joi.string().valid('uploads', 'avatars', 'attachments'),
  }),
};

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
      });
    }

    req.body = value;
    next();
  };
};

// Export validation middleware
export const validateRegistration = validate(schemas.register);
export const validateLogin = validate(schemas.login);
export const validateMessage = validate(schemas.message);
export const validateChannel = validate(schemas.channel);
export const validateServer = validate(schemas.server);
export const validateFileUpload = validate(schemas.fileUpload);

// Custom validators
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
  return usernameRegex.test(username);
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

export const validateObjectId = (id) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Remove script tags content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Escape special characters
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
  
  return sanitized;
};