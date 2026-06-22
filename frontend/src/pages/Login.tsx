import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ Google Login Handler
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5001/api/auth/google';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Try real backend login first
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
        setLoading(false);
        return;
      }
    } catch (err) {
      console.log('Backend login failed, using mock login');
    }

    // ✅ FALLBACK: Accept ANY credentials
    // This allows login with any email/password
    if (!email || !password) {
      setError('Please enter email and password');
      setLoading(false);
      return;
    }

    // Create mock user with ANY credentials
    const mockUser = {
      id: Date.now().toString(),
      email: email,
      name: email ? email.split('@')[0] : 'User',
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
    
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0f',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background glows */}
      <div style={{
        position: 'absolute',
        top: '-30%',
        right: '-20%',
        width: '60%',
        height: '60%',
        background: 'radial-gradient(ellipse, rgba(79, 70, 229, 0.15) 0%, transparent 70%)',
        borderRadius: '50%'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-30%',
        left: '-20%',
        width: '60%',
        height: '60%',
        background: 'radial-gradient(ellipse, rgba(124, 58, 237, 0.1) 0%, transparent 70%)',
        borderRadius: '50%'
      }} />

      {/* Back Button - Top Left */}
      <Link 
        to="/" 
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          color: 'rgba(255,255,255,0.4)',
          textDecoration: 'none',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'color 0.3s ease',
          zIndex: 10
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
      >
        <span style={{ fontSize: '18px' }}>←</span> Back
      </Link>

      <div style={{
        maxWidth: '420px',
        width: '100%',
        padding: '44px 40px',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(24px)',
        borderRadius: '28px',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ fontSize: '52px', marginBottom: '8px' }}>🧠</div>
        <h2 style={{
          fontSize: '26px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '4px'
        }}>
          Welcome Back
        </h2>
        <p style={{
          color: 'rgba(255,255,255,0.4)',
          marginBottom: '28px',
          fontSize: '14px'
        }}>
          Sign in to your account
        </p>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            color: '#f87171',
            padding: '12px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontSize: '14px',
            border: '1px solid rgba(239, 68, 68, 0.15)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px', textAlign: 'left' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontWeight: '500',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '13px'
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                fontSize: '16px',
                color: 'white',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px', textAlign: 'left' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontWeight: '500',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '13px'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                fontSize: '16px',
                color: 'white',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
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
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          margin: '20px 0'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
        </div>

        {/* ✅ Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          style={{
            width: '100%',
            padding: '14px',
            background: 'rgba(255,255,255,0.06)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '14px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        <div style={{
          marginTop: '18px',
          fontSize: '14px',
          color: 'rgba(255,255,255,0.4)'
        }}>
          Don't have an account?{' '}
          <Link to="/register" style={{
            color: '#a78bfa',
            textDecoration: 'none',
            fontWeight: '500'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#c084fc'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#a78bfa'}
          >
            Sign Up
          </Link>
        </div>

        {/* ✅ Show that ANY credentials work */}
        <div style={{
          marginTop: '12px',
          padding: '10px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <p style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.3)',
            margin: 0
          }}>
            🔑 Any email/password works • Or use your real account
          </p>
        </div>

        {/* ✅ Show demo credentials hint */}
        <div style={{
          marginTop: '8px',
          padding: '8px',
          background: 'rgba(79, 70, 229, 0.05)',
          borderRadius: '6px'
        }}>
          <p style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.25)',
            margin: 0
          }}>
            Demo: demo@example.com / any password
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;