/**
 * SecureWebSocket - Encrypted WebSocket communication service
 * Implements E2EE for real-time messaging
 */

import CryptoJS from 'crypto-js';
import { EventEmitter } from 'events';

class SecureWebSocket extends EventEmitter {
  constructor() {
    super();
    this.ws = null;
    this.url = null;
    this.sessionKey = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.heartbeatInterval = null;
    this.messageQueue = [];
    this.isConnected = false;
    this.encryptionEnabled = true;
    this.messageCounter = 0;
    this.receivedMessages = new Set();
  }

  /**
   * Connect to WebSocket server with encryption
   */
  async connect(url, options = {}) {
    this.url = url;
    
    try {
      // Generate session key for this connection
      this.sessionKey = await this.generateSessionKey();
      
      // Establish WebSocket connection
      this.ws = new WebSocket(url, options.protocols);
      
      // Set up event handlers
      this.setupEventHandlers();
      
      // Wait for connection
      await this.waitForConnection();
      
      // Perform handshake
      await this.performHandshake();
      
      // Start heartbeat
      this.startHeartbeat();
      
      // Process queued messages
      this.processMessageQueue();
      
      return true;
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.handleReconnect();
      throw error;
    }
  }

  /**
   * Set up WebSocket event handlers
   */
  setupEventHandlers() {
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit('open');
    };

