const crypto = require('crypto');

module.exports = {
  encryption: {
    algorithm: 'aes-256-gcm',
    keyDerivation: {
      algorithm: 'pbkdf2',
      iterations: 100000,
      keyLength: 32,
      digest: 'sha256'
    },
    fields: {
      user: ['email', 'phone', 'personalInfo'],
      message: ['content', 'attachments'],
      sensitive: ['creditCard', 'ssn', 'apiKeys']
    }
  },
  
  connection: {
    ssl: {
      enabled: process.env.NODE_ENV === 'production',
      rejectUnauthorized: true,
      ca: process.env.DB_SSL_CA,
      cert: process.env.DB_SSL_CERT,
      key: process.env.DB_SSL_KEY
    },
    pooling: {
      min: 2,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000
    }
  },
  
  audit: {
    enabled: true,
    logLevel: 'all', // all, write, none
    retention: 90, // days
    events: [
      'user.create', 'user.update', 'user.delete',
      'auth.login', 'auth.logout', 'auth.failed',
      'message.send', 'message.delete', 'message.edit',
      'admin.action', 'security.event'
    ]
  },
  
  backup: {
    enabled: true,
    schedule: '0 2 * * *', // 2 AM daily
    retention: 30, // days
    encryption: true,
    location: process.env.BACKUP_PATH || './backups'
  },
  
  sanitization: {
    removeOnDelete: true,
    overwritePasses: 3,
    pattern: crypto.randomBytes(32)
  }
};