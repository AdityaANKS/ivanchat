const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

class TokenService {
  constructor(config) {
    this.config = config;
    this.accessTokens = new Map();
    this.refreshTokens = new Map();
  }

  generateAccessToken(payload, options = {}) {
    const tokenId = uuidv4();
    const token = jwt.sign(
      { ...payload, jti: tokenId },
      this.config.jwt.secret,
      {
        expiresIn: options.expiresIn || this.config.jwt.expiresIn,
        algorithm: this.config.jwt.algorithm,
        issuer: this.config.jwt.issuer,
        audience: this.config.jwt.audience
      }
    );

    this.accessTokens.set(tokenId, {
      userId: payload.userId,
      createdAt: Date.now(),
      expiresAt: Date.now() + this.parseTime(options.expiresIn || this.config.jwt.expiresIn)
    });

    return { token, tokenId };
  }

  generateRefreshToken(userId) {
    const token = crypto.randomBytes(64).toString('hex');
    const hashedToken = this.hashToken(token);
    
    this.refreshTokens.set(hashedToken, {
      userId,
      createdAt: Date.now(),
      expiresAt: Date.now() + this.parseTime(this.config.jwt.refreshExpiresIn)
    });

    return token;
  }

  async verifyAccessToken(token) {
    try {
      const decoded = jwt.verify(token, this.config.jwt.secret, {
        algorithms: [this.config.jwt.algorithm],
        issuer: this.config.jwt.issuer,
        audience: this.config.jwt.audience
      });

      // Check if token is blacklisted
      if (this.isTokenBlacklisted(decoded.jti)) {
        throw new Error('Token has been revoked');
      }

      return { valid: true, decoded };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  async verifyRefreshToken(token) {
    const hashedToken = this.hashToken(token);
    const tokenData = this.refreshTokens.get(hashedToken);

    if (!tokenData) {
      return { valid: false, error: 'Invalid refresh token' };
    }

    if (Date.now() > tokenData.expiresAt) {
      this.refreshTokens.delete(hashedToken);
      return { valid: false, error: 'Refresh token expired' };
    }

    return { valid: true, userId: tokenData.userId };
  }

  async refreshAccessToken(refreshToken) {
    const verification = await this.verifyRefreshToken(refreshToken);
    
    if (!verification.valid) {
      throw new Error(verification.error);
    }

    // Generate new access token
    const newAccessToken = this.generateAccessToken({ userId: verification.userId });
    
    // Optionally rotate refresh token
    const newRefreshToken = this.generateRefreshToken(verification.userId);
    
    // Invalidate old refresh token
    const hashedOldToken = this.hashToken(refreshToken);
    this.refreshTokens.delete(hashedOldToken);

    return {
      accessToken: newAccessToken.token,
      refreshToken: newRefreshToken
    };
  }

  revokeToken(tokenId) {
    this.accessTokens.delete(tokenId);
    // Add to blacklist
    this.blacklistedTokens.add(tokenId);
  }

  revokeAllUserTokens(userId) {
    // Revoke access tokens
    for (const [tokenId, data] of this.accessTokens.entries()) {
      if (data.userId === userId) {
        this.revokeToken(tokenId);
      }
    }

    // Revoke refresh tokens
    for (const [hash, data] of this.refreshTokens.entries()) {
      if (data.userId === userId) {
        this.refreshTokens.delete(hash);
      }
    }
  }

  generateCSRFToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  verifyCSRFToken(token, sessionToken) {
    return crypto.timingSafeEqual(
      Buffer.from(token),
      Buffer.from(sessionToken)
    );
  }

  hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  parseTime(time) {
    const units = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000
    };
    
    const match = time.match(/^(\d+)([smhd])$/);
    if (!match) return 0;
    
    return parseInt(match[1]) * units[match[2]];
  }

  isTokenBlacklisted(tokenId) {
    return this.blacklistedTokens?.has(tokenId) || false;
  }

  cleanupExpiredTokens() {
    const now = Date.now();
    
    // Clean access tokens
    for (const [tokenId, data] of this.accessTokens.entries()) {
      if (now > data.expiresAt) {
        this.accessTokens.delete(tokenId);
      }
    }

    // Clean refresh tokens
    for (const [hash, data] of this.refreshTokens.entries()) {
      if (now > data.expiresAt) {
        this.refreshTokens.delete(hash);
      }
    }
  }
}

module.exports = TokenService;