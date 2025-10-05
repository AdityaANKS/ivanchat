// client/src/App.jsx
import React, { Suspense, lazy, useEffect, useMemo } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { ErrorBoundary } from 'react-error-boundary';

// Hooks
import { useAuth } from './hooks/useAuth';
import { useSocket } from './hooks/useSocket';
import { useTheme } from './hooks/useTheme';
import { useNotifications } from './hooks/useNotifications';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { usePageTitle } from './hooks/usePageTitle';
import { useAnalytics } from './hooks/useAnalytics';

// Components
import Layout from './components/Layout/Layout';
import LoadingScreen from './components/common/LoadingScreen';
import ErrorFallback from './components/common/ErrorFallback';
import OfflineIndicator from './components/common/OfflineIndicator';
import UpdatePrompt from './components/common/UpdatePrompt';
import CookieConsent from './components/common/CookieConsent';
import OnboardingFlow from './components/Onboarding/OnboardingFlow';
import CommandPalette from './components/CommandPalette/CommandPalette';

// Guards
import PrivateRoute from './components/Guards/PrivateRoute';
import PublicRoute from './components/Guards/PublicRoute';
import RoleGuard from './components/Guards/RoleGuard';

// Lazy load pages for code splitting
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const TwoFactorAuth = lazy(() => import('./pages/TwoFactorAuth'));

const Chat = lazy(() => import('./pages/Chat'));
const DirectMessages = lazy(() => import('./pages/DirectMessages'));
const Voice = lazy(() => import('./pages/Voice'));
const Video = lazy(() => import('./pages/Video'));

const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const ServerSettings = lazy(() => import('./pages/ServerSettings'));
const ChannelSettings = lazy(() => import('./pages/ChannelSettings'));

const Discovery = lazy(() => import('./pages/Discovery'));
const Friends = lazy(() => import('./pages/Friends'));
const Notifications = lazy(() => import('./pages/Notifications'));

