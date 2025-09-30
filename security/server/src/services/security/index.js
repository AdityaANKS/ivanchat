const PasswordService = require('./PasswordService');
const E2EEncryptionService = require('./E2EEncryptionService');
const TokenService = require('./TokenService');
const TwoFactorAuthService = require('./TwoFactorAuthService');
const AuditService = require('./AuditService');
const MediaEncryptionService = require('./MediaEncryptionService');
const KeyManagementService = require('./KeyManagementService');
const ZeroKnowledgeProofService = require('./ZeroKnowledgeProofService');
const BiometricAuthService = require('./BiometricAuthService');

// Initialize services
const passwordService = new PasswordService();
const e2eEncryptionService = new E2EEncryptionService();
const tokenService = new TokenService();
const twoFactorAuthService = new TwoFactorAuthService();
const auditService = new AuditService();
const mediaEncryptionService = new MediaEncryptionService();
const keyManagementService = new KeyManagementService();
const zeroKnowledgeProofService = new ZeroKnowledgeProofService();
const biometricAuthService = new BiometricAuthService();

// Security service orchestrator
class SecurityServices {
  constructor() {
    this.services = {
      password: passwordService,
      e2e: e2eEncryptionService,
      token: tokenService,
      twoFactor: twoFactorAuthService,
      audit: auditService,
      media: mediaEncryptionService,
      keys: keyManagementService,
      zkp: zeroKnowledgeProofService,
      biometric: biometricAuthService
    };
  }

  // Get specific service
  getService(serviceName) {
    return this.services[serviceName];
  }

  // Initialize all services
  async initialize() {
    console.log('Initializing security services...');
    
    try {
      // Initialize each service that has an init method
      for (const [name, service] of Object.entries(this.services)) {
        if (typeof service.initialize === 'function') {
          await service.initialize();
          console.log(`✓ ${name} service initialized`);
        }
      }
      
      console.log('All security services initialized successfully');
    } catch (error) {
      console.error('Failed to initialize security services:', error);
      throw error;
    }
  }

  // Health check for all services
  async healthCheck() {
    const health = {};
    
    for (const [name, service] of Object.entries(this.services)) {
      if (typeof service.healthCheck === 'function') {
        health[name] = await service.healthCheck();
      } else {
        health[name] = { status: 'ok', message: 'No health check implemented' };
      }
    }
    
    return health;
  }

  // Cleanup all services
  async cleanup() {
    for (const [name, service] of Object.entries(this.services)) {
      if (typeof service.cleanup === 'function') {
        await service.cleanup();
      }
    }
  }
}

// Export singleton instance
const securityServices = new SecurityServices();

module.exports = {
  securityServices,
  passwordService,
  e2eEncryptionService,
  tokenService,
  twoFactorAuthService,
  auditService,
  mediaEncryptionService,
  keyManagementService,
  zeroKnowledgeProofService,
  biometricAuthService
};