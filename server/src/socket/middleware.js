import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { SocketRateLimiter } from '../middleware/rateLimiter.js';

const socketRateLimiter = new SocketRateLimiter({
  windowMs: 60000,
  maxEvents: 100,
});

export const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    
    if (!token) {
      return next(new Error('Authentication required'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId)
      .select('-password -refreshTokens');
    
    if (!user) {
      return next(new Error('User not found'));
    }

    if (user.banned) {
      return next(new Error('Account banned'));
    }

    socket.userId = user._id.toString();
    socket.user = user;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new Error('Invalid token'));
    } else if (error.name === 'TokenExpiredError') {
      next(new Error('Token expired'));
    } else {
      next(new Error('Authentication failed'));
    }
  }
};

export const rateLimitSocket = socketRateLimiter.middleware();

export const logSocketEvents = (socket, next) => {
  const originalEmit = socket.emit;
  
  socket.emit = function(...args) {
    console.log(`[Socket ${socket.id}] Emitting:`, args[0]);
    originalEmit.apply(socket, args);
  };

  socket.onAny((eventName, ...args) => {
    console.log(`[Socket ${socket.id}] Received:`, eventName);
  });

  next();
};

export const handleSocketErrors = (socket, next) => {
  socket.on('error', (error) => {
    console.error(`[Socket ${socket.id}] Error:`, error);
    socket.emit('error', {
      message: 'An error occurred',
      code: error.code || 'UNKNOWN_ERROR',
    });
  });

  next();
};

export const trackSocketMetrics = (socket, next) => {
  socket.on('connect', () => {
    // Increment connection counter
  });

  socket.on('disconnect', () => {
    // Decrement connection counter
  });

  next();
};