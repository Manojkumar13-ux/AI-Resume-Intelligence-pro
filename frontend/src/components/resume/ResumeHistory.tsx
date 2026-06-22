import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { resumeService } from '../../services/auth';
import { GlassCard } from '../common/GlassCard';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface HistoryItem {
  id: string;
  fileName: string;
  score: number;
  status: string;
  createdAt: string;
  analysis: any;
}

export const ResumeHistory: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const fetchHistory = async () => {
    try {
      const response = await resumeService.getHistory(page);
      setHistory(response.history);
      setStats(response.stats);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    try {
      await resumeService.deleteResume(id);
      toast.success('Resume deleted');
      fetchHistory();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass rounded-2xl p-6 animate-pulse">
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mt-2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <GlassCard className="text-center py-12">
        <div className="text-6xl mb-4">📄</div>
        <h3 className="text-xl font-semibold dark:text-white mb-2">No Resumes Yet</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Upload your first resume to get started with AI analysis
        </p>
        <Link to="/analyze" className="btn-primary inline-block">
          Upload Resume
        </Link>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GlassCard>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Resumes</p>
            <p className="text-2xl font-bold dark:text-white">{stats.totalResumes}</p>
          </GlassCard>
          <GlassCard>
            <p className="text-sm text-gray-500 dark:text-gray-400">Average Score</p>
            <p className="text-2xl font-bold dark:text-white">{stats.averageScore}%</p>
          </GlassCard>
          <GlassCard>
            <p className="text-sm text-gray-500 dark:text-gray-400">Improvement Trend</p>
            <p className={`text-2xl font-bold ${stats.improvementTrend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stats.improvementTrend > 0 ? '+' : ''}{stats.improvementTrend}%
            </p>
          </GlassCard>
        </div>
      )}

      {/* History List */}
      <div className="space-y-4">
        {history.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GlassCard className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-4 w-full sm:w-auto">
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xl flex-shrink-0">
                  📄
                </div>
                <div>
                  <p className="font-medium dark:text-white">{item.fileName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Score</p>
                  <p className={`text-lg font-bold ${
                    item.score >= 80 ? 'text-green-500' :
                    item.score >= 60 ? 'text-yellow-500' :
                    'text-red-500'
                  }`}>
                    {item.score || '-'}%
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/analyze?resume=${item.id}`}
                    className="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 transition-colors"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                p === page
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};