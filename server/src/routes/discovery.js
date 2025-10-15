const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { startOfDay, subDays, subHours } = require('date-fns');
const geoip = require('geoip-lite');
const natural = require('natural');

// Middleware
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { rateLimiter } = require('../middleware/rateLimiter');
const { validateDiscovery } = require('../middleware/discoveryValidator');
const { cache } = require('../middleware/cache');

// Services
const DiscoveryService = require('../services/discovery/DiscoveryService');
const RecommendationEngine = require('../services/discovery/RecommendationEngine');
const ServerVerificationService = require('../services/discovery/ServerVerificationService');
const TrendingService = require('../services/discovery/TrendingService');
const CategoryService = require('../services/discovery/CategoryService');
const SearchService = require('../services/discovery/SearchService');
const DiscoveryAnalytics = require('../services/discovery/DiscoveryAnalytics');

// Models
const Server = require('../models/Server');
const User = require('../models/User');
const DiscoveryListing = require('../models/DiscoveryListing');
const ServerCategory = require('../models/ServerCategory');
const ServerTag = require('../models/ServerTag');
const DiscoveryMetrics = require('../models/DiscoveryMetrics');
const JoinRequest = require('../models/JoinRequest');
const ServerReview = require('../models/ServerReview');
const FeaturedServer = require('../models/FeaturedServer');
const DiscoveryReport = require('../models/DiscoveryReport');

// Utils
const { logger } = require('../utils/logger');
const { AppError } = require('../utils/errors');
const { calculateSimilarity } = require('../utils/similarity');
const { sanitizeHtml } = require('../utils/sanitizer');

// Initialize services
const discoveryService = new DiscoveryService();
const recommendationEngine = new RecommendationEngine();
const verificationService = new ServerVerificationService();
const trendingService = new TrendingService();
const categoryService = new CategoryService();
const searchService = new SearchService();
const discoveryAnalytics = new DiscoveryAnalytics();

// Initialize NLP
const TfIdf = natural.TfIdf;
const tfidf = new TfIdf();

/**
 * @route   GET /api/discovery
 * @desc    Get discovery homepage with featured and recommended servers
 * @access  Public
 */
router.get('/',
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 60 }),
  cache({ ttl: 300 }), // Cache for 5 minutes
  async (req, res) => {
    try {
      const {
        page = 1,
        limit = 20,
        category,
        sort = 'popular',
        language,
        region
      } = req.query;

      const userId = req.user?.id;
      const userRegion = region || (req.ip ? geoip.lookup(req.ip)?.country : null);

      // Get featured servers
      const featured = await FeaturedServer.find({
        active: true,
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() }
      })
        .populate({
          path: 'serverId',
          populate: {
            path: 'discoveryListing',
            model: 'DiscoveryListing'
          }
        })
        .sort({ priority: -1 })
        .limit(5);

      // Build query for discovery listings
      const query = {
        isPublic: true,
        isApproved: true,
        isBanned: false
      };

      if (category) {
        query.primaryCategory = category;
      }

      if (language) {
        query.languages = language;
      }

      if (userRegion) {
        // Boost servers from user's region
        query.$or = [
          { regions: userRegion },
          { regions: 'global' }
        ];
      }

      // Get discovery listings based on sort
      let sortOption = {};
      switch (sort) {
        case 'popular':
          sortOption = { memberCount: -1 };
          break;
        case 'trending':
          sortOption = { 'metrics.growth7d': -1 };
          break;
        case 'newest':
          sortOption = { createdAt: -1 };
          break;
        case 'active':
          sortOption = { 'metrics.messagesPerDay': -1 };
          break;
        case 'verified':
          query.isVerified = true;
          sortOption = { memberCount: -1 };
          break;
        default:
          sortOption = { score: -1 };
      }

      const skip = (page - 1) * limit;

      // Get paginated servers
      const [servers, total] = await Promise.all([
        DiscoveryListing.find(query)
          .populate('serverId', 'name icon banner memberCount')
          .populate('primaryCategory', 'name icon')
          .populate('tags', 'name')
          .sort(sortOption)
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        DiscoveryListing.countDocuments(query)
      ]);

      // Get personalized recommendations if user is authenticated
      let recommendations = [];
      if (userId) {
        recommendations = await recommendationEngine.getRecommendations(
          userId,
          { limit: 10, excludeJoined: true }
        );
      }

      // Get trending servers
      const trending = await trendingService.getTrendingServers({
        limit: 10,
        timeframe: '24h'
      });

      // Get popular categories
      const categories = await ServerCategory.aggregate([
        {
          $lookup: {
            from: 'discoverylistings',
            localField: '_id',
            foreignField: 'primaryCategory',
            as: 'servers'
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            icon: 1,
            description: 1,
            serverCount: { $size: '$servers' }
          }
        },
        { $sort: { serverCount: -1 } },
        { $limit: 12 }
      ]);

      // Track discovery view
      if (userId) {
        await discoveryAnalytics.trackView(userId, {
          category,
          sort,
          page
        });
      }

      res.json({
        success: true,
        data: {
          featured: featured.map(f => ({
            ...f.serverId.toObject(),
            featuredUntil: f.endDate,
            featuredReason: f.reason
          })),
          servers,
          recommendations,
          trending,
          categories,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          },
          filters: {
            category,
            sort,
            language,
            region: userRegion
          }
        }
      });

    } catch (error) {
      logger.error('Discovery homepage error:', error);
      res.status(500).json({ error: 'Failed to load discovery page' });
    }
  }
);

