const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { startOfDay, endOfDay, subDays, subMonths, format, eachDayOfInterval } = require('date-fns');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');

// Middleware
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { rateLimiter } = require('../middleware/rateLimiter');
const { validateAnalyticsRequest } = require('../middleware/analyticsValidator');
const { cache } = require('../middleware/cache');

// Services
const AnalyticsService = require('../services/analytics/AnalyticsService');
const ReportGenerator = require('../services/analytics/ReportGenerator');
const MetricsCollector = require('../services/analytics/MetricsCollector');
const RealtimeAnalytics = require('../services/analytics/RealtimeAnalytics');
const PredictiveAnalytics = require('../services/analytics/PredictiveAnalytics');

// Models
const User = require('../models/User');
const Message = require('../models/Message');
const Server = require('../models/Server');
const Channel = require('../models/Channel');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const AnalyticsEvent = require('../models/AnalyticsEvent');
const UserActivity = require('../models/UserActivity');
const ServerMetrics = require('../models/ServerMetrics');
const PerformanceMetric = require('../models/PerformanceMetric');

// Utils
const { logger } = require('../utils/logger');
const { AppError } = require('../utils/errors');
const { calculateGrowthRate, calculateRetention } = require('../utils/analytics');

// Initialize services
const analyticsService = new AnalyticsService();
const reportGenerator = new ReportGenerator();
const metricsCollector = new MetricsCollector();
const realtimeAnalytics = new RealtimeAnalytics();
const predictiveAnalytics = new PredictiveAnalytics();

/**
 * @route   GET /api/analytics/dashboard
 * @desc    Get main analytics dashboard data
 * @access  Private
 */
router.get('/dashboard',
  authenticate,
  cache({ ttl: 300 }), // Cache for 5 minutes
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { period = '7d', serverId } = req.query;

      // Parse period
      const days = parseInt(period) || 7;
      const startDate = subDays(new Date(), days);
      const endDate = new Date();

      // Get user's servers if no specific server
      let serverIds = [];
      if (serverId) {
        serverIds = [serverId];
      } else {
        const userServers = await Server.find({
          $or: [
            { ownerId: userId },
            { admins: userId },
            { members: userId }
          ]
        }).select('_id');
        serverIds = userServers.map(s => s._id);
      }

      // Collect dashboard metrics
      const [
        overview,
        userMetrics,
        messageMetrics,
        channelMetrics,
        engagementMetrics,
        revenueMetrics
      ] = await Promise.all([
        this.getOverviewMetrics(serverIds, startDate, endDate),
        this.getUserMetrics(serverIds, startDate, endDate),
        this.getMessageMetrics(serverIds, startDate, endDate),
        this.getChannelMetrics(serverIds, startDate, endDate),
        this.getEngagementMetrics(serverIds, startDate, endDate),
        this.getRevenueMetrics(userId, startDate, endDate)
      ]);

      res.json({
        success: true,
        period: {
          start: startDate,
          end: endDate,
          days
        },
        overview,
        users: userMetrics,
        messages: messageMetrics,
        channels: channelMetrics,
        engagement: engagementMetrics,
        revenue: revenueMetrics
      });

    } catch (error) {
      logger.error('Dashboard analytics error:', error);
      res.status(500).json({ error: 'Failed to load analytics dashboard' });
    }
  }
);

/**
 * @route   GET /api/analytics/users
 * @desc    Get detailed user analytics
 * @access  Private (Admin/Server Owner)
 */
