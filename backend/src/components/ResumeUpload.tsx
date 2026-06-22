import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface ResumeUploadProps {
  onUploadSuccess?: (resumeId: string) => void;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Only PDF files are allowed');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setFile(file);
      setError('');
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
    setError('');
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/resume/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUploadProgress(100);
        alert('Resume uploaded successfully! 🎉');
        setFile(null);
        if (onUploadSuccess) {
          onUploadSuccess(data.resumeId);
        }
      } else {
        setError(data.message || 'Upload failed');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{
      padding: '24px',
      background: 'rgba(255,255,255,0.04)',
      backdropFilter: 'blur(24px)',
      borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.06)',
    }}>
      <h3 style={{ color: 'white', marginBottom: '16px' }}>📤 Upload Resume</h3>

      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${isDragActive ? 'rgba(79, 70, 229, 0.6)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          background: isDragActive ? 'rgba(79, 70, 229, 0.05)' : 'transparent'
        }}
      >
        <input {...getInputProps()} />
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📄</div>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
          {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}
        </p>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
          or click to browse (PDF only, max 10MB)
        </p>
      </div>

      {file && (
        <div style={{
          marginTop: '16px',
          padding: '16px',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <p style={{ color: 'white', marginBottom: '4px' }}>{file.name}</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            onClick={handleUpload}
            disabled={uploading}
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              opacity: uploading ? 0.6 : 1
            }}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      )}

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div style={{
          marginTop: '12px',
          height: '4px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${uploadProgress}%`,
            height: '100%',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)',
            transition: 'width 0.3s ease'
          }} />
        </div>
      )}

      {error && (
        <p style={{
          color: '#f87171',
          fontSize: '14px',
          marginTop: '12px'
        }}>
          ❌ {error}
        </p>
      )}
    </div>
  );
};

export default ResumeUpload;