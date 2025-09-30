import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HelmetProvider } from 'react-helmet-async';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import calendar from 'dayjs/plugin/calendar';
import duration from 'dayjs/plugin/duration';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import advancedFormat from 'dayjs/plugin/advancedFormat';

// App Component
import App from './App';

// Providers
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { EncryptionProvider } from './contexts/EncryptionContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ModalProvider } from './contexts/ModalContext';
import { VoiceProvider } from './contexts/VoiceContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { LocalizationProvider } from './contexts/LocalizationContext';

// Store
import { store } from './store';

// Styles
import './styles/globals.css';
import './styles/variables.css';
import './styles/themes/dark.css';
import './styles/themes/light.css';
import './styles/animations.css';
import './styles/utilities.css';

// Services
import { initializeServices } from './services';
import { initializeSocketHandlers } from './services/socket';
import { initializeWebRTC } from './services/webrtc';
import { initializeAnalytics } from './services/analytics';
import { initializeEncryption } from './services/encryption';
import { initializeNotifications } from './services/notifications';
import { initializeStorage } from './services/storage';
import { initializePerformanceMonitoring } from './services/performance';

// Utils
import { setupAxiosInterceptors } from './utils/axios';
import { registerServiceWorker } from './utils/serviceWorker';
import { detectDevice } from './utils/device';
import { checkBrowserCompatibility } from './utils/compatibility';
import { loadUserPreferences } from './utils/preferences';
import { initializeKeyboardShortcuts } from './utils/shortcuts';
import { setupErrorReporting } from './utils/errorReporting';

// Error Boundary
import ErrorBoundary from './components/ErrorBoundary';

// ========================
// Environment Configuration
// ========================

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:5000';
const CDN_URL = process.env.REACT_APP_CDN_URL || 'http://localhost:5000/cdn';

// Feature Flags
const FEATURES = {
  ENABLE_ENCRYPTION: process.env.REACT_APP_ENABLE_ENCRYPTION === 'true',
  ENABLE_VOICE: process.env.REACT_APP_ENABLE_VOICE === 'true',
  ENABLE_VIDEO: process.env.REACT_APP_ENABLE_VIDEO === 'true',
  ENABLE_ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  ENABLE_SENTRY: process.env.REACT_APP_ENABLE_SENTRY === 'true',
  ENABLE_PWA: process.env.REACT_APP_ENABLE_PWA === 'true',
  ENABLE_EXPERIMENTAL: process.env.REACT_APP_ENABLE_EXPERIMENTAL === 'true'
};

// ========================
// Initialize Sentry
// ========================

if (FEATURES.ENABLE_SENTRY && isProduction) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    integrations: [
      new BrowserTracing(),
      new Sentry.Replay({
        maskAllText: false,
        blockAllMedia: false,
      })
    ],
    tracesSampleRate: isProduction ? 0.1 : 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    beforeSend(event, hint) {
      // Filter out certain errors
      if (event.exception) {
        const error = hint.originalException;
        // Filter network errors in development
        if (isDevelopment && error?.message?.includes('Network')) {
          return null;
        }
      }
      return event;
    }
  });
}

// ========================
// Configure Dayjs
// ========================

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.extend(calendar);
dayjs.extend(duration);
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(advancedFormat);

// Update locale settings
dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'a few seconds',
    m: 'a minute',
    mm: '%d minutes',
    h: 'an hour',
    hh: '%d hours',
    d: 'a day',
    dd: '%d days',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years'
  },
  calendar: {
    lastDay: '[Yesterday at] h:mm A',
    sameDay: '[Today at] h:mm A',
    nextDay: '[Tomorrow at] h:mm A',
    lastWeek: 'dddd [at] h:mm A',
    nextWeek: 'dddd [at] h:mm A',
    sameElse: 'MM/DD/YYYY'
  }
});

// ========================
// Configure Axios
// ========================

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 30000;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['X-Client-Version'] = process.env.REACT_APP_VERSION || '1.0.0';

// Setup interceptors
setupAxiosInterceptors(axios, store);

// ========================
// Configure React Query
// ========================

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always'
    },
    mutations: {
      retry: false
    }
  }
});

// ========================
// Global Error Handlers
// ========================

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  if (FEATURES.ENABLE_SENTRY) {
    Sentry.captureException(event.reason);
  }
  
  // Prevent default browser behavior
  event.preventDefault();
  
  // Show user-friendly error notification
  if (window.__showErrorNotification) {
    window.__showErrorNotification({
      type: 'error',
      title: 'Something went wrong',
      message: 'An unexpected error occurred. Please try again.'
    });
  }
});

// Handle global errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  
  if (FEATURES.ENABLE_SENTRY) {
    Sentry.captureException(event.error);
  }
  
  // Prevent default browser behavior for certain errors
  if (event.error?.name === 'ChunkLoadError') {
    event.preventDefault();
    // Reload the page to get the latest chunks
    if (!window.__hasReloaded) {
      window.__hasReloaded = true;
      window.location.reload();
    }
  }
});