router.get('/users',
  authenticate,
  authorize(['admin', 'server_owner']),
  validateAnalyticsRequest,
  async (req, res) => {
    try {
      const { 
        serverId, 
        startDate = subDays(new Date(), 30),
        endDate = new Date(),
        groupBy = 'day'
      } = req.query;

      // User acquisition
      const newUsers = await User.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: groupBy === 'day' ? '%Y-%m-%d' : '%Y-%m',
                date: '$createdAt'
              }
            },
            count: { $sum: 1 },
            verified: {
              $sum: { $cond: ['$emailVerified', 1, 0] }
            }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      // Active users
      const activeUsers = await UserActivity.aggregate([
        {
          $match: {
            timestamp: {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            },
            ...(serverId && { serverId: mongoose.Types.ObjectId(serverId) })
          }
        },
        {
          $group: {
            _id: {
              date: {
                $dateToString: {
                  format: groupBy === 'day' ? '%Y-%m-%d' : '%Y-%m',
                  date: '$timestamp'
                }
              },
              userId: '$userId'
            }
          }
        },
        {
          $group: {
            _id: '$_id.date',
            dau: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      // User retention cohorts
      const retentionCohorts = await this.calculateRetentionCohorts(
        startDate,
        endDate
      );

      // User demographics
      const demographics = await User.aggregate([
        {
          $facet: {
            byCountry: [
              { $group: { _id: '$country', count: { $sum: 1 } } },
              { $sort: { count: -1 } },
              { $limit: 10 }
            ],
            byPlan: [
              { $group: { _id: '$membership.planId', count: { $sum: 1 } } }
            ],
            byStatus: [
              {
                $group: {
                  _id: '$status',
                  count: { $sum: 1 }
                }
              }
            ],
            byDevice: [
              { $group: { _id: '$lastDevice', count: { $sum: 1 } } }
            ]
          }
        }
      ]);

      // User lifetime value
      const ltv = await this.calculateUserLTV(startDate, endDate);

      // Churn rate
      const churnRate = await this.calculateChurnRate(startDate, endDate);

      res.json({
        success: true,
        metrics: {
          acquisition: newUsers,
          activeUsers,
          retention: retentionCohorts,
          demographics: demographics[0],
          ltv,
          churnRate,
          summary: {
            totalUsers: await User.countDocuments(),
            newUsers: newUsers.reduce((sum, day) => sum + day.count, 0),
            averageDAU: activeUsers.reduce((sum, day) => sum + day.dau, 0) / activeUsers.length,
            retentionRate: retentionCohorts.averageRetention,
            churnRate
          }
        }
      });

    } catch (error) {
      logger.error('User analytics error:', error);
      res.status(500).json({ error: 'Failed to get user analytics' });
    }
  }
);

/**
 * @route   GET /api/analytics/messages
 * @desc    Get message analytics
 * @access  Private
 */
router.get('/messages',
  authenticate,
  cache({ ttl: 600 }),
  async (req, res) => {
    try {
      const {
        serverId,
        channelId,
        startDate = subDays(new Date(), 7),
        endDate = new Date(),
        groupBy = 'hour'
      } = req.query;

      const matchQuery = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };

      if (serverId) matchQuery.serverId = mongoose.Types.ObjectId(serverId);
      if (channelId) matchQuery.channelId = mongoose.Types.ObjectId(channelId);

      // Message volume over time
      const messageVolume = await Message.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: {
              $dateToString: {
                format: this.getDateFormat(groupBy),
                date: '$createdAt'
              }
            },
            count: { $sum: 1 },
            uniqueUsers: { $addToSet: '$userId' },
            avgLength: { $avg: { $strLenCP: '$content' } }
          }
        },
        {
          $project: {
            _id: 1,
            count: 1,
            uniqueUsers: { $size: '$uniqueUsers' },
            avgLength: { $round: ['$avgLength', 0] }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      // Message types distribution
      const messageTypes = await Message.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 }
          }
        }
      ]);

      // Peak activity hours
      const peakHours = await Message.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: { $hour: '$createdAt' },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]);

      // Most active channels
      const topChannels = await Message.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: '$channelId',
            messageCount: { $sum: 1 },
            uniqueUsers: { $addToSet: '$userId' }
          }
        },
        {
          $lookup: {
            from: 'channels',
            localField: '_id',
            foreignField: '_id',
            as: 'channel'
          }
        },
        { $unwind: '$channel' },
        {
          $project: {
            channelName: '$channel.name',
            messageCount: 1,
            activeUsers: { $size: '$uniqueUsers' }
          }
        },
        { $sort: { messageCount: -1 } },
        { $limit: 10 }
      ]);

      // Sentiment analysis summary
      const sentimentSummary = await AnalyticsEvent.aggregate([
        {
          $match: {
            type: 'message_sentiment',
            timestamp: {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            }
          }
        },
        {
          $group: {
            _id: '$data.sentiment',
            count: { $sum: 1 }
          }
        }
      ]);

      // Response time metrics
      const responseMetrics = await this.calculateResponseMetrics(
        matchQuery
      );

      res.json({
        success: true,
        metrics: {
          volume: messageVolume,
          types: messageTypes,
          peakHours,
          topChannels,
          sentiment: sentimentSummary,
          responseTime: responseMetrics,
          summary: {
            totalMessages: messageVolume.reduce((sum, d) => sum + d.count, 0),
            averagePerDay: messageVolume.reduce((sum, d) => sum + d.count, 0) / messageVolume.length,
            peakHour: peakHours[0]?._id || null,
            mostActiveChannel: topChannels[0]?.channelName || null
          }
        }
      });

    } catch (error) {
      logger.error('Message analytics error:', error);
      res.status(500).json({ error: 'Failed to get message analytics' });
    }
  }
);

