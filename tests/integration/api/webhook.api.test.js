const request = require('supertest');
const crypto = require('crypto');
const { app } = require('../../../server/src/app');
const Order = require('../../../server/src/models/Order');
const Payment = require('../../../server/src/models/Payment');
const User = require('../../../server/src/models/User');
const { setupTestDatabase, teardownTestDatabase } = require('../../helpers/testDb');

describe('Webhook API Integration Tests', () => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'test_webhook_secret';

  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await Order.deleteMany({});
    await Payment.deleteMany({});
    await User.deleteMany({});
  });

  describe('POST /webhooks/payments/razorpay', () => {
    it('should process valid payment webhook', async () => {
      // Setup
      const user = await User.create({
        email: 'test@example.com',
        username: 'testuser'
      });

      const order = await Order.create({
        userId: user._id,
        planId: 'monthly',
        amount: 99,
        transactionRef: 'test_txn_123',
        status: 'pending'
      });

      const webhookPayload = {
        event: 'payment.captured',
        payload: {
          payment: {
            entity: {
              id: 'pay_test123',
              amount: 9900,
              currency: 'INR',
              status: 'captured',
              notes: {
                transactionRef: order.transactionRef
              }
            }
          }
        }
      };

      const signature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(webhookPayload))
        .digest('hex');

      // Act
      const response = await request(app)
        .post('/webhooks/payments/razorpay')
        .set('x-razorpay-signature', signature)
        .send(webhookPayload);

      // Assert
      expect(response.status).toBe(200);

      // Verify payment created
      const payment = await Payment.findOne({ 
        transactionRef: order.transactionRef 
      });
      expect(payment).toBeDefined();
      expect(payment.status).toBe('success');
      expect(payment.signatureVerified).toBe(true);

      // Verify order updated
      const updatedOrder = await Order.findById(order._id);
      expect(updatedOrder.status).toBe('paid');

      // Verify membership activated
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.membership).toBeDefined();
      expect(updatedUser.membership.status).toBe('active');
      expect(updatedUser.membership.planId).toBe('monthly');
    });

    it('should reject webhook with invalid signature', async () => {
      // Setup
      const webhookPayload = {
        event: 'payment.captured',
        payload: {}
      };

      // Act
      const response = await request(app)
        .post('/webhooks/payments/razorpay')
        .set('x-razorpay-signature', 'invalid_signature')
        .send(webhookPayload);

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Invalid signature');
    });

    it('should handle idempotent webhook calls', async () => {
      // Setup
      const user = await User.create({
        email: 'test@example.com',
        username: 'testuser'
      });

      const order = await Order.create({
        userId: user._id,
        planId: 'monthly',
        amount: 99,
        transactionRef: 'test_txn_123',
        status: 'pending'
      });

      const webhookPayload = {
        event: 'payment.captured',
        payload: {
          payment: {
            entity: {
              id: 'pay_test123',
              amount: 9900,
              status: 'captured',
              notes: {
                transactionRef: order.transactionRef
              }
            }
          }
        }
      };

      const signature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(webhookPayload))
        .digest('hex');

      // Act - Send webhook twice
      await request(app)
        .post('/webhooks/payments/razorpay')
        .set('x-razorpay-signature', signature)
        .send(webhookPayload);

      const response = await request(app)
        .post('/webhooks/payments/razorpay')
        .set('x-razorpay-signature', signature)
        .send(webhookPayload);

      // Assert
      expect(response.status).toBe(200);

      // Verify only one payment record
      const payments = await Payment.find({ 
        providerTransactionId: 'pay_test123' 
      });
      expect(payments).toHaveLength(1);
    });

    it('should handle amount mismatch', async () => {
      // Setup
      const user = await User.create({
        email: 'test@example.com',
        username: 'testuser'
      });

      const order = await Order.create({
        userId: user._id,
        planId: 'monthly',
        amount: 99,
        transactionRef: 'test_txn_123',
        status: 'pending'
      });

      const webhookPayload = {
        event: 'payment.captured',
        payload: {
          payment: {
            entity: {
              id: 'pay_test123',
              amount: 19900, // Wrong amount
              status: 'captured',
              notes: {
                transactionRef: order.transactionRef
              }
            }
          }
        }
      };

      const signature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(webhookPayload))
        .digest('hex');

      // Act
      const response = await request(app)
        .post('/webhooks/payments/razorpay')
        .set('x-razorpay-signature', signature)
        .send(webhookPayload);

      // Assert
      expect(response.status).toBe(200); // Still return 200

      // Verify order marked for review
      const updatedOrder = await Order.findById(order._id);
      expect(updatedOrder.status).toBe('pending-review');

      // Verify membership NOT activated
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.membership).toBeNull();
    });
  });

  describe('POST /webhooks/payments/cashfree', () => {
    it('should process Cashfree webhook', async () => {
      // Setup
      const user = await User.create({
        email: 'test@example.com',
        username: 'testuser'
      });

      const order = await Order.create({
        userId: user._id,
        planId: 'yearly',
        amount: 999,
        transactionRef: 'cf_txn_123',
        status: 'pending'
      });

      const timestamp = Date.now().toString();
      const webhookPayload = {
        data: {
          order: {
            order_id: 'cf_order_123',
            order_amount: 999,
            order_currency: 'INR',
            order_status: 'PAID',
            order_meta: {
              return_url: `transactionRef=${order.transactionRef}`
            }
          },
          payment: {
            cf_payment_id: 'cf_pay_123',
            payment_status: 'SUCCESS'
          }
        }
      };

      const message = `${timestamp}${JSON.stringify(webhookPayload)}`;
      const signature = crypto
        .createHmac('sha256', process.env.CASHFREE_WEBHOOK_SECRET || 'test_secret')
        .update(message)
        .digest('base64');

      // Act
      const response = await request(app)
        .post('/webhooks/payments/cashfree')
        .set('x-cashfree-signature', signature)
        .set('x-cashfree-timestamp', timestamp)
        .send(webhookPayload);

      // Assert
      expect(response.status).toBe(200);

      // Verify order updated
      const updatedOrder = await Order.findById(order._id);
      expect(updatedOrder.status).toBe('paid');
    });
  });
});