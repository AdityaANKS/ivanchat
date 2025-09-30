import * as openpgp from 'openpgp';
import nacl from 'tweetnacl';
import util from 'tweetnacl-util';
import CryptoJS from 'crypto-js';

class ClientEncryption {
  constructor() {
    this.keyPair = null;
    this.sessionKeys = new Map();
    this.masterKey = null;
    this.initialized = false;
  }

  /**
   * Initialize client-side encryption
   */
  async initialize() {
    if (this.initialized) return;

    try {
      // Generate or retrieve master key
      this.masterKey = await this.getMasterKey();
      
      // Generate or retrieve key pair
      const stored = await this.getSecureItem('encryptionKeys');
      
      if (stored) {
        this.keyPair = stored;
      } else {
        this.keyPair = await this.generateKeyPair();
        await this.setSecureItem('encryptionKeys', this.keyPair);
      }
      
      this.initialized = true;
      return this.keyPair.publicKey;
    } catch (error) {
      console.error('Encryption initialization error:', error);
      throw new Error('Failed to initialize encryption');
    }
  }

  /**
   * Generate key pair for E2E encryption
   */
  async generateKeyPair() {
    const { publicKey, privateKey } = await openpgp.generateKey({
      type: 'ecc',
      curve: 'curve25519',
      userIDs: [{ 
        name: 'User',
        email: `user@ivan.chat`
      }],
      format: 'armored',
      passphrase: this.masterKey
    });
    
    return { publicKey, privateKey };
  }

  /**
   * Get or generate master key
   */
  async getMasterKey() {
    // Try to get from secure storage
    let masterKey = await this.getSecureItem('masterKey', false);
    
    if (!masterKey) {
      // Generate new master key
      masterKey = util.encodeBase64(nacl.randomBytes(32));
      await this.setSecureItem('masterKey', masterKey, false);
    }
    
    return masterKey;
  }

