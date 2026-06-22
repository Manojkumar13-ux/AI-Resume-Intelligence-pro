import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { resumeService } from '../../services/auth';
import toast from 'react-hot-toast';

interface ResumeUploadProps {
  onUploadComplete: (resumeId: string) => void;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Only PDF files are allowed');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const response = await resumeService.upload(file);
      toast.success('Resume uploaded successfully! 🎉');
      onUploadComplete(response.resumeId);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <motion.div
            animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
            className="text-6xl mb-4"
          >
            📄
          </motion.div>
          <p className="text-lg font-semibold dark:text-white">
            {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            or click to browse (PDF only, max 10MB)
          </p>
        </div>
      </div>

      {file && (
        <div className="flex items-center justify-between p-4 glass rounded-xl">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📎</span>
            <div>
              <p className="font-medium dark:text-white">{file.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="btn-primary"
          >
            {uploading ? 'Uploading...' : 'Upload Resume'}
          </button>
        </div>
      )}
    </div>
  );
};