import React, { useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useGoogleOAuth, parseJwt } from '../../hooks/useGoogleOAuth';
import { useAuth } from '../../contexts/AuthContext';
import { GOOGLE_CONFIG } from '../../config/google';

// Declare google types
declare global {
  interface Window {
    google: any;
  }
}

const GoogleSignInButton = () => {
  const { initializeGoogleOAuth } = useGoogleOAuth();
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleCallback = useCallback(async (response: any) => {
    try {
      const userObject = parseJwt(response.credential);
      console.log('Google OAuth Success (One Tap):', userObject);
      
      // Send the Google credential to your backend for verification and login
      await loginWithGoogle(response.credential);
      
      // Show success message
      toast.success(`Welcome back, ${userObject.name || userObject.email}!`);
      
      // Navigate to dashboard
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Google OAuth Error:', error);
      toast.error(error.message || 'Google sign-in failed. Please try again.');
    }
  }, [loginWithGoogle, navigate]);

  useEffect(() => {
    // Check if Google script is loaded
    if (window.google && window.google.accounts) {
      initializeGoogleOAuth(handleCallback);

      if (buttonRef.current) {
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular'
        });
      }
    } else {
      // Wait for Google script to load
      const checkGoogleLoaded = setInterval(() => {
        if (window.google && window.google.accounts) {
          clearInterval(checkGoogleLoaded);
          initializeGoogleOAuth(handleCallback);
          
          if (buttonRef.current) {
            window.google.accounts.id.renderButton(buttonRef.current, {
              theme: 'outline',
              size: 'large',
              text: 'signin_with',
              shape: 'rectangular'
            });
          }
        }
      }, 100);

      // Clear interval after 10 seconds to prevent infinite checking
      setTimeout(() => clearInterval(checkGoogleLoaded), 10000);
    }
  }, [initializeGoogleOAuth, handleCallback]);

  const isConfigured = GOOGLE_CONFIG.CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

  return (
    <div style={{ textAlign: 'center', margin: '20px 0' }}>
      {isConfigured ? (
        <div>
          {/* Use Google One Tap Sign-In (preferred method) */}
          <div ref={buttonRef} />
        </div>
      ) : (
        <div style={{ 
          padding: '12px 24px', 
          border: '1px solid #ddd', 
          borderRadius: '4px',
          backgroundColor: '#f9f9f9',
          color: '#666'
        }}>
          <p style={{ margin: '0', fontSize: '14px' }}>
            🔧 Google OAuth Setup Required
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px' }}>
            Please configure your Google Client ID in the environment variables
          </p>
        </div>
      )}
    </div>
  );
};

export default GoogleSignInButton;