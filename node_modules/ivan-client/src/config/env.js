/**
 * Environment Configuration Helper
 * Centralized access to environment variables with type safety
 */
import config from '@/config/env';

// Use the config
console.log(config.api.baseUrl);
console.log(config.features.voiceChat);

// Helper to get environment variable with fallback
const getEnvVar = (key, fallback = '') => {
  return import.meta.env[key] || fallback;
};

// Helper to get boolean environment variable
const getBoolEnv = (key, fallback = false) => {
  const value = getEnvVar(key, String(fallback));
  return value === 'true' || value === true;
};

// Helper to get number environment variable
const getNumberEnv = (key, fallback = 0) => {
  const value = getEnvVar(key, String(fallback));
  return parseInt(value, 10);
};

// Export configuration object
export const config = {
  // Application
  app: {
    name: getEnvVar('VITE_APP_NAME', 'Ivan Chat'),
    version: getEnvVar('VITE_APP_VERSION', '1.0.0'),
    env: getEnvVar('VITE_APP_ENV', 'development'),
    isDevelopment: getEnvVar('VITE_APP_ENV', 'development') === 'development',
    isProduction: getEnvVar('VITE_APP_ENV', 'development') === 'production',
  },

  // API
  api: {
    baseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:5000/api'),
    wsUrl: getEnvVar('VITE_WEBSOCKET_URL', 'ws://localhost:5000'),
    uploadUrl: getEnvVar('VITE_UPLOAD_URL', 'http://localhost:5000/api/upload'),
  },

  // Authentication
  auth: {
    tokenKey: getEnvVar('VITE_AUTH_TOKEN_KEY', 'ivan_auth_token'),
    refreshTokenKey: getEnvVar('VITE_AUTH_REFRESH_TOKEN_KEY', 'ivan_refresh_token'),
    sessionTimeout: getNumberEnv('VITE_SESSION_TIMEOUT', 3600000),
    oauth: {
      google: getEnvVar('VITE_GOOGLE_CLIENT_ID'),
      github: getEnvVar('VITE_GITHUB_CLIENT_ID'),
      discord: getEnvVar('VITE_DISCORD_CLIENT_ID'),
    },
  },

  // WebRTC
  webrtc: {
    stunServer: getEnvVar('VITE_STUN_SERVER', 'stun:stun.l.google.com:19302'),
    turnServer: getEnvVar('VITE_TURN_SERVER'),
    turnUsername: getEnvVar('VITE_TURN_USERNAME'),
    turnPassword: getEnvVar('VITE_TURN_PASSWORD'),
  },

  // Features
  features: {
    voiceChat: getBoolEnv('VITE_ENABLE_VOICE_CHAT', true),
    videoChat: getBoolEnv('VITE_ENABLE_VIDEO_CHAT', true),
    screenShare: getBoolEnv('VITE_ENABLE_SCREEN_SHARE', true),
    fileSharing: getBoolEnv('VITE_ENABLE_FILE_SHARING', true),
    encryption: getBoolEnv('VITE_ENABLE_ENCRYPTION', true),
    translation: getBoolEnv('VITE_ENABLE_TRANSLATION', true),
    marketplace: getBoolEnv('VITE_ENABLE_MARKETPLACE', true),
    gamification: getBoolEnv('VITE_ENABLE_GAMIFICATION', true),
    discovery: getBoolEnv('VITE_ENABLE_DISCOVERY', true),
    analytics: getBoolEnv('VITE_ENABLE_ANALYTICS', false),
    debug: getBoolEnv('VITE_ENABLE_DEBUG', true),
    mockApi: getBoolEnv('VITE_ENABLE_MOCK_API', false),
    serviceWorker: getBoolEnv('VITE_ENABLE_SERVICE_WORKER', false),
  },

  // File Upload
  upload: {
    maxFileSize: getNumberEnv('VITE_MAX_FILE_SIZE', 10485760),
    allowedTypes: getEnvVar('VITE_ALLOWED_FILE_TYPES', 'image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip'),
  },

  // Third-party Services
  services: {
    sentry: {
      dsn: getEnvVar('VITE_SENTRY_DSN'),
    },
    mixpanel: {
      token: getEnvVar('VITE_MIXPANEL_TOKEN'),
    },
    googleAnalytics: {
      id: getEnvVar('VITE_GOOGLE_ANALYTICS_ID'),
    },
    stripe: {
      publicKey: getEnvVar('VITE_STRIPE_PUBLIC_KEY'),
    },
    cloudinary: {
      cloudName: getEnvVar('VITE_CLOUDINARY_CLOUD_NAME'),
      uploadPreset: getEnvVar('VITE_CLOUDINARY_UPLOAD_PRESET'),
    },
    translation: {
      apiKey: getEnvVar('VITE_TRANSLATION_API_KEY'),
      apiUrl: getEnvVar('VITE_TRANSLATION_API_URL'),
      defaultLanguage: getEnvVar('VITE_DEFAULT_LANGUAGE', 'en'),
    },
    maps: {
      mapboxToken: getEnvVar('VITE_MAPBOX_TOKEN'),
      googleMapsApiKey: getEnvVar('VITE_GOOGLE_MAPS_API_KEY'),
    },
  },

  // Push Notifications
  pushNotifications: {
    vapidPublicKey: getEnvVar('VITE_VAPID_PUBLIC_KEY'),
  },

  // Rate Limiting
  rateLimit: {
    message: getNumberEnv('VITE_MESSAGE_RATE_LIMIT', 60),
    api: getNumberEnv('VITE_API_RATE_LIMIT', 100),
  },

  // Cache
  cache: {
    ttl: getNumberEnv('VITE_CACHE_TTL', 3600000),
    enabled: getBoolEnv('VITE_ENABLE_CACHE', true),
  },

  // Security
  security: {
    encryptionKey: getEnvVar('VITE_ENCRYPTION_KEY'),
    cspReportUri: getEnvVar('VITE_CSP_REPORT_URI'),
    enableCSP: getBoolEnv('VITE_ENABLE_CSP', true),
  },
};

export default config;