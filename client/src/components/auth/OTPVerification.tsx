import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../../services/api';

interface OTPVerificationProps {
  email: string;
  onBack: () => void;
  onVerify?: (otp: string) => Promise<void>;
  title?: string;
  submitButtonText?: string;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ 
  email, 
  onBack, 
  onVerify,
  title = "Verify Your Email",
  submitButtonText = "Verify OTP"
}) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      if (onVerify) {
        // Custom verification handler (e.g., for password reset)
        await onVerify(otp);
      } else {
        // Default registration verification
        const response = await api.post('/auth/verify-otp', {
          email,
          otp
        });

        const { token, user } = response.data;
        
        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        toast.success(response.data.message || 'Registration completed successfully!');
        
        // Show welcome message with a slight delay for better UX
        setTimeout(() => {
          toast.success(`🎉 Welcome to Notes App, ${user.name}! Let's create your first note!`, {
            duration: 5000,
            icon: '👋',
          });
        }, 1500);
        
        navigate('/dashboard');
      }
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      toast.loading('Resending OTP...');
      await api.post('/auth/resend-otp', { email });
      toast.dismiss();
      toast.success('New OTP sent to your email!');
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2>{title}</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          We've sent a 6-digit verification code to:
        </p>
        <p style={{ fontWeight: 'bold', color: '#007bff' }}>{email}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Enter OTP:
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="123456"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '18px',
              textAlign: 'center',
              letterSpacing: '5px'
            }}
            maxLength={6}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading || otp.length !== 6 ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading || otp.length !== 6 ? 'not-allowed' : 'pointer',
            marginBottom: '15px'
          }}
        >
          {loading ? 'Verifying...' : submitButtonText}
        </button>

        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleResendOTP}
            style={{
              background: 'none',
              border: 'none',
              color: '#007bff',
              textDecoration: 'underline',
              cursor: 'pointer',
              marginRight: '20px'
            }}
          >
            Resend OTP
          </button>
          
          <button
            type="button"
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              color: '#666',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            Back to Registration
          </button>
        </div>
      </form>

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '4px',
        fontSize: '14px',
        color: '#666'
      }}>
        <p style={{ margin: 0 }}>
          📧 Didn't receive the email? Check your spam folder or click "Resend OTP"
        </p>
        <p style={{ margin: '5px 0 0 0' }}>
          ⏰ The OTP will expire in 10 minutes
        </p>
      </div>
    </div>
  );
};

export default OTPVerification;
