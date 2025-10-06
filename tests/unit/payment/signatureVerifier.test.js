const crypto = require('crypto');
const SignatureVerifier = require('../../../server/src/services/payment/SignatureVerifier');

describe('SignatureVerifier', () => {
  const secret = 'test_webhook_secret_key';
  const verifier = new SignatureVerifier();

  describe('verifyRazorpaySignature', () => {
    it('should verify valid Razorpay signature', () => {
      // Arrange
      const payload = JSON.stringify({ event: 'payment.captured' });
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

      // Act
      const isValid = verifier.verifyRazorpaySignature(
        payload,
        expectedSignature,
        secret
      );

      // Assert
      expect(isValid).toBe(true);
    });

    it('should reject invalid signature', () => {
      // Arrange
      const payload = JSON.stringify({ event: 'payment.captured' });
      const invalidSignature = 'invalid_signature';

      // Act
      const isValid = verifier.verifyRazorpaySignature(
        payload,
        invalidSignature,
        secret
      );

      // Assert
      expect(isValid).toBe(false);
    });

    it('should use timing-safe comparison', () => {
      // Arrange
      const payload = 'test_payload';
      const signature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');
      
      const spy = jest.spyOn(crypto, 'timingSafeEqual');

      // Act
      verifier.verifyRazorpaySignature(payload, signature, secret);

      // Assert
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('verifyCashfreeSignature', () => {
    it('should verify valid Cashfree signature', () => {
      // Arrange
      const timestamp = Date.now().toString();
      const payload = JSON.stringify({ orderId: 'order123' });
      const message = `${timestamp}${payload}`;
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(message)
        .digest('base64');

      // Act
      const isValid = verifier.verifyCashfreeSignature(
        payload,
        expectedSignature,
        secret,
        timestamp
      );

      // Assert
      expect(isValid).toBe(true);
    });

    it('should reject expired timestamp', () => {
      // Arrange
      const oldTimestamp = (Date.now() - 10 * 60 * 1000).toString(); // 10 minutes old
      const payload = JSON.stringify({ orderId: 'order123' });
      const signature = 'any_signature';

      // Act
      const isValid = verifier.verifyCashfreeSignature(
        payload,
        signature,
        secret,
        oldTimestamp
      );

      // Assert
      expect(isValid).toBe(false);
    });
  });

  describe('verifyGenericSignature', () => {
    it('should support multiple hash algorithms', () => {
      // Test SHA256
      const payload = 'test_payload';
      const sha256Signature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

      expect(
        verifier.verifyGenericSignature(payload, sha256Signature, secret, 'sha256')
      ).toBe(true);

      // Test SHA512
      const sha512Signature = crypto
        .createHmac('sha512', secret)
        .update(payload)
        .digest('hex');

      expect(
        verifier.verifyGenericSignature(payload, sha512Signature, secret, 'sha512')
      ).toBe(true);
    });
  });
});