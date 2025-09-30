/**
 * Client-side validation utilities
 * Comprehensive input validation and sanitization
 */

import DOMPurify from 'dompurify';
import validator from 'validator';

/**
 * Email validation with comprehensive checks
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' };
  }

  const trimmedEmail = email.trim().toLowerCase();
  
  // Check basic format
  if (!validator.isEmail(trimmedEmail, {
    allow_display_name: false,
    require_display_name: false,
    allow_utf8_local_part: true,
    require_tld: true,
    allow_ip_domain: false,
    domain_specific_validation: true,
    blacklisted_chars: ' '
  })) {
    return { isValid: false, error: 'Invalid email format' };
  }

  // Check for disposable email domains
  const disposableDomains = [
    'tempmail.com', 'throwaway.email', '10minutemail.com',
    'guerrillamail.com', 'mailinator.com', 'maildrop.cc'
  ];
  
  const domain = trimmedEmail.split('@')[1];
  if (disposableDomains.includes(domain)) {
    return { isValid: false, error: 'Disposable email addresses not allowed' };
  }

  // Check length
  if (trimmedEmail.length > 254) {
    return { isValid: false, error: 'Email too long (max 254 characters)' };
  }

  return { 
    isValid: true, 
    normalized: validator.normalizeEmail(trimmedEmail, {
      all_lowercase: true,
      gmail_remove_dots: true,
      gmail_remove_subaddress: false,
      gmail_convert_googlemaildotcom: true,
      outlookdotcom_remove_subaddress: false,
      yahoo_remove_subaddress: false,
      icloud_remove_subaddress: false
    })
  };
};

/**
 * Advanced password validation with entropy calculation
 */
export const validatePassword = (password, options = {}) => {
  const config = {
    minLength: options.minLength || 8,
    maxLength: options.maxLength || 128,
    requireUppercase: options.requireUppercase !== false,
    requireLowercase: options.requireLowercase !== false,
    requireNumbers: options.requireNumbers !== false,
    requireSpecialChars: options.requireSpecialChars !== false,
    preventCommon: options.preventCommon !== false,
    preventSequential: options.preventSequential !== false,
    preventRepeating: options.preventRepeating !== false,
    preventUserInfo: options.preventUserInfo !== false,
    userInfo: options.userInfo || {}
  };

  const errors = [];
  const warnings = [];
  
  // Basic checks
  if (!password) {
    return { isValid: false, errors: ['Password is required'], score: 0 };
  }

  if (password.length < config.minLength) {
    errors.push(`Password must be at least ${config.minLength} characters`);
  }

  if (password.length > config.maxLength) {
    errors.push(`Password must not exceed ${config.maxLength} characters`);
  }

  // Character type requirements
  const checks = {
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    spaces: /\s/.test(password)
  };

  if (config.requireUppercase && !checks.uppercase) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (config.requireLowercase && !checks.lowercase) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (config.requireNumbers && !checks.numbers) {
    errors.push('Password must contain at least one number');
  }

  if (config.requireSpecialChars && !checks.special) {
    errors.push('Password must contain at least one special character');
  }

  if (checks.spaces) {
    errors.push('Password cannot contain spaces');
  }

  // Common password check
  if (config.preventCommon) {
    const commonPasswords = [
      'password', '123456', 'password123', 'admin', 'letmein',
      'qwerty', 'monkey', '1234567890', 'dragon', 'master',
      'password1', 'qwerty123', 'welcome', 'login', 'passw0rd'
    ];
    
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('This password is too common');
    }
  }

  // Sequential characters check
  if (config.preventSequential) {
    const sequential = /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i;
    if (sequential.test(password)) {
      warnings.push('Password contains sequential characters');
    }
  }

  // Repeating characters check
  if (config.preventRepeating) {
    const repeating = /(.)\1{2,}/;
    if (repeating.test(password)) {
      warnings.push('Password contains repeating characters');
    }
  }

  // User info check
  if (config.preventUserInfo && config.userInfo) {
    const userInfoLower = Object.values(config.userInfo)
      .filter(v => v && typeof v === 'string')
      .map(v => v.toLowerCase());
    
    const passwordLower = password.toLowerCase();
    for (const info of userInfoLower) {
      if (info && passwordLower.includes(info)) {
        errors.push('Password should not contain personal information');
        break;
      }
    }
  }

  // Calculate entropy
  const entropy = calculatePasswordEntropy(password);
  
  // Calculate score
  const score = calculatePasswordScore(password, checks, entropy);

  // Determine strength
  let strength = 'weak';
  if (score >= 80) strength = 'very strong';
  else if (score >= 60) strength = 'strong';
  else if (score >= 40) strength = 'moderate';
  else if (score >= 20) strength = 'weak';
  else strength = 'very weak';

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score,
    strength,
    entropy: Math.round(entropy),
    checks,
    estimatedCrackTime: estimateCrackTime(entropy)
  };
};

