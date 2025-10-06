const ReconciliationService = require('../../../server/src/services/reconciliation/ReconciliationService');
const Order = require('../../../server/src/models/Order');
const Payment = require('../../../server/src/models/Payment');
const ReconciliationLog = require('../../../server/src/models/ReconciliationLog');
const PaymentProviderFactory = require('../../../server/src/services/payment/PaymentProviderFactory');
const { mockOrder, mockPayment, mockRemoteTransaction } = require('../../fixtures/payments.fixture');

jest.mock('../../../server/src/models/Order');
jest.mock('../../../server/src/models/Payment');
jest.mock('../../../server/src/models/ReconciliationLog');
jest.mock('../../../server/src/services/payment/PaymentProviderFactory');

describe('ReconciliationService', () => {
  let reconciliationService;
  let mockProvider;

  beforeEach(() => {
    jest.clearAllMocks();
    reconciliationService = new ReconciliationService();
    
    mockProvider = {
      fetchTransactions: jest.fn(),
      fetchTransaction: jest.fn()
    };
    
    PaymentProviderFactory.getProvider = jest.fn().mockReturnValue(mockProvider);
  });

  describe('reconcilePayments', () => {
    it('should reconcile unmatched transactions successfully', async () => {
      // Arrange
      const remoteTxns = [
        mockRemoteTransaction({
          id: 'pay_123',
          amount: 9900,
          status: 'success',
          notes: { transactionRef: 'txn_123' }
        }),
        mockRemoteTransaction({
          id: 'pay_456',
          amount: 99900,
          status: 'success',
          notes: { transactionRef: 'txn_456' }
        })
      ];

      mockProvider.fetchTransactions.mockResolvedValue(remoteTxns);
      
      Order.findOne = jest.fn()
        .mockResolvedValueOnce(mockOrder({ transactionRef: 'txn_123', amount: 99 }))
        .mockResolvedValueOnce(mockOrder({ transactionRef: 'txn_456', amount: 999 }));
      
      Payment.findOne = jest.fn().mockResolvedValue(null);
      Payment.findOneAndUpdate = jest.fn().mockImplementation((filter, update) => 
        Promise.resolve(mockPayment(update.$set))
      );
      
      ReconciliationLog.create = jest.fn();
      Order.updateMany = jest.fn();

      // Act
      const result = await reconciliationService.reconcilePayments();

      // Assert
      expect(mockProvider.fetchTransactions).toHaveBeenCalled();
      expect(result.matched).toBe(2);
      expect(result.unmatched).toBe(0);
      expect(Payment.findOneAndUpdate).toHaveBeenCalledTimes(2);
    });

    it('should handle unmatched transactions', async () => {
      // Arrange
      const remoteTxns = [
        mockRemoteTransaction({
          id: 'pay_unmatched',
          amount: 9900,
          status: 'success',
          notes: {} // No transaction ref
        })
      ];

      mockProvider.fetchTransactions.mockResolvedValue(remoteTxns);
      Order.findOne = jest.fn().mockResolvedValue(null);
      Payment.findOne = jest.fn().mockResolvedValue(null);
      ReconciliationLog.create = jest.fn();
      Order.updateMany = jest.fn();

      // Act
      const result = await reconciliationService.reconcilePayments();

      // Assert
      expect(result.matched).toBe(0);
      expect(result.unmatched).toBe(1);
      expect(ReconciliationLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          matchResult: 'not_found'
        })
      );
    });

    it('should detect amount mismatches', async () => {
      // Arrange
      const remoteTxn = mockRemoteTransaction({
        id: 'pay_123',
        amount: 19900, // Wrong amount (199 instead of 99)
        status: 'success',
        notes: { transactionRef: 'txn_123' }
      });

      mockProvider.fetchTransactions.mockResolvedValue([remoteTxn]);
      
      Order.findOne = jest.fn().mockResolvedValue(
        mockOrder({ transactionRef: 'txn_123', amount: 99 }) // Expected 99
      );
      
      ReconciliationLog.create = jest.fn();
      Order.updateMany = jest.fn();

      // Act
      await reconciliationService.reconcilePayments();

      // Assert
      expect(ReconciliationLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          matchResult: 'amount_mismatch'
        })
      );
    });

    it('should handle provider API errors gracefully', async () => {
      // Arrange
      mockProvider.fetchTransactions.mockRejectedValue(
        new Error('Provider API error')
      );

      // Act & Assert
      await expect(
        reconciliationService.reconcilePayments()
      ).rejects.toThrow('Provider API error');
    });

    it('should mark expired orders', async () => {
      // Arrange
      mockProvider.fetchTransactions.mockResolvedValue([]);
      
      Order.updateMany = jest.fn().mockResolvedValue({
        modifiedCount: 5
      });

      // Act
      await reconciliationService.reconcilePayments();

      // Assert
      expect(Order.updateMany).toHaveBeenCalledWith(
        {
          status: 'pending',
          expiresAt: { $lt: expect.any(Date) }
        },
        {
          $set: { status: 'expired' }
        }
      );
    });
  });

  describe('reconcileTransaction', () => {
    it('should match by transaction reference', async () => {
      // Arrange
      const remoteTxn = mockRemoteTransaction({
        id: 'pay_123',
        amount: 9900,
        notes: { transactionRef: 'txn_123' }
      });

      const order = mockOrder({ transactionRef: 'txn_123', amount: 99 });
      Order.findOne = jest.fn().mockResolvedValue(order);
      Payment.findOneAndUpdate = jest.fn().mockResolvedValue(mockPayment());
      ReconciliationLog.create = jest.fn();
      order.save = jest.fn();

      // Act
      const result = await reconciliationService.reconcileTransaction(remoteTxn);

      // Assert
      expect(result.matched).toBe(true);
      expect(result.matchMethod).toBe('transactionRef');
    });

    it('should match by provider transaction ID', async () => {
      // Arrange
      const remoteTxn = mockRemoteTransaction({
        id: 'pay_123',
        amount: 9900,
        notes: {} // No transaction ref
      });

      const payment = mockPayment({ providerTransactionId: 'pay_123' });
      const order = mockOrder({ amount: 99 });
      
      Order.findOne = jest.fn()
        .mockResolvedValueOnce(null) // First search by ref fails
        .mockResolvedValueOnce(order); // Second search by ID succeeds
      
      Payment.findOne = jest.fn().mockResolvedValue(payment);
      Order.findById = jest.fn().mockResolvedValue(order);
      ReconciliationLog.create = jest.fn();

      // Act
      const result = await reconciliationService.reconcileTransaction(remoteTxn);

      // Assert
      expect(result.matched).toBe(true);
      expect(result.matchMethod).toBe('providerTransactionId');
    });

    it('should attempt fuzzy matching by amount and time', async () => {
      // Arrange
      const now = new Date();
      const remoteTxn = mockRemoteTransaction({
        id: 'pay_123',
        amount: 9900,
        createdAt: now,
        notes: {}
      });

      const order = mockOrder({ 
        amount: 99,
        createdAt: new Date(now - 2 * 60 * 1000) // 2 minutes ago
      });

      Order.findOne = jest.fn()
        .mockResolvedValueOnce(null) // By ref
        .mockResolvedValueOnce(order); // Fuzzy match
      
      Payment.findOne = jest.fn().mockResolvedValue(null);
      ReconciliationLog.create = jest.fn();

      // Act
      const result = await reconciliationService.reconcileTransaction(remoteTxn);

      // Assert
      expect(result.matched).toBe(true);
      expect(result.matchMethod).toBe('fuzzy');
      expect(Order.findOne).toHaveBeenLastCalledWith({
        amount: 99,
        status: 'pending',
        createdAt: {
          $gte: expect.any(Date),
          $lte: expect.any(Date)
        }
      });
    });
  });

  describe('manualReconcile', () => {
    it('should reconcile specific order and transaction', async () => {
      // Arrange
      const orderId = 'order_123';
      const providerTxnId = 'pay_123';
      
      const order = mockOrder({ id: orderId });
      const remoteTxn = mockRemoteTransaction({ id: providerTxnId });
      
      Order.findById = jest.fn().mockResolvedValue(order);
      mockProvider.fetchTransaction = jest.fn().mockResolvedValue(remoteTxn);
      
      reconciliationService.reconcileTransaction = jest.fn().mockResolvedValue({
        matched: true,
        activated: true
      });

      // Act
      const result = await reconciliationService.manualReconcile(orderId, providerTxnId);

      // Assert
      expect(Order.findById).toHaveBeenCalledWith(orderId);
      expect(mockProvider.fetchTransaction).toHaveBeenCalledWith(providerTxnId);
      expect(result.matched).toBe(true);
    });

    it('should throw error if order not found', async () => {
      // Arrange
      Order.findById = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(
        reconciliationService.manualReconcile('invalid_order', 'pay_123')
      ).rejects.toThrow('Order not found');
    });

    it('should throw error if transaction not found at provider', async () => {
      // Arrange
      const order = mockOrder();
      Order.findById = jest.fn().mockResolvedValue(order);
      mockProvider.fetchTransaction = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(
        reconciliationService.manualReconcile('order_123', 'invalid_txn')
      ).rejects.toThrow('Transaction not found at provider');
    });
  });
});