import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { dashboardService } from '../../services/auth';
import { GlassCard } from '../common/GlassCard';

export const ImprovementSuggestions: React.FC = () => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const response = await dashboardService.getRecommendations();
      setSuggestions(response.recommendations);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <GlassCard>
        <div className="animate-pulse space-y-3">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </GlassCard>
    );
  }

  if (suggestions.length === 0) {
    return (
      <GlassCard>
        <h3 className="text-lg font-semibold mb-4 dark:text-white">
          💡 Improvement Suggestions
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Upload a resume to get personalized suggestions!
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <h3 className="text-lg font-semibold mb-4 dark:text-white">
        💡 Improvement Suggestions
      </h3>
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 p-3 bg-primary-50 dark:bg-gray-700/50 rounded-xl"
          >
            <span className="text-xl mt-0.5">✨</span>
            <p className="dark:text-gray-200 text-sm">{suggestion}</p>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
};