const crypto = require('crypto');
const path = require('path');

module.exports = {
  // Application Security Settings
  app: {
    environment: process.env.NODE_ENV || 'development',
    trustProxy: true,
    port: process.env.PORT || 443,
    host: process.env.HOST || '0.0.0.0',
    domain: process.env.DOMAIN || 'localhost',
  },

  // Password Policy
  password: {
    algorithm: 'argon2id',
    minLength: 12,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    saltLength: 32,
    pepper: process.env.PASSWORD_PEPPER || crypto.randomBytes(64).toString('hex'),
    
    // Argon2id settings (most secure)
    argon2: {
      type: 2, // argon2id
      memoryCost: 65536, // 64 MB
      timeCost: 3,
      parallelism: 4,
      hashLength: 64,
      version: 0x13, // Version 1.3
    },
    
    // Password history
    history: {
      enabled: true,
      count: 5,
      minAgeDays: 1,
    },
    
    // Password expiry
    expiry: {
      enabled: true,
      days: 90,
      warningDays: 14,
    },
    
    // Account lockout
    lockout: {
      enabled: true,
      maxAttempts: 5,
      duration: 30 * 60 * 1000, // 30 minutes
      resetTime: 24 * 60 * 60 * 1000, // 24 hours
    },
  },

  // JWT Configuration
  jwt: {
    algorithm: 'RS256',
    accessToken: {
      expiresIn: '15m',
      issuer: 'ivan-secure',
      audience: 'ivan-api',
    },
    refreshToken: {
      expiresIn: '7d',
      issuer: 'ivan-secure',
      audience: 'ivan-refresh',
    },
    idToken: {
      expiresIn: '1h',
      issuer: 'ivan-secure',
      audience: 'ivan-identity',
    },
    privateKey: process.env.JWT_PRIVATE_KEY,
    publicKey: process.env.JWT_PUBLIC_KEY,
    kid: process.env.JWT_KID || crypto.randomBytes(16).toString('hex'),
  },

  // Session Configuration
  session: {
    name: 'ivan_session',
    secret: process.env.SESSION_SECRET || crypto.randomBytes(64).toString('hex'),
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'strict',
      domain: process.env.COOKIE_DOMAIN,
      path: '/',
    },
    store: {
      type: 'redis',
      prefix: 'sess:',
      ttl: 7 * 24 * 60 * 60, // 7 days in seconds
    },
  },

  // Rate Limiting
  rateLimit: {
    global: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100,
      message: 'Too many requests from this IP',
      standardHeaders: true,
      legacyHeaders: false,
    },
    api: {
      windowMs: 1 * 60 * 1000, // 1 minute
      max: 30,
    },
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5,
      skipSuccessfulRequests: true,
    },
    upload: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 10,
    },
  },

  // CORS Configuration
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID', 'X-API-Key'],
    exposedHeaders: ['X-Request-ID', 'X-RateLimit-Limit', 'X-RateLimit-Remaining'],
    maxAge: 86400, // 24 hours
    preflightContinue: false,
    optionsSuccessStatus: 204,
  },

  // Security Headers (Helmet)
  headers: {
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'wss:', 'https:'],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        workerSrc: ["'self'", 'blob:'],
        childSrc: ["'self'", 'blob:'],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        manifestSrc: ["'self'"],
        scriptSrcAttr: ["'none'"],
        styleSrcAttr: ["'unsafe-inline'"],
        upgradeInsecureRequests: [],
      },
      reportOnly: false,
    },
    crossOriginEmbedderPolicy: { policy: 'require-corp' },
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'same-origin' },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    ieNoOpen: true,
    noSniff: true,
    originAgentCluster: true,
    permittedCrossDomainPolicies: false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true,
  },

  // File Upload Security
  upload: {
    maxFileSize: 100 * 1024 * 1024, // 100MB
    maxFiles: 10,
    allowedMimeTypes: {
      images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
      videos: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
      audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm'],
      documents: ['application/pdf', 'text/plain', 'application/msword'],
    },
    scanForViruses: true,
    encryptUploads: true,
    storageType: 'encrypted-s3', // 'local', 's3', 'encrypted-s3'
    tempDir: path.join(__dirname, '../../../temp'),
    uploadDir: path.join(__dirname, '../../../uploads'),
  },

  // API Security
  api: {
    requireApiKey: true,
    apiKeyHeader: 'X-API-Key',
    apiKeyLength: 32,
    requestSigning: true,
    signatureHeader: 'X-Signature',
    timestampHeader: 'X-Timestamp',
    timestampTolerance: 5 * 60 * 1000, // 5 minutes
    ipWhitelist: process.env.IP_WHITELIST?.split(',') || [],
    ipBlacklist: process.env.IP_BLACKLIST?.split(',') || [],
  },

  // Two-Factor Authentication
  twoFactor: {
    enabled: true,
    issuer: 'Ivan Secure Chat',
    algorithm: 'sha256',
    digits: 6,
    period: 30,
    window: 2,
    backupCodes: 10,
    qrCodeSize: 200,
  },

  // Biometric Authentication
  biometric: {
    enabled: true,
    webauthn: {
      rpName: 'Ivan Secure Chat',
      rpID: process.env.DOMAIN || 'localhost',
      origin: process.env.APP_URL || 'http://localhost:3000',
      timeout: 60000,
      userVerification: 'preferred',
      attestation: 'none',
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        requireResidentKey: false,
        userVerification: 'preferred',
      },
    },
  },

  // Audit Logging
  audit: {
    enabled: true,
    logLevel: 'info', // 'debug', 'info', 'warn', 'error'
    logRequests: true,
    logResponses: false,
    logErrors: true,
    logAuthentication: true,
    logAuthorization: true,
    logDataAccess: true,
    logFileAccess: true,
    retention: 90, // days
    storage: 'database', // 'file', 'database', 'elasticsearch'
  },

  // Monitoring & Alerting
  monitoring: {
    enabled: true,
    metrics: true,
    healthCheck: true,
    alerting: {
      enabled: true,
      channels: ['email', 'slack'],
      thresholds: {
        errorRate: 0.01, // 1%
        responseTime: 1000, // ms
        cpuUsage: 80, // %
        memoryUsage: 80, // %
      },
    },
  },

  // Zero Trust Security
  zeroTrust: {
    enabled: true,
    verifyEveryRequest: true,
    contextualAccess: true,
    deviceTrust: true,
    continuousVerification: true,
  },
};