import React, { useState } from 'react';
import { Navbar } from '../components/common/Navbar';
import { ResumeUpload } from '../components/resume/ResumeUpload';
import { JobDescriptionInput } from '../components/resume/JobDescriptionInput';
import { ResumeAnalysis } from '../components/resume/ResumeAnalysis';
import { GlassCard } from '../components/common/GlassCard';

const AnalyzePage: React.FC = () => {
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [step, setStep] = useState<'upload' | 'analyze' | 'results'>('upload');

  const handleUploadComplete = (id: string) => {
    setResumeId(id);
    setStep('analyze');
  };

  const handleAnalysisComplete = (data: any) => {
    setAnalysis(data);
    setStep('results');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">Analyze Resume</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Upload your resume and get an AI-powered analysis with ATS optimization suggestions.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {['Upload', 'Analyze', 'Results'].map((label, index) => {
            const status =
              index < ['upload', 'analyze', 'results'].indexOf(step)
                ? 'complete'
                : index === ['upload', 'analyze', 'results'].indexOf(step)
                ? 'current'
                : 'upcoming';
            return (
              <React.Fragment key={label}>
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                      status === 'complete'
                        ? 'bg-green-500 text-white'
                        : status === 'current'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    {status === 'complete' ? '✓' : index + 1}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      status === 'current'
                        ? 'text-primary-500'
                        : status === 'complete'
                        ? 'text-green-500'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {index < 2 && (
                  <div
                    className={`w-16 h-0.5 mx-2 ${
                      index < ['upload', 'analyze', 'results'].indexOf(step)
                        ? 'bg-green-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {step === 'upload' && (
            <GlassCard>
              <ResumeUpload onUploadComplete={handleUploadComplete} />
            </GlassCard>
          )}

          {step === 'analyze' && resumeId && (
            <div className="space-y-6">
              <GlassCard>
                <JobDescriptionInput resumeId={resumeId} onAnalysisComplete={handleAnalysisComplete} />
              </GlassCard>
            </div>
          )}

          {step === 'results' && analysis && (
            <ResumeAnalysis analysis={analysis} resumeId={resumeId!} />
          )}
        </div>
      </main>
    </div>
  );
};

export default AnalyzePage;