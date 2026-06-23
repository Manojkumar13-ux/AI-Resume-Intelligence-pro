import { db } from '../config/database.js';
import bcrypt from 'bcryptjs';

export interface IUser {
  id?: string;
  email: string;
  password: string;
  name: string;
  credits: number;
  isPro?: boolean;  // ADD THIS
  subscription?: {
    plan: 'free' | 'pro' | 'enterprise';
    expiresAt?: string;
  };
  createdAt: Date;
  updatedAt?: Date;
  lastLogin?: Date;
}

// Use named export only (remove default export)
export const User = {
  findOne: async (query: any): Promise<IUser | null> => {
    const users = db.users.find(query);
    return users.length > 0 ? users[0] : null;
  },

  find: async (query: any): Promise<IUser[]> => {
    return db.users.find(query);
  },

  findById: async (id: string): Promise<IUser | null> => {
    return db.users.findById(id);
  },

  findByIdAndUpdate: async (id: string, updates: any): Promise<IUser | null> => {
    return db.users.findByIdAndUpdate(id, updates);
  },

  create: async (userData: any): Promise<IUser> => {
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }
    return db.users.create(userData);
  },

  findAll: async (): Promise<IUser[]> => {
    return db.users.findAll();
  },

  isPro: (user: IUser): boolean => {
    return user.subscription?.plan !== 'free' && 
           (!user.subscription?.expiresAt || new Date(user.subscription.expiresAt) > new Date());
  },

  creditsRemaining: (user: IUser): number => {
    if (User.isPro(user)) return Infinity;
    return Math.max(0, user.credits || 0);
  },

  useCredits: async (userId: string, amount: number = 1): Promise<boolean> => {
    const user = await User.findById(userId);
    if (!user) return false;
    
    if (User.isPro(user)) return true;
    
    if (user.credits >= amount) {
      user.credits -= amount;
      await User.findByIdAndUpdate(userId, { credits: user.credits });
      return true;
    }
    return false;
  }
};