/**
 * @route   GET /api/discovery/search
 * @desc    Search for servers
 * @access  Public
 */
router.get('/search',
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 100 }),
  async (req, res) => {
    try {
      const {
        q,
        category,
        tags,
        minMembers = 0,
        maxMembers,
        language,
        verified,
        nsfw = false,
        page = 1,
        limit = 20
      } = req.query;

      if (!q || q.length < 2) {
        return res.status(400).json({ error: 'Search query too short' });
      }

      const userId = req.user?.id;

      // Build search query
      const searchQuery = {
        isPublic: true,
        isApproved: true,
        isBanned: false,
        $text: { $search: q }
      };

      // Apply filters
      if (category) {
        searchQuery.primaryCategory = category;
      }

      if (tags) {
        const tagArray = Array.isArray(tags) ? tags : tags.split(',');
        searchQuery.tags = { $in: tagArray };
      }

      if (minMembers || maxMembers) {
        searchQuery['metrics.memberCount'] = {};
        if (minMembers) searchQuery['metrics.memberCount'].$gte = parseInt(minMembers);
        if (maxMembers) searchQuery['metrics.memberCount'].$lte = parseInt(maxMembers);
      }

      if (language) {
        searchQuery.languages = language;
      }

      if (verified === 'true') {
        searchQuery.isVerified = true;
      }

      searchQuery.nsfw = nsfw === 'true';

      const skip = (page - 1) * limit;

      // Perform search with text score
      const [results, total] = await Promise.all([
        DiscoveryListing.find(
          searchQuery,
          { score: { $meta: 'textScore' } }
        )
          .populate('serverId', 'name icon memberCount')
          .populate('primaryCategory', 'name')
          .populate('tags', 'name')
          .sort({ score: { $meta: 'textScore' }, memberCount: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        DiscoveryListing.countDocuments(searchQuery)
      ]);

      // Enhanced search with NLP if few results
      let enhancedResults = [];
      if (results.length < 5) {
        enhancedResults = await searchService.semanticSearch(q, {
          excludeIds: results.map(r => r._id),
          limit: 10 - results.length
        });
      }

      // Get search suggestions
      const suggestions = await searchService.getSearchSuggestions(q);

      // Track search
      await discoveryAnalytics.trackSearch(userId || 'anonymous', {
        query: q,
        filters: { category, tags, language, verified },
        resultCount: results.length + enhancedResults.length
      });

      res.json({
        success: true,
        data: {
          results: [...results, ...enhancedResults],
          total: total + enhancedResults.length,
          suggestions,
          query: q,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil((total + enhancedResults.length) / limit)
          }
        }
      });

    } catch (error) {
      logger.error('Discovery search error:', error);
      res.status(500).json({ error: 'Search failed' });
    }
  }
);

/**
 * @route   GET /api/discovery/server/:serverId
 * @desc    Get detailed server discovery info
 * @access  Public
 */
