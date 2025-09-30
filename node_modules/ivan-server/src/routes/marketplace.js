import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import MarketplaceService from '../services/MarketplaceService.js';
import MarketplaceItem from '../models/MarketplaceItem.js';

const router = express.Router();
const marketplaceService = new MarketplaceService();

// Browse marketplace
router.get('/items', async (req, res) => {
  try {
    const items = await marketplaceService.searchMarketplace(
      req.query.q,
      req.query
    );
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch marketplace items' });
  }
});

// Get item details
router.get('/items/:itemId', async (req, res) => {
  try {
    const item = await MarketplaceItem.findById(req.params.itemId)
      .populate('author', 'username avatar');
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// Get recommendations
router.get('/recommendations',
  authenticateUser,
  async (req, res) => {
    try {
      const recommendations = await marketplaceService.getRecommendations(
        req.user._id,
        req.query.serverId
      );
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
  }
);

// Publish item
router.post('/items',
  authenticateUser,
  async (req, res) => {
    try {
      const item = await marketplaceService.publishItem(
        req.body,
        req.user._id
      );
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: 'Failed to publish item' });
    }
  }
);

// Install item
router.post('/items/:itemId/install',
  authenticateUser,
  async (req, res) => {
    try {
      const installation = await marketplaceService.installItem(
        req.params.itemId,
        req.body.serverId,
        req.user._id
      );
      res.json(installation);
    } catch (error) {
      res.status(500).json({ error: 'Failed to install item' });
    }
  }
);

// Rate item
router.post('/items/:itemId/rate',
  authenticateUser,
  async (req, res) => {
    try {
      const { rating, review } = req.body;
      
      // Save rating
      const item = await MarketplaceItem.findById(req.params.itemId);
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      
      // Update rating stats
      const currentTotal = item.stats.rating.average * item.stats.rating.count;
      item.stats.rating.count++;
      item.stats.rating.average = (currentTotal + rating) / item.stats.rating.count;
      await item.save();
      
      res.json({ message: 'Rating saved' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to rate item' });
    }
  }
);

// Report item
router.post('/items/:itemId/report',
  authenticateUser,
  async (req, res) => {
    try {
      // Implementation for reporting items
      res.json({ message: 'Report submitted' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to report item' });
    }
  }
);

export default router;