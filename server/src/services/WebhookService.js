// server/services/WebhookService.js
import Webhook from '../models/Webhook.js';
import axios from 'axios';
import Bull from 'bull';
import RateLimiter from '../utils/RateLimiter.js';

export class WebhookService {
  constructor() {
    this.queue = new Bull('webhooks', {
      redis: {
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
      },
    });
    this.rateLimiter = new RateLimiter();
    this.setupQueueProcessor();
  }

  setupQueueProcessor() {
    this.queue.process('outgoing', async (job) => {
      const { webhookId, event, data } = job.data;
      await this.sendOutgoingWebhook(webhookId, event, data);
    });

    this.queue.process('incoming', async (job) => {
      const { webhookId, payload } = job.data;
      await this.processIncomingWebhook(webhookId, payload);
    });
  }

  async createWebhook(data) {
    const webhook = new Webhook(data);
    webhook.generateToken();
    await webhook.save();
    return webhook;
  }

  async handleIncomingWebhook(token, payload, signature) {
    const webhook = await Webhook.findOne({ token, type: 'incoming' });
    
    if (!webhook || !webhook.enabled) {
      throw new Error('Invalid or disabled webhook');
    }

    // Verify signature if configured
    if (webhook.secret && !webhook.verifySignature(payload, signature)) {
      throw new Error('Invalid signature');
    }

    // Rate limiting
    const rateLimitKey = `webhook:${webhook._id}`;
    const allowed = await this.rateLimiter.check(
      rateLimitKey,
      webhook.rateLimit.requests,
      webhook.rateLimit.window
    );

    if (!allowed) {
      throw new Error('Rate limit exceeded');
    }

    // Queue for processing
    await this.queue.add('incoming', {
      webhookId: webhook._id,
      payload,
    });

    // Update stats
    await Webhook.findByIdAndUpdate(webhook._id, {
      $inc: { 'stats.totalRequests': 1, 'stats.successfulRequests': 1 },
      'stats.lastUsed': new Date(),
    });

    return { success: true, messageId: job.id };
  }

  async processIncomingWebhook(webhookId, payload) {
    const webhook = await Webhook.findById(webhookId)
      .populate('channel');

    // Parse and validate payload
    const messageData = this.parseWebhookPayload(payload);

    // Apply webhook config
    if (webhook.config.username) {
      messageData.username = webhook.config.username;
    }
    if (webhook.config.avatarUrl) {
      messageData.avatar = webhook.config.avatarUrl;
    }

    // Create message
    const message = new Message({
      channel: webhook.channel._id,
      content: messageData.content,
      author: null, // Webhook message
      webhook: webhook._id,
      embeds: messageData.embeds,
      attachments: messageData.attachments,
    });

    await message.save();

    // Emit to channel
    io.to(`channel:${webhook.channel._id}`).emit('new-message', {
      message: message.toObject(),
      isWebhook: true,
    });
  }

  async triggerOutgoingWebhooks(event, data) {
    const webhooks = await Webhook.find({
      type: 'outgoing',
      events: event,
      enabled: true,
    });

    for (const webhook of webhooks) {
      await this.queue.add('outgoing', {
        webhookId: webhook._id,
        event,
        data,
      });
    }
  }

  async sendOutgoingWebhook(webhookId, event, data) {
    const webhook = await Webhook.findById(webhookId);
    if (!webhook || !webhook.enabled) return;

    const payload = this.formatOutgoingPayload(event, data);
    
    // Add signature
    const signature = this.generateSignature(payload, webhook.secret);

    try {
      const response = await axios.post(webhook.url, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-Ivan-Signature': signature,
          'X-Ivan-Event': event,
          'X-Ivan-Webhook-ID': webhook._id,
        },
        timeout: 10000,
      });

      await Webhook.findByIdAndUpdate(webhook._id, {
        $inc: { 'stats.successfulRequests': 1 },
        'stats.lastUsed': new Date(),
      });

      return response.data;
    } catch (error) {
      await Webhook.findByIdAndUpdate(webhook._id, {
        $inc: { 'stats.failedRequests': 1 },
      });

      // Retry logic
      if (error.response?.status >= 500) {
        throw error; // Will be retried by Bull
      }
    }
  }

  parseWebhookPayload(payload) {
    const data = {
      content: payload.content || '',
      embeds: [],
      attachments: [],
    };

    // Parse embeds
    if (payload.embeds && Array.isArray(payload.embeds)) {
      data.embeds = payload.embeds.map(embed => ({
        title: embed.title,
        description: embed.description,
        url: embed.url,
        color: embed.color,
        fields: embed.fields || [],
        thumbnail: embed.thumbnail,
        image: embed.image,
        footer: embed.footer,
        timestamp: embed.timestamp,
      }));
    }

    // Parse attachments
    if (payload.attachments && Array.isArray(payload.attachments)) {
      data.attachments = payload.attachments.map(att => ({
        url: att.url,
        filename: att.filename,
        size: att.size,
        mimeType: att.mimeType,
      }));
    }

    return data;
  }

  formatOutgoingPayload(event, data) {
    const payload = {
      event,
      timestamp: new Date().toISOString(),
      data: {},
    };

    switch (event) {
      case 'message.created':
        payload.data = {
          id: data.message._id,
          content: data.message.content,
          author: {
            id: data.message.author._id,
            username: data.message.author.username,
            avatar: data.message.author.avatar,
          },
          channel: {
            id: data.message.channel._id,
            name: data.message.channel.name,
          },
          timestamp: data.message.createdAt,
        };
        break;
      
      case 'user.joined':
        payload.data = {
          user: {
            id: data.user._id,
            username: data.user.username,
            avatar: data.user.avatar,
          },
          server: {
            id: data.server._id,
            name: data.server.name,
          },
          joinedAt: data.joinedAt,
        };
        break;
      
      // Add more event formatters as needed
    }

    return payload;
  }

  generateSignature(payload, secret) {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(payload));
    return `sha256=${hmac.digest('hex')}`;
  }
}