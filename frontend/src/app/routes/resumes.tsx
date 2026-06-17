import { Link } from "react-router-dom";

export function meta() {
  return [
    { title: "All Resumes - AI Resume Analyzer" },
    { name: "description", content: "View all your analyzed resumes" },
  ];
}

const allResumes = [
  { id: 1, name: "Full Stack Developer Resume.pdf", score: 85, date: "2024-01-15", role: "Full Stack" },
  { id: 2, name: "Frontend Developer Resume.pdf", score: 78, date: "2024-01-14", role: "Frontend" },
  { id: 3, name: "Backend Developer Resume.pdf", score: 92, date: "2024-01-12", role: "Backend" },
  { id: 4, name: "DevOps Engineer Resume.pdf", score: 65, date: "2024-01-10", role: "DevOps" },
  { id: 5, name: "Data Scientist Resume.pdf", score: 88, date: "2024-01-08", role: "Data Science" },
];

export default function Resumes() {
  const getScoreBadge = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-700";
    if (score >= 60) return "bg-yellow-100 text-yellow-700";
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <Link to="/" className="text-indigo-600 hover:text-indigo-700 transition-colors">
                ← Back
              </Link>
              <h1 className="text-2xl font-bold text-slate-900">📋 All Resumes</h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">Manage and review all your analyzed resumes</p>
          </div>
          <Link to="/" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-full font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5">
            📤 Upload New
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50/50">
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">#</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Resume Name</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {allResumes.map((resume, index) => (
                  <tr key={resume.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 text-sm text-slate-500">{index + 1}</td>
                    <td className="py-4 px-6 font-medium text-slate-800 text-sm">{resume.name}</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">
                        {resume.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 ${getScoreBadge(resume.score)}`}>
                        {getScoreIcon(resume.score)} {resume.score}/100
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-500">{resume.date}</td>
                    <td className="py-4 px-6">
                      <Link to={`/resume/${resume.id}`} className="text-indigo-600 font-medium text-sm hover:underline flex items-center gap-1">
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex justify-between items-center px-6 py-4 border-t border-slate-200">
            <p className="text-sm text-slate-500">Showing 1-5 of 5 resumes</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors">
                1
              </button>
              <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-50" disabled>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}