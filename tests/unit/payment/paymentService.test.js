const PaymentService = require('../../../server/src/services/payment/PaymentService');
const Order = require('../../../server/src/models/Order');
const Payment = require('../../../server/src/models/Payment');
const QRCodeService = require('../../../server/src/services/payment/QRCodeService');
const { mockOrder, mockPayment, mockUser } = require('../../fixtures/payments.fixture');

jest.mock('../../../server/src/models/Order');
jest.mock('../../../server/src/models/Payment');
jest.mock('../../../server/src/services/payment/QRCodeService');

describe('PaymentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPaymentOrder', () => {
    it('should create a payment order with valid inputs', async () => {
      // Arrange
      const userId = 'user123';
      const planId = 'monthly';
      const expectedOrder = mockOrder({ userId, planId });
      
      Order.create = jest.fn().mockResolvedValue(expectedOrder);
      QRCodeService.generateQR = jest.fn().mockResolvedValue('data:image/png;base64,xxx');

      // Act
      const result = await PaymentService.createPaymentOrder(userId, planId);

      // Assert
      expect(Order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId,
          planId,
          amount: 99,
          currency: 'INR',
          status: 'pending'
        })
      );
      expect(result).toHaveProperty('orderId');
      expect(result).toHaveProperty('transactionRef');
      expect(result).toHaveProperty('qrImageUrl');
      expect(result.amount).toBe(99);
    });

    it('should throw error for invalid plan', async () => {
      // Arrange
      const userId = 'user123';
      const planId = 'invalid_plan';

      // Act & Assert
      await expect(
        PaymentService.createPaymentOrder(userId, planId)
      ).rejects.toThrow('Invalid plan selected');
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      Order.create = jest.fn().mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(
        PaymentService.createPaymentOrder('user123', 'monthly')
      ).rejects.toThrow('Failed to create payment order');
    });

    it('should set correct expiry time for orders', async () => {
      // Arrange
      const userId = 'user123';
      const planId = 'monthly';
      let capturedOrder;
      
      Order.create = jest.fn().mockImplementation((order) => {
        capturedOrder = order;
        return Promise.resolve(mockOrder(order));
      });

      // Act
      await PaymentService.createPaymentOrder(userId, planId);

      // Assert
      const expiryTime = new Date(capturedOrder.expiresAt) - new Date();
      expect(expiryTime).toBeGreaterThan(29 * 60 * 1000); // > 29 minutes
      expect(expiryTime).toBeLessThan(31 * 60 * 1000); // < 31 minutes
    });
  });

  describe('processPayment', () => {
    it('should process successful payment correctly', async () => {
      // Arrange
      const webhookData = {
        transactionRef: 'txn123',
        providerTransactionId: 'pay123',
        amount: 99,
        status: 'success'
      };

      const order = mockOrder({ 
        transactionRef: 'txn123',
        amount: 99,
        status: 'pending'
      });

      Order.findOne = jest.fn().mockResolvedValue(order);
      Payment.findOneAndUpdate = jest.fn().mockResolvedValue(mockPayment(webhookData));
      order.save = jest.fn().mockResolvedValue(order);

      // Act
      const result = await PaymentService.processPayment(webhookData);

      // Assert
      expect(result.success).toBe(true);
      expect(order.status).toBe('paid');
      expect(order.save).toHaveBeenCalled();
    });

    it('should handle amount mismatch', async () => {
      // Arrange
      const webhookData = {
        transactionRef: 'txn123',
        amount: 199, // Wrong amount
        status: 'success'
      };

      const order = mockOrder({ 
        transactionRef: 'txn123',
        amount: 99,
        status: 'pending'
      });

      Order.findOne = jest.fn().mockResolvedValue(order);

      // Act
      const result = await PaymentService.processPayment(webhookData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Amount mismatch');
      expect(order.status).toBe('pending-review');
    });

    it('should be idempotent for duplicate webhooks', async () => {
      // Arrange
      const webhookData = {
        transactionRef: 'txn123',
        providerTransactionId: 'pay123',
        amount: 99,
        status: 'success'
      };

      const existingPayment = mockPayment({
        ...webhookData,
        status: 'success'
      });

      Payment.findOne = jest.fn().mockResolvedValue(existingPayment);

      // Act
      const result = await PaymentService.processPayment(webhookData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.duplicate).toBe(true);
      expect(Payment.findOneAndUpdate).not.toHaveBeenCalled();
    });
  });

  describe('validatePaymentAmount', () => {
    it('should accept exact amount match', () => {
      expect(
        PaymentService.validatePaymentAmount(100, 100)
      ).toBe(true);
    });

    it('should accept amount within tolerance', () => {
      expect(
        PaymentService.validatePaymentAmount(99.99, 100)
      ).toBe(true);
    });

    it('should reject amount outside tolerance', () => {
      expect(
        PaymentService.validatePaymentAmount(95, 100)
      ).toBe(false);
    });
  });
});