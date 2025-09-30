import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import storage from '../services/storage';

const EncryptionContext = createContext({});

export const useEncryption = () => {
  const context = useContext(EncryptionContext);
  if (!context) {
    throw new Error('useEncryption must be used within an EncryptionProvider');
  }
  return context;
};

export const EncryptionProvider = ({ children }) => {
  const { user } = useAuth();
  
  const [encryptionEnabled, setEncryptionEnabled] = useState(false);
  const [keyPair, setKeyPair] = useState(null);
  const [sessionKeys, setSessionKeys] = useState(new Map());
  const [publicKeys, setPublicKeys] = useState(new Map());
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const workerRef = useRef(null);

  // Encryption algorithms
  const algorithms = {
    asymmetric: {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256'
    },
    symmetric: {
      name: 'AES-GCM',
      length: 256
    },
    keyDerivation: {
      name: 'PBKDF2',
      salt: window.crypto.getRandomValues(new Uint8Array(16)),
      iterations: 100000,
      hash: 'SHA-256'
    }
  };

  // Initialize encryption on mount
  useEffect(() => {
    if (user) {
      initializeEncryption();
    }

    return () => {
      cleanup();
    };
  }, [user]);

  // Initialize Web Worker for heavy encryption tasks
  useEffect(() => {
    if (typeof Worker !== 'undefined') {
      workerRef.current = new Worker('/encryption.worker.js');
      
      workerRef.current.onmessage = handleWorkerMessage;
      workerRef.current.onerror = handleWorkerError;
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  // Initialize encryption system
  const initializeEncryption = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if browser supports Web Crypto API
      if (!window.crypto || !window.crypto.subtle) {
        throw new Error('Web Crypto API not supported');
      }

      // Load or generate key pair
      let keys = await loadKeyPair();
      
      if (!keys) {
        keys = await generateKeyPair();
        await saveKeyPair(keys);
      }

      setKeyPair(keys);
      setEncryptionEnabled(true);
      setIsInitialized(true);

      // Load cached public keys
      loadCachedPublicKeys();

    } catch (err) {
      console.error('Failed to initialize encryption:', err);
      setError(err.message);
      setEncryptionEnabled(false);
    } finally {
      setLoading(false);
    }
  };

  // Generate RSA key pair
  const generateKeyPair = async () => {
    try {
      const keyPair = await window.crypto.subtle.generateKey(
        algorithms.asymmetric,
        true,
        ['encrypt', 'decrypt']
      );

      // Export keys for storage
      const publicKey = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
      const privateKey = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

      return {
        publicKey: publicKey,
        privateKey: privateKey,
        publicKeyObject: keyPair.publicKey,
        privateKeyObject: keyPair.privateKey
      };
    } catch (err) {
      throw new Error('Failed to generate key pair: ' + err.message);
    }
  };

  // Generate AES session key
  const generateSessionKey = async () => {
    try {
      const key = await window.crypto.subtle.generateKey(
        algorithms.symmetric,
        true,
        ['encrypt', 'decrypt']
      );

      const exportedKey = await window.crypto.subtle.exportKey('raw', key);
      
      return {
        key: key,
        exportedKey: exportedKey
      };
    } catch (err) {
      throw new Error('Failed to generate session key: ' + err.message);
    }
  };

  // Encrypt message
  const encryptMessage = async (message, recipientId) => {
    try {
      if (!encryptionEnabled || !isInitialized) {
        return { encrypted: false, content: message };
      }

      // Get or create session key for recipient
      let sessionKey = sessionKeys.get(recipientId);
      
      if (!sessionKey) {
        sessionKey = await generateSessionKey();
        sessionKeys.set(recipientId, sessionKey);
      }

      // Encrypt message with session key
      const encoder = new TextEncoder();
      const data = encoder.encode(message);
      
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      
      const encryptedData = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        sessionKey.key,
        data
      );

      // Get recipient's public key
      const recipientPublicKey = await getPublicKey(recipientId);
      
      if (!recipientPublicKey) {
        // Fall back to unencrypted if no public key available
        return { encrypted: false, content: message };
      }

      // Encrypt session key with recipient's public key
      const encryptedSessionKey = await window.crypto.subtle.encrypt(
        {
          name: 'RSA-OAEP'
        },
        recipientPublicKey,
        sessionKey.exportedKey
      );

      return {
        encrypted: true,
        content: arrayBufferToBase64(encryptedData),
        iv: arrayBufferToBase64(iv),
        sessionKey: arrayBufferToBase64(encryptedSessionKey),
        algorithm: 'AES-GCM'
      };
    } catch (err) {
      console.error('Encryption failed:', err);
      return { encrypted: false, content: message };
    }
  };

  // Decrypt message
  const decryptMessage = async (encryptedMessage) => {
    try {
      if (!encryptedMessage.encrypted) {
        return encryptedMessage.content;
      }

      // Decrypt session key with private key
      const encryptedSessionKey = base64ToArrayBuffer(encryptedMessage.sessionKey);
      
      const sessionKeyBuffer = await window.crypto.subtle.decrypt(
        {
          name: 'RSA-OAEP'
        },
        keyPair.privateKeyObject,
        encryptedSessionKey
      );

      // Import session key
      const sessionKey = await window.crypto.subtle.importKey(
        'raw',
        sessionKeyBuffer,
        algorithms.symmetric,
        false,
        ['decrypt']
      );

      // Decrypt message with session key
      const encryptedData = base64ToArrayBuffer(encryptedMessage.content);
      const iv = base64ToArrayBuffer(encryptedMessage.iv);

      const decryptedData = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        sessionKey,
        encryptedData
      );

      const decoder = new TextDecoder();
      return decoder.decode(decryptedData);
    } catch (err) {
      console.error('Decryption failed:', err);
      throw new Error('Failed to decrypt message');
    }
  };

  // Encrypt file
  const encryptFile = async (file, recipientId) => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error('Encryption worker not available'));
        return;
      }

      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const fileData = e.target.result;
        
        // Get or create session key
        let sessionKey = sessionKeys.get(recipientId);
        
        if (!sessionKey) {
          sessionKey = await generateSessionKey();
          sessionKeys.set(recipientId, sessionKey);
        }

        // Send to worker for encryption
        workerRef.current.postMessage({
          type: 'encrypt_file',
          data: fileData,
          sessionKey: sessionKey.exportedKey,
          fileName: file.name,
          fileType: file.type
        });

        // Handle worker response
        const handleResponse = (event) => {
          if (event.data.type === 'file_encrypted') {
            workerRef.current.removeEventListener('message', handleResponse);
            resolve(event.data.result);
          } else if (event.data.type === 'error') {
            workerRef.current.removeEventListener('message', handleResponse);
            reject(new Error(event.data.message));
          }
        };

        workerRef.current.addEventListener('message', handleResponse);
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsArrayBuffer(file);
    });
  };

  // Decrypt file
  const decryptFile = async (encryptedFile, sessionKey) => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error('Decryption worker not available'));
        return;
      }

      // Decrypt session key first
      window.crypto.subtle.decrypt(
        {
          name: 'RSA-OAEP'
        },
        keyPair.privateKeyObject,
        base64ToArrayBuffer(sessionKey)
      ).then(decryptedSessionKey => {
        // Send to worker for decryption
        workerRef.current.postMessage({
          type: 'decrypt_file',
          data: encryptedFile,
          sessionKey: decryptedSessionKey
        });

        // Handle worker response
        const handleResponse = (event) => {
          if (event.data.type === 'file_decrypted') {
            workerRef.current.removeEventListener('message', handleResponse);
            resolve(event.data.result);
          } else if (event.data.type === 'error') {
            workerRef.current.removeEventListener('message', handleResponse);
            reject(new Error(event.data.message));
          }
        };

        workerRef.current.addEventListener('message', handleResponse);
      }).catch(err => {
        reject(new Error('Failed to decrypt session key'));
      });
    });
  };

  // Get public key for a user
  const getPublicKey = async (userId) => {
    try {
      // Check cache first
      if (publicKeys.has(userId)) {
        return publicKeys.get(userId);
      }

      // Fetch from server
      const response = await fetch(`/api/users/${userId}/public-key`);
      const data = await response.json();

      if (data.publicKey) {
        const publicKey = await importPublicKey(data.publicKey);
        publicKeys.set(userId, publicKey);
        
        // Cache in storage
        cachePublicKey(userId, data.publicKey);
        
        return publicKey;
      }

      return null;
    } catch (err) {
      console.error('Failed to get public key:', err);
      return null;
    }
  };

  // Import public key from base64
  const importPublicKey = async (publicKeyBase64) => {
    const publicKeyBuffer = base64ToArrayBuffer(publicKeyBase64);
    
    return await window.crypto.subtle.importKey(
      'spki',
      publicKeyBuffer,
      algorithms.asymmetric,
      false,
      ['encrypt']
    );
  };

  // Export public key to base64
  const exportPublicKey = async () => {
    if (!keyPair?.publicKeyObject) return null;
    
    const exported = await window.crypto.subtle.exportKey('spki', keyPair.publicKeyObject);
    return arrayBufferToBase64(exported);
  };

  // Sign data for verification
  const signData = async (data) => {
    try {
      const encoder = new TextEncoder();
      const encodedData = encoder.encode(JSON.stringify(data));

      // Generate signing key if not exists
      const signingKey = await window.crypto.subtle.generateKey(
        {
          name: 'ECDSA',
          namedCurve: 'P-256'
        },
        false,
        ['sign']
      );

      const signature = await window.crypto.subtle.sign(
        {
          name: 'ECDSA',
          hash: { name: 'SHA-256' }
        },
        signingKey.privateKey,
        encodedData
      );

      return arrayBufferToBase64(signature);
    } catch (err) {
      console.error('Failed to sign data:', err);
      return null;
    }
  };

  // Verify signature
  const verifySignature = async (data, signature, publicKey) => {
    try {
      const encoder = new TextEncoder();
      const encodedData = encoder.encode(JSON.stringify(data));
      const signatureBuffer = base64ToArrayBuffer(signature);

      return await window.crypto.subtle.verify(
        {
          name: 'ECDSA',
          hash: { name: 'SHA-256' }
        },
        publicKey,
        signatureBuffer,
        encodedData
      );
    } catch (err) {
      console.error('Failed to verify signature:', err);
      return false;
    }
  };

  // Helper functions
  const arrayBufferToBase64 = (buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const base64ToArrayBuffer = (base64) => {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  };

  // Storage functions
  const saveKeyPair = async (keys) => {
    storage.setItem('encryption_keys', {
      publicKey: arrayBufferToBase64(keys.publicKey),
      privateKey: arrayBufferToBase64(keys.privateKey)
    }, true); // Encrypt in storage
  };

  const loadKeyPair = async () => {
    const stored = storage.getItem('encryption_keys', true);
    
    if (!stored) return null;

    try {
      const publicKeyObject = await window.crypto.subtle.importKey(
        'spki',
        base64ToArrayBuffer(stored.publicKey),
        algorithms.asymmetric,
        false,
        ['encrypt']
      );

      const privateKeyObject = await window.crypto.subtle.importKey(
        'pkcs8',
        base64ToArrayBuffer(stored.privateKey),
        algorithms.asymmetric,
        false,
        ['decrypt']
      );

      return {
        publicKey: base64ToArrayBuffer(stored.publicKey),
        privateKey: base64ToArrayBuffer(stored.privateKey),
        publicKeyObject,
        privateKeyObject
      };
    } catch (err) {
      console.error('Failed to load key pair:', err);
      return null;
    }
  };

  const cachePublicKey = (userId, publicKey) => {
    const cached = storage.getItem('cached_public_keys') || {};
    cached[userId] = {
      key: publicKey,
      timestamp: Date.now()
    };
    storage.setItem('cached_public_keys', cached);
  };

  const loadCachedPublicKeys = () => {
    const cached = storage.getItem('cached_public_keys') || {};
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    Object.entries(cached).forEach(async ([userId, data]) => {
      if (now - data.timestamp < maxAge) {
        try {
          const publicKey = await importPublicKey(data.key);
          publicKeys.set(userId, publicKey);
        } catch (err) {
          console.error('Failed to load cached public key:', err);
        }
      }
    });
  };

  // Worker message handlers
  const handleWorkerMessage = (event) => {
    const { type, result, error } = event.data;

    switch (type) {
      case 'file_encrypted':
      case 'file_decrypted':
        // Handled in respective functions
        break;
      case 'error':
        console.error('Worker error:', error);
        break;
      default:
        break;
    }
  };

  const handleWorkerError = (error) => {
    console.error('Worker error:', error);
  };

  // Cleanup
  const cleanup = () => {
    sessionKeys.clear();
    publicKeys.clear();
    setKeyPair(null);
    setEncryptionEnabled(false);
    setIsInitialized(false);
  };

  // Toggle encryption
  const toggleEncryption = async (enabled) => {
    if (enabled && !isInitialized) {
      await initializeEncryption();
    } else {
      setEncryptionEnabled(enabled);
    }
  };

  // Rotate keys
  const rotateKeys = async () => {
    try {
      setLoading(true);
      
      // Generate new key pair
      const newKeys = await generateKeyPair();
      
      // Save new keys
      await saveKeyPair(newKeys);
      
      // Update state
      setKeyPair(newKeys);
      
      // Clear session keys to force regeneration
      sessionKeys.clear();
      
      // Upload new public key to server
      const publicKeyBase64 = await exportPublicKey();
      await fetch('/api/users/public-key', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ publicKey: publicKeyBase64 })
      });

      return true;
    } catch (err) {
      console.error('Failed to rotate keys:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    encryptionEnabled,
    isInitialized,
    loading,
    error,
    encryptMessage,
    decryptMessage,
    encryptFile,
    decryptFile,
    signData,
    verifySignature,
    toggleEncryption,
    rotateKeys,
    exportPublicKey,
    getPublicKey
  };

  return (
    <EncryptionContext.Provider value={value}>
      {children}
    </EncryptionContext.Provider>
  );
};

export default EncryptionContext;