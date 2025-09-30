const mongoose = require('mongoose');
const crypto = require('crypto');

const EncryptionKeySchema = new mongoose.Schema({
  // Key Identification
  keyId: {
    type: String,
    required: true,
    unique: true,
    index: true,
    default: () => crypto.randomUUID()
  },

  name: {
    type: String,
    required: true
  },

  description: String,

  // Key Properties
  purpose: {
    type: String,
    required: true,
    enum: [
      'master',
      'data_encryption',
      'field_encryption',
      'file_encryption',
      'session_encryption',
      'backup_encryption',
      'transport_encryption',
      'signing',
      'key_wrapping',
      'key_derivation'
    ]
  },

  algorithm: {
    type: String,
    required: true,
    enum: [
      'aes-128-gcm',
      'aes-256-gcm',
      'aes-256-cbc',
      'rsa-2048',
      'rsa-4096',
      'ecdsa-p256',
      'ecdsa-p384',
      'ed25519',
      'chacha20-poly1305'
    ]
  },

  keyType: {
    type: String,
    required: true,
    enum: ['symmetric', 'asymmetric']
  },

  // Key Material (encrypted)
  keyMaterial: {
    encryptedKey: {
      type: String,
      required: true,
      select: false
    },
    publicKey: String,
    keyLength: Number,
    salt: String,
    iv: String,
    tag: String,
    wrappedBy: String, // Key ID that wraps this key
    kek: String // Key encryption key reference
  },

  // Key Metadata
  metadata: {
    version: {
      type: Number,
      default: 1
    },
    fingerprint: {
      type: String,
      required: true
    },
    checksum: String,
    format: {
      type: String,
      enum: ['raw', 'pkcs8', 'spki', 'jwk', 'pem', 'der']
    },
    encoding: {
      type: String,
      enum: ['base64', 'hex', 'binary']
    },
    bits: Number,
    modulus: String,
    exponent: String,
    curve: String
  },

  // Lifecycle Management
  lifecycle: {
    state: {
      type: String,
      required: true,
      enum: [
        'pre_activation',
        'active',
        'suspended',
        'deactivated',
        'compromised',
        'destroyed',
        'destroyed_compromised'
      ],
      default: 'pre_activation'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    activatedAt: Date,
    suspendedAt: Date,
    deactivatedAt: Date,
    destroyedAt: Date,
    lastUsed: Date,
    lastRotated: Date,
    nextRotation: Date,
    expiresAt: Date,
    ttl: Number // Time to live in seconds
  },

  // Usage Restrictions
  usage: {
    encrypt: {
      type: Boolean,
      default: true
    },
    decrypt: {
      type: Boolean,
      default: true
    },
    sign: {
      type: Boolean,
      default: false
    },
    verify: {
      type: Boolean,
      default: false
    },
    wrap: {
      type: Boolean,
      default: false
    },
    unwrap: {
      type: Boolean,
      default: false
    },
    derive: {
      type: Boolean,
      default: false
    },
    maxOperations: Number,
    operationsCount: {
      type: Number,
      default: 0
    },
    allowedIPs: [String],
    allowedApplications: [String],
    allowedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SecureUser'
    }],
    deniedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SecureUser'
    }]
  },

  // Rotation and Versioning
  rotation: {
    enabled: {
      type: Boolean,
      default: true
    },
    schedule: {
      type: String,
      enum: ['manual', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly']
    },
    gracePeriod: Number, // Hours to keep old key active
    previousKeyId: String,
    nextKeyId: String,
    rotationCount: {
      type: Number,
      default: 0
    },
    autoRotate: {
      type: Boolean,
      default: false
    },
    rotationPolicy: {
      maxAge: Number, // Days
      maxOperations: Number,
      onCompromise: {
        type: String,
        enum: ['immediate', 'scheduled', 'manual']
      }
    }
  },

  // Ownership and Access Control
  ownership: {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SecureUser',
      required: true
    },
    department: String,
    project: String,
    environment: {
      type: String,
      enum: ['development', 'staging', 'production'],
      required: true
    },
    classification: {
      type: String,
      enum: ['public', 'internal', 'confidential', 'secret', 'top_secret'],
      default: 'confidential'
    }
  },

  // Compliance and Audit
  compliance: {
    standards: [{
      type: String,
      enum: ['FIPS-140-2', 'PCI-DSS', 'HIPAA', 'GDPR', 'SOC2', 'ISO-27001']
    }],
    certifications: [{
      standard: String,
      certifiedBy: String,
      certifiedAt: Date,
      expiresAt: Date,
      certificate: String
    }],
    auditRequired: {
      type: Boolean,
      default: true
    },
    lastAudit: Date,
    nextAudit: Date
  },

  // HSM/KMS Integration
  hsm: {
    enabled: {
      type: Boolean,
      default: false
    },
    provider: {
      type: String,
      enum: ['aws-kms', 'azure-keyvault', 'gcp-kms', 'hashicorp-vault', 'thales', 'safenet']
    },
    keyHandle: String,
    partition: String,
    slot: Number,
    label: String,
    backed: {
      type: Boolean,
      default: false
    }
  },

  // Key Derivation
  derivation: {
    masterKeyId: String,
    derivationPath: String,
    salt: String,
    info: String,
    context: String,
    iterations: Number,
    outputLength: Number
  },

  // Backup and Recovery
  backup: {
    enabled: {
      type: Boolean,
      default: true
    },
    locations: [{
      type: {
        type: String,
        enum: ['local', 'cloud', 'hsm', 'offline']
      },
      path: String,
      encrypted: Boolean,
      lastBackup: Date
    }],
    escrow: {
      enabled: Boolean,
      shares: Number,
      threshold: Number,
      custodians: [String]
    },
    recovery: {
      possible: Boolean,
      method: String,
      lastRecovery: Date,
      recoveryAttempts: Number
    }
  },

  // Performance Metrics
  performance: {
    avgEncryptTime: Number,
    avgDecryptTime: Number,
    totalOperations: Number,
    failedOperations: Number,
    successRate: Number,
    lastBenchmark: Date
  },

  // Security Events
  securityEvents: [{
    event: {
      type: String,
      enum: ['created', 'activated', 'used', 'rotated', 'suspended', 'compromised', 'destroyed']
    },
    timestamp: Date,
    actor: String,
    reason: String,
    details: mongoose.Schema.Types.Mixed
  }],

  // Tags and Metadata
  tags: [String],
  customMetadata: mongoose.Schema.Types.Mixed,

  // Deletion Protection
  deletionProtection: {
    enabled: {
      type: Boolean,
      default: true
    },
    scheduledDeletion: Date,
    pendingDeletion: {
      type: Boolean,
      default: false
    },
    deletionApprovedBy: [String],
    requiredApprovals: {
      type: Number,
      default: 2
    }
  }

}, {
  timestamps: true,
  collection: 'encryption_keys'
});

