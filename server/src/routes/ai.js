const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Translate } = require('@google-cloud/translate').v2;
const { LanguageServiceClient } = require('@google-cloud/language');
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const { SpeechClient } = require('@google-cloud/speech');
const Replicate = require('replicate');
const cohere = require('cohere-ai');
const { HfInference } = require('@huggingface/inference');

// Middleware
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { rateLimiter } = require('../middleware/rateLimiter');
const { validateAIRequest } = require('../middleware/aiValidator');
const { checkAIUsage } = require('../middleware/aiUsageLimit');

// Services
const AIService = require('../services/ai/AIService');
const ContentModerationAI = require('../services/ai/ContentModerationAI');
const TranslationService = require('../services/ai/TranslationService');
const SummarizationService = require('../services/ai/SummarizationService');
const ImageGenerationService = require('../services/ai/ImageGenerationService');
const VoiceService = require('../services/ai/VoiceService');
const EmbeddingService = require('../services/ai/EmbeddingService');
const CodeAssistant = require('../services/ai/CodeAssistant');

// Models
const Message = require('../models/Message');
const Channel = require('../models/Channel');
const AIUsage = require('../models/AIUsage');
const AIConversation = require('../models/AIConversation');
const User = require('../models/User');

// Utils
const { logger } = require('../utils/logger');
const { AppError } = require('../utils/errors');
const { sanitizeInput } = require('../utils/sanitizer');

// Initialize AI clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
const translate = new Translate({ key: process.env.GOOGLE_TRANSLATE_API_KEY });
const languageClient = new LanguageServiceClient();
const ttsClient = new TextToSpeechClient();
const speechClient = new SpeechClient();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

cohere.init(process.env.COHERE_API_KEY);

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Initialize services
const aiService = new AIService();
const contentModerationAI = new ContentModerationAI();
const translationService = new TranslationService();
const summarizationService = new SummarizationService();
const imageGenerationService = new ImageGenerationService();
const voiceService = new VoiceService();
const embeddingService = new EmbeddingService();
const codeAssistant = new CodeAssistant();

// AI Usage Limits per plan
const AI_LIMITS = {
  free: {
    chat: 20,           // messages per day
    images: 5,          // images per day
    voice: 10,          // minutes per day
    translation: 50,    // translations per day
    summarization: 10   // summaries per day
  },
  monthly: {
    chat: 200,
    images: 50,
    voice: 60,
    translation: 500,
    summarization: 100
  },
  yearly: {
    chat: 1000,
    images: 200,
    voice: 300,
    translation: 2000,
    summarization: 500
  },
  lifetime: {
    chat: -1,    // Unlimited
    images: -1,
    voice: -1,
    translation: -1,
    summarization: -1
  }
};

/**
 * @route   POST /api/ai/chat
 * @desc    AI chat assistant
 * @access  Private
 */
