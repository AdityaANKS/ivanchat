import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import storage from '../services/storage';

const SocketContext = createContext({});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [latency, setLatency] = useState(0);
  
  const { user, tokens } = useAuth();
  const socketRef = useRef(null);
  const eventHandlers = useRef(new Map());
  const reconnectTimeoutRef = useRef(null);
  const pingIntervalRef = useRef(null);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000;

  // Initialize socket connection
  useEffect(() => {
    if (user && tokens.accessToken) {
      connect();
    } else if (socket) {
      disconnect();
    }

    return () => {
      if (socket) {
        disconnect();
      }
    };
  }, [user, tokens.accessToken]);

  // Connect to socket server
  const connect = useCallback(() => {
    if (connecting || connected) return;

    setConnecting(true);
    setConnectionError(null);

    const socketOptions = {
      transports: ['websocket', 'polling'],
      auth: {
        token: tokens.accessToken
      },
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: reconnectDelay,
      reconnectionDelayMax: 10000,
      timeout: 20000,
      autoConnect: false
    };

    const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001', socketOptions);
    
    socketRef.current = newSocket;

    // Socket event handlers
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setSocket(newSocket);
      setConnected(true);
      setConnecting(false);
      setReconnectAttempts(0);
      setConnectionError(null);

      // Send initial data
      newSocket.emit('user:online', { userId: user.id });

      // Start ping interval for latency measurement
      startPingInterval();

      // Restore event handlers after reconnection
      restoreEventHandlers(newSocket);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setConnected(false);
      setSocket(null);

      // Stop ping interval
      stopPingInterval();

      // Handle reconnection based on disconnect reason
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, attempt to reconnect
        attemptReconnect();
      } else if (reason === 'transport close' || reason === 'transport error') {
        // Connection lost, attempt to reconnect
        attemptReconnect();
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnectionError(error.message);
      setConnecting(false);

      // Attempt reconnection
      if (reconnectAttempts < maxReconnectAttempts) {
        attemptReconnect();
      }
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
      setConnectionError(error.message);
    });

    // Custom events
    newSocket.on('pong', (timestamp) => {
      const currentLatency = Date.now() - timestamp;
      setLatency(currentLatency);
    });

    newSocket.on('force_disconnect', (data) => {
      console.log('Forced disconnect:', data.reason);
      disconnect();
    });

    newSocket.on('rate_limit', (data) => {
      console.warn('Rate limited:', data);
      // Handle rate limiting
    });

    // Connect the socket
    newSocket.connect();
  }, [user, tokens.accessToken, connecting, connected]);

  // Disconnect from socket server
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('user:offline', { userId: user?.id });
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setSocket(null);
    setConnected(false);
    setConnecting(false);
    stopPingInterval();
    clearReconnectTimeout();
  }, [user]);

  // Attempt to reconnect
  const attemptReconnect = useCallback(() => {
    if (reconnectAttempts >= maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      setConnectionError('Unable to connect to server');
      return;
    }

    const delay = Math.min(reconnectDelay * Math.pow(2, reconnectAttempts), 30000);
    
    console.log(`Attempting reconnect in ${delay}ms (attempt ${reconnectAttempts + 1}/${maxReconnectAttempts})`);
    
    setReconnectAttempts(prev => prev + 1);

    reconnectTimeoutRef.current = setTimeout(() => {
      connect();
    }, delay);
  }, [reconnectAttempts, connect]);

  // Clear reconnect timeout
  const clearReconnectTimeout = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  };

  // Start ping interval for latency measurement
  const startPingInterval = () => {
    pingIntervalRef.current = setInterval(() => {
      if (socket && connected) {
        socket.emit('ping', Date.now());
      }
    }, 5000);
  };

  // Stop ping interval
  const stopPingInterval = () => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
  };

  // Emit socket event
  const emit = useCallback((event, data, callback) => {
    if (!socket || !connected) {
      console.warn('Socket not connected, queuing event:', event);
      // Queue event for when connection is restored
      return false;
    }

    if (callback) {
      socket.emit(event, data, callback);
    } else {
      socket.emit(event, data);
    }

    return true;
  }, [socket, connected]);

  // Listen to socket event
  const on = useCallback((event, handler) => {
    if (!eventHandlers.current.has(event)) {
      eventHandlers.current.set(event, new Set());
    }
    
    eventHandlers.current.get(event).add(handler);

    if (socket) {
      socket.on(event, handler);
    }

    // Return cleanup function
    return () => {
      off(event, handler);
    };
  }, [socket]);

  // Remove socket event listener
  const off = useCallback((event, handler) => {
    if (eventHandlers.current.has(event)) {
      eventHandlers.current.get(event).delete(handler);
      
      if (eventHandlers.current.get(event).size === 0) {
        eventHandlers.current.delete(event);
      }
    }

    if (socket) {
      socket.off(event, handler);
    }
  }, [socket]);

  // Listen to socket event once
  const once = useCallback((event, handler) => {
    if (socket) {
      socket.once(event, handler);
    }
  }, [socket]);

  // Restore event handlers after reconnection
  const restoreEventHandlers = (newSocket) => {
    eventHandlers.current.forEach((handlers, event) => {
      handlers.forEach(handler => {
        newSocket.on(event, handler);
      });
    });
  };

  // Join a room
  const joinRoom = useCallback((room) => {
    return emit('room:join', { room });
  }, [emit]);

  // Leave a room
  const leaveRoom = useCallback((room) => {
    return emit('room:leave', { room });
  }, [emit]);

  // Send typing indicator
  const sendTyping = useCallback((channelId, isTyping) => {
    return emit('typing', { channelId, isTyping });
  }, [emit]);

  // Update presence
  const updatePresence = useCallback((status, customStatus = null) => {
    return emit('presence:update', { status, customStatus });
  }, [emit]);

  // Get socket stats
  const getStats = useCallback(() => {
    return {
      connected,
      connecting,
      connectionError,
      reconnectAttempts,
      latency,
      socketId: socket?.id
    };
  }, [connected, connecting, connectionError, reconnectAttempts, latency, socket]);

  // Context value
  const value = {
    socket,
    connected,
    connecting,
    connectionError,
    reconnectAttempts,
    latency,
    connect,
    disconnect,
    emit,
    on,
    off,
    once,
    joinRoom,
    leaveRoom,
    sendTyping,
    updatePresence,
    getStats
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;