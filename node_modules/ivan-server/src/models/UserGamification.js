// server/models/UserGamification.js
import mongoose from 'mongoose';

const userGamificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  level: {
    current: { type: Number, default: 1 },
    experience: { type: Number, default: 0 },
    experienceToNext: { type: Number, default: 100 },
  },
  badges: [{
    id: String,
    name: String,
    description: String,
    icon: String,
    rarity: {
      type: String,
      enum: ['common', 'rare', 'epic', 'legendary'],
    },
    unlockedAt: Date,
    progress: {
      current: Number,
      required: Number,
    },
  }],
  achievements: [{
    id: String,
    name: String,
    description: String,
    points: Number,
    unlockedAt: Date,
  }],
  stats: {
    messagesSent: { type: Number, default: 0 },
    reactionsGiven: { type: Number, default: 0 },
    reactionsReceived: { type: Number, default: 0 },
    voiceMinutes: { type: Number, default: 0 },
    serversJoined: { type: Number, default: 0 },
    threadsCreated: { type: Number, default: 0 },
    helpfulMessages: { type: Number, default: 0 },
    dailyStreak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastActive: Date,
    },
  },
  rank: {
    current: String,
    icon: String,
    nextRank: String,
    progress: Number,
  },
  leaderboard: {
    global: Number,
    server: Map, // serverId -> rank
    weekly: Number,
    monthly: Number,
  },
  quests: [{
    id: String,
    name: String,
    description: String,
    type: {
      type: String,
      enum: ['daily', 'weekly', 'special'],
    },
    requirements: [{
      type: String,
      target: Number,
      current: Number,
    }],
    rewards: {
      experience: Number,
      badges: [String],
      items: [String],
    },
    expiresAt: Date,
    completedAt: Date,
  }],
  inventory: [{
    itemId: String,
    name: String,
    type: {
      type: String,
      enum: ['avatar_frame', 'name_color', 'emoji', 'theme', 'boost'],
    },
    quantity: Number,
    equippedAt: Date,
  }],
}, {
  timestamps: true,
});

export default mongoose.model('UserGamification', userGamificationSchema);