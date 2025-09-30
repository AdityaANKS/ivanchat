import axios from 'axios';
import storage from './storage';
import config from '../config/env';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((request) => {
  const token = localStorage.getItem(config.auth.tokenKey);
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

// Request queue for offline support
let requestQueue = [];
let isRefreshing = false;
let failedQueue = [];

// Process queued requests
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const accessToken = storage.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Add request ID for tracking
    config.headers['X-Request-ID'] = generateRequestId();

    // Add client version
    config.headers['X-Client-Version'] = import.meta.env.VITE_APP_VERSION || '1.0.0';

    // Handle file uploads
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    // Add timestamp to prevent caching for GET requests
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Handle pagination metadata
    if (response.headers['x-total-count']) {
      response.data._metadata = {
        totalCount: parseInt(response.headers['x-total-count']),
        page: parseInt(response.headers['x-page'] || 1),
        pageSize: parseInt(response.headers['x-page-size'] || 20)
      };
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors
    if (!error.response) {
      // Store request for retry when online
      if (originalRequest && !originalRequest._retry) {
        requestQueue.push(originalRequest);
        return Promise.reject(new Error('Network error. Request queued for retry.'));
      }
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = storage.getRefreshToken();
      
      if (!refreshToken) {
        isRefreshing = false;
        storage.clearTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await refreshAccessToken(refreshToken);
        const { accessToken } = response.data;
        
        storage.setAccessToken(accessToken);
        processQueue(null, accessToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        storage.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle rate limiting
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'] || 5;
      
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(api(originalRequest));
        }, retryAfter * 1000);
      });
    }

    // Enhanced error object
    if (error.response) {
      const enhancedError = new Error(
        error.response.data?.message || 
        error.response.data?.error || 
        'An error occurred'
      );
      enhancedError.status = error.response.status;
      enhancedError.data = error.response.data;
      enhancedError.headers = error.response.headers;
      
      return Promise.reject(enhancedError);
    }

    return Promise.reject(error);
  }
);

// Helper function to refresh access token
const refreshAccessToken = async (refreshToken) => {
  return api.post('/auth/refresh', { refreshToken }, {
    _retry: true // Skip retry logic for refresh endpoint
  });
};

// Generate unique request ID
const generateRequestId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Retry failed requests when coming back online
if (typeof window !== 'undefined') {
  window.addEventListener('online', async () => {
    console.log('Connection restored. Retrying queued requests...');
    
    const queue = [...requestQueue];
    requestQueue = [];
    
    for (const request of queue) {
      try {
        await api(request);
      } catch (error) {
        console.error('Failed to retry request:', error);
      }
    }
  });
}