router.post('/chat',
  authenticate,
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 30 }),
  checkAIUsage('chat'),
  validateAIRequest,
  async (req, res) => {
    try {
      const { 
        message, 
        conversationId, 
        model = 'gpt-4',
        temperature = 0.7,
        systemPrompt,
        channelId 
      } = req.body;
      
      const userId = req.user.id;

      // Sanitize input
      const sanitizedMessage = sanitizeInput(message);

      // Get or create conversation
      let conversation;
      if (conversationId) {
        conversation = await AIConversation.findById(conversationId);
        if (!conversation || conversation.userId.toString() !== userId) {
          return res.status(404).json({ error: 'Conversation not found' });
        }
      } else {
        conversation = await AIConversation.create({
          userId,
          channelId,
          model,
          messages: []
        });
      }

      // Prepare messages for AI
      const messages = [
        {
          role: 'system',
          content: systemPrompt || 'You are IvanChat AI, a helpful assistant for a Discord-like chat platform. Be friendly, concise, and helpful.'
        },
        ...conversation.messages.map(m => ({
          role: m.role,
          content: m.content
        })),
        {
          role: 'user',
          content: sanitizedMessage
        }
      ];

      // Generate AI response
      let aiResponse;
      
      switch (model) {
        case 'gpt-4':
        case 'gpt-3.5-turbo':
          const completion = await openai.chat.completions.create({
            model,
            messages,
            temperature,
            max_tokens: 1000,
            stream: false
          });
          aiResponse = completion.choices[0].message.content;
          break;
          
        case 'gemini-pro':
          const geminiModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
          const result = await geminiModel.generateContent(sanitizedMessage);
          aiResponse = result.response.text();
          break;
          
        case 'claude':
          // Claude implementation
          aiResponse = await aiService.generateClaudeResponse(messages, temperature);
          break;
          
        default:
          throw new AppError('Invalid model selected', 400);
      }

      // Update conversation
      conversation.messages.push(
        { role: 'user', content: sanitizedMessage },
        { role: 'assistant', content: aiResponse }
      );
      await conversation.save();

      // Track usage
      await AIUsage.create({
        userId,
        type: 'chat',
        model,
        tokensUsed: aiResponse.length, // Approximate
        cost: calculateCost(model, aiResponse.length),
        metadata: { conversationId: conversation._id }
      });

      // Send response
      res.json({
        success: true,
        response: aiResponse,
        conversationId: conversation._id,
        model,
        usage: {
          tokensUsed: aiResponse.length,
          remaining: await getRemainingUsage(userId, 'chat')
        }
      });

    } catch (error) {
      logger.error('AI chat error:', error);
      res.status(500).json({ 
        error: 'Failed to generate AI response',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route   POST /api/ai/summarize
 * @desc    Summarize messages in a channel
 * @access  Private
 */
router.post('/summarize',
  authenticate,
  rateLimiter({ windowMs: 5 * 60 * 1000, max: 10 }),
  checkAIUsage('summarization'),
  async (req, res) => {
    try {
      const { channelId, messageCount = 50, style = 'brief' } = req.body;
      const userId = req.user.id;

      // Check channel access
      const channel = await Channel.findById(channelId);
      if (!channel) {
        return res.status(404).json({ error: 'Channel not found' });
      }

      // Fetch recent messages
      const messages = await Message.find({ channelId })
        .sort({ createdAt: -1 })
        .limit(messageCount)
        .populate('userId', 'username')
        .lean();

      if (messages.length === 0) {
        return res.status(400).json({ error: 'No messages to summarize' });
      }

      // Prepare text for summarization
      const conversationText = messages
        .reverse()
        .map(m => `${m.userId.username}: ${m.content}`)
        .join('\n');

      // Generate summary based on style
      let summary;
      
      switch (style) {
        case 'brief':
          summary = await summarizationService.generateBriefSummary(conversationText);
          break;
          
        case 'detailed':
          summary = await summarizationService.generateDetailedSummary(conversationText);
          break;
          
        case 'bullet':
          summary = await summarizationService.generateBulletPoints(conversationText);
          break;
          
        case 'action-items':
          summary = await summarizationService.extractActionItems(conversationText);
          break;
          
        default:
          summary = await summarizationService.generateBriefSummary(conversationText);
      }

      // Extract key topics
      const topics = await summarizationService.extractTopics(conversationText);

      // Sentiment analysis
      const sentiment = await analyzeSentiment(conversationText);

      // Track usage
      await AIUsage.create({
        userId,
        type: 'summarization',
        metadata: { 
          channelId, 
          messageCount,
          style 
        }
      });

      res.json({
        success: true,
        summary,
        topics,
        sentiment,
        messageCount: messages.length,
        timeRange: {
          from: messages[0].createdAt,
          to: messages[messages.length - 1].createdAt
        }
      });

    } catch (error) {
      logger.error('Summarization error:', error);
      res.status(500).json({ error: 'Failed to generate summary' });
    }
  }
);

/**
 * @route   POST /api/ai/translate
 * @desc    Translate message
 * @access  Private
 */
router.post('/translate',
  authenticate,
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 50 }),
  checkAIUsage('translation'),
  async (req, res) => {
    try {
      const { text, targetLanguage, sourceLanguage = 'auto' } = req.body;
      const userId = req.user.id;

      if (!text || !targetLanguage) {
        return res.status(400).json({ error: 'Text and target language required' });
      }

      // Detect source language if auto
      let detectedLanguage;
      if (sourceLanguage === 'auto') {
        const detection = await translate.detect(text);
        detectedLanguage = detection[0].language;
      }

      // Translate text
      const [translation] = await translate.translate(text, targetLanguage);

      // Get alternative translations using other services
      const alternatives = await translationService.getAlternativeTranslations(
        text,
        targetLanguage,
        detectedLanguage || sourceLanguage
      );

      // Track usage
      await AIUsage.create({
        userId,
        type: 'translation',
        metadata: {
          sourceLanguage: detectedLanguage || sourceLanguage,
          targetLanguage,
          textLength: text.length
        }
      });

      res.json({
        success: true,
        translation,
        alternatives,
        sourceLanguage: detectedLanguage || sourceLanguage,
        targetLanguage,
        confidence: 0.95 // Example confidence score
      });

    } catch (error) {
      logger.error('Translation error:', error);
      res.status(500).json({ error: 'Failed to translate text' });
    }
  }
);

/**
 * @route   POST /api/ai/generate-image
 * @desc    Generate image from text
 * @access  Private (Premium)
 */
router.post('/generate-image',
  authenticate,
  authorize(['monthly', 'yearly', 'lifetime']),
  rateLimiter({ windowMs: 5 * 60 * 1000, max: 5 }),
  checkAIUsage('images'),
  async (req, res) => {
    try {
      const { 
        prompt, 
        model = 'dall-e-3',
        size = '1024x1024',
        quality = 'standard',
        style = 'vivid',
        n = 1 
      } = req.body;
      
      const userId = req.user.id;

      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      // Check content appropriateness
      const isAppropriate = await contentModerationAI.checkPrompt(prompt);
      if (!isAppropriate) {
        return res.status(400).json({ error: 'Inappropriate content detected' });
      }

      let imageUrls = [];

      switch (model) {
        case 'dall-e-3':
        case 'dall-e-2':
          const response = await openai.images.generate({
            model,
            prompt,
            n,
            size,
            quality,
            style
          });
          imageUrls = response.data.map(img => img.url);
          break;
          
        case 'stable-diffusion':
          const output = await replicate.run(
            "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
            {
              input: {
                prompt,
                width: parseInt(size.split('x')[0]),
                height: parseInt(size.split('x')[1]),
                num_outputs: n
              }
            }
          );
          imageUrls = Array.isArray(output) ? output : [output];
          break;
          
        case 'midjourney':
          // Midjourney implementation (if available)
          imageUrls = await imageGenerationService.generateMidjourney(prompt, { size, n });
          break;
          
        default:
          throw new AppError('Invalid image model', 400);
      }

      // Store generated images
      const storedImages = await imageGenerationService.storeGeneratedImages(
        imageUrls,
        userId,
        prompt
      );

      // Track usage
      await AIUsage.create({
        userId,
        type: 'images',
        model,
        metadata: {
          prompt,
          size,
          count: n,
          urls: storedImages
        }
      });

      res.json({
        success: true,
        images: storedImages,
        prompt,
        model,
        usage: {
          remaining: await getRemainingUsage(userId, 'images')
        }
      });

    } catch (error) {
      logger.error('Image generation error:', error);
      res.status(500).json({ error: 'Failed to generate image' });
    }
  }
);

/**
 * @route   POST /api/ai/transcribe
 * @desc    Transcribe audio to text
 * @access  Private
 */
router.post('/transcribe',
  authenticate,
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 10 }),
  checkAIUsage('voice'),
  async (req, res) => {
    try {
      const { audioUrl, language = 'en-US' } = req.body;
      const userId = req.user.id;

      if (!audioUrl) {
        return res.status(400).json({ error: 'Audio URL is required' });
      }

      // Download audio file
      const audioBuffer = await voiceService.downloadAudio(audioUrl);

      // Transcribe using Google Speech-to-Text
      const request = {
        audio: {
          content: audioBuffer.toString('base64')
        },
        config: {
          encoding: 'WEBM_OPUS',
          sampleRateHertz: 48000,
          languageCode: language,
          enableAutomaticPunctuation: true,
          enableWordTimeOffsets: true,
          model: 'latest_long'
        }
      };

      const [response] = await speechClient.recognize(request);
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join(' ');

      // Get word timestamps
      const words = response.results
        .flatMap(result => result.alternatives[0].words || []);

      // Track usage
      const duration = words.length > 0 ? 
        words[words.length - 1].endTime.seconds : 0;
      
      await AIUsage.create({
        userId,
        type: 'voice',
        metadata: {
          duration,
          language,
          wordCount: words.length
        }
      });

      res.json({
        success: true,
        transcription,
        words,
        language,
        confidence: response.results[0]?.alternatives[0]?.confidence || 0,
        duration
      });

    } catch (error) {
      logger.error('Transcription error:', error);
      res.status(500).json({ error: 'Failed to transcribe audio' });
    }
  }
);