const ServerBoost = lazy(() => import('./pages/ServerBoost'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const GameHub = lazy(() => import('./pages/GameHub'));

const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const AnalyticsDashboard = lazy(() => import('./pages/AnalyticsDashboard'));
const ModeratorDashboard = lazy(() => import('./pages/ModeratorDashboard'));

const NotFound = lazy(() => import('./pages/NotFound'));
const ServerError = lazy(() => import('./pages/ServerError'));
const Maintenance = lazy(() => import('./pages/Maintenance'));

// Styles
import './styles/animations.css';
import './styles/transitions.css';

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { track } = useAnalytics();
  
  // Auth state
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  // Socket connection
  const { isConnected, reconnecting } = useSocket();
  
  // Theme
  const { theme, systemTheme } = useTheme();
  
  // Network status
  const { isOnline, isSlowConnection } = useNetworkStatus();
  
  // App state
  const { 
    isInitialized,
    isMaintenanceMode,
    updateAvailable,
    firstTimeUser
  } = useSelector(state => state.app);
  
  // Notifications
  const { requestPermission } = useNotifications();
  
  // Set page title
  usePageTitle('IvanChat');
  
  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check for updates
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          registration.addEventListener('updatefound', () => {
            dispatch({ type: 'app/setUpdateAvailable', payload: true });
          });
        }
        
        // Request notification permission
        if (isAuthenticated) {
          requestPermission();
        }
        
        // Initialize user preferences
        if (user?.settings) {
          dispatch({ type: 'settings/load', payload: user.settings });
        }
        
        // Mark app as initialized
        dispatch({ type: 'app/setInitialized', payload: true });
        
        // Track app launch
        track('app_launched', {
          version: import.meta.env.VITE_APP_VERSION,
          platform: 'web',
          theme: theme
        });
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };
    
    initializeApp();
  }, [isAuthenticated, user]);
  
  // Track page views
  useEffect(() => {
    track('page_view', {
      path: location.pathname,
      search: location.search,
      hash: location.hash
    });
  }, [location]);
  
  // Register keyboard shortcuts
  useKeyboardShortcuts([
    {
      keys: ['cmd+k', 'ctrl+k'],
      handler: () => dispatch({ type: 'ui/toggleCommandPalette' }),
      description: 'Open command palette'
    },
    {
      keys: ['cmd+/', 'ctrl+/'],
      handler: () => dispatch({ type: 'ui/toggleShortcutsModal' }),
      description: 'Show keyboard shortcuts'
    },
    {
      keys: ['cmd+,', 'ctrl+,'],
      handler: () => dispatch({ type: 'ui/openSettings' }),
      description: 'Open settings'
    },
    {
      keys: ['esc'],
      handler: () => dispatch({ type: 'ui/closeAllModals' }),
      description: 'Close modals'
    }
  ]);
  
  // Handle connection status
  useEffect(() => {
    if (!isOnline) {
      dispatch({ 
        type: 'notification/show', 
        payload: {
          type: 'warning',
          message: 'You are offline. Some features may not work.',
          duration: 0
        }
      });
    }
  }, [isOnline]);
  
  // Page transition variants
  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: 'easeInOut' }
  };
  
  // Show loading screen while initializing
  if (!isInitialized || authLoading) {
    return <LoadingScreen />;
  }
  
  // Show maintenance page if in maintenance mode
  if (isMaintenanceMode) {
    return <Maintenance />;
  }
  
  // Show onboarding for first-time users
  if (isAuthenticated && firstTimeUser) {
    return <OnboardingFlow />;
  }
  
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <div className="app" data-theme={theme}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
            className="app-content"
          >
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                {/* Public Routes */}
                <Route element={<PublicRoute />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  <Route path="/verify-email/:token" element={<VerifyEmail />} />
                  <Route path="/2fa" element={<TwoFactorAuth />} />
                </Route>
                
                {/* Private Routes */}
                <Route element={<PrivateRoute />}>
                  <Route element={<Layout />}>
                    {/* Main Chat */}
                    <Route path="/" element={<Navigate to="/channels/@me" replace />} />
                    <Route path="/channels/:serverId/:channelId?" element={<Chat />} />
                    <Route path="/channels/@me" element={<DirectMessages />} />
                    <Route path="/channels/@me/:userId" element={<DirectMessages />} />
                    
                    {/* Voice & Video */}
                    <Route path="/voice/:channelId" element={<Voice />} />
                    <Route path="/video/:channelId" element={<Video />} />
                    
                    {/* User */}
                    <Route path="/profile/:userId?" element={<Profile />} />
                    <Route path="/settings/*" element={<Settings />} />
                    <Route path="/friends" element={<Friends />} />
                    <Route path="/notifications" element={<Notifications />} />
                    
                    {/* Server Management */}
                    <Route path="/servers/:serverId/settings/*" element={
                      <RoleGuard allowedRoles={['owner', 'admin', 'moderator']}>
                        <ServerSettings />
                      </RoleGuard>
                    } />
                    <Route path="/channels/:serverId/:channelId/settings" element={
                      <RoleGuard allowedRoles={['owner', 'admin', 'moderator']}>
                        <ChannelSettings />
                      </RoleGuard>
                    } />
                    
                    {/* Discovery & Features */}
                    <Route path="/discovery" element={<Discovery />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                    <Route path="/game-hub" element={<GameHub />} />
                    <Route path="/boost/:serverId" element={<ServerBoost />} />
                    
                    {/* Admin */}
                    <Route path="/admin/*" element={
                      <RoleGuard allowedRoles={['admin']}>
                        <AdminPanel />
                      </RoleGuard>
                    } />
                    <Route path="/analytics/:serverId?" element={
                      <RoleGuard allowedRoles={['owner', 'admin']}>
                        <AnalyticsDashboard />
                      </RoleGuard>
                    } />
                    <Route path="/moderation/:serverId" element={
                      <RoleGuard allowedRoles={['moderator', 'admin']}>
                        <ModeratorDashboard />
                      </RoleGuard>
                    } />
                  </Route>
                </Route>
                
                {/* Error Pages */}
                <Route path="/error" element={<ServerError />} />
                <Route path="/maintenance" element={<Maintenance />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
        
        {/* Global Components */}
        {!isOnline && <OfflineIndicator />}
        {updateAvailable && <UpdatePrompt />}
        {isSlowConnection && (
          <div className="slow-connection-indicator">
            Slow connection detected
          </div>
        )}
        {reconnecting && (
          <div className="reconnecting-indicator">
            Reconnecting to server...
          </div>
        )}
        
        {/* Command Palette */}
        <CommandPalette />
        
        {/* Cookie Consent (only show once) */}
        {!localStorage.getItem('cookieConsent') && <CookieConsent />}
        
        {/* Development Tools */}
        {import.meta.env.DEV && (
          <div className="dev-tools">
            <button
              onClick={() => dispatch({ type: 'ui/toggleDevPanel' })}
              className="dev-tools-toggle"
              title="Toggle Dev Tools"
            >
              🛠️
            </button>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;