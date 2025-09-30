/**
 * Client-side encryption utilities
 */

import CryptoJS from 'crypto-js';
import { Buffer } from 'buffer';

/**
 * Generate random encryption key
 */
export const generateKey = (length = 32) => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Buffer.from(array).toString('hex');
};

/**
 * Generate random IV
 */
export const generateIV = () => {
  return CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
};

/**
 * Encrypt text with AES-256-GCM
 */
export const encryptText = (text, key) => {
  const iv = generateIV();
  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: CryptoJS.enc.Hex.parse(iv),
    mode: CryptoJS.mode.GCM,
    padding: CryptoJS.pad.Pkcs7
  });

  return {
    ciphertext: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
    iv: iv,
    tag: encrypted.tag ? encrypted.tag.toString(CryptoJS.enc.Base64) : null,
    salt: encrypted.salt ? encrypted.salt.toString(CryptoJS.enc.Base64) : null
  };
};

/**
 * Decrypt text
 */
export const decryptText = (encryptedData, key) => {
  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Base64.parse(encryptedData.ciphertext),
    iv: CryptoJS.enc.Hex.parse(encryptedData.iv),
    salt: encryptedData.salt ? CryptoJS.enc.Base64.parse(encryptedData.salt) : undefined,
    tag: encryptedData.tag ? CryptoJS.enc.Base64.parse(encryptedData.tag) : undefined
  });

  const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
    iv: cipherParams.iv,
    mode: CryptoJS.mode.GCM,
    padding: CryptoJS.pad.Pkcs7
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
};

/**
 * Hash data with SHA-256
 */
export const hashData = (data) => {
  return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
};

/**
 * Generate HMAC
 */
export const generateHMAC = (data, secret) => {
  return CryptoJS.HmacSHA256(data, secret).toString(CryptoJS.enc.Hex);
};

/**
 * Verify HMAC
 */
export const verifyHMAC = (data, hmac, secret) => {
  const calculatedHmac = generateHMAC(data, secret);
  return calculatedHmac === hmac;
};

/**
 * Derive key using PBKDF2
 */
export const deriveKey = (password, salt, iterations = 100000) => {
  const key = CryptoJS.PBKDF2(password, salt, {
    keySize: 256/32,
    iterations: iterations,
    hasher: CryptoJS.algo.SHA256
  });
  
  return key.toString(CryptoJS.enc.Hex);
};

/**
 * Generate RSA key pair
 */
export const generateRSAKeyPair = async () => {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256'
    },
    true,
    ['encrypt', 'decrypt']
  );

  const publicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);
  const privateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

  return {
    publicKey: btoa(String.fromCharCode(...new Uint8Array(publicKey))),
    privateKey: btoa(String.fromCharCode(...new Uint8Array(privateKey)))
  };
};

/**
 * Encrypt with RSA public key
 */
export const encryptWithPublicKey = async (data, publicKeyBase64) => {
  const publicKeyBuffer = Uint8Array.from(atob(publicKeyBase64), c => c.charCodeAt(0));
  
  const publicKey = await crypto.subtle.importKey(
    'spki',
    publicKeyBuffer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256'
    },
    false,
    ['encrypt']
  );

  const encoder = new TextEncoder();
  const encrypted = await crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    publicKey,
    encoder.encode(data)
  );

  return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
};

/**
 * Decrypt with RSA private key
 */
export const decryptWithPrivateKey = async (encryptedData, privateKeyBase64) => {
  const privateKeyBuffer = Uint8Array.from(atob(privateKeyBase64), c => c.charCodeAt(0));
  const encryptedBuffer = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
  
  const privateKey = await crypto.subtle.importKey(
    'pkcs8',
    privateKeyBuffer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256'
    },
    false,
    ['decrypt']
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    privateKey,
    encryptedBuffer
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
};

/**
 * Generate digital signature
 */
export const generateSignature = async (data, privateKeyBase64) => {
  const privateKeyBuffer = Uint8Array.from(atob(privateKeyBase64), c => c.charCodeAt(0));
  
  const privateKey = await crypto.subtle.importKey(
    'pkcs8',
    privateKeyBuffer,
    {
      name: 'RSA-PSS',
      hash: 'SHA-256'
    },
    false,
    ['sign']
  );

  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign(
    {
      name: 'RSA-PSS',
      saltLength: 32
    },
    privateKey,
    encoder.encode(data)
  );

  return btoa(String.fromCharCode(...new Uint8Array(signature)));
};

/**
 * Verify digital signature
 */
export const verifySignature = async (data, signature, publicKeyBase64) => {
  const publicKeyBuffer = Uint8Array.from(atob(publicKeyBase64), c => c.charCodeAt(0));
  const signatureBuffer = Uint8Array.from(atob(signature), c => c.charCodeAt(0));
  
  const publicKey = await crypto.subtle.importKey(
    'spki',
    publicKeyBuffer,
    {
      name: 'RSA-PSS',
      hash: 'SHA-256'
    },
    false,
    ['verify']
  );

  const encoder = new TextEncoder();
  const isValid = await crypto.subtle.verify(
    {
      name: 'RSA-PSS',
      saltLength: 32
    },
    publicKey,
    signatureBuffer,
    encoder.encode(data)
  );

  return isValid;
};

/**
 * Secure random string generator
 */
export const generateSecureRandom = (length = 32) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = new Uint8Array(length);
  crypto.getRandomValues(values);
  
  return Array.from(values)
    .map(x => charset[x % charset.length])
    .join('');
};

/**
 * Constant time string comparison
 */
export const constantTimeCompare = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
};

export default {
  generateKey,
  generateIV,
  encryptText,
  decryptText,
  hashData,
  generateHMAC,
  verifyHMAC,
  deriveKey,
  generateRSAKeyPair,
  encryptWithPublicKey,
  decryptWithPrivateKey,
  generateSignature,
  verifySignature,
  generateSecureRandom,
  constantTimeCompare
};