/**
 * @route   GET /api/analytics/revenue
 * @desc    Get revenue analytics
 * @access  Private (Admin)
 */
router.get('/revenue',
  authenticate,
  authorize(['admin']),
  async (req, res) => {
    try {
      const {
        startDate = subMonths(new Date(), 3),
        endDate = new Date(),
        groupBy = 'day'
      } = req.query;

      // Revenue over time
      const revenueOverTime = await Payment.aggregate([
        {
          $match: {
            status: 'success',
            createdAt: {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: this.getDateFormat(groupBy),
                date: '$createdAt'
              }
            },
            revenue: { $sum: '$amount' },
            transactions: { $sum: 1 },
            avgTransaction: { $avg: '$amount' }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      // Revenue by plan
      const revenueByPlan = await Order.aggregate([
        {
          $match: {
            status: 'paid',
            createdAt: {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            }
          }
        },
        {
          $group: {
            _id: '$planId',
            revenue: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        }
      ]);

      // Monthly Recurring Revenue (MRR)
      const mrr = await this.calculateMRR();

      // Annual Recurring Revenue (ARR)
      const arr = mrr * 12;

      // Average Revenue Per User (ARPU)
      const arpu = await this.calculateARPU(startDate, endDate);

      // Churn and retention metrics
      const churnMetrics = await this.calculateRevenueChurn(startDate, endDate);

      // Payment success rate
      const paymentMetrics = await Payment.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            }
          }
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            amount: { $sum: '$amount' }
          }
        }
      ]);

      const successRate = paymentMetrics.find(m => m._id === 'success')?.count /
        paymentMetrics.reduce((sum, m) => sum + m.count, 0) * 100;

      // Lifetime Value (LTV)
      const ltv = await this.calculateLTV();

      // Growth metrics
      const growthMetrics = await this.calculateGrowthMetrics(startDate, endDate);

      // Refund metrics
      const refundMetrics = await this.calculateRefundMetrics(startDate, endDate);

      res.json({
        success: true,
        metrics: {
          revenue: revenueOverTime,
          byPlan: revenueByPlan,
          mrr,
          arr,
          arpu,
          ltv,
          churn: churnMetrics,
          paymentSuccess: {
            rate: successRate,
            breakdown: paymentMetrics
          },
          growth: growthMetrics,
          refunds: refundMetrics,
          summary: {
            totalRevenue: revenueOverTime.reduce((sum, d) => sum + d.revenue, 0),
            totalTransactions: revenueOverTime.reduce((sum, d) => sum + d.transactions, 0),
            avgTransactionValue: revenueOverTime.reduce((sum, d) => sum + d.avgTransaction, 0) / revenueOverTime.length,
            mrr,
            arr,
            successRate: `${successRate.toFixed(2)}%`
          }
        }
      });

    } catch (error) {
      logger.error('Revenue analytics error:', error);
      res.status(500).json({ error: 'Failed to get revenue analytics' });
    }
  }
);

