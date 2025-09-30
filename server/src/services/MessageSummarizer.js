// server/services/MessageSummarizer.js
import { OpenAI } from 'openai';
import Message from '../models/Message.js';
import Redis from 'ioredis';

export class MessageSummarizer {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.redis = new Redis();
    this.summaryCache = new Map();
  }

  async summarizeThread(threadId, options = {}) {
    const cacheKey = `summary:thread:${threadId}`;
    const cached = await this.redis.get(cacheKey);
    
    if (cached && !options.force) {
      return JSON.parse(cached);
    }

    const messages = await Message.find({ thread: threadId })
      .populate('author', 'username')
      .sort({ createdAt: 1 });

    if (messages.length < 5) {
      return { summary: 'Thread too short to summarize', tooShort: true };
    }

    const summary = await this.generateSummary(messages, 'thread');
    
    // Cache for 1 hour
    await this.redis.setex(cacheKey, 3600, JSON.stringify(summary));
    
    return summary;
  }

  async summarizeChannel(channelId, timeRange = '24h', options = {}) {
    const cacheKey = `summary:channel:${channelId}:${timeRange}`;
    const cached = await this.redis.get(cacheKey);
    
    if (cached && !options.force) {
      return JSON.parse(cached);
    }

    const startTime = this.getStartTime(timeRange);
    const messages = await Message.find({
      channel: channelId,
      createdAt: { $gte: startTime },
    })
      .populate('author', 'username')
      .sort({ createdAt: 1 });

    if (messages.length < 10) {
      return { summary: 'Not enough activity to summarize', tooShort: true };
    }

    const summary = await this.generateSummary(messages, 'channel');
    
    // Cache based on time range
    const ttl = this.getCacheTTL(timeRange);
    await this.redis.setex(cacheKey, ttl, JSON.stringify(summary));
    
    return summary;
  }

  async generateSummary(messages, type) {
    const conversation = this.formatConversation(messages);
    
    const systemPrompt = type === 'thread' 
      ? 'You are a helpful assistant that creates concise summaries of chat threads. Focus on the main topic, key points discussed, and any conclusions or decisions made.'
      : 'You are a helpful assistant that creates channel activity summaries. Highlight the main topics discussed, active participants, and important announcements or decisions.';

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Please summarize this conversation:\n\n${conversation}\n\nProvide:\n1. A brief summary (2-3 sentences)\n2. Key topics discussed\n3. Important decisions or action items\n4. Most active participants` 
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      });

      const response = completion.choices[0].message.content;
      const parsed = this.parseAISummary(response);

      return {
        summary: parsed.summary,
        keyTopics: parsed.keyTopics,
        actionItems: parsed.actionItems,
        activeParticipants: this.getActiveParticipants(messages),
        messageCount: messages.length,
        timeRange: {
          start: messages[0].createdAt,
          end: messages[messages.length - 1].createdAt,
        },
        generatedAt: new Date(),
      };
    } catch (error) {
      console.error('Summary generation error:', error);
      throw error;
    }
  }

  async generateSmartSummary(channelId) {
    // Intelligent summary that identifies important messages
    const messages = await Message.find({ channel: channelId })
      .populate('author', 'username roles')
      .sort({ createdAt: -1 })
      .limit(100);

    // Score messages by importance
    const scoredMessages = messages.map(msg => ({
      message: msg,
      score: this.calculateMessageImportance(msg),
    }));

    // Select top important messages
    const important = scoredMessages
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map(item => item.message);

    return this.generateSummary(important, 'smart');
  }

  calculateMessageImportance(message) {
    let score = 0;

    // Reactions indicate importance
    if (message.reactions) {
      const totalReactions = Object.values(message.reactions)
        .reduce((sum, reaction) => sum + reaction.users.length, 0);
      score += totalReactions * 2;
    }

    // Pinned messages are important
    if (message.pinned) score += 10;

    // Messages from moderators/admins
    if (message.author.roles?.includes('moderator')) score += 5;
    if (message.author.roles?.includes('admin')) score += 8;

    // Thread starters
    if (message.thread) score += 3;

    // Mentions
    score += (message.mentions?.length || 0) * 1;

    // Length (longer messages might be more detailed)
    if (message.content.length > 200) score += 2;

    // Contains links (might be sharing resources)
    if (message.content.includes('http')) score += 2;

    // Contains code blocks (technical discussions)
    if (message.content.includes('```')) score += 3;

    return score;
  }

  formatConversation(messages) {
    return messages
      .map(msg => `${msg.author.username}: ${msg.content}`)
      .join('\n');
  }

  parseAISummary(response) {
    // Parse the structured response from AI
    const sections = response.split(/\d\.\s/);
    
    return {
      summary: sections[1]?.trim() || response,
      keyTopics: this.extractList(sections[2]),
      actionItems: this.extractList(sections[3]),
    };
  }

  extractList(text) {
    if (!text) return [];
    return text
      .split(/[-•]\s/)
      .filter(item => item.trim())
      .map(item => item.trim());
  }

  getActiveParticipants(messages) {
    const participants = new Map();
    
    for (const msg of messages) {
      const username = msg.author.username;
      participants.set(username, (participants.get(username) || 0) + 1);
    }

    return Array.from(participants.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([username, count]) => ({ username, messageCount: count }));
  }

  getStartTime(timeRange) {
    const now = new Date();
    const ranges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    };
    
    return new Date(now - (ranges[timeRange] || ranges['24h']));
  }

  getCacheTTL(timeRange) {
    const ttls = {
      '1h': 300,    // 5 minutes
      '24h': 3600,  // 1 hour
      '7d': 21600,  // 6 hours
      '30d': 86400, // 24 hours
    };
    
    return ttls[timeRange] || 3600;
  }
}