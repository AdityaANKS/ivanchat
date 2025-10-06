const MembershipService = require('../../../server/src/services/membership/MembershipService');
const User = require('../../../server/src/models/User');
const EmailService = require('../../../server/src/services/notification/EmailService');
const { mockUser } = require('../../fixtures/users.fixture');
const { addDays, addMonths, addYears } = require('date-fns');

jest.mock('../../../server/src/models/User');
jest.mock('../../../server/src/services/notification/EmailService');

describe('MembershipService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('activateMembership', () => {
    it('should activate new membership for user', async () => {
      // Arrange
      const userId = 'user123';
      const planId = 'monthly';
      const user = mockUser({ 
        id: userId,
        membership: null 
      });

      User.findById = jest.fn().mockResolvedValue(user);
      user.save = jest.fn().mockResolvedValue(user);
      EmailService.send = jest.fn().mockResolvedValue(true);

      // Act
      const result = await MembershipService.activateMembership(userId, planId);

      // Assert
      expect(user.membership).toBeDefined();
      expect(user.membership.planId).toBe('monthly');
      expect(user.membership.status).toBe('active');
      expect(user.membership.expiresAt).toEqual(
        addMonths(new Date(), 1)
      );
      expect(user.save).toHaveBeenCalled();
      expect(EmailService.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: user.email,
          subject: expect.stringContaining('Membership Activated')
        })
      );
    });

    it('should extend existing active membership', async () => {
      // Arrange
      const userId = 'user123';
      const planId = 'monthly';
      const existingExpiry = addDays(new Date(), 10);
      
      const user = mockUser({
        id: userId,
        membership: {
          planId: 'monthly',
          status: 'active',
          expiresAt: existingExpiry
        }
      });

      User.findById = jest.fn().mockResolvedValue(user);
      user.save = jest.fn().mockResolvedValue(user);

      // Act
      await MembershipService.activateMembership(userId, planId);

      // Assert
      expect(user.membership.expiresAt).toEqual(
        addMonths(existingExpiry, 1)
      );
    });

    it('should handle yearly plan correctly', async () => {
      // Arrange
      const userId = 'user123';
      const planId = 'yearly';
      const user = mockUser({ id: userId });

      User.findById = jest.fn().mockResolvedValue(user);
      user.save = jest.fn().mockResolvedValue(user);

      // Act
      await MembershipService.activateMembership(userId, planId);

      // Assert
      expect(user.membership.expiresAt).toEqual(
        addYears(new Date(), 1)
      );
      expect(user.membership.features.maxServers).toBe(50);
    });

    it('should handle lifetime plan correctly', async () => {
      // Arrange
      const userId = 'user123';
      const planId = 'lifetime';
      const user = mockUser({ id: userId });

      User.findById = jest.fn().mockResolvedValue(user);
      user.save = jest.fn().mockResolvedValue(user);

      // Act
      await MembershipService.activateMembership(userId, planId);

      // Assert
      expect(user.membership.expiresAt).toEqual(new Date('2099-12-31'));
      expect(user.membership.features.maxServers).toBe(-1); // Unlimited
      expect(user.membership.features.exclusiveFeatures).toBe(true);
    });

    it('should be idempotent for duplicate activations', async () => {
      // Arrange
      const userId = 'user123';
      const planId = 'monthly';
      const existingExpiry = addMonths(new Date(), 1);
      
      const user = mockUser({
        id: userId,
        membership: {
          planId: 'monthly',
          status: 'active',
          expiresAt: existingExpiry,
          startedAt: new Date()
        }
      });

      User.findById = jest.fn().mockResolvedValue(user);
      user.save = jest.fn().mockResolvedValue(user);

      // Act - Activate twice
      await MembershipService.activateMembership(userId, planId);
      const firstExpiry = user.membership.expiresAt;
      
      await MembershipService.activateMembership(userId, planId);
      const secondExpiry = user.membership.expiresAt;

      // Assert - Expiry should extend, not double
      expect(secondExpiry).toEqual(addMonths(firstExpiry, 1));
    });

    it('should throw error for invalid user', async () => {
      // Arrange
      User.findById = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(
        MembershipService.activateMembership('invalid_user', 'monthly')
      ).rejects.toThrow('User not found');
    });

    it('should throw error for invalid plan', async () => {
      // Arrange
      const user = mockUser({ id: 'user123' });
      User.findById = jest.fn().mockResolvedValue(user);

      // Act & Assert
      await expect(
        MembershipService.activateMembership('user123', 'invalid_plan')
      ).rejects.toThrow('Invalid plan');
    });
  });

  describe('checkMembershipStatus', () => {
    it('should return active status for valid membership', async () => {
      // Arrange
      const user = mockUser({
        membership: {
          status: 'active',
          planId: 'monthly',
          expiresAt: addDays(new Date(), 10)
        }
      });

      User.findById = jest.fn().mockResolvedValue(user);

      // Act
      const status = await MembershipService.checkMembershipStatus('user123');

      // Assert
      expect(status.active).toBe(true);
      expect(status.planId).toBe('monthly');
      expect(status.daysRemaining).toBe(10);
    });

    it('should return inactive for expired membership', async () => {
      // Arrange
      const user = mockUser({
        membership: {
          status: 'active',
          planId: 'monthly',
          expiresAt: addDays(new Date(), -1) // Expired yesterday
        }
      });

      User.findById = jest.fn().mockResolvedValue(user);

      // Act
      const status = await MembershipService.checkMembershipStatus('user123');

      // Assert
      expect(status.active).toBe(false);
      expect(status.expired).toBe(true);
    });

    it('should return inactive for cancelled membership', async () => {
      // Arrange
      const user = mockUser({
        membership: {
          status: 'cancelled',
          planId: 'monthly',
          expiresAt: addDays(new Date(), 10)
        }
      });

      User.findById = jest.fn().mockResolvedValue(user);

      // Act
      const status = await MembershipService.checkMembershipStatus('user123');

      // Assert
      expect(status.active).toBe(false);
      expect(status.cancelled).toBe(true);
    });
  });

  describe('getPlanFeatures', () => {
    it('should return correct features for monthly plan', () => {
      const features = MembershipService.getPlanFeatures('monthly');
      
      expect(features.maxServers).toBe(10);
      expect(features.maxFileSize).toBe(100);
      expect(features.voiceQuality).toBe('high');
      expect(features.customEmojis).toBe(true);
      expect(features.prioritySupport).toBe(false);
    });

    it('should return correct features for yearly plan', () => {
      const features = MembershipService.getPlanFeatures('yearly');
      
      expect(features.maxServers).toBe(50);
      expect(features.maxFileSize).toBe(500);
      expect(features.voiceQuality).toBe('ultra');
      expect(features.prioritySupport).toBe(true);
      expect(features.profileBadge).toBe('premium');
    });

    it('should return correct features for lifetime plan', () => {
      const features = MembershipService.getPlanFeatures('lifetime');
      
      expect(features.maxServers).toBe(-1); // Unlimited
      expect(features.maxFileSize).toBe(1000);
      expect(features.exclusiveFeatures).toBe(true);
      expect(features.profileBadge).toBe('lifetime');
    });
  });
});