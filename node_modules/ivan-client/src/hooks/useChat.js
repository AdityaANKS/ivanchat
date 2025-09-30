import { useState, useEffect, useCallback, useRef } from 'react';
import { useSocket, useSocketEvent } from './useSocket';
import { useAuth } from './useAuth';
import { useEncryption } from '../contexts/EncryptionContext';
import api from '../services/api';

export const useChat = (channelId = null) => {
  const { user } = useAuth();
  const { socket, emit, connected } = useSocket();
  const { encryptMessage, decryptMessage } = useEncryption();
  
  const [messages, setMessages] = useState([]);
  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [unreadCounts, setUnreadCounts] = useState(new Map());
  
  const messagesEndRef = useRef(null);
  const loadingMoreRef = useRef(false);

  // Fetch messages for a channel
  const fetchMessages = useCallback(async (channelId, options = {}) => {
    if (!channelId || loadingMoreRef.current) return;
    
    try {
      setLoading(true);
      loadingMoreRef.current = true;
      
      const response = await api.get(`/channels/${channelId}/messages`, {
        params: {
          limit: options.limit || 50,
          before: options.before,
          after: options.after
        }
      });
      
      const decryptedMessages = await Promise.all(
        response.data.messages.map(async (msg) => {
          if (msg.encrypted) {
            try {
              const decrypted = await decryptMessage(msg);
              return { ...msg, content: decrypted };
            } catch (err) {
              return { ...msg, decryptionError: true };
            }
          }
          return msg;
        })
      );
      
      if (options.before) {
        // Prepend older messages
        setMessages(prev => [...decryptedMessages, ...prev]);
      } else if (options.after) {
        // Append newer messages
        setMessages(prev => [...prev, ...decryptedMessages]);
      } else {
        // Replace messages
        setMessages(decryptedMessages);
      }
      
      setHasMore(decryptedMessages.length === (options.limit || 50));
      
      return decryptedMessages;
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
      loadingMoreRef.current = false;
    }
  }, [decryptMessage]);

  // Send a message
  const sendMessage = useCallback(async (messageData) => {
    if (!messageData.content?.trim() && !messageData.attachments?.length) {
      return null;
    }
    
    try {
      const channel = messageData.channelId || channelId;
      
      // Encrypt message if encryption is enabled
      let finalContent = messageData.content;
      let encrypted = false;
      
      if (messageData.encrypt !== false) {
        const encryptedData = await encryptMessage(messageData.content, channel);
        if (encryptedData.encrypted) {
          finalContent = encryptedData.content;
          encrypted = true;
        }
      }
      
      const message = {
        id: `temp-${Date.now()}`,
        content: finalContent,
        encrypted,
        channelId: channel,
        userId: user.id,
        author: user,
        attachments: messageData.attachments || [],
        replyTo: messageData.replyTo,
        timestamp: new Date().toISOString(),
        pending: true
      };
      
      // Optimistically add message
      setMessages(prev => [...prev, message]);
      
      // Send via socket
      const sentMessage = await new Promise((resolve, reject) => {
        emit('message:send', message, (response) => {
          if (response.error) {
            reject(new Error(response.error));
          } else {
            resolve(response.message);
          }
        });
      });
      
      // Update with server response
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id ? { ...sentMessage, pending: false } : msg
        )
      );
      
      return sentMessage;
    } catch (err) {
      console.error('Failed to send message:', err);
      setError(err.message);
      
      // Remove failed message
      setMessages(prev => prev.filter(msg => msg.id !== `temp-${Date.now()}`));
      
      throw err;
    }
  }, [channelId, user, emit, encryptMessage]);

  // Edit a message
  const editMessage = useCallback(async (messageId, newContent) => {
    try {
      const response = await api.patch(`/messages/${messageId}`, {
        content: newContent
      });
      
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, ...response.data, edited: true } : msg
        )
      );
      
      emit('message:edit', { messageId, content: newContent });
      
      return response.data;
    } catch (err) {
      console.error('Failed to edit message:', err);
      setError(err.message);
      throw err;
    }
  }, [emit]);

  // Delete a message
  const deleteMessage = useCallback(async (messageId) => {
    try {
      await api.delete(`/messages/${messageId}`);
      
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      
      emit('message:delete', { messageId });
      
      return true;
    } catch (err) {
      console.error('Failed to delete message:', err);
      setError(err.message);
      throw err;
    }
  }, [emit]);

  // Add reaction to message
  const addReaction = useCallback(async (messageId, emoji) => {
    try {
      await api.post(`/messages/${messageId}/reactions`, { emoji });
      
      setMessages(prev =>
        prev.map(msg => {
          if (msg.id === messageId) {
            const reactions = msg.reactions || {};
            reactions[emoji] = (reactions[emoji] || 0) + 1;
            return { ...msg, reactions };
          }
          return msg;
        })
      );
      
      emit('message:reaction', { messageId, emoji, action: 'add' });
      
      return true;
    } catch (err) {
      console.error('Failed to add reaction:', err);
      setError(err.message);
      throw err;
    }
  }, [emit]);

  // Remove reaction from message
  const removeReaction = useCallback(async (messageId, emoji) => {
    try {
      await api.delete(`/messages/${messageId}/reactions/${emoji}`);
      
      setMessages(prev =>
        prev.map(msg => {
          if (msg.id === messageId) {
            const reactions = { ...msg.reactions };
            if (reactions[emoji]) {
              reactions[emoji]--;
              if (reactions[emoji] <= 0) {
                delete reactions[emoji];
              }
            }
            return { ...msg, reactions };
          }
          return msg;
        })
      );
      
      emit('message:reaction', { messageId, emoji, action: 'remove' });
      
      return true;
    } catch (err) {
      console.error('Failed to remove reaction:', err);
      setError(err.message);
      throw err;
    }
  }, [emit]);

  // Join a channel
  const joinChannel = useCallback(async (channelId) => {
    try {
      setActiveChannel(channelId);
      
      // Join via socket
      emit('channel:join', { channelId });
      
      // Fetch initial data
      await Promise.all([
        fetchMessages(channelId),
        fetchChannelMembers(channelId)
      ]);
      
      // Mark as read
      markChannelAsRead(channelId);
      
      return true;
    } catch (err) {
      console.error('Failed to join channel:', err);
      setError(err.message);
      throw err;
    }
  }, [emit, fetchMessages]);

  // Leave a channel
  const leaveChannel = useCallback((channelId) => {
    emit('channel:leave', { channelId });
    
    if (activeChannel === channelId) {
      setActiveChannel(null);
      setMessages([]);
      setMembers([]);
    }
  }, [emit, activeChannel]);

  // Fetch channels
  const fetchChannels = useCallback(async (serverId = null) => {
    try {
      setLoading(true);
      
      const endpoint = serverId 
        ? `/servers/${serverId}/channels`
        : '/channels';
      
      const response = await api.get(endpoint);
      setChannels(response.data.channels);
      
      return response.data.channels;
    } catch (err) {
      console.error('Failed to fetch channels:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch channel members
  const fetchChannelMembers = useCallback(async (channelId) => {
    try {
      const response = await api.get(`/channels/${channelId}/members`);
      setMembers(response.data.members);
      return response.data.members;
    } catch (err) {
      console.error('Failed to fetch members:', err);
      setError(err.message);
      return [];
    }
  }, []);

  // Mark channel as read
  const markChannelAsRead = useCallback((channelId) => {
    setUnreadCounts(prev => {
      const updated = new Map(prev);
      updated.set(channelId, 0);
      return updated;
    });
    
    emit('channel:mark_read', { channelId });
  }, [emit]);

  // Load more messages (pagination)
  const loadMoreMessages = useCallback(async () => {
    if (!activeChannel || !hasMore || loadingMoreRef.current) return;
    
    const oldestMessage = messages[0];
    if (!oldestMessage) return;
    
    return fetchMessages(activeChannel, {
      before: oldestMessage.id,
      limit: 50
    });
  }, [activeChannel, hasMore, messages, fetchMessages]);

  // Search messages
  const searchMessages = useCallback(async (query, options = {}) => {
    try {
      const response = await api.get('/messages/search', {
        params: {
          q: query,
          channelId: options.channelId || channelId,
          userId: options.userId,
          before: options.before,
          after: options.after,
          limit: options.limit || 50
        }
      });
      
      return response.data.messages;
    } catch (err) {
      console.error('Failed to search messages:', err);
      setError(err.message);
      return [];
    }
  }, [channelId]);

  // Socket event handlers
  useSocketEvent('message:new', async (message) => {
    if (message.channelId !== activeChannel) {
      // Update unread count for other channels
      setUnreadCounts(prev => {
        const updated = new Map(prev);
        const current = updated.get(message.channelId) || 0;
        updated.set(message.channelId, current + 1);
        return updated;
      });
      return;
    }
    
    // Decrypt if needed
    let finalMessage = message;
    if (message.encrypted) {
      try {
        const decrypted = await decryptMessage(message);
        finalMessage = { ...message, content: decrypted };
      } catch (err) {
        finalMessage = { ...message, decryptionError: true };
      }
    }
    
    setMessages(prev => [...prev, finalMessage]);
  }, [activeChannel, decryptMessage]);

  useSocketEvent('message:edited', (data) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === data.messageId 
          ? { ...msg, content: data.content, edited: true, editedAt: data.editedAt }
          : msg
      )
    );
  });

  useSocketEvent('message:deleted', (data) => {
    setMessages(prev => prev.filter(msg => msg.id !== data.messageId));
  });

  useSocketEvent('message:reaction', (data) => {
    setMessages(prev =>
      prev.map(msg => {
        if (msg.id === data.messageId) {
          const reactions = { ...msg.reactions };
          if (data.action === 'add') {
            reactions[data.emoji] = (reactions[data.emoji] || 0) + 1;
          } else {
            reactions[data.emoji]--;
            if (reactions[data.emoji] <= 0) {
              delete reactions[data.emoji];
            }
          }
          return { ...msg, reactions };
        }
        return msg;
      })
    );
  });

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    channels,
    activeChannel,
    members,
    loading,
    error,
    hasMore,
    unreadCounts,
    sendMessage,
    editMessage,
    deleteMessage,
    addReaction,
    removeReaction,
    joinChannel,
    leaveChannel,
    fetchMessages,
    fetchChannels,
    fetchChannelMembers,
    loadMoreMessages,
    searchMessages,
    markChannelAsRead,
    scrollToBottom,
    clearError,
    messagesEndRef
  };
};

// Hook for direct messages
export const useDirectMessages = (userId) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const { emit } = useSocket();
  
  const fetchConversations = useCallback(async () => {
    try {
      const response = await api.get('/messages/direct/conversations');
      setConversations(response.data.conversations);
      return response.data.conversations;
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
      return [];
    }
  }, []);
  
  const startConversation = useCallback(async (recipientId) => {
    try {
      const response = await api.post('/messages/direct/conversations', {
        recipientId
      });
      
      setActiveConversation(response.data.conversation);
      emit('dm:join', { conversationId: response.data.conversation.id });
      
      return response.data.conversation;
    } catch (err) {
      console.error('Failed to start conversation:', err);
      throw err;
    }
  }, [emit]);
  
  useEffect(() => {
    if (userId) {
      fetchConversations();
    }
  }, [userId]);
  
  return {
    conversations,
    activeConversation,
    fetchConversations,
    startConversation,
    setActiveConversation
  };
};