const argon2 = require('argon2');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const zxcvbn = require('zxcvbn');
const securityConfig = require('../../config/security.config');

class PasswordService {
  constructor() {
    this.config = securityConfig.password;
    this.pepper = this.config.pepper;
  }

  /**
   * Hash password using Argon2id with salt and pepper
   */
  async hashPassword(password, userId) {
    try {
      // Validate password strength
      const strength = this.checkPasswordStrength(password);
      if (strength.score < 3) {
        throw new Error(`Password too weak: ${strength.feedback.warning || 'Please use a stronger password'}`);
      }

      // Check password requirements
      this.validatePasswordRequirements(password);

      // Generate unique salt
      const salt = crypto.randomBytes(this.config.saltLength);
      
      // Add pepper and user-specific data
      const peppered = this.addPepper(password, userId);
      
      // Hash with Argon2id
      const hash = await argon2.hash(peppered, {
        ...this.config.argon2,
        salt: salt,
        raw: false,
      });

      return {
        hash,
        algorithm: 'argon2id',
        version: '1.0',
        salt: salt.toString('hex'),
        iterations: this.config.argon2.timeCost,
        memory: this.config.argon2.memoryCost,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Password hashing error:', error);
      throw error;
    }
  }

  /**
   * Verify password with timing-safe comparison
   */
  async verifyPassword(password, storedHash, userId) {
    try {
      const peppered = this.addPepper(password, userId);
      
      // Timing-safe verification
      const isValid = await argon2.verify(storedHash.hash, peppered);
      
      // Check if rehashing is needed
      const needsRehash = this.needsRehash(storedHash);
      
      return { valid: isValid, needsRehash };
    } catch (error) {
      console.error('Password verification error:', error);
      return { valid: false, needsRehash: false };
    }
  }

  /**
   * Add pepper to password
   */
  addPepper(password, userId) {
    const combined = `${password}${this.pepper}${userId}`;
    return crypto
      .createHash('sha256')
      .update(combined)
      .digest('hex');
  }

  /**
   * Check if password needs rehashing
   */
  needsRehash(storedHash) {
    if (storedHash.algorithm !== 'argon2id') return true;
    if (storedHash.version !== '1.0') return true;
    
    const createdAt = new Date(storedHash.createdAt);
    const daysSinceCreation = (Date.now() - createdAt) / (1000 * 60 * 60 * 24);
    
    // Rehash if older than 90 days or parameters changed
    return daysSinceCreation > 90 ||
           storedHash.memory < this.config.argon2.memoryCost ||
           storedHash.iterations < this.config.argon2.timeCost;
  }

  /**
   * Check password strength using zxcvbn
   */
  checkPasswordStrength(password) {
    const result = zxcvbn(password);
    return {
      score: result.score,
      crackTime: result.crack_times_display.offline_slow_hashing_1e4_per_second,
      feedback: result.feedback,
      warning: result.feedback.warning,
      suggestions: result.feedback.suggestions,
    };
  }

  /**
   * Validate password requirements
   */
  validatePasswordRequirements(password) {
    const errors = [];

    if (password.length < this.config.minLength) {
      errors.push(`Password must be at least ${this.config.minLength} characters`);
    }

    if (password.length > this.config.maxLength) {
      errors.push(`Password must be no more than ${this.config.maxLength} characters`);
    }

    if (this.config.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (this.config.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (this.config.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (this.config.requireSpecialChars) {
      const specialCharsRegex = new RegExp(`[${this.config.specialChars.replace(/[-[```{}()*+?.,\\^$|#\s]/g, '\\$&')}]`);
      if (!specialCharsRegex.test(password)) {
        errors.push('Password must contain at least one special character');
      }
    }

    if (errors.length > 0) {
      throw new Error(errors.join('; '));
    }
  }

  /**
   * Generate secure random password
   */
  generateSecurePassword(length = 32) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' + this.config.specialChars;
    let password = '';
    const randomBytes = crypto.randomBytes(length);
    
    for (let i = 0; i < length; i++) {
      password += charset[randomBytes[i] % charset.length];
    }
    
    // Ensure password meets all requirements
    if (!this.meetsRequirements(password)) {
      return this.generateSecurePassword(length);
    }
    
    return password;
  }

  /**
   * Check if password meets all requirements
   */
  meetsRequirements(password) {
    try {
      this.validatePasswordRequirements(password);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Compare passwords in constant time
   */
  timingSafeEqual(a, b) {
    const bufferA = Buffer.from(a);
    const bufferB = Buffer.from(b);
    
    if (bufferA.length !== bufferB.length) {
      return false;
    }
    
    return crypto.timingSafeEqual(bufferA, bufferB);
  }

  /**
   * Key stretching for additional security
   */
  async stretchKey(password, salt, iterations = 100000) {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, iterations, 64, 'sha512', (err, derivedKey) => {
        if (err) reject(err);
        else resolve(derivedKey.toString('hex'));
      });
    });
  }

  /**
   * Check password against common passwords list
   */
  async checkCommonPassword(password) {
    // This would typically check against a database of common passwords
    const commonPasswords = [
      'password', '123456', 'password123', 'admin', 'letmein',
      'qwerty', 'abc123', '111111', 'password1', 'monkey'
    ];
    
    return commonPasswords.some(common => 
      password.toLowerCase().includes(common.toLowerCase())
    );
  }

  /**
   * Check password entropy
   */
  calculateEntropy(password) {
    const charset = new Set(password).size;
    const length = password.length;
    return Math.log2(Math.pow(charset, length));
  }
}

module.exports = new PasswordService();