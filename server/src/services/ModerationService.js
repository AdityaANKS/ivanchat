import * as toxicity from '@tensorflow-models/toxicity';
import Filter from 'bad-words';
import natural from 'natural';
import redisClient from '../config/redis.js';

class ModerationService {
  constructor() {
    this.toxicityModel = null;
    this.filter = new Filter();
    this.customBadWords = [];
    this.whitelistedWords = [];
    this.spamDetector = new natural.BayesClassifier();
    this.initializeModels();
  }

  async initializeModels() {
    try {
      // Load toxicity model
      this.toxicityModel = await toxicity.load(0.7);
      console.log('Toxicity model loaded');

      // Load custom word lists
      await this.loadCustomWordLists();

      // Train spam detector
      await this.trainSpamDetector();
    } catch (error) {
      console.error('Failed to initialize moderation models:', error);
    }
  }

  async loadCustomWordLists() {
    // Load from database or config
    this.customBadWords = await redisClient.smembers('moderation:badwords') || [];
    this.whitelistedWords = await redisClient.smembers('moderation:whitelist') || [];
    
    // Add custom bad words to filter
    this.customBadWords.forEach(word => this.filter.addWords(word));
    
    // Remove whitelisted words
    this.whitelistedWords.forEach(word => this.filter.removeWords(word));
  }

  async trainSpamDetector() {
    // Training data for spam detection
    const spamExamples = [
      'Buy now! Limited offer!',
      'Click here to win $1000',
      'Free money! No scam!',
      'Visit my website for free stuff',
      'SPAM SPAM SPAM SPAM',
      'You won a free iPhone! Just pay a small shipping fee to claim your prize!',
      'Congratulations! You have been selected for a cash reward. Click the link to claim it now!',
      'This is not a scam! Send me your bank details to receive your prize money.',
      'Earn $5000 a week from home! No experience needed. Sign up now!',
      'Get rich quick with this one simple trick! Click here to find out more.',
      'Limited time offer! Buy one get one free on all items. Don\'t miss out!',
      'Act fast! This deal won\'t last long. Click here to shop now!',
      'You have a new voicemail. Click the link to listen to your messages.',
      'Your account has been compromised. Click here to reset your password immediately.',
      'This is your last chance to claim your prize! Click the link before it\'s too late.',
      'Congratulations! You are a lucky winner of a free vacation. Click here to claim your prize.',
      'Get paid to work from home! No experience necessary. Sign up today!',
      'This is not a joke! You have won a free gift card. Click the link to claim it now.',
      'Earn money fast with this simple online job. No skills required. Start earning today!',
      'You have been selected for a special offer. Click here to find out more.',
      'Free trial! Sign up now and get one month free access to our premium service.',
      'Congratulations! You have won a lottery. Click the link to claim your winnings.',
      'This is not spam! You have won a free gift. Click here to claim it now.',
      'Get paid to take surveys! No experience needed. Sign up today and start earning.',
      'Your bank account has been compromised! Click here to verify your login details immediately.',
      'We have noticed suspicious activity on your account. Please log in to secure your account now.',
      'You have a refund of $500 coming. Provide your details to process it.'
    ];

    const hamExamples = [
      'Hey, how are you doing?',
      'What do you think about this?',
      'Thanks for the help!',
      'See you tomorrow',
      'Great game last night',
    ];

    spamExamples.forEach(text => this.spamDetector.addDocument(text, 'spam'));
    hamExamples.forEach(text => this.spamDetector.addDocument(text, 'ham'));
    
    this.spamDetector.train();
  }

