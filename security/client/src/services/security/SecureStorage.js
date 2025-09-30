/**
 * SecureStorage - Client-side encrypted storage service
 * Implements secure local storage with encryption for sensitive data
 */

import CryptoJS from 'crypto-js';

class SecureStorage {
  constructor() {
    this.storageKey = null;
    this.sessionStorage = window.sessionStorage;
    this.localStorage = window.localStorage;
    this.indexedDB = window.indexedDB;
    this.initializeEncryption();
  }

  /**
   * Initialize encryption with derived key
   */
  async initializeEncryption() {
    try {
      // Generate or retrieve storage encryption key
      const storedKey = await this.getStorageKey();
      if (!storedKey) {
        this.storageKey = await this.generateStorageKey();
        await this.saveStorageKey(this.storageKey);
      } else {
        this.storageKey = storedKey;
      }
    } catch (error) {
      console.error('Failed to initialize secure storage:', error);
      throw new Error('Secure storage initialization failed');
    }
  }

  /**
   * Generate a new storage encryption key
   */
  async generateStorageKey() {
    const keyMaterial = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    
    const exported = await crypto.subtle.exportKey('raw', keyMaterial);
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
  }

  /**
   * Save storage key securely
   */
  async saveStorageKey(key) {
    // In production, this should be derived from user credentials
    // or stored in a secure enclave
    const encryptedKey = await this.pbkdf2Derive(key);
    sessionStorage.setItem('__storage_key__', encryptedKey);
  }

  /**
   * Retrieve storage key
   */
  async getStorageKey() {
    return sessionStorage.getItem('__storage_key__');
  }

  /**
   * PBKDF2 key derivation
   */
  async pbkdf2Derive(password, salt = 'ivan-chat-salt', iterations = 100000) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: encoder.encode(salt),
        iterations,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    );

    return btoa(String.fromCharCode(...new Uint8Array(derivedBits)));
  }

  /**
   * Encrypt data before storage
   */
  encrypt(data) {
    if (!this.storageKey) {
      throw new Error('Storage key not initialized');
    }

    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, this.storageKey).toString();
    
    return {
      data: encrypted,
      timestamp: Date.now(),
      version: '1.0',
      algorithm: 'AES-256'
    };
  }

  /**
   * Decrypt stored data
   */
  decrypt(encryptedData) {
    if (!this.storageKey) {
      throw new Error('Storage key not initialized');
    }

    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData.data, this.storageKey);
      const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Store encrypted data in localStorage
   */
  setItem(key, value, options = {}) {
    const encrypted = this.encrypt(value);
    const storageData = {
      ...encrypted,
      ...options,
      key: this.hashKey(key)
    };

    if (options.session) {
      this.sessionStorage.setItem(key, JSON.stringify(storageData));
    } else {
      this.localStorage.setItem(key, JSON.stringify(storageData));
    }

    // Set expiration if specified
    if (options.ttl) {
      setTimeout(() => this.removeItem(key), options.ttl);
    }
  }

  /**
   * Retrieve and decrypt data from storage
   */
  getItem(key, sessionOnly = false) {
    let storageData = null;

    if (sessionOnly) {
      storageData = this.sessionStorage.getItem(key);
    } else {
      storageData = this.localStorage.getItem(key) || this.sessionStorage.getItem(key);
    }

    if (!storageData) return null;

    try {
      const parsed = JSON.parse(storageData);
      
      // Check expiration
      if (parsed.expiresAt && parsed.expiresAt < Date.now()) {
        this.removeItem(key);
        return null;
      }

      return this.decrypt(parsed);
    } catch (error) {
      console.error('Failed to retrieve item:', error);
      return null;
    }
  }

  /**
   * Remove item from storage
   */
  removeItem(key) {
    this.localStorage.removeItem(key);
    this.sessionStorage.removeItem(key);
  }

  /**
   * Clear all encrypted storage
   */
  clear(sessionOnly = false) {
    if (sessionOnly) {
      this.sessionStorage.clear();
    } else {
      this.localStorage.clear();
      this.sessionStorage.clear();
    }
  }

  /**
   * Hash storage keys for privacy
   */
  hashKey(key) {
    return CryptoJS.SHA256(key).toString();
  }

  /**
   * Store encrypted data in IndexedDB for larger datasets
   */
  async setIndexedDBItem(storeName, key, value) {
    const encrypted = this.encrypt(value);
    
    return new Promise((resolve, reject) => {
      const request = this.indexedDB.open('SecureStorage', 1);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        
        const data = {
          id: this.hashKey(key),
          ...encrypted
        };

        const addRequest = store.put(data);
        
        addRequest.onsuccess = () => resolve(true);
        addRequest.onerror = () => reject(new Error('Failed to store in IndexedDB'));
      };

      request.onerror = () => reject(new Error('Failed to open IndexedDB'));
    });
  }

  /**
   * Retrieve encrypted data from IndexedDB
   */
  async getIndexedDBItem(storeName, key) {
    return new Promise((resolve, reject) => {
      const request = this.indexedDB.open('SecureStorage', 1);
      
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        
        const getRequest = store.get(this.hashKey(key));
        
        getRequest.onsuccess = (event) => {
          const result = event.target.result;
          if (result) {
            try {
              const decrypted = this.decrypt(result);
              resolve(decrypted);
            } catch (error) {
              reject(error);
            }
          } else {
            resolve(null);
          }
        };
        
        getRequest.onerror = () => reject(new Error('Failed to retrieve from IndexedDB'));
      };

      request.onerror = () => reject(new Error('Failed to open IndexedDB'));
    });
  }

  /**
   * Secure wipe of all storage
   */
  async secureWipe() {
    // Clear all storage types
    this.clear();
    
    // Clear IndexedDB
    const databases = await this.indexedDB.databases();
    for (const db of databases) {
      await this.indexedDB.deleteDatabase(db.name);
    }
    
    // Reset encryption key
    this.storageKey = null;
    sessionStorage.removeItem('__storage_key__');
  }
}

export default new SecureStorage();