// Indexes
EncryptionKeySchema.index({ purpose: 1, 'lifecycle.state': 1 });
EncryptionKeySchema.index({ 'ownership.environment': 1, 'lifecycle.state': 1 });
EncryptionKeySchema.index({ 'lifecycle.expiresAt': 1 });
EncryptionKeySchema.index({ 'lifecycle.nextRotation': 1 });
EncryptionKeySchema.index({ 'metadata.fingerprint': 1 });

// Virtual Properties
EncryptionKeySchema.virtual('isActive').get(function() {
  return this.lifecycle.state === 'active';
});

EncryptionKeySchema.virtual('isExpired').get(function() {
  return this.lifecycle.expiresAt && this.lifecycle.expiresAt < new Date();
});

EncryptionKeySchema.virtual('needsRotation').get(function() {
  if (!this.rotation.enabled) return false;
  
  const now = new Date();
  if (this.lifecycle.nextRotation && this.lifecycle.nextRotation < now) return true;
  
  if (this.rotation.rotationPolicy) {
    const { maxAge, maxOperations } = this.rotation.rotationPolicy;
    
    if (maxAge) {
      const age = (now - this.lifecycle.createdAt) / (1000 * 60 * 60 * 24);
      if (age > maxAge) return true;
    }
    
    if (maxOperations && this.usage.operationsCount >= maxOperations) return true;
  }
  
  return false;
});

