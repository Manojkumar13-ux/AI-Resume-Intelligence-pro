import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/common/Navbar';
import { ResumeHistory } from '../components/resume/ResumeHistory';
import { GlassCard } from '../components/common/GlassCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

const HistoryPage: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">Resume History</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Track your progress and see how your resumes have improved over time
          </p>
        </div>
        <ResumeHistory />
      </main>
    </div>
  );
};

export default HistoryPage;