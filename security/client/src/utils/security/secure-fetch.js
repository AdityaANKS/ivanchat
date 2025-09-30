/**
 * Secure fetch wrapper with comprehensive security features
 * Implements encryption, authentication, retry logic, and caching
 */

import CryptoJS from 'crypto-js';

class SecureFetch {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || window.location.origin;
    this.timeout = 30000;
    this.maxRetries = 3;
    this.retryDelay = 1000;
    this.cache = new Map();
    this.pendingRequests = new Map();
    this.interceptors = {
      request: [],
      response: [],
      error: []
    };
    this.csrfToken = null;
    this.refreshTokenPromise = null;
  }

  /**
   * Configure secure fetch
   */
  configure(options = {}) {
    if (options.baseURL) this.baseURL = options.baseURL;
    if (options.timeout) this.timeout = options.timeout;
    if (options.maxRetries) this.maxRetries = options.maxRetries;
    if (options.retryDelay) this.retryDelay = options.retryDelay;
    if (options.csrfToken) this.csrfToken = options.csrfToken;
  }

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor);
    return () => {
      const index = this.interceptors.request.indexOf(interceptor);
      if (index !== -1) this.interceptors.request.splice(index, 1);
    };
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor);
    return () => {
      const index = this.interceptors.response.indexOf(interceptor);
      if (index !== -1) this.interceptors.response.splice(index, 1);
    };
  }

  /**
   * Add error interceptor
   */
  addErrorInterceptor(interceptor) {
    this.interceptors.error.push(interceptor);
    return () => {
      const index = this.interceptors.error.indexOf(interceptor);
      if (index !== -1) this.interceptors.error.splice(index, 1);
    };
  }

  /**
   * Get authentication headers
   */
  getAuthHeaders() {
    const headers = {};
    
    // Add authentication token
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Add CSRF token
    if (this.csrfToken) {
      headers['X-CSRF-Token'] = this.csrfToken;
    }

    // Add security headers
    headers['X-Request-ID'] = this.generateRequestId();
    headers['X-Timestamp'] = Date.now().toString();
    headers['X-Client-Version'] = process.env.REACT_APP_VERSION || '1.0.0';
    headers['X-Client-Platform'] = this.getClientPlatform();

    return headers;
  }

  /**
   * Get auth token from storage
   */
  getAuthToken() {
    // Try session storage first (more secure for sensitive tokens)
    let token = sessionStorage.getItem('auth_token');
    
    // Fall back to local storage if remember me is enabled
    if (!token) {
      token = localStorage.getItem('auth_token');
    }

    return token;
  }

  /**
   * Get refresh token
   */
  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }

  /**
   * Set auth tokens
   */
  setAuthTokens(accessToken, refreshToken, rememberMe = false) {
    if (rememberMe) {
      localStorage.setItem('auth_token', accessToken);
      if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
    } else {
      sessionStorage.setItem('auth_token', accessToken);
      if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
    }
  }

  /**
   * Clear auth tokens
   */
  clearAuthTokens() {
    sessionStorage.removeItem('auth_token');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }

  /**
   * Generate request ID
   */
  generateRequestId() {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substr(2, 9);
    return `${timestamp}-${randomStr}`;
  }

  /**
   * Get client platform
   */
  getClientPlatform() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/android/.test(userAgent)) return 'android';
    if (/iphone|ipad|ipod/.test(userAgent)) return 'ios';
    if (/windows/.test(userAgent)) return 'windows';
    if (/mac/.test(userAgent)) return 'macos';
    if (/linux/.test(userAgent)) return 'linux';
    return 'web';
  }

  /**
   * Get encryption key
   */
  async getEncryptionKey() {
    // In production, this should be negotiated with the server
    let key = sessionStorage.getItem('encryption_key');
    
    if (!key) {
      // Generate temporary key for session
      key = CryptoJS.lib.WordArray.random(256/8).toString();
      sessionStorage.setItem('encryption_key', key);
    }

    return key;
  }

  /**
   * Encrypt request data
   */
  async encryptData(data) {
    const key = await this.getEncryptionKey();
    const iv = CryptoJS.lib.WordArray.random(128/8);
    
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return {
      encrypted: true,
      data: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
      iv: iv.toString(CryptoJS.enc.Base64),
      hmac: CryptoJS.HmacSHA256(encrypted.ciphertext.toString(), key).toString()
    };
  }

  /**
   * Decrypt response data
   */
  async decryptData(encryptedData) {
    const key = await this.getEncryptionKey();
    
    // Verify HMAC
    const calculatedHmac = CryptoJS.HmacSHA256(encryptedData.data, key).toString();
    if (calculatedHmac !== encryptedData.hmac) {
      throw new Error('Data integrity check failed');
    }

    const decrypted = CryptoJS.AES.decrypt(
      {
        ciphertext: CryptoJS.enc.Base64.parse(encryptedData.data)
      },
      key,
      {
        iv: CryptoJS.enc.Base64.parse(encryptedData.iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );

    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken() {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    this.refreshTokenPromise = fetch(`${this.baseURL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Token refresh failed');
      }
      return response.json();
    })
    .then(data => {
      this.setAuthTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    })
    .finally(() => {
      this.refreshTokenPromise = null;
    });

    return this.refreshTokenPromise;
  }

  /**
   * Execute fetch with retries and interceptors
   */
  async executeFetch(url, options = {}) {
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    let attempt = 0;
    let lastError;

    // Check cache for GET requests
    if (options.method === 'GET' && options.cache !== false) {
      const cached = this.getFromCache(fullUrl);
      if (cached) {
        return cached;
      }
    }

    // Prevent duplicate requests
    const requestKey = `${options.method || 'GET'}-${fullUrl}`;
    if (this.pendingRequests.has(requestKey)) {
      return this.pendingRequests.get(requestKey);
    }

    const requestPromise = (async () => {
      while (attempt < this.maxRetries) {
        attempt++;

        try {
          // Prepare request
          let requestOptions = { ...options };
          
          // Apply request interceptors
          for (const interceptor of this.interceptors.request) {
            requestOptions = await interceptor(requestOptions) || requestOptions;
          }

          // Add default headers
          requestOptions.headers = {
            'Content-Type': 'application/json',
            ...this.getAuthHeaders(),
            ...requestOptions.headers
          };

          // Encrypt body if specified
          if (requestOptions.body && requestOptions.encrypt) {
            const encrypted = await this.encryptData(requestOptions.body);
            requestOptions.body = JSON.stringify(encrypted);
            requestOptions.headers['X-Encrypted'] = 'true';
          } else if (requestOptions.body && typeof requestOptions.body === 'object') {
            requestOptions.body = JSON.stringify(requestOptions.body);
          }

          // Set timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), this.timeout);
          requestOptions.signal = controller.signal;

          // Execute request
          let response = await fetch(fullUrl, requestOptions);
          clearTimeout(timeoutId);

          // Handle 401 - try refresh token
          if (response.status === 401 && !options.skipRefresh) {
            try {
              await this.refreshAccessToken();
              // Retry with new token
              requestOptions.headers['Authorization'] = `Bearer ${this.getAuthToken()}`;
              response = await fetch(fullUrl, requestOptions);
            } catch (refreshError) {
              // Refresh failed, redirect to login
              this.clearAuthTokens();
              window.location.href = '/login';
              throw refreshError;
            }
          }

          // Apply response interceptors
          for (const interceptor of this.interceptors.response) {
            response = await interceptor(response) || response;
          }

          // Handle response
          const result = await this.handleResponse(response, requestOptions);
          
          // Cache successful GET requests
          if (options.method === 'GET' && response.ok && options.cache !== false) {
            this.addToCache(fullUrl, result, options.cacheTime);
          }

          return result;

        } catch (error) {
          lastError = error;

          // Apply error interceptors
          for (const interceptor of this.interceptors.error) {
            const handled = await interceptor(error);
            if (handled === false) throw error;
          }

          // Don't retry on client errors (4xx)
          if (error.status >= 400 && error.status < 500) {
            throw error;
          }

          // Don't retry on abort
          if (error.name === 'AbortError') {
            throw new Error('Request timeout');
          }

          // Wait before retry with exponential backoff
          if (attempt < this.maxRetries) {
            const delay = this.retryDelay * Math.pow(2, attempt - 1);
            await this.sleep(delay);
          }
        }
      }

      throw lastError || new Error('Request failed after retries');
    })();

    // Store pending request
    this.pendingRequests.set(requestKey, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      // Remove from pending
      this.pendingRequests.delete(requestKey);
    }
  }

  /**
   * Handle response
   */
  async handleResponse(response, options = {}) {
    // Check response status
    if (!response.ok) {
      const error = await this.parseError(response);
      error.status = response.status;
      error.statusText = response.statusText;
      throw error;
    }

    // Parse response based on content type
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      
      // Decrypt if encrypted
      if (data.encrypted && options.decrypt !== false) {
        data = await this.decryptData(data);
      }
    } else if (contentType && contentType.includes('text')) {
      data = await response.text();
    } else if (contentType && contentType.includes('blob')) {
      data = await response.blob();
    } else {
      data = await response.arrayBuffer();
    }

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      ok: response.ok
    };
  }

  /**
   * Parse error response
   */
  async parseError(response) {
    const contentType = response.headers.get('content-type');
    let errorData;

    try {
      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json();
      } else {
        errorData = { message: await response.text() };
      }
    } catch {
      errorData = { message: 'An error occurred' };
    }

    const error = new Error(errorData.message || errorData.error || response.statusText);
    error.data = errorData;
    error.code = errorData.code;
    
    return error;
  }

  /**
   * Cache management
   */
  addToCache(key, data, ttl = 300000) { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });

    // Clean old cache entries
    this.cleanCache();
  }

  getFromCache(key) {
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    const age = Date.now() - cached.timestamp;
    if (age > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  cleanCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > value.ttl) {
        this.cache.delete(key);
      }
    }
  }

  clearCache() {
    this.cache.clear();
  }

  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * HTTP methods
   */
  async get(url, options = {}) {
    return this.executeFetch(url, {
      ...options,
      method: 'GET'
    });
  }

  async post(url, data, options = {}) {
    return this.executeFetch(url, {
      ...options,
      method: 'POST',
      body: data
    });
  }

  async put(url, data, options = {}) {
    return this.executeFetch(url, {
      ...options,
      method: 'PUT',
      body: data
    });
  }

  async patch(url, data, options = {}) {
    return this.executeFetch(url, {
      ...options,
      method: 'PATCH',
      body: data
    });
  }

  async delete(url, options = {}) {
    return this.executeFetch(url, {
      ...options,
      method: 'DELETE'
    });
  }

  /**
   * File upload with progress
   */
  async uploadFile(url, file, options = {}) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();

      // Add file
      if (options.encrypt) {
        // Encrypt file before upload
        this.encryptFile(file).then(encryptedFile => {
          formData.append('file', encryptedFile);
          formData.append('encrypted', 'true');
          this.performUpload(xhr, url, formData, options, resolve, reject);
        }).catch(reject);
      } else {
        formData.append('file', file);
        this.performUpload(xhr, url, formData, options, resolve, reject);
      }
    });
  }

  /**
   * Perform file upload
   */
  performUpload(xhr, url, formData, options, resolve, reject) {
    // Add additional fields
    if (options.data) {
      Object.entries(options.data).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    // Progress tracking
    if (options.onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          options.onProgress({
            loaded: e.loaded,
            total: e.total,
            percent: Math.round(percentComplete)
          });
        }
      });
    }

    // Handle completion
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch {
          resolve(xhr.responseText);
        }
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`));
      }
    });

    // Handle errors
    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload aborted'));
    });

    // Open and send
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    xhr.open('POST', fullUrl);

    // Add headers
    const headers = this.getAuthHeaders();
    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });

    xhr.send(formData);

    // Return abort function
    if (options.onAbort) {
      options.onAbort(() => xhr.abort());
    }
  }

  /**
   * Encrypt file
   */
  async encryptFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
          const key = await this.getEncryptionKey();
          
          const encrypted = CryptoJS.AES.encrypt(wordArray, key);
          const encryptedBlob = new Blob([encrypted.toString()], { type: 'application/octet-stream' });
          
          resolve(new File([encryptedBlob], file.name + '.encrypted', {
            type: 'application/octet-stream'
          }));
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Download file with decryption
   */
  async downloadFile(url, options = {}) {
    const response = await this.get(url, {
      ...options,
      responseType: 'blob'
    });

    if (options.decrypt && response.data) {
      // Decrypt file
      const decrypted = await this.decryptFile(response.data);
      return decrypted;
    }

    return response.data;
  }

  /**
   * Decrypt file
   */
  async decryptFile(encryptedBlob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const encryptedData = e.target.result;
          const key = await this.getEncryptionKey();
          
          const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
          const wordArray = decrypted.toString(CryptoJS.enc.Base64);
          
          // Convert to blob
          const byteCharacters = atob(wordArray);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          
          resolve(new Blob([byteArray]));
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = reject;
      reader.readAsText(encryptedBlob);
    });
  }

  /**
   * Batch requests
   */
  async batch(requests) {
    const promises = requests.map(request => {
      const { method = 'GET', url, data, ...options } = request;
      
      switch (method.toUpperCase()) {
        case 'GET':
          return this.get(url, options);
        case 'POST':
          return this.post(url, data, options);
        case 'PUT':
          return this.put(url, data, options);
        case 'PATCH':
          return this.patch(url, data, options);
        case 'DELETE':
          return this.delete(url, options);
        default:
          return Promise.reject(new Error(`Unknown method: ${method}`));
      }
    });

    return Promise.all(promises);
  }

  /**
   * GraphQL request
   */
  async graphql(query, variables = {}, options = {}) {
    return this.post('/graphql', {
      query,
      variables
    }, options);
  }

  /**
   * WebSocket connection with authentication
   */
  createWebSocket(url, options = {}) {
    const fullUrl = url.startsWith('ws') ? url : `${this.baseURL.replace(/^http/, 'ws')}${url}`;
    const token = this.getAuthToken();
    
    // Add token to URL or protocol
    let wsUrl = fullUrl;
    if (token) {
      const separator = wsUrl.includes('?') ? '&' : '?';
      wsUrl = `${wsUrl}${separator}token=${token}`;
    }

    const ws = new WebSocket(wsUrl, options.protocols);
    
    // Add event handlers
    if (options.onOpen) ws.addEventListener('open', options.onOpen);
    if (options.onMessage) ws.addEventListener('message', options.onMessage);
    if (options.onError) ws.addEventListener('error', options.onError);
    if (options.onClose) ws.addEventListener('close', options.onClose);

    return ws;
  }
}

// Create and export singleton instance
const secureFetch = new SecureFetch();

// Export both instance and class
export default secureFetch;
export { SecureFetch };