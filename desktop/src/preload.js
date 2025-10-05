// desktop/src/preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getVersion: () => ipcRenderer.invoke('get-version'),
  getPlatform: () => ipcRenderer.invoke('get-platform'),
  
  // File operations
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  downloadFile: (url, filename) => ipcRenderer.send('download-file', url, filename),
  
  // Window operations
  setBadgeCount: (count) => ipcRenderer.send('set-badge-count', count),
  flashFrame: (flag) => ipcRenderer.send('flash-frame', flag),
  
  // Navigation
  onNavigate: (callback) => {
    ipcRenderer.on('navigate', (event, route) => callback(route));
  },
  
  // Server operations
  onCreateServer: (callback) => {
    ipcRenderer.on('create-server', callback);
  },
  onJoinServer: (callback) => {
    ipcRenderer.on('join-server', callback);
  },
  
  // Download events
  onDownloadProgress: (callback) => {
    ipcRenderer.on('download-progress', (event, data) => callback(data));
  },
  onDownloadComplete: (callback) => {
    ipcRenderer.on('download-complete', (event, data) => callback(data));
  },
  onDownloadFailed: (callback) => {
    ipcRenderer.on('download-failed', (event, data) => callback(data));
  },
  
  // Remove listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});

// Expose crypto API for secure operations
contextBridge.exposeInMainWorld('cryptoAPI', {
  getRandomValues: (array) => crypto.getRandomValues(array),
  subtle: crypto.subtle
});

// Performance monitoring
contextBridge.exposeInMainWorld('performanceAPI', {
  memory: () => performance.memory,
  timing: () => performance.timing,
  navigation: () => performance.navigation
});