/**
 * @route   POST /api/ai/text-to-speech
 * @desc    Convert text to speech
 * @access  Private
 */
router.post('/text-to-speech',
  authenticate,
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 20 }),
  checkAIUsage('voice'),
  async (req, res) => {
    try {
      const { 
        text, 
        voice = 'en-US-Wavenet-D',
        speed = 1.0,
        pitch = 0.0 
      } = req.body;
      
      const userId = req.user.id;

      if (!text) {
        return res.status(400).json({ error: 'Text is required' });
      }

      // Synthesize speech
      const request = {
        input: { text },
        voice: {
          languageCode: voice.substring(0, 5),
          name: voice,
          ssmlGender: 'NEUTRAL'
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: speed,
          pitch: pitch
        }
      };

      const [response] = await ttsClient.synthesizeSpeech(request);
      
      // Store audio file
      const audioUrl = await voiceService.storeAudioFile(
        response.audioContent,
        userId,
        'tts'
      );

      // Track usage
      await AIUsage.create({
        userId,
        type: 'voice',
        metadata: {
          textLength: text.length,
          voice,
          service: 'text-to-speech'
        }
      });

      res.json({
        success: true,
        audioUrl,
        duration: Math.ceil(text.length / 15), // Approximate duration
        voice,
        format: 'mp3'
      });

    } catch (error) {
      logger.error('Text-to-speech error:', error);
      res.status(500).json({ error: 'Failed to generate speech' });
    }
  }
);

