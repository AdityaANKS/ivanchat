const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { promisify } = require('util');

class CryptoUtils {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.saltRounds = 12;
    this.keyDerivationIterations = 100000;
    this.randomBytes = promisify(crypto.randomBytes);
    this.pbkdf2 = promisify(crypto.pbkdf2);
  }

  // Generate random tokens
  async generateToken(length = 32) {
    const buffer = await this.randomBytes(length);
    return buffer.toString('hex');
  }

  // Generate secure random string
  generateSecureRandom(length = 16, encoding = 'hex') {
    return crypto.randomBytes(length).toString(encoding);
  }

  // Hash password with bcrypt
  async hashPassword(password) {
    return bcrypt.hash(password, this.saltRounds);
  }

  // Verify password
  async verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  // Symmetric encryption
  async encrypt(text, password) {
    try {
      const salt = crypto.randomBytes(64);
      const key = await this.pbkdf2(password, salt, this.keyDerivationIterations, 32, 'sha256');
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(this.algorithm, key, iv);
      
      const encrypted = Buffer.concat([
        cipher.update(text, 'utf8'),
        cipher.final()
      ]);
      
      const tag = cipher.getAuthTag();
      
      return {
        encrypted: encrypted.toString('hex'),
        salt: salt.toString('hex'),
        iv: iv.toString('hex'),
        tag: tag.toString('hex')
      };
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Encryption failed');
    }
  }

  // Symmetric decryption
  async decrypt(encryptedData, password) {
    try {
      const salt = Buffer.from(encryptedData.salt, 'hex');
      const key = await this.pbkdf2(password, salt, this.keyDerivationIterations, 32, 'sha256');
      const iv = Buffer.from(encryptedData.iv, 'hex');
      const tag = Buffer.from(encryptedData.tag, 'hex');
      const encrypted = Buffer.from(encryptedData.encrypted, 'hex');
      
      const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
      decipher.setAuthTag(tag);
      
      const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final()
      ]);
      
      return decrypted.toString('utf8');
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Decryption failed');
    }
  }

  // Generate RSA key pair
  generateKeyPair() {
    return crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: process.env.KEY_PASSPHRASE || 'defaultPassphrase'
      }
    });
  }

  // RSA encryption
  encryptWithPublicKey(data, publicKey) {
    const buffer = Buffer.from(data, 'utf8');
    const encrypted = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      },
      buffer
    );
    return encrypted.toString('base64');
  }

  // RSA decryption
  decryptWithPrivateKey(encryptedData, privateKey, passphrase) {
    const buffer = Buffer.from(encryptedData, 'base64');
    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
        passphrase
      },
      buffer
    );
    return decrypted.toString('utf8');
  }

  // Generate HMAC
  generateHMAC(data, secret) {
    return crypto
      .createHmac('sha256', secret)
      .update(data)
      .digest('hex');
  }

  // Verify HMAC
  verifyHMAC(data, hmac, secret) {
    const calculatedHmac = this.generateHMAC(data, secret);
    return crypto.timingSafeEqual(
      Buffer.from(hmac),
      Buffer.from(calculatedHmac)
    );
  }

  // Hash data with SHA-256
  hash(data) {
    return crypto
      .createHash('sha256')
      .update(data)
      .digest('hex');
  }

  // Generate file hash
  async generateFileHash(buffer) {
    return crypto
      .createHash('sha256')
      .update(buffer)
      .digest('hex');
  }

  // Derive key from password
  async deriveKey(password, salt, iterations = 100000, keyLength = 32) {
    return this.pbkdf2(password, salt, iterations, keyLength, 'sha256');
  }

  // Generate secure session ID
  generateSessionId() {
    const timestamp = Date.now().toString();
    const random = this.generateSecureRandom(32);
    return this.hash(timestamp + random);
  }

  // Encrypt for database storage
  encryptForStorage(data, masterKey) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(masterKey, 'hex'), iv);
    
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
      iv: iv.toString('hex'),
      data: encrypted
    };
  }

  // Decrypt from database storage
  decryptFromStorage(encryptedData, masterKey) {
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(masterKey, 'hex'),
      Buffer.from(encryptedData.iv, 'hex')
    );
    
    let decrypted = decipher.update(encryptedData.data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  }

  // Time-constant comparison
  timingSafeCompare(a, b) {
    if (a.length !== b.length) {
      return false;
    }
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
  }

  // Generate OTP secret
  generateOTPSecret() {
    return this.generateSecureRandom(20, 'base64');
  }

  // Generate recovery codes
  generateRecoveryCodes(count = 10) {
    const codes = [];
    for (let i = 0; i < count; i++) {
      codes.push(this.generateSecureRandom(8, 'hex').toUpperCase());
    }
    return codes;
  }
}

// Export singleton instance
module.exports = new CryptoUtils();