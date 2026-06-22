import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Analysis } from '../models/Analysis.js';
import { Resume } from '../models/Resume.js';
import { User } from '../models/User.js';

export const getDashboardData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;

    const analyses = await Analysis.find({ userId }).sort({ createdAt: -1 });
    const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });

    const totalAnalyzed = analyses.length;
    const latestScore = analyses.length > 0 ? analyses[0].atsScore : 0;
    const averageScore = analyses.length > 0 
      ? analyses.reduce((acc, a) => acc + a.atsScore, 0) / analyses.length 
      : 0;

    let improvementTrend = 0;
    if (analyses.length >= 2) {
      const scores = analyses.slice().reverse().map(a => a.atsScore);
      const differences = scores.slice(1).map((score, i) => score - scores[i]);
      improvementTrend = differences.reduce((a, b) => a + b, 0) / differences.length;
    }

    const skillMap = new Map<string, number>();
    analyses.forEach(analysis => {
      (analysis.skills || []).forEach(skill => {
        skillMap.set(skill, (skillMap.get(skill) || 0) + 1);
      });
    });

    const skills = Array.from(skillMap.entries())
      .map(([name, count]) => ({ name, value: Math.min((count / analyses.length) * 100, 100) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    const scoreHistory = analyses.slice().reverse().map(analysis => ({
      date: analysis.createdAt.toISOString().split('T')[0],
      score: analysis.atsScore
    }));

    const recentActivity = resumes.slice(0, 5).map(resume => ({
      id: resume._id,
      fileName: resume.fileName,
      score: resume.score,
      status: resume.status,
      createdAt: resume.createdAt
    }));

    res.json({
      success: true,
      dashboard: {
        stats: {
          totalAnalyzed,
          latestScore,
          averageScore: Math.round(averageScore),
          improvementTrend: Math.round(improvementTrend * 100) / 100,
          totalResumes: resumes.length,
          creditsRemaining: req.user.isPro ? Infinity : req.user.credits,
          isPro: req.user.isPro
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
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTrendData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { period = '30d' } = req.query;
    
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

    const analyses = await Analysis.find({
      userId: req.user._id,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: 1 });

    const data = analyses.map(analysis => ({
      date: analysis.createdAt.toISOString().split('T')[0],
      score: analysis.atsScore,
      jobFit: analysis.jobFitScore
    }));

    res.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Trend error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRecommendations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const analyses = await Analysis.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

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
    analyses.forEach(analysis => {
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
    res.status(500).json({ message: 'Server error' });
  }
};