/**
 * @route   POST /api/ai/moderate
 * @desc    AI content moderation
 * @access  Private
 */
router.post('/moderate',
  authenticate,
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 100 }),
  async (req, res) => {
    try {
      const { content, type = 'text' } = req.body;
      const userId = req.user.id;

      if (!content) {
        return res.status(400).json({ error: 'Content is required' });
      }

      let moderationResult;

      switch (type) {
        case 'text':
          moderationResult = await contentModerationAI.moderateText(content);
          break;
          
        case 'image':
          moderationResult = await contentModerationAI.moderateImage(content);
          break;
          
        default:
          throw new AppError('Invalid content type', 400);
      }

      // Log if content is flagged
      if (moderationResult.flagged) {
        logger.warn('Content flagged by AI moderation', {
          userId,
          type,
          categories: moderationResult.categories
        });
      }

      res.json({
        success: true,
        moderation: moderationResult
      });

    } catch (error) {
      logger.error('Moderation error:', error);
      res.status(500).json({ error: 'Failed to moderate content' });
    }
  }
);

/**
 * @route   POST /api/ai/code-assist
 * @desc    AI code assistance
 * @access  Private
 */
router.post('/code-assist',
  authenticate,
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 20 }),
  checkAIUsage('chat'),
  async (req, res) => {
    try {
      const { 
        code, 
        action = 'explain',
        language = 'auto',
        context 
      } = req.body;
      
      const userId = req.user.id;

      if (!code) {
        return res.status(400).json({ error: 'Code is required' });
      }

      let result;

      switch (action) {
        case 'explain':
          result = await codeAssistant.explainCode(code, language);
          break;
          
        case 'review':
          result = await codeAssistant.reviewCode(code, language);
          break;
          
        case 'optimize':
          result = await codeAssistant.optimizeCode(code, language);
          break;
          
        case 'debug':
          result = await codeAssistant.debugCode(code, context);
          break;
          
        case 'complete':
          result = await codeAssistant.completeCode(code, language);
          break;
          
        case 'convert':
          const targetLanguage = req.body.targetLanguage;
          result = await codeAssistant.convertCode(code, language, targetLanguage);
          break;
          
        case 'document':
          result = await codeAssistant.generateDocumentation(code, language);
          break;
          
        default:
          throw new AppError('Invalid action', 400);
      }

      // Track usage
      await AIUsage.create({
        userId,
        type: 'chat',
        metadata: {
          service: 'code-assist',
          action,
          language,
          codeLength: code.length
        }
      });

      res.json({
        success: true,
        result,
        action,
        language: result.detectedLanguage || language
      });

    } catch (error) {
      logger.error('Code assist error:', error);
      res.status(500).json({ error: 'Failed to process code' });
    }
  }
);