  /**
   * Encrypt message before sending
   */
  async encryptMessage(message, recipientPublicKey) {
    try {
      const encrypted = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: message }),
        encryptionKeys: await openpgp.readKey({ 
          armoredKey: recipientPublicKey 
        }),
        signingKeys: await openpgp.readPrivateKey({ 
          armoredKey: this.keyPair.privateKey,
          passphrase: this.masterKey
        }),
        format: 'armored'
      });
      
      return {
        data: encrypted,
        timestamp: Date.now(),
        version: '1.0'
      };
    } catch (error) {
      console.error('Message encryption error:', error);
      throw new Error('Failed to encrypt message');
    }
  }

  /**
   * Decrypt received message
   */
  async decryptMessage(encryptedMessage, senderPublicKey) {
    try {
      const message = await openpgp.readMessage({
        armoredMessage: encryptedMessage.data
      });
      
      const { data: decrypted, signatures } = await openpgp.decrypt({
        message,
        verificationKeys: await openpgp.readKey({ 
          armoredKey: senderPublicKey 
        }),
        decryptionKeys: await openpgp.readPrivateKey({ 
          armoredKey: this.keyPair.privateKey,
          passphrase: this.masterKey
        })
      });
      
      // Verify signature
      const signatureValid = signatures.length > 0 && 
                            await signatures[0].verified;
      
      if (!signatureValid) {
        console.warn('Message signature verification failed');
      }
      
      return {
        data: decrypted,
        signatureValid,
        timestamp: encryptedMessage.timestamp
      };
    } catch (error) {
      console.error('Message decryption error:', error);
      throw new Error('Failed to decrypt message');
    }
  }

  /**
   * Encrypt file before upload
   */
  async encryptFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const fileData = new Uint8Array(e.target.result);
          
          // Generate random key for this file
          const key = nacl.randomBytes(nacl.secretbox.keyLength);
          const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
          
          // Encrypt file data
          const encrypted = nacl.secretbox(fileData, nonce, key);
          
          // Create encrypted file object
          const encryptedFile = {
            name: await this.encryptString(file.name),
            type: file.type,
            size: file.size,
            data: util.encodeBase64(encrypted),
            nonce: util.encodeBase64(nonce),
            key: util.encodeBase64(key),
            checksum: await this.calculateChecksum(fileData),
            timestamp: Date.now()
          };
          
          resolve(encryptedFile);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Decrypt downloaded file
   */
  async decryptFile(encryptedFile) {
    try {
      const encrypted = util.decodeBase64(encryptedFile.data);
      const nonce = util.decodeBase64(encryptedFile.nonce);
      const key = util.decodeBase64(encryptedFile.key);
      
      // Decrypt file data
      const decrypted = nacl.secretbox.open(encrypted, nonce, key);
      
      if (!decrypted) {
        throw new Error('Failed to decrypt file');
      }
      
      // Verify checksum
      const checksum = await this.calculateChecksum(decrypted);
      if (checksum !== encryptedFile.checksum) {
        throw new Error('File integrity check failed');
      }
      
      // Decrypt filename
      const filename = await this.decryptString(encryptedFile.name);
      
      // Create blob
      const blob = new Blob([decrypted], { type: encryptedFile.type });
      
      return {
        blob,
        filename,
        type: encryptedFile.type,
        size: encryptedFile.size
      };
    } catch (error) {
      console.error('File decryption error:', error);
      throw new Error('Failed to decrypt file');
    }
  }

  /**
   * Encrypt string using AES
   */
  async encryptString(str) {
    const encrypted = CryptoJS.AES.encrypt(str, this.masterKey);
    return encrypted.toString();
  }

  /**
   * Decrypt string using AES
   */
  async decryptString(encryptedStr) {
    const decrypted = CryptoJS.AES.decrypt(encryptedStr, this.masterKey);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  /**
   * Calculate checksum for integrity verification
   */
  async calculateChecksum(data) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generate session key for perfect forward secrecy
   */
  generateSessionKey(userId) {
    const key = nacl.randomBytes(32);
    this.sessionKeys.set(userId, key);
    
    // Rotate session key after some time
    setTimeout(() => {
      this.sessionKeys.delete(userId);
    }, 3600000); // 1 hour
    
    return util.encodeBase64(key);
  }

  /**
   * Derive shared secret using ECDH
   */
  async deriveSharedSecret(publicKey, privateKey) {
    const sharedSecret = nacl.box.before(
      util.decodeBase64(publicKey),
      util.decodeBase64(privateKey)
    );
    
    return util.encodeBase64(sharedSecret);
  }

  /**
   * Secure storage with encryption
   */
  async setSecureItem(key, value, encrypt = true) {
    try {
      let data = value;
      
      if (encrypt && this.masterKey) {
        data = await this.encryptString(JSON.stringify(value));
      }
      
      // Try IndexedDB first, fallback to localStorage
      if (window.indexedDB) {
        await this.setIndexedDBItem(key, data);
      } else {
        localStorage.setItem(`secure_${key}`, data);
      }
    } catch (error) {
      console.error('Secure storage error:', error);
      throw error;
    }
  }

  /**
   * Get item from secure storage
   */
  async getSecureItem(key, decrypt = true) {
    try {
      let data;
      
      // Try IndexedDB first, fallback to localStorage
      if (window.indexedDB) {
        data = await this.getIndexedDBItem(key);
      } else {
        data = localStorage.getItem(`secure_${key}`);
      }
      
      if (!data) return null;
      
      if (decrypt && this.masterKey) {
        const decrypted = await this.decryptString(data);
        return JSON.parse(decrypted);
      }
      
      return data;
    } catch (error) {
      console.error('Secure storage retrieval error:', error);
      return null;
    }
  }

  /**
   * IndexedDB operations for secure storage
   */
  async setIndexedDBItem(key, value) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('SecureStorage', 1);
      
      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['secure'], 'readwrite');
        const store = transaction.objectStore('secure');
        const putRequest = store.put({ key, value });
        
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('secure')) {
          db.createObjectStore('secure', { keyPath: 'key' });
        }
      };
    });
  }

  async getIndexedDBItem(key) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('SecureStorage', 1);
      
      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['secure'], 'readonly');
        const store = transaction.objectStore('secure');
        const getRequest = store.get(key);
        
        getRequest.onsuccess = () => {
          resolve(getRequest.result?.value || null);
        };
        getRequest.onerror = () => reject(getRequest.error);
      };
    });
  }

  /**
   * Clear sensitive data from memory
   */
  clearSensitiveData() {
    // Clear keys
    this.keyPair = null;
    this.masterKey = null;
    this.sessionKeys.clear();
    
    // Clear storage
    if (window.indexedDB) {
      indexedDB.deleteDatabase('SecureStorage');
    }
    
    // Clear localStorage
    Object.keys(localStorage)
      .filter(key => key.startsWith('secure_'))
      .forEach(key => localStorage.removeItem(key));
    
    // Clear session storage
    sessionStorage.clear();
    
    this.initialized = false;
  }

  /**
   * Encrypt data for local storage
   */
  encryptForStorage(data) {
    if (!this.masterKey) {
      throw new Error('Master key not initialized');
    }
    
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      this.masterKey
    );
    
    return encrypted.toString();
  }

  /**
   * Decrypt data from local storage
   */
  decryptFromStorage(encryptedData) {
    if (!this.masterKey) {
      throw new Error('Master key not initialized');
    }
    
    const decrypted = CryptoJS.AES.decrypt(encryptedData, this.masterKey);
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  }
}

export default new ClientEncryption();