import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Additional auth-related hooks
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Hook for protected routes
export const useRequireAuth = (redirectTo = '/login', requiredRole = null) => {
  const { user, loading, isAuthenticated, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate(redirectTo, { 
        state: { from: location },
        replace: true 
      });
    }
    
    if (!loading && requiredRole && !hasRole(requiredRole)) {
      navigate('/unauthorized', { replace: true });
    }
  }, [loading, isAuthenticated, requiredRole, navigate, location]);
  
  return { user, loading, isAuthenticated };
};

// Hook for session management
export const useSession = () => {
  const { user, tokens, refreshAccessToken } = useAuth();
  const [sessionExpiry, setSessionExpiry] = useState(null);
  const [isSessionValid, setIsSessionValid] = useState(true);
  
  useEffect(() => {
    if (!tokens?.accessToken) {
      setIsSessionValid(false);
      return;
    }
    
    // Parse JWT to get expiry
    try {
      const payload = JSON.parse(atob(tokens.accessToken.split('.')[1]));
      const expiryTime = payload.exp * 1000;
      setSessionExpiry(expiryTime);
      
      // Check if token is still valid
      const checkValidity = () => {
        const now = Date.now();
        if (now >= expiryTime) {
          setIsSessionValid(false);
          refreshAccessToken();
        } else {
          setIsSessionValid(true);
        }
      };
      
      checkValidity();
      const interval = setInterval(checkValidity, 60000); // Check every minute
      
      return () => clearInterval(interval);
    } catch (error) {
      console.error('Failed to parse token:', error);
      setIsSessionValid(false);
    }
  }, [tokens, refreshAccessToken]);
  
  const getRemainingTime = useCallback(() => {
    if (!sessionExpiry) return 0;
    const remaining = sessionExpiry - Date.now();
    return Math.max(0, remaining);
  }, [sessionExpiry]);
  
  return {
    isSessionValid,
    sessionExpiry,
    getRemainingTime
  };
};

// Hook for user permissions
export const usePermissions = () => {
  const { user, hasPermission, hasRole } = useAuth();
  
  const can = useCallback((action, resource = null) => {
    if (!user) return false;
    
    // Admin can do everything
    if (hasRole('admin')) return true;
    
    // Check specific permissions
    const permission = resource ? `${action}:${resource}` : action;
    return hasPermission(permission);
  }, [user, hasPermission, hasRole]);
  
  const cannot = useCallback((action, resource = null) => {
    return !can(action, resource);
  }, [can]);
  
  return { can, cannot, hasRole, hasPermission };
};

// Hook for authentication state
export const useAuthState = () => {
  const { user, loading, error, isAuthenticated } = useAuth();
  const [authState, setAuthState] = useState('checking');
  
  useEffect(() => {
    if (loading) {
      setAuthState('checking');
    } else if (error) {
      setAuthState('error');
    } else if (isAuthenticated) {
      setAuthState('authenticated');
    } else {
      setAuthState('unauthenticated');
    }
  }, [loading, error, isAuthenticated]);
  
  return {
    authState,
    isChecking: authState === 'checking',
    isAuthenticated: authState === 'authenticated',
    isUnauthenticated: authState === 'unauthenticated',
    hasError: authState === 'error',
    user,
    error
  };
};