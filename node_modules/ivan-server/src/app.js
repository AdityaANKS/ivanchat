import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import path from 'path';

// Import middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { metricsMiddleware } from './metrics/prometheus.js';
import { defaultRateLimiter } from './middleware/rateLimiter.js';

// Import routes
import routes from './routes/index.js';

//chunkUploadRoutes
import chunkUploadRoutes from './routes/chunkUploadRoutes.js';
app.use('/api/upload', chunkUploadRoutes);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create Express app
const app = express();

// Secuity HTTPS
app.get("/", (req, res) => {
  res.send("Hello HTTPS World!");
});

// Trust proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:5000',
    ];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression
app.use(compression());

// Sanitization
app.use(mongoSanitize());
app.use(xss());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    skip: (req, res) => res.statusCode < 400,
  }));
}

// Metrics
app.use(metricsMiddleware);

// Rate limiting
app.use('/api/', defaultRateLimiter);

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/public', express.static(path.join(__dirname, '../public')));

// API routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;