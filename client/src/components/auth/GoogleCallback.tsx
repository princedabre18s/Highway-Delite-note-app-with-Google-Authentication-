import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the OAuth callback
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          console.error('Google OAuth Error:', error);
          navigate('/login?error=oauth_error');
          return;
        }

        if (code) {
          // Send the authorization code to your backend
          const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/google`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
          });

          if (response.ok) {
            const data = await response.json();
            
            // Store the JWT token
            localStorage.setItem('token', data.token);
            
            // Redirect to dashboard
            navigate('/dashboard');
          } else {
            console.error('Failed to authenticate with backend');
            navigate('/login?error=auth_failed');
          }
        } else {
          navigate('/login?error=no_code');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        navigate('/login?error=callback_error');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column'
    }}>
      <div style={{
        padding: '20px',
        textAlign: 'center'
      }}>
        <h2>Authenticating...</h2>
        <p>Please wait while we complete your Google sign-in.</p>
        <div style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 2s linear infinite',
          margin: '20px auto'
        }}></div>
      </div>
      
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default GoogleCallback;