/**
 * Calculate password entropy
 */
const calculatePasswordEntropy = (password) => {
  let charsetSize = 0;
  
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/\d/.test(password)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;
  
  return password.length * Math.log2(charsetSize);
};

/**
 * Calculate password score
 */
const calculatePasswordScore = (password, checks, entropy) => {
  let score = 0;
  
  // Length score (max 30 points)
  score += Math.min(password.length * 2, 30);
  
  // Character variety (max 40 points)
  if (checks.uppercase) score += 10;
  if (checks.lowercase) score += 10;
  if (checks.numbers) score += 10;
  if (checks.special) score += 10;
  
  // Entropy score (max 30 points)
  score += Math.min(entropy / 3, 30);
  
  // Deductions
  if (/^[a-zA-Z]+$/.test(password)) score -= 10;
  if (/^[0-9]+$/.test(password)) score -= 10;
  if (/(.)\1{2,}/.test(password)) score -= 5;
  
  return Math.min(Math.max(score, 0), 100);
};

/**
 * Estimate crack time based on entropy
 */
const estimateCrackTime = (entropy) => {
  const guessesPerSecond = 1e10; // 10 billion guesses per second
  const totalGuesses = Math.pow(2, entropy);
  const seconds = totalGuesses / guessesPerSecond / 2; // Average case
  
  if (seconds < 1) return 'instant';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 2592000) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 31536000) return `${Math.round(seconds / 2592000)} months`;
  if (seconds < 3153600000) return `${Math.round(seconds / 31536000)} years`;
  return 'centuries';
};

/**
 * Validate username with comprehensive checks
 */