router.get('/server/:serverId',
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 60 }),
  cache({ ttl: 60 }), // Cache for 1 minute
  async (req, res) => {
    try {
      const { serverId } = req.params;
      const userId = req.user?.id;

      // Get discovery listing with full details
      const listing = await DiscoveryListing.findOne({
        serverId,
        isPublic: true,
        isApproved: true
      })
        .populate('serverId')
        .populate('primaryCategory')
        .populate('tags')
        .populate('reviews.userId', 'username avatar');

      if (!listing) {
        return res.status(404).json({ error: 'Server not found in discovery' });
      }

      // Get server details
      const server = await Server.findById(serverId)
        .populate('ownerId', 'username avatar')
        .populate({
          path: 'channels',
          match: { type: 'text', isPrivate: false },
          select: 'name description',
          options: { limit: 5 }
        })
        .lean();

      // Get server metrics
      const metrics = await DiscoveryMetrics.findOne({ serverId })
        .sort({ updatedAt: -1 });

      // Get similar servers
      const similar = await recommendationEngine.getSimilarServers(
        serverId,
        { limit: 6 }
      );

      // Get reviews summary
      const reviews = await ServerReview.aggregate([
        { $match: { serverId: mongoose.Types.ObjectId(serverId) } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 },
            distribution: {
              $push: '$rating'
            }
          }
        },
        {
          $project: {
            averageRating: { $round: ['$averageRating', 1] },
            totalReviews: 1,
            distribution: {
              5: {
                $size: {
                  $filter: {
                    input: '$distribution',
                    cond: { $eq: ['$$this', 5] }
                  }
                }
              },
              4: {
                $size: {
                  $filter: {
                    input: '$distribution',
                    cond: { $eq: ['$$this', 4] }
                  }
                }
              },
              3: {
                $size: {
                  $filter: {
                    input: '$distribution',
                    cond: { $eq: ['$$this', 3] }
                  }
                }
              },
              2: {
                $size: {
                  $filter: {
                    input: '$distribution',
                    cond: { $eq: ['$$this', 2] }
                  }
                }
              },
              1: {
                $size: {
                  $filter: {
                    input: '$distribution',
                    cond: { $eq: ['$$this', 1] }
                  }
                }
              }
            }
          }
        }
      ]);

      // Check if user is member
      let isMember = false;
      let hasRequestedJoin = false;
      if (userId) {
        isMember = server.members.some(m => m.toString() === userId);
        hasRequestedJoin = await JoinRequest.exists({
          userId,
          serverId,
          status: 'pending'
        });
      }

      // Update view count
      await DiscoveryMetrics.findOneAndUpdate(
        { serverId },
        {
          $inc: { 'views.total': 1, 'views.today': 1 },
          $push: {
            'views.recent': {
              userId: userId || 'anonymous',
              timestamp: new Date()
            }
          }
        },
        { upsert: true }
      );

      // Track view
      if (userId) {
        await discoveryAnalytics.trackServerView(userId, serverId);
      }

      res.json({
        success: true,
        data: {
          listing: {
            ...listing.toObject(),
            description: sanitizeHtml(listing.description)
          },
          server: {
            ...server,
            memberCount: server.members.length,
            onlineCount: metrics?.onlineCount || 0,
            boostLevel: server.boostLevel || 0
          },
          metrics: {
            memberCount: metrics?.memberCount || server.members.length,
            onlineCount: metrics?.onlineCount || 0,
            messagesPerDay: metrics?.messagesPerDay || 0,
            voiceMinutesPerDay: metrics?.voiceMinutesPerDay || 0,
            growth7d: metrics?.growth7d || 0,
            growth30d: metrics?.growth30d || 0,
            activityScore: metrics?.activityScore || 0
          },
          reviews: reviews[0] || {
            averageRating: 0,
            totalReviews: 0,
            distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
          },
          similar,
          userStatus: {
            isMember,
            hasRequestedJoin,
            canJoin: !isMember && !hasRequestedJoin && server.isPublic
          }
        }
      });

    } catch (error) {
      logger.error('Server discovery details error:', error);
      res.status(500).json({ error: 'Failed to get server details' });
    }
  }
);

/**
 * @route   POST /api/discovery/join/:serverId
 * @desc    Join or request to join a server
 * @access  Private
 */
