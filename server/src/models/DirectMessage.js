// server/models/DirectMessage.js
import mongoose from 'mongoose';

const directMessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  encryptedContent: {
    type: String,
    required: true,
  },
  iv: String, // Initialization vector for AES
  keyId: String, // Reference to encryption key
  messageType: {
    type: String,
    enum: ['text', 'file', 'image', 'voice'],
    default: 'text',
  },
  attachments: [{
    encryptedUrl: String,
    encryptedName: String,
    size: Number,
    mimeType: String,
  }],
  read: {
    type: Boolean,
    default: false,
  },
  readAt: Date,
  deleted: {
    sender: { type: Boolean, default: false },
    recipient: { type: Boolean, default: false },
  },
  ephemeral: {
    enabled: { type: Boolean, default: false },
    ttl: Number, // Time to live in seconds
    expiresAt: Date,
  },
}, {
  timestamps: true,
});

// Index for fast retrieval
directMessageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });
directMessageSchema.index({ recipient: 1, read: 1 });

// Auto-delete ephemeral messages
directMessageSchema.pre('save', function(next) {
  if (this.ephemeral.enabled && this.ephemeral.ttl) {
    this.ephemeral.expiresAt = new Date(Date.now() + this.ephemeral.ttl * 1000);
  }
  next();
});

export default mongoose.model('DirectMessage', directMessageSchema);