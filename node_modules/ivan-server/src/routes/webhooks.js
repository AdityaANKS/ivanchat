import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import { checkServerPermission } from '../middleware/roles.js';
import WebhookService from '../services/WebhookService.js';
import Webhook from '../models/Webhook.js';

const router = express.Router();

const webhookService = new WebhookService();

// Get webhooks for a server
router.get('/server/:serverId', 
  authenticateUser,
  checkServerPermission('manageWebhooks'),
  async (req, res) => {
    try {
      const webhooks = await Webhook.find({ server: req.params.serverId });
      res.json(webhooks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch webhooks' });
    }
  }
);

// Create webhook
router.post('/server/:serverId',
  authenticateUser,
  checkServerPermission('manageWebhooks'),
  async (req, res) => {
    try {
      const webhookData = {
        ...req.body,
        server: req.params.serverId,
        creator: req.user._id,
      };
      
      const webhook = await webhookService.createWebhook(webhookData);
      res.status(201).json(webhook);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create webhook' });
    }
  }
);

// Update webhook
router.patch('/:webhookId',
  authenticateUser,
  async (req, res) => {
    try {
      const webhook = await Webhook.findByIdAndUpdate(
        req.params.webhookId,
        req.body,
        { new: true }
      );
      
      if (!webhook) {
        return res.status(404).json({ error: 'Webhook not found' });
      }
      
      res.json(webhook);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update webhook' });
    }
  }
);

// Delete webhook
router.delete('/:webhookId',
  authenticateUser,
  async (req, res) => {
    try {
      const webhook = await Webhook.findByIdAndDelete(req.params.webhookId);
      
      if (!webhook) {
        return res.status(404).json({ error: 'Webhook not found' });
      }
      
      res.json({ message: 'Webhook deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete webhook' });
    }
  }
);

// Execute incoming webhook (public endpoint)
router.post('/execute/:token', async (req, res) => {
  try {
    const signature = req.headers['x-webhook-signature'];
    const result = await webhookService.handleIncomingWebhook(
      req.params.token,
      req.body,
      signature
    );
    
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Webhook test
router.post('/:webhookId/test',
  authenticateUser,
  async (req, res) => {
    try {
      const webhook = await Webhook.findById(req.params.webhookId);
      
      if (!webhook) {
        return res.status(404).json({ error: 'Webhook not found' });
      }
      
      // Send test payload
      await webhookService.sendOutgoingWebhook(
        webhook._id,
        'test',
        { message: 'Test webhook payload' }
      );
      
      res.json({ message: 'Test webhook sent' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to test webhook' });
    }
  }
);

export default router;