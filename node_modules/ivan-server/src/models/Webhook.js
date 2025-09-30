// server/models/Webhook.js
import mongoose from 'mongoose';
import crypto from 'crypto';

const webhookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
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
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  secret: String, // For webhook signature verification
  avatar: String,
  events: [{
    type: String,
    enum: [
      'message.created',
      'message.updated',
      'message.deleted',
      'user.joined',
      'user.left',
      'channel.created',
      'channel.updated',
      'voice.joined',
      'voice.left',
    ],
  }],
  url: String, // For outgoing webhooks
  type: {
    type: String,
    enum: ['incoming', 'outgoing'],
    default: 'incoming',
  },
  config: {
    username: String,
    avatarUrl: String,
    embedColor: String,
    mentionEveryone: { type: Boolean, default: false },
    tts: { type: Boolean, default: false },
  },
  rateLimit: {
    requests: { type: Number, default: 30 },
    window: { type: Number, default: 60 }, // seconds
  },
  stats: {
    totalRequests: { type: Number, default: 0 },
    successfulRequests: { type: Number, default: 0 },
    failedRequests: { type: Number, default: 0 },
    lastUsed: Date,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

webhookSchema.methods.generateToken = function() {
  this.token = crypto.randomBytes(32).toString('hex');
  this.secret = crypto.randomBytes(16).toString('hex');
  return this.token;
};

webhookSchema.methods.verifySignature = function(payload, signature) {
  const hmac = crypto.createHmac('sha256', this.secret);
  hmac.update(JSON.stringify(payload));
  const expectedSignature = `sha256=${hmac.digest('hex')}`;
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
};

export default mongoose.model('Webhook', webhookSchema);