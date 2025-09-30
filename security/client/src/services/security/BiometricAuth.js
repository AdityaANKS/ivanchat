/**
 * BiometricAuth - Biometric authentication service for web
 * Implements fingerprint, face recognition, and other biometric authentication methods
 */

class BiometricAuth {
  constructor() {
    this.isSupported = this.checkSupport();
    this.credentials = new Map();
  }

  /**
   * Check if biometric authentication is supported
   */
  checkSupport() {
    return {
      webauthn: window.PublicKeyCredential !== undefined,
      touchID: this.checkTouchIDSupport(),
      faceID: this.checkFaceIDSupport(),
      fingerprint: 'TouchID' in window || 'FingerprintAuth' in window
    };
  }

  /**
   * Check Touch ID support (Safari)
   */
  checkTouchIDSupport() {
    return window.PublicKeyCredential && 
           navigator.credentials && 
           navigator.userAgent.includes('Safari');
  }

  /**
   * Check Face ID support
   */
  checkFaceIDSupport() {
    return window.PublicKeyCredential && 
           navigator.mediaDevices && 
           navigator.mediaDevices.getUserMedia;
  }

  /**
   * Register biometric credentials
   */
  async register(userId, options = {}) {
    if (!this.isSupported.webauthn) {
      throw new Error('WebAuthn not supported');
    }

    try {
      // Generate challenge
      const challenge = this.generateChallenge();
      
      // Create credential options
      const credentialOptions = {
        publicKey: {
          challenge: challenge,
          rp: {
            name: options.rpName || 'Ivan Chat',
            id: options.rpId || window.location.hostname
          },
          user: {
            id: this.stringToArrayBuffer(userId),
            name: options.userName || userId,
            displayName: options.displayName || userId
          },
          pubKeyCredParams: [
            { alg: -7, type: 'public-key' },  // ES256
            { alg: -257, type: 'public-key' }  // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: options.authenticatorType || 'platform',
            requireResidentKey: options.requireResidentKey || false,
            userVerification: options.userVerification || 'preferred'
          },
          timeout: options.timeout || 60000,
          attestation: options.attestation || 'direct'
        }
      };

      // Create credential
      const credential = await navigator.credentials.create(credentialOptions);
      
      // Store credential
      const credentialData = {
        credentialId: this.arrayBufferToBase64(credential.rawId),
        publicKey: this.arrayBufferToBase64(credential.response.publicKey),
        algorithm: credential.response.publicKeyAlgorithm,
        transports: credential.response.getTransports ? credential.response.getTransports() : [],
        authenticatorData: this.arrayBufferToBase64(credential.response.authenticatorData),
        clientDataJSON: this.arrayBufferToBase64(credential.response.clientDataJSON),
        attestationObject: this.arrayBufferToBase64(credential.response.attestationObject),
        type: credential.type,
        userId: userId,
        createdAt: Date.now()
      };

      // Save credential locally
      this.credentials.set(userId, credentialData);
      
      // Send to server for verification and storage
      return await this.sendCredentialToServer(credentialData);
    } catch (error) {
      console.error('Biometric registration failed:', error);
      throw new Error(`Biometric registration failed: ${error.message}`);
    }
  }

  /**
   * Authenticate using biometrics
   */
  async authenticate(userId, options = {}) {
    if (!this.isSupported.webauthn) {
      throw new Error('WebAuthn not supported');
    }

    try {
      // Get stored credential for user
      const storedCredential = await this.getStoredCredential(userId);
      if (!storedCredential) {
        throw new Error('No biometric credential found for user');
      }

      // Generate challenge
      const challenge = this.generateChallenge();

      // Create assertion options
      const assertionOptions = {
        publicKey: {
          challenge: challenge,
          allowCredentials: [{
            id: this.base64ToArrayBuffer(storedCredential.credentialId),
            type: 'public-key',
            transports: storedCredential.transports || ['internal']
          }],
          userVerification: options.userVerification || 'preferred',
          timeout: options.timeout || 60000,
          rpId: options.rpId || window.location.hostname
        }
      };

      // Get assertion
      const assertion = await navigator.credentials.get(assertionOptions);
      
      // Prepare authentication data
      const authData = {
        credentialId: this.arrayBufferToBase64(assertion.rawId),
        authenticatorData: this.arrayBufferToBase64(assertion.response.authenticatorData),
        clientDataJSON: this.arrayBufferToBase64(assertion.response.clientDataJSON),
        signature: this.arrayBufferToBase64(assertion.response.signature),
        userHandle: assertion.response.userHandle ? 
          this.arrayBufferToBase64(assertion.response.userHandle) : null,
        userId: userId,
        challenge: this.arrayBufferToBase64(challenge)
      };

      // Verify with server
      return await this.verifyAuthentication(authData);
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      throw new Error(`Biometric authentication failed: ${error.message}`);
    }
  }

  /**
   * Check if user has registered biometric credentials
   */
  async hasCredential(userId) {
    try {
      const credential = await this.getStoredCredential(userId);
      return credential !== null;
    } catch {
      return false;
    }
  }

  /**
   * Remove biometric credential
   */
  async removeCredential(userId) {
    try {
      this.credentials.delete(userId);
      
      // Remove from server
      const response = await fetch('/api/biometric/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({ userId })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to remove credential:', error);
      return false;
    }
  }

  /**
   * Generate cryptographic challenge
   */
  generateChallenge() {
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);
    return challenge;
  }

  /**
   * Convert string to ArrayBuffer
   */
  stringToArrayBuffer(str) {
    const encoder = new TextEncoder();
    return encoder.encode(str);
  }

  /**
   * Convert ArrayBuffer to base64
   */
  arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Convert base64 to ArrayBuffer
   */
  base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /**
   * Send credential to server for storage
   */
  async sendCredentialToServer(credentialData) {
    const response = await fetch('/api/biometric/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`
      },
      body: JSON.stringify(credentialData)
    });

    if (!response.ok) {
      throw new Error('Failed to register credential on server');
    }

    return await response.json();
  }

  /**
   * Get stored credential from server
   */
  async getStoredCredential(userId) {
    // Check local cache first
    if (this.credentials.has(userId)) {
      return this.credentials.get(userId);
    }

    // Fetch from server
    const response = await fetch(`/api/biometric/credential/${userId}`, {
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`
      }
    });

    if (!response.ok) {
      return null;
    }

    const credential = await response.json();
    this.credentials.set(userId, credential);
    return credential;
  }

  /**
   * Verify authentication with server
   */
  async verifyAuthentication(authData) {
    const response = await fetch('/api/biometric/authenticate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(authData)
    });

    if (!response.ok) {
      throw new Error('Authentication verification failed');
    }

    return await response.json();
  }

  /**
   * Get authentication token
   */
  getAuthToken() {
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  }

  /**
   * Fallback authentication using device PIN/Pattern
   */
  async authenticateWithDeviceCredential() {
    if (!window.navigator.credentials) {
      throw new Error('Credential API not supported');
    }

    try {
      const credential = await navigator.credentials.get({
        password: true,
        federated: {
          providers: ['https://accounts.google.com']
        },
        mediation: 'required'
      });

      if (credential) {
        return {
          type: credential.type,
          id: credential.id,
          success: true
        };
      }

      throw new Error('No credential selected');
    } catch (error) {
      console.error('Device credential authentication failed:', error);
      throw error;
    }
  }
}

export default new BiometricAuth();