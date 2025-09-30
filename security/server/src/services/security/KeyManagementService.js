const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

class KeyManagementService {
  constructor(config) {
    this.config = config;
    this.keys = new Map();
    this.keyRotationInterval = 30 * 24 * 60 * 60 * 1000; // 30 days
    this.keyVersion = 1;
  }

  async initialize() {
    await this.loadMasterKey();
    await this.loadKeys();
    this.startKeyRotation();
  }

  async loadMasterKey() {
    const masterKeyPath = path.join(this.config.keyPath, 'master.key');
    
    try {
      const encryptedMaster = await fs.readFile(masterKeyPath);
      this.masterKey = await this.decryptMasterKey(encryptedMaster);
    } catch (error) {
      // Generate new master key if not exists
      this.masterKey = crypto.randomBytes(32);
      const encrypted = await this.encryptMasterKey(this.masterKey);
      await fs.writeFile(masterKeyPath, encrypted);
    }
  }

  async generateKey(purpose, options = {}) {
    const key = {
      id: crypto.randomUUID(),
      purpose,
      algorithm: options.algorithm || 'aes-256-gcm',
      key: crypto.randomBytes(options.length || 32),
      createdAt: new Date(),
      expiresAt: options.expiresAt || null,
      version: this.keyVersion,
      metadata: options.metadata || {}
    };

    // Encrypt key with master key
    key.encryptedKey = await this.encryptWithMaster(key.key);
    
    // Store key
    this.keys.set(key.id, key);
    await this.persistKey(key);

    return {
      id: key.id,
      version: key.version,
      createdAt: key.createdAt
    };
  }

  async getKey(keyId) {
    let key = this.keys.get(keyId);
    
    if (!key) {
      key = await this.loadKey(keyId);
      if (!key) {
        throw new Error('Key not found');
      }
    }

    // Check expiration
    if (key.expiresAt && new Date() > key.expiresAt) {
      throw new Error('Key has expired');
    }

    // Decrypt key
    const decryptedKey = await this.decryptWithMaster(key.encryptedKey);
    
    return {
      ...key,
      key: decryptedKey
    };
  }

  async rotateKey(keyId) {
    const oldKey = await this.getKey(keyId);
    
    // Generate new key
    const newKey = await this.generateKey(oldKey.purpose, {
      algorithm: oldKey.algorithm,
      metadata: { ...oldKey.metadata, rotatedFrom: keyId }
    });

    // Mark old key for deletion after grace period
    oldKey.deprecatedAt = new Date();
    oldKey.deleteAfter = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    await this.updateKey(oldKey);

    // Re-encrypt data with new key (handled by specific services)
    this.emit('keyRotated', { oldKeyId: keyId, newKeyId: newKey.id });

    return newKey;
  }

  async deleteKey(keyId) {
    const key = this.keys.get(keyId);
    
    if (key && !key.deleteAfter) {
      throw new Error('Cannot delete active key');
    }

    this.keys.delete(keyId);
    await this.removePersistedKey(keyId);
    
    // Secure deletion - overwrite memory
    if (key && key.key) {
      crypto.randomFillSync(key.key);
    }

    return { deleted: true };
  }

