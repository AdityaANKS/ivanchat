const crypto = require('crypto');

class EncryptionMiddleware {
  constructor(securityServices, config) {
    this.security = securityServices;
    this.config = config;
    this.algorithm = 'aes-256-gcm';
  }

  // Encrypt response data
  encryptResponse(options = {}) {
    return async (req, res, next) => {
      if (!this.shouldEncrypt(req, options)) {
        return next();
      }

      const originalSend = res.send;
      const originalJson = res.json;

      // Override send method
      res.send = function(data) {
        if (typeof data === 'string' || Buffer.isBuffer(data)) {
          const encrypted = this.encryptData(data, req.encryptionKey);
          res.set('X-Encrypted', 'true');
          res.set('X-Encryption-Method', this.algorithm);
          originalSend.call(res, encrypted);
        } else {
          originalSend.call(res, data);
        }
      }.bind(this);

      // Override json method
      res.json = function(obj) {
        const encrypted = this.encryptData(JSON.stringify(obj), req.encryptionKey);
        res.set('Content-Type', 'application/octet-stream');
        res.set('X-Encrypted', 'true');
        res.set('X-Original-Content-Type', 'application/json');
        originalSend.call(res, encrypted);
      }.bind(this);

      next();
    };
  }

  // Decrypt request data
  decryptRequest(options = {}) {
    return async (req, res, next) => {
      try {
        const isEncrypted = req.headers['x-encrypted'] === 'true';
        
        if (!isEncrypted) {
          return next();
        }

        const encryptionKey = await this.getEncryptionKey(req);
        
        if (!encryptionKey) {
          return res.status(400).json({ error: 'Encryption key required' });
        }

        // Decrypt body
        if (req.body && Buffer.isBuffer(req.body)) {
          try {
            const decrypted = await this.decryptData(req.body, encryptionKey);
            const contentType = req.headers['x-original-content-type'] || 'application/json';
            
            if (contentType === 'application/json') {
              req.body = JSON.parse(decrypted);
            } else {
              req.body = decrypted;
            }
          } catch (error) {
            await this.security.audit.logEvent({
              type: 'encryption.failed',
              severity: 'error',
              error: error.message,
              userId: req.user?.id
            });
            
            return res.status(400).json({ error: 'Decryption failed' });
          }
        }

        req.encryptionKey = encryptionKey;
        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // End-to-end encryption for messages
  e2eEncryption() {
    return async (req, res, next) => {
      try {
        if (!req.body.encrypted) {
          return next();
        }

        const { senderId, recipientId, encryptedContent, ephemeralKey } = req.body;

        // Verify sender
        if (req.user.id !== senderId) {
          return res.status(403).json({ error: 'Sender verification failed' });
        }

        // Store encrypted message without decrypting (zero-knowledge)
        req.e2eMessage = {
          senderId,
          recipientId,
          encryptedContent,
          ephemeralKey,
          timestamp: Date.now(),
          messageId: crypto.randomUUID()
        };

        // Add integrity check
        req.e2eMessage.mac = this.generateMAC(req.e2eMessage);

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // Field-level encryption
  encryptFields(fields = []) {
    return async (req, res, next) => {
      try {
        if (!req.body || fields.length === 0) {
          return next();
        }

        const encryptionKey = await this.getFieldEncryptionKey(req.user?.id);

        for (const field of fields) {
          const value = this.getNestedProperty(req.body, field);
          
          if (value !== undefined && value !== null) {
            const encrypted = await this.encryptField(value, encryptionKey);
            this.setNestedProperty(req.body, field, encrypted);
          }
        }

        req.encryptedFields = fields;
        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // Decrypt fields in response
  decryptFields(fields = []) {
    return async (req, res, next) => {
      const originalJson = res.json;

      res.json = async function(obj) {
        try {
          const decryptionKey = await this.getFieldEncryptionKey(req.user?.id);
          const decrypted = await this.decryptObjectFields(obj, fields, decryptionKey);
          originalJson.call(res, decrypted);
        } catch (error) {
          originalJson.call(res, { error: 'Decryption failed' });
        }
      }.bind(this);

      next();
    };
  }

  // File encryption
  encryptFile() {
    return async (req, res, next) => {
      try {
        if (!req.file && !req.files) {
          return next();
        }

        const files = req.files || [req.file];
        const encryptionKey = await this.security.keyManagement.generateKey('file-encryption');

        for (const file of files) {
          const encrypted = await this.security.mediaEncryption.encryptBuffer(
            file.buffer,
            encryptionKey.key
          );
          
          file.buffer = encrypted;
          file.encrypted = true;
          file.encryptionKeyId = encryptionKey.id;
          file.originalSize = file.size;
          file.size = encrypted.length;
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // Transport layer security validation
  enforceTransportSecurity() {
    return (req, res, next) => {
      // Check for HTTPS
      if (this.config.enforceHttps && !req.secure && req.headers['x-forwarded-proto'] !== 'https') {
        return res.status(403).json({ error: 'HTTPS required' });
      }

      // Check TLS version
      const tlsVersion = req.connection.getCipher?.()?.version;
      if (tlsVersion && this.config.minTlsVersion) {
        const version = parseFloat(tlsVersion.replace('TLSv', ''));
        if (version < parseFloat(this.config.minTlsVersion.replace('TLSv', ''))) {
          return res.status(403).json({ error: `Minimum TLS version ${this.config.minTlsVersion} required` });
        }
      }

      next();
    };
  }

  // Certificate pinning validation
  validateCertificatePinning() {
    return (req, res, next) => {
      const clientCert = req.connection.getPeerCertificate?.();
      
      if (!clientCert || !clientCert.fingerprint) {
        if (this.config.requireClientCert) {
          return res.status(403).json({ error: 'Client certificate required' });
        }
        return next();
      }

      const pinnedFingerprints = this.config.pinnedCertificates || [];
      
      if (pinnedFingerprints.length > 0 && !pinnedFingerprints.includes(clientCert.fingerprint)) {
        return res.status(403).json({ error: 'Certificate validation failed' });
      }

      req.clientCertificate = {
        fingerprint: clientCert.fingerprint,
        subject: clientCert.subject,
        issuer: clientCert.issuer,
        valid: clientCert.valid_to > Date.now()
      };

      next();
    };
  }

  // Homomorphic encryption for computations
  homomorphicEncryption() {
    return async (req, res, next) => {
      try {
        if (!req.body.homomorphic) {
          return next();
        }

        const { operation, encryptedValues } = req.body.homomorphic;
        
        // Perform operation on encrypted data without decrypting
        const result = await this.performHomomorphicOperation(operation, encryptedValues);
        
        req.homomorphicResult = result;
        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // Helper methods
  shouldEncrypt(req, options) {
    if (options.paths && !options.paths.includes(req.path)) {
      return false;
    }
    
    if (options.methods && !options.methods.includes(req.method)) {
      return false;
    }
    
    return req.headers['accept-encryption'] === 'true' || options.force;
  }

  async getEncryptionKey(req) {
    // Get key from header, session, or generate new
    const keyId = req.headers['x-encryption-key-id'];
    
    if (keyId) {
      const key = await this.security.keyManagement.getKey(keyId);
      return key.key;
    }
    
    // Generate ephemeral key for session
    return crypto.randomBytes(32);
  }

  async getFieldEncryptionKey(userId) {
    // Get user-specific field encryption key
    const keyId = `field-encryption-${userId}`;
    try {
      const key = await this.security.keyManagement.getKey(keyId);
      return key.key;
    } catch {
      const newKey = await this.security.keyManagement.generateKey('field-encryption', {
        metadata: { userId }
      });
      return newKey.key;
    }
  }

  encryptData(data, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);
    
    const encrypted = Buffer.concat([
      cipher.update(Buffer.isBuffer(data) ? data : Buffer.from(data)),
      cipher.final()
    ]);
    
    const tag = cipher.getAuthTag();
    
    return Buffer.concat([iv, tag, encrypted]);
  }

  decryptData(encryptedData, key) {
    const iv = encryptedData.slice(0, 16);
    const tag = encryptedData.slice(16, 32);
    const encrypted = encryptedData.slice(32);
    
    const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
    decipher.setAuthTag(tag);
    
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);
    
    return decrypted.toString();
  }

  async encryptField(value, key) {
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    const encrypted = this.encryptData(stringValue, key);
    
    return {
      _encrypted: true,
      _algorithm: this.algorithm,
      _data: encrypted.toString('base64')
    };
  }

  async decryptObjectFields(obj, fields, key) {
    const decrypted = JSON.parse(JSON.stringify(obj)); // Deep clone
    
    for (const field of fields) {
      const value = this.getNestedProperty(decrypted, field);
      
      if (value && value._encrypted) {
        const decryptedValue = this.decryptData(
          Buffer.from(value._data, 'base64'),
          key
        );
        
        try {
          this.setNestedProperty(decrypted, field, JSON.parse(decryptedValue));
        } catch {
          this.setNestedProperty(decrypted, field, decryptedValue);
        }
      }
    }
    
    return decrypted;
  }

  getNestedProperty(obj, path) {
    return path.split('.').reduce((curr, prop) => curr?.[prop], obj);
  }

  setNestedProperty(obj, path, value) {
    const parts = path.split('.');
    const last = parts.pop();
    const target = parts.reduce((curr, prop) => {
      if (!curr[prop]) curr[prop] = {};
      return curr[prop];
    }, obj);
    target[last] = value;
  }

  generateMAC(data) {
    const hmac = crypto.createHmac('sha256', this.config.macSecret || 'default');
    hmac.update(JSON.stringify(data));
    return hmac.digest('hex');
  }

  async performHomomorphicOperation(operation, encryptedValues) {
    // Simplified homomorphic operations
    // In production, use a proper homomorphic encryption library
    switch (operation) {
      case 'add':
        // Addition can be performed on certain encryption schemes
        return { encrypted: true, result: 'computed' };
      case 'multiply':
        // Multiplication in homomorphic encryption
        return { encrypted: true, result: 'computed' };
      default:
        throw new Error('Unsupported homomorphic operation');
    }
  }
}

module.exports = EncryptionMiddleware;