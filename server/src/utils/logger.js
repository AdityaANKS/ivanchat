import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';

const logDir = process.env.LOG_DIR || 'logs';

// Custom format
const customFormat = winston.format.printf(({ timestamp, level, message, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  
  return msg;
});

// Create logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'ivan-backend' },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    
    // Error file transport
    new winston.transports.DailyRotateFile({
      filename: path.join(logDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d',
    }),
    
    // Combined file transport
    new winston.transports.DailyRotateFile({
      filename: path.join(logDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});

// Add file transport in production
if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.File({
    filename: path.join(logDir, 'production.log'),
    format: customFormat,
  }));
}

// Stream for Morgan HTTP logger
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

export default logger;

// Convenience methods
export const logInfo = (message, meta) => logger.info(message, meta);
export const logError = (message, error) => logger.error(message, { error: error.stack || error });
export const logWarn = (message, meta) => logger.warn(message, meta);
export const logDebug = (message, meta) => logger.debug(message, meta);