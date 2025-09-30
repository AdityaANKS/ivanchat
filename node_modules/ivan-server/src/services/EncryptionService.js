const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const sodium = require('sodium-native');
const forge = require('node-forge');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');
const Redis = require('ioredis');
const { EventEmitter } = require('events');

// Initialize Redis for key storage
const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  keyPrefix: 'encryption:'
});

// Constants
const ALGORITHM = 'aes-256-gcm';
const SALT_LENGTH = 32;
const TAG_LENGTH = 16;
const IV_LENGTH = 16;
const KEY_LENGTH = 32;
const ITERATION_COUNT = 100000;

class EncryptionService extends EventEmitter {
  constructor() {
    super();
    this.keyCache = new Map();
    this.sessionKeys = new Map();
    this.publicKeyStore = new Map();
    this.initializeService();
  }

  async initializeService() {
    // Generate server keys if not exists
    await this.initializeServerKeys();
    
    // Start key rotation scheduler
    this.startKeyRotation();
    
    // Clean up expired keys periodically
    setInterval(() => this.cleanupExpiredKeys(), 3600000); // Every hour
  }

  // ========================
  // Server Key Management
  // ========================

  async initializeServerKeys() {
    try {
      const existingKey = await redisClient.get('server:master_key');
      if (!existingKey) {
        const masterKey = crypto.randomBytes(KEY_LENGTH);
        await redisClient.set('server:master_key', masterKey.toString('base64'));
        console.log('Server master key initialized');
      }
    } catch (error) {
      console.error('Error initializing server keys:', error);
      throw error;
    }
  }

  async getServerMasterKey() {
    const key = await redisClient.get('server:master_key');
    if (!key) {
      throw new Error('Server master key not found');
    }
    return Buffer.from(key, 'base64');
  }

  // ========================
  // End-to-End Encryption
  // ========================

  /**
   * Generate key pair for user
   */
  async generateKeyPair(userId) {
    try {
      const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });
      
