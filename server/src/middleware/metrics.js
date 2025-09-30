const prometheus = require('prom-client');
const ResponseTime = require('response-time');
const os = require('os');
const v8 = require('v8');
const pidusage = require('pidusage');
const { EventEmitter } = require('events');
const Redis = require('ioredis');
const { performance } = require('perf_hooks');

// Initialize Redis for metrics storage
const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  keyPrefix: 'metrics:'
});

// Create a metrics event emitter for real-time metrics
const metricsEmitter = new EventEmitter();

// ========================
// Prometheus Metrics Setup
// ========================

// Create a Registry
const register = new prometheus.Registry();

// Add default metrics (CPU, memory, etc.)
prometheus.collectDefaultMetrics({ 
  register,
  prefix: 'ivan_',
  gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5]
});

// Custom Metrics Definitions

// HTTP Metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'ivan_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status', 'user_type'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]
});

const httpRequestTotal = new prometheus.Counter({
  name: 'ivan_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status', 'user_type']
});

const httpRequestSize = new prometheus.Histogram({
  name: 'ivan_http_request_size_bytes',
  help: 'Size of HTTP requests in bytes',
  labelNames: ['method', 'route'],
  buckets: [100, 1000, 10000, 100000, 1000000, 10000000]
});

const httpResponseSize = new prometheus.Histogram({
  name: 'ivan_http_response_size_bytes',
  help: 'Size of HTTP responses in bytes',
  labelNames: ['method', 'route'],
  buckets: [100, 1000, 10000, 100000, 1000000, 10000000]
});

// WebSocket Metrics
const wsConnectionsTotal = new prometheus.Gauge({
  name: 'ivan_websocket_connections_total',
  help: 'Total number of WebSocket connections',
  labelNames: ['type']
});

const wsMessagesTotal = new prometheus.Counter({
  name: 'ivan_websocket_messages_total',
  help: 'Total number of WebSocket messages',
  labelNames: ['direction', 'type']
});

const wsMessageSize = new prometheus.Histogram({
  name: 'ivan_websocket_message_size_bytes',
  help: 'Size of WebSocket messages in bytes',
  labelNames: ['direction', 'type'],
  buckets: [10, 100, 1000, 10000, 100000]
});

// Database Metrics
const dbQueryDuration = new prometheus.Histogram({
  name: 'ivan_database_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'collection', 'status'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 5]
});

const dbConnectionPool = new prometheus.Gauge({
  name: 'ivan_database_connection_pool_size',
  help: 'Database connection pool size',
  labelNames: ['state']
});

// Cache Metrics
const cacheOperations = new prometheus.Counter({
  name: 'ivan_cache_operations_total',
  help: 'Total number of cache operations',
  labelNames: ['operation', 'status']
});

const cacheHitRate = new prometheus.Gauge({
  name: 'ivan_cache_hit_rate',
  help: 'Cache hit rate percentage'
});

// Business Metrics
const messagesProcessed = new prometheus.Counter({
  name: 'ivan_messages_processed_total',
  help: 'Total number of messages processed',
  labelNames: ['type', 'channel_type']
});

const activeUsers = new prometheus.Gauge({
  name: 'ivan_active_users',
  help: 'Number of active users',
  labelNames: ['period']
});

const voiceChannelUsers = new prometheus.Gauge({
  name: 'ivan_voice_channel_users',
  help: 'Number of users in voice channels',
  labelNames: ['server_id']
});

const fileUploads = new prometheus.Counter({
  name: 'ivan_file_uploads_total',
  help: 'Total number of file uploads',
  labelNames: ['type', 'size_category']
});

const apiRateLimitHits = new prometheus.Counter({
  name: 'ivan_api_rate_limit_hits_total',
  help: 'Total number of rate limit hits',
  labelNames: ['endpoint', 'user_type']
});

// Error Metrics
const errorRate = new prometheus.Counter({
  name: 'ivan_errors_total',
  help: 'Total number of errors',
  labelNames: ['type', 'code', 'route']
});

const unhandledExceptions = new prometheus.Counter({
  name: 'ivan_unhandled_exceptions_total',
  help: 'Total number of unhandled exceptions'
});

// Performance Metrics
const eventLoopLag = new prometheus.Gauge({
  name: 'ivan_event_loop_lag_seconds',
  help: 'Event loop lag in seconds'
});

const memoryUsage = new prometheus.Gauge({
  name: 'ivan_memory_usage_bytes',
  help: 'Memory usage in bytes',
  labelNames: ['type']
});