// Methods
EncryptionKeySchema.methods.activate = async function() {
  if (this.lifecycle.state !== 'pre_activation') {
    throw new Error('Key can only be activated from pre_activation state');
  }
  
  this.lifecycle.state = 'active';
  this.lifecycle.activatedAt = new Date();
  
  this.addSecurityEvent('activated', 'system', 'Key activated for use');
  
  return this.save();
};

EncryptionKeySchema.methods.suspend = async function(reason) {
  if (!['active', 'pre_activation'].includes(this.lifecycle.state)) {
    throw new Error('Key cannot be suspended from current state');
  }
  
  this.lifecycle.state = 'suspended';
  this.lifecycle.suspendedAt = new Date();
  
  this.addSecurityEvent('suspended', 'system', reason);
  
  return this.save();
};

EncryptionKeySchema.methods.rotate = async function() {
  if (!this.rotation.enabled) {
    throw new Error('Key rotation is not enabled');
  }
  
  // Create new version
  const newKey = new this.constructor({
    name: `${this.name}_v${this.metadata.version + 1}`,
    description: `Rotated from ${this.keyId}`,
    purpose: this.purpose,
    algorithm: this.algorithm,
    keyType: this.keyType,
    ownership: this.ownership,
    rotation: {
      ...this.rotation,
      previousKeyId: this.keyId
    },
    metadata: {
      ...this.metadata,
      version: this.metadata.version + 1
    }
  });
  
  // Generate new key material
  await newKey.generateKeyMaterial();
  
  // Update current key
  this.rotation.nextKeyId = newKey.keyId;
  this.lifecycle.lastRotated = new Date();
  this.rotation.rotationCount++;
  
  // Schedule deactivation after grace period
  if (this.rotation.gracePeriod) {
    this.lifecycle.deactivatedAt = new Date(Date.now() + this.rotation.gracePeriod * 60 * 60 * 1000);
  }
  
  this.addSecurityEvent('rotated', 'system', `Rotated to ${newKey.keyId}`);
  
  await this.save();
  await newKey.save();
  
  return newKey;
};

EncryptionKeySchema.methods.destroy = async function(reason, emergency = false) {
  if (this.deletionProtection.enabled && !emergency) {
    if (this.deletionProtection.requiredApprovals > this.deletionProtection.deletionApprovedBy.length) {
      throw new Error('Insufficient approvals for key destruction');
    }
  }
  
  // Overwrite key material
  this.keyMaterial.encryptedKey = crypto.randomBytes(256).toString('hex');
  
  this.lifecycle.state = emergency ? 'destroyed_compromised' : 'destroyed';
  this.lifecycle.destroyedAt = new Date();
  
  this.addSecurityEvent('destroyed', 'system', reason);
  
  return this.save();
};

EncryptionKeySchema.methods.incrementUsage = async function() {
  this.usage.operationsCount++;
  this.lifecycle.lastUsed = new Date();
  
  if (this.usage.maxOperations && this.usage.operationsCount >= this.usage.maxOperations) {
    await this.suspend('Maximum operations reached');
  }
  
  return this.save();
};