router.post('/join/:serverId',
  authenticate,
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 10 }),
  async (req, res) => {
    try {
      const { serverId } = req.params;
      const userId = req.user.id;
      const { message } = req.body;

      // Check if server exists in discovery
      const listing = await DiscoveryListing.findOne({
        serverId,
        isPublic: true,
        isApproved: true
      });

      if (!listing) {
        return res.status(404).json({ error: 'Server not found' });
      }

      // Get server
      const server = await Server.findById(serverId);

      // Check if already member
      if (server.members.includes(userId)) {
        return res.status(400).json({ error: 'Already a member of this server' });
      }

      // Check if banned
      if (server.bannedUsers?.includes(userId)) {
        return res.status(403).json({ error: 'You are banned from this server' });
      }

      // Check member limit
      if (server.memberLimit && server.members.length >= server.memberLimit) {
        return res.status(400).json({ error: 'Server is full' });
      }

      let result;

      if (listing.requiresApplication) {
        // Create join request
        const existingRequest = await JoinRequest.findOne({
          userId,
          serverId,
          status: 'pending'
        });

        if (existingRequest) {
          return res.status(400).json({ error: 'Join request already pending' });
        }

        const joinRequest = await JoinRequest.create({
          userId,
          serverId,
          message: message || '',
          questions: listing.applicationQuestions,
          answers: req.body.answers || []
        });

        // Notify server admins
        await discoveryService.notifyAdminsOfJoinRequest(serverId, userId, joinRequest._id);

        result = {
          status: 'pending',
          message: 'Join request submitted successfully',
          requestId: joinRequest._id
        };

      } else {
        // Direct join
        server.members.push(userId);
        await server.save();

        // Add user to default channels
        await discoveryService.addUserToDefaultChannels(serverId, userId);

        // Update metrics
        await DiscoveryMetrics.findOneAndUpdate(
          { serverId },
          {
            $inc: { memberCount: 1, 'joins.total': 1, 'joins.today': 1 }
          }
        );

        // Track join
        await discoveryAnalytics.trackJoin(userId, serverId, 'direct');

        result = {
          status: 'joined',
          message: 'Successfully joined the server'
        };
      }

      res.json({
        success: true,
        ...result
      });

    } catch (error) {
      logger.error('Join server error:', error);
      res.status(500).json({ error: 'Failed to join server' });
    }
  }
);

/**
 * @route   POST /api/discovery/submit
 * @desc    Submit server for discovery
 * @access  Private (Server Owner)
 */
router.post('/submit',
  authenticate,
  rateLimiter({ windowMs: 60 * 60 * 1000, max: 5 }), // 5 submissions per hour
  validateDiscovery,
  async (req, res) => {
    try {
      const {
        serverId,
        description,
        primaryCategory,
        tags,
        languages,
        nsfw,
        requiresApplication,
        applicationQuestions,
        keywords,
        banner,
        gallery
      } = req.body;

      const userId = req.user.id;

      // Verify server ownership
      const server = await Server.findById(serverId);
      if (!server) {
        return res.status(404).json({ error: 'Server not found' });
      }

      if (server.ownerId.toString() !== userId) {
        return res.status(403).json({ error: 'Only server owner can submit for discovery' });
      }

      // Check minimum requirements
      const requirements = await verificationService.checkDiscoveryRequirements(serverId);
      if (!requirements.eligible) {
        return res.status(400).json({
          error: 'Server does not meet discovery requirements',
          requirements: requirements.missing
        });
      }

      // Check if already listed
      const existingListing = await DiscoveryListing.findOne({ serverId });
      if (existingListing) {
        return res.status(400).json({ error: 'Server already submitted for discovery' });
      }

      // Validate category and tags
      const categoryExists = await ServerCategory.exists({ _id: primaryCategory });
      if (!categoryExists) {
        return res.status(400).json({ error: 'Invalid category' });
      }

      const validTags = await ServerTag.find({ _id: { $in: tags } });
      if (validTags.length !== tags.length) {
        return res.status(400).json({ error: 'Invalid tags' });
      }

      // Create discovery listing
      const listing = await DiscoveryListing.create({
        serverId,
        description: sanitizeHtml(description),
        shortDescription: description.substring(0, 120),
        primaryCategory,
        tags,
        languages: languages || ['en'],
        regions: req.body.regions || ['global'],
        keywords: keywords || [],
        nsfw: nsfw || false,
        requiresApplication,
        applicationQuestions: requiresApplication ? applicationQuestions : [],
        banner,
        gallery: gallery || [],
        isPublic: true,
        isApproved: false, // Requires admin approval
        submittedBy: userId,
        submittedAt: new Date()
      });

      // Initialize metrics
      await DiscoveryMetrics.create({
        serverId,
        memberCount: server.members.length,
        onlineCount: 0,
        messagesPerDay: 0,
        voiceMinutesPerDay: 0
      });

      // Send to moderation queue
      await discoveryService.submitForModeration(listing._id);

      logger.info('Server submitted for discovery', { serverId, userId });

      res.json({
        success: true,
        message: 'Server submitted for discovery. Pending approval.',
        listingId: listing._id,
        status: 'pending_review'
      });

    } catch (error) {
      logger.error('Discovery submission error:', error);
      res.status(500).json({ error: 'Failed to submit server for discovery' });
    }
  }
);

