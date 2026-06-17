import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/auth/verify/${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatus('success');
          setMessage(data.message);
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification failed');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Something went wrong');
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {status === 'verifying' && (
          <>
            <div className="text-5xl mb-4 animate-spin">⏳</div>
            <h2 className="text-xl font-bold">Verifying Your Email...</h2>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-green-600">Email Verified!</h2>
            <p className="text-slate-500 mt-2">{message}</p>
            <Link to="/auth" className="inline-block mt-6 bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700">
              Login Now
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-xl font-bold text-red-600">Verification Failed</h2>
            <p className="text-slate-500 mt-2">{message}</p>
            <Link to="/auth" className="inline-block mt-6 bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700">
              Go to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}