import axios from 'axios';

// ============================================
// API CONFIGURATION
// ============================================
// Use environment variable or fallback to deployed backend
const API_URL = import.meta.env.VITE_API_URL || 'https://ai-resume-intelligence-pro-1.onrender.com/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout for file uploads
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================
// Automatically add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================
// Handle authentication errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      console.warn('Authentication failed. Redirecting to login...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Handle 403 Forbidden - insufficient permissions
    if (error.response?.status === 403) {
      console.warn('Access forbidden. You may need Pro subscription.');
    }
    
    // Handle 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error('Server error:', error.response?.data?.message || 'Unknown server error');
    }
    
    // Handle network errors (offline, etc.)
    if (!error.response) {
      console.error('Network error - please check your connection');
    }
    
    return Promise.reject(error);
  }
);

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Set auth token for all future requests
 */
export const setAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  localStorage.setItem('token', token);
};

/**
 * Remove auth token from all future requests
 */
export const removeAuthToken = () => {
  delete api.defaults.headers.common['Authorization'];
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  return !!token && token !== 'undefined' && token !== 'null';
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
  const userData = localStorage.getItem('user');
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (e) {
      console.error('Failed to parse user data:', e);
      return null;
    }
  }
  return null;
};

// ============================================
// AUTH API ENDPOINTS
// ============================================
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  getProfile: () => api.get('/auth/profile'),
  
  updateProfile: (data: { name?: string; email?: string }) =>
    api.put('/auth/profile', data),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/change-password', data),
};

// ============================================
// RESUME API ENDPOINTS
// ============================================
export const resumeAPI = {
  upload: (formData: FormData) =>
    api.post('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  analyze: (resumeId: string, data: { name: string; entryRole: string; company: string; jobDescription?: string }) =>
    api.post(`/resume/${resumeId}/analyze`, data),
  
  getHistory: () => api.get('/resume/history'),
  
  getResume: (resumeId: string) => api.get(`/resume/${resumeId}`),
  
  deleteResume: (resumeId: string) => api.delete(`/resume/${resumeId}`),
};

// ============================================
// DASHBOARD API ENDPOINTS
// ============================================
export const dashboardAPI = {
  getData: () => api.get('/dashboard/data'),
  getTrend: (period?: string) => api.get('/dashboard/trend', { params: { period } }),
  getRecommendations: () => api.get('/dashboard/recommendations'),
};

// ============================================
// PAYMENT API ENDPOINTS
// ============================================
export const paymentAPI = {
  getPlans: () => api.get('/payment/plans'),
  createPayment: (data: { plan: string }) => api.post('/payment/create-payment', data),
  getSubscriptionStatus: () => api.get('/payment/subscription-status'),
  cancelSubscription: () => api.post('/payment/cancel-subscription'),
  createCheckoutSession: (data: { plan: string; successUrl?: string; cancelUrl?: string }) =>
    api.post('/payment/create-checkout-session', data),
};