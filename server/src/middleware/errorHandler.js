import winston from 'winston';

// Configure logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

// Error types
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, 429);
  }
}

// Async error handler wrapper
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
  let { statusCode = 500, message } = err;

  // Log error
  logger.error({
    error: err.message,
    stack: err.stack,
    statusCode,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userId: req.user?._id,
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map(e => e.message);
    message = `Validation Error: ${errors.join(', ')}`;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Multer errors
  if (err.name === 'MulterError') {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File too large';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Unexpected file field';
    } else {
      message = err.message;
    }
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
        details: err,
      }),
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
};

// 404 handler
export const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  next(error);
};

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  // Close server, database connections, etc.
  process.exit(0);
});

export { AppError, logger };