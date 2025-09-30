import axios from 'axios';
import Filter from 'bad-words';
import natural from 'natural';
import redisClient from '../config/redis.js';

// URL of TensorFlow Serving (adjust host/port if using Docker or remote)
const TFSERVING_URL = 'http://localhost:8501/v1/models/toxicity_model:predict';

class ModerationService {
  constructor() {
    this.filter = new Filter();
    this.customBadWords = [];
    this.whitelistedWords = [];
    this.spamDetector = new natural.BayesClassifier();
    this.initializeModels();
  }

  async initializeModels() {
    try {
      await this.loadCustomWordLists();
      await this.trainSpamDetector();
      console.log('Moderation models initialized');
    } catch (error) {
      console.error('Failed to initialize moderation models:', error);
    }
  }

  async loadCustomWordLists() {
    this.customBadWords = await redisClient.smembers('moderation:badwords') || [];
    this.whitelistedWords = await redisClient.smembers('moderation:whitelist') || [];

    this.customBadWords.forEach(word => this.filter.addWords(word));
    this.whitelistedWords.forEach(word => this.filter.removeWords(word));
  }

  async trainSpamDetector() {
    const spamExamples = [
      'Buy now! Limited offer!',
      'Click here to win $1000',
      'Free money! No scam!',
      'Visit my website for free stuff',
      'SPAM SPAM SPAM SPAM',
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

  /**
   * 🔮 Async Toxicity Prediction
   */
  async predictToxicity(contents) {
    if (!Array.isArray(contents)) contents = [contents];

    try {
      const response = await axios.post(TFSERVING_URL, {
        instances: contents,
      });

      return response.data.predictions;
    } catch (err) {
      console.error('Toxicity API error:', err.message);
      return null;
    }
  }

  /**
   * 🎯 Main moderation logic
   */
  async moderateContent(content) {
    const result = {
      blocked: false,
      flagged: false,
      reason: null,
      filteredContent: content,
      warnings: [],
      score: 0,
    };

    if (!content || content.trim().length === 0) return result;

    // 1. Profanity
    if (this.filter.isProfane(content)) {
      result.filteredContent = this.filter.clean(content);
      result.warnings.push('profanity');
      result.score += 30;
    }

    // 2. Toxicity via TensorFlow Serving
    const predictions = await this.predictToxicity(content);
    if (predictions && predictions[0]) {
      const labelMap = {
        identity_attack: 50,
        insult: 40,
        obscene: 35,
        severe_toxicity: 60,
        sexual_explicit: 45,
        threat: 55,
        toxicity: 30,
      };

      for (const [label, prob] of Object.entries(predictions[0])) {
        if (prob > 0.7) {
          result.warnings.push(label);
          result.score += labelMap[label] || 20;
        }
      }
    }

    // 3. Spam detection
    const spamClassification = this.spamDetector.classify(content);
    if (spamClassification === 'spam') {
      result.warnings.push('spam');
      result.score += 40;
    }

    // 4. Patterns
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

    // 5. Decision
    if (result.score >= 70) {
      result.blocked = true;
      result.reason = 'Content violates community guidelines';
    } else if (result.score >= 40) {
      result.flagged = true;
      result.reason = 'Content flagged for review';
    }

    if (result.blocked || result.flagged) {
      await this.logModerationAction(content, result);
    }

    return result;
  }

  async logModerationAction(content, result) {
    const logEntry = {
      content: content.substring(0, 200),
      result,
      timestamp: Date.now(),
    };

    await redisClient.lpush('moderation:log', JSON.stringify(logEntry));
    await redisClient.ltrim('moderation:log', 0, 999);

    // For a single content
const result = await moderationService.moderateContent("You are stupid!");

// For multiple contents in one API call
const batchPredictions = await moderationService.predictToxicity([
  "You are dumb!",
  "I love this app!",
  "Visit my scam website!",
]);

  }
}

export default new ModerationService();
