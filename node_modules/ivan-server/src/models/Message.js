// server/models/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
    required: true,
  },
  type: {
    type: String,
    enum: ['text', 'image', 'video', 'file', 'system'],
    default: 'text',
  },
  attachments: [{
    url: String,
    filename: String,
    size: Number,
    mimeType: String,
  }],
  embeds: [{
    title: String,
    description: String,
    url: String,
    thumbnail: String,
    color: String,
  }],
  reactions: [{
    emoji: String,
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
  }],
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
  thread: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thread',
  },
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  edited: {
    type: Boolean,
    default: false,
  },
  editedAt: Date,
  pinned: {
    type: Boolean,
    default: false,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  translatedContent: {
    type: Map,
    of: String, // language code -> translated text
  },
}, {
  timestamps: true,
});

// Index for fast message retrieval
messageSchema.index({ channel: 1, createdAt: -1 });
messageSchema.index({ author: 1 });

export default mongoose.model('Message', messageSchema);