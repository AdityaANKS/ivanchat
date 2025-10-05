// shared/src/utils/validation.ts
import Joi from 'joi';
import validator from 'validator';

/**
 * Username validation rules
 */
export const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,32}$/;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 32;

/**
 * Password validation rules
 */
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

/**
 * Message validation rules
 */
export const MESSAGE_MAX_LENGTH = 4000;
export const MESSAGE_MIN_LENGTH = 1;
export const EMBED_MAX_LENGTH = 6000;
export const EMBED_FIELD_MAX = 25;

/**
 * Channel/Server name validation rules
 */
export const CHANNEL_NAME_REGEX = /^[a-zA-Z0-9-_]{2,100}$/;
export const SERVER_NAME_MIN_LENGTH = 2;
export const SERVER_NAME_MAX_LENGTH = 100;

/**
 * File validation rules
 */
export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
export const MAX_FILE_SIZE_FREE = 25 * 1024 * 1024; // 25MB
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/webm',
  'audio/mpeg',
  'audio/ogg',
  'audio/wav',
  'application/pdf',
  'application/zip',
  'text/plain',
  'text/markdown',
];

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
];

export const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/ogg',
  'audio/wav',
  'audio/webm',
];

/**
 * Validation schemas
 */
export const schemas = {
  // User schemas
  register: Joi.object({
    username: Joi.string()
      .pattern(USERNAME_REGEX)
      .min(USERNAME_MIN_LENGTH)
      .max(USERNAME_MAX_LENGTH)
      .required()
      .messages({
        'string.pattern.base': 'Username can only contain letters, numbers, underscores, and hyphens',
        'string.min': `Username must be at least ${USERNAME_MIN_LENGTH} characters`,
        'string.max': `Username cannot exceed ${USERNAME_MAX_LENGTH} characters`,
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
      }),
    password: Joi.string()
      .min(PASSWORD_MIN_LENGTH)
      .max(PASSWORD_MAX_LENGTH)
      .pattern(PASSWORD_REGEX)
      .required()
      .messages({
        'string.min': `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
        'string.max': `Password cannot exceed ${PASSWORD_MAX_LENGTH} characters`,
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      }),
    displayName: Joi.string()
      .min(1)
      .max(32)
      .optional(),
    acceptTerms: Joi.boolean()
      .valid(true)
      .required()
      .messages({
        'any.only': 'You must accept the terms and conditions',
      }),
  }),

  login: Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .required(),
    rememberMe: Joi.boolean()
      .optional(),
    captchaToken: Joi.string()
      .optional(),
  }),

  updateProfile: Joi.object({
    displayName: Joi.string()
      .min(1)
      .max(32)
      .optional(),
    bio: Joi.string()
      .max(190)
      .allow('')
      .optional(),
    pronouns: Joi.string()
      .max(40)
      .optional(),
    location: Joi.string()
      .max(50)
      .optional(),
    website: Joi.string()
      .uri()
      .optional(),
  }),

  // Message schemas
  sendMessage: Joi.object({
    content: Joi.string()
      .min(MESSAGE_MIN_LENGTH)
      .max(MESSAGE_MAX_LENGTH)
      .required()
      .messages({
        'string.min': 'Message cannot be empty',
        'string.max': `Message cannot exceed ${MESSAGE_MAX_LENGTH} characters`,
      }),
    channelId: Joi.string()
      .required(),
    attachments: Joi.array()
      .items(Joi.string())
      .max(10)
      .optional(),
    embeds: Joi.array()
      .max(10)
      .optional(),
    replyTo: Joi.string()
      .optional(),
    mentions: Joi.array()
      .items(Joi.string())
      .optional(),
    ephemeral: Joi.boolean()
      .optional(),
  }),

  // Channel schemas
  createChannel: Joi.object({
    name: Joi.string()
      .pattern(CHANNEL_NAME_REGEX)
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.pattern.base': 'Channel name can only contain letters, numbers, hyphens, and underscores',
      }),
    type: Joi.number()
      .valid(0, 2, 4, 5, 13, 15, 16)
      .required(),
    topic: Joi.string()
      .max(1024)
      .optional(),
    nsfw: Joi.boolean()
      .optional(),
    parentId: Joi.string()
      .optional(),
    position: Joi.number()
      .optional(),
    rateLimitPerUser: Joi.number()
      .min(0)
      .max(21600)
      .optional(),
    bitrate: Joi.number()
      .min(8000)
      .max(384000)
      .optional(),
    userLimit: Joi.number()
      .min(0)
      .max(99)
      .optional(),
  }),

  // Server schemas
  createServer: Joi.object({
    name: Joi.string()
      .min(SERVER_NAME_MIN_LENGTH)
      .max(SERVER_NAME_MAX_LENGTH)
      .required(),
    description: Joi.string()
      .max(300)
      .optional(),
    icon: Joi.string()
      .optional(),
    template: Joi.string()
      .optional(),
  }),

  // Search schemas
  searchMessages: Joi.object({
    content: Joi.string()
      .optional(),
    author: Joi.string()
      .optional(),
    channelId: Joi.string()
      .optional(),
    serverId: Joi.string()
      .optional(),
    has: Joi.array()
      .items(Joi.string().valid('link', 'embed', 'file', 'video', 'image', 'sound'))
      .optional(),
    limit: Joi.number()
      .min(1)
      .max(100)
      .default(25),
    offset: Joi.number()
      .min(0)
      .default(0),
  }),
};

/**
 * Validation functions
 */
export const validate = {
  /**
   * Validate email address
   */
  email(email: string): boolean {
    return validator.isEmail(email);
  },

  /**
   * Validate username
   */
  username(username: string): boolean {
    return USERNAME_REGEX.test(username);
  },

  /**
   * Validate password strength
   */
  password(password: string): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < PASSWORD_MIN_LENGTH) {
      errors.push(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`);
    }

    if (password.length > PASSWORD_MAX_LENGTH) {
      errors.push(`Password cannot exceed ${PASSWORD_MAX_LENGTH} characters`);
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[@$!%*?&]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate URL
   */
  url(url: string): boolean {
    return validator.isURL(url, {
      protocols: ['http', 'https'],
      require_protocol: true,
    });
  },

  /**
   * Validate UUID
   */
  uuid(uuid: string): boolean {
    return validator.isUUID(uuid);
  },

  /**
   * Validate phone number
   */
  phoneNumber(phone: string): boolean {
    return validator.isMobilePhone(phone);
  },

  /**
   * Validate IP address
   */
  ipAddress(ip: string): boolean {
    return validator.isIP(ip);
  },

  /**
   * Validate JWT token
   */
  jwt(token: string): boolean {
    return validator.isJWT(token);
  },

  /**
   * Validate file type
   */
  fileType(mimeType: string, category?: 'image' | 'video' | 'audio'): boolean {
    if (category === 'image') {
      return ALLOWED_IMAGE_TYPES.includes(mimeType);
    }
    if (category === 'video') {
      return ALLOWED_VIDEO_TYPES.includes(mimeType);
    }
    if (category === 'audio') {
      return ALLOWED_AUDIO_TYPES.includes(mimeType);
    }
    return ALLOWED_FILE_TYPES.includes(mimeType);
  },

  /**
   * Validate file size
   */
  fileSize(size: number, isPremium: boolean = false): boolean {
    const maxSize = isPremium ? MAX_FILE_SIZE : MAX_FILE_SIZE_FREE;
    return size <= maxSize;
  },

  /**
   * Validate hex color
   */
  hexColor(color: string): boolean {
    return validator.isHexColor(color);
  },

  /**
   * Validate message content
   */
  messageContent(content: string): {
    valid: boolean;
    error?: string;
  } {
    if (content.length < MESSAGE_MIN_LENGTH) {
      return { valid: false, error: 'Message cannot be empty' };
    }

    if (content.length > MESSAGE_MAX_LENGTH) {
      return { valid: false, error: `Message cannot exceed ${MESSAGE_MAX_LENGTH} characters` };
    }

    // Check for spam patterns
    const spamPatterns = [
      /(.)\1{20,}/, // Same character repeated 20+ times
      /(.)(\1\s*){15,}/, // Same character with spaces repeated 15+ times
    ];

    for (const pattern of spamPatterns) {
      if (pattern.test(content)) {
        return { valid: false, error: 'Message appears to be spam' };
      }
    }

    return { valid: true };
  },

  /**
   * Validate snowflake ID (Discord-like ID)
   */
  snowflake(id: string): boolean {
    // Snowflake IDs are 64-bit integers as strings
    if (!/^\d{17,19}$/.test(id)) {
      return false;
    }

    const timestamp = (BigInt(id) >> BigInt(22)) + BigInt(1420070400000);
    const date = new Date(Number(timestamp));

    // Check if the date is reasonable (between 2015 and 2050)
    return date.getFullYear() >= 2015 && date.getFullYear() <= 2050;
  },

  /**
   * Validate invite code
   */
  inviteCode(code: string): boolean {
    // Invite codes are typically 6-10 alphanumeric characters
    return /^[a-zA-Z0-9]{6,10}$/.test(code);
  },

  /**
   * Validate emoji
   */
  emoji(emoji: string): boolean {
    // Check for standard emoji or custom emoji format
    const standardEmojiRegex = /^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])+$/;
    const customEmojiRegex = /^<(a)?:(\w+):(\d{17,19})>$/;
    
    return standardEmojiRegex.test(emoji) || customEmojiRegex.test(emoji);
  },
};

/**
 * Sanitization functions
 */
export const sanitize = {
  /**
   * Sanitize HTML content
   */
  html(input: string): string {
    return validator.escape(input);
  },

  /**
   * Sanitize username
   */
  username(username: string): string {
    return username
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '');
  },

  /**
   * Sanitize channel name
   */
  channelName(name: string): string {
    return name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-_]/g, '');
  },

  /**
   * Sanitize filename
   */
  filename(name: string): string {
    return name
      .replace(/[^a-z0-9.-_]/gi, '_')
      .replace(/_{2,}/g, '_')
      .substring(0, 255);
  },

  /**
   * Sanitize search query
   */
  searchQuery(query: string): string {
    return query
      .trim()
      .replace(/[^\w\s-]/g, '')
      .substring(0, 100);
  },

  /**
   * Remove markdown
   */
  removeMarkdown(text: string): string {
    return text
      .replace(/(\*{1,2}|_{1,2}|~{2}|\|{2})/g, '') // Bold, italic, strikethrough, spoiler
      .replace(/`{1,3}[^`]*`{1,3}/g, '') // Code blocks
      .replace(/^> .*/gm, '') // Quotes
      .replace(/!```math/g, '') // Remove invalid math blocks
      .replace(/```math.*?```/gs, '') // Remove math blocks
      .replace(/^#{1,6} /gm, ''); // Headers
  },
};

/**
 * Format validation errors for response
 */
export function formatValidationErrors(error: Joi.ValidationError): Record<string, string> {
  const errors: Record<string, string> = {};
  
  error.details.forEach((detail) => {
    const key = detail.path.join('.');
    errors[key] = detail.message;
  });
  
  return errors;
}

/**
 * Check if string contains profanity
 */
export function containsProfanity(text: string): boolean {
  // This is a simple example - in production, use a proper profanity filter library
  const profanityList = [
    // Add profanity words here
  ];
  
  const lowercaseText = text.toLowerCase();
  return profanityList.some(word => lowercaseText.includes(word));
}

/**
 * Validate permissions
 */
export function hasRequiredPermissions(
  userPermissions: bigint,
  requiredPermissions: bigint
): boolean {
  return (userPermissions & requiredPermissions) === requiredPermissions;
}