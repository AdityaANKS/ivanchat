
import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import storage from '../services/storage';
import config from '../config/env';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  // Token management
  const [tokens, setTokens] = useState({
    accessToken: storage.getAccessToken(),
    refreshToken: storage.getRefreshToken()
  });


  // Initialize auth state on mount
  useEffect(() => {
    // Example: Use config.auth.tokenKey for token retrieval
    const tokenKey = config?.auth?.tokenKey || 'accessToken';
    const refreshTokenKey = config?.auth?.refreshTokenKey || 'refreshToken';
    const sessionTimeout = config?.auth?.sessionTimeout || null;
    const debug = config?.features?.debug;

    // Check for existing token using config
    const token = localStorage.getItem(tokenKey);
    if (token && !user) {
      // Optionally validate token or initialize auth
      // initializeAuth();
    }

    // Set up session timeout if configured
    let timeout;
    if (sessionTimeout) {
      timeout = setTimeout(() => {
        if (debug) {
          console.log('Session timeout after:', sessionTimeout);
        }
        logout();
      }, sessionTimeout);
    }

    // Call original initializeAuth
    initializeAuth();

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  // Set up axios interceptors for token management
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (tokens.accessToken) {
          config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry && tokens.refreshToken) {
          originalRequest._retry = true;
          
          try {
            const newTokens = await refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            await logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [tokens]);

  // Initialize authentication state
  const initializeAuth = async () => {
    try {
      setLoading(true);
      
      const storedAccessToken = storage.getAccessToken();
      const storedRefreshToken = storage.getRefreshToken();
      
      if (!storedAccessToken) {
        setLoading(false);
        return;
      }

      // Verify token and get user data
      const response = await api.get('/auth/me');
      
      if (response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        
        // Update user status to online
        await updateUserStatus('online');
        
        // Set up periodic token refresh
        setupTokenRefresh();
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      
      // Try to refresh token if access token is expired
      if (tokens.refreshToken) {
        try {
          await refreshAccessToken();
          await initializeAuth();
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          clearAuthState();
        }
      } else {
        clearAuthState();
      }
    } finally {
      setLoading(false);
    }
  };

  // Login with email and password
  const login = async (email, password, rememberMe = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post('/auth/login', {
        email,
        password,
        rememberMe
      });

      const { user, accessToken, refreshToken } = response.data;

      // Store tokens using config keys if available
      const tokenKey = config?.auth?.tokenKey || 'accessToken';
      const refreshTokenKey = config?.auth?.refreshTokenKey || 'refreshToken';
      localStorage.setItem(tokenKey, accessToken);
      localStorage.setItem(refreshTokenKey, refreshToken);

      storage.setTokens(accessToken, refreshToken, rememberMe);
      setTokens({ accessToken, refreshToken });
      setUser(user);
      setIsAuthenticated(true);

      // Update user status
      await updateUserStatus('online');

      // Set up token refresh
      setupTokenRefresh();

      // Track login analytics if enabled in config
      if (config?.features?.analytics) {
        trackAnalytics('user_login', {
          method: 'email',
          userId: user.id
        });
      }

      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Register new user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post('/auth/register', userData);

      const { user, accessToken, refreshToken } = response.data;

      // Store tokens
      storage.setTokens(accessToken, refreshToken);
      
      setTokens({ accessToken, refreshToken });
      setUser(user);
      setIsAuthenticated(true);

      // Send welcome email
      await api.post('/auth/welcome-email', { email: user.email });

      // Track registration analytics
      trackAnalytics('user_register', {
        userId: user.id,
        method: 'email'
      });

      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // OAuth login (example for Google)
  const loginWithGoogle = () => {
    if (!config?.auth?.oauth?.google) {
      console.error('Google OAuth not configured');
      return;
    }
    window.location.href = `${config?.api?.baseUrl || ''}/auth/google`;
  };

  // Logout
  const logout = async () => {
    try {
      // Update user status to offline
      if (user) {
        await updateUserStatus('offline');
      }

      // Call logout endpoint
      await api.post('/auth/logout');

      // Track logout if analytics enabled
      if (config?.features?.analytics) {
        trackAnalytics('user_logout', {
          userId: user?.id
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Remove tokens using config keys if available
      const tokenKey = config?.auth?.tokenKey || 'accessToken';
      const refreshTokenKey = config?.auth?.refreshTokenKey || 'refreshToken';
      localStorage.removeItem(tokenKey);
      localStorage.removeItem(refreshTokenKey);
      clearAuthState();
      navigate('/login');
    }
  };

  // Refresh access token
  const refreshAccessToken = async () => {
    if (refreshing) {
      // Wait for ongoing refresh to complete
      return new Promise((resolve) => {
        const checkRefresh = setInterval(() => {
          if (!refreshing) {
            clearInterval(checkRefresh);
            resolve(tokens);
          }
        }, 100);
      });
    }

    try {
      setRefreshing(true);
      
      const response = await api.post('/auth/refresh', {
        refreshToken: tokens.refreshToken
      });

      const { accessToken, refreshToken } = response.data;

      storage.setTokens(accessToken, refreshToken);
      setTokens({ accessToken, refreshToken });

      return { accessToken, refreshToken };
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    } finally {
      setRefreshing(false);
    }
  };

  // Set up automatic token refresh
  const setupTokenRefresh = () => {
    // Refresh token 5 minutes before expiry
    const refreshInterval = setInterval(async () => {
      try {
        await refreshAccessToken();
      } catch (error) {
        console.error('Auto refresh failed:', error);
        clearInterval(refreshInterval);
      }
    }, 15 * 60 * 1000); // 15 minutes

    return () => clearInterval(refreshInterval);
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      
      const response = await api.put('/users/profile', profileData);
      
      setUser(response.data.user);
      
      return { success: true, user: response.data.user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password change failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Reset password request
  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);
      
      await api.post('/auth/forgot-password', { email });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password reset request failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Reset password with token
  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      
      await api.post('/auth/reset-password', {
        token,
        newPassword
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password reset failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Enable two-factor authentication
  const enableTwoFactor = async () => {
    try {
      const response = await api.post('/auth/2fa/enable');
      
      return {
        success: true,
        qrCode: response.data.qrCode,
        secret: response.data.secret
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || '2FA setup failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Verify two-factor authentication
  const verifyTwoFactor = async (code) => {
    try {
      await api.post('/auth/2fa/verify', { code });
      
      setUser(prev => ({ ...prev, twoFactorEnabled: true }));
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || '2FA verification failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Update user status
  const updateUserStatus = async (status) => {
    try {
      await api.post('/users/status', { status });
      
      setUser(prev => ({ ...prev, status }));
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  // Clear authentication state
  const clearAuthState = () => {
    storage.clearTokens();
    setTokens({ accessToken: null, refreshToken: null });
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  // Track analytics events
  const trackAnalytics = (event, data) => {
    try {
      api.post('/analytics/track', { event, data });
    } catch (error) {
      console.error('Analytics tracking failed:', error);
    }
  };

  // Check if user has permission
  const hasPermission = useCallback((permission) => {
    if (!user) return false;
    
    if (user.role === 'admin') return true;
    
    return user.permissions?.includes(permission) || false;
  }, [user]);

  // Check if user has role
  const hasRole = useCallback((role) => {
    if (!user) return false;
    
    const roleHierarchy = {
      admin: 3,
      moderator: 2,
      premium: 1,
      user: 0
    };

    const userRoleLevel = roleHierarchy[user.role] || 0;
    const requiredRoleLevel = roleHierarchy[role] || 0;

    return userRoleLevel >= requiredRoleLevel;
  }, [user]);

  // Context value
  const value = useMemo(() => ({
    user,
    loading,
    error,
    isAuthenticated,
    tokens,
    login,
    register,
    loginWithProvider,
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,
    resetPassword,
    enableTwoFactor,
    verifyTwoFactor,
    updateUserStatus,
    refreshAccessToken,
    hasPermission,
    hasRole,
    clearError: () => setError(null)
  }), [user, loading, error, isAuthenticated, tokens, hasPermission, hasRole]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;