      const publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey);
      const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);
      
      // Encrypt private key before storing
      const encryptedPrivateKey = await this.encryptPrivateKey(privateKeyPem, userId);
      
      // Store keys
      await redisClient.set(`user:${userId}:public_key`, publicKeyPem);
      await redisClient.set(`user:${userId}:private_key`, encryptedPrivateKey);
      
      // Cache public key
      this.publicKeyStore.set(userId, publicKeyPem);
      
      this.emit('keyPairGenerated', { userId });
      
      return {
        publicKey: publicKeyPem,
        privateKey: privateKeyPem, // Return unencrypted for client
        fingerprint: this.generateKeyFingerprint(publicKeyPem)
      };
    } catch (error) {
      console.error('Error generating key pair:', error);
      throw error;
    }
  }

  /**
   * Encrypt message for end-to-end encryption
   */
  async encryptMessage(message, senderUserId, recipientUserIds) {
    try {
      // Generate ephemeral symmetric key for this message
      const symmetricKey = crypto.randomBytes(KEY_LENGTH);
      
      // Encrypt message with symmetric key
      const encryptedContent = await this.encryptWithSymmetricKey(message, symmetricKey);
      
      // Encrypt symmetric key for each recipient
      const encryptedKeys = {};
      for (const recipientId of recipientUserIds) {
        const recipientPublicKey = await this.getUserPublicKey(recipientId);
        if (recipientPublicKey) {
          encryptedKeys[recipientId] = await this.encryptSymmetricKeyForUser(
            symmetricKey,
            recipientPublicKey
          );
        }
      }
      
      // Also encrypt for sender (so they can read their own messages)
      const senderPublicKey = await this.getUserPublicKey(senderUserId);
      encryptedKeys[senderUserId] = await this.encryptSymmetricKeyForUser(
        symmetricKey,
        senderPublicKey
      );
      
      return {
        encryptedContent,
        encryptedKeys,
        algorithm: ALGORITHM,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error encrypting message:', error);
      throw error;
    }
  }

  /**
   * Decrypt message
   */
  async decryptMessage(encryptedData, userId) {
    try {
      const { encryptedContent, encryptedKeys } = encryptedData;
      
      // Get user's encrypted symmetric key
      const encryptedSymmetricKey = encryptedKeys[userId];
      if (!encryptedSymmetricKey) {
        throw new Error('No key found for this user');
      }
      
      // Get user's private key
      const privateKey = await this.getUserPrivateKey(userId);
      
      // Decrypt symmetric key
      const symmetricKey = await this.decryptSymmetricKeyForUser(
        encryptedSymmetricKey,
        privateKey
      );
      
      // Decrypt message
      const message = await this.decryptWithSymmetricKey(encryptedContent, symmetricKey);
      
      return message;
    } catch (error) {
      console.error('Error decrypting message:', error);
      throw error;
    }
  }

  // ========================
  // Symmetric Encryption
  // ========================

  async encryptWithSymmetricKey(data, key) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    const encrypted = Buffer.concat([
      cipher.update(JSON.stringify(data), 'utf8'),
      cipher.final()
    ]);
    
    const tag = cipher.getAuthTag();
    
    return {
      encrypted: encrypted.toString('base64'),
      iv: iv.toString('base64'),
      tag: tag.toString('base64')
    };
  }

  async decryptWithSymmetricKey(encryptedData, key) {
    const { encrypted, iv, tag } = encryptedData;
    
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      key,
      Buffer.from(iv, 'base64')
    );
    
    decipher.setAuthTag(Buffer.from(tag, 'base64'));
    
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encrypted, 'base64')),
      decipher.final()
    ]);
    
    return JSON.parse(decrypted.toString('utf8'));
  }

  // ========================
  // Asymmetric Encryption
  // ========================

  async encryptSymmetricKeyForUser(symmetricKey, publicKeyPem) {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const encrypted = publicKey.encrypt(symmetricKey.toString('base64'), 'RSA-OAEP', {
      md: forge.md.sha256.create(),
      mgf1: {
        md: forge.md.sha256.create()
      }
    });
    return forge.util.encode64(encrypted);
  }

  async decryptSymmetricKeyForUser(encryptedKey, privateKeyPem) {
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const decrypted = privateKey.decrypt(
      forge.util.decode64(encryptedKey),
      'RSA-OAEP',
      {
        md: forge.md.sha256.create(),
        mgf1: {
          md: forge.md.sha256.create()
        }
      }
    );
    return Buffer.from(decrypted, 'base64');
  }

  // ========================
  // File Encryption
  // ========================

  async encryptFile(filePath, userId) {
    try {
      const fileBuffer = await fs.readFile(filePath);
      const key = crypto.randomBytes(KEY_LENGTH);
      const iv = crypto.randomBytes(IV_LENGTH);
      
      const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
      const encrypted = Buffer.concat([
        cipher.update(fileBuffer),
        cipher.final()
      ]);
      
      const tag = cipher.getAuthTag();
      
      // Store encrypted file
      const encryptedFileName = `${crypto.randomBytes(16).toString('hex')}.enc`;
      const encryptedFilePath = path.join(process.env.UPLOAD_PATH, 'encrypted', encryptedFileName);
      
      await fs.writeFile(encryptedFilePath, encrypted);
      
      // Store encryption metadata
      await redisClient.set(
        `file:${encryptedFileName}:metadata`,
        JSON.stringify({
          originalName: path.basename(filePath),
          key: key.toString('base64'),
          iv: iv.toString('base64'),
          tag: tag.toString('base64'),
          userId,
          timestamp: Date.now()
        }),
        'EX',
        86400 * 30 // Expire after 30 days
      );
      
      return {
        encryptedFileName,
        encryptedFilePath,
        metadata: {
          size: encrypted.length,
          originalSize: fileBuffer.length
        }
      };
    } catch (error) {
      console.error('Error encrypting file:', error);
      throw error;
    }
  }

  async decryptFile(encryptedFileName, userId) {
    try {
      const metadata = await redisClient.get(`file:${encryptedFileName}:metadata`);
      if (!metadata) {
        throw new Error('File metadata not found');
      }
      
      const { key, iv, tag, originalName } = JSON.parse(metadata);
      
      const encryptedFilePath = path.join(process.env.UPLOAD_PATH, 'encrypted', encryptedFileName);
      const encryptedBuffer = await fs.readFile(encryptedFilePath);
      
      const decipher = crypto.createDecipheriv(
        ALGORITHM,
        Buffer.from(key, 'base64'),
        Buffer.from(iv, 'base64')
      );
      
      decipher.setAuthTag(Buffer.from(tag, 'base64'));
      
      const decrypted = Buffer.concat([
        decipher.update(encryptedBuffer),
        decipher.final()
      ]);
      
      return {
        data: decrypted,
        originalName,
        mimeType: this.getMimeType(originalName)
      };
    } catch (error) {
      console.error('Error decrypting file:', error);
      throw error;
    }
  }

  // ========================
  // Password Security
  // ========================

  async hashPassword(password) {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  }

  async verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  async generateSecurePassword(length = 16) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let password = '';
    const randomBytes = crypto.randomBytes(length);
    
    for (let i = 0; i < length; i++) {
      password += charset[randomBytes[i] % charset.length];
    }
    
    return password;
  }

  // ========================
  // Token Management
  // ========================

  generateToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  generateSecureToken(payload, secret = null) {
    const finalSecret = secret || process.env.JWT_SECRET;
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };
    
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    
    const signature = crypto
      .createHmac('sha256', finalSecret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64url');
    
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  verifySecureToken(token, secret = null) {
    const finalSecret = secret || process.env.JWT_SECRET;
    const [encodedHeader, encodedPayload, signature] = token.split('.');
    
    const expectedSignature = crypto
      .createHmac('sha256', finalSecret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64url');
    
    if (signature !== expectedSignature) {
      throw new Error('Invalid token signature');
    }
    
    return JSON.parse(Buffer.from(encodedPayload, 'base64url').toString());
  }

  // ========================
  // Two-Factor Authentication
  // ========================

  async generateTwoFactorSecret(userId, appName = 'Ivan Chat') {
    const secret = speakeasy.generateSecret({
      name: `${appName} (${userId})`,
      length: 32
    });
    
    // Store secret securely
    const encryptedSecret = await this.encryptSensitiveData(secret.base32);
    await redisClient.set(`user:${userId}:2fa_secret`, encryptedSecret);
    
    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
    
    return {
      secret: secret.base32,
      qrCode: qrCodeUrl,
      backupCodes: await this.generateBackupCodes(userId)
    };
  }

  verifyTwoFactorToken(token, secret) {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2 // Allow 2 time steps for clock skew
    });
  }

  async generateBackupCodes(userId, count = 10) {
    const codes = [];
    for (let i = 0; i < count; i++) {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      codes.push(code);
    }
    
    // Hash and store backup codes
    const hashedCodes = await Promise.all(
      codes.map(code => this.hashPassword(code))
    );
    
    await redisClient.set(
      `user:${userId}:backup_codes`,
      JSON.stringify(hashedCodes),
      'EX',
      86400 * 365 // Expire after 1 year
    );
    
    return codes;
  }

  // ========================
  // Zero-Knowledge Proofs
  // ========================

  /**
   * Simple Zero-Knowledge proof implementation for authentication
   */
  async generateZKProof(secret, challenge) {
    // This is a simplified implementation
    // In production, use a proper ZK library
    
    const hash = crypto.createHash('sha256');
    hash.update(secret + challenge);
    const proof = hash.digest('hex');
    
    return {
      proof,
      challenge,
      timestamp: Date.now()
    };
  }

  async verifyZKProof(proof, expectedProof) {
    return crypto.timingSafeEqual(
      Buffer.from(proof),
      Buffer.from(expectedProof)
    );
  }

  // ========================
  // Secure Communication Channel
  // ========================

  /**
   * Establish secure channel using Diffie-Hellman
   */
  async establishSecureChannel(userId1, userId2) {
    // Generate DH parameters
    const dh1 = crypto.createDiffieHellman(2048);
    const dh2 = crypto.createDiffieHellman(dh1.getPrime(), dh1.getGenerator());
    
    dh1.generateKeys();
    dh2.generateKeys();
    
    // Exchange public keys
    const sharedSecret1 = dh1.computeSecret(dh2.getPublicKey());
    const sharedSecret2 = dh2.computeSecret(dh1.getPublicKey());
    
    // Verify shared secrets match
    if (!sharedSecret1.equals(sharedSecret2)) {
      throw new Error('Failed to establish secure channel');
    }
    
    // Derive session key from shared secret
    const sessionKey = crypto.pbkdf2Sync(
      sharedSecret1,
      'ivan-chat-session',
      ITERATION_COUNT,
      KEY_LENGTH,
      'sha256'
    );
    
    // Store session key
    const channelId = this.generateChannelId(userId1, userId2);
    this.sessionKeys.set(channelId, sessionKey);
    
    // Set expiration
    setTimeout(() => {
      this.sessionKeys.delete(channelId);
    }, 3600000); // 1 hour
    
    return {
      channelId,
      publicKey1: dh1.getPublicKey().toString('base64'),
      publicKey2: dh2.getPublicKey().toString('base64')
    };
  }

  // ========================
  // Message Integrity
  // ========================

  generateMessageHMAC(message, key) {
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(JSON.stringify(message));
    return hmac.digest('hex');
  }

  verifyMessageIntegrity(message, hmac, key) {
    const expectedHmac = this.generateMessageHMAC(message, key);
    return crypto.timingSafeEqual(
      Buffer.from(hmac),
      Buffer.from(expectedHmac)
    );
  }

  // ========================
  // Key Rotation
  // ========================

  startKeyRotation() {
    // Rotate encryption keys periodically
    setInterval(async () => {
      try {
        await this.rotateServerKeys();
        this.emit('keysRotated', { timestamp: Date.now() });
      } catch (error) {
        console.error('Error rotating keys:', error);
      }
    }, 86400000 * 30); // Every 30 days
  }

  async rotateServerKeys() {
    const newMasterKey = crypto.randomBytes(KEY_LENGTH);
    const oldKey = await this.getServerMasterKey();
    
    // Store new key
    await redisClient.set('server:master_key', newMasterKey.toString('base64'));
    
    // Keep old key for decryption of old data
    await redisClient.set(
      `server:old_master_key:${Date.now()}`,
      oldKey.toString('base64'),
      'EX',
      86400 * 90 // Keep for 90 days
    );
    
    console.log('Server keys rotated successfully');
  }

  // ========================
  // Utility Functions
  // ========================

  async encryptSensitiveData(data) {
    const masterKey = await this.getServerMasterKey();
    const encrypted = await this.encryptWithSymmetricKey(data, masterKey);
    return JSON.stringify(encrypted);
  }

  async decryptSensitiveData(encryptedData) {
    const masterKey = await this.getServerMasterKey();
    const parsed = JSON.parse(encryptedData);
    return this.decryptWithSymmetricKey(parsed, masterKey);
  }

  async getUserPublicKey(userId) {
    // Check cache first
    if (this.publicKeyStore.has(userId)) {
      return this.publicKeyStore.get(userId);
    }
    
    const key = await redisClient.get(`user:${userId}:public_key`);
    if (key) {
      this.publicKeyStore.set(userId, key);
    }
    return key;
  }

  async getUserPrivateKey(userId) {
    const encryptedKey = await redisClient.get(`user:${userId}:private_key`);
    if (!encryptedKey) {
      throw new Error('Private key not found');
    }
    
    // Decrypt private key
    return this.decryptPrivateKey(encryptedKey, userId);
  }

  async encryptPrivateKey(privateKey, userId) {
    // Use user-specific key derivation
    const salt = crypto.randomBytes(SALT_LENGTH);
    const key = crypto.pbkdf2Sync(
      userId + process.env.ENCRYPTION_SECRET,
      salt,
      ITERATION_COUNT,
      KEY_LENGTH,
      'sha256'
    );
    
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    const encrypted = Buffer.concat([
      cipher.update(privateKey, 'utf8'),
      cipher.final()
    ]);
    
    const tag = cipher.getAuthTag();
    
    return JSON.stringify({
      encrypted: encrypted.toString('base64'),
      salt: salt.toString('base64'),
      iv: iv.toString('base64'),
      tag: tag.toString('base64')
    });
  }

  async decryptPrivateKey(encryptedData, userId) {
    const { encrypted, salt, iv, tag } = JSON.parse(encryptedData);
    
    const key = crypto.pbkdf2Sync(
      userId + process.env.ENCRYPTION_SECRET,
      Buffer.from(salt, 'base64'),
      ITERATION_COUNT,
      KEY_LENGTH,
      'sha256'
    );
    
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      key,
      Buffer.from(iv, 'base64')
    );
    
    decipher.setAuthTag(Buffer.from(tag, 'base64'));
    
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encrypted, 'base64')),
      decipher.final()
    ]);
    
    return decrypted.toString('utf8');
  }

  generateKeyFingerprint(publicKey) {
    const hash = crypto.createHash('sha256');
    hash.update(publicKey);
    return hash.digest('hex').match(/.{2}/g).join(':').toUpperCase();
  }

  generateChannelId(userId1, userId2) {
    const sorted = [userId1, userId2].sort();
    return `channel:${sorted[0]}:${sorted[1]}`;
  }

  getMimeType(filename) {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.pdf': 'application/pdf',
      '.mp4': 'video/mp4',
      '.mp3': 'audio/mpeg'
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }

  async cleanupExpiredKeys() {
    // Clean up expired session keys
    for (const [channelId, data] of this.sessionKeys.entries()) {
      if (data.expiry && data.expiry < Date.now()) {
        this.sessionKeys.delete(channelId);
      }
    }
    
    // Clear old cached public keys
    if (this.publicKeyStore.size > 1000) {
      const keysToKeep = 500;
      const keys = Array.from(this.publicKeyStore.keys());
      for (let i = 0; i < keys.length - keysToKeep; i++) {
        this.publicKeyStore.delete(keys[i]);
      }
    }
  }
}

// Create singleton instance
const encryptionService = new EncryptionService();

module.exports = encryptionService;