export const validateUsername = (username, options = {}) => {
  const config = {
    minLength: options.minLength || 3,
    maxLength: options.maxLength || 30,
    allowedChars: options.allowedChars || /^[a-zA-Z0-9_-]+$/,
    preventProfanity: options.preventProfanity !== false,
    preventReserved: options.preventReserved !== false
  };

  const errors = [];

  if (!username) {
    return { isValid: false, errors: ['Username is required'] };
  }

  if (username.length < config.minLength) {
    errors.push(`Username must be at least ${config.minLength} characters`);
  }

  if (username.length > config.maxLength) {
    errors.push(`Username must not exceed ${config.maxLength} characters`);
  }

  if (!config.allowedChars.test(username)) {
    errors.push('Username contains invalid characters');
  }

  // Reserved username check
  if (config.preventReserved) {
    const reserved = [
      'admin', 'administrator', 'root', 'system', 'moderator',
      'support', 'help', 'api', 'www', 'mail', 'news',
      'chat', 'blog', 'forum', 'shop', 'store', 'app'
    ];
    
    if (reserved.includes(username.toLowerCase())) {
      errors.push('This username is reserved');
    }
  }

  // Profanity check (basic)
  if (config.preventProfanity) {
    const profanityList = [
      // Add profanity words here
    ];
    
    const usernameLower = username.toLowerCase();
    for (const word of profanityList) {
      if (usernameLower.includes(word)) {
        errors.push('Username contains inappropriate content');
        break;
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate URL with security checks
 */
export const validateURL = (url, options = {}) => {
  const config = {
    protocols: options.protocols || ['http', 'https'],
    requireTLD: options.requireTLD !== false,
    requireProtocol: options.requireProtocol !== false,
    blacklist: options.blacklist || [],
    whitelist: options.whitelist || []
  };

  if (!url) {
    return { isValid: false, error: 'URL is required' };
  }

  // Basic URL validation
  if (!validator.isURL(url, {
    protocols: config.protocols,
    require_tld: config.requireTLD,
    require_protocol: config.requireProtocol,
    require_host: true,
    require_valid_protocol: true,
    allow_underscores: false,
    allow_trailing_dot: false,
    allow_protocol_relative_urls: false,
    allow_fragments: true,
    allow_query_components: true
  })) {
    return { isValid: false, error: 'Invalid URL format' };
  }

  // Parse URL
  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    return { isValid: false, error: 'Invalid URL' };
  }

  // Check whitelist
  if (config.whitelist.length > 0) {
    const isWhitelisted = config.whitelist.some(domain => 
      parsedUrl.hostname === domain || parsedUrl.hostname.endsWith(`.${domain}`)
    );
    
    if (!isWhitelisted) {
      return { isValid: false, error: 'URL domain not allowed' };
    }
  }

  // Check blacklist
  if (config.blacklist.length > 0) {
    const isBlacklisted = config.blacklist.some(domain => 
      parsedUrl.hostname === domain || parsedUrl.hostname.endsWith(`.${domain}`)
    );
    
    if (isBlacklisted) {
      return { isValid: false, error: 'URL domain is blocked' };
    }
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /javascript:/i,
    /data:text\/html/i,
    /vbscript:/i,
    /file:\/\//i,
    /<script/i,
    /onclick=/i,
    /onerror=/i
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(url)) {
      return { isValid: false, error: 'URL contains suspicious content' };
    }
  }

  return {
    isValid: true,
    normalized: parsedUrl.toString(),
    hostname: parsedUrl.hostname,
    protocol: parsedUrl.protocol
  };
};

/**
 * Validate phone number
 */
export const validatePhone = (phone, options = {}) => {
  const config = {
    locale: options.locale || 'en-US',
    strictMode: options.strictMode || false,
    format: options.format || 'E164'
  };

  if (!phone) {
    return { isValid: false, error: 'Phone number is required' };
  }

  // Remove common formatting characters
  const cleaned = phone.replace(/[\s\-KATEX_INLINE_OPENKATEX_INLINE_CLOSE\.]/g, '');

  // Validate with locale
  if (!validator.isMobilePhone(cleaned, config.locale, {
    strictMode: config.strictMode
  })) {
    return { isValid: false, error: 'Invalid phone number' };
  }

  // Format phone number
  let formatted = cleaned;
  if (config.format === 'E164' && !cleaned.startsWith('+')) {
    formatted = '+' + cleaned;
  }

  return {
    isValid: true,
    formatted,
    cleaned
  };
};

/**
 * Validate credit card
 */
export const validateCreditCard = (number, options = {}) => {
  if (!number) {
    return { isValid: false, error: 'Card number is required' };
  }

  // Remove spaces and dashes
  const cleaned = number.replace(/[\s-]/g, '');

  // Check if it's a valid credit card number
  if (!validator.isCreditCard(cleaned)) {
    return { isValid: false, error: 'Invalid credit card number' };
  }

  // Detect card type
  const cardType = detectCardType(cleaned);

  // Additional validation based on card type
  if (options.acceptedCards && options.acceptedCards.length > 0) {
    if (!options.acceptedCards.includes(cardType)) {
      return { isValid: false, error: `${cardType} cards are not accepted` };
    }
  }

  return {
    isValid: true,
    type: cardType,
    lastFour: cleaned.slice(-4),
    masked: maskCreditCard(cleaned)
  };
};

/**
 * Detect credit card type
 */
const detectCardType = (number) => {
  const patterns = {
    visa: /^4/,
    mastercard: /^5[1-5]/,
    amex: /^3[47]/,
    discover: /^6(?:011|5)/,
    diners: /^3(?:0[0-5]|[68])/,
    jcb: /^(?:2131|1800|35)/
  };

  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(number)) {
      return type;
    }
  }

  return 'unknown';
};

/**
 * Mask credit card number
 */
