const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const crypto = require('crypto');

class TwoFactorAuthService {
  constructor(config) {
    this.config = config;
    this.pendingSetups = new Map();
  }

  async generateSecret(userId, email) {
    const secret = speakeasy.generateSecret({
      name: `${this.config.twoFactor.appName} (${email})`,
      length: 32
    });

    // Store temporarily for verification
    this.pendingSetups.set(userId, {
      secret: secret.base32,
      createdAt: Date.now(),
      attempts: 0
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url, {
      width: this.config.twoFactor.qrCodeSize
    });

    // Generate backup codes
    const backupCodes = this.generateBackupCodes();

    return {
      secret: secret.base32,
      qrCode: qrCodeUrl,
      manualEntryKey: secret.base32,
      backupCodes
    };
  }

  verifyToken(token, secret) {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: this.config.twoFactor.window
    });
  }

  async enableTwoFactor(userId, token) {
    const pending = this.pendingSetups.get(userId);
    
    if (!pending) {
      throw new Error('No pending 2FA setup found');
    }

    if (Date.now() - pending.createdAt > 10 * 60 * 1000) { // 10 minutes
      this.pendingSetups.delete(userId);
      throw new Error('2FA setup expired');
    }

    if (pending.attempts >= 3) {
      this.pendingSetups.delete(userId);
      throw new Error('Too many failed attempts');
    }

    const isValid = this.verifyToken(token, pending.secret);
    
    if (!isValid) {
      pending.attempts++;
      throw new Error('Invalid verification code');
    }

    // Clean up and return secret for storage
    this.pendingSetups.delete(userId);
    return {
      secret: pending.secret,
      enabledAt: new Date()
    };
  }

  generateBackupCodes(count = null) {
    const codeCount = count || this.config.twoFactor.backupCodesCount;
    const codes = [];
    
    for (let i = 0; i < codeCount; i++) {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      const formatted = `${code.slice(0, 4)}-${code.slice(4)}`;
      codes.push(formatted);
    }
    
    return codes;
  }

  hashBackupCode(code) {
    return crypto.createHash('sha256')
      .update(code.replace('-', ''))
      .digest('hex');
  }

  verifyBackupCode(inputCode, hashedCodes) {
    const normalizedInput = inputCode.replace('-', '').toUpperCase();
    const hashedInput = this.hashBackupCode(normalizedInput);
    
    for (let i = 0; i < hashedCodes.length; i++) {
      if (crypto.timingSafeEqual(
        Buffer.from(hashedInput),
        Buffer.from(hashedCodes[i])
      )) {
        return { valid: true, index: i };
      }
    }
    
    return { valid: false };
  }

  generateRecoveryCodes() {
    return this.generateBackupCodes(6);
  }

  async disableTwoFactor(userId, password, token) {
    // Verify password and token before disabling
    // This should be handled in conjunction with PasswordService
    
    return {
      disabledAt: new Date(),
      recoveryCodes: this.generateRecoveryCodes()
    };
  }

  generateTOTP(secret) {
    return speakeasy.totp({
      secret,
      encoding: 'base32'
    });
  }

  getRemainingTime() {
    const epoch = Math.round(Date.now() / 1000);
    return 30 - (epoch % 30);
  }
}

module.exports = TwoFactorAuthService;