/**
 * @route   GET /api/discovery/categories
 * @desc    Get all discovery categories
 * @access  Public
 */
router.get('/categories',
  cache({ ttl: 3600 }), // Cache for 1 hour
  async (req, res) => {
    try {
      const categories = await ServerCategory.find({ active: true })
        .sort({ order: 1, name: 1 })
        .lean();

      // Get server count for each category
      const categoriesWithCount = await Promise.all(
        categories.map(async (category) => {
          const count = await DiscoveryListing.countDocuments({
            primaryCategory: category._id,
            isPublic: true,
            isApproved: true
          });

          return {
            ...category,
            serverCount: count
          };
        })
      );

      res.json({
        success: true,
        categories: categoriesWithCount
      });

    } catch (error) {
      logger.error('Get categories error:', error);
      res.status(500).json({ error: 'Failed to get categories' });
    }
  }
);

/**
 * @route   GET /api/discovery/tags
 * @desc    Get popular tags
 * @access  Public
 */
router.get('/tags',
  cache({ ttl: 1800 }), // Cache for 30 minutes
  async (req, res) => {
    try {
      const { limit = 50, category } = req.query;

      const query = { active: true };
      if (category) {
        query.categories = category;
      }

      const tags = await ServerTag.find(query)
        .sort({ usageCount: -1 })
        .limit(parseInt(limit))
        .lean();

      res.json({
        success: true,
        tags
      });

    } catch (error) {
      logger.error('Get tags error:', error);
      res.status(500).json({ error: 'Failed to get tags' });
    }
  }
);

/**
 * @route   GET /api/discovery/trending
 * @desc    Get trending servers
 * @access  Public
 */
router.get('/trending',
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 60 }),
  cache({ ttl: 300 }),
  async (req, res) => {
    try {
      const {
        timeframe = '24h',
        category,
        limit = 20
      } = req.query;

      // Calculate trending based on growth and activity
      const trendingServers = await trendingService.calculateTrending({
        timeframe,
        category,
        limit: parseInt(limit)
      });

      res.json({
        success: true,
        servers: trendingServers,
        timeframe,
        updatedAt: new Date()
      });

    } catch (error) {
      logger.error('Get trending error:', error);
      res.status(500).json({ error: 'Failed to get trending servers' });
    }
  }
);

/**
 * @route   POST /api/discovery/review/:serverId
 * @desc    Submit server review
 * @access  Private
 */
router.post('/review/:serverId',
  authenticate,
  rateLimiter({ windowMs: 60 * 60 * 1000, max: 3 }), // 3 reviews per hour
  async (req, res) => {
    try {
      const { serverId } = req.params;
      const userId = req.user.id;
      const { rating, review, pros, cons } = req.body;

      // Validate rating
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Invalid rating (1-5)' });
      }

      // Check if user is/was a member
      const server = await Server.findById(serverId);
      const isMember = server.members.includes(userId);
      const wasMember = server.previousMembers?.includes(userId);

      if (!isMember && !wasMember) {
        return res.status(403).json({ error: 'Must be a current or former member to review' });
      }

      // Check for existing review
      const existingReview = await ServerReview.findOne({ serverId, userId });
      if (existingReview) {
        return res.status(400).json({ error: 'You have already reviewed this server' });
      }

      // Create review
      const serverReview = await ServerReview.create({
        serverId,
        userId,
        rating,
        review: sanitizeHtml(review),
        pros: pros ? pros.map(p => sanitizeHtml(p)) : [],
        cons: cons ? cons.map(c => sanitizeHtml(c)) : [],
        verified: isMember, // Verified if current member
        membershipDuration: await discoveryService.getMembershipDuration(userId, serverId)
      });

      // Update listing rating
      await discoveryService.updateServerRating(serverId);

      // Track review
      await discoveryAnalytics.trackReview(userId, serverId, rating);

      res.json({
        success: true,
        review: serverReview
      });

    } catch (error) {
      logger.error('Submit review error:', error);
      res.status(500).json({ error: 'Failed to submit review' });
    }
  }
);

