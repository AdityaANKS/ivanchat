const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../../../server/src/app');
const User = require('../../../server/src/models/User');
const Order = require('../../../server/src/models/Order');
const { setupTestDatabase, teardownTestDatabase } = require('../../helpers/testDb');
const { generateAuthToken } = require('../../helpers/authHelper');

describe('Payment API Integration Tests', () => {
  let authToken;
  let testUser;

  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    // Clean collections
    await User.deleteMany({});
    await Order.deleteMany({});

    // Create test user
    testUser = await User.create({
      email: 'test@example.com',
      username: 'testuser',
      password: 'Test123!'
    });

    authToken = generateAuthToken(testUser);
  });

  describe('POST /api/payments/create', () => {
    it('should create payment order successfully', async () => {
      // Act
      const response = await request(app)
        .post('/api/payments/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId: testUser._id.toString(),
          planId: 'monthly'
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.orderId).toBeDefined();
      expect(response.body.transactionRef).toBeDefined();
      expect(response.body.amount).toBe(99);
      expect(response.body.qrImageUrl).toMatch(/^data:image/);

      // Verify order in database
      const order = await Order.findById(response.body.orderId);
      expect(order).toBeDefined();
      expect(order.status).toBe('pending');
    });

    it('should reject unauthorized requests', async () => {
      // Act
      const response = await request(app)
        .post('/api/payments/create')
        .send({
          userId: testUser._id.toString(),
          planId: 'monthly'
        });

      // Assert
      expect(response.status).toBe(401);
    });

    it('should validate plan ID', async () => {
      // Act
      const response = await request(app)
        .post('/api/payments/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId: testUser._id.toString(),
          planId: 'invalid_plan'
        });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid plan');
    });

    it('should prevent duplicate pending orders', async () => {
      // Create first order
      await request(app)
        .post('/api/payments/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId: testUser._id.toString(),
          planId: 'monthly'
        });

      // Try to create second order
      const response = await request(app)
        .post('/api/payments/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId: testUser._id.toString(),
          planId: 'monthly'
        });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('pending order');
    });
  });

  describe('GET /api/payments/status', () => {
    it('should return payment status', async () => {
      // Create order
      const order = await Order.create({
        userId: testUser._id,
        planId: 'monthly',
        amount: 99,
        transactionRef: 'test_txn_123',
        status: 'pending'
      });

      // Act
      const response = await request(app)
        .get(`/api/payments/status?transactionRef=${order.transactionRef}`)
        .set('Authorization', `Bearer ${authToken}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.order.status).toBe('pending');
      expect(response.body.order.amount).toBe(99);
    });

    it('should return 404 for non-existent order', async () => {
      // Act
      const response = await request(app)
        .get('/api/payments/status?transactionRef=non_existent')
        .set('Authorization', `Bearer ${authToken}`);

      // Assert
      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/payments/history', () => {
    it('should return user payment history', async () => {
      // Create multiple orders
      await Order.create([
        {
          userId: testUser._id,
          planId: 'monthly',
          amount: 99,
          status: 'paid',
          transactionRef: 'txn_1'
        },
        {
          userId: testUser._id,
          planId: 'yearly',
          amount: 999,
          status: 'paid',
          transactionRef: 'txn_2'
        }
      ]);

      // Act
      const response = await request(app)
        .get('/api/payments/history')
        .set('Authorization', `Bearer ${authToken}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.payments).toHaveLength(2);
      expect(response.body.total).toBe(1098);
    });

    it('should support pagination', async () => {
      // Create 15 orders
      const orders = [];
      for (let i = 0; i < 15; i++) {
        orders.push({
          userId: testUser._id,
          planId: 'monthly',
          amount: 99,
          status: 'paid',
          transactionRef: `txn_${i}`
        });
      }
      await Order.create(orders);

      // Act - First page
      const page1 = await request(app)
        .get('/api/payments/history?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`);

      // Act - Second page
      const page2 = await request(app)
        .get('/api/payments/history?page=2&limit=10')
        .set('Authorization', `Bearer ${authToken}`);

      // Assert
      expect(page1.body.payments).toHaveLength(10);
      expect(page2.body.payments).toHaveLength(5);
      expect(page1.body.totalPages).toBe(2);
    });
  });
});