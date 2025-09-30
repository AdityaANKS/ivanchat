import { REGEX, LIMITS, ALLOWED_FILE_TYPES } from './constants';

// Email validation
export const validateEmail = (email) => {
  if (!email) {
    return { valid: false, error: 'Email is required' };
  }
  
  if (!REGEX.EMAIL.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  return { valid: true };
};

// Username validation
export const validateUsername = (username) => {
  if (!username) {
    return { valid: false, error: 'Username is required' };
  }
  
  if (username.length < LIMITS.USERNAME_MIN) {
    return { valid: false, error: `Username must be at least ${LIMITS.USERNAME_MIN} characters` };
  }
  
  if (username.length > LIMITS.USERNAME_MAX) {
    return { valid: false, error: `Username must be less than ${LIMITS.USERNAME_MAX} characters` };
  }
  
  if (!REGEX.USERNAME.test(username)) {
    return { valid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }
  
  return { valid: true };
};

// Password validation
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }
  
  if (password.length < LIMITS.PASSWORD_MIN) {
    errors.push(`Must be at least ${LIMITS.PASSWORD_MIN} characters`);
  }
  
  if (password.length > LIMITS.PASSWORD_MAX) {
    errors.push(`Must be less than ${LIMITS.PASSWORD_MAX} characters`);
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Must contain at least one uppercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Must contain at least one number');
  }
  
  if (!/[@$!%*?&]/.test(password)) {
    errors.push('Must contain at least one special character (@$!%*?&)');
  }
  
  if (errors.length > 0) {
    return { valid: false, error: errors.join('. ') };
  }
  
  return { valid: true };
};

// Password strength checker
export const checkPasswordStrength = (password) => {
  let strength = 0;
  const feedback = [];
  
  if (!password) {
    return { strength: 0, label: 'None', feedback: ['Enter a password'] };
  }
  
  // Length checks
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (password.length >= 16) strength++;
  
  // Complexity checks
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[@$!%*?&]/.test(password)) strength++;
  
  // Additional patterns
  if (/[^a-zA-Z0-9@$!%*?&]/.test(password)) strength++;
  
  // Provide feedback
  if (password.length < 8) {
    feedback.push('Use at least 8 characters');
  }
  
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
    feedback.push('Mix uppercase and lowercase letters');
  }
  
  if (!/\d/.test(password)) {
    feedback.push('Include at least one number');
  }
  
  if (!/[@$!%*?&]/.test(password)) {
    feedback.push('Add special characters for extra security');
  }
  
  // Determine strength label
  let label = 'Weak';
  if (strength >= 7) label = 'Very Strong';
  else if (strength >= 5) label = 'Strong';
  else if (strength >= 3) label = 'Medium';
  
  return {
    strength: Math.min(strength, 8),
    label,
    feedback,
    score: (strength / 8) * 100
  };
};

// Confirm password validation
export const validatePasswordConfirm = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { valid: false, error: 'Please confirm your password' };
  }
  
  if (password !== confirmPassword) {
    return { valid: false, error: 'Passwords do not match' };
  }
  
  return { valid: true };
};

// Phone number validation
export const validatePhone = (phone) => {
  if (!phone) {
    return { valid: false, error: 'Phone number is required' };
  }
  
  if (!REGEX.PHONE.test(phone)) {
    return { valid: false, error: 'Invalid phone number format' };
  }
  
  return { valid: true };
};

// URL validation
export const validateUrl = (url) => {
  if (!url) {
    return { valid: false, error: 'URL is required' };
  }
  
  if (!REGEX.URL.test(url)) {
    return { valid: false, error: 'Invalid URL format' };
  }
  
  return { valid: true };
};

// Channel name validation
export const validateChannelName = (name) => {
  if (!name) {
    return { valid: false, error: 'Channel name is required' };
  }
  
  if (name.length < LIMITS.CHANNEL_NAME_MIN) {
    return { valid: false, error: `Channel name must be at least ${LIMITS.CHANNEL_NAME_MIN} character` };
  }
  
  if (name.length > LIMITS.CHANNEL_NAME_MAX) {
    return { valid: false, error: `Channel name must be less than ${LIMITS.CHANNEL_NAME_MAX} characters` };
  }
  
  if (!REGEX.CHANNEL_NAME.test(name)) {
    return { valid: false, error: 'Channel name can only contain letters, numbers, hyphens, and underscores' };
  }
  
  return { valid: true };
};

