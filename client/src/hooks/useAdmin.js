import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useSocket } from './useSocket';
import api from '../services/api';

export const useAdmin = () => {
  const { user, hasRole } = useAuth();
  const { emit } = useSocket();
  
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [servers, setServers] = useState([]);
  const [reports, setReports] = useState([]);
  const [logs, setLogs] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is admin
  const isAdmin = hasRole('admin');
  const isModerator = hasRole('moderator');

  // Fetch admin dashboard stats
  const fetchStats = useCallback(async () => {
    if (!isAdmin) return;
    
    try {
      setLoading(true);
      const response = await api.get('/admin/stats');
      setStats(response.data);
      return response.data;
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  // User management
  const fetchUsers = useCallback(async (options = {}) => {
    if (!isAdmin && !isModerator) return [];
    
    try {
      setLoading(true);
      const response = await api.get('/admin/users', { params: options });
      setUsers(response.data.users);
      return response.data;
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError(err.message);
      return { users: [], total: 0 };
    } finally {
      setLoading(false);
    }
  }, [isAdmin, isModerator]);

  const updateUser = useCallback(async (userId, updates) => {
    if (!isAdmin) throw new Error('Insufficient permissions');
    
    try {
      const response = await api.patch(`/admin/users/${userId}`, updates);
      
      setUsers(prev => 
        prev.map(u => u.id === userId ? { ...u, ...response.data } : u)
      );
      
      return response.data;
    } catch (err) {
      console.error('Failed to update user:', err);
      throw err;
    }
  }, [isAdmin]);

  const banUser = useCallback(async (userId, reason, duration = null) => {
    if (!isAdmin && !isModerator) throw new Error('Insufficient permissions');
    
    try {
      const response = await api.post(`/admin/users/${userId}/ban`, {
        reason,
        duration
      });
      
      // Update local state
      setUsers(prev => 
        prev.map(u => u.id === userId ? { ...u, status: 'banned' } : u)
      );
      
      // Emit socket event to disconnect user
      emit('admin:ban_user', { userId, reason });
      
      return response.data;
    } catch (err) {
      console.error('Failed to ban user:', err);
      throw err;
    }
  }, [isAdmin, isModerator, emit]);

  const unbanUser = useCallback(async (userId) => {
    if (!isAdmin && !isModerator) throw new Error('Insufficient permissions');
    
    try {
      const response = await api.post(`/admin/users/${userId}/unban`);
      
      setUsers(prev => 
        prev.map(u => u.id === userId ? { ...u, status: 'active' } : u)
      );
      
      return response.data;
    } catch (err) {
      console.error('Failed to unban user:', err);
      throw err;
    }
  }, [isAdmin, isModerator]);

  // Server management
  const fetchServers = useCallback(async (options = {}) => {
    if (!isAdmin) return [];
    
    try {
      setLoading(true);
      const response = await api.get('/admin/servers', { params: options });
      setServers(response.data.servers);
      return response.data;
    } catch (err) {
      console.error('Failed to fetch servers:', err);
      setError(err.message);
      return { servers: [], total: 0 };
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const deleteServer = useCallback(async (serverId) => {
    if (!isAdmin) throw new Error('Insufficient permissions');
    
    try {
      await api.delete(`/admin/servers/${serverId}`);
      
      setServers(prev => prev.filter(s => s.id !== serverId));
      
      // Emit socket event to notify users
      emit('admin:server_deleted', { serverId });
      
      return true;
    } catch (err) {
      console.error('Failed to delete server:', err);
      throw err;
    }
  }, [isAdmin, emit]);

  // Reports management
  const fetchReports = useCallback(async (options = {}) => {
    if (!isAdmin && !isModerator) return [];
    
    try {
      setLoading(true);
      const response = await api.get('/admin/reports', { params: options });
      setReports(response.data.reports);
      return response.data;
    } catch (err) {
      console.error('Failed to fetch reports:', err);
      setError(err.message);
      return { reports: [], total: 0 };
    } finally {
      setLoading(false);
    }
  }, [isAdmin, isModerator]);

  const resolveReport = useCallback(async (reportId, resolution) => {
    if (!isAdmin && !isModerator) throw new Error('Insufficient permissions');
    
    try {
      const response = await api.post(`/admin/reports/${reportId}/resolve`, {
        resolution,
        resolvedBy: user.id
      });
      
      setReports(prev => 
        prev.map(r => r.id === reportId ? { ...r, status: 'resolved', resolution } : r)
      );
      
      return response.data;
    } catch (err) {
      console.error('Failed to resolve report:', err);
      throw err;
    }
  }, [isAdmin, isModerator, user]);

  // System management
  const fetchSystemHealth = useCallback(async () => {
    if (!isAdmin) return null;
    
    try {
      const response = await api.get('/admin/system/health');
      setSystemHealth(response.data);
      return response.data;
    } catch (err) {
      console.error('Failed to fetch system health:', err);
      setError(err.message);
      return null;
    }
  }, [isAdmin]);

  const fetchLogs = useCallback(async (options = {}) => {
    if (!isAdmin) return [];
    
    try {
      setLoading(true);
      const response = await api.get('/admin/logs', { params: options });
      setLogs(response.data.logs);
      return response.data;
    } catch (err) {
      console.error('Failed to fetch logs:', err);
      setError(err.message);
      return { logs: [], total: 0 };
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  // Broadcast messages
  const broadcastMessage = useCallback(async (message, options = {}) => {
    if (!isAdmin) throw new Error('Insufficient permissions');
    
    try {
      const response = await api.post('/admin/broadcast', {
        message,
        ...options
      });
      
      // Emit socket event for real-time broadcast
      emit('admin:broadcast', { message, ...options });
      
      return response.data;
    } catch (err) {
      console.error('Failed to broadcast message:', err);
      throw err;
    }
  }, [isAdmin, emit]);

  // Analytics
  const fetchAnalytics = useCallback(async (metric, options = {}) => {
    if (!isAdmin) return null;
    
    try {
      const response = await api.get(`/admin/analytics/${metric}`, { 
        params: options 
      });
      return response.data;
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError(err.message);
      return null;
    }
  }, [isAdmin]);

  // Bulk actions
  const bulkAction = useCallback(async (action, targetIds, options = {}) => {
    if (!isAdmin) throw new Error('Insufficient permissions');
    
    try {
      const response = await api.post('/admin/bulk-action', {
        action,
        targetIds,
        ...options
      });
      
      return response.data;
    } catch (err) {
      console.error('Failed to perform bulk action:', err);
      throw err;
    }
  }, [isAdmin]);

  // Configuration management
  const getConfig = useCallback(async (key = null) => {
    if (!isAdmin) return null;
    
    try {
      const endpoint = key ? `/admin/config/${key}` : '/admin/config';
      const response = await api.get(endpoint);
      return response.data;
    } catch (err) {
      console.error('Failed to get config:', err);
      setError(err.message);
      return null;
    }
  }, [isAdmin]);

  const updateConfig = useCallback(async (key, value) => {
    if (!isAdmin) throw new Error('Insufficient permissions');
    
    try {
      const response = await api.put(`/admin/config/${key}`, { value });
      
      // Emit config update event
      emit('admin:config_updated', { key, value });
      
      return response.data;
    } catch (err) {
      console.error('Failed to update config:', err);
      throw err;
    }
  }, [isAdmin, emit]);

  // Maintenance mode
  const toggleMaintenanceMode = useCallback(async (enabled, message = null) => {
    if (!isAdmin) throw new Error('Insufficient permissions');
    
    try {
      const response = await api.post('/admin/maintenance', {
        enabled,
        message
      });
      
      // Emit maintenance mode event
      emit('admin:maintenance_mode', { enabled, message });
      
      return response.data;
    } catch (err) {
      console.error('Failed to toggle maintenance mode:', err);
      throw err;
    }
  }, [isAdmin, emit]);

  // Export data
  const exportData = useCallback(async (type, options = {}) => {
    if (!isAdmin) throw new Error('Insufficient permissions');
    
    try {
      const response = await api.get(`/admin/export/${type}`, {
        params: options,
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-export-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (err) {
      console.error('Failed to export data:', err);
      throw err;
    }
  }, [isAdmin]);

  // Initialize admin data
  useEffect(() => {
    if (isAdmin || isModerator) {
      fetchStats();
      fetchSystemHealth();
    }
  }, [isAdmin, isModerator]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isAdmin,
    isModerator,
    stats,
    users,
    servers,
    reports,
    logs,
    systemHealth,
    loading,
    error,
    fetchStats,
    fetchUsers,
    updateUser,
    banUser,
    unbanUser,
    fetchServers,
    deleteServer,
    fetchReports,
    resolveReport,
    fetchSystemHealth,
    fetchLogs,
    broadcastMessage,
    fetchAnalytics,
    bulkAction,
    getConfig,
    updateConfig,
    toggleMaintenanceMode,
    exportData,
    clearError
  };
};

// Hook for moderation actions
export const useModeration = () => {
  const { hasRole } = useAuth();
  const { emit } = useSocket();
  
  const canModerate = hasRole('moderator') || hasRole('admin');
  
  const deleteMessage = useCallback(async (messageId, reason = null) => {
    if (!canModerate) throw new Error('Insufficient permissions');
    
    try {
      await api.delete(`/moderation/messages/${messageId}`, {
        data: { reason }
      });
      
      emit('moderation:message_deleted', { messageId, reason });
      
      return true;
    } catch (err) {
      console.error('Failed to delete message:', err);
      throw err;
    }
  }, [canModerate, emit]);
  
  const timeoutUser = useCallback(async (userId, duration, reason = null) => {
    if (!canModerate) throw new Error('Insufficient permissions');
    
    try {
      await api.post(`/moderation/users/${userId}/timeout`, {
        duration,
        reason
      });
      
      emit('moderation:user_timeout', { userId, duration, reason });
      
      return true;
    } catch (err) {
      console.error('Failed to timeout user:', err);
      throw err;
    }
  }, [canModerate, emit]);
  
  const warnUser = useCallback(async (userId, reason) => {
    if (!canModerate) throw new Error('Insufficient permissions');
    
    try {
      await api.post(`/moderation/users/${userId}/warn`, { reason });
      
      emit('moderation:user_warned', { userId, reason });
      
      return true;
    } catch (err) {
      console.error('Failed to warn user:', err);
      throw err;
    }
  }, [canModerate, emit]);
  
  return {
    canModerate,
    deleteMessage,
    timeoutUser,
    warnUser
  };
};