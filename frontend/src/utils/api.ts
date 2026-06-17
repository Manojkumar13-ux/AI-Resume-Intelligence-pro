// src/utils/api.ts
// Backend API client for real resume analysis

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface AnalysisResult {
  id: number;
  filename: string;
  atsScore: number;
  analysis: {
    skills: number;
    experience: number;
    education: number;
    keywords: number;
    format: number;
  };
  strengths: string[];
  improvements: string[];
  missingKeywords: string[];
}

export const api = {
  // Upload resume for analysis
  uploadResume: async (file: File, jobTitle: string = 'Full Stack Developer'): Promise<AnalysisResult> => {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobTitle', jobTitle);

    const response = await fetch(`${API_URL}/resumes/upload`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - browser sets it automatically with boundary
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    const data = await response.json();
    return data.data;
  },

  // Get all resumes
  getResumes: async () => {
    const response = await fetch(`${API_URL}/resumes`);
    if (!response.ok) throw new Error('Failed to fetch resumes');
    return response.json();
  },

  // Get single resume
  getResume: async (id: number) => {
    const response = await fetch(`${API_URL}/resumes/${id}`);
    if (!response.ok) throw new Error('Failed to fetch resume');
    return response.json();
  },

  // Delete resume
  deleteResume: async (id: number) => {
    const response = await fetch(`${API_URL}/resumes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete resume');
    return response.json();
  },

  // Get stats
  getStats: async () => {
    const response = await fetch(`${API_URL}/resumes/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },
};