// Server name validation
export const validateServerName = (name) => {
  if (!name) {
    return { valid: false, error: 'Server name is required' };
  }
  
  if (name.length < LIMITS.SERVER_NAME_MIN) {
    return { valid: false, error: `Server name must be at least ${LIMITS.SERVER_NAME_MIN} characters` };
  }
  
  if (name.length > LIMITS.SERVER_NAME_MAX) {
    return { valid: false, error: `Server name must be less than ${LIMITS.SERVER_NAME_MAX} characters` };
  }
  
  return { valid: true };
};

// Message validation
export const validateMessage = (message) => {
  if (!message || !message.trim()) {
    return { valid: false, error: 'Message cannot be empty' };
  }
  
  if (message.length > LIMITS.MESSAGE_LENGTH) {
    return { valid: false, error: `Message must be less than ${LIMITS.MESSAGE_LENGTH} characters` };
  }
  
  return { valid: true };
};

// File validation
export const validateFile = (file, options = {}) => {
  const {
    maxSize = MAX_FILE_SIZE,
    allowedTypes = ALLOWED_FILE_TYPES,
    isImage = false,
    isAvatar = false
  } = options;
  
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }
  
  // Check file size
  const actualMaxSize = isAvatar ? MAX_AVATAR_SIZE : (isImage ? MAX_IMAGE_SIZE : maxSize);
  
  if (file.size > actualMaxSize) {
    return { 
      valid: false, 
      error: `File size must be less than ${formatFileSize(actualMaxSize)}` 
    };
  }
  
  // Check file type
  if (allowedTypes && allowedTypes.length > 0) {
    if (!allowedTypes.includes(file.type)) {
      return { 
        valid: false, 
        error: `File type ${file.type} is not allowed` 
      };
    }
  }
  
  // Additional image validation
  if (isImage && !IMAGE_TYPES.includes(file.type)) {
    return { 
      valid: false, 
      error: 'File must be an image (JPEG, PNG, GIF, or WebP)' 
    };
  }
  
  return { valid: true };
};

// Multiple files validation
export const validateFiles = (files, options = {}) => {
  const { maxFiles = LIMITS.MAX_ATTACHMENTS_PER_MESSAGE } = options;
  
  if (!files || files.length === 0) {
    return { valid: false, error: 'No files selected' };
  }
  
  if (files.length > maxFiles) {
    return { valid: false, error: `Maximum ${maxFiles} files allowed` };
  }
  
  for (const file of files) {
    const validation = validateFile(file, options);
    if (!validation.valid) {
      return validation;
    }
  }
  
  return { valid: true };
};

// Date validation
export const validateDate = (date, options = {}) => {
  const { 
    required = false,
    minDate = null,
    maxDate = null,
    futureOnly = false,
    pastOnly = false
  } = options;
  
  if (!date && required) {
    return { valid: false, error: 'Date is required' };
  }
  
  if (!date) {
    return { valid: true };
  }
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return { valid: false, error: 'Invalid date format' };
  }
  
  const now = new Date();
  
  if (futureOnly && dateObj <= now) {
    return { valid: false, error: 'Date must be in the future' };
  }
  
  if (pastOnly && dateObj >= now) {
    return { valid: false, error: 'Date must be in the past' };
  }
  
  if (minDate && dateObj < new Date(minDate)) {
    return { valid: false, error: `Date must be after ${formatDate(minDate)}` };
  }
  
  if (maxDate && dateObj > new Date(maxDate)) {
    return { valid: false, error: `Date must be before ${formatDate(maxDate)}` };
  }
  
  return { valid: true };
};

// Age validation
export const validateAge = (birthDate, minAge = 13) => {
  if (!birthDate) {
    return { valid: false, error: 'Birth date is required' };
  }
  
  const birth = new Date(birthDate);
  const today = new Date();
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  if (age < minAge) {
    return { valid: false, error: `You must be at least ${minAge} years old` };
  }
  
  return { valid: true };
};

