import CryptoJS from 'crypto-js';

class EncryptionService {
  constructor() {
    this.keyPair = null;
    this.sessionKeys = new Map();
    this.publicKeys = new Map();
    this.isInitialized = false;
  }

  // Initialize encryption service
  async initialize() {
    try {
      // Check Web Crypto API support
      if (!window.crypto || !window.crypto.subtle) {
        throw new Error('Web Crypto API not supported');
      }

      // Load or generate key pair
      await this.loadOrGenerateKeyPair();
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize encryption:', error);
      return false;
    }
  }

  // Generate RSA key pair
  async generateKeyPair() {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256'
      },
      true,
      ['encrypt', 'decrypt']
    );

    // Export keys for storage
    const publicKey = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
    const privateKey = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

    return {
      publicKey: this.arrayBufferToBase64(publicKey),
      privateKey: this.arrayBufferToBase64(privateKey),
      publicKeyObject: keyPair.publicKey,
      privateKeyObject: keyPair.privateKey
    };
  }

  // Load or generate key pair
  async loadOrGenerateKeyPair() {
    // Try to load from storage
    const stored = this.loadKeysFromStorage();
    
    if (stored) {
      this.keyPair = await this.importKeyPair(stored);
    } else {
      // Generate new key pair
      const keyPair = await this.generateKeyPair();
      this.saveKeysToStorage(keyPair);
      this.keyPair = keyPair;
    }
  }

  // Import key pair from base64
  async importKeyPair(keys) {
    const publicKeyObject = await window.crypto.subtle.importKey(
      'spki',
      this.base64ToArrayBuffer(keys.publicKey),
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256'
      },
      false,
      ['encrypt']
    );

    const privateKeyObject = await window.crypto.subtle.importKey(
      'pkcs8',
      this.base64ToArrayBuffer(keys.privateKey),
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256'
      },
      false,
      ['decrypt']
    );

    return {
      ...keys,
      publicKeyObject,
      privateKeyObject
    };
  }

  // Generate AES key
  async generateAESKey() {
    const key = await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );

    const exportedKey = await window.crypto.subtle.exportKey('raw', key);
    
    return {
      key,
      exportedKey: this.arrayBufferToBase64(exportedKey)
    };
  }

  // Encrypt message with hybrid encryption
  async encryptMessage(message, recipientPublicKey) {
    try {
      // Generate session key
      const sessionKey = await this.generateAESKey();
      
      // Encrypt message with AES
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encoder = new TextEncoder();
      const messageData = encoder.encode(message);
      
      const encryptedMessage = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv
        },
        sessionKey.key,
        messageData
      );

      // Import recipient's public key if needed
      let publicKeyObject = recipientPublicKey;
      if (typeof recipientPublicKey === 'string') {
        publicKeyObject = await window.crypto.subtle.importKey(
          'spki',
          this.base64ToArrayBuffer(recipientPublicKey),
          {
            name: 'RSA-OAEP',
            hash: 'SHA-256'
          },
          false,
          ['encrypt']
        );
      }

      // Encrypt session key with RSA
      const encryptedSessionKey = await window.crypto.subtle.encrypt(
        {
          name: 'RSA-OAEP'
        },
        publicKeyObject,
        this.base64ToArrayBuffer(sessionKey.exportedKey)
      );

      return {
        encrypted: true,
        message: this.arrayBufferToBase64(encryptedMessage),
        sessionKey: this.arrayBufferToBase64(encryptedSessionKey),
        iv: this.arrayBufferToBase64(iv),
        algorithm: 'AES-GCM-256'
      };
    } catch (error) {
      console.error('Encryption failed:', error);
      throw error;
    }
  }

  // Decrypt message
  async decryptMessage(encryptedData) {
    try {
      // Decrypt session key with RSA
      const decryptedSessionKey = await window.crypto.subtle.decrypt(
        {
          name: 'RSA-OAEP'
        },
        this.keyPair.privateKeyObject,
        this.base64ToArrayBuffer(encryptedData.sessionKey)
      );

      // Import session key
      const sessionKey = await window.crypto.subtle.importKey(
        'raw',
        decryptedSessionKey,
        {
          name: 'AES-GCM',
          length: 256
        },
        false,
        ['decrypt']
      );

      // Decrypt message with AES
      const decryptedMessage = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: this.base64ToArrayBuffer(encryptedData.iv)
        },
        sessionKey,
        this.base64ToArrayBuffer(encryptedData.message)
      );

      const decoder = new TextDecoder();
      return decoder.decode(decryptedMessage);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw error;
    }
  }

  // Sign data
  async signData(data) {
    try {
      // Generate signing key if not exists
      if (!this.signingKey) {
        const keyPair = await window.crypto.subtle.generateKey(
          {
            name: 'ECDSA',
            namedCurve: 'P-256'
          },
          true,
          ['sign', 'verify']
        );
        this.signingKey = keyPair;
      }

      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(JSON.stringify(data));

      const signature = await window.crypto.subtle.sign(
        {
          name: 'ECDSA',
          hash: { name: 'SHA-256' }
        },
        this.signingKey.privateKey,
        dataBuffer
      );

      return {
        data,
        signature: this.arrayBufferToBase64(signature),
        publicKey: await this.exportPublicSigningKey()
      };
    } catch (error) {
      console.error('Failed to sign data:', error);
      throw error;
    }
  }

  // Verify signature
  async verifySignature(signedData) {
    try {
      const publicKey = await this.importPublicSigningKey(signedData.publicKey);
      
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(JSON.stringify(signedData.data));

      const isValid = await window.crypto.subtle.verify(
        {
          name: 'ECDSA',
          hash: { name: 'SHA-256' }
        },
        publicKey,
        this.base64ToArrayBuffer(signedData.signature),
        dataBuffer
      );

      return isValid;
    } catch (error) {
      console.error('Failed to verify signature:', error);
      return false;
    }
  }

  // Export public signing key
  async exportPublicSigningKey() {
    if (!this.signingKey) return null;
    
    const exported = await window.crypto.subtle.exportKey(
      'spki',
      this.signingKey.publicKey
    );
    
    return this.arrayBufferToBase64(exported);
  }

  // Import public signing key
  async importPublicSigningKey(keyData) {
    return await window.crypto.subtle.importKey(
      'spki',
      this.base64ToArrayBuffer(keyData),
      {
        name: 'ECDSA',
        namedCurve: 'P-256'
      },
      false,
      ['verify']
    );
  }

  // Derive key from password (for local encryption)
  async deriveKeyFromPassword(password, salt) {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    
    const importedKey = await window.crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    const derivedKey = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt || window.crypto.getRandomValues(new Uint8Array(16)),
        iterations: 100000,
        hash: 'SHA-256'
      },
      importedKey,
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );

    return derivedKey;
  }

  // Simple encryption with password (for local storage)
  encryptWithPassword(data, password) {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      password
    ).toString();
    
    return encrypted;
  }

  // Simple decryption with password
  decryptWithPassword(encryptedData, password) {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, password);
      return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      console.error('Decryption with password failed:', error);
      return null;
    }
  }

  // Generate hash
  generateHash(data) {
    return CryptoJS.SHA256(JSON.stringify(data)).toString();
  }

  // Helper functions
  arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  base64ToArrayBuffer(base64) {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // Storage operations
  saveKeysToStorage(keys) {
    const encrypted = this.encryptWithPassword(
      {
        publicKey: keys.publicKey,
        privateKey: keys.privateKey
      },
      this.getStoragePassword()
    );
    
    localStorage.setItem('encryption_keys', encrypted);
  }

  loadKeysFromStorage() {
    const encrypted = localStorage.getItem('encryption_keys');
    if (!encrypted) return null;
    
    return this.decryptWithPassword(encrypted, this.getStoragePassword());
  }

  getStoragePassword() {
    // In production, this should be derived from user credentials
    return 'temporary_storage_password';
  }

  // Get public key
  getPublicKey() {
    return this.keyPair?.publicKey;
  }

  // Clear keys
  clearKeys() {
    this.keyPair = null;
    this.sessionKeys.clear();
    this.publicKeys.clear();
    localStorage.removeItem('encryption_keys');
  }
}

// Create singleton instance
const encryptionService = new EncryptionService();

export default encryptionService;