import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link, useLocation } from 'react-router-dom';
import Login from './pages/Login';

// ============================================
// HOME PAGE
// ============================================
function Home() {
  const navigate = useNavigate();
  const [backendStatus, setBackendStatus] = useState('Checking...');

  useEffect(() => {
    fetch('http://localhost:5001/api/health')
      .then(res => res.json())
      .then(() => setBackendStatus('🟢 Online'))
      .catch(() => setBackendStatus('🔴 Offline'));
  }, []);

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
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(ellipse at 30% 50%, rgba(79, 70, 229, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(124, 58, 237, 0.08) 0%, transparent 50%)',
        animation: 'rotate 40s linear infinite',
      }} />
      
      <div style={{
        maxWidth: '520px',
        width: '100%',
        padding: '64px 48px',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(24px)',
        borderRadius: '32px',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ 
          fontSize: '72px', 
          marginBottom: '16px',
          filter: 'drop-shadow(0 0 30px rgba(124, 58, 237, 0.3))'
        }}>🧠</div>
        
        <h1 style={{
          fontSize: '38px',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 40%, #c084fc 70%, #e879f9 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '8px',
          letterSpacing: '-0.02em'
        }}>
          Resume Intelligence Pro
        </h1>
        
        <p style={{
          fontSize: '16px',
          color: 'rgba(255,255,255,0.5)',
          marginBottom: '6px',
          fontWeight: '300'
        }}>
          AI-powered resume analysis for your dream job
        </p>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          background: 'rgba(34, 197, 94, 0.1)',
          borderRadius: '20px',
          marginBottom: '36px',
          marginTop: '12px'
        }}>
          <span style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: backendStatus === '🟢 Online' ? '#22c55e' : '#ef4444',
            animation: backendStatus === '🟢 Online' ? 'pulse 2s infinite' : 'none',
            boxShadow: backendStatus === '🟢 Online' ? '0 0 12px rgba(34, 197, 94, 0.4)' : 'none'
          }} />
          <span style={{
            fontSize: '13px',
            color: backendStatus === '🟢 Online' ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)',
            fontWeight: '500'
          }}>
            {backendStatus}
          </span>
        </div>

        <button
          onClick={() => navigate('/login')}
          style={{
            padding: '18px 48px',
            fontSize: '20px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            cursor: 'pointer',
            boxShadow: '0 4px 30px rgba(79, 70, 229, 0.4)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            width: '100%',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 8px 40px rgba(79, 70, 229, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 30px rgba(79, 70, 229, 0.4)';
          }}
        >
          <span style={{ position: 'relative', zIndex: 1 }}>🚀 Get Started</span>
        </button>

        <p style={{
          marginTop: '20px',
          fontSize: '13px',
          color: 'rgba(255,255,255,0.25)'
        }}>
          Free • No credit card required • 3 free analyses
        </p>
      </div>

      <style>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