    this.ws.onmessage = async (event) => {
      try {
        const message = await this.handleMessage(event.data);
        if (message) {
          this.emit('message', message);
        }
      } catch (error) {
        console.error('Message handling error:', error);
        this.emit('error', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      this.isConnected = false;
      this.stopHeartbeat();
      this.emit('close', event);
      
      if (!event.wasClean) {
        this.handleReconnect();
      }
    };
  }

  /**
   * Wait for connection to establish
   */
  waitForConnection() {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, 10000);

      const checkConnection = () => {
        if (this.ws.readyState === WebSocket.OPEN) {
          clearTimeout(timeout);
          resolve();
        } else if (this.ws.readyState === WebSocket.CLOSED || 
                   this.ws.readyState === WebSocket.CLOSING) {
          clearTimeout(timeout);
          reject(new Error('Connection failed'));
        } else {
          setTimeout(checkConnection, 100);
        }
      };

      checkConnection();
    });
  }

  /**
   * Perform secure handshake
   */
  async performHandshake() {
    // Generate ephemeral key pair
    const keyPair = await this.generateKeyPair();
    
    // Send public key to server
    const handshake = {
      type: 'handshake',
      publicKey: keyPair.publicKey,
      timestamp: Date.now(),
      version: '1.0'
    };

    await this.sendRaw(JSON.stringify(handshake));

    // Wait for server response
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Handshake timeout'));
      }, 5000);

      const handler = (event) => {
        try {
          const response = JSON.parse(event.data);
          if (response.type === 'handshake_response') {
            clearTimeout(timeout);
            this.ws.removeEventListener('message', handler);
            
            // Derive shared secret
            this.deriveSharedSecret(response.serverPublicKey, keyPair.privateKey);
            resolve();
          }
        } catch (error) {
          // Not a handshake response, ignore
        }
      };

      this.ws.addEventListener('message', handler);
    });
  }

  /**
   * Generate session key
   */
  async generateSessionKey() {
    const key = CryptoJS.lib.WordArray.random(256/8);
    return key.toString(CryptoJS.enc.Hex);
  }

  /**
   * Generate ephemeral key pair
   */
  async generateKeyPair() {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'ECDH',
        namedCurve: 'P-256'
      },
      true,
      ['deriveKey']
    );

    const publicKey = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
    
    return {
      publicKey: publicKey,
      privateKey: keyPair.privateKey
    };
  }

  /**
   * Derive shared secret using ECDH
   */
  async deriveSharedSecret(serverPublicKey, privateKey) {
    const publicKey = await crypto.subtle.importKey(
      'jwk',
      serverPublicKey,
      {
        name: 'ECDH',
        namedCurve: 'P-256'
      },
      false,
      []
    );

    const sharedSecret = await crypto.subtle.deriveKey(
      {
        name: 'ECDH',
        public: publicKey
      },
      privateKey,
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );

    const exported = await crypto.subtle.exportKey('raw', sharedSecret);
    this.sessionKey = btoa(String.fromCharCode(...new Uint8Array(exported)));
  }

  /**
   * Send encrypted message
   */
  async send(data) {
    if (!this.isConnected) {
      // Queue message if not connected
      this.messageQueue.push(data);
      return false;
    }

    try {
      const message = {
        id: this.generateMessageId(),
        data: data,
        timestamp: Date.now(),
        counter: ++this.messageCounter
      };

      const encrypted = await this.encrypt(message);
      const packet = {
        type: 'encrypted_message',
        payload: encrypted,
        hmac: this.generateHMAC(encrypted)
      };

      await this.sendRaw(JSON.stringify(packet));
      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  /**
   * Send raw data (unencrypted)
   */
  sendRaw(data) {
    return new Promise((resolve, reject) => {
      if (this.ws.readyState === WebSocket.OPEN) {
        try {
          this.ws.send(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error('WebSocket not connected'));
      }
    });
  }

  /**
   * Handle incoming message
   */
  async handleMessage(rawData) {
    try {
      const packet = JSON.parse(rawData);

      // Handle different message types
      switch (packet.type) {
        case 'encrypted_message':
          return await this.handleEncryptedMessage(packet);
        
        case 'heartbeat':
          this.handleHeartbeat(packet);
          return null;
        
        case 'handshake_response':
          // Already handled in performHandshake
          return null;
        
        default:
          console.warn('Unknown message type:', packet.type);
          return null;
      }
    } catch (error) {
      console.error('Failed to parse message:', error);
      return null;
    }
  }

  /**
   * Handle encrypted message
   */
  async handleEncryptedMessage(packet) {
    // Verify HMAC
    if (!this.verifyHMAC(packet.payload, packet.hmac)) {
      throw new Error('HMAC verification failed');
    }

    // Decrypt message
    const decrypted = await this.decrypt(packet.payload);
    
    // Check for replay attacks
    if (this.receivedMessages.has(decrypted.id)) {
      console.warn('Duplicate message detected:', decrypted.id);
      return null;
    }

    // Add to received messages
    this.receivedMessages.add(decrypted.id);
    
    // Clean old message IDs (keep last 1000)
    if (this.receivedMessages.size > 1000) {
      const toDelete = Array.from(this.receivedMessages).slice(0, -1000);
      toDelete.forEach(id => this.receivedMessages.delete(id));
    }

    return decrypted.data;
  }

  /**
   * Encrypt data
   */
  async encrypt(data) {
    if (!this.encryptionEnabled || !this.sessionKey) {
      return data;
    }

    const jsonString = JSON.stringify(data);
    const iv = CryptoJS.lib.WordArray.random(128/8);
    
    const encrypted = CryptoJS.AES.encrypt(jsonString, this.sessionKey, {
      iv: iv,
      mode: CryptoJS.mode.GCM,
      padding: CryptoJS.pad.Pkcs7
    });

    return {
      ciphertext: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
      iv: iv.toString(CryptoJS.enc.Base64),
      tag: encrypted.tag ? encrypted.tag.toString(CryptoJS.enc.Base64) : null
    };
  }

  /**
   * Decrypt data
   */
  async decrypt(encryptedData) {
    if (!this.encryptionEnabled || !this.sessionKey) {
      return encryptedData;
    }

    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(encryptedData.ciphertext),
      iv: CryptoJS.enc.Base64.parse(encryptedData.iv),
      tag: encryptedData.tag ? CryptoJS.enc.Base64.parse(encryptedData.tag) : undefined
    });

    const decrypted = CryptoJS.AES.decrypt(cipherParams, this.sessionKey, {
      iv: cipherParams.iv,
      mode: CryptoJS.mode.GCM,
      padding: CryptoJS.pad.Pkcs7
    });

    const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(jsonString);
  }

  /**
   * Generate HMAC for message integrity
   */
  generateHMAC(data) {
    const message = typeof data === 'string' ? data : JSON.stringify(data);
    return CryptoJS.HmacSHA256(message, this.sessionKey).toString(CryptoJS.enc.Hex);
  }

  /**
   * Verify HMAC
   */
  verifyHMAC(data, hmac) {
    const calculatedHmac = this.generateHMAC(data);
    return calculatedHmac === hmac;
  }

  /**
   * Generate unique message ID
   */
  generateMessageId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Start heartbeat mechanism
   */
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected) {
        this.sendRaw(JSON.stringify({
          type: 'heartbeat',
          timestamp: Date.now()
        }));
      }
    }, 30000); // Send heartbeat every 30 seconds
  }

  /**
   * Stop heartbeat
   */
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Handle heartbeat response
   */
  handleHeartbeat(packet) {
    // Update last activity time
    this.lastActivity = packet.timestamp;
  }

  /**
   * Process queued messages
   */
  async processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      await this.send(message);
    }
  }

  /**
   * Handle reconnection
   */
  handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.emit('max_reconnect_failed');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting reconnect ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);
    
    setTimeout(() => {
      this.connect(this.url).catch(error => {
        console.error('Reconnection failed:', error);
      });
    }, delay);
  }

  /**
   * Close WebSocket connection
   */
  close(code = 1000, reason = 'Normal closure') {
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close(code, reason);
      this.ws = null;
    }
    
    this.isConnected = false;
    this.sessionKey = null;
    this.messageQueue = [];
    this.receivedMessages.clear();
  }

  /**
   * Get connection state
   */
  getState() {
    return {
      connected: this.isConnected,
      readyState: this.ws ? this.ws.readyState : WebSocket.CLOSED,
      url: this.url,
      reconnectAttempts: this.reconnectAttempts,
      queuedMessages: this.messageQueue.length,
      encryptionEnabled: this.encryptionEnabled
    };
  }
}

export default SecureWebSocket;