  async encryptWithMaster(data) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.masterKey, iv);
    
    const encrypted = Buffer.concat([
      cipher.update(data),
      cipher.final()
    ]);
    
    const tag = cipher.getAuthTag();
    
    return Buffer.concat([iv, tag, encrypted]);
  }

  async decryptWithMaster(encryptedData) {
    const iv = encryptedData.slice(0, 16);
    const tag = encryptedData.slice(16, 32);
    const encrypted = encryptedData.slice(32);
    
    const decipher = crypto.createDecipheriv('aes-256-gcm', this.masterKey, iv);
    decipher.setAuthTag(tag);
    
    return Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);
  }

  async createKeyPair(type = 'rsa', options = {}) {
    const { publicKey, privateKey } = crypto.generateKeyPairSync(type, {
      modulusLength: options.modulusLength || 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: options.passphrase || crypto.randomBytes(32).toString('hex')
      }
    });

    const keyPair = {
      id: crypto.randomUUID(),
      type,
      publicKey,
      privateKey: await this.encryptWithMaster(Buffer.from(privateKey)),
      createdAt: new Date(),
      metadata: options.metadata || {}
    };

    await this.persistKeyPair(keyPair);
    
    return {
      id: keyPair.id,
      publicKey: keyPair.publicKey
    };
  }

  async signData(data, keyPairId) {
    const keyPair = await this.loadKeyPair(keyPairId);
    const privateKey = await this.decryptWithMaster(keyPair.privateKey);
    
    const sign = crypto.createSign('SHA256');
    sign.update(data);
    sign.end();
    
    return sign.sign(privateKey.toString());
  }

  async verifySignature(data, signature, publicKey) {
    const verify = crypto.createVerify('SHA256');
    verify.update(data);
    verify.end();
    
    return verify.verify(publicKey, signature);
  }

  async exportKey(keyId, password) {
    const key = await this.getKey(keyId);
    
    // Encrypt for export
    const salt = crypto.randomBytes(32);
    const exportKey = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipheriv('aes-256-gcm', exportKey, iv);
    const encrypted = Buffer.concat([
      cipher.update(JSON.stringify(key)),
      cipher.final()
    ]);
    
    return {
      version: 1,
      salt: salt.toString('base64'),
      iv: iv.toString('base64'),
      tag: cipher.getAuthTag().toString('base64'),
      data: encrypted.toString('base64')
    };
  }

  async importKey(exportedKey, password) {
    const salt = Buffer.from(exportedKey.salt, 'base64');
    const iv = Buffer.from(exportedKey.iv, 'base64');
    const tag = Buffer.from(exportedKey.tag, 'base64');
    const data = Buffer.from(exportedKey.data, 'base64');
    
    const importKey = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
    const decipher = crypto.createDecipheriv('aes-256-gcm', importKey, iv);
    decipher.setAuthTag(tag);
    
    const decrypted = Buffer.concat([
      decipher.update(data),
      decipher.final()
    ]);
    
    const key = JSON.parse(decrypted.toString());
    
    // Re-encrypt with current master key
    key.encryptedKey = await this.encryptWithMaster(Buffer.from(key.key));
    key.id = crypto.randomUUID(); // Generate new ID
    
    this.keys.set(key.id, key);
    await this.persistKey(key);
    
    return { id: key.id };
  }

  startKeyRotation() {
    setInterval(() => {
      this.rotateExpiredKeys();
    }, 24 * 60 * 60 * 1000); // Daily check
  }

  async rotateExpiredKeys() {
    const now = new Date();
    
    for (const [keyId, key] of this.keys.entries()) {
      const age = now - key.createdAt;
      
      if (age > this.keyRotationInterval && !key.deprecatedAt) {
        try {
          await this.rotateKey(keyId);
        } catch (error) {
          console.error(`Failed to rotate key ${keyId}:`, error);
        }
      }
      
      // Delete expired deprecated keys
      if (key.deleteAfter && now > key.deleteAfter) {
        await this.deleteKey(keyId);
      }
    }
  }

  // Persistence methods (implement based on your storage solution)
  async persistKey(key) {
    // Store encrypted key in database or file system
  }

  async loadKey(keyId) {
    // Load encrypted key from storage
  }

  async updateKey(key) {
    // Update key in storage
  }

  async removePersistedKey(keyId) {
    // Remove key from storage
  }

  async persistKeyPair(keyPair) {
    // Store key pair
  }

  async loadKeyPair(keyPairId) {
    // Load key pair from storage
  }

  async loadKeys() {
    // Load all keys on startup
  }

  async encryptMasterKey(masterKey) {
    // Encrypt master key with hardware security module or KMS
    return masterKey; // Placeholder
  }

  async decryptMasterKey(encryptedMaster) {
    // Decrypt master key
    return encryptedMaster; // Placeholder
  }
}

module.exports = KeyManagementService;