/**
 * @route   POST /api/discovery/report/:serverId
 * @desc    Report a server
 * @access  Private
 */
router.post('/report/:serverId',
  authenticate,
  rateLimiter({ windowMs: 60 * 60 * 1000, max: 5 }),
  async (req, res) => {
    try {
      const { serverId } = req.params;
      const userId = req.user.id;
      const { reason, details, evidence } = req.body;

      const validReasons = [
        'inappropriate_content',
        'spam',
        'harassment',
        'misleading',
        'copyright',
        'illegal',
        'other'
      ];

      if (!validReasons.includes(reason)) {
        return res.status(400).json({ error: 'Invalid report reason' });
      }

      // Check if already reported by user
      const existingReport = await DiscoveryReport.findOne({
        serverId,
        reportedBy: userId,
        status: 'pending'
      });

      if (existingReport) {
        return res.status(400).json({ error: 'You already have a pending report for this server' });
      }

      // Create report
      const report = await DiscoveryReport.create({
        serverId,
        reportedBy: userId,
        reason,
        details: sanitizeHtml(details),
        evidence: evidence || [],
        status: 'pending'
      });

      // Auto-hide if multiple reports
      const reportCount = await DiscoveryReport.countDocuments({
        serverId,
        status: 'pending'
      });

      if (reportCount >= 5) {
        await DiscoveryListing.findOneAndUpdate(
          { serverId },
          { isUnderReview: true }
        );

        logger.warn('Server auto-hidden due to multiple reports', { serverId });
      }

      // Notify moderators
      await discoveryService.notifyModerators(report);

      res.json({
        success: true,
        message: 'Report submitted successfully',
        reportId: report._id
      });

    } catch (error) {
      logger.error('Report server error:', error);
      res.status(500).json({ error: 'Failed to report server' });
    }
  }
);

/**
 * @route   GET /api/discovery/recommendations
 * @desc    Get personalized server recommendations
 * @access  Private
 */
router.get('/recommendations',
  authenticate,
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 30 }),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { limit = 20, offset = 0 } = req.query;

      // Get user preferences and history
      const userProfile = await recommendationEngine.buildUserProfile(userId);

      // Get recommendations
      const recommendations = await recommendationEngine.getPersonalizedRecommendations(
        userId,
        userProfile,
        {
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      );

      // Get reason for each recommendation
      const recommendationsWithReasons = recommendations.map(rec => ({
        ...rec,
        reason: recommendationEngine.getRecommendationReason(rec, userProfile)
      }));

      res.json({
        success: true,
        recommendations: recommendationsWithReasons,
        profile: {
          interests: userProfile.interests,
          preferredCategories: userProfile.categories,
          activityLevel: userProfile.activityLevel
        }
      });

    } catch (error) {
      logger.error('Get recommendations error:', error);
      res.status(500).json({ error: 'Failed to get recommendations' });
    }
  }
);

/**
 * @route   GET /api/discovery/stats
 * @desc    Get discovery statistics
 * @access  Public
 */
router.get('/stats',
  cache({ ttl: 3600 }),
  async (req, res) => {
    try {
      const [
        totalServers,
        totalCategories,
        totalMembers,
        newToday
      ] = await Promise.all([
        DiscoveryListing.countDocuments({ isPublic: true, isApproved: true }),
        ServerCategory.countDocuments({ active: true }),
        Server.aggregate([
          { $match: { isPublic: true } },
          { $group: { _id: null, total: { $sum: { $size: '$members' } } } }
        ]).then(r => r[0]?.total || 0),
        DiscoveryListing.countDocuments({
          isPublic: true,
          isApproved: true,
          createdAt: { $gte: startOfDay(new Date()) }
        })
      ]);

      // Get growth stats
      const growth = await discoveryAnalytics.getGrowthStats();

      res.json({
        success: true,
        stats: {
          totalServers,
          totalCategories,
          totalMembers,
          newToday,
          growth,
          lastUpdated: new Date()
        }
      });

    } catch (error) {
      logger.error('Get stats error:', error);
      res.status(500).json({ error: 'Failed to get statistics' });
    }
  }
);