const cpuUsage = new prometheus.Gauge({
  name: 'ivan_cpu_usage_percentage',
  help: 'CPU usage percentage'
});

// Register all metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(httpRequestSize);
register.registerMetric(httpResponseSize);
register.registerMetric(wsConnectionsTotal);
register.registerMetric(wsMessagesTotal);
register.registerMetric(wsMessageSize);
register.registerMetric(dbQueryDuration);
register.registerMetric(dbConnectionPool);
register.registerMetric(cacheOperations);
register.registerMetric(cacheHitRate);
register.registerMetric(messagesProcessed);
register.registerMetric(activeUsers);
register.registerMetric(voiceChannelUsers);
register.registerMetric(fileUploads);
register.registerMetric(apiRateLimitHits);
register.registerMetric(errorRate);
register.registerMetric(unhandledExceptions);
register.registerMetric(eventLoopLag);
register.registerMetric(memoryUsage);
register.registerMetric(cpuUsage);

// ========================
// Metrics Collection Class
// ========================

class MetricsCollector {
  constructor() {
    this.startTime = Date.now();
    this.requestCounts = new Map();
    this.errorCounts = new Map();
    this.cacheHits = 0;
    this.cacheMisses = 0;
    
    // Start periodic collectors
    this.startPeriodicCollectors();
    
    // Setup process metrics
    this.setupProcessMetrics();
  }

  startPeriodicCollectors() {
    // Collect system metrics every 10 seconds
    setInterval(() => this.collectSystemMetrics(), 10000);
    
    // Collect business metrics every 30 seconds
    setInterval(() => this.collectBusinessMetrics(), 30000);
    
    // Update cache hit rate every 5 seconds
    setInterval(() => this.updateCacheHitRate(), 5000);
    
    // Monitor event loop lag
    setInterval(() => this.measureEventLoopLag(), 1000);
  }

  setupProcessMetrics() {
    // Monitor unhandled exceptions
    process.on('uncaughtException', (error) => {
      unhandledExceptions.inc();
      console.error('Uncaught Exception:', error);
    });

    process.on('unhandledRejection', (reason, promise) => {
      unhandledExceptions.inc();
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });
  }

  async collectSystemMetrics() {
    try {
      // CPU Usage
      const stats = await pidusage(process.pid);
      cpuUsage.set(stats.cpu);

      // Memory Usage
      const mem = process.memoryUsage();
      memoryUsage.set({ type: 'rss' }, mem.rss);
      memoryUsage.set({ type: 'heapTotal' }, mem.heapTotal);
      memoryUsage.set({ type: 'heapUsed' }, mem.heapUsed);
      memoryUsage.set({ type: 'external' }, mem.external);
      memoryUsage.set({ type: 'arrayBuffers' }, mem.arrayBuffers);

      // V8 Heap Statistics
      const heapStats = v8.getHeapStatistics();
      memoryUsage.set({ type: 'v8_total_heap_size' }, heapStats.total_heap_size);
      memoryUsage.set({ type: 'v8_used_heap_size' }, heapStats.used_heap_size);
      memoryUsage.set({ type: 'v8_heap_size_limit' }, heapStats.heap_size_limit);

      // System Load Average
      const loadAvg = os.loadavg();
      
      // Store in Redis for historical data
      await this.storeMetricsInRedis({
        timestamp: Date.now(),
        cpu: stats.cpu,
        memory: mem,
        loadAvg
      });

    } catch (error) {
      console.error('Error collecting system metrics:', error);
    }
  }

  async collectBusinessMetrics() {
    try {
      // Get active users count from Redis
      const activeUsersCount = await redisClient.scard('active_users');
      activeUsers.set({ period: '5m' }, activeUsersCount || 0);

      const dailyActiveUsers = await redisClient.scard('daily_active_users');
      activeUsers.set({ period: '24h' }, dailyActiveUsers || 0);

      // Emit metrics for real-time dashboards
      metricsEmitter.emit('metrics:update', {
        activeUsers: activeUsersCount,
        timestamp: Date.now()
      });

    } catch (error) {
      console.error('Error collecting business metrics:', error);
    }
  }

  updateCacheHitRate() {
    const total = this.cacheHits + this.cacheMisses;
    if (total > 0) {
      const hitRate = (this.cacheHits / total) * 100;
      cacheHitRate.set(hitRate);
      
      // Reset counters periodically to get recent hit rate
      if (total > 10000) {
        this.cacheHits = 0;
        this.cacheMisses = 0;
      }
    }
  }

