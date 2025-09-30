import express from 'express';
import passport from '../config/passport.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { validateRegistration, validateLogin } from '../middleware/validation.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/EmailService.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '30d' }
  );
};

// Traditional registration
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        error: existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken'
      });
    }

    // Create user
    const user = await User.create({
      email,
      username,
      password,
      provider: 'local',
    });

    // Send verification email
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    await user.save();
    
    await sendVerificationEmail(email, verificationToken);

    // Generate tokens
    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token
    user.refreshTokens.push({
      token: refreshToken,
      createdAt: new Date(),
    });
    await user.save();

    res.status(201).json({
      message: 'Registration successful. Please verify your email.',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        verified: user.verified,
      },
      tokens: {
        access: accessToken,
        refresh: refreshToken,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Traditional login
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Find user
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if account is banned
    if (user.banned) {
      return res.status(403).json({ 
        error: 'Account banned',
        reason: user.banReason,
        until: user.banExpires,
      });
    }

    // Update last login
    user.lastLogin = new Date();
    user.lastActive = new Date();
    await user.save();

    // Generate tokens
    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token
    user.refreshTokens.push({
      token: refreshToken,
      createdAt: new Date(),
    });
    
    // Clean old refresh tokens (keep last 5)
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }
    
    await user.save();

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        verified: user.verified,
      },
      tokens: {
        access: accessToken,
        refresh: refreshToken,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Google OAuth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  async (req, res) => {
    try {
      const token = generateToken(req.user._id);
      const refreshToken = generateRefreshToken(req.user._id);
      
      // Store refresh token
      req.user.refreshTokens.push({
        token: refreshToken,
        createdAt: new Date(),
      });
      await req.user.save();
      
      // Redirect to frontend with tokens
      res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}&refresh=${refreshToken}`);
    } catch (error) {
      res.redirect(`${process.env.CLIENT_URL}/auth/error?message=${error.message}`);
    }
  }
);

// GitHub OAuth
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/login' }),
  async (req, res) => {
    try {
      const token = generateToken(req.user._id);
      const refreshToken = generateRefreshToken(req.user._id);
      
      req.user.refreshTokens.push({
        token: refreshToken,
        createdAt: new Date(),
      });
      await req.user.save();
      
      res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}&refresh=${refreshToken}`);
    } catch (error) {
      res.redirect(`${process.env.CLIENT_URL}/auth/error?message=${error.message}`);
    }
  }
);

// Discord OAuth
router.get('/discord',
  passport.authenticate('discord')
);

router.get('/discord/callback',
  passport.authenticate('discord', { session: false, failureRedirect: '/login' }),
  async (req, res) => {
    try {
      const token = generateToken(req.user._id);
      const refreshToken = generateRefreshToken(req.user._id);
      
      req.user.refreshTokens.push({
        token: refreshToken,
        createdAt: new Date(),
      });
      await req.user.save();
      
      res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}&refresh=${refreshToken}`);
    } catch (error) {
      res.redirect(`${process.env.CLIENT_URL}/auth/error?message=${error.message}`);
    }
  }
);

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Find user with this refresh token
    const user = await User.findOne({
      _id: decoded.userId,
      'refreshTokens.token': refreshToken,
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Generate new access token
    const newAccessToken = generateToken(user._id);
    
    res.json({
      token: newAccessToken,
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// Email verification
router.get('/verify/:token', async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid verification token' });
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Password reset request
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists
      return res.json({ message: 'If the email exists, a reset link has been sent' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    await sendPasswordResetEmail(email, resetToken);

    res.json({ message: 'If the email exists, a reset link has been sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send reset email' });
  }
});

// Password reset
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;
    
    const user = await User.findOne({
      passwordResetToken: req.params.token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: 'Password reset failed' });
  }
});

// Logout
router.post('/logout', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    // Remove refresh token
    if (refreshToken) {
      req.user.refreshTokens = req.user.refreshTokens.filter(
        rt => rt.token !== refreshToken
      );
      await req.user.save();
    }

    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

export default router;