// API methods wrapper with built-in error handling
const apiWrapper = {
  // Authentication
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout'),
    refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
    verifyEmail: (token) => api.post('/auth/verify-email', { token }),
    changePassword: (data) => api.post('/auth/change-password', data),
    enable2FA: () => api.post('/auth/2fa/enable'),
    verify2FA: (code) => api.post('/auth/2fa/verify', { code }),
    disable2FA: (code) => api.post('/auth/2fa/disable', { code })
  },

  // Users
  users: {
    getProfile: (userId) => api.get(`/users/${userId}/profile`),
    updateProfile: (data) => api.put('/users/profile', data),
    uploadAvatar: (file) => {
      const formData = new FormData();
      formData.append('avatar', file);
      return api.post('/users/avatar', formData);
    },
    getSettings: () => api.get('/users/settings'),
    updateSettings: (settings) => api.put('/users/settings', settings),
    searchUsers: (query) => api.get('/users/search', { params: { q: query } }),
    blockUser: (userId) => api.post(`/users/${userId}/block`),
    unblockUser: (userId) => api.delete(`/users/${userId}/block`),
    reportUser: (userId, reason) => api.post(`/users/${userId}/report`, { reason })
  },

  // Messages
  messages: {
    getMessages: (channelId, params) => api.get(`/channels/${channelId}/messages`, { params }),
    sendMessage: (channelId, data) => api.post(`/channels/${channelId}/messages`, data),
    editMessage: (messageId, content) => api.patch(`/messages/${messageId}`, { content }),
    deleteMessage: (messageId) => api.delete(`/messages/${messageId}`),
    addReaction: (messageId, emoji) => api.post(`/messages/${messageId}/reactions`, { emoji }),
    removeReaction: (messageId, emoji) => api.delete(`/messages/${messageId}/reactions/${emoji}`),
    pinMessage: (messageId) => api.post(`/messages/${messageId}/pin`),
    unpinMessage: (messageId) => api.delete(`/messages/${messageId}/pin`),
    searchMessages: (params) => api.get('/messages/search', { params }),
    getThreadMessages: (messageId) => api.get(`/messages/${messageId}/thread`)
  },

  // Channels
  channels: {
    getChannels: (serverId) => api.get(`/servers/${serverId}/channels`),
    getChannel: (channelId) => api.get(`/channels/${channelId}`),
    createChannel: (serverId, data) => api.post(`/servers/${serverId}/channels`, data),
    updateChannel: (channelId, data) => api.patch(`/channels/${channelId}`, data),
    deleteChannel: (channelId) => api.delete(`/channels/${channelId}`),
    getMembers: (channelId) => api.get(`/channels/${channelId}/members`),
    joinChannel: (channelId) => api.post(`/channels/${channelId}/join`),
    leaveChannel: (channelId) => api.post(`/channels/${channelId}/leave`),
    inviteToChannel: (channelId, userId) => api.post(`/channels/${channelId}/invite`, { userId }),
    getPinnedMessages: (channelId) => api.get(`/channels/${channelId}/pins`)
  },

  // Servers
  servers: {
    getServers: () => api.get('/servers'),
    getServer: (serverId) => api.get(`/servers/${serverId}`),
    createServer: (data) => api.post('/servers', data),
    updateServer: (serverId, data) => api.patch(`/servers/${serverId}`, data),
    deleteServer: (serverId) => api.delete(`/servers/${serverId}`),
    joinServer: (inviteCode) => api.post('/servers/join', { inviteCode }),
    leaveServer: (serverId) => api.post(`/servers/${serverId}/leave`),
    getInvites: (serverId) => api.get(`/servers/${serverId}/invites`),
    createInvite: (serverId, data) => api.post(`/servers/${serverId}/invites`, data),
    deleteInvite: (inviteCode) => api.delete(`/invites/${inviteCode}`),
    getRoles: (serverId) => api.get(`/servers/${serverId}/roles`),
    createRole: (serverId, data) => api.post(`/servers/${serverId}/roles`, data),
    updateRole: (roleId, data) => api.patch(`/roles/${roleId}`, data),
    deleteRole: (roleId) => api.delete(`/roles/${roleId}`),
    assignRole: (serverId, userId, roleId) => api.post(`/servers/${serverId}/members/${userId}/roles`, { roleId }),
    removeRole: (serverId, userId, roleId) => api.delete(`/servers/${serverId}/members/${userId}/roles/${roleId}`)
  },

  // Direct Messages
  directMessages: {
    getConversations: () => api.get('/messages/direct/conversations'),
    getConversation: (userId) => api.get(`/messages/direct/${userId}`),
    sendDirectMessage: (userId, data) => api.post(`/messages/direct/${userId}`, data),
    markAsRead: (conversationId) => api.post(`/messages/direct/${conversationId}/read`)
  },

  // Voice/Video
  voice: {
    getVoiceServers: () => api.get('/voice/servers'),
    getVoiceToken: (channelId) => api.post(`/voice/channels/${channelId}/token`),
    updateVoiceState: (channelId, state) => api.patch(`/voice/channels/${channelId}/state`, state)
  },

  // Files
  files: {
    upload: (file, options = {}) => {
      const formData = new FormData();
      formData.append('file', file);
      Object.keys(options).forEach(key => {
        formData.append(key, options[key]);
      });
      
      return api.post('/files/upload', formData, {
        onUploadProgress: options.onProgress
      });
    },
    getFile: (fileId) => api.get(`/files/${fileId}`),
    deleteFile: (fileId) => api.delete(`/files/${fileId}`)
  },

  // Discovery
  discovery: {
    getChannels: (params) => api.get('/discovery/channels', { params }),
    getServers: (params) => api.get('/discovery/servers', { params }),
    searchContent: (query) => api.get('/discovery/search', { params: { q: query } })
  },

  // Admin
  admin: {
    getStats: () => api.get('/admin/stats'),
    getUsers: (params) => api.get('/admin/users', { params }),
    updateUser: (userId, data) => api.patch(`/admin/users/${userId}`, data),
    banUser: (userId, data) => api.post(`/admin/users/${userId}/ban`, data),
    unbanUser: (userId) => api.post(`/admin/users/${userId}/unban`),
    getReports: (params) => api.get('/admin/reports', { params }),
    resolveReport: (reportId, data) => api.post(`/admin/reports/${reportId}/resolve`, data),
    getSystemHealth: () => api.get('/admin/system/health'),
    getLogs: (params) => api.get('/admin/logs', { params }),
    broadcast: (data) => api.post('/admin/broadcast', data),
    getAnalytics: (metric, params) => api.get(`/admin/analytics/${metric}`, { params })
  }
};

// Export both the raw axios instance and the wrapper
export { apiWrapper };
export default api;