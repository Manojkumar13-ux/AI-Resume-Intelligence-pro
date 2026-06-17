import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function meta() {
  return [
    { title: "Google Authentication - AI Resume Analyzer" },
    { name: "description", content: "Authenticating with Google..." },
  ];
}

export default function GoogleCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const [status, setStatus] = useState("🔐 Authenticating with Google...");

  useEffect(() => {
    if (code) {
      // In production, exchange code for token with your backend
      setStatus("✅ Login successful! Redirecting...");
      const user = {
        name: "Google User",
        email: "google@example.com",
        avatar: "🔵",
      };
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", "google_mock_token");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      setStatus("❌ No authorization code received");
      setTimeout(() => {
        navigate("/auth");
      }, 1500);
    }
  }, [code, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full text-center">
        <div className={status.includes("❌") ? "text-6xl mb-4" : "animate-spin text-5xl mb-4"}>
          {status.includes("❌") ? "❌" : "⏳"}
        </div>
        <h2 className="text-xl font-bold text-slate-800">{status}</h2>
      </div>
    </div>
  );
}