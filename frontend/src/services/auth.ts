import { api } from './api';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (email: string, password: string, name: string) => {
    const response = await api.post('/auth/register', { email, password, name });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: { name?: string; email?: string }) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put('/auth/change-password', { currentPassword, newPassword });
    return response.data;
  },
};

export const resumeService = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await api.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  analyze: async (resumeId: string, jobDescription?: string) => {
    const response = await api.post(`/resume/${resumeId}/analyze`, { jobDescription });
    return response.data;
  },

  getHistory: async (page: number = 1, limit: number = 10) => {
    const response = await api.get(`/resume/history?page=${page}&limit=${limit}`);
    return response.data;
  },

  getResume: async (resumeId: string) => {
    const response = await api.get(`/resume/${resumeId}`);
    return response.data;
  },

  deleteResume: async (resumeId: string) => {
    const response = await api.delete(`/resume/${resumeId}`);
    return response.data;
  },

  downloadReport: async (resumeId: string) => {
    const response = await api.get(`/resume/${resumeId}/report`, {
      responseType: 'blob',
    });
    return response.data;
  },

  getComparison: async (resumeId1: string, resumeId2: string) => {
    const response = await api.get(`/resume/compare/${resumeId1}/${resumeId2}`);
    return response.data;
  },

  rewrite: async (resumeId: string, improvements: string[]) => {
    const response = await api.post(`/resume/${resumeId}/rewrite`, { improvements });
    return response.data;
  },
};

export const dashboardService = {
  getDashboard: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  },

  getTrend: async (period: string = '30d') => {
    const response = await api.get(`/dashboard/trend?period=${period}`);
    return response.data;
  },

  getRecommendations: async () => {
    const response = await api.get('/dashboard/recommendations');
    return response.data;
  },
};