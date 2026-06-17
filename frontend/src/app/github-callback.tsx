import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function meta() {
  return [
    { title: "GitHub Authentication - AI Resume Analyzer" },
    { name: "description", content: "Authenticating with GitHub..." },
  ];
}

export default function GitHubCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const [status, setStatus] = useState("🔐 Authenticating with GitHub...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleGitHubCallback = async () => {
      if (!code) {
        setStatus("❌ No authorization code received");
        setError("GitHub login failed. No code provided.");
        setTimeout(() => navigate("/auth"), 2000);
        return;
      }

      try {
        setStatus("🔄 Exchanging code for user info...");

        // In production, send the code to your backend:
        // const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/github`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ code }),
        // });
        // const data = await response.json();
        // if (data.success) {
        //   const user = {
        //     name: data.user.name || "GitHub User",
        //     email: data.user.email || "github@example.com",
        //     avatar: "🐙",
        //     emailVerified: true,
        //     isPro: false,
        //   };
        //   localStorage.setItem("user", JSON.stringify(user));
        //   localStorage.setItem("token", data.token);
        //   navigate("/");
        // }

        // For demo: simulate successful login
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock user data (replace with real data from backend)
        const user = {
          name: "GitHub User",
          email: "github@example.com",
          avatar: "🐙",
          emailVerified: true,
          isPro: false,
        };
        
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", "github_mock_token");
        
        setStatus("✅ Login successful! Redirecting...");
        setTimeout(() => navigate("/"), 1000);
        
      } catch (err) {
        console.error("GitHub callback error:", err);
        setStatus("❌ GitHub login failed");
        setError("Authentication failed. Please try again.");
        setTimeout(() => navigate("/auth"), 2000);
      }
    };

    handleGitHubCallback();
  }, [code, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full text-center">
        <div className={error ? "text-6xl mb-4" : "animate-spin text-5xl mb-4"}>
          {error ? "❌" : "⏳"}
        </div>
        <h2 className={`text-xl font-bold ${error ? "text-red-600" : "text-slate-800"}`}>
          {status}
        </h2>
        {error && (
          <p className="text-sm text-red-500 mt-2">{error}</p>
        )}
        <p className="text-sm text-slate-400 mt-2">
          {!error && "Please wait while we authenticate you..."}
        </p>
        {error && (
          <button
            onClick={() => navigate("/auth")}
            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition"
          >
            Back to Login
          </button>
        )}
      </div>
    </div>
  );
}