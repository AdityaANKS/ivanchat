// server/models/ScheduledMessage.js
import mongoose from 'mongoose';

const scheduledMessageSchema = new mongoose.Schema({
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
  content: {
    type: String,
    required: true,
  },
  attachments: [{
    url: String,
    filename: String,
    size: Number,
    mimeType: String,
  }],
  embeds: [Object],
  scheduledFor: {
    type: Date,
    required: true,
  },
  recurring: {
    enabled: { type: Boolean, default: false },
    pattern: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'custom'],
    },
    customPattern: String, // Cron expression
    endDate: Date,
    nextRun: Date,
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed', 'cancelled'],
    default: 'pending',
  },
  sentAt: Date,
  error: String,
}, {
  timestamps: true,
});

scheduledMessageSchema.index({ scheduledFor: 1, status: 1 });

export default mongoose.model('ScheduledMessage', scheduledMessageSchema);