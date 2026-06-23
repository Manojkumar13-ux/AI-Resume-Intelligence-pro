import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// ============================================
// API CONFIGURATION
// ============================================
const API_URL = import.meta.env.VITE_API_URL || 'https://ai-resume-intelligence-pro-1.onrender.com';

const AuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      console.log('✅ Token received from Google OAuth');
      localStorage.setItem('token', token);
      
      // Fetch user profile using the token
      fetch(`${API_URL}/api/auth/google/success`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (data.success) {
          console.log('✅ User data received:', data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
          navigate('/dashboard');
        } else {
          console.error('❌ Google auth failed:', data.message);
          navigate('/login?error=google_auth_failed');
        }
      })
      .catch((error) => {
        console.error('❌ Google auth error:', error);
        navigate('/login?error=google_auth_failed');
      });
    } else {
      console.error('❌ No token received from Google');
      navigate('/login?error=no_token');
    }
  }, [location, navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(145deg, #0a0a0f 0%, #1a1a2e 40%, #16213e 70%, #0f0f1a 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          fontSize: '48px', 
          marginBottom: '16px',
          animation: 'pulse 1.5s ease-in-out infinite'
        }}>⏳</div>
        <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Authenticating...</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Please wait while we log you in with Google.</p>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default AuthSuccess;