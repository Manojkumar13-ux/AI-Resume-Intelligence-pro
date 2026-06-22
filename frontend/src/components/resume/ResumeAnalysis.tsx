import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../common/GlassCard';
import { PDFDownload } from '../pro/PDFDownload';
import { AIRewriteButton } from '../pro/AIRewriteButton';
import {
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

interface ResumeAnalysisProps {
  analysis: any;
  resumeId: string;
}

export const ResumeAnalysis: React.FC<ResumeAnalysisProps> = ({ analysis, resumeId }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'suggestions'>('overview');

  const compatibilityData = analysis.atsCompatibility
    ? Object.entries(analysis.atsCompatibility).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: value as number,
      }))
    : [];

  const skillData = (analysis.skills || []).map((skill: string) => ({
    name: skill,
    value: Math.floor(Math.random() * 30) + 70,
  }));

  return (
    <div className="space-y-6">
      {/* Score Display */}
      <GlassCard>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  className="text-gray-200 dark:text-gray-700"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="56"
                  cx="64"
                  cy="64"
                />
                <circle
                  className="text-primary-500"
                  strokeWidth="8"
                  strokeDasharray={352}
                  strokeDashoffset={352 - (analysis.atsScore / 100) * 352}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="56"
                  cx="64"
                  cy="64"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold dark:text-white">{analysis.atsScore}%</span>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold dark:text-white">ATS Score</h2>
              <p className="text-gray-500 dark:text-gray-400">
                {analysis.atsScore >= 80
                  ? 'Excellent! Your resume is well-optimized.'
                  : analysis.atsScore >= 60
                  ? 'Good, but there\'s room for improvement.'
                  : 'Needs significant improvement for ATS systems.'}
              </p>
              {analysis.jobFitScore > 0 && (
                <p className="text-sm text-primary-500 mt-1">
                  Job Fit Score: {analysis.jobFitScore}%
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <PDFDownload analysisId={analysis.id} resumeName="resume" />
            <AIRewriteButton resumeId={resumeId} />
          </div>
        </div>
      </GlassCard>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {['overview', 'details', 'suggestions'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab
                ? 'border-primary-500 text-primary-500'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard>
              <h3 className="text-lg font-semibold mb-4 dark:text-white">
                ✅ Strengths
              </h3>
              <ul className="space-y-2">
                {(analysis.strengths || []).map((strength: string, i: number) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-2 text-gray-600 dark:text-gray-300"
                  >
                    <span className="text-green-500">✓</span>
                    {strength}
                  </motion.li>
                ))}
              </ul>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-semibold mb-4 dark:text-white">
                ⚠️ Areas for Improvement
              </h3>
              <ul className="space-y-2">
                {(analysis.weaknesses || []).map((weakness: string, i: number) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-2 text-gray-600 dark:text-gray-300"
                  >
                    <span className="text-red-500">✗</span>
                    {weakness}
                  </motion.li>
                ))}
              </ul>
            </GlassCard>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard>
              <h3 className="text-lg font-semibold mb-4 dark:text-white">
                📊 ATS Compatibility
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={compatibilityData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-semibold mb-4 dark:text-white">
                🎯 Skills Found
              </h3>
              <div className="flex flex-wrap gap-2">
                {(analysis.skills || []).map((skill: string, i: number) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
              {analysis.missingKeywords && analysis.missingKeywords.length > 0 && (
                <>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-4 mb-2">
                    Missing Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords.map((keyword: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </GlassCard>
          </div>
        )}

        {activeTab === 'suggestions' && (
          <GlassCard>
            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              💡 Improvement Suggestions
            </h3>
            <div className="space-y-4">
              {(analysis.suggestions || []).map((suggestion: string, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 p-4 bg-primary-50 dark:bg-gray-700/50 rounded-xl"
                >
                  <span className="text-xl mt-0.5">✨</span>
                  <div>
                    <p className="dark:text-gray-200">{suggestion}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            {analysis.recommendedRoles && analysis.recommendedRoles.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                  🎯 Recommended Job Roles
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.recommendedRoles.map((role: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>
        )}
      </div>
    </div>
  );
};