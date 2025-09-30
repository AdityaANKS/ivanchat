// server/models/Channel.js
import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  type: {
    type: String,
    enum: ['text', 'voice', 'video', 'announcement', 'forum'],
    default: 'text',
  },
  description: {
    type: String,
    maxlength: 500,
  },
  server: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Server',
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  position: {
    type: Number,
    default: 0,
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  permissions: [{
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
    },
    allow: [String],
    deny: [String],
  }],
  slowMode: {
    type: Number,
    default: 0, // seconds between messages
  },
  nsfw: {
    type: Boolean,
    default: false,
  },
  topic: String,
  lastMessageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
  activeVoiceUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

export default mongoose.model('Channel', channelSchema);