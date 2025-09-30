import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/EmailService.js';
import { generateUsername } from '../utils/helpers.js';

class AuthController {
  // Generate tokens
  generateTokens(userId) {
    const accessToken = jwt.sign(
      { userId, type: 'access' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    const refreshToken = jwt.sign(
      { userId, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    return { accessToken, refreshToken };
  }

  // Register
  async register(req, res) {
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
      const { accessToken, refreshToken } = this.generateTokens(user._id);

      res.status(201).json({
        message: 'Registration successful. Please verify your email.',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
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
  }

  // Login
  async login(req, res) {
    try {
      const { email, password, twoFactorCode } = req.body;

      const user = await User.findOne({ email }).select('+password +twoFactorSecret');

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check 2FA
      if (user.twoFactorEnabled) {
        if (!twoFactorCode) {
          return res.status(200).json({ requiresTwoFactor: true });
        }

        const speakeasy = require('speakeasy');
        const verified = speakeasy.totp.verify({
          secret: user.twoFactorSecret,
          encoding: 'base32',
          token: twoFactorCode,
          window: 2,
        });

        if (!verified) {
          return res.status(401).json({ error: 'Invalid 2FA code' });
        }
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate tokens
      const { accessToken, refreshToken } = this.generateTokens(user._id);

      res.json({
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
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
  }

  // Refresh token
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token required' });
      }

      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
      );

      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }

      const { accessToken } = this.generateTokens(user._id);

      res.json({ accessToken });
    } catch (error) {
      res.status(401).json({ error: 'Invalid refresh token' });
    }
  }

  // Logout
  async logout(req, res) {
    try {
      // Invalidate refresh token if needed
      res.json({ message: 'Logout successful' });
    } catch (error) {
      res.status(500).json({ error: 'Logout failed' });
    }
  }

  // Verify email
  async verifyEmail(req, res) {
    try {
      const { token } = req.params;

      const user = await User.findOne({ verificationToken: token });

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
  }

  // Forgot password
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        // Don't reveal if email exists
        return res.json({ message: 'If the email exists, a reset link has been sent' });
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      user.passwordResetToken = resetToken;
      user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
      await user.save();

      await sendPasswordResetEmail(email, resetToken);

      res.json({ message: 'If the email exists, a reset link has been sent' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send reset email' });
    }
  }

  // Reset password
  async resetPassword(req, res) {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const user = await User.findOne({
        passwordResetToken: token,
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
  }
}

export default new AuthController();