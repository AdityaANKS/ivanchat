const crypto = require('crypto');
const webauthn = require('@simplewebauthn/server');

class BiometricAuthService {
  constructor(config) {
    this.config = config;
    this.challenges = new Map();
    this.credentials = new Map(); // In production, use database
    
    this.rpName = config.biometric.rpName || 'SecureChat';
    this.rpID = config.biometric.rpID || 'localhost';
    this.origin = config.biometric.origin || 'http://localhost:3000';
  }

  // WebAuthn Registration
  async generateRegistrationOptions(userId, userName) {
    const user = {
      id: Buffer.from(userId),
      name: userName,
      displayName: userName
    };

    const excludeCredentials = await this.getUserCredentials(userId);

    const options = await webauthn.generateRegistrationOptions({
      rpName: this.rpName,
      rpID: this.rpID,
      userID: user.id,
      userName: user.name,
      userDisplayName: user.displayName,
      attestationType: 'direct',
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
        requireResidentKey: true
      },
      excludeCredentials: excludeCredentials.map(cred => ({
        id: cred.credentialID,
        type: 'public-key',
        transports: cred.transports
      })),
      supportedAlgorithmIDs: [-7, -257], // ES256, RS256
      timeout: 60000
    });

    // Store challenge
    this.challenges.set(userId, {
      challenge: options.challenge,
      type: 'registration',
      timestamp: Date.now()
    });

