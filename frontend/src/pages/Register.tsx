import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('Account created successfully! 🎉');
        navigate('/dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Register error:', err);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(145deg, #0a0a0f 0%, #1a1a2e 40%, #16213e 70%, #0f0f1a 100%)',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
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
        boxShadow: '0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
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
          Create Account
        </h2>
        <p style={{ 
          color: 'rgba(255,255,255,0.4)', 
          marginBottom: '28px', 
          fontSize: '14px',
          fontWeight: '300'
        }}>
          Start optimizing your resume today
        </p>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            color: '#f87171',
            padding: '12px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontSize: '14px',
            border: '1px solid rgba(239, 68, 68, 0.15)',
            wordBreak: 'break-word'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '14px', textAlign: 'left' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              fontWeight: '500', 
              color: 'rgba(255,255,255,0.6)', 
              fontSize: '13px',
              letterSpacing: '0.3px'
            }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
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
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(79, 70, 229, 0.5)';
                e.target.style.boxShadow = '0 0 20px rgba(79, 70, 229, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: '14px', textAlign: 'left' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              fontWeight: '500', 
              color: 'rgba(255,255,255,0.6)', 
              fontSize: '13px',
              letterSpacing: '0.3px'
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
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(79, 70, 229, 0.5)';
                e.target.style.boxShadow = '0 0 20px rgba(79, 70, 229, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: '14px', textAlign: 'left' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              fontWeight: '500', 
              color: 'rgba(255,255,255,0.6)', 
              fontSize: '13px',
              letterSpacing: '0.3px'
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
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(79, 70, 229, 0.5)';
                e.target.style.boxShadow = '0 0 20px rgba(79, 70, 229, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <p style={{ 
              fontSize: '12px', 
              color: 'rgba(255,255,255,0.3)', 
              marginTop: '4px' 
            }}>
              Minimum 6 characters
            </p>
          </div>

          <div style={{ marginBottom: '22px', textAlign: 'left' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              fontWeight: '500', 
              color: 'rgba(255,255,255,0.6)', 
              fontSize: '13px',
              letterSpacing: '0.3px'
            }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(79, 70, 229, 0.5)';
                e.target.style.boxShadow = '0 0 20px rgba(79, 70, 229, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                e.target.style.boxShadow = 'none';
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
              opacity: loading ? 0.6 : 1,
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 24px rgba(79, 70, 229, 0.3)'
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ 
          marginTop: '18px', 
          fontSize: '14px', 
          color: 'rgba(255,255,255,0.4)'
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{ 
            color: '#a78bfa', 
            textDecoration: 'none', 
            fontWeight: '500',
            transition: 'color 0.3s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#c084fc'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#a78bfa'}
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;