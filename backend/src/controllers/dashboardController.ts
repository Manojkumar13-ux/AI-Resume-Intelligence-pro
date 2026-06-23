import { Request, Response } from 'express';
import Analysis from '../models/Analysis';
import Resume from '../models/Resume';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;

    const resumes = await Resume.find({ userId });
    const analyses = await Analysis.find({ userId });

    const totalResumes = resumes.length;
    const avgScore = analyses.length > 0
      ? Math.round(analyses.reduce((acc: number, a: any) => acc + (a.score || 0), 0) / analyses.length)
      : 0;

    const latestAnalysis = analyses.length > 0
      ? analyses.sort((a: any, b: any) => b.createdAt - a.createdAt)[0]
      : null;

    res.json({
      success: true,
      stats: { totalResumes, avgScore, totalAnalyses: analyses.length },
      latestAnalysis,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};