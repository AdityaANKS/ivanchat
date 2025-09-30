// server/services/DiscoveryService.js
import ChannelDiscovery from '../models/ChannelDiscovery.js';
import { Redis } from 'ioredis';
import * as tf from '@tensorflow/tfjs-node';

export class DiscoveryService {
  constructor() {
    this.redis = new Redis();
    this.model = null;
    this.initializeML();
  }

  async initializeML() {
    // Load recommendation model
    this.model = await tf.loadLayersModel('file://./models/recommendation/model.json');
  }

  // Calculate trending score using engagement metrics
  calculateTrendingScore(channel) {
    const weights = {
      memberGrowth: 0.3,
      messageActivity: 0.25,
      userEngagement: 0.25,
      recency: 0.2,
    };

    const hoursSinceCreation = (Date.now() - channel.createdAt) / (1000 * 60 * 60);
    const recencyBoost = Math.max(0, 1 - (hoursSinceCreation / 168)); // Boost for channels < 1 week old

    const score = 
      (channel.statistics.growthRate * weights.memberGrowth) +
      (channel.statistics.messageRate * weights.messageActivity) +
      ((channel.statistics.activeUsers / channel.statistics.memberCount) * weights.userEngagement) +
      (recencyBoost * weights.recency);

    return score * 1000; // Scale up for better granularity
  }

  // Update trending channels
  async updateTrendingChannels() {
    const channels = await ChannelDiscovery.find({ 'server.isPublic': true });
    
    const scoredChannels = channels.map(channel => ({
      channel,
      score: this.calculateTrendingScore(channel),
    }));

    scoredChannels.sort((a, b) => b.score - a.score);

    // Update rankings
    for (let i = 0; i < scoredChannels.length; i++) {
      await ChannelDiscovery.findByIdAndUpdate(scoredChannels[i].channel._id, {
        'trending.score': scoredChannels[i].score,
        'trending.rank': i + 1,
        'trending.updatedAt': new Date(),
      });
    }

    // Cache top trending
    const topTrending = scoredChannels.slice(0, 100).map(sc => sc.channel);
    await this.redis.setex('trending:channels', 3600, JSON.stringify(topTrending));
  }

  // Get personalized recommendations
  async getPersonalizedRecommendations(userId, limit = 20) {
    // Get user interaction history
    const userHistory = await this.getUserInteractionHistory(userId);
    
    // Get user preferences
    const userPreferences = await this.getUserPreferences(userId);
    
    // Use ML model for recommendations
    const features = this.extractUserFeatures(userHistory, userPreferences);
    const predictions = await this.model.predict(features).array();
    
    // Get recommended channels
    const recommendedChannels = await this.getChannelsFromPredictions(predictions, limit);
    
    // Mix with trending for diversity
    const trending = await this.getTrendingChannels(5);
    
    return this.diversifyRecommendations(recommendedChannels, trending);
  }

  // Get discovery feed
  async getDiscoveryFeed(userId, options = {}) {
    const {
      page = 1,
      limit = 20,
      category = null,
      tags = [],
      language = null,
    } = options;

    const query = {
      'server.isPublic': true,
      nsfw: false,
    };

    if (category) query.category = category;
    if (tags.length > 0) query.tags = { $in: tags };
    if (language) query.language = language;

    // Get personalized recommendations
    const personalized = await this.getPersonalizedRecommendations(userId, 5);

    // Get category-based channels
    const categoryChannels = await ChannelDiscovery.find(query)
      .sort({ 'trending.score': -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('channel server');

    // Combine and deduplicate
    const combined = [...personalized, ...categoryChannels];
    const unique = Array.from(new Map(combined.map(c => [c._id.toString(), c])).values());

    return {
      channels: unique.slice(0, limit),
      hasMore: unique.length === limit,
      page,
    };
  }

  async getUserInteractionHistory(userId) {
    // Implementation for getting user's channel interaction history
    return [];
  }

  async getUserPreferences(userId) {
    // Implementation for getting user preferences
    return {};
  }

  extractUserFeatures(history, preferences) {
    // Convert user data to feature vector for ML model
    return tf.tensor2d([[/* features */]]);
  }

  async getChannelsFromPredictions(predictions, limit) {
    // Convert predictions to channel recommendations
    return [];
  }

  diversifyRecommendations(personalized, trending) {
    // Mix personalized and trending for diversity
    const result = [];
    let pIndex = 0, tIndex = 0;
    
    while (result.length < 20 && (pIndex < personalized.length || tIndex < trending.length)) {
      if (pIndex < personalized.length && Math.random() > 0.3) {
        result.push(personalized[pIndex++]);
      } else if (tIndex < trending.length) {
        result.push(trending[tIndex++]);
      }
    }
    
    return result;
  }
}