// server/models/ChannelDiscovery.js
import mongoose from 'mongoose';

const channelDiscoverySchema = new mongoose.Schema({
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
    required: true,
  },
  server: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Server',
    required: true,
  },
  category: {
    type: String,
    enum: ['gaming', 'education', 'music', 'art', 'technology', 'community', 'other'],
    required: true,
  },
  tags: [String],
  description: {
    type: String,
    maxlength: 500,
  },
  thumbnail: String,
  statistics: {
    memberCount: { type: Number, default: 0 },
    messageRate: { type: Number, default: 0 }, // messages per hour
    activeUsers: { type: Number, default: 0 },
    growthRate: { type: Number, default: 0 }, // percentage
  },
  trending: {
    score: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now },
  },
  featured: {
    isFeatured: { type: Boolean, default: false },
    featuredAt: Date,
    featuredUntil: Date,
  },
  language: {
    type: String,
    default: 'en',
  },
  nsfw: {
    type: Boolean,
    default: false,
  },
  verified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Indexes for efficient discovery
channelDiscoverySchema.index({ 'trending.score': -1 });
channelDiscoverySchema.index({ category: 1, 'trending.score': -1 });
channelDiscoverySchema.index({ tags: 1 });
channelDiscoverySchema.index({ language: 1 });

export default mongoose.model('ChannelDiscovery', channelDiscoverySchema);