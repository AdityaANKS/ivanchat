const authenticationMiddleware = require('./authentication.middleware');
const authorizationMiddleware = require('./authorization.middleware');
const encryptionMiddleware = require('./encryption.middleware');
const rateLimitMiddleware = require('./rateLimit.middleware');
const validationMiddleware = require('./validation.middleware');
const sanitizationMiddleware = require('./sanitization.middleware');
const { corsMiddleware, corsSecurityMiddleware } = require('./cors.middleware');
const { helmetMiddleware, customSecurityHeaders } = require('./helmet.middleware');
const { 
  auditMiddleware, 
  securityEventLogger,
  dataAccessAudit,
  adminActionAudit 
} = require('./audit.middleware');

// Security middleware stack builder
class SecurityMiddlewareStack {
  constructor() {
    this.middlewares = [];
  }

  // Add middleware to stack
  use(middleware) {
    this.middlewares.push(middleware);
    return this;
  }

  // Build the complete security stack
  build() {
    return [
      // Basic security headers
      helmetMiddleware,
      customSecurityHeaders,
      
      // CORS
      corsSecurityMiddleware,
      corsMiddleware,
      
      // Request sanitization and validation
      sanitizationMiddleware,
      validationMiddleware,
      
      // Rate limiting
      rateLimitMiddleware,
      
      // Audit logging
      auditMiddleware,
      securityEventLogger,
      
      // Authentication & Authorization
      authenticationMiddleware,
      authorizationMiddleware,
      
      // Encryption
      encryptionMiddleware,
      
      // Data access audit
      dataAccessAudit
    ];
  }

  // Get specific middleware combination
  getPublicStack() {
    return [
      helmetMiddleware,
      customSecurityHeaders,
      corsSecurityMiddleware,
      corsMiddleware,
      sanitizationMiddleware,
      validationMiddleware,
      rateLimitMiddleware,
      auditMiddleware
    ];
  }

  getAuthenticatedStack() {
    return [
      ...this.getPublicStack(),
      authenticationMiddleware,
      authorizationMiddleware,
      encryptionMiddleware,
      dataAccessAudit
    ];
  }

  getAdminStack() {
    return [
      ...this.getAuthenticatedStack(),
      adminActionAudit
    ];
  }

  getWebSocketStack() {
    return [
      authenticationMiddleware,
      encryptionMiddleware,
      rateLimitMiddleware
    ];
  }
}

// Create and export middleware stack
const securityStack = new SecurityMiddlewareStack();

module.exports = {
  // Individual middlewares
  authenticationMiddleware,
  authorizationMiddleware,
  encryptionMiddleware,
  rateLimitMiddleware,
  validationMiddleware,
  sanitizationMiddleware,
  corsMiddleware,
  corsSecurityMiddleware,
  helmetMiddleware,
  customSecurityHeaders,
  auditMiddleware,
  securityEventLogger,
  dataAccessAudit,
  adminActionAudit,
  
  // Middleware stacks
  securityStack,
  publicStack: securityStack.getPublicStack(),
  authenticatedStack: securityStack.getAuthenticatedStack(),
  adminStack: securityStack.getAdminStack(),
  webSocketStack: securityStack.getWebSocketStack(),
  
  // Full security middleware
  fullSecurityMiddleware: securityStack.build()
};