// Credit card validation (Luhn algorithm)
export const validateCreditCard = (cardNumber) => {
  if (!cardNumber) {
    return { valid: false, error: 'Card number is required' };
  }
  
  // Remove spaces and hyphens
  const cleaned = cardNumber.replace(/[\s-]/g, '');
  
  if (!/^\d+$/.test(cleaned)) {
    return { valid: false, error: 'Card number must contain only digits' };
  }
  
  if (cleaned.length < 13 || cleaned.length > 19) {
    return { valid: false, error: 'Invalid card number length' };
  }
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  if (sum % 10 !== 0) {
    return { valid: false, error: 'Invalid card number' };
  }
  
  return { valid: true };
};

// Color validation
export const validateHexColor = (color) => {
  if (!color) {
    return { valid: false, error: 'Color is required' };
  }
  
  if (!REGEX.HEX_COLOR.test(color)) {
    return { valid: false, error: 'Invalid hex color format' };
  }
  
  return { valid: true };
};

// Form validation
export const validateForm = (formData, rules) => {
  const errors = {};
  let isValid = true;
  
  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = formData[field];
    
    // Required validation
    if (fieldRules.required && !value) {
      errors[field] = `${fieldRules.label || field} is required`;
      isValid = false;
      continue;
    }
    
    // Skip other validations if field is empty and not required
    if (!value && !fieldRules.required) {
      continue;
    }
    
    // Min length validation
    if (fieldRules.minLength && value.length < fieldRules.minLength) {
      errors[field] = `${fieldRules.label || field} must be at least ${fieldRules.minLength} characters`;
      isValid = false;
    }
    
    // Max length validation
    if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
      errors[field] = `${fieldRules.label || field} must be less than ${fieldRules.maxLength} characters`;
      isValid = false;
    }
    
    // Pattern validation
    if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
      errors[field] = fieldRules.message || `${fieldRules.label || field} is invalid`;
      isValid = false;
    }
    
    // Custom validation
    if (fieldRules.validate) {
      const result = fieldRules.validate(value, formData);
      if (result !== true) {
        errors[field] = result;
        isValid = false;
      }
    }
    
    // Type-specific validation
    if (fieldRules.type) {
      let validation;
      
      switch (fieldRules.type) {
        case 'email':
          validation = validateEmail(value);
          break;
        case 'username':
          validation = validateUsername(value);
          break;
        case 'password':
          validation = validatePassword(value);
          break;
        case 'phone':
          validation = validatePhone(value);
          break;
        case 'url':
          validation = validateUrl(value);
          break;
        default:
          validation = { valid: true };
      }
      
      if (!validation.valid) {
        errors[field] = validation.error;
        isValid = false;
      }
    }
  }
  
  return { isValid, errors };
};

// Sanitize input
export const sanitizeInput = (input, options = {}) => {
  const {
    stripHtml = true,
    trimWhitespace = true,
    lowercase = false,
    uppercase = false,
    removeSpecialChars = false,
    maxLength = null
  } = options;
  
  let sanitized = input;
  
  if (!sanitized) return '';
  
  // Convert to string if not already
  sanitized = String(sanitized);
  
  // Strip HTML tags
  if (stripHtml) {
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  }
  
  // Remove special characters
  if (removeSpecialChars) {
    sanitized = sanitized.replace(/[^\w\s]/gi, '');
  }
  
  // Trim whitespace
  if (trimWhitespace) {
    sanitized = sanitized.trim();
  }
  
  // Case conversion
  if (lowercase) {
    sanitized = sanitized.toLowerCase();
  } else if (uppercase) {
    sanitized = sanitized.toUpperCase();
  }
  
  // Truncate if needed
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
};

// Export all validators
export default {
  validateEmail,
  validateUsername,
  validatePassword,
  checkPasswordStrength,
  validatePasswordConfirm,
  validatePhone,
  validateUrl,
  validateChannelName,
  validateServerName,
  validateMessage,
  validateFile,
  validateFiles,
  validateDate,
  validateAge,
  validateCreditCard,
  validateHexColor,
  validateForm,
  sanitizeInput
};