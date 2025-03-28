import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fingerprint } from 'lucide-react';

const BiometricAuth = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(
    localStorage.getItem('biometricRegistered') === 'true'
  );
  const navigate = useNavigate();
  const abortControllerRef = useRef(null);
/*global PublicKeyCredential*/
  // Check if WebAuthn is supported
  useEffect(() => {
    const checkSupport = async () => {
      try {
        if (window.PublicKeyCredential &&
            PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
          const isUVPAASupported = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          setIsSupported(isUVPAASupported);
          
          // Optional: Check for conditional mediation (autofill UI)
          if (PublicKeyCredential.isConditionalMediationAvailable) {
            await PublicKeyCredential.isConditionalMediationAvailable();
          }
        }
      } catch (err) {
        console.error("WebAuthn support check failed:", err);
        setIsSupported(false);
      }
    };

    checkSupport();
  }, []);

  // Clean up abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Register device (first-time setup)
  const registerBiometric = async () => {
    try {
      setIsRegistering(true);
      setError('');

      // In production, get this from your backend
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      // A unique user handle (in production, use a real user ID)
      const userId = new Uint8Array(16);
      window.crypto.getRandomValues(userId);

      const publicKeyCredentialCreationOptions = {
        challenge: challenge,
        rp: {
          name: "Secure Password Manager",
          id: window.location.hostname
        },
        user: {
          id: userId,
          name: "user@example.com", // Replace with actual username
          displayName: "User"       // Replace with actual display name
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 },  // ES256
          { type: "public-key", alg: -257 } // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform", // Force device authenticator
          userVerification: "required",        // Require biometric/pin
          requireResidentKey: true             // Discoverable credential
        },
        timeout: 60000,
        attestation: "none"
      };

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      });

      console.log("Registration successful", credential);
      
      // In production, send credential to your backend for storage
      // await storeCredentialOnServer(credential);
      
      localStorage.setItem('biometricRegistered', 'true');
      setRegistrationComplete(true);
      setIsRegistering(false);
      
      // Try immediate authentication
      await authenticateWithBiometric();
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error("Registration failed:", err);
        setError(`Registration failed: ${err.message || 'Unknown error'}`);
        
        // Special error handling
        if (err.name === 'NotAllowedError') {
          setError('Registration was cancelled by user');
        } else if (err.name === 'InvalidStateError') {
          setError('You already have a biometric credential registered');
        }
      }
      setIsRegistering(false);
    }
  };

  // Authenticate with device lock screen
  const authenticateWithBiometric = async () => {
    if (isAuthenticating) return;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    try {
      setIsAuthenticating(true);
      setError('');
      abortControllerRef.current = new AbortController();

      // In production, get this from your backend
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const publicKeyCredentialRequestOptions = {
        challenge: challenge,
        rpId: window.location.hostname,
        timeout: 60000,
        userVerification: "required", // Force biometric/pin verification
        allowCredentials: []          // Empty array allows any registered credential
      };

      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
        mediation: "optional",       // Works with conditional UI (autofill)
        signal: abortControllerRef.current.signal
      });

      console.log("Authentication successful", assertion);
      
      // In production, verify the assertion with your backend
      // await verifyAssertionWithServer(assertion);
      
      navigate('/password-manager/main');
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error("Authentication failed:", err);
        
        // User-friendly error messages
        if (err.name === 'NotAllowedError') {
          setError('Authentication was cancelled or not completed');
        } else if (err.name === 'SecurityError') {
          setError('Authentication failed due to security restrictions');
        } else {
          setError(`Authentication failed: ${err.message || 'Unknown error'}`);
        }
      }
    } finally {
      setIsAuthenticating(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-slate-800/50 border border-emerald-500/20 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <Fingerprint className="mx-auto h-12 w-12 text-emerald-500" />
          <h2 className="mt-4 text-2xl font-bold">Device Authentication</h2>
          <p className="mt-2 text-gray-400">
            {isSupported 
              ? "Use your device lock screen (Windows Hello, Touch ID, etc.)"
              : "Biometric authentication not available on this device"}
          </p>
        </div>

        {!isSupported ? (
          <div className="text-center text-red-400">
            Your device doesn't support platform authenticators. Please use a different authentication method.
          </div>
        ) : !registrationComplete ? (
          <div className="text-center">
            <p className="mb-4 text-gray-300">Register your device for biometric authentication</p>
            <button
              onClick={registerBiometric}
              disabled={isRegistering}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRegistering ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Setting Up...
                </span>
              ) : 'Register Device'}
            </button>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={authenticateWithBiometric}
              disabled={isAuthenticating}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAuthenticating ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Waiting for Biometric...
                </span>
              ) : 'Unlock with Device'}
            </button>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            {isAuthenticating && (
              <p className="mt-2 text-sm text-gray-400">
                Check your device for biometric prompt (Windows Hello, Touch ID, etc.)
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BiometricAuth;