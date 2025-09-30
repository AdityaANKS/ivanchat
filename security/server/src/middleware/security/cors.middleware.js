const cors = require('cors');

// CORS configuration for secure chat application
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',');
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in whitelist
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  
  credentials: true,
  
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-CSRF-Token',
    'X-E2E-Key',
    'X-Session-Id',
    'X-Device-Id',
    'X-Client-Version'
  ],
  
  exposedHeaders: [
    'X-Rate-Limit-Limit',
    'X-Rate-Limit-Remaining',
    'X-Rate-Limit-Reset',
    'X-Response-Time',
    'X-Request-Id'
  ],
  
  maxAge: 86400, // 24 hours
  
  preflightContinue: false,
  
  optionsSuccessStatus: 204
};

// Create CORS middleware with security enhancements
const corsMiddleware = cors(corsOptions);

// Additional CORS security middleware
const corsSecurityMiddleware = (req, res, next) => {
  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Check for suspicious origins
  const origin = req.get('origin') || req.get('referer');
  if (origin) {
    const suspiciousPatterns = [
      /^file:\/\//,
      /^data:/,
      /localhost.*\..*/, // Suspicious localhost with extra domains
    ];
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(origin)) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Suspicious origin detected'
        });
      }
    }
  }
  
  next();
};

// WebSocket CORS handler
const websocketCors = (request, callback) => {
  const origin = request.headers.origin;
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',');
  
  if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
    callback(null, true);
  } else {
    callback('Unauthorized origin', false);
  }
};

module.exports = {
  corsMiddleware,
  corsSecurityMiddleware,
  websocketCors,
  corsOptions
};