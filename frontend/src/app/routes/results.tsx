import { useLocation, Link } from "react-router-dom";
import { generateResumeReport } from "../../utils/pdfGenerator";

export function meta() {
  return [
    { title: "Resume Analysis Results - AI Resume Analyzer" },
    { name: "description", content: "Detailed resume analysis and ATS score results" },
  ];
}

// Mock fallback data
const mockResult = {
  id: 1,
  filename: "Manoj (1).pdf",
  atsScore: 86,
  analysis: {
    skills: 89,
    experience: 93,
    education: 89,
    keywords: 78,
    format: 85,
  },
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
  missingKeywords: ["TypeScript", "Next.js", "AWS", "Docker", "CI/CD", "Redux", "Jest", "GraphQL"],
};

export default function Results() {
  const location = useLocation();
  const result = location.state?.result || mockResult;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusEmoji = (score: number) => {
    if (score >= 80) return "🎉";
    if (score >= 60) return "📈";
    return "💪";
  };

  const getStatusText = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Work";
  };

  const handleDownload = () => {
    generateResumeReport(result);
  };

  // Section color mapping
  const sectionColors: Record<string, string> = {
    skills: "from-blue-500 to-indigo-600",
    experience: "from-emerald-500 to-teal-600",
    education: "from-purple-500 to-pink-600",
    keywords: "from-amber-500 to-orange-600",
    format: "from-cyan-500 to-blue-600",
  };

  const sectionIcons: Record<string, string> = {
    skills: "💻",
    experience: "📋",
    education: "🎓",
    keywords: "🔑",
    format: "📐",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 py-6 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Back Navigation */}
        <Link to="/" className="text-indigo-600 font-medium hover:underline flex items-center gap-2 text-sm mb-6">
          ← Back to Dashboard
        </Link>

        {/* Header Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-white/50 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                📄 {result.filename}
              </h1>
              <p className="text-sm text-slate-500 mt-1">Analyzed just now • ATS Optimized</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <span className="text-3xl font-extrabold text-indigo-600">{result.atsScore}/100</span>
                <p className="text-xs text-slate-400">Overall Score</p>
              </div>
              <button 
                onClick={handleDownload}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-full font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 text-sm"
              >
                📥 Download Report
              </button>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className={`bg-gradient-to-r ${
          result.atsScore >= 80 ? 'from-green-50 to-emerald-50 border-green-200' : 
          result.atsScore >= 60 ? 'from-yellow-50 to-amber-50 border-yellow-200' : 
          'from-red-50 to-rose-50 border-red-200'
        } rounded-2xl p-6 shadow-lg border mb-6`}>
          <div className="flex items-center gap-4">
            <span className="text-4xl">{getStatusEmoji(result.atsScore)}</span>
            <div>
              <h2 className={`text-2xl font-bold ${
                result.atsScore >= 80 ? 'text-green-700' : 
                result.atsScore >= 60 ? 'text-amber-700' : 
                'text-red-700'
              }`}>
                {getStatusText(result.atsScore)}! ATS Score: {result.atsScore}/100
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                {result.atsScore >= 80 
                  ? "Your resume has a high chance of passing ATS screening. Keep optimizing to make it even better!"
                  : result.atsScore >= 60
                  ? "Your resume is good, but there's room for improvement. Focus on the areas below."
                  : "Your resume needs work. Follow the suggestions below to improve your ATS score."}
              </p>
            </div>
          </div>
        </div>

        {/* ===== SCORE BREAKDOWN – COLORFUL CARDS ===== */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            📊 Score Breakdown
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(result.analysis).map(([key, value]) => {
              const color = sectionColors[key] || 'from-gray-500 to-gray-600';
              const icon = sectionIcons[key] || '📌';
              const label = key.charAt(0).toUpperCase() + key.slice(1);
              const isGood = value >= 80;
              const isOk = value >= 60;
              return (
                <div 
                  key={key} 
                  className={`bg-gradient-to-br ${color} rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-white`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{icon}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isGood ? 'bg-white/30' : isOk ? 'bg-white/20' : 'bg-white/10'
                    }`}>
                      {isGood ? '✅ Excellent' : isOk ? '📈 Good' : '💪 Needs Work'}
                    </span>
                  </div>
                  <p className="text-xs font-medium uppercase tracking-wider mt-2 opacity-80">{label}</p>
                  <p className="text-2xl font-extrabold mt-1">{value}/100</p>
                  <div className="w-full bg-white/20 rounded-full h-1.5 mt-2">
                    <div className={`h-1.5 rounded-full bg-white/60`} style={{ width: `${value}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== STRENGTHS & IMPROVEMENTS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Key Strengths – Green Gradient */}
          <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-white">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              ✅ Key Strengths
            </h3>
            <ul className="space-y-2">
              {result.strengths.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas to Improve – Rose/Red Gradient */}
          <div className="bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-white">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              ⚠️ Areas to Improve
            </h3>
            <ul className="space-y-2">
              {result.improvements.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ===== MISSING KEYWORDS ===== */}
        {result.missingKeywords && result.missingKeywords.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
              <span className="text-indigo-600">🏷️</span> Missing Keywords
            </h3>
            <p className="text-sm text-slate-500 mb-3">
              Add these keywords to improve your ATS score and match with the job description.
            </p>
            <div className="flex flex-wrap gap-2">
              {result.missingKeywords.map((keyword: string) => (
                <span 
                  key={keyword} 
                  className="px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 text-indigo-700 transition-all duration-200 cursor-pointer hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white hover:border-transparent hover:scale-105"
                  onClick={() => alert(`💡 Suggestion: Add "${keyword}" to your skills section.`)}
                >
                  {keyword} <span className="text-xs opacity-60 ml-1">+</span>
                </span>
              ))}
            </div>
            <p className="mt-3 text-sm text-slate-400 flex items-center gap-2">
              <span>💡</span> Try to naturally incorporate these keywords where relevant.
            </p>
          </div>
        )}

        {/* ===== AI RECOMMENDATIONS ===== */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200 mb-6">
          <h3 className="text-lg font-semibold text-indigo-700 flex items-center gap-2 mb-3">
            🤖 AI Recommendations
          </h3>
          <div className="space-y-3">
            {result.atsScore >= 80 ? (
              <>
                <p className="text-sm text-slate-700">
                  Your resume is well-optimized for ATS! Here are some advanced tips to make it even better:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-indigo-500">→</span> Add more quantifiable achievements with specific numbers
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-indigo-500">→</span> Consider adding a projects section to showcase your work
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-indigo-500">→</span> Add relevant certifications to boost credibility
                  </li>
                </ul>
              </>
            ) : result.atsScore >= 60 ? (
              <>
                <p className="text-sm text-slate-700">
                  Your resume has a good foundation. Focus on these areas to improve:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-indigo-500">→</span> Add the missing keywords listed above
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-indigo-500">→</span> Include more metrics and numbers in your experience section
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-indigo-500">→</span> Add a professional summary at the top
                  </li>
                </ul>
              </>
            ) : (
              <>
                <p className="text-sm text-slate-700">
                  Your resume needs significant improvement. Start with these essentials:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-indigo-500">→</span> Add industry-relevant keywords throughout your resume
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-indigo-500">→</span> Include quantifiable achievements (e.g., "Increased sales by 20%")
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-indigo-500">→</span> Use action verbs to start each bullet point
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-indigo-500">→</span> Ensure consistent formatting throughout
                  </li>
                </ul>
              </>
            )}
          </div>
        </div>

        {/* ===== ACTION BUTTONS ===== */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Link to="/resumes" className="bg-slate-100 text-slate-700 px-6 py-2.5 rounded-full font-semibold flex items-center gap-2 hover:bg-slate-200 transition-all duration-200">
            📊 View All Resumes
          </Link>
          <Link to="/" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-full font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5">
            🔄 Analyze Another Resume
          </Link>
          <button 
            onClick={handleDownload}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-full font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5"
          >
            📥 Download PDF Report
          </button>
        </div>

        {/* ===== PRO BANNER ===== */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white text-center">
          <h3 className="text-xl md:text-2xl font-bold mb-2">🚀 Unlock Premium Features</h3>
          <p className="opacity-90 text-sm md:text-base mb-4">
            Get detailed AI feedback, unlimited analyses, priority support, and PDF export with Pro
          </p>
          <button className="bg-white text-indigo-600 px-6 md:px-8 py-2.5 md:py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-200 text-sm md:text-base">
            👑 Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  );
}