const maskCreditCard = (number) => {
  const cleaned = number.replace(/\D/g, '');
  const lastFour = cleaned.slice(-4);
  const masked = '*'.repeat(cleaned.length - 4) + lastFour;
  
  // Format with spaces
  return masked.match(/.{1,4}/g).join(' ');
};

/**
 * Validate date
 */
export const validateDate = (date, options = {}) => {
  const config = {
    format: options.format || 'YYYY-MM-DD',
    minDate: options.minDate,
    maxDate: options.maxDate,
    notFuture: options.notFuture || false,
    notPast: options.notPast || false
  };

  if (!date) {
    return { isValid: false, error: 'Date is required' };
  }

  // Validate format
  if (!validator.isDate(date, { format: config.format, strictMode: true })) {
    return { isValid: false, error: `Invalid date format (expected ${config.format})` };
  }

  const dateObj = new Date(date);
  const now = new Date();

  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: 'Invalid date' };
  }

  // Check constraints
  if (config.notFuture && dateObj > now) {
    return { isValid: false, error: 'Date cannot be in the future' };
  }

  if (config.notPast && dateObj < now) {
    return { isValid: false, error: 'Date cannot be in the past' };
  }

  if (config.minDate && dateObj < new Date(config.minDate)) {
    return { isValid: false, error: `Date must be after ${config.minDate}` };
  }

  if (config.maxDate && dateObj > new Date(config.maxDate)) {
    return { isValid: false, error: `Date must be before ${config.maxDate}` };
  }

  return {
    isValid: true,
    date: dateObj,
    formatted: dateObj.toISOString()
  };
};

/**
 * Sanitize HTML input
 */
export const sanitizeHTML = (html, options = {}) => {
  const config = {
    ALLOWED_TAGS: options.allowedTags || [
      'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li',
      'blockquote', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
    ],
    ALLOWED_ATTR: options.allowedAttr || ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: options.allowDataAttr || false,
    KEEP_CONTENT: options.keepContent !== false,
    RETURN_DOM: options.returnDom || false,
    RETURN_DOM_FRAGMENT: options.returnDomFragment || false,
    RETURN_TRUSTED_TYPE: options.returnTrustedType || false
  };

  // Additional security settings
  if (!options.allowScripts) {
    config.FORBID_TAGS = ['script', 'style', 'iframe', 'object', 'embed', 'form'];
    config.FORBID_ATTR = ['onerror', 'onclick', 'onload', 'onmouseover'];
  }

  return DOMPurify.sanitize(html, config);
};

/**
 * Validate file upload
 */
export const validateFile = (file, options = {}) => {
  const config = {
    maxSize: options.maxSize || 10 * 1024 * 1024, // 10MB default
    minSize: options.minSize || 0,
    allowedTypes: options.allowedTypes || [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain', 'application/json'
    ],
    allowedExtensions: options.allowedExtensions || [
      '.jpg', '.jpeg', '.png', '.gif', '.webp',
      '.pdf', '.txt', '.json'
    ],
    requireExtension: options.requireExtension !== false,
    scanForMalware: options.scanForMalware || false
  };

  const errors = [];

  if (!file) {
    return { isValid: false, errors: ['File is required'] };
  }

  // Check file size
  if (file.size > config.maxSize) {
    errors.push(`File size exceeds ${formatFileSize(config.maxSize)}`);
  }

  if (file.size < config.minSize) {
    errors.push(`File size must be at least ${formatFileSize(config.minSize)}`);
  }

  // Check MIME type
  if (!config.allowedTypes.includes(file.type)) {
    errors.push(`File type '${file.type}' is not allowed`);
  }

  // Check extension
  const extension = '.' + file.name.split('.').pop().toLowerCase();
  if (config.requireExtension && !config.allowedExtensions.includes(extension)) {
    errors.push(`File extension '${extension}' is not allowed`);
  }

  // Check for double extensions (potential security risk)
  if (file.name.split('.').length > 2) {
    const allExtensions = file.name.split('.').slice(1);
    if (allExtensions.some(ext => ['exe', 'scr', 'bat', 'cmd', 'com'].includes(ext.toLowerCase()))) {
      errors.push('Suspicious file extension detected');
    }
  }

  // Check file signature (magic numbers) for common file types
  if (options.validateSignature) {
    // This would require reading file content
    // Implementation depends on FileReader API
  }

  return {
    isValid: errors.length === 0,
    errors,
    fileInfo: {
      name: file.name,
      size: file.size,
      type: file.type,
      extension,
      lastModified: new Date(file.lastModified)
    }
  };
};

