// server/services/MarketplaceService.js
import MarketplaceItem from '../models/MarketplaceItem.js';
import { SandboxRunner } from './SandboxRunner.js';
import Stripe from 'stripe';

export class MarketplaceService {
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    this.sandboxRunner = new SandboxRunner();
  }

  async publishItem(itemData, authorId) {
    // Validate and scan the item
    await this.validateItem(itemData);
    await this.scanForMalware(itemData);
    
    // Test in sandbox
    const testResults = await this.sandboxRunner.test(itemData);
    if (!testResults.passed) {
      throw new Error(`Sandbox tests failed: ${testResults.errors.join(', ')}`);
    }

    // Create marketplace item
    const item = new MarketplaceItem({
      ...itemData,
      author: authorId,
      slug: this.generateSlug(itemData.name),
      'verification.status': 'pending',
    });

    await item.save();

    // Queue for manual review
    await this.queueForReview(item);

    return item;
  }

  async installItem(itemId, serverId, userId) {
    const item = await MarketplaceItem.findById(itemId);
    if (!item) throw new Error('Item not found');

    // Check if already installed
    const existing = await Installation.findOne({
      item: itemId,
      server: serverId,
    });
    
    if (existing) {
      throw new Error('Item already installed');
    }

    // Process payment if required
    if (item.pricing.model !== 'free') {
      await this.processPayment(item, userId);
    }

    // Install the item
    const installation = await this.performInstallation(item, serverId);

    // Update stats
    await MarketplaceItem.findByIdAndUpdate(itemId, {
      $inc: { 'stats.installs': 1 },
    });

    // Grant permissions
    await this.grantPermissions(item, serverId);

    return installation;
  }

  async performInstallation(item, serverId) {
    switch (item.type) {
      case 'bot':
        return this.installBot(item, serverId);
      case 'theme':
        return this.installTheme(item, serverId);
      case 'extension':
        return this.installExtension(item, serverId);
      case 'widget':
        return this.installWidget(item, serverId);
      default:
        throw new Error(`Unknown item type: ${item.type}`);
    }
  }

  async installBot(bot, serverId) {
    // Download bot code
    const code = await this.downloadItemCode(bot);
    
    // Create bot instance
    const instance = new BotInstance({
      bot: bot._id,
      server: serverId,
      config: bot.configuration.defaults,
      status: 'active',
    });

    await instance.save();

    // Start bot in isolated environment
    await this.sandboxRunner.startBot(instance, code);

    return instance;
  }

  async installTheme(theme, serverId) {
    // Download theme assets
    const assets = await this.downloadThemeAssets(theme);
    
    // Store theme configuration
    const config = new ThemeConfig({
      theme: theme._id,
      server: serverId,
      assets,
      customizations: {},
    });

    await config.save();

    // Apply theme to server
    await this.applyTheme(serverId, config);

    return config;
  }

  async searchMarketplace(query, filters = {}) {
    const searchQuery = {};

    if (query) {
      searchQuery.$text = { $search: query };
    }

    if (filters.type) {
      searchQuery.type = filters.type;
    }

    if (filters.category) {
      searchQuery['metadata.category'] = filters.category;
    }

    if (filters.priceRange) {
      searchQuery['pricing.price'] = {
        $gte: filters.priceRange.min,
        $lte: filters.priceRange.max,
      };
    }

    if (filters.verified) {
      searchQuery['verification.status'] = 'verified';
    }

    const sort = {};
    switch (filters.sortBy) {
      case 'popular':
        sort['stats.downloads'] = -1;
        break;
      case 'rating':
        sort['stats.rating.average'] = -1;
        break;
      case 'newest':
        sort.createdAt = -1;
        break;
      case 'price_low':
        sort['pricing.price'] = 1;
        break;
      case 'price_high':
        sort['pricing.price'] = -1;
        break;
      default:
        sort['stats.downloads'] = -1;
    }

    const items = await MarketplaceItem.find(searchQuery)
      .sort(sort)
      .limit(filters.limit || 50)
      .skip(filters.offset || 0)
      .populate('author', 'username avatar');

    return items;
  }

  async getRecommendations(userId, serverId) {
    // Get user's installed items
    const installations = await Installation.find({
      $or: [
        { installedBy: userId },
        { server: serverId },
      ],
    }).populate('item');

    // Extract categories and tags
    const userPreferences = this.extractUserPreferences(installations);

    // Find similar items
    const recommendations = await MarketplaceItem.find({
      _id: { $nin: installations.map(i => i.item._id) },
      'verification.status': 'verified',
      $or: [
        { 'metadata.category': { $in: userPreferences.categories } },
        { 'metadata.tags': { $in: userPreferences.tags } },
      ],
    })
      .sort({ 'stats.rating.average': -1, 'stats.downloads': -1 })
      .limit(20);

    return recommendations;
  }

  async processPayment(item, userId) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: item.pricing.price * 100, // Convert to cents
      currency: item.pricing.currency.toLowerCase(),
      metadata: {
        itemId: item._id.toString(),
        userId: userId.toString(),
      },
    });

    // Store payment record
    const payment = new Payment({
      user: userId,
      item: item._id,
      amount: item.pricing.price,
      currency: item.pricing.currency,
      stripePaymentIntent: paymentIntent.id,
      status: 'pending',
    });

    await payment.save();

    return paymentIntent;
  }

  async validateItem(itemData) {
    // Validate required fields
    if (!itemData.name || !itemData.type || !itemData.description) {
      throw new Error('Missing required fields');
    }

    // Validate permissions
    if (itemData.permissions) {
      for (const permission of itemData.permissions) {
        if (!this.isValidPermission(permission.scope)) {
          throw new Error(`Invalid permission scope: ${permission.scope}`);
        }
      }
    }

    // Validate configuration schema
    if (itemData.configuration?.schema) {
      this.validateJSONSchema(itemData.configuration.schema);
    }
  }

  async scanForMalware(itemData) {
    // Implement malware scanning
    // This would integrate with a service like VirusTotal or custom scanning
  }

  generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  isValidPermission(scope) {
    const validScopes = [
      'messages.read',
      'messages.write',
      'channels.read',
      'channels.manage',
      'users.read',
      'voice.connect',
      'webhooks.create',
      'slash_commands.create',
    ];
    
    return validScopes.includes(scope);
  }

  validateJSONSchema(schema) {
    // Validate JSON schema structure
    // Implementation would use a JSON schema validator
  }
}