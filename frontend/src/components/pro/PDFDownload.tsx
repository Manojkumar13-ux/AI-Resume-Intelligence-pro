import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { resumeService } from '../../services/auth';
import toast from 'react-hot-toast';

interface PDFDownloadProps {
  analysisId: string;
  resumeName: string;
}

export const PDFDownload: React.FC<PDFDownloadProps> = ({ analysisId, resumeName }) => {
  const [loading, setLoading] = useState(false);

  const downloadPDF = async () => {
    setLoading(true);
    try {
      const blob = await resumeService.downloadReport(analysisId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `resume-report-${resumeName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Report downloaded! 📄');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Download failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={downloadPDF}
      disabled={loading}
      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 text-sm"
    >
      {loading ? '⏳ Generating...' : '📄 Download PDF'}
    </motion.button>
  );
};