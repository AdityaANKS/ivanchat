import { CONSTANTS } from '../config/constants.js';

export const isValidEmail = (email) => {
  return CONSTANTS.PATTERNS.EMAIL.test(email);
};

export const isValidUsername = (username) => {
  return CONSTANTS.PATTERNS.USERNAME.test(username);
};

export const isValidChannelName = (name) => {
  return CONSTANTS.PATTERNS.CHANNEL_NAME.test(name);
};

export const isValidHexColor = (color) => {
  return CONSTANTS.PATTERNS.HEX_COLOR.test(color);
};

export const isValidUrl = (url) => {
  return CONSTANTS.PATTERNS.URL.test(url);
};

export const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

export const sanitizeUsername = (username) => {
  return username
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')
    .substring(0, CONSTANTS.MAX_USERNAME_LENGTH);
};

export const sanitizeChannelName = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, CONSTANTS.MAX_CHANNEL_NAME_LENGTH);
};

export const extractMentions = (text) => {
  const mentions = [];
  let match;
  
  while ((match = CONSTANTS.PATTERNS.MENTION.exec(text)) !== null) {
    mentions.push(match[1]);
  }
  
  return mentions;
};

export const extractChannelMentions = (text) => {
  const channels = [];
  let match;
  
  while ((match = CONSTANTS.PATTERNS.CHANNEL_MENTION.exec(text)) !== null) {
    channels.push(match[1]);
  }
  
  return channels;
};

export const extractEmojis = (text) => {
  const emojis = [];
  let match;
  
  while ((match = CONSTANTS.PATTERNS.EMOJI.exec(text)) !== null) {
    emojis.push(match[0]);
  }
  
  return emojis;
};

export const validateFileType = (mimetype, allowedTypes) => {
  return allowedTypes.some(type => {
    if (type === '*/*') return true;
    if (type.endsWith('/*')) {
      const category = type.split('/')[0];
      return mimetype.startsWith(category + '/');
    }
    return mimetype === type;
  });
};

export const validateFileSize = (size, maxSize) => {
  return size <= maxSize;
};