// ========================
// Performance Monitoring
// ========================

if (FEATURES.ENABLE_ANALYTICS) {
  // Web Vitals
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    const sendToAnalytics = (metric) => {
      const { name, delta, value, id } = metric;
      
      // Send to analytics service
      if (window.analytics) {
        window.analytics.track('Web Vitals', {
          metric: name,
          value: Math.round(name === 'CLS' ? value * 1000 : value),
          delta: Math.round(name === 'CLS' ? delta * 1000 : delta),
          id
        });
      }
      
      // Log in development
      if (isDevelopment) {
        console.log(`[Web Vitals] ${name}:`, value);
      }
    };
    
    getCLS(sendToAnalytics);
    getFID(sendToAnalytics);
    getFCP(sendToAnalytics);
    getLCP(sendToAnalytics);
    getTTFB(sendToAnalytics);
  });
  
  // Custom performance metrics
  initializePerformanceMonitoring();
}

// ========================
// Initialize App
// ========================

class AppInitializer {
  constructor() {
    this.initialized = false;
    this.initPromises = [];
  }
  
  async initialize() {
    if (this.initialized) return;
    
    try {
      // Check browser compatibility
      const compatibility = checkBrowserCompatibility();
      if (!compatibility.supported) {
        this.showCompatibilityWarning(compatibility);
      }
      
      // Detect device capabilities
      const deviceInfo = detectDevice();
      window.__deviceInfo = deviceInfo;
      
      // Load user preferences
      const preferences = await loadUserPreferences();
      window.__userPreferences = preferences;
      
      // Initialize services in parallel where possible
      const initPromises = [
        this.initializeCore(),
        this.initializeAuth(),
        this.initializeRealtime(),
        this.initializeFeatures()
      ];
      
      await Promise.all(initPromises);
      
      // Setup keyboard shortcuts
      initializeKeyboardShortcuts();
      
      // Setup error reporting
      setupErrorReporting({
        sentry: FEATURES.ENABLE_SENTRY,
        console: isDevelopment
      });
      
      this.initialized = true;
      console.log('[App] Initialization complete');
      
    } catch (error) {
      console.error('[App] Initialization failed:', error);
      this.showInitializationError(error);
    }
  }
  
  async initializeCore() {
    // Initialize core services
    await initializeServices({
      apiUrl: API_BASE_URL,
      cdnUrl: CDN_URL
    });
    
    // Initialize storage
    await initializeStorage();
  }
  
  async initializeAuth() {
    // Check for existing session
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Validate token
        const response = await axios.get('/api/auth/validate');
        if (response.data.valid) {
          store.dispatch({ type: 'auth/setUser', payload: response.data.user });
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('[Auth] Token validation failed:', error);
        localStorage.removeItem('token');
      }
    }
  }
  
  async initializeRealtime() {
    // Initialize WebSocket connection
    await initializeSocketHandlers(WS_URL, store);
    
    // Initialize WebRTC for voice/video
    if (FEATURES.ENABLE_VOICE) {
      await initializeWebRTC();
    }
    
    // Initialize notifications
    await initializeNotifications();
  }
  
  async initializeFeatures() {
    // Initialize encryption
    if (FEATURES.ENABLE_ENCRYPTION) {
      await initializeEncryption();
    }
    
    // Initialize analytics
    if (FEATURES.ENABLE_ANALYTICS) {
      await initializeAnalytics({
        trackingId: process.env.REACT_APP_GA_TRACKING_ID,
        userId: store.getState().auth?.user?.id
      });
    }
  }
  
  showCompatibilityWarning(compatibility) {
    const missingFeatures = compatibility.missingFeatures.join(', ');
    console.warn(`[Compatibility] Missing features: ${missingFeatures}`);
    
    // Show warning banner
    const banner = document.createElement('div');
    banner.className = 'compatibility-warning';
    banner.innerHTML = `
      <p>Your browser may not support all features. For the best experience, please use a modern browser.</p>
      <button onclick="this.parentElement.remove()">Dismiss</button>
    `;
    document.body.prepend(banner);
  }
  
  showInitializationError(error) {
    const errorContainer = document.getElementById('root');
    errorContainer.innerHTML = `
      <div class="initialization-error">
        <h1>Failed to initialize Ivan</h1>
        <p>${error.message}</p>
        <button onclick="window.location.reload()">Retry</button>
      </div>
    `;
  }
}

// ========================
// Root Component Wrapper
// ========================

