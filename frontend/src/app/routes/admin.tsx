import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Admin() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${import.meta.env.VITE_API_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.stats);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">📊 Admin Dashboard</h1>
          <Link to="/" className="text-indigo-600 hover:underline">← Back</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <p className="text-sm text-slate-400">Total Users</p>
            <p className="text-3xl font-bold text-indigo-600">{stats?.totalUsers || 0}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <p className="text-sm text-slate-400">Total Resumes</p>
            <p className="text-3xl font-bold text-emerald-600">{stats?.totalResumes || 0}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <p className="text-sm text-slate-400">Avg Score</p>
            <p className="text-3xl font-bold text-amber-600">{stats?.avgScore || 0}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <p className="text-sm text-slate-400">Pro Users</p>
            <p className="text-3xl font-bold text-purple-600">{stats?.proUsers || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-semibold text-slate-700 mb-4">Verification Status</h3>
            <p className="text-slate-600">Verified Users: <strong>{stats?.verifiedUsers || 0}</strong></p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-semibold text-slate-700 mb-4">Quick Actions</h3>
            <Link to="/admin/users" className="block text-indigo-600 hover:underline">View All Users →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}