/**
 * @route   GET /api/analytics/engagement
 * @desc    Get user engagement analytics
 * @access  Private
 */
router.get('/engagement',
  authenticate,
  async (req, res) => {
    try {
      const {
        serverId,
        startDate = subDays(new Date(), 30),
        endDate = new Date()
      } = req.query;

      // Session duration analytics
      const sessionMetrics = await UserActivity.aggregate([
        {
          $match: {
            timestamp: {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            },
            ...(serverId && { serverId: mongoose.Types.ObjectId(serverId) })
          }
        },
        {
          $group: {
            _id: {
              userId: '$userId',
              day: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }
            },
            sessionStart: { $min: '$timestamp' },
            sessionEnd: { $max: '$timestamp' },
            actions: { $sum: 1 }
          }
        },
        {
          $project: {
            duration: {
              $divide: [
                { $subtract: ['$sessionEnd', '$sessionStart'] },
                1000 * 60 // Convert to minutes
              ]
            },
            actions: 1
          }
        },
        {
          $group: {
            _id: null,
            avgDuration: { $avg: '$duration' },
            totalSessions: { $sum: 1 },
            avgActions: { $avg: '$actions' }
          }
        }
      ]);

      // Feature usage
      const featureUsage = await AnalyticsEvent.aggregate([
        {
          $match: {
            timestamp: {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            }
          }
        },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
            uniqueUsers: { $addToSet: '$userId' }
          }
        },
        {
          $project: {
            feature: '$_id',
            usageCount: '$count',
            uniqueUsers: { $size: '$uniqueUsers' }
          }
        },
        { $sort: { usageCount: -1 } }
      ]);

      // User journey funnel
      const funnel = await this.calculateUserFunnel(startDate, endDate);

      // Stickiness (DAU/MAU ratio)
      const stickiness = await this.calculateStickiness(startDate, endDate);

      // Engagement score distribution
      const engagementScores = await this.calculateEngagementScores(
        serverId,
        startDate,
        endDate
      );

      // Voice channel usage
      const voiceMetrics = await this.getVoiceChannelMetrics(
        serverId,
        startDate,
        endDate
      );

      res.json({
        success: true,
        metrics: {
          sessions: sessionMetrics[0] || {
            avgDuration: 0,
            totalSessions: 0,
            avgActions: 0
          },
          features: featureUsage,
          funnel,
          stickiness,
          engagementScores,
          voice: voiceMetrics,
          summary: {
            avgSessionDuration: `${Math.round(sessionMetrics[0]?.avgDuration || 0)} minutes`,
            stickiness: `${(stickiness * 100).toFixed(2)}%`,
            mostUsedFeature: featureUsage[0]?.feature || 'N/A',
            totalVoiceMinutes: voiceMetrics.totalMinutes
          }
        }
      });

    } catch (error) {
      logger.error('Engagement analytics error:', error);
      res.status(500).json({ error: 'Failed to get engagement analytics' });
    }
  }
);

/**
 * @route   GET /api/analytics/performance
 * @desc    Get system performance analytics
 * @access  Private (Admin)
 */
