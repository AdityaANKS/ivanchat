// server/models/ServerTemplate.js
import mongoose from 'mongoose';

const serverTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  category: {
    type: String,
    enum: ['gaming', 'education', 'community', 'business', 'creative', 'tech'],
  },
  icon: String,
  banner: String,
  structure: {
    categories: [{
      name: String,
      position: Number,
      permissions: Object,
    }],
    channels: [{
      name: String,
      type: String,
      category: String,
      position: Number,
      topic: String,
      permissions: Object,
      settings: {
        slowMode: Number,
        nsfw: Boolean,
      },
    }],
    roles: [{
      name: String,
      color: String,
      permissions: [String],
      position: Number,
      mentionable: Boolean,
    }],
  },
  settings: {
    verificationLevel: Number,
    defaultNotifications: String,
    explicitContentFilter: String,
    features: [String],
  },
  widgets: [{
    type: String,
    config: Object,
    position: String,
  }],
  automations: [{
    trigger: String,
    actions: [Object],
  }],
  usageCount: {
    type: Number,
    default: 0,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  official: {
    type: Boolean,
    default: false,
  },
  featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.model('ServerTemplate', serverTemplateSchema);