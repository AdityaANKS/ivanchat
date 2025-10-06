const UPIPayloadBuilder = require('../../../server/src/services/payment/UPIPayloadBuilder');

describe('UPIPayloadBuilder', () => {
  const builder = new UPIPayloadBuilder();

  describe('buildUPIPayload', () => {
    it('should build valid UPI payment URL', () => {
      // Arrange
      const params = {
        pa: 'merchant@bank',
        pn: 'IvanChat',
        tr: 'TXN123456',
        tn: 'Premium Membership',
        am: '99.00',
        cu: 'INR'
      };

      // Act
      const payload = builder.buildUPIPayload(params);

      // Assert
      expect(payload).toBe('upi://pay?pa=merchant%40bank&pn=IvanChat&tr=TXN123456&tn=Premium%20Membership&am=99.00&cu=INR');
      expect(payload).toMatch(/^upi:\/\/pay\?/);
      expect(payload).toContain('pa=merchant%40bank');
      expect(payload).toContain('am=99.00');
    });

    it('should validate required parameters', () => {
      // Arrange
      const invalidParams = {
        pa: 'merchant@bank',
        // Missing required fields
      };

      // Act & Assert
      expect(() => {
        builder.buildUPIPayload(invalidParams);
      }).toThrow('Missing required UPI parameters');
    });

    it('should validate payee address format', () => {
      // Arrange
      const invalidParams = {
        pa: 'invalid-address', // Invalid format
        pn: 'Test',
        tr: 'TXN123',
        am: '100'
      };

      // Act & Assert
      expect(() => {
        builder.buildUPIPayload(invalidParams);
      }).toThrow('Invalid payee address format');
    });

    it('should validate amount format', () => {
      // Test negative amount
      expect(() => {
        builder.buildUPIPayload({
          pa: 'merchant@bank',
          pn: 'Test',
          tr: 'TXN123',
          am: '-100'
        });
      }).toThrow('Invalid amount');

      // Test zero amount
      expect(() => {
        builder.buildUPIPayload({
          pa: 'merchant@bank',
          pn: 'Test',
          tr: 'TXN123',
          am: '0'
        });
      }).toThrow('Invalid amount');
    });

    it('should add optional parameters when provided', () => {
      // Arrange
      const params = {
        pa: 'merchant@bank',
        pn: 'IvanChat',
        tr: 'TXN123',
        am: '99.00',
        cu: 'INR',
        mc: '5411', // Merchant category code
        tid: 'TID123', // Terminal ID
        url: 'https://ivanchat.com/verify'
      };

      // Act
      const payload = builder.buildUPIPayload(params);

      // Assert
      expect(payload).toContain('mc=5411');
      expect(payload).toContain('tid=TID123');
      expect(payload).toContain('url=https');
    });
  });

  describe('validateTransactionRef', () => {
    it('should accept valid transaction reference', () => {
      expect(
        builder.validateTransactionRef('TXN1234567890')
      ).toBe(true);
    });

    it('should reject transaction ref longer than 35 chars', () => {
      const longRef = 'A'.repeat(36);
      expect(
        builder.validateTransactionRef(longRef)
      ).toBe(false);
    });

    it('should reject transaction ref with special characters', () => {
      expect(
        builder.validateTransactionRef('TXN@123#456')
      ).toBe(false);
    });
  });

  describe('formatAmount', () => {
    it('should format amount to 2 decimal places', () => {
      expect(builder.formatAmount(99)).toBe('99.00');
      expect(builder.formatAmount(99.5)).toBe('99.50');
      expect(builder.formatAmount(99.999)).toBe('100.00');
    });

    it('should handle string amounts', () => {
      expect(builder.formatAmount('99')).toBe('99.00');
      expect(builder.formatAmount('99.5')).toBe('99.50');
    });
  });
});