  async moderateContent(content) {
    const result = {
      blocked: false,
      flagged: false,
      reason: null,
      filteredContent: content,
      warnings: [],
      score: 0,
    };

    // Check for empty content
    if (!content || content.trim().length === 0) {
      return result;
    }

    // 1. Profanity filter
    if (this.filter.isProfane(content)) {
      result.filteredContent = this.filter.clean(content);
      result.warnings.push('profanity');
      result.score += 30;
    }

    // 2. Toxicity detection
    if (this.toxicityModel) {
      try {
        const predictions = await this.toxicityModel.classify([content]);
        
        for (const prediction of predictions) {
          if (prediction.results[0].match) {
            result.warnings.push(prediction.label);
            
            // Different weights for different types
            const weights = {
              'identity_attack': 50,
              'insult': 40,
              'obscene': 35,
              'severe_toxicity': 60,
              'sexual_explicit': 45,
              'threat': 55,
              'toxicity': 30,
            };
            
            result.score += weights[prediction.label] || 20;
          }
        }
      } catch (error) {
        console.error('Toxicity detection error:', error);
      }
    }

    // 3. Spam detection
    const spamClassification = this.spamDetector.classify(content);
    if (spamClassification === 'spam') {
      result.warnings.push('spam');
      result.score += 40;
    }

    // 4. Pattern-based checks
    const patterns = [
      { regex: /(.)\1{5,}/g, warning: 'repeated_characters', score: 10 },
      { regex: /[A-Z]{5,}/g, warning: 'excessive_caps', score: 15 },
      { regex: /(http|https):\/\/[^\s]+/gi, warning: 'contains_links', score: 5 },
      { regex: /\b(\w+@\w+\.\w+)\b/gi, warning: 'contains_email', score: 10 },
      { regex: /\b\d{3,4}[-.\s]?\d{3,4}[-.\s]?\d{4}\b/g, warning: 'contains_phone', score: 20 },
    ];

    patterns.forEach(({ regex, warning, score }) => {
      if (regex.test(content)) {
        result.warnings.push(warning);
        result.score += score;
      }
    });

    // 5. Determine action based on score
    if (result.score >= 70) {
      result.blocked = true;
      result.reason = 'Content violates community guidelines';
    } else if (result.score >= 40) {
      result.flagged = true;
      result.reason = 'Content flagged for review';
    }

    // 6. Log moderation action
    if (result.blocked || result.flagged) {
      await this.logModerationAction(content, result);
    }

    return result;
  }

  async moderateImage(imageUrl) {
    // Implement image moderation using a service like Google Cloud Vision API
    // or Azure Content Moderator
    return {
      safe: true,
      warnings: [],
    };
  }

  async checkUserReputation(userId) {
    const key = `user:reputation:${userId}`;
    const reputation = await redisClient.get(key);
    
    if (!reputation) {
      return { score: 100, status: 'good' };
    }

    const score = parseInt(reputation);
    let status = 'good';
    
    if (score < 30) status = 'poor';
    else if (score < 60) status = 'warning';
    else if (score < 80) status = 'fair';

    return { score, status };
  }

  async updateUserReputation(userId, change, reason) {
    const key = `user:reputation:${userId}`;
    const current = parseInt(await redisClient.get(key)) || 100;
    const newScore = Math.max(0, Math.min(100, current + change));
    
    await redisClient.set(key, newScore);
    
    // Log reputation change
    await redisClient.lpush(
      `user:reputation:log:${userId}`,
      JSON.stringify({
        change,
        reason,
        newScore,
        timestamp: Date.now(),
      })
    );

    return newScore;
  }

  async logModerationAction(content, result) {
    const logEntry = {
      content: content.substring(0, 200), // Truncate for storage
      result,
      timestamp: Date.now(),
    };

    await redisClient.lpush('moderation:log', JSON.stringify(logEntry));
    
    // Keep only last 1000 entries
    await redisClient.ltrim('moderation:log', 0, 999);
  }

  async addCustomBadWord(word) {
    await redisClient.sadd('moderation:badwords', word);
    this.filter.addWords(word);
    this.customBadWords.push(word);
  }

  async removeCustomBadWord(word) {
    await redisClient.srem('moderation:badwords', word);
    this.filter.removeWords(word);
    this.customBadWords = this.customBadWords.filter(w => w !== word);
  }

  async whitelistWord(word) {
    await redisClient.sadd('moderation:whitelist', word);
    this.filter.removeWords(word);
    this.whitelistedWords.push(word);
  }
}

export default new ModerationService();
export { ModerationService };

// Convenience function
export const moderateContent = (content) => 
  new ModerationService().moderateContent(content);