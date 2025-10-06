const ReconciliationService = require('../../../server/src/services/reconciliation/ReconciliationService');
const Order = require('../../../server/src/models/Order');
const Payment = require('../../../server/src/models/Payment');
const ReconciliationLog = require('../../../server/src/models/ReconciliationLog');
const PaymentProviderFactory = require('../../../server/src/services/payment/PaymentProviderFactory');

jest.mock('../../../server/src/models/Order');
jest.mock('../../../server/src/models/Payment');
jest.mock('../../../server/src/models/ReconciliationLog');
jest.mock('../../../server/src/services/payment/PaymentProviderFactory');

describe('ReconciliationService', () => {
  let reconciliationService;
  let mockProvider;

  beforeEach(() => {
    reconciliationService = new ReconciliationService();
    mockProvider = {
      fetchTransactions: jest.fn(),
      fetchTransaction: jest.fn()
    };
    PaymentProviderFactory.getProvider = jest.fn().mockReturnValue(mockProvider);
    jest.clearAllMocks();
  });

  describe('reconcilePayments', () => {
    it('should reconcile missing payments successfully', async () => {
      const remoteTransactions = [
        {
          id: 'pay_123',
          amount: 9900, // in paise
          currency: 'INR',
          status: 'success',
          notes: { transactionRef: 'txn_123' },
          createdAt: new Date()
        },
        {
          id: 'pay_456',
          amount: 99900,
          currency: 'INR',
          status: 'success',
          notes: { transactionRef: 'txn_456' },
          createdAt: new Date()
        }
      ];

      mockProvider.fetchTransactions.mockResolvedValue(remoteTransactions);

      Order.findOne = jest.fn()
        .mockResolvedValueOnce({
          _id: 'order123',
          transactionRef: 'txn_123',
          amount: 99,
          status: 'pending',
          userId: 'user123',
          planId: 'monthly',
          save: jest.fn()
        })
        .mockResolvedValueOnce({
          _id: 'order456',
          transactionRef: 'txn_456',
          amount: 999,
          status: 'pending',
          userId: 'user456',
          planId: 'yearly',
          save: jest.fn()
        });

      Payment.findOne = jest.fn().mockResolvedValue(null);
      Payment.findOneAndUpdate = jest.fn().mockResolvedValue({
        _id: 'payment_new',
        status: 'success'
      });

      ReconciliationLog.create = jest.fn();

      const result = await reconciliationService.reconcilePayments();

      expect(result.matched).toBe(2);
      expect(result.activated).toBe(2);
      expect(mockProvider.fetchTransactions).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success'
        })
      );
    });

    it('should handle amount mismatch', async () => {
      const remoteTransaction = {
        id: 'pay_123',
        amount: 10000, // 100 rupees (mismatch)
        currency: 'INR',
        status: 'success',
        notes: { transactionRef: 'txn_123' },
        createdAt: new Date()
      };

      mockProvider.fetchTransactions.mockResolvedValue([remoteTransaction]);

      Order.findOne = jest.fn().mockResolvedValue({
        _id: 'order123',
        transactionRef: 'txn_123',
        amount: 99, // Expected 99 rupees
        status: 'pending'
      });

      ReconciliationLog.create = jest.fn();

      const result = await reconciliationService.reconcilePayments();

      expect(result.matched).toBe(1);
      expect(result.activated).toBe(0);
      
      expect(ReconciliationLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          matchResult: 'amount_mismatch'
        })
      );
    });

    it('should handle unmatched transactions', async () => {
      const remoteTransaction = {
        id: 'pay_unmatched',
        amount: 9900,
        currency: 'INR',
        status: 'success',
        notes: {}, // No transaction reference
        createdAt: new Date()
      };

      mockProvider.fetchTransactions.mockResolvedValue([remoteTransaction]);

      Order.findOne = jest.fn().mockResolvedValue(null);
      Payment.findOne = jest.fn().mockResolvedValue(null);
      ReconciliationLog.create = jest.fn();

      const result = await reconciliationService.reconcilePayments();

      expect(result.matched).toBe(0);
      expect(result.unmatched).toBe(1);
      
      expect(ReconciliationLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          matchResult: 'not_found'
        })
      );
    });

    it('should use fuzzy matching as fallback', async () => {
      const transactionTime = new Date();
      const remoteTransaction = {
        id: 'pay_fuzzy',
        amount: 9900,
        currency: 'INR',
        status: 'success',
        notes: {}, // No transaction reference
        createdAt: transactionTime
      };

      mockProvider.fetchTransactions.mockResolvedValue([remoteTransaction]);

      // First attempts fail
      Order.findOne = jest.fn()
        .mockResolvedValueOnce(null) // By transactionRef
        .mockResolvedValueOnce({     // By fuzzy matching
          _id: 'order_fuzzy',
          amount: 99,
          status: 'pending',
          createdAt: transactionTime,
          save: jest.fn()
        });

      Payment.findOne = jest.fn().mockResolvedValue(null);
      Payment.findOneAndUpdate = jest.fn().mockResolvedValue({
        _id: 'payment_fuzzy',
        status: 'success'
      });

      ReconciliationLog.create = jest.fn();

      await reconciliationService.reconcilePayments();

      expect(ReconciliationLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          matchMethod: 'fuzzy',
          matchResult: 'matched'
        })
      );
    });
  });

  describe('handleExpiredOrders', () => {
    it('should mark expired orders correctly', async () => {
      const updateResult = {
        modifiedCount: 5
      };

      Order.updateMany = jest.fn().mockResolvedValue(updateResult);

      await reconciliationService.handleExpiredOrders();

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

  describe('manualReconcile', () => {
    it('should reconcile specific transaction manually', async () => {
      const orderId = 'order123';
      const providerTransactionId = 'pay_123';

      const remoteTransaction = {
        id: providerTransactionId,
        amount: 9900,
        currency: 'INR',
        status: 'success',
        notes: { transactionRef: 'txn_123' },
        createdAt: new Date()
      };

      Order.findById = jest.fn().mockResolvedValue({
        _id: orderId,
        transactionRef: 'txn_123',
        amount: 99,
        status: 'pending',
        save: jest.fn()
      });

      mockProvider.fetchTransaction.mockResolvedValue(remoteTransaction);

      Order.findOne = jest.fn().mockResolvedValue({
        _id: orderId,
        transactionRef: 'txn_123',
        amount: 99,
        status: 'pending',
        save: jest.fn()
      });

      Payment.findOneAndUpdate = jest.fn().mockResolvedValue({
        _id: 'payment_123',
        status: 'success'
      });

      ReconciliationLog.create = jest.fn();

      const result = await reconciliationService.manualReconcile(
        orderId,
        providerTransactionId
      );

      expect(result.matched).toBe(true);
      expect(mockProvider.fetchTransaction).toHaveBeenCalledWith(providerTransactionId);
    });

    it('should throw error for non-existent order', async () => {
      Order.findById = jest.fn().mockResolvedValue(null);

      await expect(
        reconciliationService.manualReconcile('invalid_order', 'pay_123')
      ).rejects.toThrow('Order not found');
    });
  });
});