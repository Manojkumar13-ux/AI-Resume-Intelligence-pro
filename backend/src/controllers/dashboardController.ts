import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Analysis } from '../models/Analysis.js';
import { Resume } from '../models/Resume.js';
import { User } from '../models/User.js';

export const getDashboardData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || req.user?._id;

    const analyses = await Analysis.find({ userId });
    const resumes = await Resume.find({ userId });

    const totalAnalyzed = analyses.length;
    
    const sortedAnalyses = [...analyses].sort((a: any, b: any) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    const latestScore = sortedAnalyses.length > 0 ? sortedAnalyses[0].score || 0 : 0;
    const averageScore = analyses.length > 0 
      ? Math.round(analyses.reduce((acc: number, a: any) => acc + (a.score || 0), 0) / analyses.length) 
      : 0;

    let improvementTrend = 0;
    if (analyses.length >= 2) {
      const scores = sortedAnalyses.map((a: any) => a.score || 0);
      const differences = scores.slice(1).map((score: number, i: number) => score - scores[i]);
      improvementTrend = differences.reduce((a: number, b: number) => a + b, 0) / differences.length;
    }

    const skillMap = new Map<string, number>();
    analyses.forEach((analysis: any) => {
      (analysis.skills || []).forEach((skill: string) => {
        skillMap.set(skill, (skillMap.get(skill) || 0) + 1);
      });
    });

    const skills = Array.from(skillMap.entries())
      .map(([name, count]) => ({ 
        name, 
        value: Math.min((count / analyses.length) * 100, 100) 
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    const scoreHistory = sortedAnalyses.map((analysis: any) => ({
      date: new Date(analysis.createdAt).toISOString().split('T')[0],
      score: analysis.score || 0
    }));

    const recentActivity = resumes.slice(0, 5).map((resume: any) => ({
      id: resume.id,
      fileName: resume.fileName,
      score: resume.score,
      status: resume.status,
      createdAt: resume.createdAt
    }));

    const user = await User.findById(userId);

    res.json({
      success: true,
      dashboard: {
        stats: {
          totalAnalyzed,
          latestScore,
          averageScore,
          improvementTrend: Math.round(improvementTrend * 100) / 100,
          totalResumes: resumes.length,
          creditsRemaining: user?.isPro ? Infinity : (user?.credits || 0),
          isPro: user?.isPro || false
        },
        charts: {
          skills,
          scoreHistory
        },
        recentActivity
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getTrendData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { period = '30d' } = req.query;
    const userId = req.user?.id || req.user?._id;
    
    let startDate = new Date();
    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    const allAnalyses = await Analysis.find({ userId });
    const filteredAnalyses = allAnalyses.filter((analysis: any) => {
      return new Date(analysis.createdAt) >= startDate;
    });

    const data = filteredAnalyses.map((analysis: any) => ({
      date: new Date(analysis.createdAt).toISOString().split('T')[0],
      score: analysis.score || 0,
      jobFit: analysis.jobFitScore || analysis.score || 0
    }));

    res.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Trend error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getRecommendations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || req.user?._id;
    
    const allAnalyses = await Analysis.find({ userId });
    const sortedAnalyses = [...allAnalyses].sort((a: any, b: any) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    const analyses = sortedAnalyses.slice(0, 5);

    if (analyses.length === 0) {
      res.json({
        success: true,
        recommendations: [
          'Upload your first resume to get started!',
          'Use our AI to analyze your resume and find improvements'
        ]
      });
      return;
    }

    const allSuggestions = new Map<string, number>();
    analyses.forEach((analysis: any) => {
      (analysis.suggestions || []).forEach((suggestion: string) => {
        allSuggestions.set(suggestion, (allSuggestions.get(suggestion) || 0) + 1);
      });
    });

    const recommendations = Array.from(allSuggestions.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([text]) => text);

    res.json({
      success: true,
      recommendations
    });

  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};