EncryptionKeySchema.methods.generateKeyMaterial = async function() {
  if (this.keyType === 'symmetric') {
    const keyLength = parseInt(this.algorithm.match(/\d+/)[0]) / 8;
    const key = crypto.randomBytes(keyLength);
    
    // Wrap with master key
    const wrapped = await this.wrapKey(key);
    this.keyMaterial.encryptedKey = wrapped.toString('base64');
    
    // Generate fingerprint
    this.metadata.fingerprint = crypto
      .createHash('sha256')
      .update(key)
      .digest('hex');
  } else {
    // Generate asymmetric key pair
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: parseInt(this.algorithm.match(/\d+/)[0]),
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });
    
    this.keyMaterial.publicKey = publicKey;
    this.keyMaterial.encryptedKey = await this.wrapKey(privateKey);
    
    // Generate fingerprint from public key
    this.metadata.fingerprint = crypto
      .createHash('sha256')
      .update(publicKey)
      .digest('hex');
  }
};

EncryptionKeySchema.methods.wrapKey = async function(keyMaterial) {
  // Implement key wrapping logic
  // This would typically use a master key or HSM
  const iv = crypto.randomBytes(16);
  const masterKey = Buffer.from(process.env.MASTER_KEY || 'default-master-key');
  
  const cipher = crypto.createCipheriv('aes-256-gcm', masterKey, iv);
  const encrypted = Buffer.concat([
    cipher.update(Buffer.isBuffer(keyMaterial) ? keyMaterial : Buffer.from(keyMaterial)),
    cipher.final()
  ]);
  
  this.keyMaterial.iv = iv.toString('base64');
  this.keyMaterial.tag = cipher.getAuthTag().toString('base64');
  
  return encrypted;
};

EncryptionKeySchema.methods.unwrapKey = async function() {
  if (!this.keyMaterial.encryptedKey) {
    throw new Error('No encrypted key material');
  }
  
  const masterKey = Buffer.from(process.env.MASTER_KEY || 'default-master-key');
  const iv = Buffer.from(this.keyMaterial.iv, 'base64');
  const tag = Buffer.from(this.keyMaterial.tag, 'base64');
  
  const decipher = crypto.createDecipheriv('aes-256-gcm', masterKey, iv);
  decipher.setAuthTag(tag);
  
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(this.keyMaterial.encryptedKey, 'base64')),
    decipher.final()
  ]);
  
  return decrypted;
};

EncryptionKeySchema.methods.addSecurityEvent = function(event, actor, reason, details = {}) {
  this.securityEvents.push({
    event,
    timestamp: new Date(),
    actor,
    reason,
    details
  });
  
  // Keep only last 100 events
  if (this.securityEvents.length > 100) {
    this.securityEvents = this.securityEvents.slice(-100);
  }
};

EncryptionKeySchema.methods.canBeUsedBy = function(userId) {
  if (this.usage.allowedUsers.length > 0) {
    return this.usage.allowedUsers.includes(userId);
  }
  
  if (this.usage.deniedUsers.length > 0) {
    return !this.usage.deniedUsers.includes(userId);
  }
  
  return true;
};

// Static Methods
EncryptionKeySchema.statics.findActiveKey = async function(purpose, environment) {
  return this.findOne({
    purpose,
    'ownership.environment': environment,
    'lifecycle.state': 'active'
  }).sort('-lifecycle.activatedAt');
};

EncryptionKeySchema.statics.rotateExpiredKeys = async function() {
  const keys = await this.find({
    'rotation.enabled': true,
    'lifecycle.state': 'active',
    $or: [
      { 'lifecycle.nextRotation': { $lt: new Date() } },
      { 'lifecycle.expiresAt': { $lt: new Date() } }
    ]
  });
  
  const results = [];
  for (const key of keys) {
    try {
      const newKey = await key.rotate();
      results.push({ success: true, oldKey: key.keyId, newKey: newKey.keyId });
    } catch (error) {
      results.push({ success: false, key: key.keyId, error: error.message });
    }
  }
  
  return results;
};

module.exports = mongoose.model('EncryptionKey', EncryptionKeySchema);