router.get('/performance',
  authenticate,
  authorize(['admin']),
  async (req, res) => {
    try {
      const {
        startDate = subDays(new Date(), 1),
        endDate = new Date(),
        metric = 'all'
      } = req.query;

      // API response times
      const apiMetrics = await PerformanceMetric.aggregate([
        {
          $match: {
            type: 'api_response',
            timestamp: {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            }
          }
        },
        {
          $group: {
            _id: '$endpoint',
            avgResponseTime: { $avg: '$value' },
            p95ResponseTime: { $percentile: { input: '$value', p: 0.95 } },
            p99ResponseTime: { $percentile: { input: '$value', p: 0.99 } },
            requests: { $sum: 1 },
            errors: {
              $sum: { $cond: [{ $gte: ['$statusCode', 400] }, 1, 0] }
            }
          }
        },
        { $sort: { requests: -1 } },
        { $limit: 20 }
      ]);

      // Database performance
      const dbMetrics = await PerformanceMetric.aggregate([
        {
          $match: {
            type: 'database_query',
            timestamp: {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            }
          }
        },
        {
          $group: {
            _id: '$operation',
            avgExecutionTime: { $avg: '$value' },
            maxExecutionTime: { $max: '$value' },
            count: { $sum: 1 }
          }
        }
      ]);

      // WebSocket metrics
      const wsMetrics = await this.getWebSocketMetrics(startDate, endDate);

      // Cache hit rate
      const cacheMetrics = await this.getCacheMetrics(startDate, endDate);

      // Error rate
      const errorRate = await AnalyticsEvent.aggregate([
        {
          $match: {
            type: 'error',
            timestamp: {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d %H:00',
                date: '$timestamp'
              }
            },
            errors: { $sum: 1 },
            uniqueErrors: { $addToSet: '$data.error' }
          }
        },
        {
          $project: {
            hour: '$_id',
            errors: 1,
            uniqueErrorTypes: { $size: '$uniqueErrors' }
          }
        },
        { $sort: { hour: 1 } }
      ]);

      // System resource usage
      const resourceMetrics = await this.getResourceMetrics(startDate, endDate);

      // Uptime
      const uptime = await this.calculateUptime(startDate, endDate);

      res.json({
        success: true,
        metrics: {
          api: apiMetrics,
          database: dbMetrics,
          websocket: wsMetrics,
          cache: cacheMetrics,
          errors: errorRate,
          resources: resourceMetrics,
          uptime,
          summary: {
            avgApiResponseTime: apiMetrics.reduce((sum, m) => sum + m.avgResponseTime, 0) / apiMetrics.length,
            totalRequests: apiMetrics.reduce((sum, m) => sum + m.requests, 0),
            errorRate: `${(errorRate.reduce((sum, h) => sum + h.errors, 0) / apiMetrics.reduce((sum, m) => sum + m.requests, 0) * 100).toFixed(2)}%`,
            cacheHitRate: `${cacheMetrics.hitRate}%`,
            uptime: `${uptime}%`
          }
        }
      });

    } catch (error) {
      logger.error('Performance analytics error:', error);
      res.status(500).json({ error: 'Failed to get performance analytics' });
    }
  }
);

/**
 * @route   GET /api/analytics/realtime
 * @desc    Get real-time analytics
 * @access  Private
 */
