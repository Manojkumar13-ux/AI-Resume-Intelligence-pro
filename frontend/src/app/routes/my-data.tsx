import { Link } from "react-router-dom";
import { getResumes, getStats } from "../../utils/dataStore";

export function meta() {
  return [
    { title: "My Data - AI Resume Analyzer" },
    { name: "description", content: "View all your resume analysis data" },
  ];
}

export default function MyData() {
  const resumes = getResumes();
  const stats = getStats();

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-700";
    if (score >= 60) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const getStatusBadge = (status: string) => {
    if (status === "High") return "bg-green-100 text-green-700";
    if (status === "Medium") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return "🎉";
    if (score >= 60) return "📈";
    return "💪";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 py-6 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <Link to="/" className="text-indigo-600 hover:text-indigo-700 transition-colors">
                ← Back
              </Link>
              <h1 className="text-2xl font-bold text-slate-900">📊 My Data</h1>
              <span className="text-sm bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                {resumes.length} resumes
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">View and manage all your resume analysis data</p>
          </div>
          <Link to="/" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-full font-semibold flex items-center gap-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
            📤 Upload New
          </Link>
        </div>

        {/* Stats Summary - Now using real data */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/60">
            <p className="text-xs text-slate-400">Total Analyses</p>
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/60">
            <p className="text-xs text-slate-400">Average Score</p>
            <p className="text-2xl font-bold text-indigo-600">{stats.avgScore}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/60">
            <p className="text-xs text-slate-400">Highest Score</p>
            <p className="text-2xl font-bold text-green-600">{stats.highest}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/60">
            <p className="text-xs text-slate-400">Lowest Score</p>
            <p className="text-2xl font-bold text-red-600">{stats.lowest}</p>
          </div>
        </div>

        {/* Analyses Table - Now using real data */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50/50">
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">#</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Resume</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {resumes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      <div className="text-4xl mb-2">📭</div>
                      <p>No resumes uploaded yet</p>
                      <Link to="/" className="text-indigo-600 hover:underline text-sm mt-2 inline-block">
                        Upload your first resume →
                      </Link>
                    </td>
                  </tr>
                ) : (
                  resumes.map((item, index) => (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 text-sm text-slate-500">{index + 1}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">📄</span>
                          <span className="font-medium text-slate-800 text-sm">{item.filename}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 ${getScoreBadge(item.score)}`}>
                          {getScoreIcon(item.score)} {item.score}/100
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-500">{item.time}</td>
                      <td className="py-4 px-6">
                        <Link to={`/resume/${item.id}`} className="text-indigo-600 font-medium text-sm hover:underline flex items-center gap-1">
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}