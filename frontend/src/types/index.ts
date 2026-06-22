export interface User {
  id: string;
  email: string;
  name: string;
  credits: number;
  role: 'user' | 'admin';
  isPro: boolean;
  subscription: {
    plan: 'free' | 'pro' | 'enterprise';
    expiresAt: string | null;
  };
}

export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  filePath: string;
  extractedText: string;
  score: number;
  status: 'uploaded' | 'processing' | 'analyzed' | 'error';
  jobDescription: string;
  metadata: {
    fileSize: number;
    mimeType: string;
    pages: number;
  };
  createdAt: string;
  updatedAt: string;
  analysis?: Analysis;
}

export interface Analysis {
  id: string;
  resumeId: string;
  userId: string;
  atsScore: number;
  skills: string[];
  missingKeywords: string[];
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
  jobFitScore: number;
  improvementTrend: number;
  atsCompatibility: {
    format: number;
    keywords: number;
    experience: number;
    education: number;
    skills: number;
  };
  recommendedRoles: string[];
  createdAt: string;
}

export interface DashboardStats {
  totalAnalyzed: number;
  latestScore: number;
  averageScore: number;
  improvementTrend: number;
  totalResumes: number;
  creditsRemaining: number;
  isPro: boolean;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface ScoreHistory {
  date: string;
  score: number;
  jobFit?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}