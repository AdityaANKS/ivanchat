// Custom helpers using config
import config from '../config/env';
export const formatMessage = (message) => {
  if (config.app.isDevelopment) {
    console.log('Formatting message:', message);
  }
  return {
    ...message,
    timestamp: new Date().toISOString(),
    appVersion: config.app.version,
  };
};

export const getMaxUploadSize = () => {
  return config.upload.maxFileSize;
};

export const isFeatureEnabled = (feature) => {
  return config.features[feature] === true;
};
import { format, formatDistance, formatRelative, isToday, isYesterday, parseISO } from 'date-fns';
import { ERROR_CODES, STATUS_COLORS, USER_STATUS, DATE_FORMATS } from './constants';

// Format date/time
export const formatDate = (date, formatType = DATE_FORMATS.SHORT) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (formatType === 'relative') {
    return formatDistance(dateObj, new Date(), { addSuffix: true });
  }
  
  if (isToday(dateObj)) {
    return `Today at ${format(dateObj, 'HH:mm')}`;
  }
  
  if (isYesterday(dateObj)) {
    return `Yesterday at ${format(dateObj, 'HH:mm')}`;
  }
  
  return format(dateObj, formatType);
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format number with commas
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Generate unique ID
export const generateId = (prefix = '') => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substr(2, 9);
  return prefix ? `${prefix}_${timestamp}_${randomStr}` : `${timestamp}_${randomStr}`;
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

// Deep clone object
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof RegExp) return new RegExp(obj);
  
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  
  return cloned;
};

// Merge objects deeply
export const deepMerge = (target, ...sources) => {
  if (!sources.length) return target;
  
  const source = sources.shift();
  
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  
  return deepMerge(target, ...sources);
};

// Check if object
export const isObject = (item) => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '';
  
  const parts = name.trim().split(/\s+/);
  
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  
  return parts
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();
};

// Get avatar URL
export const getAvatarUrl = (user) => {
  if (user?.avatar) {
    if (user.avatar.startsWith('http')) {
      return user.avatar;
    }
    return `${CDN_URL}/avatars/${user.id}/${user.avatar}`;
  }
  
  // Generate default avatar
  const initials = getInitials(user?.username || 'U');
  return `https://ui-avatars.com/api/?name=${initials}&background=5865F2&color=fff`;
};

// Parse mentions in text
export const parseMentions = (text) => {
  const mentions = {
    users: [],
    channels: [],
    roles: [],
    everyone: false
  };
  
  // Parse user mentions
  const userMatches = text.match(/<@!?(\d+)>/g);
  if (userMatches) {
    mentions.users = userMatches.map(match => match.replace(/<@!?|>/g, ''));
  }
  
  // Parse channel mentions
  const channelMatches = text.match(/<#(\d+)>/g);
  if (channelMatches) {
    mentions.channels = channelMatches.map(match => match.replace(/<#|>/g, ''));
  }
  
  // Parse role mentions
  const roleMatches = text.match(/<@&(\d+)>/g);
  if (roleMatches) {
    mentions.roles = roleMatches.map(match => match.replace(/<@&|>/g, ''));
  }
  
  // Check for @everyone
  mentions.everyone = text.includes('@everyone');
  
  return mentions;
};

// Format message content with mentions
export const formatMessageContent = (content, mentions = {}) => {
  let formatted = content;
  
  // Replace user mentions
  if (mentions.users) {
    mentions.users.forEach(user => {
      const regex = new RegExp(`<@!?${user.id}>`, 'g');
      formatted = formatted.replace(regex, `@${user.username}`);
    });
  }
  
  // Replace channel mentions
  if (mentions.channels) {
    mentions.channels.forEach(channel => {
      const regex = new RegExp(`<#${channel.id}>`, 'g');
      formatted = formatted.replace(regex, `#${channel.name}`);
    });
  }
  
  return formatted;
};

// Get status color
export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || STATUS_COLORS[USER_STATUS.OFFLINE];
};

// Calculate read time
export const calculateReadTime = (text) => {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
};

// Truncate text
export const truncateText = (text, maxLength, suffix = '...') => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength - suffix.length) + suffix;
};

// Escape HTML
export const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, m => map[m]);
};

// Parse URLs in text
export const parseUrls = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
};

// Get file extension
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

// Get file icon based on type
export const getFileIcon = (mimeType) => {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType.startsWith('video/')) return '🎥';
  if (mimeType.startsWith('audio/')) return '🎵';
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('zip') || mimeType.includes('rar')) return '📦';
  if (mimeType.includes('text')) return '📝';
  return '📎';
};

