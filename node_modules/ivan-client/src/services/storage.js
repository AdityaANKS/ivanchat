import CryptoJS from 'crypto-js';

class StorageService {
  constructor() {
    this.prefix = 'ivan_chat_';
    this.encryptionKey = this.getEncryptionKey();
    this.storage = window.localStorage;
    this.sessionStorage = window.sessionStorage;
    this.memoryStorage = new Map();
    this.db = null;
    this.initIndexedDB();
  }

  // Initialize IndexedDB for large data storage
  async initIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(`${this.prefix}db`, 1);

      request.onerror = () => {
        console.error('Failed to open IndexedDB');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create object stores
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache', { keyPath: 'key' });
        }

        if (!db.objectStoreNames.contains('files')) {
          db.createObjectStore('files', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('messages')) {
          const messageStore = db.createObjectStore('messages', { keyPath: 'id' });
          messageStore.createIndex('channelId', 'channelId', { unique: false });
          messageStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  // Get encryption key (should be derived from user credentials in production)
  getEncryptionKey() {
    let key = this.storage.getItem(`${this.prefix}encryption_key`);
    
    if (!key) {
      key = this.generateKey();
      this.storage.setItem(`${this.prefix}encryption_key`, key);
    }
    
    return key;
  }

  // Generate random key
  generateKey() {
    return CryptoJS.lib.WordArray.random(256/8).toString();
  }

  // Encrypt data
  encrypt(data) {
    if (typeof data === 'object') {
      data = JSON.stringify(data);
    }
    return CryptoJS.AES.encrypt(data, this.encryptionKey).toString();
  }

  // Decrypt data
  decrypt(encryptedData) {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
      const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
      
      try {
        return JSON.parse(decryptedStr);
      } catch {
        return decryptedStr;
      }
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }

  // Set item in storage
  setItem(key, value, encrypt = false) {
    const prefixedKey = `${this.prefix}${key}`;
    
    try {
      let data = value;
      
      if (typeof value === 'object') {
        data = JSON.stringify(value);
      }
      
      if (encrypt) {
        data = this.encrypt(data);
      }
      
      this.storage.setItem(prefixedKey, data);
      return true;
    } catch (error) {
      // Handle quota exceeded error
      if (error.name === 'QuotaExceededError') {
        this.clearOldData();
        try {
          this.storage.setItem(prefixedKey, data);
          return true;
        } catch {
          console.error('Storage quota exceeded');
          return false;
        }
      }
      
      console.error('Failed to set item:', error);
      return false;
    }
  }

  // Get item from storage
  getItem(key, decrypt = false) {
    const prefixedKey = `${this.prefix}${key}`;
    
    try {
      let data = this.storage.getItem(prefixedKey);
      
      if (!data) return null;
      
      if (decrypt) {
        data = this.decrypt(data);
      } else {
        try {
          data = JSON.parse(data);
        } catch {
          // Return as is if not JSON
        }
      }
      
      return data;
    } catch (error) {
      console.error('Failed to get item:', error);
      return null;
    }
  }

  // Remove item from storage
  removeItem(key) {
    const prefixedKey = `${this.prefix}${key}`;
    this.storage.removeItem(prefixedKey);
  }

  // Clear all app data
  clear() {
    const keys = Object.keys(this.storage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        this.storage.removeItem(key);
      }
    });
  }

  // Session storage operations
  setSessionItem(key, value) {
    const prefixedKey = `${this.prefix}${key}`;
    
    try {
      const data = typeof value === 'object' ? JSON.stringify(value) : value;
      this.sessionStorage.setItem(prefixedKey, data);
      return true;
    } catch (error) {
      console.error('Failed to set session item:', error);
      return false;
    }
  }

  getSessionItem(key) {
    const prefixedKey = `${this.prefix}${key}`;
    
    try {
      let data = this.sessionStorage.getItem(prefixedKey);
      
      if (!data) return null;
      
      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    } catch (error) {
      console.error('Failed to get session item:', error);
      return null;
    }
  }

  // Memory storage (for sensitive temporary data)
  setMemoryItem(key, value) {
    this.memoryStorage.set(key, value);
  }

  getMemoryItem(key) {
    return this.memoryStorage.get(key);
  }

  removeMemoryItem(key) {
    this.memoryStorage.delete(key);
  }

  // Token management
  setTokens(accessToken, refreshToken, rememberMe = false) {
    if (rememberMe) {
      this.setItem('access_token', accessToken, true);
      this.setItem('refresh_token', refreshToken, true);
    } else {
      this.setSessionItem('access_token', accessToken);
      this.setSessionItem('refresh_token', refreshToken);
    }
  }

  getAccessToken() {
    return this.getSessionItem('access_token') || this.getItem('access_token', true);
  }

  getRefreshToken() {
    return this.getSessionItem('refresh_token') || this.getItem('refresh_token', true);
  }

  clearTokens() {
    this.removeItem('access_token');
    this.removeItem('refresh_token');
    this.sessionStorage.removeItem(`${this.prefix}access_token`);
    this.sessionStorage.removeItem(`${this.prefix}refresh_token`);
  }

  // IndexedDB operations
  async setDBItem(storeName, data) {
    if (!this.db) await this.initIndexedDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getDBItem(storeName, key) {
    if (!this.db) await this.initIndexedDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteDBItem(storeName, key) {
    if (!this.db) await this.initIndexedDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllDBItems(storeName, index = null, query = null) {
    if (!this.db) await this.initIndexedDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      
      let request;
      if (index && query) {
        const idx = store.index(index);
        request = idx.getAll(query);
      } else {
        request = store.getAll();
      }
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Cache management
  async cacheData(key, data, ttl = 3600000) { // Default 1 hour TTL
    const cacheEntry = {
      key,
      data,
      timestamp: Date.now(),
      ttl
    };
    
    await this.setDBItem('cache', cacheEntry);
  }

  async getCachedData(key) {
    const entry = await this.getDBItem('cache', key);
    
    if (!entry) return null;
    
    // Check if cache is expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      await this.deleteDBItem('cache', key);
      return null;
    }
    
    return entry.data;
  }

  // Clear old data when storage is full
  clearOldData() {
    const keys = Object.keys(this.storage);
    const items = [];
    
    keys.forEach(key => {
      if (key.startsWith(this.prefix) && !key.includes('token')) {
        items.push({
          key,
          size: this.storage.getItem(key).length
        });
      }
    });
    
    // Sort by size and remove largest items
    items.sort((a, b) => b.size - a.size);
    
    // Remove top 10% of items
    const toRemove = Math.ceil(items.length * 0.1);
    for (let i = 0; i < toRemove; i++) {
      this.storage.removeItem(items[i].key);
    }
  }

  // Get storage size
  getStorageSize() {
    let size = 0;
    
    Object.keys(this.storage).forEach(key => {
      if (key.startsWith(this.prefix)) {
        size += this.storage.getItem(key).length;
      }
    });
    
    return size;
  }

  // Export all data
  exportData() {
    const data = {};
    
    Object.keys(this.storage).forEach(key => {
      if (key.startsWith(this.prefix)) {
        const cleanKey = key.replace(this.prefix, '');
        data[cleanKey] = this.getItem(cleanKey);
      }
    });
    
    return data;
  }

  // Import data
  importData(data) {
    Object.keys(data).forEach(key => {
      this.setItem(key, data[key]);
    });
  }
}

// Create singleton instance
const storage = new StorageService();

export default storage;