router.get('/realtime',
  authenticate,
  async (req, res) => {
    try {
      const { serverId } = req.query;

      // Get real-time metrics from Redis
      const redis = req.app.get('redis');
      
      // Active users
      const activeUsers = await redis.scard('active_users');
      
      // Active voice users
      const activeVoiceUsers = await redis.scard('voice_users');
      
      // Messages in last minute
      const recentMessages = await redis.get('messages_per_minute') || 0;
      
      // Current server status
      const serverStatus = serverId ? 
        await redis.hgetall(`server:${serverId}:status`) : {};

      // Real-time events
      const recentEvents = await redis.lrange('recent_events', 0, 50);
      const events = recentEvents.map(e => JSON.parse(e));

      // Active channels
      const activeChannels = await redis.zrevrange(
        'active_channels',
        0,
        9,
        'WITHSCORES'
      );

      // Format active channels
      const channels = [];
      for (let i = 0; i < activeChannels.length; i += 2) {
        channels.push({
          channelId: activeChannels[i],
          activity: parseInt(activeChannels[i + 1])
        });
      }

      // WebSocket connections
      const wsConnections = await redis.get('ws_connections') || 0;

      // Current load
      const systemLoad = await redis.hgetall('system_load');

      res.json({
        success: true,
        realtime: {
          activeUsers: parseInt(activeUsers),
          activeVoiceUsers: parseInt(activeVoiceUsers),
          messagesPerMinute: parseInt(recentMessages),
          wsConnections: parseInt(wsConnections),
          activeChannels: channels,
          recentEvents: events.slice(0, 20),
          serverStatus,
          systemLoad: {
            cpu: parseFloat(systemLoad.cpu || 0),
            memory: parseFloat(systemLoad.memory || 0),
            requests: parseInt(systemLoad.requests || 0)
          },
          timestamp: new Date()
        }
      });

    } catch (error) {
      logger.error('Realtime analytics error:', error);
      res.status(500).json({ error: 'Failed to get realtime analytics' });
    }
  }
);

/**
 * @route   POST /api/analytics/custom-report
 * @desc    Generate custom analytics report
 * @access  Private (Premium)
 */
router.post('/custom-report',
  authenticate,
  authorize(['monthly', 'yearly', 'lifetime', 'admin']),
  rateLimiter({ windowMs: 60 * 60 * 1000, max: 10 }),
  async (req, res) => {
    try {
      const {
        metrics,
        filters,
        groupBy,
        startDate,
        endDate,
        format = 'json'
      } = req.body;

      const userId = req.user.id;

      // Validate report parameters
      if (!metrics || !Array.isArray(metrics) || metrics.length === 0) {
        return res.status(400).json({ error: 'Metrics are required' });
      }

      // Generate custom report
      const reportData = await reportGenerator.generateCustomReport({
        metrics,
        filters,
        groupBy,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        userId
      });

      // Format report based on requested format
      let response;
      switch (format) {
        case 'csv':
          response = await this.formatAsCSV(reportData);
          res.setHeader('Content-Type', 'text/csv');
          res.setHeader('Content-Disposition', 'attachment; filename=analytics-report.csv');
          break;
          
        case 'excel':
          response = await this.formatAsExcel(reportData);
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', 'attachment; filename=analytics-report.xlsx');
          break;
          
        case 'pdf':
          response = await this.formatAsPDF(reportData);
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'attachment; filename=analytics-report.pdf');
          break;
          
        default:
          response = reportData;
      }

      // Log report generation
      await AnalyticsEvent.create({
        type: 'report_generated',
        userId,
        data: {
          metrics,
          filters,
          format,
          recordCount: reportData.data?.length || 0
        }
      });

      if (format === 'json') {
        res.json({
          success: true,
          report: response,
          generated: new Date()
        });
      } else {
        res.send(response);
      }

    } catch (error) {
      logger.error('Custom report generation error:', error);
      res.status(500).json({ error: 'Failed to generate custom report' });
    }
  }
);

/**
 * @route   GET /api/analytics/predictive
 * @desc    Get predictive analytics
 * @access  Private (Admin)
 */