/**
 * Format file size
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Validate JSON
 */
export const validateJSON = (str) => {
  if (!str) {
    return { isValid: false, error: 'JSON string is required' };
  }

  try {
    const parsed = JSON.parse(str);
    return {
      isValid: true,
      parsed,
      formatted: JSON.stringify(parsed, null, 2)
    };
  } catch (error) {
    return {
      isValid: false,
      error: error.message,
      position: extractJSONErrorPosition(error.message)
    };
  }
};

/**
 * Extract JSON error position
 */
const extractJSONErrorPosition = (errorMessage) => {
  const match = errorMessage.match(/position (\d+)/);
  return match ? parseInt(match[1]) : null;
};

/**
 * Validate UUID
 */
export const validateUUID = (uuid, version = 4) => {
  if (!uuid) {
    return { isValid: false, error: 'UUID is required' };
  }

  if (!validator.isUUID(uuid, version)) {
    return { isValid: false, error: `Invalid UUID v${version}` };
  }

  return {
    isValid: true,
    version,
    formatted: uuid.toLowerCase()
  };
};

/**
 * Validate JWT token
 */
export const validateJWT = (token) => {
  if (!token) {
    return { isValid: false, error: 'Token is required' };
  }

  if (!validator.isJWT(token)) {
    return { isValid: false, error: 'Invalid JWT format' };
  }

  // Parse JWT without verification (for client-side inspection)
  const parts = token.split('.');
  if (parts.length !== 3) {
    return { isValid: false, error: 'Invalid JWT structure' };
  }

  try {
    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));
    
    // Check expiration
    if (payload.exp) {
      const expirationDate = new Date(payload.exp * 1000);
      if (expirationDate < new Date()) {
        return { isValid: false, error: 'Token has expired' };
      }
    }

    return {
      isValid: true,
      header,
      payload,
      signature: parts[2],
      expiresAt: payload.exp ? new Date(payload.exp * 1000) : null
    };
  } catch (error) {
    return { isValid: false, error: 'Failed to parse JWT' };
  }
};

/**
 * Create rate limiter
 */
export const createRateLimiter = (maxAttempts = 5, windowMs = 60000) => {
  const attempts = new Map();
  const blocked = new Set();

  return {
    check: (key) => {
      const now = Date.now();
      
      // Check if blocked
      if (blocked.has(key)) {
        return {
          allowed: false,
          reason: 'Blocked due to excessive attempts',
          retryAfter: windowMs
        };
      }

      // Get or create attempt record
      let record = attempts.get(key);
      if (!record) {
        record = { timestamps: [], blockUntil: 0 };
        attempts.set(key, record);
      }

      // Remove old timestamps
      record.timestamps = record.timestamps.filter(t => now - t < windowMs);

      // Check if currently blocked
      if (record.blockUntil > now) {
        return {
          allowed: false,
          reason: 'Rate limit exceeded',
          retryAfter: record.blockUntil - now,
          remaining: 0
        };
      }

      // Check rate limit
      if (record.timestamps.length >= maxAttempts) {
        record.blockUntil = now + windowMs;
        return {
          allowed: false,
          reason: 'Rate limit exceeded',
          retryAfter: windowMs,
          remaining: 0
        };
      }

      // Allow request
      record.timestamps.push(now);
      return {
        allowed: true,
        remaining: maxAttempts - record.timestamps.length,
        resetAt: record.timestamps[0] + windowMs
      };
    },

    reset: (key) => {
      attempts.delete(key);
      blocked.delete(key);
    },

    block: (key, duration = windowMs * 10) => {
      blocked.add(key);
      setTimeout(() => blocked.delete(key), duration);
    },

    clear: () => {
      attempts.clear();
      blocked.clear();
    }
  };
};

/**
 * Validate form with complex rules
 */