  measureEventLoopLag() {
    const start = performance.now();
    setImmediate(() => {
      const lag = (performance.now() - start) / 1000; // Convert to seconds
      eventLoopLag.set(lag);
    });
  }

  async storeMetricsInRedis(metrics) {
    const key = `system:${Date.now()}`;
    await redisClient.setex(key, 3600, JSON.stringify(metrics)); // Store for 1 hour
  }

  recordCacheHit() {
    this.cacheHits++;
    cacheOperations.inc({ operation: 'get', status: 'hit' });
  }

  recordCacheMiss() {
    this.cacheMisses++;
    cacheOperations.inc({ operation: 'get', status: 'miss' });
  }
}

// Create global metrics collector instance
const metricsCollector = new MetricsCollector();

// ========================
// HTTP Metrics Middleware
// ========================

const httpMetricsMiddleware = ResponseTime((req, res, time) => {
  const route = req.route?.path || req.path || 'unknown';
  const method = req.method;
  const status = res.statusCode;
  const userType = req.user?.subscription?.type || 'anonymous';

  // Record metrics
  httpRequestDuration.observe(
    { method, route, status: status.toString(), user_type: userType },
    time / 1000 // Convert to seconds
  );

  httpRequestTotal.inc({
    method,
    route,
    status: status.toString(),
    user_type: userType
  });

  // Request size
  const requestSize = parseInt(req.get('content-length') || '0');
  if (requestSize > 0) {
    httpRequestSize.observe({ method, route }, requestSize);
  }

  // Response size
  const responseSize = parseInt(res.get('content-length') || '0');
  if (responseSize > 0) {
    httpResponseSize.observe({ method, route }, responseSize);
  }

  // Track slow requests
  if (time > 1000) { // Requests taking more than 1 second
    console.warn(`Slow request detected: ${method} ${route} took ${time}ms`);
    
    // Store slow request details
    redisClient.zadd(
      'slow_requests',
      Date.now(),
      JSON.stringify({
        method,
        route,
        duration: time,
        timestamp: new Date().toISOString(),
        userId: req.user?.id
      })
    );
  }

  // Track endpoint usage
  redisClient.hincrby('endpoint_usage', `${method}:${route}`, 1);
});

// ========================
// WebSocket Metrics Functions
// ========================

function recordWebSocketConnection(type = 'default', increment = true) {
  if (increment) {
    wsConnectionsTotal.inc({ type });
  } else {
    wsConnectionsTotal.dec({ type });
  }
}

function recordWebSocketMessage(direction, type, size) {
  wsMessagesTotal.inc({ direction, type });
  if (size) {
    wsMessageSize.observe({ direction, type }, size);
  }
}

// ========================
// Database Metrics Functions
// ========================

function recordDatabaseQuery(operation, collection, duration, success = true) {
  dbQueryDuration.observe(
    { 
      operation, 
      collection, 
      status: success ? 'success' : 'failure' 
    },
    duration / 1000 // Convert to seconds
  );
}

function updateConnectionPoolMetrics(active, idle) {
  dbConnectionPool.set({ state: 'active' }, active);
  dbConnectionPool.set({ state: 'idle' }, idle);
}

// ========================
// Business Metrics Functions
// ========================

function recordMessageProcessed(type, channelType) {
  messagesProcessed.inc({ type, channel_type: channelType });
}

function recordFileUpload(type, size) {
  let sizeCategory = 'small';
  if (size > 10485760) sizeCategory = 'large'; // > 10MB
  else if (size > 1048576) sizeCategory = 'medium'; // > 1MB
  
  fileUploads.inc({ type, size_category: sizeCategory });
}

function recordRateLimitHit(endpoint, userType) {
  apiRateLimitHits.inc({ endpoint, user_type: userType });
}

function recordError(type, code, route) {
  errorRate.inc({ type, code: code.toString(), route });
}

function updateVoiceChannelUsers(serverId, count) {
  voiceChannelUsers.set({ server_id: serverId }, count);
}

// ========================
// Error Tracking Middleware
// ========================

const errorMetricsMiddleware = (err, req, res, next) => {
  const route = req.route?.path || req.path || 'unknown';
  const statusCode = err.status || err.statusCode || 500;
  const errorType = err.name || 'UnknownError';

  recordError(errorType, statusCode, route);

  // Log to Redis for analysis
  redisClient.zadd(
    'errors',
    Date.now(),
    JSON.stringify({
      type: errorType,
      message: err.message,
      stack: err.stack,
      route,
      method: req.method,
      statusCode,
      timestamp: new Date().toISOString(),
      userId: req.user?.id,
      ip: req.ip
    })
  );

  next(err);
};

