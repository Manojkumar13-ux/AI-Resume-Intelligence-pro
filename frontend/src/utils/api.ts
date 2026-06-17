

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
  aiFeedback?: {
    summary: string;
    recommendations: string[];
  };
  createdAt: string;
}

export const api = {
  // Upload resume for analysis
  uploadResume: async (file: File, jobTitle: string = 'Full Stack Developer'): Promise<AnalysisResult> => {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobTitle', jobTitle);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/resumes/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
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
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/resumes`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) throw new Error('Failed to fetch resumes');
    return response.json();
  },

  // Get single resume by ID
  getResume: async (id: number) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/resumes/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) throw new Error('Failed to fetch resume');
    return response.json();
  },

  // Delete resume
  deleteResume: async (id: number) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/resumes/${id}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) throw new Error('Failed to delete resume');
    return response.json();
  },

  // Get stats
  getStats: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/resumes/stats`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  // User login
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    return response.json();
  },

  // User register
  register: async (name: string, email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    return response.json();
  },

  // Get current user
  getMe: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) throw new Error('Failed to get user');
    return response.json();
  },

  // Update profile
  updateProfile: async (name: string, avatar?: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, avatar }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Update failed');
    }
    return response.json();
  },
};

export default api;