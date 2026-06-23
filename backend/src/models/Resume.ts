import { db } from '../config/database';

export interface IResume {
  id?: string;
  userId: string;
  fileName: string;
  originalName: string;
  name: string;
  entryRole: string;
  company: string;
  jobDescription?: string;
  status: 'pending' | 'analyzed' | 'failed';
  score?: number;
  filePath: string;
  analysisId?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export const Resume = {
  create: async (data: any): Promise<IResume> => {
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