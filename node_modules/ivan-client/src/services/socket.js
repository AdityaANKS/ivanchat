import io from 'socket.io-client';
import storage from './storage';
import EventEmitter from 'events';
import config from '../config/env';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    // Use WebSocket URL from env
    this.socket = io(config.api.wsUrl, {
      transports: ['websocket'],
      autoConnect: true,
    });

    if (config.features.debug) {
      console.log('Connecting to WebSocket:', config.api.wsUrl);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

class SocketService extends EventEmitter {
  constructor() {
    super();
    this.socket = null;
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.messageQueue = [];
    this.rooms = new Set();
    this.eventHandlers = new Map();
    this.heartbeatInterval = null;
    this.connectionTimeout = null;
  }

  // Initialize socket connection
  connect(options = {}) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const token = storage.getAccessToken();
      
      if (!token && options.requireAuth !== false) {
        reject(new Error('No authentication token available'));
        return;
      }

      const socketOptions = {
        transports: ['websocket', 'polling'],
        auth: {
          token
        },
        query: {
          clientVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
          platform: this.getPlatform()
        },
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        reconnectionDelayMax: 10000,
        timeout: 20000,
        autoConnect: false,
        ...options
      };

      this.socket = io(
        import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001',
        socketOptions
      );

      this.setupEventHandlers();

      // Set connection timeout
      this.connectionTimeout = setTimeout(() => {
        this.socket.disconnect();
        reject(new Error('Connection timeout'));
      }, socketOptions.timeout);

      // Connect
      this.socket.connect();

      // Handle connection success
      this.socket.once('connect', () => {
        clearTimeout(this.connectionTimeout);
        this.connected = true;
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        this.processMessageQueue();
        this.emit('connected', { socketId: this.socket.id });
        resolve();
      });

      // Handle connection error
      this.socket.once('connect_error', (error) => {
        clearTimeout(this.connectionTimeout);
        this.connected = false;
        this.emit('connection_error', error);
        reject(error);
      });
    });
  }

  // Setup core event handlers
  setupEventHandlers() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.connected = true;
      this.reconnectAttempts = 0;
      this.emit('connected', { socketId: this.socket.id });
      
      // Rejoin rooms after reconnection
      this.rejoinRooms();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.connected = false;
      this.stopHeartbeat();
      this.emit('disconnected', { reason });

      // Handle automatic reconnection
      if (reason === 'io server disconnect') {
        this.attemptReconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.emit('connection_error', error);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      this.emit('error', error);
    });

    // Custom events
    this.socket.on('pong', (data) => {
      this.emit('pong', data);
    });

    this.socket.on('force_disconnect', (data) => {
      console.log('Forced disconnect:', data.reason);
      this.disconnect();
      this.emit('force_disconnect', data);
    });

    this.socket.on('rate_limit', (data) => {
      console.warn('Rate limited:', data);
      this.emit('rate_limit', data);
    });

    // Message events
    this.socket.on('message:new', (data) => {
      this.emit('message:new', data);
    });

    this.socket.on('message:edited', (data) => {
      this.emit('message:edited', data);
    });

    this.socket.on('message:deleted', (data) => {
      this.emit('message:deleted', data);
    });

    // Typing events
    this.socket.on('typing:start', (data) => {
      this.emit('typing:start', data);
    });

    this.socket.on('typing:stop', (data) => {
      this.emit('typing:stop', data);
    });

    // Presence events
    this.socket.on('presence:update', (data) => {
      this.emit('presence:update', data);
    });

    this.socket.on('user:online', (data) => {
      this.emit('user:online', data);
    });

    this.socket.on('user:offline', (data) => {
      this.emit('user:offline', data);
    });

    // Voice events
    this.socket.on('voice:user_joined', (data) => {
      this.emit('voice:user_joined', data);
    });

    this.socket.on('voice:user_left', (data) => {
      this.emit('voice:user_left', data);
    });

    this.socket.on('voice:offer', (data) => {
      this.emit('voice:offer', data);
    });

    this.socket.on('voice:answer', (data) => {
      this.emit('voice:answer', data);
    });

    this.socket.on('voice:ice_candidate', (data) => {
      this.emit('voice:ice_candidate', data);
    });

    // Notification events
    this.socket.on('notification', (data) => {
      this.emit('notification', data);
    });
  }

  // Disconnect from socket server
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    
    this.connected = false;
    this.rooms.clear();
    this.messageQueue = [];
    this.stopHeartbeat();
    clearTimeout(this.connectionTimeout);
    this.emit('disconnected', { reason: 'manual' });
  }

  // Attempt to reconnect
  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.emit('reconnect_failed');
      return;
    }

    const delay = Math.min(
      this.reconnectDelay * Math.pow(2, this.reconnectAttempts),
      30000
    );

    console.log(`Attempting reconnect in ${delay}ms (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
    
    this.reconnectAttempts++;
    this.emit('reconnecting', { attempt: this.reconnectAttempts });

    setTimeout(() => {
      this.connect().catch(error => {
        console.error('Reconnection failed:', error);
        this.attemptReconnect();
      });
    }, delay);
  }

  // Emit event with acknowledgment support
  emit(event, data, callback) {
    if (!this.socket) {
      console.warn('Socket not initialized');
      return false;
    }

    if (!this.connected) {
      // Queue message for later
      this.messageQueue.push({ event, data, callback });
      return false;
    }

    if (callback) {
      this.socket.emit(event, data, callback);
    } else {
      this.socket.emit(event, data);
    }

    return true;
  }

  // Listen to events
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    
    this.eventHandlers.get(event).add(handler);

    if (this.socket) {
      this.socket.on(event, handler);
    }

    return () => this.off(event, handler);
  }

  // Remove event listener
  off(event, handler) {
    if (this.eventHandlers.has(event)) {
      this.eventHandlers.get(event).delete(handler);
    }

    if (this.socket) {
      this.socket.off(event, handler);
    }
  }

  // Listen to event once
  once(event, handler) {
    if (this.socket) {
      this.socket.once(event, handler);
    }
  }

  // Join a room
  joinRoom(room) {
    this.rooms.add(room);
    
    if (this.connected) {
      this.emit('room:join', { room });
    }
  }

  // Leave a room
  leaveRoom(room) {
    this.rooms.delete(room);
    
    if (this.connected) {
      this.emit('room:leave', { room });
    }
  }

  // Rejoin rooms after reconnection
  rejoinRooms() {
    this.rooms.forEach(room => {
      this.emit('room:join', { room });
    });
  }

  // Process queued messages
  processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const { event, data, callback } = this.messageQueue.shift();
      this.emit(event, data, callback);
    }
  }

  // Start heartbeat
  startHeartbeat() {
    this.stopHeartbeat();
    
    this.heartbeatInterval = setInterval(() => {
      if (this.connected) {
        this.emit('ping', Date.now());
      }
    }, 30000);
  }

  // Stop heartbeat
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // Get platform information
  getPlatform() {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('electron')) return 'desktop';
    if (userAgent.includes('mobile')) return 'mobile';
    return 'web';
  }

  // Get connection status
  getStatus() {
    return {
      connected: this.connected,
      socketId: this.socket?.id,
      reconnectAttempts: this.reconnectAttempts,
      rooms: Array.from(this.rooms),
      queuedMessages: this.messageQueue.length
    };
  }
}

// Create singleton instance
const socketService = new SocketService();

// Auto-connect if token exists
if (typeof window !== 'undefined') {
  const token = storage.getAccessToken();
  if (token) {
    socketService.connect().catch(error => {
      console.error('Initial socket connection failed:', error);
    });
  }
}

export default socketService;