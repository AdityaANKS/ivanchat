const { expect } = require('chai');
const sinon = require('sinon');
const crypto = require('crypto');
const EncryptionService = require('../../server/src/services/EncryptionService');

describe('Unit: EncryptionService', () => {
  let encryptionService;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    encryptionService = Object.create(EncryptionService);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Key Generation', () => {
    it('should generate RSA key pair', async () => {
      const userId = 'test-user-id';
      const keyPair = await encryptionService.generateKeyPair(userId);

      expect(keyPair).to.have.property('publicKey');
      expect(keyPair).to.have.property('privateKey');
      expect(keyPair).to.have.property('fingerprint');

      expect(keyPair.publicKey).to.include('BEGIN PUBLIC KEY');
      expect(keyPair.privateKey).to.include('BEGIN PRIVATE KEY');
      expect(keyPair.fingerprint).to.match(/^([0-9A-F]{2}:){31}[0-9A-F]{2}$/);
    });

    it('should generate unique key pairs', async () => {
      const keyPair1 = await encryptionService.generateKeyPair('user1');
      const keyPair2 = await encryptionService.generateKeyPair('user2');

      expect(keyPair1.publicKey).to.not.equal(keyPair2.publicKey);
      expect(keyPair1.privateKey).to.not.equal(keyPair2.privateKey);
      expect(keyPair1.fingerprint).to.not.equal(keyPair2.fingerprint);
    });
  });

  describe('Message Encryption', () => {
    it('should encrypt and decrypt message', async () => {
      const message = {
        content: 'Secret message',
        timestamp: Date.now()
      };

      const senderUserId = 'sender';
      const recipientUserIds = ['recipient1', 'recipient2'];

      // Generate keys for all users
      await encryptionService.generateKeyPair(senderUserId);
      for (const recipientId of recipientUserIds) {
        await encryptionService.generateKeyPair(recipientId);
      }

      // Encrypt message
      const encrypted = await encryptionService.encryptMessage(
        message,
        senderUserId,
        recipientUserIds
      );

      expect(encrypted).to.have.property('encryptedContent');
      expect(encrypted).to.have.property('encryptedKeys');
      expect(encrypted.encryptedKeys).to.have.property(senderUserId);
      expect(encrypted.encryptedKeys).to.have.property('recipient1');
      expect(encrypted.encryptedKeys).to.have.property('recipient2');

      // Decrypt message as recipient
      const decrypted = await encryptionService.decryptMessage(
        encrypted,
        'recipient1'
      );

      expect(decrypted.content).to.equal('Secret message');
      expect(decrypted.timestamp).to.equal(message.timestamp);
    });

    it('should fail decryption with wrong key', async () => {
      const message = { content: 'Secret' };
      
      await encryptionService.generateKeyPair('sender');
      await encryptionService.generateKeyPair('recipient');
      await encryptionService.generateKeyPair('attacker');

      const encrypted = await encryptionService.encryptMessage(
        message,
        'sender',
        ['recipient']
      );

      try {
        await encryptionService.decryptMessage(encrypted, 'attacker');
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.include('No key found');
      }
    });
  });

  describe('Password Hashing', () => {
    it('should hash password', async () => {
      const password = 'SecurePassword123!';
      const hash = await encryptionService.hashPassword(password);

      expect(hash).to.be.a('string');
      expect(hash).to.not.equal(password);
      expect(hash.length).to.be.greaterThan(50);
    });

    it('should verify correct password', async () => {
      const password = 'TestPassword456!';
      const hash = await encryptionService.hashPassword(password);

      const isValid = await encryptionService.verifyPassword(password, hash);
      expect(isValid).to.be.true;
    });

    it('should reject incorrect password', async () => {
      const password = 'CorrectPassword';
      const hash = await encryptionService.hashPassword(password);

      const isValid = await encryptionService.verifyPassword('WrongPassword', hash);
      expect(isValid).to.be.false;
    });

    it('should generate different hashes for same password', async () => {
      const password = 'SamePassword';
      const hash1 = await encryptionService.hashPassword(password);
      const hash2 = await encryptionService.hashPassword(password);

      expect(hash1).to.not.equal(hash2);
    });
  });

  describe('Token Generation', () => {
    it('should generate random token', () => {
      const token1 = encryptionService.generateToken();
      const token2 = encryptionService.generateToken();

      expect(token1).to.be.a('string');
      expect(token1).to.have.lengthOf(64); // 32 bytes as hex
      expect(token1).to.not.equal(token2);
    });

    it('should generate token with custom length', () => {
      const token = encryptionService.generateToken(16);
      expect(token).to.have.lengthOf(32); // 16 bytes as hex
    });

    it('should generate secure JWT-like token', () => {
      const payload = {
        userId: '12345',
        role: 'user',
        exp: Date.now() + 3600000
      };

      const token = encryptionService.generateSecureToken(payload);
      const parts = token.split('.');
      
      expect(parts).to.have.lengthOf(3);
      
      // Verify token
      const decoded = encryptionService.verifySecureToken(token);
      expect(decoded.userId).to.equal(payload.userId);
      expect(decoded.role).to.equal(payload.role);
    });

    it('should reject tampered token', () => {
      const payload = { userId: '12345' };
      const token = encryptionService.generateSecureToken(payload);
      
      // Tamper with token
      const parts = token.split('.');
      parts[1] = Buffer.from(JSON.stringify({ userId: '99999' })).toString('base64url');
      const tamperedToken = parts.join('.');

      try {
        encryptionService.verifySecureToken(tamperedToken);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.include('Invalid token signature');
      }
    });
  });

  describe('Two-Factor Authentication', () => {
    it('should generate 2FA secret and QR code', async () => {
      const userId = 'test-user';
      const result = await encryptionService.generateTwoFactorSecret(userId);

      expect(result).to.have.property('secret');
      expect(result).to.have.property('qrCode');
      expect(result).to.have.property('backupCodes');

      expect(result.secret).to.be.a('string');
      expect(result.qrCode).to.include('data:image/png;base64');
      expect(result.backupCodes).to.be.an('array').with.lengthOf(10);
    });

    it('should verify valid 2FA token', () => {
      const secret = 'JBSWY3DPEHPK3PXP';
      const token = speakeasy.totp({
        secret,
        encoding: 'base32'
      });

      const isValid = encryptionService.verifyTwoFactorToken(token, secret);
      expect(isValid).to.be.true;
    });

    it('should reject invalid 2FA token', () => {
      const secret = 'JBSWY3DPEHPK3PXP';
      const isValid = encryptionService.verifyTwoFactorToken('000000', secret);
      expect(isValid).to.be.false;
    });

    it('should generate unique backup codes', async () => {
      const codes = await encryptionService.generateBackupCodes('user-id');
      const uniqueCodes = new Set(codes);
      
      expect(codes).to.have.lengthOf(10);
      expect(uniqueCodes.size).to.equal(10);
      
      codes.forEach(code => {
        expect(code).to.match(/^[0-9A-F]{8}$/);
      });
    });
  });

  describe('File Encryption', () => {
    it('should encrypt file content', async () => {
      const fileContent = Buffer.from('File content to encrypt');
      const userId = 'test-user';

      // Mock file system
      sandbox.stub(require('fs').promises, 'readFile').resolves(fileContent);
      sandbox.stub(require('fs').promises, 'writeFile').resolves();

      const result = await encryptionService.encryptFile('test.txt', userId);

      expect(result).to.have.property('encryptedFileName');
      expect(result).to.have.property('encryptedFilePath');
      expect(result.encryptedFileName).to.match(/^[0-9a-f]{32}\.enc$/);
    });

    it('should decrypt file content', async () => {
      const originalContent = 'Original file content';
      const encryptedFileName = 'encrypted-file.enc';

      // Mock metadata and file
      const metadata = {
        originalName: 'original.txt',
        key: crypto.randomBytes(32).toString('base64'),
        iv: crypto.randomBytes(16).toString('base64'),
        tag: crypto.randomBytes(16).toString('base64')
      };

      sandbox.stub(redisClient, 'get').resolves(JSON.stringify(metadata));

      // Mock encrypted file
      const cipher = crypto.createCipheriv(
        'aes-256-gcm',
        Buffer.from(metadata.key, 'base64'),
        Buffer.from(metadata.iv, 'base64')
      );
      const encrypted = Buffer.concat([
        cipher.update(originalContent, 'utf8'),
        cipher.final()
      ]);

      sandbox.stub(require('fs').promises, 'readFile').resolves(encrypted);

      const result = await encryptionService.decryptFile(encryptedFileName, 'user-id');

      expect(result.data.toString()).to.equal(originalContent);
      expect(result.originalName).to.equal('original.txt');
    });
  });

  describe('Message Integrity', () => {
    it('should generate HMAC for message', () => {
      const message = { content: 'Test message', timestamp: Date.now() };
      const key = crypto.randomBytes(32);

      const hmac = encryptionService.generateMessageHMAC(message, key);

      expect(hmac).to.be.a('string');
      expect(hmac).to.have.lengthOf(64); // SHA256 hex string
    });

    it('should verify message integrity', () => {
      const message = { content: 'Test message' };
      const key = crypto.randomBytes(32);

      const hmac = encryptionService.generateMessageHMAC(message, key);
      const isValid = encryptionService.verifyMessageIntegrity(message, hmac, key);

      expect(isValid).to.be.true;
    });

    it('should detect tampered message', () => {
      const message = { content: 'Original message' };
      const key = crypto.randomBytes(32);

      const hmac = encryptionService.generateMessageHMAC(message, key);
      
      // Tamper with message
      message.content = 'Tampered message';
      
      const isValid = encryptionService.verifyMessageIntegrity(message, hmac, key);
      expect(isValid).to.be.false;
    });
  });

  describe('Secure Channel', () => {
    it('should establish secure channel between users', async () => {
      const userId1 = 'user1';
      const userId2 = 'user2';

      const channel = await encryptionService.establishSecureChannel(userId1, userId2);

      expect(channel).to.have.property('channelId');
      expect(channel).to.have.property('publicKey1');
      expect(channel).to.have.property('publicKey2');

      expect(channel.channelId).to.equal(`channel:${userId1}:${userId2}`);
      expect(channel.publicKey1).to.be.a('string');
      expect(channel.publicKey2).to.be.a('string');
    });
  });

  describe('Performance', () => {
    it('should encrypt large message efficiently', async function() {
      this.timeout(5000);

      const largeMessage = {
        content: 'x'.repeat(10000),
        data: Array(1000).fill({ id: 1, value: 'test' })
      };

      const startTime = Date.now();
      
      await encryptionService.generateKeyPair('sender');
      await encryptionService.generateKeyPair('recipient');
      
      const encrypted = await encryptionService.encryptMessage(
        largeMessage,
        'sender',
        ['recipient']
      );
      
      const encryptionTime = Date.now() - startTime;
      
      expect(encryptionTime).to.be.lessThan(1000); // Should take less than 1 second
      expect(encrypted).to.have.property('encryptedContent');
    });

    it('should handle concurrent encryption operations', async () => {
      const promises = [];
      
      for (let i = 0; i < 10; i++) {
        promises.push(
          encryptionService.generateKeyPair(`user${i}`).then(keyPair =>
            encryptionService.encryptMessage(
              { content: `Message ${i}` },
              `user${i}`,
              [`user${(i + 1) % 10}`]
            )
          )
        );
      }

      const results = await Promise.all(promises);
      
      expect(results).to.have.lengthOf(10);
      results.forEach(result => {
        expect(result).to.have.property('encryptedContent');
      });
    });
  });
});