// ========================
// Custom Metrics Middleware
// ========================

const customMetrics = {
  // Track user activity
  recordUserActivity: async (userId, action) => {
    await redisClient.sadd('active_users', userId);
    await redisClient.expire('active_users', 300); // 5 minutes
    
    await redisClient.sadd('daily_active_users', userId);
    await redisClient.expire('daily_active_users', 86400); // 24 hours
    
    await redisClient.hincrby('user_actions', action, 1);
  },

  // Track API usage by user
  recordApiUsage: async (userId, endpoint) => {
    const key = `api_usage:${userId}:${new Date().toISOString().split('T')[0]}`;
    await redisClient.hincrby(key, endpoint, 1);
    await redisClient.expire(key, 86400 * 7); // Keep for 7 days
  },

  // Track feature usage
  recordFeatureUsage: async (feature, metadata = {}) => {
    await redisClient.hincrby('feature_usage', feature, 1);
    
    if (Object.keys(metadata).length > 0) {
      await redisClient.lpush(
        `feature_usage_details:${feature}`,
        JSON.stringify({
          ...metadata,
          timestamp: Date.now()
        })
      );
    }
  },

  // Track performance metrics
  recordPerformanceMetric: async (metric, value, tags = {}) => {
    const data = {
      metric,
      value,
      tags,
      timestamp: Date.now()
    };
    
    await redisClient.zadd(
      `performance:${metric}`,
      Date.now(),
      JSON.stringify(data)
    );
  }
};

// ========================
// Metrics Aggregation
// ========================

class MetricsAggregator {
  static async getMetricsSummary(period = '1h') {
    const summary = {
      requests: {},
      errors: {},
      performance: {},
      business: {}
    };

    // Get request metrics
    const endpointUsage = await redisClient.hgetall('endpoint_usage');
    summary.requests.byEndpoint = endpointUsage;

    // Get error metrics
    const recentErrors = await redisClient.zrevrange('errors', 0, 100, 'WITHSCORES');
    summary.errors.recent = recentErrors;

    // Get active users
    summary.business.activeUsers = await redisClient.scard('active_users');
    summary.business.dailyActiveUsers = await redisClient.scard('daily_active_users');

    // Get feature usage
    summary.business.featureUsage = await redisClient.hgetall('feature_usage');

    return summary;
  }

  static async getHealthMetrics() {
    const metrics = await register.getMetricsAsJSON();
    const systemStats = {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: await pidusage(process.pid),
      loadAvg: os.loadavg()
    };

    return {
      metrics,
      system: systemStats,
      timestamp: Date.now()
    };
  }
}

// ========================
// Real-time Metrics Stream
// ========================

class MetricsStream {
  constructor() {
    this.subscribers = new Set();
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  emit(metric, data) {
    const payload = {
      metric,
      data,
      timestamp: Date.now()
    };

    this.subscribers.forEach(callback => {
      try {
        callback(payload);
      } catch (error) {
        console.error('Error in metrics subscriber:', error);
      }
    });

    // Also emit to EventEmitter for other parts of the app
    metricsEmitter.emit('metric', payload);
  }
}

const metricsStream = new MetricsStream();

// ========================
// Exports
// ========================

module.exports = {
  // Middleware
  httpMetricsMiddleware,
  errorMetricsMiddleware,

  // Prometheus registry
  register,
  
  // Metrics recording functions
  recordWebSocketConnection,
  recordWebSocketMessage,
  recordDatabaseQuery,
  updateConnectionPoolMetrics,
  recordMessageProcessed,
  recordFileUpload,
  recordRateLimitHit,
  recordError,
  updateVoiceChannelUsers,
  
  // Custom metrics
  customMetrics,
  
  // Metrics collector
  metricsCollector,
  
  // Aggregation
  MetricsAggregator,
  
  // Real-time stream
  metricsStream,
  metricsEmitter,
  
  // Express route for metrics endpoint
  metricsEndpoint: async (req, res) => {
    try {
      res.set('Content-Type', register.contentType);
      const metrics = await register.metrics();
      res.end(metrics);
    } catch (error) {
      res.status(500).end(error.message);
    }
  },

  // Health check endpoint
  healthEndpoint: async (req, res) => {
    try {
      const health = await MetricsAggregator.getHealthMetrics();
      res.json(health);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // WebSocket handler for real-time metrics
  handleMetricsWebSocket: (ws) => {
    const unsubscribe = metricsStream.subscribe((metric) => {
      ws.send(JSON.stringify(metric));
    });

    ws.on('close', unsubscribe);
  }
};