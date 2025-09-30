const helmet = require('helmet');
const crypto = require('crypto');

// Generate nonce for CSP
const generateNonce = () => crypto.randomBytes(16).toString('base64');

// Helmet configuration for maximum security
const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Will be replaced with nonce
        "https://cdn.jsdelivr.net",
        (req, res) => `'nonce-${res.locals.nonce}'`
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "blob:",
        "https:"
      ],
      connectSrc: [
        "'self'",
        "wss:",
        "https:"
      ],
      mediaSrc: [
        "'self'",
        "blob:"
      ],
      objectSrc: ["'none'"],
      childSrc: ["'self'"],
      frameSrc: ["'none'"],
      workerSrc: ["'self'", "blob:"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      manifestSrc: ["'self'"],
      upgradeInsecureRequests: [],
      blockAllMixedContent: []
    }
  },
  
  crossOriginEmbedderPolicy: true,
  
  crossOriginOpenerPolicy: {
    policy: "same-origin"
  },
  
  crossOriginResourcePolicy: {
    policy: "same-origin"
  },
  
  dnsPrefetchControl: {
    allow: false
  },
  
  frameguard: {
    action: 'deny'
  },
  
  hidePoweredBy: true,
  
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  
  ieNoOpen: true,
  
  noSniff: true,
  
  originAgentCluster: true,
  
  permittedCrossDomainPolicies: false,
  
  referrerPolicy: {
    policy: "strict-origin-when-cross-origin"
  },
  
  xssFilter: true
};

// Create helmet middleware
const helmetMiddleware = helmet(helmetConfig);

// Custom security headers middleware
const customSecurityHeaders = (req, res, next) => {
  // Generate and attach nonce for CSP
  res.locals.nonce = generateNonce();
  
  // Additional security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Download-Options', 'noopen');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  res.setHeader('Expect-CT', 'max-age=86400, enforce');
  res.setHeader('Feature-Policy', 
    "camera 'none'; " +
    "microphone 'self'; " +
    "geolocation 'none'; " +
    "payment 'none'; " +
    "usb 'none'; " +
    "magnetometer 'none'; " +
    "gyroscope 'none'; " +
    "accelerometer 'none'"
  );
  res.setHeader('Permissions-Policy',
    "camera=(), " +
    "microphone=(self), " +
    "geolocation=(), " +
    "payment=(), " +
    "usb=(), " +
    "magnetometer=(), " +
    "gyroscope=(), " +
    "accelerometer=()"
  );
  
  next();
};

// Report URI handler for CSP violations
const cspReportHandler = (req, res) => {
  if (req.body) {
    console.error('CSP Violation:', req.body);
    // Log to security monitoring system
    // You might want to send this to a security monitoring service
  }
  res.status(204).end();
};

module.exports = {
  helmetMiddleware,
  customSecurityHeaders,
  cspReportHandler,
  generateNonce
};