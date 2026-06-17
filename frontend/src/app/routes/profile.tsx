import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setName(parsed.name);
      setIsPro(parsed.isPro || false);
    } else {
      navigate('/auth');
    }
    setLoading(false);
  }, [navigate]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      if (data.success) {
        const updated = { ...user, name };
        localStorage.setItem('user', JSON.stringify(updated));
        setUser(updated);
        setEditMode(false);
        alert('✅ Profile updated successfully!');
      } else {
        alert(data.message || 'Update failed');
      }
    } catch {
      alert('❌ Failed to update profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/auth');
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="text-indigo-600 hover:underline mb-6 inline-block">← Back to Dashboard</Link>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center text-white">
            <div className="text-6xl mb-4">{user?.avatar || '👤'}</div>
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <p className="text-indigo-200">{user?.email}</p>
            <div className="flex justify-center gap-3 mt-2">
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm">
                {user?.emailVerified ? '✅ Verified' : '⚠️ Not Verified'}
              </span>
              {isPro && (
                <span className="inline-block px-3 py-1 bg-yellow-400/80 text-slate-800 rounded-full text-sm font-semibold">
                  ⭐ Pro
                </span>
              )}
            </div>
          </div>

          <div className="p-8">
            <div className="border-b pb-6">
              <h3 className="font-semibold text-slate-700 mb-4">Profile Information</h3>
              {editMode ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <div className="flex gap-3">
                    <button onClick={handleUpdate} className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700">
                      Save
                    </button>
                    <button onClick={() => setEditMode(false)} className="bg-slate-100 text-slate-700 px-6 py-2 rounded-xl hover:bg-slate-200">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-slate-600"><span className="font-medium">Name:</span> {user?.name}</p>
                    <p className="text-slate-600"><span className="font-medium">Email:</span> {user?.email}</p>
                    <p className="text-slate-600"><span className="font-medium">Account Type:</span> {isPro ? '⭐ Pro' : 'Free'}</p>
                  </div>
                  <button onClick={() => setEditMode(true)} className="text-indigo-600 font-medium hover:underline">
                    Edit
                  </button>
                </div>
              )}
            </div>

            <div className="border-b py-6">
              <h3 className="font-semibold text-slate-700 mb-4">Account Settings</h3>
              <div className="space-y-3">
                <Link to="/auth" className="block w-full text-center bg-indigo-100 text-indigo-700 py-3 rounded-xl hover:bg-indigo-200 transition">
                  🔑 Change Password
                </Link>
                {!isPro && (
                  <Link to="/pricing" className="block w-full text-center bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition">
                    ⭐ Upgrade to Pro
                  </Link>
                )}
                <button className="block w-full text-center bg-red-50 text-red-600 py-3 rounded-xl hover:bg-red-100 transition">
                  🗑️ Delete Account
                </button>
              </div>
            </div>

            <div className="pt-6">
              <button onClick={handleLogout} className="w-full bg-slate-100 text-slate-700 py-3 rounded-xl hover:bg-slate-200 transition">
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}