    return options;
  }

  async verifyRegistration(userId, credential) {
    const challenge = this.challenges.get(userId);
    
    if (!challenge || challenge.type !== 'registration') {
      throw new Error('No registration challenge found');
    }

    const verification = await webauthn.verifyRegistrationResponse({
      response: credential,
      expectedChallenge: challenge.challenge,
      expectedOrigin: this.origin,
      expectedRPID: this.rpID,
      requireUserVerification: true
    });

    if (verification.verified) {
      const { credentialPublicKey, credentialID, counter } = verification.registrationInfo;
      
      // Store credential
      await this.storeCredential(userId, {
        credentialID: Buffer.from(credentialID).toString('base64'),
        publicKey: Buffer.from(credentialPublicKey).toString('base64'),
        counter,
        transports: credential.response.transports || ['internal'],
        deviceType: this.detectDeviceType(credential),
        createdAt: new Date(),
        lastUsed: null,
        name: `${this.detectDeviceType(credential)} - ${new Date().toLocaleDateString()}`
      });

      this.challenges.delete(userId);
      
      return {
        verified: true,
        credentialID: Buffer.from(credentialID).toString('base64')
      };
    }

    throw new Error('Registration verification failed');
  }

  // WebAuthn Authentication
  async generateAuthenticationOptions(userId) {
    const credentials = await this.getUserCredentials(userId);
    
    if (credentials.length === 0) {
      throw new Error('No credentials registered');
    }

    const options = await webauthn.generateAuthenticationOptions({
      rpID: this.rpID,
      allowCredentials: credentials.map(cred => ({
        id: Buffer.from(cred.credentialID, 'base64'),
        type: 'public-key',
        transports: cred.transports
      })),
      userVerification: 'required',
      timeout: 60000
    });

    // Store challenge
    this.challenges.set(userId, {
      challenge: options.challenge,
      type: 'authentication',
      timestamp: Date.now()
    });

    return options;
  }

  async verifyAuthentication(userId, credential) {
    const challenge = this.challenges.get(userId);
    
    if (!challenge || challenge.type !== 'authentication') {
      throw new Error('No authentication challenge found');
    }

    const storedCredential = await this.getCredential(userId, credential.id);
    
    if (!storedCredential) {
      throw new Error('Credential not found');
    }

    const verification = await webauthn.verifyAuthenticationResponse({
      response: credential,
      expectedChallenge: challenge.challenge,
      expectedOrigin: this.origin,
      expectedRPID: this.rpID,
      authenticator: {
        credentialID: Buffer.from(storedCredential.credentialID, 'base64'),
        credentialPublicKey: Buffer.from(storedCredential.publicKey, 'base64'),
        counter: storedCredential.counter
      },
      requireUserVerification: true
    });

    if (verification.verified) {
      // Update counter and last used
      await this.updateCredential(userId, credential.id, {
        counter: verification.authenticationInfo.newCounter,
        lastUsed: new Date()
      });

      this.challenges.delete(userId);
      
      return {
        verified: true,
        credentialID: credential.id
      };
    }

    throw new Error('Authentication verification failed');
  }

  // Fingerprint simulation (for mobile apps)
  async enrollFingerprint(userId, biometricData) {
    // In real implementation, this would interface with device APIs
    const template = this.generateBiometricTemplate(biometricData);
    const encryptedTemplate = await this.encryptTemplate(template);
    
    const enrollment = {
      id: crypto.randomUUID(),
      userId,
      type: 'fingerprint',
      template: encryptedTemplate,
      enrolledAt: new Date(),
      deviceId: biometricData.deviceId,
      quality: this.assessQuality(biometricData)
    };

    await this.storeBiometric(enrollment);
    
    return {
      enrolled: true,
      enrollmentId: enrollment.id,
      quality: enrollment.quality
    };
  }

  async verifyFingerprint(userId, biometricData) {
    const enrollments = await this.getUserBiometrics(userId, 'fingerprint');
    
    for (const enrollment of enrollments) {
      const template = await this.decryptTemplate(enrollment.template);
      const match = this.matchBiometric(biometricData, template);
      
      if (match.score > this.config.biometric.threshold) {
        await this.logBiometricAuth(userId, enrollment.id, true);
        return {
          verified: true,
          enrollmentId: enrollment.id,
          score: match.score
        };
      }
    }

    await this.logBiometricAuth(userId, null, false);
    return { verified: false };
  }

  // Face ID simulation
  async enrollFaceID(userId, faceData) {
    const features = this.extractFaceFeatures(faceData);
    const encryptedFeatures = await this.encryptTemplate(features);
    
    const enrollment = {
      id: crypto.randomUUID(),
      userId,
      type: 'face',
      template: encryptedFeatures,
      enrolledAt: new Date(),
      deviceId: faceData.deviceId,
      metadata: {
        modelVersion: '1.0',
        qualityScore: this.assessFaceQuality(faceData)
      }
    };

    await this.storeBiometric(enrollment);
    
    return {
      enrolled: true,
      enrollmentId: enrollment.id,
      quality: enrollment.metadata.qualityScore
    };
  }

  async verifyFaceID(userId, faceData) {
    const enrollments = await this.getUserBiometrics(userId, 'face');
    
    for (const enrollment of enrollments) {
      const template = await this.decryptTemplate(enrollment.template);
      const match = this.matchFace(faceData, template);
      
      if (match.confidence > 0.95) {
        await this.logBiometricAuth(userId, enrollment.id, true);
        return {
          verified: true,
          enrollmentId: enrollment.id,
          confidence: match.confidence
        };
      }
    }

    await this.logBiometricAuth(userId, null, false);
    return { verified: false };
  }

  // Voice recognition
  async enrollVoice(userId, voiceData) {
    const voiceprint = this.generateVoiceprint(voiceData);
    const encryptedVoiceprint = await this.encryptTemplate(voiceprint);
    
    const enrollment = {
      id: crypto.randomUUID(),
      userId,
      type: 'voice',
      template: encryptedVoiceprint,
      enrolledAt: new Date(),
      passphrase: voiceData.passphrase,
      metadata: {
        sampleRate: voiceData.sampleRate,
        duration: voiceData.duration,
        quality: this.assessVoiceQuality(voiceData)
      }
    };

    await this.storeBiometric(enrollment);
    
    return {
      enrolled: true,
      enrollmentId: enrollment.id,
      quality: enrollment.metadata.quality
    };
  }

  // Template encryption
  async encryptTemplate(template) {
    const key = await this.deriveTemplateKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    
    const encrypted = Buffer.concat([
      cipher.update(JSON.stringify(template)),
      cipher.final()
    ]);
    
    const tag = cipher.getAuthTag();
    
    return {
      data: encrypted.toString('base64'),
      iv: iv.toString('base64'),
      tag: tag.toString('base64')
    };
  }

  async decryptTemplate(encryptedTemplate) {
    const key = await this.deriveTemplateKey();
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      key,
      Buffer.from(encryptedTemplate.iv, 'base64')
    );
    
    decipher.setAuthTag(Buffer.from(encryptedTemplate.tag, 'base64'));
    
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedTemplate.data, 'base64')),
      decipher.final()
    ]);
    
    return JSON.parse(decrypted.toString());
  }

  // Anti-spoofing measures
  async detectLiveness(biometricData) {
    const checks = {
      fingerprint: () => this.checkFingerprintLiveness(biometricData),
      face: () => this.checkFaceLiveness(biometricData),
      voice: () => this.checkVoiceLiveness(biometricData)
    };

    const check = checks[biometricData.type];
    if (!check) {
      throw new Error('Unknown biometric type');
    }

    return check();
  }

  checkFingerprintLiveness(data) {
    // Check for synthetic patterns, temperature, pulse
    const features = {
      temperature: data.temperature || 0,
      pulse: data.pulse || 0,
      pressure: data.pressure || 0,
      moisture: data.moisture || 0
    };

    const score = Object.values(features).reduce((acc, val) => acc + (val > 0 ? 0.25 : 0), 0);
    
    return {
      isLive: score > 0.7,
      confidence: score,
      features
    };
  }

  checkFaceLiveness(data) {
    // Check for blinking, head movement, 3D depth
    const checks = {
      blinkDetected: data.blinkCount > 0,
      headMovement: data.headMovement > 0.1,
      depthData: data.hasDepthData || false,
      textureAnalysis: this.analyzeTexture(data.imageData)
    };

    const score = Object.values(checks).filter(Boolean).length / Object.keys(checks).length;
    
    return {
      isLive: score > 0.75,
      confidence: score,
      checks
    };
  }

  checkVoiceLiveness(data) {
    // Check for recorded audio, background noise patterns
    const features = {
      backgroundNoise: this.analyzeBackgroundNoise(data),
      speechPatterns: this.analyzeSpeechPatterns(data),
      frequencyAnalysis: this.analyzeFrequency(data)
    };

    const score = Object.values(features).reduce((acc, val) => acc + val, 0) / 3;
    
    return {
      isLive: score > 0.8,
      confidence: score,
      features
    };
  }

  // Helper methods
  generateBiometricTemplate(data) {
    // Simplified template generation
    return {
      type: data.type,
      features: crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex'),
      version: '1.0',
      timestamp: Date.now()
    };
  }

  matchBiometric(input, template) {
    // Simplified matching algorithm
    const inputHash = crypto.createHash('sha256').update(JSON.stringify(input)).digest('hex');
    const score = inputHash === template.features ? 1.0 : 0.0;
    return { score };
  }

  extractFaceFeatures(faceData) {
    // Simplified feature extraction
    return {
      landmarks: faceData.landmarks || [],
      descriptors: faceData.descriptors || [],
      embedding: crypto.createHash('sha256').update(JSON.stringify(faceData)).digest('hex')
    };
  }

  matchFace(input, template) {
    // Simplified face matching
    const inputFeatures = this.extractFaceFeatures(input);
    const confidence = inputFeatures.embedding === template.embedding ? 1.0 : 0.0;
    return { confidence };
  }

  generateVoiceprint(voiceData) {
    // Simplified voiceprint generation
    return {
      mfcc: voiceData.mfcc || [],
      pitch: voiceData.pitch || [],
      energy: voiceData.energy || [],
      signature: crypto.createHash('sha256').update(JSON.stringify(voiceData)).digest('hex')
    };
  }

  assessQuality(biometricData) {
    // Quality assessment logic
    return Math.random() * 0.3 + 0.7; // 0.7 - 1.0 range
  }

  assessFaceQuality(faceData) {
    const factors = {
      resolution: faceData.width * faceData.height > 640 * 480 ? 1 : 0.5,
      lighting: faceData.brightness > 0.3 && faceData.brightness < 0.7 ? 1 : 0.5,
      angle: Math.abs(faceData.angle || 0) < 15 ? 1 : 0.5
    };
    
    return Object.values(factors).reduce((a, b) => a + b, 0) / Object.keys(factors).length;
  }

  assessVoiceQuality(voiceData) {
    const factors = {
      duration: voiceData.duration > 2000 ? 1 : 0.5,
      clarity: voiceData.snr > 10 ? 1 : 0.5,
      sampleRate: voiceData.sampleRate >= 16000 ? 1 : 0.5
    };
    
    return Object.values(factors).reduce((a, b) => a + b, 0) / Object.keys(factors).length;
  }

  analyzeTexture(imageData) {
    // Simplified texture analysis for spoof detection
    return Math.random() > 0.2;
  }

  analyzeBackgroundNoise(data) {
    // Simplified noise analysis
    return Math.random() * 0.3 + 0.7;
  }

  analyzeSpeechPatterns(data) {
    // Simplified speech pattern analysis
    return Math.random() * 0.3 + 0.7;
  }

  analyzeFrequency(data) {
    // Simplified frequency analysis
    return Math.random() * 0.3 + 0.7;
  }

  detectDeviceType(credential) {
    const userAgent = credential.userAgent || '';
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('Windows')) return 'Windows Hello';
    return 'Unknown';
  }

  async deriveTemplateKey() {
    // In production, use HSM or secure key storage
    return crypto.scryptSync(this.config.biometric.masterKey || 'default', 'salt', 32);
  }

  // Storage methods (implement based on your database)
  async storeCredential(userId, credential) {
    if (!this.credentials.has(userId)) {
      this.credentials.set(userId, []);
    }
    this.credentials.get(userId).push(credential);
  }

  async getUserCredentials(userId) {
    return this.credentials.get(userId) || [];
  }

  async getCredential(userId, credentialId) {
    const credentials = this.credentials.get(userId) || [];
    return credentials.find(c => c.credentialID === credentialId);
  }

  async updateCredential(userId, credentialId, updates) {
    const credentials = this.credentials.get(userId) || [];
    const index = credentials.findIndex(c => c.credentialID === credentialId);
    if (index !== -1) {
      Object.assign(credentials[index], updates);
    }
  }

  async storeBiometric(enrollment) {
    // Store in database
  }

  async getUserBiometrics(userId, type) {
    // Retrieve from database
    return [];
  }

  async logBiometricAuth(userId, enrollmentId, success) {
    // Log authentication attempt
  }

  // Cleanup
  cleanupChallenges() {
    const now = Date.now();
    const timeout = 5 * 60 * 1000; // 5 minutes

    for (const [userId, challenge] of this.challenges.entries()) {
      if (now - challenge.timestamp > timeout) {
        this.challenges.delete(userId);
      }
    }
  }
}

module.exports = BiometricAuthService;