/**
 * @route   POST /api/ai/sentiment
 * @desc    Analyze sentiment of messages
 * @access  Private
 */
router.post('/sentiment',
  authenticate,
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 30 }),
  async (req, res) => {
    try {
      const { text, messageIds } = req.body;
      const userId = req.user.id;

      let textToAnalyze = text;

      // If messageIds provided, fetch messages
      if (messageIds && messageIds.length > 0) {
        const messages = await Message.find({
          _id: { $in: messageIds }
        }).lean();
        
        textToAnalyze = messages.map(m => m.content).join(' ');
      }

      if (!textToAnalyze) {
        return res.status(400).json({ error: 'Text or message IDs required' });
      }

      // Analyze sentiment using Google NLP
      const document = {
        content: textToAnalyze,
        type: 'PLAIN_TEXT'
      };

      const [sentiment] = await languageClient.analyzeSentiment({ document });
      const [entities] = await languageClient.analyzeEntities({ document });

      // Get emotion detection from another service
      const emotions = await aiService.detectEmotions(textToAnalyze);

      res.json({
        success: true,
        sentiment: {
          score: sentiment.documentSentiment.score,
          magnitude: sentiment.documentSentiment.magnitude,
          label: getSentimentLabel(sentiment.documentSentiment.score)
        },
        emotions,
        entities: entities.entities.map(e => ({
          name: e.name,
          type: e.type,
          salience: e.salience
        })),
        sentences: sentiment.sentences?.map(s => ({
          text: s.text.content,
          sentiment: s.sentiment.score
        }))
      });

    } catch (error) {
      logger.error('Sentiment analysis error:', error);
      res.status(500).json({ error: 'Failed to analyze sentiment' });
    }
  }
);

/**
 * @route   POST /api/ai/smart-reply
 * @desc    Generate smart reply suggestions
 * @access  Private
 */
