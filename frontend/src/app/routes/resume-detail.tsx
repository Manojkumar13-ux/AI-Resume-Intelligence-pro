import { useParams, Link } from "react-router-dom";
import { getResumeById } from "../../utils/dataStore";
import { generateResumeReport } from "../../utils/pdfGenerator";

export function meta({ params }: any) {
  return [
    { title: `Resume Analysis - ${params.id}` },
    { name: "description", content: "Detailed resume analysis and ATS breakdown" },
  ];
}

export default function ResumeDetail() {
  const { id } = useParams();
  const resumeData = getResumeById(Number(id));

  // If resume not found, show error
  if (!resumeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center py-6 px-4 sm:px-6">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-sm border border-slate-200/60 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-slate-800">Resume Not Found</h1>
          <p className="text-slate-500 mt-2">The resume you're looking for doesn't exist or has been deleted.</p>
          <Link to="/my-data" className="inline-block mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
            ← Back to My Data
          </Link>
        </div>
      </div>
    );
  }

  // Build resume object from stored data
  const resume = {
    id: resumeData.id,
    name: resumeData.filename,
    score: resumeData.score,
    analysis: resumeData.analysis || {
      Skills: 80,
      Experience: 75,
      Education: 70,
      Keywords: 65,
      Format: 85,
    },
    strengths: resumeData.strengths || [
      "Good use of action verbs",
      "Well-structured experience section",
      "Relevant skills for the job",
      "No grammar or spelling mistakes",
      "Consistent formatting",
    ],
    improvements: resumeData.improvements || [
      "Add more quantifiable achievements (e.g., 'Increased sales by 20%')",
      "Include more relevant keywords from job description",
      "Add certifications (if any)",
      "Include a professional summary at the top",
      "Add links to portfolio or GitHub",
    ],
    missingKeywords: resumeData.missingKeywords || ["TypeScript", "Next.js", "AWS", "Docker", "CI/CD", "Redux", "Jest", "GraphQL"],
  };

  const handleDownload = () => {
    const data = {
      filename: resume.name,
      atsScore: resume.score,
      analysis: resume.analysis,
      strengths: resume.strengths,
      improvements: resume.improvements,
      missingKeywords: resume.missingKeywords || [],
    };
    generateResumeReport(data);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 py-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Navigation */}
        <Link to="/my-data" className="text-indigo-600 font-medium hover:underline flex items-center gap-2 text-sm mb-6">
          ← Back to My Data
        </Link>

        {/* Header Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                📄 {resume.name}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Analyzed {resumeData.time || "recently"} • ATS Optimized
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <span className="text-3xl font-extrabold text-indigo-600">{resume.score}/100</span>
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
        <div className={`bg-white rounded-2xl p-6 shadow-sm border mb-6 ${
          resume.score >= 80 ? 'border-green-200 bg-green-50/30' : 
          resume.score >= 60 ? 'border-yellow-200 bg-yellow-50/30' : 
          'border-red-200 bg-red-50/30'
        }`}>
          <div className="flex items-center gap-4">
            <span className="text-4xl">{getStatusEmoji(resume.score)}</span>
            <div>
              <h2 className={`text-2xl font-bold ${getScoreColor(resume.score)}`}>
                {getStatusText(resume.score)}! ATS Score: {resume.score}/100
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                {resume.score >= 80 
                  ? "Your resume has a high chance of passing ATS screening. Keep optimizing to make it even better!"
                  : resume.score >= 60
                  ? "Your resume is good, but there's room for improvement. Focus on the areas below."
                  : "Your resume needs work. Follow the suggestions below to improve your ATS score."}
              </p>
            </div>
          </div>
        </div>

        {/* Section Scores */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            📊 Score Breakdown
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(resume.analysis).map(([key, value]) => (
              <div key={key} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/60">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{key}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className={`text-xl font-bold ${getScoreColor(value as number)}`}>
                    {value}/100
                  </p>
                  <div className={`${getScoreBg(value as number)} px-2 py-0.5 rounded-full text-sm font-bold`}>
                    {value >= 80 ? "✅" : value >= 60 ? "📈" : "💪"}
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                  <div 
                    className={`h-1.5 rounded-full transition-all ${getScoreColor(value as number)}`} 
                    style={{ width: `${value}%` }} 
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {value >= 80 ? "Excellent" : value >= 60 ? "Good" : "Needs Work"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
            <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2 mb-4">
              ✅ Key Strengths
            </h3>
            <ul className="space-y-2">
              {resume.strengths.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
            <h3 className="text-lg font-semibold text-yellow-600 flex items-center gap-2 mb-4">
              ⚠️ Areas to Improve
            </h3>
            <ul className="space-y-2">
              {resume.improvements.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-yellow-500 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Missing Keywords */}
        {resume.missingKeywords && resume.missingKeywords.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
              <span className="text-indigo-600">🏷️</span> Missing Keywords
            </h3>
            <p className="text-sm text-slate-500 mb-3">
              Add these keywords to improve your ATS score and match with the job description.
            </p>
            <div className="flex flex-wrap gap-2">
              {resume.missingKeywords.map((keyword) => (
                <span 
                  key={keyword} 
                  className="px-4 py-1.5 rounded-full text-sm font-medium bg-slate-100 border border-slate-200 text-slate-700 transition-all duration-200 cursor-pointer hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:scale-105"
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

        {/* AI Recommendations */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200 mb-6">
          <h3 className="text-lg font-semibold text-indigo-700 flex items-center gap-2 mb-3">
            🤖 AI Recommendations
          </h3>
          <div className="space-y-3">
            {resume.score >= 80 ? (
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
            ) : resume.score >= 60 ? (
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

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Link to="/my-data" className="bg-slate-100 text-slate-700 px-6 py-2.5 rounded-full font-semibold flex items-center gap-2 hover:bg-slate-200 transition-all duration-200">
            📊 Back to My Data
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

        {/* Pro Banner */}
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