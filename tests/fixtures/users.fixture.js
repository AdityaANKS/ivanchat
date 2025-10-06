const bcrypt = require('bcryptjs');

const createMockUser = async (overrides = {}) => {
  const hashedPassword = await bcrypt.hash('Test123!', 10);
  
  return {
    _id: '507f1f77bcf86cd799439011',
    email: 'user@example.com',
    username: 'testuser',
    password: hashedPassword,
    membership: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
};

const mockMembership = (overrides = {}) => ({
  planId: 'monthly',
  status: 'active',
  startedAt: new Date(),
  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  features: {
    maxServers: 10,
    maxFileSize: 100,
    voiceQuality: 'high',
    customEmojis: true,
    prioritySupport: false
  },
  ...overrides
});

const mockPremiumUser = async (overrides = {}) => {
  const user = await createMockUser();
  return {
    ...user,
    membership: mockMembership(),
    ...overrides
  };
};

module.exports = {
  createMockUser,
  mockMembership,
  mockPremiumUser
};