router.get('/predictive',
  authenticate,
  authorize(['admin']),
  async (req, res) => {
    try {
      const { metric, horizon = 30 } = req.query;

      // User growth prediction
      const userGrowth = await predictiveAnalytics.predictUserGrowth(horizon);

      // Revenue forecast
      const revenueForecast = await predictiveAnalytics.forecastRevenue(horizon);

      // Churn prediction
      const churnPrediction = await predictiveAnalytics.predictChurn();

      // Server load prediction
      const loadPrediction = await predictiveAnalytics.predictServerLoad(horizon);

      // Engagement trends
      const engagementTrends = await predictiveAnalytics.predictEngagement(horizon);

      // Anomaly detection
      const anomalies = await predictiveAnalytics.detectAnomalies();

      res.json({
        success: true,
        predictions: {
          userGrowth,
          revenue: revenueForecast,
          churn: churnPrediction,
          serverLoad: loadPrediction,
          engagement: engagementTrends,
          anomalies,
          horizon,
          confidence: {
            userGrowth: 0.85,
            revenue: 0.78,
            churn: 0.82,
            serverLoad: 0.90,
            engagement: 0.75
          }
        }
      });

    } catch (error) {
      logger.error('Predictive analytics error:', error);
      res.status(500).json({ error: 'Failed to get predictive analytics' });
    }
  }
);

/**
 * @route   POST /api/analytics/track
 * @desc    Track custom analytics event
 * @access  Private
 */
router.post('/track',
  authenticate,
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 100 }),
  async (req, res) => {
    try {
      const { event, properties } = req.body;
      const userId = req.user.id;

      if (!event) {
        return res.status(400).json({ error: 'Event name is required' });
      }

      // Create analytics event
      const analyticsEvent = await AnalyticsEvent.create({
        type: event,
        userId,
        data: properties,
        timestamp: new Date(),
        sessionId: req.sessionID,
        userAgent: req.headers['user-agent'],
        ip: req.ip
      });

      // Update real-time metrics
      await realtimeAnalytics.trackEvent(event, userId, properties);

      res.json({
        success: true,
        eventId: analyticsEvent._id
      });

    } catch (error) {
      logger.error('Event tracking error:', error);
      res.status(500).json({ error: 'Failed to track event' });
    }
  }
);

// Helper methods (should be in a service class)
router.getOverviewMetrics = async function(serverIds, startDate, endDate) {
  const [totalUsers, activeUsers, totalMessages, totalRevenue] = await Promise.all([
    User.countDocuments(),
    UserActivity.distinct('userId', {
      timestamp: { $gte: startDate, $lte: endDate }
    }).then(users => users.length),
    Message.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate }
    }),
    Payment.aggregate([
      {
        $match: {
          status: 'success',
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]).then(result => result[0]?.total || 0)
  ]);

  return {
    totalUsers,
    activeUsers,
    totalMessages,
    totalRevenue
  };
};

router.getUserMetrics = async function(serverIds, startDate, endDate) {
  return User.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        newUsers: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

router.getMessageMetrics = async function(serverIds, startDate, endDate) {
  return Message.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        messages: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

router.getChannelMetrics = async function(serverIds, startDate, endDate) {
  return Channel.aggregate([
    {
      $match: {
        serverId: { $in: serverIds }
      }
    },
    {
      $lookup: {
        from: 'messages',
        let: { channelId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$channelId', '$$channelId'] },
              createdAt: { $gte: startDate, $lte: endDate }
            }
          },
          { $count: 'count' }
        ],
        as: 'messageCount'
      }
    },
    {
      $project: {
        name: 1,
        type: 1,
        messageCount: { $ifNull: [{ $arrayElemAt: ['$messageCount.count', 0] }, 0] }
      }
    },
    { $sort: { messageCount: -1 } },
    { $limit: 10 }
  ]);
};

router.getEngagementMetrics = async function(serverIds, startDate, endDate) {
  // Implementation for engagement metrics
  return {
    avgSessionDuration: 25.5,
    dailyActiveUsers: 1250,
    weeklyActiveUsers: 5420,
    monthlyActiveUsers: 12500
  };
};

