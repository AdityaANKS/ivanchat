const { v4: uuidv4 } = require('uuid');

const mockUser = (overrides = {}) => ({
  _id: '507f1f77bcf86cd799439011',
  email: 'test@example.com',
  username: 'testuser',
  membership: null,
  save: jest.fn(),
  ...overrides
});

const mockOrder = (overrides = {}) => ({
  _id: '507f1f77bcf86cd799439012',
  userId: '507f1f77bcf86cd799439011',
  planId: 'monthly',
  amount: 99,
  currency: 'INR',
  transactionRef: uuidv4(),
  status: 'pending',
  createdAt: new Date(),
  expiresAt: new Date(Date.now() + 30 * 60 * 1000),
  save: jest.fn(),
  ...overrides
});

const mockPayment = (overrides = {}) => ({
  _id: '507f1f77bcf86cd799439013',
  orderId: '507f1f77bcf86cd799439012',
  transactionRef: 'txn_' + uuidv4(),
  providerTransactionId: 'pay_' + uuidv4(),
  amount: 99,
  currency: 'INR',
  status: 'success',
  provider: 'razorpay',
  signatureVerified: true,
  processedAt: new Date(),
  ...overrides
});

const mockRemoteTransaction = (overrides = {}) => ({
  id: 'pay_' + uuidv4(),
  amount: 9900,
  currency: 'INR',
  status: 'success',
  method: 'upi',
  vpa: 'user@paytm',
  notes: {},
  created_at: Date.now() / 1000,
  ...overrides
});

const mockWebhookPayload = {
  razorpay: (transactionRef, amount = 9900) => ({
    event: 'payment.captured',
    payload: {
      payment: {
        entity: {
          id: 'pay_' + uuidv4(),
          amount,
          currency: 'INR',
          status: 'captured',
          method: 'upi',
          vpa: 'user@paytm',
          notes: {
            transactionRef
          }
        }
      }
    }
  }),
  
  cashfree: (transactionRef, amount = 999) => ({
    data: {
      order: {
        order_id: 'cf_' + uuidv4(),
        order_amount: amount,
        order_currency: 'INR',
        order_status: 'PAID',
        order_meta: {
          return_url: `transactionRef=${transactionRef}`
        }
      },
      payment: {
        cf_payment_id: 'cfpay_' + uuidv4(),
        payment_status: 'SUCCESS'
      }
    }
  })
};

module.exports = {
  mockUser,
  mockOrder,
  mockPayment,
  mockRemoteTransaction,
  mockWebhookPayload
};