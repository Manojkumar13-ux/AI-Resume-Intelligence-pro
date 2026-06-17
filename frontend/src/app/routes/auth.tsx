import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

export function meta() {
  return [
    { title: "Login - AI Resume Analyzer" },
    { name: "description", content: "Login to your AI Resume Analyzer account" },
  ];
}

// Get Client IDs from environment
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || "";
const GITHUB_REDIRECT_URI = import.meta.env.VITE_GITHUB_REDIRECT_URI || "http://localhost:3000/auth/github/callback";

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ===== EMAIL/PASSWORD LOGIN =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo: extract name from email
      const userName = email.split('@')[0] || "User";
      
      const user = {
        name: userName,
        email: email,
        avatar: "👤",
        emailVerified: true,
        isPro: false,
      };
      
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", "mock_jwt_token");
      
      alert(`✅ Welcome ${userName}!`);
      navigate("/");
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ===== GOOGLE LOGIN =====
  const handleGoogleSuccess = (credentialResponse: any) => {
    console.log("Google login success:", credentialResponse);
    
    // Decode the Google JWT token to get user info
    const decoded = jwtDecode(credentialResponse.credential) as any;
    
    const user = {
      name: decoded.name || "Google User",
      email: decoded.email || "google@example.com",
      avatar: "🔵",
      emailVerified: decoded.email_verified || true,
      isPro: false,
    };

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", credentialResponse.credential);
    
    alert(`✅ Welcome ${user.name}!`);
    navigate("/");
  };

  const handleGoogleError = () => {
    console.error("Google login error");
    setError("Google login failed. Please try again or use email/password.");
  };

  // ===== GITHUB LOGIN =====
  const handleGitHubLogin = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=user:email`;
  };

  // Check if Google Client ID is set
  const hasGoogleClientId = GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== "" && GOOGLE_CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 max-w-md w-full animate-scale-in border border-white/20">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="text-5xl block mb-3 hover:scale-110 transition-transform duration-300 inline-block">
              🧠
            </Link>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              Resume<span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">AI</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {isLogin ? "Welcome back!" : "Start analyzing your resume with AI"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              ❌ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition duration-200"
                  placeholder="John Doe"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition duration-200"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition duration-200"
                placeholder="••••••••"
                required
              />
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-sm text-indigo-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  {isLogin ? "Signing in..." : "Creating account..."}
                </span>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <p className="text-center text-sm text-slate-500 mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setName("");
                setError(null);
              }}
              className="text-indigo-600 font-semibold hover:underline ml-1 transition-colors"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>

          {/* Divider */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
            <span className="text-xs text-slate-400 font-medium">or continue with</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          </div>

          {/* Social Login Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <div className="w-full sm:w-1/2">
              {hasGoogleClientId ? (
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap={false}
                  theme="outline"
                  size="large"
                  shape="pill"
                  text="continue_with"
                  logo_alignment="center"
                  width="100%"
                />
              ) : (
                <div className="w-full py-2.5 px-4 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-400 text-center bg-slate-50">
                  ⚠️ Google (Client ID missing)
                </div>
              )}
            </div>

            <button
              onClick={handleGitHubLogin}
              className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-indigo-300 transition-all duration-300 text-sm font-medium text-slate-700"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-center">
            <p className="text-xs text-slate-500">
              🔑 <span className="font-medium">Demo Credentials:</span> 
              <span className="ml-1 text-indigo-600">john@example.com</span>
              <span className="mx-1 text-slate-300">/</span>
              <span className="text-indigo-600">password123</span>
            </p>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}