const RootComponent = () => {
  const [initialized, setInitialized] = React.useState(false);
  const [error, setError] = React.useState(null);
  
  React.useEffect(() => {
    const initializer = new AppInitializer();
    
    initializer.initialize()
      .then(() => setInitialized(true))
      .catch(err => setError(err));
  }, []);
  
  if (error) {
    return (
      <div className="app-error">
        <h1>Initialization Error</h1>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>Reload</button>
      </div>
    );
  }
  
  if (!initialized) {
    return (
      <div className="app-loading">
        <div className="loading-spinner" />
        <p>Initializing Ivan...</p>
      </div>
    );
  }
  
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <HelmetProvider>
                <ThemeProvider>
                  <LocalizationProvider>
                    <AuthProvider>
                      <SocketProvider>
                        <EncryptionProvider>
                          <NotificationProvider>
                            <VoiceProvider>
                              <SettingsProvider>
                                <ModalProvider>
                                  <App />
                                  {isDevelopment && (
                                    <ReactQueryDevtools 
                                      initialIsOpen={false} 
                                      position="bottom-right"
                                    />
                                  )}
                                </ModalProvider>
                              </SettingsProvider>
                            </VoiceProvider>
                          </NotificationProvider>
                        </EncryptionProvider>
                      </SocketProvider>
                    </AuthProvider>
                  </LocalizationProvider>
                </ThemeProvider>
              </HelmetProvider>
            </BrowserRouter>
            {isDevelopment && <ReactQueryDevtools />}
          </QueryClientProvider>
        </Provider>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

// ========================
// Mount Application
// ========================

const container = document.getElementById('root');

if (!container) {
  throw new Error('Failed to find root element');
}

// Create root using React 18's new API
const root = createRoot(container, {
  onRecoverableError: (error, errorInfo) => {
    console.error('Recoverable error:', error, errorInfo);
    if (FEATURES.ENABLE_SENTRY) {
      Sentry.captureException(error, {
        contexts: { react: errorInfo }
      });
    }
  }
});

// Render the app
root.render(<RootComponent />);

// ========================
// Service Worker
// ========================

if (FEATURES.ENABLE_PWA && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    registerServiceWorker({
      onUpdate: (registration) => {
        // Show update notification
        if (window.__showUpdateNotification) {
          window.__showUpdateNotification({
            title: 'Update Available',
            message: 'A new version of Ivan is available. Click to update.',
            action: () => {
              if (registration.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              }
            }
          });
        }
      },
      onSuccess: (registration) => {
        console.log('[ServiceWorker] Registration successful:', registration);
      },
      onError: (error) => {
        console.error('[ServiceWorker] Registration failed:', error);
      }
    });
  });
}

// ========================
// Hot Module Replacement
// ========================

if (module.hot) {
  module.hot.accept('./App', () => {
    console.log('[HMR] Accepting the updated App module');
  });
  
  module.hot.accept('./store', () => {
    console.log('[HMR] Accepting the updated store module');
  });
}

// ========================
// Development Tools
// ========================

if (isDevelopment) {
  // Expose useful globals for debugging
  window.__IVAN__ = {
    version: process.env.REACT_APP_VERSION || '1.0.0',
    env: process.env.NODE_ENV,
    features: FEATURES,
    store,
    queryClient,
    
    // Debug utilities
    debug: {
      clearCache: () => {
        localStorage.clear();
        sessionStorage.clear();
        queryClient.clear();
        console.log('[Debug] Cache cleared');
      },
      
      resetApp: () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/';
      },
      
      toggleFeature: (feature) => {
        FEATURES[feature] = !FEATURES[feature];
        console.log(`[Debug] Feature ${feature}:`, FEATURES[feature]);
      },
      
      getState: () => store.getState(),
      
      dispatch: (action) => store.dispatch(action),
      
      inspectSocket: () => window.__socket,
      
      performance: () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.table({
          'DNS Lookup': `${Math.round(perfData.domainLookupEnd - perfData.domainLookupStart)}ms`,
          'TCP Connection': `${Math.round(perfData.connectEnd - perfData.connectStart)}ms`,
          'Request Time': `${Math.round(perfData.responseEnd - perfData.requestStart)}ms`,
          'DOM Interactive': `${Math.round(perfData.domInteractive)}ms`,
          'DOM Complete': `${Math.round(perfData.domComplete)}ms`,
          'Load Complete': `${Math.round(perfData.loadEventEnd)}ms`
        });
      }
    }
  };
  
  // Log app info
  console.log('%c🚀 Ivan Chat', 'font-size: 20px; font-weight: bold; color: #5865F2;');
  console.log('%cVersion:', 'font-weight: bold;', process.env.REACT_APP_VERSION || '1.0.0');
  console.log('%cEnvironment:', 'font-weight: bold;', process.env.NODE_ENV);
  console.log('%cFeatures:', 'font-weight: bold;', FEATURES);
  console.log('%cDebug tools available at window.__IVAN__', 'color: #888;');
  
  // Performance observer
  const perfObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'measure') {
        console.log(`[Performance] ${entry.name}: ${Math.round(entry.duration)}ms`);
      }
    }
  });
  
  perfObserver.observe({ entryTypes: ['measure'] });
}

// ========================
// Export for testing
// ========================

export { store, queryClient, RootComponent };