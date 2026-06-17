import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (plan: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
      });
      const data = await response.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        alert('❌ Failed to start checkout');
      }
    } catch {
      alert('❌ Network error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="text-indigo-600 hover:underline mb-6 inline-block">← Back to Dashboard</Link>
        <h1 className="text-3xl font-bold text-center text-slate-800 mb-2">🚀 Choose Your Plan</h1>
        <p className="text-center text-slate-500 mb-8">Upgrade to Pro for unlimited resume analysis and AI insights</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">Free</h2>
            <p className="text-4xl font-bold text-slate-800 mt-2">$0 <span className="text-lg font-normal text-slate-400">/month</span></p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center gap-3 text-slate-600">✅ Basic ATS Score</li>
              <li className="flex items-center gap-3 text-slate-600">✅ 3 Analyses</li>
              <li className="flex items-center gap-3 text-slate-600">✅ PDF Export</li>
              <li className="flex items-center gap-3 text-slate-400">❌ AI Feedback</li>
              <li className="flex items-center gap-3 text-slate-400">❌ Unlimited Analyses</li>
              <li className="flex items-center gap-3 text-slate-400">❌ Priority Support</li>
            </ul>
            <Link to="/" className="block w-full text-center bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold mt-6 hover:bg-slate-200">
              Current Plan
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 border-2 border-indigo-400 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-yellow-400 text-slate-800 px-3 py-1 rounded-full text-xs font-bold animate-pulse">BEST VALUE</div>
            <h2 className="text-xl font-bold">Pro</h2>
            <p className="text-4xl font-bold mt-2">$9.99 <span className="text-lg font-normal opacity-80">/month</span></p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center gap-3 text-indigo-200">✅ Advanced ATS Score</li>
              <li className="flex items-center gap-3 text-indigo-200">✅ Unlimited Analyses</li>
              <li className="flex items-center gap-3 text-indigo-200">✅ PDF Export</li>
              <li className="flex items-center gap-3 text-indigo-200">✅ AI Feedback</li>
              <li className="flex items-center gap-3 text-indigo-200">✅ Priority Support</li>
              <li className="flex items-center gap-3 text-indigo-200">✅ Resume Templates</li>
            </ul>
            <button
              onClick={() => handleSubscribe('monthly')}
              disabled={loading}
              className="block w-full text-center bg-white text-indigo-600 py-3 rounded-xl font-semibold mt-6 hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : '👑 Upgrade Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}