const validator = require('validator');
const xss = require('xss');

class ValidationUtils {
  constructor() {
    this.emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.phoneRegex = /^\+?[\d\s-()]+$/;
    this.usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
    this.passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  }

  // Email validation
  validateEmail(email) {
    if (!email || typeof email !== 'string') {
      return { valid: false, error: 'Email is required' };
    }

    if (!this.emailRegex.test(email)) {
      return { valid: false, error: 'Invalid email format' };
    }

    if (!validator.isEmail(email)) {
      return { valid: false, error: 'Invalid email address' };
    }

    return { valid: true };
  }

  // Password validation
  validatePassword(password) {
    const errors = [];

    if (!password || typeof password !== 'string') {
      return { valid: false, errors: ['Password is required'] };
    }

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
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
      strength: this.calculatePasswordStrength(password)
    };
  }

  // Calculate password strength
  calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 20;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/\d/.test(password)) strength += 15;
    if (/[@$!%*?&]/.test(password)) strength += 15;
    
    if (strength < 40) return 'weak';
    if (strength < 70) return 'medium';
    return 'strong';
  }

  // Username validation
  validateUsername(username) {
    if (!username || typeof username !== 'string') {
      return { valid: false, error: 'Username is required' };
    }

    if (username.length < 3 || username.length > 30) {
      return { valid: false, error: 'Username must be between 3 and 30 characters' };
    }

    if (!this.usernameRegex.test(username)) {
      return { valid: false, error: 'Username can only contain letters, numbers, hyphens, and underscores' };
    }

    // Check for prohibited usernames
    const prohibited = ['admin', 'root', 'system', 'moderator'];
    if (prohibited.includes(username.toLowerCase())) {
      return { valid: false, error: 'This username is not allowed' };
    }

    return { valid: true };
  }

  // Phone validation
  validatePhone(phone) {
    if (!phone || typeof phone !== 'string') {
      return { valid: false, error: 'Phone number is required' };
    }

    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length < 10 || cleaned.length > 15) {
      return { valid: false, error: 'Invalid phone number length' };
    }

    if (!validator.isMobilePhone(phone, 'any')) {
      return { valid: false, error: 'Invalid phone number format' };
    }

    return { valid: true, cleaned };
  }

  // URL validation
  validateURL(url) {
    if (!url || typeof url !== 'string') {
      return { valid: false, error: 'URL is required' };
    }

    if (!validator.isURL(url, {
      protocols: ['http', 'https'],
      require_protocol: true,
      require_valid_protocol: true
    })) {
      return { valid: false, error: 'Invalid URL format' };
    }

    // Check for suspicious URLs
    const suspiciousPatterns = [
      /javascript:/i,
      /data:text\/html/i,
      /vbscript:/i
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(url)) {
        return { valid: false, error: 'Suspicious URL detected' };
      }
    }

    return { valid: true };
  }

  // Input sanitization
  sanitizeInput(input, options = {}) {
    if (typeof input !== 'string') {
      return input;
    }

    let sanitized = input;

    // Remove null bytes
    sanitized = sanitized.replace(/\0/g, '');

    // Trim whitespace
    if (options.trim !== false) {
      sanitized = sanitized.trim();
    }

    // Escape HTML if needed
    if (options.escapeHtml !== false) {
      sanitized = validator.escape(sanitized);
    }

    // Remove XSS
    if (options.xss !== false) {
      sanitized = xss(sanitized);
    }

    // Normalize unicode
    if (options.normalize !== false) {
      sanitized = sanitized.normalize('NFC');
    }

    return sanitized;
  }

  // Validate file upload
  validateFileUpload(file, options = {}) {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
      allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf']
    } = options;

    const errors = [];

    if (!file) {
      return { valid: false, errors: ['No file provided'] };
    }

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size exceeds maximum of ${maxSize / 1024 / 1024}MB`);
    }

    // Check MIME type
    if (!allowedTypes.includes(file.mimetype)) {
      errors.push(`File type ${file.mimetype} is not allowed`);
    }

    // Check extension
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      errors.push(`File extension ${ext} is not allowed`);
    }

    // Check for double extensions
    if ((file.name.match(/\./g) || []).length > 1) {
      errors.push('Files with multiple extensions are not allowed');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Validate JSON
  validateJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      return { valid: true, data: parsed };
    } catch (error) {
      return { valid: false, error: 'Invalid JSON format' };
    }
  }

  // Validate date
  validateDate(date, options = {}) {
    const {
      format = 'YYYY-MM-DD',
      minDate = null,
      maxDate = null
    } = options;

    if (!validator.isDate(date, { format })) {
      return { valid: false, error: 'Invalid date format' };
    }

    const dateObj = new Date(date);

    if (minDate && dateObj < new Date(minDate)) {
      return { valid: false, error: `Date must be after ${minDate}` };
    }

    if (maxDate && dateObj > new Date(maxDate)) {
      return { valid: false, error: `Date must be before ${maxDate}` };
    }

    return { valid: true, date: dateObj };
  }

  // Validate credit card
  validateCreditCard(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, '');
    
    if (!validator.isCreditCard(cleaned)) {
      return { valid: false, error: 'Invalid credit card number' };
    }

    return { 
      valid: true,
      type: this.detectCardType(cleaned),
      masked: this.maskCreditCard(cleaned)
    };
  }

  // Detect credit card type
  detectCardType(cardNumber) {
    const patterns = {
      visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
      mastercard: /^5[1-5][0-9]{14}$/,
      amex: /^3[47][0-9]{13}$/,
      discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(cardNumber)) {
        return type;
      }
    }

    return 'unknown';
  }

  // Mask sensitive data
  maskCreditCard(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, '');
    const last4 = cleaned.slice(-4);
    const masked = '*'.repeat(cleaned.length - 4) + last4;
    return masked.replace(/(.{4})/g, '$1 ').trim();
  }

  // Validate IP address
  validateIP(ip, version = 'any') {
    if (version === '4') {
      return validator.isIP(ip, 4);
    } else if (version === '6') {
      return validator.isIP(ip, 6);
    }
    return validator.isIP(ip);
  }

  // Validate UUID
  validateUUID(uuid, version = 4) {
    return validator.isUUID(uuid, version);
  }

  // Batch validation
  validateBatch(data, schema) {
    const errors = {};
    const validated = {};

    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];
      const fieldErrors = [];

      // Required check
      if (rules.required && !value) {
        fieldErrors.push(`${field} is required`);
      }

      // Type check
      if (value && rules.type && typeof value !== rules.type) {
        fieldErrors.push(`${field} must be of type ${rules.type}`);
      }

      // Custom validator
      if (value && rules.validator) {
        const result = rules.validator(value);
        if (!result.valid) {
          fieldErrors.push(result.error || `${field} is invalid`);
        }
      }

      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors;
      } else if (value !== undefined) {
        validated[field] = value;
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
      data: validated
    };
  }
}

module.exports = new ValidationUtils();