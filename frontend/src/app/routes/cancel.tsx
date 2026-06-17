import { Link } from 'react-router-dom';

export default function Cancel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">😅</div>
        <h1 className="text-2xl font-bold text-yellow-600">Payment Cancelled</h1>
        <p className="text-slate-500 mt-2">Your payment was cancelled. No charges were made.</p>
        <div className="flex gap-3 mt-6">
          <Link to="/pricing" className="flex-1 bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700">
            Try Again
          </Link>
          <Link to="/" className="flex-1 bg-slate-100 text-slate-700 px-6 py-2.5 rounded-xl hover:bg-slate-200">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}