// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret';
process.env.RAZORPAY_WEBHOOK_SECRET = 'test_webhook_secret';

// Mock console methods to reduce noise
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn()
};

// Add custom matchers
expect.extend({
  toBeValidUUID(received) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const pass = uuidRegex.test(received);
    
    return {
      pass,
      message: () => 
        pass
          ? `Expected ${received} not to be a valid UUID`
          : `Expected ${received} to be a valid UUID`
    };
  },
  
  toBeValidQRCode(received) {
    const pass = received && received.startsWith('data:image/png;base64,');
    
    return {
      pass,
      message: () =>
        pass
          ? `Expected ${received} not to be a valid QR code`
          : `Expected ${received} to be a valid QR code data URI`
    };
  }
});

// Global test utilities
global.testUtils = {
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  randomEmail: () => `test_${Date.now()}@example.com`,
  
  randomUsername: () => `user_${Date.now()}`
};