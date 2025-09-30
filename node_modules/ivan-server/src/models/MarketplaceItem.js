// server/models/MarketplaceItem.js
import mongoose from 'mongoose';

const marketplaceItemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['bot', 'theme', 'extension', 'widget', 'soundpack'],
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    short: { type: String, maxlength: 200 },
    long: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  version: {
    current: { type: String, required: true },
    history: [{
      version: String,
      releaseDate: Date,
      changelog: String,
      downloadUrl: String,
    }],
  },
  pricing: {
    model: {
      type: String,
      enum: ['free', 'paid', 'freemium', 'subscription'],
      default: 'free',
    },
    price: Number,
    currency: { type: String, default: 'USD' },
    subscriptionTiers: [{
      name: String,
      price: Number,
      features: [String],
    }],
  },
  assets: {
    icon: String,
    banner: String,
    screenshots: [String],
    video: String,
  },
  metadata: {
    category: [String],
    tags: [String],
    language: [String],
    compatibility: {
      minVersion: String,
      maxVersion: String,
      platforms: [String],
    },
  },
  stats: {
    downloads: { type: Number, default: 0 },
    installs: { type: Number, default: 0 },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    revenue: { type: Number, default: 0 },
  },
  permissions: [{
    scope: String,
    description: String,
    required: Boolean,
  }],
  configuration: {
    schema: Object, // JSON Schema for configuration
    defaults: Object,
    ui: Object, // UI schema for configuration form
  },
  source: {
    repository: String,
    documentation: String,
    support: String,
    license: String,
  },
  verification: {
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected', 'suspended'],
      default: 'pending',
    },
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: String,
  },
  featured: {
    isFeatured: { type: Boolean, default: false },
    featuredAt: Date,
    featuredUntil: Date,
  },
}, {
  timestamps: true,
});

marketplaceItemSchema.index({ type: 1, 'stats.downloads': -1 });
marketplaceItemSchema.index({ 'metadata.tags': 1 });
marketplaceItemSchema.index({ 'pricing.model': 1 });

export default mongoose.model('MarketplaceItem', marketplaceItemSchema);