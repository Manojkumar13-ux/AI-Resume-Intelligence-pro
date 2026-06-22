import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TestLogin: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleQuickLogin = () => {
    setLoading(true);

    // Create mock user
    const mockUser = {
      id: Date.now().toString(),
      email: 'demo@example.com',
      name: 'Demo User',
      credits: 3,
      role: 'user',
      subscription: {
        plan: 'free',
        expiresAt: null
      },
      isPro: false
    };

    localStorage.setItem('token', 'mock-token-' + Date.now());
    localStorage.setItem('user', JSON.stringify(mockUser));

    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(145deg, #0a0a0f 0%, #1a1a2e 40%, #16213e 70%, #0f0f1a 100%)',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '400px',
        padding: '40px',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(24px)',
        borderRadius: '28px',
        border: '1px solid rgba(255,255,255,0.06)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '52px', marginBottom: '16px' }}>🧠</div>
        <h2 style={{ color: 'white', marginBottom: '8px' }}>Quick Login</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '24px', fontSize: '14px' }}>
          Instant login with mock account
        </p>

        <button
          onClick={handleQuickLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '14px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? '⏳ Loading...' : '🚀 Quick Login'}
        </button>

        <p style={{ 
          color: 'rgba(255,255,255,0.2)', 
          fontSize: '12px', 
          marginTop: '16px' 
        }}>
          Login as: demo@example.com (no backend required)
        </p>

        <button
          onClick={() => navigate('/login')}
          style={{
            marginTop: '12px',
            padding: '8px 20px',
            background: 'rgba(255,255,255,0.04)',
            color: 'rgba(255,255,255,0.4)',
            border: '1px solid rgba(255,255,255,0.04)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
};

export default TestLogin;