router.post('/smart-reply',
  authenticate,
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 50 }),
  async (req, res) => {
    try {
      const { messageId, conversationContext } = req.body;
      const userId = req.user.id;

      // Get message and context
      const message = await Message.findById(messageId);
      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }

      // Get conversation context
      const context = conversationContext || 
        await Message.find({ channelId: message.channelId })
          .sort({ createdAt: -1 })
          .limit(10)
          .lean();

      // Generate smart replies
      const replies = await aiService.generateSmartReplies(
        message.content,
        context
      );

      res.json({
        success: true,
        replies,
        messageId
      });

    } catch (error) {
      logger.error('Smart reply error:', error);
      res.status(500).json({ error: 'Failed to generate smart replies' });
    }
  }
);

/**
 * @route   POST /api/ai/embed
 * @desc    Generate embeddings for semantic search
 * @access  Private
 */
router.post('/embed',
  authenticate,
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 20 }),
  async (req, res) => {
    try {
      const { texts, model = 'text-embedding-ada-002' } = req.body;
      const userId = req.user.id;

      if (!texts || !Array.isArray(texts)) {
        return res.status(400).json({ error: 'Texts array is required' });
      }

      // Generate embeddings
      const embeddings = await embeddingService.generateEmbeddings(texts, model);

      // Store embeddings if needed
      if (req.body.store) {
        await embeddingService.storeEmbeddings(embeddings, userId, texts);
      }

      res.json({
        success: true,
        embeddings,
        model,
        dimensions: embeddings[0]?.length || 0
      });

    } catch (error) {
      logger.error('Embedding generation error:', error);
      res.status(500).json({ error: 'Failed to generate embeddings' });
    }
  }
);

/**
 * @route   POST /api/ai/search
 * @desc    Semantic search using embeddings
 * @access  Private
 */
router.post('/search',
  authenticate,
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 30 }),
  async (req, res) => {
    try {
      const { query, scope = 'channel', scopeId, limit = 10 } = req.body;
      const userId = req.user.id;

      if (!query) {
        return res.status(400).json({ error: 'Query is required' });
      }

      // Generate query embedding
      const queryEmbedding = await embeddingService.generateEmbedding(query);

      // Search based on scope
      let results;
      switch (scope) {
        case 'channel':
          results = await embeddingService.searchChannel(
            queryEmbedding,
            scopeId,
            limit
          );
          break;
          
        case 'server':
          results = await embeddingService.searchServer(
            queryEmbedding,
            scopeId,
            limit
          );
          break;
          
        case 'user':
          results = await embeddingService.searchUserContent(
            queryEmbedding,
            userId,
            limit
          );
          break;
          
        default:
          throw new AppError('Invalid search scope', 400);
      }

      res.json({
        success: true,
        results,
        query,
        scope,
        count: results.length
      });

    } catch (error) {
      logger.error('Semantic search error:', error);
      res.status(500).json({ error: 'Failed to perform search' });
    }
  }
);

/**
 * @route   GET /api/ai/usage
 * @desc    Get AI usage statistics
 * @access  Private
 */
router.get('/usage',
  authenticate,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { period = 'day' } = req.query;

      // Get user's plan
      const user = await User.findById(userId);
      const planLimits = AI_LIMITS[user.membership?.planId || 'free'];

      // Get usage statistics
      const usage = await AIUsage.aggregate([
        {
          $match: {
            userId: mongoose.Types.ObjectId(userId),
            createdAt: {
              $gte: getStartOfPeriod(period)
            }
          }
        },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
            totalCost: { $sum: '$cost' }
          }
        }
      ]);

      // Format usage data
      const usageData = {};
      for (const type of Object.keys(planLimits)) {
        const typeUsage = usage.find(u => u._id === type);
        usageData[type] = {
          used: typeUsage?.count || 0,
          limit: planLimits[type],
          remaining: planLimits[type] === -1 ? 
            'unlimited' : 
            Math.max(0, planLimits[type] - (typeUsage?.count || 0)),
          cost: typeUsage?.totalCost || 0
        };
      }

      res.json({
        success: true,
        usage: usageData,
        period,
        plan: user.membership?.planId || 'free'
      });

    } catch (error) {
      logger.error('Get usage error:', error);
      res.status(500).json({ error: 'Failed to get usage statistics' });
    }
  }
);