export const validateForm = (formData, schema) => {
  const errors = {};
  const validated = {};
  const warnings = {};

  for (const [field, rules] of Object.entries(schema)) {
    const value = formData[field];
    const fieldErrors = [];
    const fieldWarnings = [];
    let validatedValue = value;

    // Required check
    if (rules.required && !value) {
      fieldErrors.push(rules.requiredMessage || `${field} is required`);
      continue;
    }

    // Skip validation if not required and empty
    if (!rules.required && !value) {
      continue;
    }

    // Type-specific validation
    if (rules.type) {
      switch (rules.type) {
        case 'email':
          const emailResult = validateEmail(value);
          if (!emailResult.isValid) {
            fieldErrors.push(emailResult.error);
          } else {
            validatedValue = emailResult.normalized;
          }
          break;

        case 'password':
          const passwordResult = validatePassword(value, rules.passwordOptions);
          if (!passwordResult.isValid) {
            fieldErrors.push(...passwordResult.errors);
          }
          if (passwordResult.warnings) {
            fieldWarnings.push(...passwordResult.warnings);
          }
          break;

        case 'url':
          const urlResult = validateURL(value, rules.urlOptions);
          if (!urlResult.isValid) {
            fieldErrors.push(urlResult.error);
          } else {
            validatedValue = urlResult.normalized;
          }
          break;

        case 'phone':
          const phoneResult = validatePhone(value, rules.phoneOptions);
          if (!phoneResult.isValid) {
            fieldErrors.push(phoneResult.error);
          } else {
            validatedValue = phoneResult.formatted;
          }
          break;

        case 'date':
          const dateResult = validateDate(value, rules.dateOptions);
          if (!dateResult.isValid) {
            fieldErrors.push(dateResult.error);
          } else {
            validatedValue = dateResult.formatted;
          }
          break;

        case 'number':
          if (isNaN(value)) {
            fieldErrors.push('Must be a number');
          } else {
            validatedValue = Number(value);
            if (rules.min !== undefined && validatedValue < rules.min) {
              fieldErrors.push(`Must be at least ${rules.min}`);
            }
            if (rules.max !== undefined && validatedValue > rules.max) {
              fieldErrors.push(`Must not exceed ${rules.max}`);
            }
          }
          break;

        case 'boolean':
          validatedValue = Boolean(value);
          break;

        default:
          // Text validation
          if (typeof value !== 'string') {
            fieldErrors.push('Must be a string');
          }
      }
    }

    // Length validation
    if (rules.minLength && value.length < rules.minLength) {
      fieldErrors.push(`Must be at least ${rules.minLength} characters`);
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      fieldErrors.push(`Must not exceed ${rules.maxLength} characters`);
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      fieldErrors.push(rules.patternMessage || 'Invalid format');
    }

    // Custom validation
    if (rules.validate) {
      const customResult = rules.validate(value, formData);
      if (typeof customResult === 'string') {
        fieldErrors.push(customResult);
      } else if (customResult === false) {
        fieldErrors.push(rules.validateMessage || 'Validation failed');
      } else if (typeof customResult === 'object') {
        if (customResult.error) fieldErrors.push(customResult.error);
        if (customResult.warning) fieldWarnings.push(customResult.warning);
        if (customResult.value !== undefined) validatedValue = customResult.value;
      }
    }

    // Sanitization
    if (rules.sanitize) {
      validatedValue = rules.sanitize(validatedValue);
    }

    // Store results
    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
    }
    if (fieldWarnings.length > 0) {
      warnings[field] = fieldWarnings;
    }
    if (fieldErrors.length === 0) {
      validated[field] = validatedValue;
    }
  }

  // Cross-field validation
  if (schema._validate) {
    const crossFieldResult = schema._validate(validated, formData);
    if (crossFieldResult.errors) {
      Object.assign(errors, crossFieldResult.errors);
    }
    if (crossFieldResult.warnings) {
      Object.assign(warnings, crossFieldResult.warnings);
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
    data: validated
  };
};

export default {
  validateEmail,
  validatePassword,
  validateUsername,
  validateURL,
  validatePhone,
  validateCreditCard,
  validateDate,
  validateFile,
  validateJSON,
  validateUUID,
  validateJWT,
  sanitizeHTML,
  createRateLimiter,
  validateForm
};