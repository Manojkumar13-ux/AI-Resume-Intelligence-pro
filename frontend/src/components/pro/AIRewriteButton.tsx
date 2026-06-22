import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { resumeService } from '../../services/auth';
import toast from 'react-hot-toast';

interface AIRewriteButtonProps {
  resumeId: string;
}

export const AIRewriteButton: React.FC<AIRewriteButtonProps> = ({ resumeId }) => {
  const [loading, setLoading] = useState(false);

  const handleRewrite = async () => {
    setLoading(true);
    try {
      const response = await resumeService.rewrite(resumeId, [
        'Add more quantifiable achievements',
        'Include relevant keywords',
        'Improve professional summary',
      ]);
      toast.success('Resume rewritten! ✨');
      // Could show diff view or download
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Rewrite failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleRewrite}
      disabled={loading}
      className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 text-sm"
    >
      {loading ? '⏳ Rewriting...' : '✨ AI Rewrite'}
    </motion.button>
  );
};