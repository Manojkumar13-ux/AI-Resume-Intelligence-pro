import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
  Legend,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { dashboardService } from '../../services/auth';
import { GlassCard } from '../common/GlassCard';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { StatsCard } from './StatsCard';
import { ImprovementSuggestions } from './ImprovementSuggestions';

interface DashboardData {
  stats: {
    totalAnalyzed: number;
    latestScore: number;
    averageScore: number;
    improvementTrend: number;
    totalResumes: number;
    creditsRemaining: number;
    isPro: boolean;
  };
  charts: {
    skills: { name: string; value: number }[];
    scoreHistory: { date: string; score: number }[];
  };
  recentActivity: any[];
}

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardService.getDashboard();
      setData(response.dashboard);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  const { stats, charts } = data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="ATS Score"
          value={`${stats.latestScore}%`}
          icon="🎯"
          color="primary"
          trend={stats.improvementTrend}
        />
        <StatsCard
          title="Resumes Analyzed"
          value={stats.totalAnalyzed}
          icon="📄"
          color="green"
        />
        <StatsCard
          title="Average Score"
          value={`${stats.averageScore}%`}
          icon="📈"
          color="purple"
        />
        <StatsCard
          title="Credits Remaining"
          value={stats.isPro ? '∞' : stats.creditsRemaining}
          icon="⚡"
          color="orange"
          subtitle={stats.isPro ? 'Pro Plan' : 'Free Plan'}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Trend */}
        <GlassCard>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold dark:text-white">
              📊 Score Trend
            </h3>
            <div className="flex gap-2">
              {['7d', '30d', '90d'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p as any)}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    period === p
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={charts.scoreHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis domain={[0, 100]} stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  background: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ fill: '#6366f1', strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Skills Radar */}
        <GlassCard>
          <h3 className="text-lg font-semibold mb-4 dark:text-white">
            🎯 Skills Analysis
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={charts.skills}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis
                dataKey="name"
                tick={{ fill: '#9ca3af', fontSize: 11 }}
              />
              <Radar
                name="Skills"
                dataKey="value"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.6}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  borderRadius: '8px',
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Improvement Suggestions */}
      <ImprovementSuggestions />
    </motion.div>
  );
};