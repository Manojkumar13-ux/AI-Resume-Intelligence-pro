import { db } from '../config/database.js';

export interface IAnalysis {
  id?: string;
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
  createdAt: Date;
}

export const Analysis = {
  create: async (analysisData: any): Promise<IAnalysis> => {
    const data = {
      ...analysisData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    return db.analyses.create(data);
  },

  findOne: async (query: any): Promise<IAnalysis | null> => {
    return db.analyses.findOne(query);
  },

  find: async (query: any): Promise<IAnalysis[]> => {
    return db.analyses.find(query);
  },

  findById: async (id: string): Promise<IAnalysis | null> => {
    return db.analyses.findById(id);
  }
};