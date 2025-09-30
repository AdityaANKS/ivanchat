import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AuthenticationError } from './errorHandler.js';

export const authenticateUser = async (req, res, next) => {
  try {
    const token = extractToken(req);
    
    if (!token) {
      throw new AuthenticationError('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId)
      .select('-password -refreshTokens');
    
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    if (user.banned) {
      throw new AuthenticationError('Account banned');
    }

    req.user = user;
    req.userId = user._id.toString();
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new AuthenticationError('Invalid token'));
    } else if (error.name === 'TokenExpiredError') {
      next(new AuthenticationError('Token expired'));
    } else {
      next(error);
    }
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    
    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId)
      .select('-password -refreshTokens');
    
    if (user && !user.banned) {
      req.user = user;
      req.userId = user._id.toString();
    }
    
    next();
  } catch {
    // Invalid token, continue without auth
    next();
  }
};

function extractToken(req) {
  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check cookies
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }

  // Check query parameter (for WebSocket connections)
  if (req.query && req.query.token) {
    return req.query.token;
  }

  return null;
}

export const requireVerified = async (req, res, next) => {
  if (!req.user.verified) {
    return res.status(403).json({
      error: 'Email verification required',
      code: 'EMAIL_NOT_VERIFIED',
    });
  }
  next();
};

export const requireTwoFactor = async (req, res, next) => {
  if (req.user.twoFactorEnabled && !req.session?.twoFactorVerified) {
    return res.status(403).json({
      error: '2FA verification required',
      code: 'TWO_FACTOR_REQUIRED',
    });
  }
  next();
};