/**
 * @route   POST /api/discovery/boost/:serverId
 * @desc    Boost server visibility (Premium feature)
 * @access  Private
 */
router.post('/boost/:serverId',
  authenticate,
  authorize(['monthly', 'yearly', 'lifetime']),
  rateLimiter({ windowMs: 24 * 60 * 60 * 1000, max: 1 }), // Once per day
  async (req, res) => {
    try {
      const { serverId } = req.params;
      const userId = req.user.id;
      const { duration = 24 } = req.body; // Hours

      // Verify ownership or admin
      const server = await Server.findById(serverId);
      if (!server.ownerId.equals(userId) && !server.admins.includes(userId)) {
        return res.status(403).json({ error: 'Not authorized to boost this server' });
      }

      // Check boost eligibility
      const lastBoost = await DiscoveryMetrics.findOne({
        serverId,
        'boosts.userId': userId
      }).sort({ 'boosts.timestamp': -1 });

      if (lastBoost && new Date() - lastBoost.boosts[0].timestamp < 24 * 60 * 60 * 1000) {
        return res.status(400).json({ error: 'Can only boost once per 24 hours' });
      }

      // Apply boost
      await DiscoveryMetrics.findOneAndUpdate(
        { serverId },
        {
          $push: {
            boosts: {
              userId,
              timestamp: new Date(),
              duration
            }
          },
          $inc: { boostScore: 10 }
        },
        { upsert: true }
      );

      // Update listing score
      await DiscoveryListing.findOneAndUpdate(
        { serverId },
        { $inc: { score: 100 } }
      );

      res.json({
        success: true,
        message: 'Server boosted successfully',
        boostExpires: new Date(Date.now() + duration * 60 * 60 * 1000)
      });

    } catch (error) {
      logger.error('Boost server error:', error);
      res.status(500).json({ error: 'Failed to boost server' });
    }
  }
);

/**
 * @route   GET /api/discovery/admin/pending
 * @desc    Get pending discovery submissions (Admin)
 * @access  Private (Admin)
 */
router.get('/admin/pending',
  authenticate,
  authorize(['admin']),
  async (req, res) => {
    try {
      const { page = 1, limit = 20 } = req.query;
      const skip = (page - 1) * limit;

      const [submissions, total] = await Promise.all([
        DiscoveryListing.find({ isApproved: false, isRejected: false })
          .populate('serverId', 'name memberCount')
          .populate('submittedBy', 'username email')
          .sort({ submittedAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        DiscoveryListing.countDocuments({ isApproved: false, isRejected: false })
      ]);

      res.json({
        success: true,
        submissions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });

    } catch (error) {
      logger.error('Get pending submissions error:', error);
      res.status(500).json({ error: 'Failed to get pending submissions' });
    }
  }
);

/**
 * @route   POST /api/discovery/admin/approve/:listingId
 * @desc    Approve discovery listing (Admin)
 * @access  Private (Admin)
 */
router.post('/admin/approve/:listingId',
  authenticate,
  authorize(['admin']),
  async (req, res) => {
    try {
      const { listingId } = req.params;
      const { notes, featured } = req.body;

      const listing = await DiscoveryListing.findByIdAndUpdate(
        listingId,
        {
          isApproved: true,
          isRejected: false,
          approvedBy: req.user.id,
          approvedAt: new Date(),
          moderationNotes: notes
        },
        { new: true }
      );

      if (!listing) {
        return res.status(404).json({ error: 'Listing not found' });
      }

      // Add to featured if requested
      if (featured) {
        await FeaturedServer.create({
          serverId: listing.serverId,
          startDate: new Date(),
          endDate: new Date(Date.now() + featured.days * 24 * 60 * 60 * 1000),
          reason: featured.reason,
          priority: featured.priority || 1
        });
      }

      // Notify server owner
      await discoveryService.notifyApproval(listing.serverId, listing.submittedBy);

      logger.info('Discovery listing approved', { listingId, approvedBy: req.user.id });

      res.json({
        success: true,
        message: 'Listing approved successfully',
        listing
      });

    } catch (error) {
      logger.error('Approve listing error:', error);
      res.status(500).json({ error: 'Failed to approve listing' });
    }
  }
);

module.exports = router;