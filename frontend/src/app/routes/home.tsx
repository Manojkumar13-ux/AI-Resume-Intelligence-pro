import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addResume, getStats, getActivities, getChartData } from "../../utils/dataStore";
import { api } from "../../utils/api";

export function meta() {
  return [
    { title: "AI Resume Analyzer - Dashboard" },
    { name: "description", content: "AI-powered resume analysis and ATS scoring" },
  ];
}

const missingKeywords = ["TypeScript", "Next.js", "AWS", "Docker", "CI/CD", "Redux", "Jest", "GraphQL"];

export default function Home() {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [useRealBackend, setUseRealBackend] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || '{"name":"John"}');
  const stats = getStats();
  const activities = getActivities();
  const chartData = getChartData();

  const simulateUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(async () => {
          try {
            let result;
            if (useRealBackend) {
              result = await api.uploadResume(file);
            } else {
              const skills = Math.floor(Math.random() * 20) + 75;
              const experience = Math.floor(Math.random() * 20) + 75;
              const education = Math.floor(Math.random() * 20) + 70;
              const keywords = Math.floor(Math.random() * 20) + 70;
              const format = Math.floor(Math.random() * 20) + 75;
              const overallScore = Math.round((skills + experience + education + keywords + format) / 5);
              result = {
                id: Date.now(),
                filename: file.name,
                atsScore: overallScore,
                analysis: { skills, experience, education, keywords, format },
                strengths: [
                  "Good use of action verbs",
                  "Well-structured experience section",
                  "Relevant skills for the job",
                  "No grammar or spelling mistakes",
                  "Consistent formatting",
                ],
                improvements: [
                  "Add more quantifiable achievements",
                  "Include more relevant keywords",
                  "Add certifications",
                  "Include a professional summary",
                ],
                missingKeywords: ["TypeScript", "Next.js", "AWS", "Docker", "CI/CD"],
              };
            }
            addResume({
              filename: file.name,
              score: result.atsScore,
              status: result.atsScore >= 80 ? "High" : result.atsScore >= 60 ? "Medium" : "Low",
              analysis: result.analysis,
              strengths: result.strengths,
              improvements: result.improvements,
              missingKeywords: result.missingKeywords,
            });
            navigate("/results", { state: { result } });
            if (fileInputRef.current) fileInputRef.current.value = "";
            setSelectedFile(null);
            setIsUploading(false);
            setUploadProgress(0);
          } catch (error) {
            console.error('Upload failed:', error);
            alert('❌ Upload failed. Please try again.');
            setIsUploading(false);
            setUploadProgress(0);
          }
        }, 1500);
      }
      setUploadProgress(Math.min(progress, 100));
    }, 200);
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      simulateUpload(file);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      simulateUpload(file);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/auth");
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload': return '📤';
      case 'analysis': return '📊';
      case 'download': return '📥';
      default: return '📌';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'upload': return 'border-blue-200 bg-blue-50/50';
      case 'analysis': return 'border-green-200 bg-green-50/50';
      case 'download': return 'border-purple-200 bg-purple-50/50';
      default: return 'border-slate-200 bg-slate-50/50';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Gradient Mesh Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100"></div>
        <div className="absolute top-0 -left-40 w-96 h-96 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-40 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-gradient-to-r from-pink-400 to-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2YzNiYWQiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        
        {/* ===== HERO SECTION ===== */}
        <div className="relative mb-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl animate-bounce">👋</span>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                  Welcome back, <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">{user.name}</span>
                </h1>
              </div>
              <p className="text-slate-600 text-sm md:text-base flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                AI-powered resume feedback tailored to your target role
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <button className="relative group bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-0.5">
                <span className="text-lg">👑</span>
                Upgrade to Pro
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">NEW</span>
              </button>
              <Link 
                to="/my-data"
                className="bg-white/80 backdrop-blur-sm border-2 border-indigo-200 text-indigo-600 px-5 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                📊 My Data
                <span className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-600 text-xs px-2 py-0.5 rounded-full">{stats.total}</span>
              </Link>
              <Link 
                to="/profile"
                className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 text-purple-600 px-5 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-purple-50 hover:border-purple-400 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                👤 Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-600 px-4 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-red-100 transition-all duration-300"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>

        {/* ===== STATS CARDS – Slightly Lighter Gradients ===== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="group bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-blue-100 uppercase tracking-wider">Total Resumes</p>
                <p className="text-3xl font-extrabold mt-1">{stats.total}</p>
                <p className="text-xs text-blue-100 font-medium flex items-center gap-1 mt-1">↑ {stats.total} total</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                📄
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-1 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-emerald-100 uppercase tracking-wider">Avg Score</p>
                <p className="text-3xl font-extrabold mt-1">{stats.avgScore}</p>
                <p className="text-xs text-emerald-100 font-medium flex items-center gap-1 mt-1">from {stats.total} resumes</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                📈
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 hover:-translate-y-1 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-amber-100 uppercase tracking-wider">Best ATS</p>
                <p className="text-3xl font-extrabold mt-1">{stats.highest || 0}</p>
                <p className="text-xs text-amber-100 font-medium flex items-center gap-1 mt-1">🏆 Highest score</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🏆
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-purple-100 uppercase tracking-wider">Target Role</p>
                <p className="text-lg font-bold mt-1">Full Stack Dev</p>
                <p className="text-xs text-purple-100 font-medium flex items-center gap-1 mt-1">🎯 12 matches</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🎯
              </div>
            </div>
          </div>
        </div>

        {/* ===== UPLOAD & SIDEBAR ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Zone – Dark Blue/Teal */}
            <div 
              className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                isDragging 
                  ? 'border-cyan-400 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 shadow-2xl shadow-cyan-500/30' 
                  : 'border-cyan-500/50 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 pointer-events-none"></div>
              <div className="relative p-8 md:p-10 text-center">
                <div className="text-6xl mb-4 animate-float filter drop-shadow-lg">☁️</div>
                <h3 className="text-2xl font-bold text-white mb-2">Upload Your Resume</h3>
                <p className="text-gray-300 text-sm mb-6">
                  Get AI-powered feedback and ATS scores instantly. Supports PDF, DOCX, TXT (Max 5MB)
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {isUploading && (
                  <div className="mb-4 w-full max-w-md mx-auto">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">📤 Uploading...</span>
                      <span className="text-cyan-400 font-semibold">{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {selectedFile && !isUploading && (
                  <div className="mb-4 text-sm bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 inline-flex items-center gap-2 border border-white/20 text-gray-200">
                    📎 Selected: <span className="font-medium text-cyan-300">{selectedFile.name}</span>
                    <span className="text-gray-400">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                  </div>
                )}

                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={handleUploadClick}
                    disabled={isUploading}
                    className="relative bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? (
                      <><span className="animate-spin">⏳</span> Analyzing...</>
                    ) : (
                      <>📤 Analyze Resume</>
                    )}
                  </button>
                  <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-white/20 hover:border-white/40 transition-all duration-300">
                    🔗 Paste Job Description
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-4 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"></span>
                  or drag & drop your file here
                </p>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs">
                  <span className="text-gray-400">Use Real Backend:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useRealBackend}
                      onChange={(e) => setUseRealBackend(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                  </label>
                  <span className={`text-xs font-medium ${useRealBackend ? 'text-cyan-400' : 'text-gray-400'}`}>
                    {useRealBackend ? 'ON' : 'OFF'}
                  </span>
                </div>
              </div>
            </div>

            {/* ATS Score Trends – Colorful */}
            {chartData.length > 0 && (
              <div className="bg-gradient-to-br from-cyan-50 to-blue-100 rounded-2xl p-6 shadow-lg border border-cyan-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  📊 ATS Score Trends
                </h3>
                <div className="h-48 flex items-end gap-4 overflow-x-auto pb-2">
                  {chartData.map((item, index) => (
                    <div key={index} className="flex flex-col items-center min-w-[60px]">
                      <div className="relative w-full">
                        <div 
                          className="w-8 rounded-t-lg bg-gradient-to-t from-indigo-500 to-purple-500 transition-all duration-500 hover:scale-105 hover:shadow-lg"
                          style={{ 
                            height: `${(item.score / 100) * 140}px`,
                            minHeight: '20px',
                            animation: `grow-${index} 0.8s ease-out forwards`
                          }}
                        >
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-indigo-600">
                            {item.score}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-[10px] text-slate-600 text-center truncate w-full max-w-[60px]">
                        {item.name.replace('.pdf', '')}
                      </div>
                    </div>
                  ))}
                </div>
                <style>{`
                  ${chartData.map((_, i) => `
                    @keyframes grow-${i} {
                      from { height: 0px; }
                      to { height: ${((chartData[i].score / 100) * 140)}px; }
                    }
                  `).join('')}
                `}</style>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* AI Suggestions – Dark with lighter gradients */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-lg border border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">💡</span>
                <h3 className="text-lg font-semibold text-white">AI Suggestions</h3>
                <span className="ml-auto text-xs bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2 py-0.5 rounded-full">Live</span>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3 items-start p-3 bg-gradient-to-r from-indigo-800/60 to-purple-800/60 rounded-xl hover:from-indigo-700/60 hover:to-purple-700/60 transition-all cursor-pointer border border-indigo-600/30">
                  <span className="text-xl">📝</span>
                  <div>
                    <p className="font-medium text-sm text-indigo-100">Add Professional Summary</p>
                    <p className="text-sm text-slate-300">Add a professional summary at the top of your resume.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start p-3 bg-gradient-to-r from-emerald-800/60 to-teal-800/60 rounded-xl hover:from-emerald-700/60 hover:to-teal-700/60 transition-all cursor-pointer border border-emerald-600/30">
                  <span className="text-xl">📊</span>
                  <div>
                    <p className="font-medium text-sm text-emerald-100">Include Metrics</p>
                    <p className="text-sm text-slate-300">Include more metrics in your experience section.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start p-3 bg-gradient-to-r from-amber-800/60 to-yellow-800/60 rounded-xl hover:from-amber-700/60 hover:to-yellow-700/60 transition-all cursor-pointer border border-amber-600/30">
                  <span className="text-xl">🔑</span>
                  <div>
                    <p className="font-medium text-sm text-amber-100">Missing Keywords</p>
                    <p className="text-sm text-slate-300">Add missing keywords like AWS, Docker, and Jest.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start p-3 bg-gradient-to-r from-purple-800/60 to-pink-800/60 rounded-xl hover:from-purple-700/60 hover:to-pink-700/60 transition-all cursor-pointer border border-purple-600/30">
                  <span className="text-xl">🚀</span>
                  <div>
                    <p className="font-medium text-sm text-purple-100">Pro Tip</p>
                    <p className="text-sm text-slate-300">Upgrade to Pro for advanced AI insights.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity – Light Violet/Indigo */}
            <div className="bg-gradient-to-br from-violet-50 to-indigo-100 rounded-2xl p-6 shadow-lg border border-violet-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <span className="text-xl">🕐</span> Recent Activity
                </h3>
                <Link to="/my-data" className="text-xs text-indigo-600 hover:underline">View all</Link>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {activities.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">No recent activity</p>
                ) : (
                  activities.slice(0, 5).map((activity) => (
                    <div 
                      key={activity.id} 
                      className={`flex items-start gap-3 p-3 rounded-xl border ${getActivityColor(activity.type)} transition-all hover:shadow-sm`}
                    >
                      <span className="text-xl">{getActivityIcon(activity.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 truncate">{activity.message}</p>
                        <p className="text-xs text-slate-400">{activity.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ===== MISSING KEYWORDS ===== */}
        <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-2xl p-6 shadow-lg border border-pink-200 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏷️</span>
              <h3 className="text-lg font-semibold text-slate-800">Missing Keywords</h3>
              <span className="text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-0.5 rounded-full">8 missing</span>
            </div>
            <p className="text-sm text-slate-500">Add these to boost your ATS score</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {missingKeywords.map((keyword) => (
              <span
                key={keyword}
                className="group px-4 py-2 rounded-full text-sm font-medium bg-white/70 backdrop-blur-sm border border-pink-200 text-slate-700 transition-all duration-300 cursor-pointer hover:bg-gradient-to-r hover:from-indigo-600 hover:via-purple-600 hover:to-pink-500 hover:text-white hover:border-transparent hover:scale-105 hover:shadow-lg"
                onClick={() => alert(`💡 Suggestion: Add "${keyword}" to your skills section.`)}
              >
                {keyword}
                <span className="inline-block ml-1 opacity-0 group-hover:opacity-100 transition-opacity">+</span>
              </span>
            ))}
          </div>
        </div>

        {/* ===== QUICK ACTION BUTTONS ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            to="/my-data"
            className="group bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1 text-white text-center"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📊</div>
            <p className="font-semibold">My Data</p>
            <p className="text-xs text-blue-200">View all your resumes</p>
          </Link>
          <Link 
            to="/"
            className="group bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-1 text-white text-center"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📤</div>
            <p className="font-semibold">New Analysis</p>
            <p className="text-xs text-emerald-200">Upload a new resume</p>
          </Link>
          <Link 
            to="/resumes"
            className="group bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 hover:-translate-y-1 text-white text-center"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📋</div>
            <p className="font-semibold">All Resumes</p>
            <p className="text-xs text-amber-200">Manage your resumes</p>
          </Link>
          <Link 
            to="/profile"
            className="group bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1 text-white text-center"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">👤</div>
            <p className="font-semibold">Profile</p>
            <p className="text-xs text-purple-200">Manage your account</p>
          </Link>
        </div>

        {/* ===== PRO BANNER ===== */}
        <div className="mt-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-6 md:p-8 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
          <div className="absolute top-4 right-12 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse-slow"></div>
          <div className="absolute bottom-4 left-12 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse-slow"></div>
          <div className="relative">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">🚀 Unlock Premium Features</h3>
            <p className="opacity-90 text-sm md:text-base mb-4 max-w-2xl mx-auto">
              Get unlimited analyses, advanced AI insights, priority support, and PDF export with Pro
            </p>
            <button className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm md:text-base">
              👑 Upgrade to Pro
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}