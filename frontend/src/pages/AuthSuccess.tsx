import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      fetch('http://localhost:5001/api/auth/google/success', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem('user', JSON.stringify(data.user));
          navigate('/dashboard');
        } else {
          navigate('/login?error=google_auth_failed');
        }
      })
      .catch(() => {
        navigate('/login?error=google_auth_failed');
      });
    } else {
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
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
        <p>Authenticating with Google...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;