// Google OAuth Configuration
export const GOOGLE_CONFIG = {
  // Replace with your actual Google Client ID from Google Console
  CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
  
  // Authorized JavaScript origins (configured in your Google Console)
  AUTHORIZED_ORIGINS: [
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  
  // Redirect URIs (configured in your Google Console)
  REDIRECT_URIS: [
    'http://localhost:3000/auth/google/callback',
    "http://localhost:3001/auth/google/callback"
  ]
};

// Google OAuth Scopes
export const GOOGLE_SCOPES = [
  'openid',
  'email',
  'profile'
];
