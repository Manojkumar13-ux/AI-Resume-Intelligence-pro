import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function Success() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // Verify payment with backend
      fetch(`${import.meta.env.VITE_API_URL}/payments/verify/${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            // Update user in localStorage
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            user.isPro = true;
            localStorage.setItem('user', JSON.stringify(user));
          }
        });
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-green-600">Payment Successful!</h1>
        <p className="text-slate-500 mt-2">Your account has been upgraded to Pro.</p>
        <Link to="/" className="inline-block mt-6 bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}