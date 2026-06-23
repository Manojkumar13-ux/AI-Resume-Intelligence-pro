import { db } from '../config/database.js'; // Added .js

export interface IAnalysis {
  id?: string;
  userId: string;
  resumeId: string;
  score: number;
  atsCompatibility: {
    format: number;
    keywords: number;
    experience: number;
  };
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  skills: string[];
  missingKeywords: string[];
  recommendedRoles: string[];
  createdAt: Date;
  updatedAt?: Date;
}

export const Analysis = {
  create: async (data: any): Promise<IAnalysis> => {
    return db.analyses.create(data);
  },

  find: async (query: any): Promise<IAnalysis[]> => {
    return db.analyses.find(query);
  },

  findOne: async (query: any): Promise<IAnalysis | null> => {
    return db.analyses.findOne(query);
  },

  findById: async (id: string): Promise<IAnalysis | null> => {
    return db.analyses.findById(id);
  }
};