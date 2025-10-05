// client/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

// Import App and styles
import App from './App';
import './styles/globals.css';
import './styles/variables.css';

// Import store and providers
import { store } from './store';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { EncryptionProvider } from './contexts/EncryptionContext';
import { LocalizationProvider } from './contexts/LocalizationContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { MediaProvider } from './contexts/MediaContext';
import { ModalProvider } from './contexts/ModalContext';

// Import error boundary
import ErrorBoundary from './components/ErrorBoundary';

// Import service worker
import { registerServiceWorker } from './serviceWorker';

// Import utilities
import { initializeAnalytics } from './utils/analytics';
import { initializeMonitoring } from './utils/monitoring';
import { checkBrowserSupport } from './utils/browserSupport';
import { setupInterceptors } from './services/api';

// Initialize Sentry for error tracking (production only)
if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      new BrowserTracing(),
      new Sentry.Replay({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    tracesSampleRate: import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: import.meta.env.VITE_ENVIRONMENT || 'development',
    beforeSend(event, hint) {
      // Filter out certain errors
      if (event.exception) {
        const error = hint.originalException;
        // Don't send network errors in development
        if (error?.message?.includes('NetworkError')) {
          return null;
        }
      }
      return event;
    },
  });
}

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: false,
    },
  },
});

// Setup API interceptors
setupInterceptors(store);

// Check browser support
const browserSupport = checkBrowserSupport();
if (!browserSupport.supported) {
  console.warn('Browser compatibility issues detected:', browserSupport.issues);
}

// Initialize analytics and monitoring
if (import.meta.env.PROD) {
  initializeAnalytics();
  initializeMonitoring();
}

// Performance monitoring
if (import.meta.env.DEV) {
  // Log render performance
  const logRenderTime = () => {
    const perfData = performance.getEntriesByType('navigation')[0];
    console.log('Page load performance:', {
      domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
      loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
      domInteractive: perfData.domInteractive,
      timeToFirstByte: perfData.responseStart - perfData.requestStart,
    });
  };

  window.addEventListener('load', logRenderTime);
}

// Root component with all providers
const Root = () => {
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <ThemeProvider>
                <LocalizationProvider>
                  <AuthProvider>
                    <SocketProvider>
                      <EncryptionProvider>
                        <NotificationProvider>
                          <MediaProvider>
                            <ModalProvider>
                              <App />
                              <Toaster
                                position="bottom-right"
                                reverseOrder={false}
                                gutter={8}
                                containerStyle={{
                                  bottom: 20,
                                  right: 20,
                                }}
                                toastOptions={{
                                  duration: 4000,
                                  style: {
                                    background: 'var(--bg-floating)',
                                    color: 'var(--text-primary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    padding: '12px 16px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                  },
                                  success: {
                                    iconTheme: {
                                      primary: 'var(--color-success)',
                                      secondary: 'var(--bg-floating)',
                                    },
                                  },
                                  error: {
                                    iconTheme: {
                                      primary: 'var(--color-danger)',
                                      secondary: 'var(--bg-floating)',
                                    },
                                  },
                                  loading: {
                                    iconTheme: {
                                      primary: 'var(--color-primary)',
                                      secondary: 'var(--bg-floating)',
                                    },
                                  },
                                }}
                              />
                              {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
                            </ModalProvider>
                          </MediaProvider>
                        </NotificationProvider>
                      </EncryptionProvider>
                    </SocketProvider>
                  </AuthProvider>
                </LocalizationProvider>
              </ThemeProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </Provider>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

// Create root and render
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

// Render the app
root.render(<Root />);

// Register service worker for PWA
if (import.meta.env.PROD) {
  registerServiceWorker();
}

// Hot Module Replacement (HMR) for development
if (import.meta.env.DEV && import.meta.hot) {
  import.meta.hot.accept();
}

// Expose some globals for debugging in development
if (import.meta.env.DEV) {
  window.__IVANCHAT__ = {
    store,
    queryClient,
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.VITE_ENVIRONMENT || 'development',
    debug: {
      clearCache: () => queryClient.clear(),
      resetStore: () => store.dispatch({ type: 'RESET' }),
      getState: () => store.getState(),
    },
  };
}

// Log app initialization
console.log(
  `%c IvanChat %c v${import.meta.env.VITE_APP_VERSION || '1.0.0'} %c`,
  'background:#5865F2; padding:5px 10px; border-radius:3px 0 0 3px; color:#fff; font-weight:bold;',
  'background:#EB459E; padding:5px 10px; border-radius:0 3px 3px 0; color:#fff; font-weight:bold;',
  'background:transparent'
);

// Handle app visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    console.log('App became visible, checking for updates...');
    // Could trigger data refresh here
  }
});

// Handle online/offline events
window.addEventListener('online', () => {
  console.log('Connection restored');
  queryClient.refetchQueries();
});

window.addEventListener('offline', () => {
  console.log('Connection lost');
});

// Cleanup on app unmount
window.addEventListener('beforeunload', (event) => {
  // Save any pending data
  const state = store.getState();
  if (state.chat?.pendingMessages?.length > 0) {
    event.preventDefault();
    event.returnValue = 'You have unsent messages. Are you sure you want to leave?';
  }
});