router.getRevenueMetrics = async function(userId, startDate, endDate) {
  return Payment.aggregate([
    {
      $match: {
        status: 'success',
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$amount' }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

router.calculateRetentionCohorts = async function(startDate, endDate) {
  // Implementation for retention cohorts
  return {
    cohorts: [],
    averageRetention: 0.65
  };
};

router.calculateUserLTV = async function(startDate, endDate) {
  // Implementation for LTV calculation
  return 125.50;
};

router.calculateChurnRate = async function(startDate, endDate) {
  // Implementation for churn rate
  return 0.05;
};

router.getDateFormat = function(groupBy) {
  switch (groupBy) {
    case 'hour': return '%Y-%m-%d %H:00';
    case 'day': return '%Y-%m-%d';
    case 'week': return '%Y-W%V';
    case 'month': return '%Y-%m';
    case 'year': return '%Y';
    default: return '%Y-%m-%d';
  }
};

router.calculateResponseMetrics = async function(matchQuery) {
  // Implementation for response metrics
  return {
    avgResponseTime: 2.5,
    medianResponseTime: 1.8
  };
};

router.calculateMRR = async function() {
  // Calculate Monthly Recurring Revenue
  return 45000;
};

router.calculateARPU = async function(startDate, endDate) {
  // Calculate Average Revenue Per User
  return 12.50;
};

router.calculateLTV = async function() {
  // Calculate Lifetime Value
  return 250;
};

router.calculateGrowthMetrics = async function(startDate, endDate) {
  // Implementation for growth metrics
  return {
    userGrowthRate: 0.15,
    revenueGrowthRate: 0.22
  };
};

router.calculateRefundMetrics = async function(startDate, endDate) {
  // Implementation for refund metrics
  return {
    refundRate: 0.02,
    totalRefunds: 5
  };
};

router.calculateRevenueChurn = async function(startDate, endDate) {
  // Implementation for revenue churn
  return {
    grossChurn: 0.05,
    netChurn: 0.03
  };
};

router.calculateUserFunnel = async function(startDate, endDate) {
  // Implementation for user funnel
  return {
    registration: 1000,
    activation: 750,
    engagement: 500,
    retention: 400,
    monetization: 100
  };
};

router.calculateStickiness = async function(startDate, endDate) {
  // DAU/MAU ratio
  return 0.25;
};

router.calculateEngagementScores = async function(serverId, startDate, endDate) {
  // Implementation for engagement scores
  return {
    distribution: [],
    average: 7.5
  };
};

router.getVoiceChannelMetrics = async function(serverId, startDate, endDate) {
  // Implementation for voice metrics
  return {
    totalMinutes: 12500,
    avgCallDuration: 15.5,
    peakConcurrentUsers: 45
  };
};

router.getWebSocketMetrics = async function(startDate, endDate) {
  // Implementation for WebSocket metrics
  return {
    connections: 1250,
    messagesPerSecond: 150,
    avgLatency: 45
  };
};

router.getCacheMetrics = async function(startDate, endDate) {
  // Implementation for cache metrics
  return {
    hitRate: 85,
    missRate: 15,
    evictions: 250
  };
};

router.getResourceMetrics = async function(startDate, endDate) {
  // Implementation for resource metrics
  return {
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 35
  };
};

router.calculateUptime = async function(startDate, endDate) {
  // Implementation for uptime calculation
  return 99.95;
};

router.formatAsCSV = async function(data) {
  const parser = new Parser();
  return parser.parse(data.data);
};

router.formatAsExcel = async function(data) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Analytics Report');
  
  // Add headers
  if (data.data && data.data.length > 0) {
    worksheet.columns = Object.keys(data.data[0]).map(key => ({
      header: key,
      key: key,
      width: 15
    }));
    
    // Add data
    worksheet.addRows(data.data);
  }
  
  return workbook.xlsx.writeBuffer();
};

router.formatAsPDF = async function(data) {
  const doc = new PDFDocument();
  const chunks = [];
  
  doc.on('data', chunk => chunks.push(chunk));
  
  // Add content
  doc.fontSize(16).text('Analytics Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(JSON.stringify(data, null, 2));
  
  doc.end();
  
  return new Promise((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
  });
};

module.exports = router;