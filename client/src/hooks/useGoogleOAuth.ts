import { useCallback } from 'react';
import { GOOGLE_CONFIG } from '../config/google';

export const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export const useGoogleOAuth = () => {
  // Method 1: Using Google Identity Services (One Tap)
  const signInWithGoogle = useCallback(() => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.prompt();
    } else {
      console.warn('Google OAuth not loaded yet');
    }
  }, []);

  const initializeGoogleOAuth = useCallback((onSuccess: (response: any) => void) => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CONFIG.CLIENT_ID,
        callback: onSuccess,
      });
    }
  }, []);

  // Method 2: Using OAuth 2.0 with redirect (for the callback URL you configured)
  const signInWithGoogleRedirect = useCallback(() => {
    const params = new URLSearchParams({
      client_id: GOOGLE_CONFIG.CLIENT_ID,
      redirect_uri: GOOGLE_CONFIG.REDIRECT_URIS[0],
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent'
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }, []);

  return { 
    signInWithGoogle, 
    initializeGoogleOAuth, 
    signInWithGoogleRedirect 
  };
};