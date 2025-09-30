import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Generate unique username
export async function generateUsername(base) {
  const User = (await import('../models/User.js')).default;
  
  let username = base.toLowerCase().replace(/[^a-z0-9_]/g, '');
  let suffix = '';
  let attempts = 0;

  while (attempts < 10) {
    const testUsername = username + suffix;
    const exists = await User.findOne({ username: testUsername });
    
    if (!exists) {
      return testUsername;
    }

    suffix = Math.floor(Math.random() * 10000).toString();
    attempts++;
  }

  // Fallback to random username
  return `user_${crypto.randomBytes(8).toString('hex')}`;
}

// Generate invite code
export function generateInviteCode(length = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let code = '';
  
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return code;
}

// Generate random token
export function generateToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// Hash password
export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

// Compare password
export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// Format file size
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Parse duration string
export function parseDuration(duration) {
  const units = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    w: 7 * 24 * 60 * 60 * 1000,
  };

  const regex = /^(\d+)([smhdw])$/;
  const match = duration.match(regex);
  
  if (!match) return null;
  
  const [, amount, unit] = match;
  return parseInt(amount) * units[unit];
}

// Sanitize filename
export function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-z0-9.-]/gi, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
}

// Get file extension
export function getFileExtension(filename) {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
}

// Check if valid email
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Check if valid URL
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Paginate results
export function paginate(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  return { skip, limit: parseInt(limit) };
}

// Sleep function
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Retry function
export async function retry(fn, maxAttempts = 3, delay = 1000) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxAttempts - 1) throw error;
      await sleep(delay * Math.pow(2, i)); // Exponential backoff
    }
  }
}

// Chunk array
export function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// Deep merge objects
export function deepMerge(target, source) {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }
  
  return output;
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

// Rate limit key generator
export function getRateLimitKey(identifier, action) {
  return `ratelimit:${identifier}:${action}:${Date.now()}`;
}

// Calculate percentage
export function calculatePercentage(value, total) {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

// Format date
export function formatDate(date, format = 'short') {
  const d = new Date(date);
  
  if (format === 'short') {
    return d.toLocaleDateString();
  } else if (format === 'long') {
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } else if (format === 'relative') {
    return getRelativeTime(d);
  }
  
  return d.toISOString();
}

// Get relative time
export function getRelativeTime(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
}