// Check if URL is image
export const isImageUrl = (url) => {
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
};

// Check if URL is video
export const isVideoUrl = (url) => {
  return /\.(mp4|webm|ogg|mov)$/i.test(url);
};

// Get contrast color
export const getContrastColor = (hexColor) => {
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq >= 128 ? '#000000' : '#FFFFFF';
};

// Convert hex to RGB
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// Convert RGB to hex
export const rgbToHex = (r, g, b) => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

// Generate random color
export const generateRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};

// Calculate XP for next level
export const calculateXPForLevel = (level) => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

// Calculate level from XP
export const calculateLevelFromXP = (xp) => {
  let level = 1;
  let required = 100;
  
  while (xp >= required) {
    xp -= required;
    level++;
    required = calculateXPForLevel(level);
  }
  
  return { level, currentXP: xp, requiredXP: required };
};

// Get permission name
export const getPermissionName = (permission) => {
  return permission
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Check if user has permission
export const hasPermission = (userPermissions, requiredPermission) => {
  if (!userPermissions) return false;
  if (userPermissions.includes('administrator')) return true;
  return userPermissions.includes(requiredPermission);
};

// Sort by property
export const sortBy = (array, property, order = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = getNestedProperty(a, property);
    const bVal = getNestedProperty(b, property);
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

// Get nested property
export const getNestedProperty = (obj, path) => {
  return path.split('.').reduce((current, prop) => current?.[prop], obj);
};

// Group by property
export const groupBy = (array, property) => {
  return array.reduce((groups, item) => {
    const key = getNestedProperty(item, property);
    
    if (!groups[key]) {
      groups[key] = [];
    }
    
    groups[key].push(item);
    return groups;
  }, {});
};

// Filter unique values
export const unique = (array, property = null) => {
  if (!property) {
    return [...new Set(array)];
  }
  
  const seen = new Set();
  return array.filter(item => {
    const key = getNestedProperty(item, property);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

// Chunk array
export const chunk = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// Flatten array
export const flatten = (array, depth = 1) => {
  return depth > 0
    ? array.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatten(val, depth - 1) : val), [])
    : array.slice();
};

// Get error message
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  if (error.code && ERROR_CODES[error.code]) {
    return ERROR_CODES[error.code];
  }
  
  return 'An unexpected error occurred';
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

// Download file
export const downloadFile = (data, filename, mimeType = 'application/octet-stream') => {
  const blob = new Blob([data], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Get browser info
export const getBrowserInfo = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('chrome')) return 'Chrome';
  if (userAgent.includes('firefox')) return 'Firefox';
  if (userAgent.includes('safari')) return 'Safari';
  if (userAgent.includes('edge')) return 'Edge';
  if (userAgent.includes('opera')) return 'Opera';
  
  return 'Unknown';
};

// Get OS info
export const getOSInfo = () => {
  const platform = navigator.platform.toLowerCase();
  
  if (platform.includes('win')) return 'Windows';
  if (platform.includes('mac')) return 'macOS';
  if (platform.includes('linux')) return 'Linux';
  if (platform.includes('android')) return 'Android';
  if (platform.includes('ios')) return 'iOS';
  
  return 'Unknown';
};

// Check if mobile device
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Check if dark mode
export const isDarkMode = () => {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
};

// Show notification
export const showNotification = (title, options = {}) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/logo.png',
      badge: '/badge.png',
      ...options
    });
  }
};

// Export all helpers
export default {
  formatDate,
  formatFileSize,
  formatNumber,
  generateId,
  debounce,
  throttle,
  deepClone,
  deepMerge,
  getInitials,
  getAvatarUrl,
  parseMentions,
  formatMessageContent,
  getStatusColor,
  truncateText,
  escapeHtml,
  parseUrls,
  getFileIcon,
  isImageUrl,
  isVideoUrl,
  getContrastColor,
  hexToRgb,
  rgbToHex,
  generateRandomColor,
  calculateXPForLevel,
  calculateLevelFromXP,
  hasPermission,
  sortBy,
  groupBy,
  unique,
  chunk,
  flatten,
  getErrorMessage,
  copyToClipboard,
  downloadFile,
  getBrowserInfo,
  getOSInfo,
  isMobileDevice,
  isDarkMode,
  requestNotificationPermission,
  showNotification
};