/**
 * @route   GET /api/ai/models
 * @desc    Get available AI models
 * @access  Private
 */
router.get('/models',
  authenticate,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);
      const userPlan = user.membership?.planId || 'free';

      const models = {
        chat: [
          { 
            id: 'gpt-3.5-turbo', 
            name: 'GPT-3.5 Turbo', 
            available: true,
            description: 'Fast and efficient for most tasks'
          },
          { 
            id: 'gpt-4', 
            name: 'GPT-4', 
            available: ['monthly', 'yearly', 'lifetime'].includes(userPlan),
            description: 'Most capable model for complex tasks'
          },
          { 
            id: 'gemini-pro', 
            name: 'Google Gemini Pro', 
            available: true,
            description: 'Google\'s advanced AI model'
          },
          { 
            id: 'claude', 
            name: 'Claude 2', 
            available: ['yearly', 'lifetime'].includes(userPlan),
            description: 'Anthropic\'s helpful AI assistant'
          }
        ],
        image: [
          { 
            id: 'dall-e-2', 
            name: 'DALL-E 2', 
            available: ['monthly', 'yearly', 'lifetime'].includes(userPlan),
            description: 'OpenAI\'s image generation'
          },
          { 
            id: 'dall-e-3', 
            name: 'DALL-E 3', 
            available: ['yearly', 'lifetime'].includes(userPlan),
            description: 'Latest DALL-E with better quality'
          },
          { 
            id: 'stable-diffusion', 
            name: 'Stable Diffusion', 
            available: true,
            description: 'Open source image generation'
          }
        ],
        voice: [
          { 
            id: 'whisper', 
            name: 'Whisper', 
            available: true,
            description: 'OpenAI\'s speech recognition'
          },
          { 
            id: 'google-speech', 
            name: 'Google Speech', 
            available: true,
            description: 'Google\'s speech services'
          }
        ]
      };

      res.json({
        success: true,
        models,
        userPlan
      });

    } catch (error) {
      logger.error('Get models error:', error);
      res.status(500).json({ error: 'Failed to get available models' });
    }
  }
);

// Helper functions
async function getRemainingUsage(userId, type) {
  const user = await User.findById(userId);
  const limit = AI_LIMITS[user.membership?.planId || 'free'][type];
  
  if (limit === -1) return 'unlimited';
  
  const todayUsage = await AIUsage.countDocuments({
    userId,
    type,
    createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
  });
  
  return Math.max(0, limit - todayUsage);
}

function calculateCost(model, tokens) {
  const costs = {
    'gpt-3.5-turbo': 0.001,
    'gpt-4': 0.03,
    'dall-e-2': 0.02,
    'dall-e-3': 0.04
  };
  
  return (costs[model] || 0.001) * (tokens / 1000);
}

function getSentimentLabel(score) {
  if (score >= 0.5) return 'very_positive';
  if (score >= 0.1) return 'positive';
  if (score >= -0.1) return 'neutral';
  if (score >= -0.5) return 'negative';
  return 'very_negative';
}

function getStartOfPeriod(period) {
  const now = new Date();
  switch (period) {
    case 'hour':
      return new Date(now - 60 * 60 * 1000);
    case 'day':
      return new Date(now.setHours(0, 0, 0, 0));
    case 'week':
      return new Date(now - 7 * 24 * 60 * 60 * 1000);
    case 'month':
      return new Date(now.getFullYear(), now.getMonth(), 1);
    default:
      return new Date(now.setHours(0, 0, 0, 0));
  }
}

async function analyzeSentiment(text) {
  const document = {
    content: text,
    type: 'PLAIN_TEXT'
  };
  
  const [result] = await languageClient.analyzeSentiment({ document });
  return result.documentSentiment;
}

module.exports = router;