import { useContext, useEffect, useCallback, useState, useRef } from 'react';
import { SocketContext } from '../contexts/SocketContext';

export const useSocket = () => {
  const context = useContext(SocketContext);
  
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  
  return context;
};

// Custom hook for socket events with automatic cleanup
export const useSocketEvent = (event, handler, deps = []) => {
  const { on, off } = useSocket();
  
  useEffect(() => {
    if (!event || !handler) return;
    
    const cleanup = on(event, handler);
    
    return () => {
      if (cleanup) cleanup();
      else off(event, handler);
    };
  }, [event, ...deps]);
};

// Custom hook for socket rooms
export const useSocketRoom = (roomId) => {
  const { socket, emit, on, off } = useSocket();
  const [roomData, setRoomData] = useState(null);
  const [roomMembers, setRoomMembers] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  
  useEffect(() => {
    if (!roomId || !socket) return;
    
    // Join room
    emit('room:join', { roomId });
    setIsJoined(true);
    
    // Event handlers
    const handleRoomData = (data) => setRoomData(data);
    const handleMembersUpdate = (members) => setRoomMembers(members);
    const handleMemberJoined = (member) => {
      setRoomMembers(prev => [...prev, member]);
    };
    const handleMemberLeft = (memberId) => {
      setRoomMembers(prev => prev.filter(m => m.id !== memberId));
    };
    
    on(`room:${roomId}:data`, handleRoomData);
    on(`room:${roomId}:members`, handleMembersUpdate);
    on(`room:${roomId}:member_joined`, handleMemberJoined);
    on(`room:${roomId}:member_left`, handleMemberLeft);
    
    // Cleanup
    return () => {
      emit('room:leave', { roomId });
      setIsJoined(false);
      off(`room:${roomId}:data`, handleRoomData);
      off(`room:${roomId}:members`, handleMembersUpdate);
      off(`room:${roomId}:member_joined`, handleMemberJoined);
      off(`room:${roomId}:member_left`, handleMemberLeft);
    };
  }, [roomId, socket]);
  
  const sendToRoom = useCallback((event, data) => {
    if (!isJoined) return false;
    return emit(`room:${roomId}:${event}`, data);
  }, [roomId, isJoined, emit]);
  
  return {
    roomData,
    roomMembers,
    isJoined,
    sendToRoom
  };
};

// Custom hook for presence management
export const usePresence = () => {
  const { socket, emit, on, off } = useSocket();
  const [onlineUsers, setOnlineUsers] = useState(new Map());
  const [userStatuses, setUserStatuses] = useState(new Map());
  
  useEffect(() => {
    if (!socket) return;
    
    const handleUserOnline = ({ userId, status }) => {
      setOnlineUsers(prev => new Map(prev).set(userId, true));
      setUserStatuses(prev => new Map(prev).set(userId, status));
    };
    
    const handleUserOffline = ({ userId }) => {
      setOnlineUsers(prev => {
        const updated = new Map(prev);
        updated.delete(userId);
        return updated;
      });
      setUserStatuses(prev => {
        const updated = new Map(prev);
        updated.delete(userId);
        return updated;
      });
    };
    
    const handleStatusUpdate = ({ userId, status }) => {
      setUserStatuses(prev => new Map(prev).set(userId, status));
    };
    
    const handlePresenceList = (users) => {
      const onlineMap = new Map();
      const statusMap = new Map();
      
      users.forEach(user => {
        onlineMap.set(user.id, true);
        statusMap.set(user.id, user.status);
      });
      
      setOnlineUsers(onlineMap);
      setUserStatuses(statusMap);
    };
    
    on('user:online', handleUserOnline);
    on('user:offline', handleUserOffline);
    on('user:status_update', handleStatusUpdate);
    on('presence:list', handlePresenceList);
    
    // Request initial presence list
    emit('presence:request');
    
    return () => {
      off('user:online', handleUserOnline);
      off('user:offline', handleUserOffline);
      off('user:status_update', handleStatusUpdate);
      off('presence:list', handlePresenceList);
    };
  }, [socket]);
  
  const updateMyStatus = useCallback((status, customStatus = null) => {
    return emit('presence:update', { status, customStatus });
  }, [emit]);
  
  const isUserOnline = useCallback((userId) => {
    return onlineUsers.has(userId);
  }, [onlineUsers]);
  
  const getUserStatus = useCallback((userId) => {
    return userStatuses.get(userId) || 'offline';
  }, [userStatuses]);
  
  return {
    onlineUsers: Array.from(onlineUsers.keys()),
    userStatuses,
    updateMyStatus,
    isUserOnline,
    getUserStatus
  };
};

// Custom hook for real-time notifications
export const useSocketNotifications = () => {
  const { on, off } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    const handleNotification = (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show browser notification if permitted
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.body,
          icon: notification.icon || '/logo.png',
          tag: notification.id
        });
      }
    };
    
    const handleNotificationRead = (notificationId) => {
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    };
    
    on('notification', handleNotification);
    on('notification:read', handleNotificationRead);
    
    return () => {
      off('notification', handleNotification);
      off('notification:read', handleNotificationRead);
    };
  }, []);
  
  const markAsRead = useCallback((notificationId) => {
    const { emit } = useSocket();
    emit('notification:mark_read', { notificationId });
  }, []);
  
  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);
  
  return {
    notifications,
    unreadCount,
    markAsRead,
    clearAll
  };
};

// Custom hook for typing indicators
export const useTypingIndicator = (channelId) => {
  const { emit, on, off } = useSocket();
  const [typingUsers, setTypingUsers] = useState([]);
  const typingTimeouts = useRef(new Map());
  
  useEffect(() => {
    if (!channelId) return;
    
    const handleUserTyping = ({ userId, username }) => {
      // Clear existing timeout for this user
      if (typingTimeouts.current.has(userId)) {
        clearTimeout(typingTimeouts.current.get(userId));
      }
      
      // Add user to typing list
      setTypingUsers(prev => {
        if (!prev.find(u => u.userId === userId)) {
          return [...prev, { userId, username }];
        }
        return prev;
      });
      
      // Set timeout to remove user after 3 seconds
      const timeout = setTimeout(() => {
        setTypingUsers(prev => prev.filter(u => u.userId !== userId));
        typingTimeouts.current.delete(userId);
      }, 3000);
      
      typingTimeouts.current.set(userId, timeout);
    };
    
    const handleUserStopTyping = ({ userId }) => {
      // Clear timeout
      if (typingTimeouts.current.has(userId)) {
        clearTimeout(typingTimeouts.current.get(userId));
        typingTimeouts.current.delete(userId);
      }
      
      // Remove user from typing list
      setTypingUsers(prev => prev.filter(u => u.userId !== userId));
    };
    
    on(`channel:${channelId}:typing`, handleUserTyping);
    on(`channel:${channelId}:stop_typing`, handleUserStopTyping);
    
    return () => {
      // Clear all timeouts
      typingTimeouts.current.forEach(timeout => clearTimeout(timeout));
      typingTimeouts.current.clear();
      
      off(`channel:${channelId}:typing`, handleUserTyping);
      off(`channel:${channelId}:stop_typing`, handleUserStopTyping);
    };
  }, [channelId]);
  
  const sendTyping = useCallback(() => {
    if (!channelId) return;
    emit('typing:start', { channelId });
  }, [channelId, emit]);
  
  const stopTyping = useCallback(() => {
    if (!channelId) return;
    emit('typing:stop', { channelId });
  }, [channelId, emit]);
  
  return {
    typingUsers,
    sendTyping,
    stopTyping
  };
};