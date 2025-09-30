/**
 * WebAuthn - Web Authentication API implementation
 * FIDO2/WebAuthn standard implementation for passwordless authentication
 */

import { encode, decode } from 'base64-arraybuffer';

class WebAuthn {
  constructor() {
    this.rpName = 'Ivan Chat';
    this.rpId = window.location.hostname;
    this.supported = this.checkSupport();
  }

  /**
   * Check WebAuthn support
   */
  checkSupport() {
    return !!(window.PublicKeyCredential);
  }

  /**
   * Begin registration process
   */
  async beginRegistration(user) {
    if (!this.supported) {
      throw new Error('WebAuthn not supported in this browser');
    }

    try {
      // Request registration options from server
      const response = await fetch('/api/webauthn/register/begin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name,
          userDisplayName: user.displayName || user.name
        })
      });

      if (!response.ok) {
        throw new Error('Failed to begin registration');
      }

      const options = await response.json();
      
      // Convert challenge and user.id from base64
      options.publicKey.challenge = decode(options.publicKey.challenge);
      options.publicKey.user.id = decode(options.publicKey.user.id);
      
      // Convert excludeCredentials if present
      if (options.publicKey.excludeCredentials) {
        options.publicKey.excludeCredentials = options.publicKey.excludeCredentials.map(cred => ({
          ...cred,
          id: decode(cred.id)
        }));
      }

      // Create credentials
      const credential = await navigator.credentials.create(options);
      
      // Complete registration
      return await this.completeRegistration(credential, options.sessionId);
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  /**
   * Complete registration process
   */
  async completeRegistration(credential, sessionId) {
    const attestationResponse = {
      id: credential.id,
      rawId: encode(credential.rawId),
      type: credential.type,
      response: {
        clientDataJSON: encode(credential.response.clientDataJSON),
        attestationObject: encode(credential.response.attestationObject)
      },
      sessionId: sessionId
    };

    // Get transports if available
    if (credential.response.getTransports) {
      attestationResponse.response.transports = credential.response.getTransports();
    }

    // Send to server for verification
    const response = await fetch('/api/webauthn/register/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`
      },
      body: JSON.stringify(attestationResponse)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration verification failed');
    }

    return await response.json();
  }

  /**
   * Begin authentication process
   */
  async beginAuthentication(userId) {
    if (!this.supported) {
      throw new Error('WebAuthn not supported in this browser');
    }

    try {
      // Request authentication options from server
      const response = await fetch('/api/webauthn/authenticate/begin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        throw new Error('Failed to begin authentication');
      }

      const options = await response.json();
      
      // Convert challenge from base64
      options.publicKey.challenge = decode(options.publicKey.challenge);
      
      // Convert allowCredentials
      if (options.publicKey.allowCredentials) {
        options.publicKey.allowCredentials = options.publicKey.allowCredentials.map(cred => ({
          ...cred,
          id: decode(cred.id)
        }));
      }

      // Get assertion
      const assertion = await navigator.credentials.get(options);
      
      // Complete authentication
      return await this.completeAuthentication(assertion, options.sessionId);
    } catch (error) {
      console.error('Authentication failed:', error);
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  /**
   * Complete authentication process
   */
  async completeAuthentication(assertion, sessionId) {
    const authResponse = {
      id: assertion.id,
      rawId: encode(assertion.rawId),
      type: assertion.type,
      response: {
        clientDataJSON: encode(assertion.response.clientDataJSON),
        authenticatorData: encode(assertion.response.authenticatorData),
        signature: encode(assertion.response.signature)
      },
      sessionId: sessionId
    };

    // Include userHandle if present
    if (assertion.response.userHandle) {
      authResponse.response.userHandle = encode(assertion.response.userHandle);
    }

    // Send to server for verification
    const response = await fetch('/api/webauthn/authenticate/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(authResponse)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Authentication verification failed');
    }

    const result = await response.json();
    
    // Store authentication token if provided
    if (result.token) {
      this.storeAuthToken(result.token);
    }

    return result;
  }

  /**
   * Check if platform authenticator is available
   */
  async isPlatformAuthenticatorAvailable() {
    if (!this.supported) {
      return false;
    }

    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  }

  /**
   * Check if conditional mediation is available
   */
  async isConditionalMediationAvailable() {
    if (!this.supported) {
      return false;
    }

    if (PublicKeyCredential.isConditionalMediationAvailable) {
      return await PublicKeyCredential.isConditionalMediationAvailable();
    }

    return false;
  }

  /**
   * Autofill authentication (Conditional UI)
   */
  async autofillAuthentication() {
    if (!await this.isConditionalMediationAvailable()) {
      throw new Error('Conditional mediation not available');
    }

    try {
      const response = await fetch('/api/webauthn/authenticate/conditional', {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Failed to get conditional authentication options');
      }

      const options = await response.json();
      
      // Convert challenge and credentials
      options.publicKey.challenge = decode(options.publicKey.challenge);
      
      if (options.publicKey.allowCredentials) {
        options.publicKey.allowCredentials = options.publicKey.allowCredentials.map(cred => ({
          ...cred,
          id: decode(cred.id)
        }));
      }

      // Add conditional mediation
      options.mediation = 'conditional';

      // Get assertion with conditional UI
      const assertion = await navigator.credentials.get(options);
      
      if (assertion) {
        return await this.completeAuthentication(assertion, options.sessionId);
      }

      return null;
    } catch (error) {
      console.error('Conditional authentication failed:', error);
      throw error;
    }
  }

  /**
   * Get registered credentials for user
   */
  async getCredentials(userId) {
    const response = await fetch(`/api/webauthn/credentials/${userId}`, {
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`
      }
    });

    if (!response.ok) {
      return [];
    }

    return await response.json();
  }

  /**
   * Remove credential
   */
  async removeCredential(credentialId) {
    const response = await fetch(`/api/webauthn/credential/${credentialId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`
      }
    });

    return response.ok;
  }

  /**
   * Update credential name
   */
  async updateCredentialName(credentialId, name) {
    const response = await fetch(`/api/webauthn/credential/${credentialId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`
      },
      body: JSON.stringify({ name })
    });

    return response.ok;
  }

  /**
   * Get authentication token
   */
  getAuthToken() {
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  }

  /**
   * Store authentication token
   */
  storeAuthToken(token) {
    sessionStorage.setItem('auth_token', token);
  }

  /**
   * Clear authentication
   */
  clearAuthentication() {
    sessionStorage.removeItem('auth_token');
    localStorage.removeItem('auth_token');
  }
}

export default new WebAuthn();