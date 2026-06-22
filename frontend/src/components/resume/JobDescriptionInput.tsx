import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { resumeService } from '../../services/auth';
import toast from 'react-hot-toast';

interface JobDescriptionInputProps {
  resumeId: string;
  onAnalysisComplete: (data: any) => void;
}

export const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  resumeId,
  onAnalysisComplete,
}) => {
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [includeJobMatch, setIncludeJobMatch] = useState(false);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const response = await resumeService.analyze(
        resumeId,
        includeJobMatch ? jobDescription : undefined
      );
      toast.success('Analysis complete! 🎉');
      onAnalysisComplete(response.analysis);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Job Description (Optional)
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste job description here for targeted analysis..."
          className="input-field min-h-[150px] resize-y"
        />
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          Adding a job description enables job-specific matching analysis
        </p>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={includeJobMatch}
            onChange={(e) => setIncludeJobMatch(e.target.checked)}
            className="w-4 h-4 text-primary-500 rounded"
          />
          Include job matching analysis
        </label>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAnalyze}
        disabled={analyzing}
        className="btn-primary w-full"
      >
        {analyzing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Analyzing...
          </span>
        ) : (
          '🔍 Analyze Resume'
        )}
      </motion.button>
    </div>
  );
};