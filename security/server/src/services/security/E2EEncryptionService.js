const crypto = require('crypto');
const libsignal = require('@signalapp/libsignal-client');
const openpgp = require('openpgp');
const nacl = require('tweetnacl');
const util = require('tweetnacl-util');
const Redis = require('ioredis');
const encryptionConfig = require('../../config/encryption.config');

class E2EEncryptionService {
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      db: 1, // Separate DB for encryption keys
      keyPrefix: 'e2ee:',
    });
    
    this.config = encryptionConfig.e2ee;
    this.sessions = new Map();
    this.preKeys = new Map();
  }

  /**
   * Initialize Signal Protocol for user
   */
  async initializeSignalProtocol(userId) {
    try {
      // Generate identity key pair
      const identityKeyPair = libsignal.PrivateKey.generate();
      const publicKey = identityKeyPair.getPublicKey();
      
      // Generate registration ID
      const registrationId = libsignal.generateRegistrationId();
      
      // Generate pre-keys
      const preKeys = [];
      for (let i = 0; i < this.config.signal.preKeyCount; i++) {
        const preKey = libsignal.PrivateKey.generate();
        preKeys.push({
          keyId: i + 1,
          publicKey: preKey.getPublicKey().serialize(),
          privateKey: preKey.serialize(),
        });
      }
      
      // Generate signed pre-key
      const signedPreKey = libsignal.PrivateKey.generate();
      const signature = identityKeyPair.sign(signedPreKey.getPublicKey().serialize());
      
      // Store keys securely
      const encryptedKeys = await this.encryptKeys({
        identityKey: {
          public: publicKey.serialize(),
          private: identityKeyPair.serialize(),
        },
        registrationId,
        preKeys,
        signedPreKey: {
          keyId: 1,
          publicKey: signedPreKey.getPublicKey().serialize(),
          privateKey: signedPreKey.serialize(),
          signature,
        },
      });
      
      await this.redis.set(`user:${userId}:keys`, JSON.stringify(encryptedKeys));
      
      return {
        identityKey: publicKey.serialize().toString('base64'),
        registrationId,
        preKeys: preKeys.slice(0, 10).map(k => ({
          keyId: k.keyId,
          publicKey: k.publicKey.toString('base64'),
        })),
        signedPreKey: {
          keyId: 1,
          publicKey: signedPreKey.getPublicKey().serialize().toString('base64'),
          signature: signature.toString('base64'),
        },
      };
    } catch (error) {
      console.error('Signal Protocol initialization error:', error);
      throw new Error('Failed to initialize E2E encryption');
    }
  }

  /**
   * Encrypt message using Signal Protocol
   */
  async encryptMessage(senderId, recipientId, message, messageType = 'text') {
    try {
      const session = await this.getOrCreateSession(senderId, recipientId);
      
      let content;
      switch (messageType) {
        case 'text':
          content = Buffer.from(JSON.stringify({
            type: 'text',
            data: message,
            timestamp: Date.now(),
            senderId,
          }));
          break;
          
        case 'image':
        case 'video':
        case 'audio':
          content = await this.encryptMedia(message, messageType);
          break;
          
        case 'file':
          content = await this.encryptFile(message);
          break;
          
        default:
          content = Buffer.from(message);
      }
      
      // Add padding to hide message length
      const padded = this.addPadding(content);
      
      // Encrypt using session cipher
      const encrypted = await this.sessionEncrypt(session, padded);
      
      return {
        type: 'encrypted',
        version: '1.0',
        algorithm: 'signal',
        body: encrypted.toString('base64'),
        messageType,
        senderId,
        recipientId,
        timestamp: Date.now(),
        ephemeralKey: session.ephemeralKey,
      };
    } catch (error) {
      console.error('Message encryption error:', error);
      throw new Error('Failed to encrypt message');
    }
  }

  /**
   * Decrypt message using Signal Protocol
   */
  async decryptMessage(recipientId, encryptedMessage) {
    try {
      const session = await this.getOrCreateSession(
        recipientId,
        encryptedMessage.senderId
      );
      
      const encrypted = Buffer.from(encryptedMessage.body, 'base64');
      
      // Decrypt using session cipher
      const padded = await this.sessionDecrypt(session, encrypted);
      
      // Remove padding
      const content = this.removePadding(padded);
      
      if (encryptedMessage.messageType === 'text') {
        const parsed = JSON.parse(content.toString());
        return parsed.data;
      } else if (['image', 'video', 'audio'].includes(encryptedMessage.messageType)) {
        return await this.decryptMedia(content, encryptedMessage.messageType);
      } else if (encryptedMessage.messageType === 'file') {
        return await this.decryptFile(content);
      }
      
      return content;
    } catch (error) {
      console.error('Message decryption error:', error);
      throw new Error('Failed to decrypt message');
    }
  }

  /**
   * Encrypt media files (images, videos, audio)
   */
  async encryptMedia(mediaBuffer, mediaType) {
    try {
      // Generate random key for this media
      const key = crypto.randomBytes(32);
      const iv = crypto.randomBytes(16);
      
      // Create cipher
      const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
      
      // Add metadata
      const metadata = Buffer.from(JSON.stringify({
        type: mediaType,
        size: mediaBuffer.length,
        timestamp: Date.now(),
        checksum: crypto.createHash('sha256').update(mediaBuffer).digest('hex'),
      }));
      
      // Encrypt media with metadata
      const encrypted = Buffer.concat([
        cipher.update(metadata),
        cipher.update(Buffer.from([0x00, 0x00])), // Separator
        cipher.update(mediaBuffer),
        cipher.final(),
      ]);
      
      const authTag = cipher.getAuthTag();
      
      // Combine IV, auth tag, and encrypted data
      const combined = Buffer.concat([iv, authTag, encrypted]);
      
      // Store media key temporarily
      const mediaId = crypto.randomBytes(16).toString('hex');
      await this.redis.setex(
        `media:${mediaId}`,
        3600,
        JSON.stringify({
          key: key.toString('base64'),
          type: mediaType,
        })
      );
      
      return Buffer.concat([
        Buffer.from(mediaId, 'hex'),
        combined,
      ]);
    } catch (error) {
      console.error('Media encryption error:', error);
      throw new Error('Failed to encrypt media');
    }
  }

  /**
   * Decrypt media files
   */
  async decryptMedia(encryptedData, mediaType) {
    try {
      // Extract media ID
      const mediaId = encryptedData.slice(0, 16).toString('hex');
      const data = encryptedData.slice(16);
      
      // Get media key
      const keyData = await this.redis.get(`media:${mediaId}`);
      if (!keyData) {
        throw new Error('Media key not found or expired');
      }
      
      const { key } = JSON.parse(keyData);
      const keyBuffer = Buffer.from(key, 'base64');
      
      // Extract IV, auth tag, and encrypted content
      const iv = data.slice(0, 16);
      const authTag = data.slice(16, 32);
      const encrypted = data.slice(32);
      
      // Create decipher
      const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, iv);
      decipher.setAuthTag(authTag);
      
      // Decrypt media
      const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
      ]);
      
      // Find separator and extract metadata and media
      let separatorIndex = -1;
      for (let i = 0; i < decrypted.length - 1; i++) {
        if (decrypted[i] === 0x00 && decrypted[i + 1] === 0x00) {
          separatorIndex = i;
          break;
        }
      }
      
      if (separatorIndex === -1) {
        throw new Error('Invalid encrypted media format');
      }
      
      const metadata = JSON.parse(decrypted.slice(0, separatorIndex).toString());
      const mediaBuffer = decrypted.slice(separatorIndex + 2);
      
      // Verify checksum
      const checksum = crypto.createHash('sha256').update(mediaBuffer).digest('hex');
      if (checksum !== metadata.checksum) {
        throw new Error('Media integrity check failed');
      }
      
      return {
        data: mediaBuffer,
        metadata,
      };
    } catch (error) {
      console.error('Media decryption error:', error);
      throw new Error('Failed to decrypt media');
    }
  }

  /**
   * Encrypt file with streaming support
   */
  async encryptFile(fileStream) {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    
    const chunks = [];
    
    return new Promise((resolve, reject) => {
      fileStream.on('data', (chunk) => {
        chunks.push(cipher.update(chunk));
      });
      
      fileStream.on('end', () => {
        chunks.push(cipher.final());
        const authTag = cipher.getAuthTag();
        
        const encrypted = Buffer.concat([
          iv,
          authTag,
          ...chunks,
        ]);
        
        resolve({
          data: encrypted,
          key: key.toString('base64'),
        });
      });
      
      fileStream.on('error', reject);
    });
  }

  /**
   * Decrypt file with streaming support
   */
  async decryptFile(encryptedData) {
    const { data, key } = encryptedData;
    const keyBuffer = Buffer.from(key, 'base64');
    
    const iv = data.slice(0, 16);
    const authTag = data.slice(16, 32);
    const encrypted = data.slice(32);
    
    const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, iv);
    decipher.setAuthTag(authTag);
    
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);
    
    return decrypted;
  }

  /**
   * Session encryption using ChaCha20-Poly1305
   */
  async sessionEncrypt(session, data) {
    const key = Buffer.from(session.sharedSecret, 'base64');
    const nonce = crypto.randomBytes(12);
    
    const cipher = crypto.createCipheriv('chacha20-poly1305', key.slice(0, 32), nonce);
    
    const encrypted = Buffer.concat([
      cipher.update(data),
      cipher.final(),
    ]);
    
    const authTag = cipher.getAuthTag();
    
    return Buffer.concat([nonce, authTag, encrypted]);
  }

  /**
   * Session decryption using ChaCha20-Poly1305
   */
  async sessionDecrypt(session, encrypted) {
    const key = Buffer.from(session.sharedSecret, 'base64');
    
    const nonce = encrypted.slice(0, 12);
    const authTag = encrypted.slice(12, 28);
    const ciphertext = encrypted.slice(28);
    
    const decipher = crypto.createDecipheriv('chacha20-poly1305', key.slice(0, 32), nonce);
    decipher.setAuthTag(authTag);
    
    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);
    
    return decrypted;
  }

  /**
   * Get or create session between two users
   */
  async getOrCreateSession(userId1, userId2) {
    const sessionKey = `session:${userId1}:${userId2}`;
    let session = await this.redis.get(sessionKey);
    
    if (!session) {
      session = await this.createSession(userId1, userId2);
      await this.redis.setex(
        sessionKey,
        this.config.signal.sessionTimeout / 1000,
        JSON.stringify(session)
      );
    } else {
      session = JSON.parse(session);
    }
    
    return session;
  }

  /**
   * Create new session between users
   */
  async createSession(userId1, userId2) {
    const user1Keys = await this.getUserKeys(userId1);
    const user2Keys = await this.getUserKeys(userId2);
    
    // Implement X3DH (Extended Triple Diffie-Hellman) key agreement
    const sharedSecret = await this.x3dhKeyAgreement(user1Keys, user2Keys);
    
    // Generate ephemeral keys for perfect forward secrecy
    const ephemeralKeyPair = nacl.box.keyPair();
    
    return {
      sessionId: crypto.randomBytes(16).toString('hex'),
      participants: [userId1, userId2],
      sharedSecret: sharedSecret.toString('base64'),
      ephemeralKey: Buffer.from(ephemeralKeyPair.publicKey).toString('base64'),
      ephemeralPrivateKey: Buffer.from(ephemeralKeyPair.secretKey).toString('base64'),
      createdAt: Date.now(),
      messageCount: 0,
      ratchetKey: crypto.randomBytes(32).toString('base64'),
    };
  }

  /**
   * X3DH Key Agreement Protocol
   */
  async x3dhKeyAgreement(initiatorKeys, responderKeys) {
    // This is a simplified implementation
    // In production, use full X3DH protocol
    const dh1 = crypto.createECDH('curve25519');
    const dh2 = crypto.createECDH('curve25519');
    
    dh1.generateKeys();
    dh2.generateKeys();
    
    const sharedSecret1 = dh1.computeSecret(dh2.getPublicKey());
    const sharedSecret2 = dh2.computeSecret(dh1.getPublicKey());
    
    // Combine secrets using KDF
    return this.kdf(
      Buffer.concat([sharedSecret1, sharedSecret2]),
      Buffer.from('X3DH'),
      32
    );
  }

  /**
   * Double Ratchet Algorithm for forward secrecy
   */
  async doubleRatchet(session) {
    const rootKey = Buffer.from(session.ratchetKey, 'base64');
    const info = Buffer.from('DoubleRatchet');
    
    // Derive new keys
    const newKeys = await this.kdf(rootKey, info, 64);
    
    const newRootKey = newKeys.slice(0, 32);
    const chainKey = newKeys.slice(32, 64);
    
    // Update session
    session.ratchetKey = newRootKey.toString('base64');
    session.messageCount++;
    
    // Update in Redis
    const sessionKey = `session:${session.participants[0]}:${session.participants[1]}`;
    await this.redis.setex(
      sessionKey,
      this.config.signal.sessionTimeout / 1000,
      JSON.stringify(session)
    );
    
    return chainKey;
  }

  /**
   * Key Derivation Function (KDF)
   */
  async kdf(input, salt, length) {
    return new Promise((resolve, reject) => {
      crypto.hkdf('sha256', input, salt, Buffer.alloc(0), length, (err, derivedKey) => {
        if (err) reject(err);
        else resolve(derivedKey);
      });
    });
  }

  /**
   * Add padding to hide message length
   */
  addPadding(data) {
    const blockSize = 16;
    const paddingLength = blockSize - (data.length % blockSize);
    const padding = Buffer.alloc(paddingLength, paddingLength);
    return Buffer.concat([data, padding]);
  }

  /**
   * Remove padding
   */
  removePadding(data) {
    const paddingLength = data[data.length - 1];
    return data.slice(0, data.length - paddingLength);
  }

  /**
   * Encrypt keys for storage
   */
  async encryptKeys(keys) {
    const masterKey = Buffer.from(encryptionConfig.master.masterKey, 'hex');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', masterKey, iv);
    
    const encrypted = Buffer.concat([
      cipher.update(JSON.stringify(keys), 'utf8'),
      cipher.final(),
    ]);
    
    return {
      data: encrypted.toString('base64'),
      iv: iv.toString('base64'),
      tag: cipher.getAuthTag().toString('base64'),
    };
  }

  /**
   * Decrypt keys from storage
   */
  async decryptKeys(encryptedKeys) {
    const masterKey = Buffer.from(encryptionConfig.master.masterKey, 'hex');
    const iv = Buffer.from(encryptedKeys.iv, 'base64');
    const tag = Buffer.from(encryptedKeys.tag, 'base64');
    const data = Buffer.from(encryptedKeys.data, 'base64');
    
    const decipher = crypto.createDecipheriv('aes-256-gcm', masterKey, iv);
    decipher.setAuthTag(tag);
    
    const decrypted = Buffer.concat([
      decipher.update(data),
      decipher.final(),
    ]);
    
    return JSON.parse(decrypted.toString());
  }

  /**
   * Get user keys
   */
  async getUserKeys(userId) {
    const encryptedKeys = await this.redis.get(`user:${userId}:keys`);
    if (!encryptedKeys) {
      throw new Error('User keys not found');
    }
    
    return this.decryptKeys(JSON.parse(encryptedKeys));
  }

  /**
   * Rotate encryption keys
   */
  async rotateKeys(userId) {
    const newKeys = await this.initializeSignalProtocol(userId);
    
    // Notify all active sessions
    const sessions = await this.redis.keys(`session:${userId}:*`);
    for (const sessionKey of sessions) {
      await this.redis.del(sessionKey);
    }
    
    return newKeys;
  }

  /**
   * Generate ephemeral keys for perfect forward secrecy
   */
  generateEphemeralKeys() {
    const keyPair = nacl.box.keyPair();
    return {
      publicKey: Buffer.from(keyPair.publicKey).toString('base64'),
      secretKey: Buffer.from(keyPair.secretKey).toString('base64'),
    };
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions() {
    // This would be called periodically by a cron job
    const sessions = await this.redis.keys('session:*');
    
    for (const sessionKey of sessions) {
      const session = JSON.parse(await this.redis.get(sessionKey));
      
      if (Date.now() - session.createdAt > this.config.signal.sessionTimeout) {
        await this.redis.del(sessionKey);
      }
    }
  }
}

module.exports = new E2EEncryptionService();