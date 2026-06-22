import { db } from '../config/database.js';

export interface IResume {
  id?: string;
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
  createdAt: Date;
  updatedAt?: Date;
}

export const Resume = {
  create: async (resumeData: any): Promise<IResume> => {
    const data = {
      ...resumeData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    return db.resumes.create(data);
  },

  find: async (query: any): Promise<IResume[]> => {
    return db.resumes.find(query);
  },

  findOne: async (query: any): Promise<IResume | null> => {
    return db.resumes.findOne(query);
  },

  findById: async (id: string): Promise<IResume | null> => {
    return db.resumes.findById(id);
  },

  findByIdAndUpdate: async (id: string, updates: any): Promise<IResume | null> => {
    return db.resumes.findByIdAndUpdate(id, updates);
  },

  findByIdAndDelete: async (id: string): Promise<IResume | null> => {
    return db.resumes.findByIdAndDelete(id);
  }
};