// ============================================
// REGISTER PAGE
// ============================================
function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        navigate('/dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
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
      background: '#0a0a0f',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '420px',
        width: '100%',
        padding: '44px 40px',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(24px)',
        borderRadius: '28px',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
        textAlign: 'center'
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
          fontSize: '14px'
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
            border: '1px solid rgba(239, 68, 68, 0.15)'
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
              fontSize: '13px'
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
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '14px', textAlign: 'left' }}>
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

          <div style={{ marginBottom: '14px', textAlign: 'left' }}>
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
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>
              Minimum 6 characters
            </p>
          </div>

          <div style={{ marginBottom: '22px', textAlign: 'left' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              fontWeight: '500', 
              color: 'rgba(255,255,255,0.6)', 
              fontSize: '13px'
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
            fontWeight: '500'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#c084fc'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#a78bfa'}
          >
            Sign In
          </Link>
        </div>

        <Link to="/" style={{
          display: 'block',
          marginTop: '18px',
          fontSize: '13px',
          color: 'rgba(255,255,255,0.2)',
          textDecoration: 'none'
        }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

// ============================================
// ANALYSIS PAGE
// ============================================
function Analysis() {
  const location = useLocation();
  const navigate = useNavigate();
  const analysis = location.state?.analysis;
  const resumeName = location.state?.resumeName;

  useEffect(() => {
    if (!analysis) {
      navigate('/dashboard');
    }
  }, [analysis, navigate]);

  if (!analysis) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0f',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <p>No analysis data available</p>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              marginTop: '20px',
              padding: '12px 30px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#0a0a0f',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      color: 'white',
      overflowX: 'hidden'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(24px)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.06)',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }}>🧠</span>
          <h1 style={{ 
            fontSize: '20px', 
            fontWeight: '700',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>
            Resume Analysis
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {resumeName && (
            <span style={{ 
              color: 'rgba(255,255,255,0.6)', 
              fontSize: '14px',
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              📄 {resumeName}
            </span>
          )}
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '8px 20px',
              background: 'rgba(79, 70, 229, 0.2)',
              color: '#a78bfa',
              border: '1px solid rgba(79, 70, 229, 0.2)',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(79, 70, 229, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(79, 70, 229, 0.2)';
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '24px'
      }}>
        <div style={{
          maxWidth: '900px',
          width: '100%',
          padding: '24px',
          background: 'rgba(34, 197, 94, 0.08)',
          borderRadius: '16px',
          border: '1px solid rgba(34, 197, 94, 0.15)',
          textAlign: 'center',
          transition: 'all 0.3s ease',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(34, 197, 94, 0.2)';
          e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
          e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.15)';
        }}>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>ATS Score</div>
          <div style={{ fontSize: '56px', fontWeight: '700', color: '#22c55e' }}>
            {analysis.score}%
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginTop: '8px',
            fontSize: '13px'
          }}>
            <span style={{ color: '#34d399' }}>📝 {analysis.atsCompatibility?.format || 0}% Format</span>
            <span style={{ color: '#60a5fa' }}>🔑 {analysis.atsCompatibility?.keywords || 0}% Keywords</span>
            <span style={{ color: '#fbbf24' }}>💼 {analysis.atsCompatibility?.experience || 0}% Experience</span>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        maxWidth: '900px',
        margin: '0 auto 24px auto'
      }}>
        <div style={{
          padding: '20px',
          background: 'rgba(34, 197, 94, 0.08)',
          borderRadius: '16px',
          border: '1px solid rgba(34, 197, 94, 0.12)',
          transition: 'all 0.3s ease',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(34, 197, 94, 0.15)';
          e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
          e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.12)';
        }}>
          <div style={{ fontSize: '14px', color: '#22c55e', fontWeight: '600', marginBottom: '8px' }}>✅ Strengths</div>
          <ul style={{ margin: 0, paddingLeft: '16px', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
            {analysis.strengths && analysis.strengths.map((s: string, i: number) => <li key={i} style={{ marginBottom: '4px' }}>{s}</li>)}
          </ul>
        </div>

        <div style={{
          padding: '20px',
          background: 'rgba(239, 68, 68, 0.08)',
          borderRadius: '16px',
          border: '1px solid rgba(239, 68, 68, 0.12)',
          transition: 'all 0.3s ease',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(239, 68, 68, 0.15)';
          e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
          e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.12)';
        }}>
          <div style={{ fontSize: '14px', color: '#f87171', fontWeight: '600', marginBottom: '8px' }}>⚠️ Weaknesses</div>
          <ul style={{ margin: 0, paddingLeft: '16px', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
            {analysis.weaknesses && analysis.weaknesses.map((w: string, i: number) => <li key={i} style={{ marginBottom: '4px' }}>{w}</li>)}
          </ul>
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '24px'
      }}>
        <div style={{
          maxWidth: '900px',
          width: '100%',
          padding: '20px',
          background: 'rgba(251, 191, 36, 0.06)',
          borderRadius: '16px',
          border: '1px solid rgba(251, 191, 36, 0.12)',
          transition: 'all 0.3s ease',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(251, 191, 36, 0.1)';
          e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
          e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.12)';
        }}>
          <div style={{ fontSize: '14px', color: '#fbbf24', fontWeight: '600', marginBottom: '8px' }}>💡 AI Suggestions</div>
          <ul style={{ margin: 0, paddingLeft: '16px', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
            {analysis.suggestions && analysis.suggestions.map((s: string, i: number) => <li key={i} style={{ marginBottom: '4px' }}>{s}</li>)}
          </ul>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        maxWidth: '900px',
        margin: '0 auto 24px auto'
      }}>
        <div style={{
          padding: '20px',
          background: 'rgba(59, 130, 246, 0.08)',
          borderRadius: '16px',
          border: '1px solid rgba(59, 130, 246, 0.12)',
          transition: 'all 0.3s ease',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(59, 130, 246, 0.15)';
          e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
          e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.12)';
        }}>
          <div style={{ fontSize: '14px', color: '#60a5fa', fontWeight: '600', marginBottom: '8px' }}>🎯 Skills Found</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {analysis.skills && analysis.skills.map((s: string, i: number) => (
              <span key={i} style={{
                padding: '6px 14px',
                background: 'rgba(59, 130, 246, 0.15)',
                borderRadius: '20px',
                fontSize: '13px',
                color: '#93c5fd',
                border: '1px solid rgba(59, 130, 246, 0.1)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.25)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)';
                e.currentTarget.style.transform = 'scale(1)';
              }}>
                {s}
              </span>
            ))}
          </div>
        </div>

        <div style={{
          padding: '20px',
          background: 'rgba(168, 85, 247, 0.08)',
          borderRadius: '16px',
          border: '1px solid rgba(168, 85, 247, 0.12)',
          transition: 'all 0.3s ease',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(168, 85, 247, 0.15)';
          e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
          e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.12)';
        }}>
          <div style={{ fontSize: '14px', color: '#a855f7', fontWeight: '600', marginBottom: '8px' }}>🔑 Missing Keywords</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {analysis.missingKeywords && analysis.missingKeywords.map((k: string, i: number) => (
              <span key={i} style={{
                padding: '6px 14px',
                background: 'rgba(168, 85, 247, 0.15)',
                borderRadius: '20px',
                fontSize: '13px',
                color: '#c084fc',
                border: '1px solid rgba(168, 85, 247, 0.1)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(168, 85, 247, 0.25)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(168, 85, 247, 0.15)';
                e.currentTarget.style.transform = 'scale(1)';
              }}>
                {k}
              </span>
            ))}
          </div>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '8px' }}>
            Add these to boost your ATS score
          </p>
        </div>
      </div>

      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '20px',
        background: 'rgba(34, 211, 238, 0.06)',
        borderRadius: '16px',
        border: '1px solid rgba(34, 211, 238, 0.12)',
        transition: 'all 0.3s ease',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(34, 211, 238, 0.15)';
        e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
        e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.12)';
      }}>
        <div style={{ fontSize: '14px', color: '#22d3ee', fontWeight: '600', marginBottom: '8px' }}>🚀 Recommended Roles</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {analysis.recommendedRoles && analysis.recommendedRoles.map((r: string, i: number) => (
            <span key={i} style={{
              padding: '6px 16px',
              background: 'rgba(34, 211, 238, 0.1)',
              borderRadius: '20px',
              fontSize: '14px',
              color: '#67e8f9',
              border: '1px solid rgba(34, 211, 238, 0.1)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(34, 211, 238, 0.2)';
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(34, 211, 238, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.1)';
            }}>
              {r}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// DASHBOARD PAGE
// ============================================
function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState('');
  const [entryRole, setEntryRole] = useState('');
  const [company, setCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token) {
      navigate('/login');
      return;
    }
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Only PDF files are allowed');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) {
      alert('Please select a resume file');
      return;
    }
    if (!name || !entryRole || !company) {
      alert('Please fill in all fields');
      return;
    }

    setUploading(true);
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('resume', selectedFile);
    formData.append('name', name);
    formData.append('entryRole', entryRole);
    formData.append('company', company);
    formData.append('jobDescription', jobDescription || '');

    try {
      const uploadRes = await fetch('http://localhost:5001/api/resume/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.message || 'Upload failed');

      const analyzeRes = await fetch(`http://localhost:5001/api/resume/${uploadData.resumeId}/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, entryRole, company, jobDescription })
      });

      const analyzeData = await analyzeRes.json();
      if (!analyzeRes.ok) throw new Error(analyzeData.message || 'Analysis failed');

      setUploading(false);
      setSelectedFile(null);
      setName('');
      setEntryRole('');
      setCompany('');
      setJobDescription('');
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      navigate('/analysis', {
        state: { analysis: analyzeData.analysis, resumeName: selectedFile.name }
      });

    } catch (error: any) {
      console.error('Error:', error);
      alert('Error: ' + error.message);
      setUploading(false);
    }
  };

  if (!user) {
    return <div style={{ color: 'white' }}>Loading...</div>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#0a0a0f',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      color: 'white',
      overflowX: 'hidden'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(24px)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.06)',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }}>🧠</span>
          <h1 style={{
            fontSize: '20px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>
            Resume Intelligence Pro
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '14px',
            background: 'rgba(79, 70, 229, 0.2)',
            padding: '6px 14px',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            👋 {user.name}
          </span>
          <button
            onClick={() => navigate('/my-data')}
            style={{
              padding: '8px 20px',
              background: 'rgba(79, 70, 229, 0.2)',
              color: '#a78bfa',
              border: '1px solid rgba(79, 70, 229, 0.2)',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(79, 70, 229, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(79, 70, 229, 0.2)';
            }}
          >
            📁 My Data
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 20px',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '24px'
      }}>
        <div style={{
          maxWidth: '600px',
          width: '100%',
          padding: '24px',
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(24px)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.06)',
          transition: 'all 0.3s ease',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
        }}>
          <h2 style={{
            fontSize: '18px',
            marginBottom: '16px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            📤 Upload Your Resume
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                padding: '14px 16px',
                width: '100%',
                boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(79, 70, 229, 0.25)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
            />
            <input
              type="text"
              placeholder="Entry Role (e.g., Software Engineer)"
              value={entryRole}
              onChange={(e) => setEntryRole(e.target.value)}
              style={{
                padding: '14px 16px',
                width: '100%',
                boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(124, 58, 237, 0.25)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
            />
            <input
              type="text"
              placeholder="Company Name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              style={{
                padding: '14px 16px',
                width: '100%',
                boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(168, 85, 247, 0.25)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
            />
            <textarea
              placeholder="Job Description (optional)"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={3}
              style={{
                padding: '14px 16px',
                width: '100%',
                boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(236, 72, 153, 0.25)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '15px',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'Arial, sans-serif',
                transition: 'all 0.3s ease'
              }}
            />

            <div
              onClick={() => document.getElementById('fileInput')?.click()}
              style={{
                padding: '20px',
                width: '100%',
                boxSizing: 'border-box',
                border: '2px dashed rgba(79, 70, 229, 0.3)',
                borderRadius: '12px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: selectedFile ? 'rgba(79, 70, 229, 0.15)' : 'rgba(255,255,255,0.03)',
                borderColor: selectedFile ? 'rgba(79, 70, 229, 0.6)' : 'rgba(79, 70, 229, 0.3)'
              }}
            >
              <input
                id="fileInput"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📄</div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: 0 }}>
                {selectedFile ? selectedFile.name : 'Click to select your resume (PDF)'}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginTop: '4px' }}>
                Max 10MB
              </p>
            </div>

            <button
              onClick={handleUploadAndAnalyze}
              disabled={uploading || !selectedFile}
              style={{
                padding: '16px',
                width: '100%',
                boxSizing: 'border-box',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: uploading || !selectedFile ? 'default' : 'pointer',
                opacity: uploading || !selectedFile ? 0.6 : 1,
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 25px rgba(79, 70, 229, 0.3)'
              }}
            >
              {uploading ? '⏳ Uploading & Analyzing...' : '📂 Upload & Analyze'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MY DATA PAGE (with Delete functionality)
// ============================================
function MyData() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token) {
      navigate('/login');
      return;
    }
    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchResumes(token);
  }, [navigate]);

  const fetchResumes = async (token: string) => {
    try {
      const res = await fetch('http://localhost:5001/api/resume/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setResumes(data.history || []);
      }
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAnalysis = (resume: any) => {
    navigate('/analysis', { state: { analysis: resume.analysis, resumeName: resume.fileName } });
  };

  const handleDeleteResume = async (resumeId: string) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    setDeletingId(resumeId);
    try {
      const res = await fetch(`http://localhost:5001/api/resume/${resumeId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Remove the deleted resume from the list
        setResumes(prev => prev.filter(r => r.id !== resumeId));
      } else {
        alert(data.message || 'Failed to delete resume');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('An error occurred while deleting');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div style={{ color: 'white' }}>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#0a0a0f',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      color: 'white',
      overflowX: 'hidden'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(24px)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.06)',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }}>🧠</span>
          <h1 style={{
            fontSize: '20px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>
            My Data
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '14px',
            background: 'rgba(79, 70, 229, 0.2)',
            padding: '6px 14px',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            👋 {user.name}
          </span>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '8px 20px',
              background: 'rgba(79, 70, 229, 0.2)',
              color: '#a78bfa',
              border: '1px solid rgba(79, 70, 229, 0.2)',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(79, 70, 229, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(79, 70, 229, 0.2)';
            }}
          >
            ← Back to Dashboard
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/login');
            }}
            style={{
              padding: '8px 20px',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{
        padding: '24px',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(24px)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}>
        <h2 style={{
          fontSize: '22px',
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          📁 All Resumes
        </h2>

        {resumes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
            <p>No resumes uploaded yet</p>
            <p style={{ fontSize: '13px', marginTop: '8px' }}>Upload your first resume to get started</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {resumes.map((resume: any, index: number) => (
              <div
                key={resume.id}
                style={{
                  padding: '16px 20px',
                  background: `rgba(255,255,255,${0.02 + index * 0.01})`,
                  borderRadius: '12px',
                  border: `1px solid rgba(255,255,255,${0.05 + index * 0.02})`,
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(79, 70, 229, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.3)';
                  e.currentTarget.style.transform = 'scale(1.01)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `rgba(255,255,255,${0.02 + index * 0.01})`;
                  e.currentTarget.style.borderColor = `rgba(255,255,255,${0.05 + index * 0.02})`;
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <p style={{ fontWeight: '600', fontSize: '16px', margin: 0, color: 'rgba(255,255,255,0.9)' }}>
                      {resume.fileName}
                    </p>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: '4px 0 0 0' }}>
                      {resume.name} • {resume.entryRole} • {resume.company}
                    </p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', margin: '2px 0 0 0' }}>
                      📅 {new Date(resume.createdAt).toLocaleDateString()} • Target: {resume.entryRole}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      background: resume.status === 'analyzed' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                      color: resume.status === 'analyzed' ? '#22c55e' : '#fbbf24',
                      border: `1px solid ${resume.status === 'analyzed' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(251, 191, 36, 0.2)'}`
                    }}>
                      {resume.status}
                    </span>
                    <span style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: resume.score >= 70 ? '#22c55e' : '#fbbf24'
                    }}>
                      {resume.score || 0}%
                    </span>
                    <button
                      onClick={() => handleViewAnalysis(resume)}
                      style={{
                        padding: '8px 16px',
                        background: 'rgba(79, 70, 229, 0.2)',
                        color: '#a78bfa',
                        border: '1px solid rgba(79, 70, 229, 0.2)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(79, 70, 229, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(79, 70, 229, 0.2)';
                      }}
                    >
                      View Analysis
                    </button>
                    <button
                      onClick={() => handleDeleteResume(resume.id)}
                      disabled={deletingId === resume.id}
                      style={{
                        padding: '8px 16px',
                        background: 'rgba(239, 68, 68, 0.15)',
                        color: '#f87171',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '8px',
                        cursor: deletingId === resume.id ? 'default' : 'pointer',
                        fontSize: '13px',
                        transition: 'all 0.3s ease',
                        opacity: deletingId === resume.id ? 0.6 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (deletingId !== resume.id) {
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (deletingId !== resume.id) {
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                        }
                      }}
                    >
                      {deletingId === resume.id ? 'Deleting...' : '🗑 Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// MAIN APP
// ============================================
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/my-data" element={<MyData />} />
      </Routes>
    </Router>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}