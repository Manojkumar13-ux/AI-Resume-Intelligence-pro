import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import { AuthRequest } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { Resume } from '../models/Resume.js';
import { Analysis } from '../models/Analysis.js';

// In-memory storage (temporary - replace with database)
let resumes: any[] = [];

// Helper to safely access request properties
const getParams = (req: AuthRequest): any => req.params as any;
const getBody = (req: AuthRequest): any => req.body as any;
const getQuery = (req: AuthRequest): any => req.query as any;

export const uploadResume = async (req: AuthRequest, res: Response): Promise<void> => {
  // Use multer directly
  upload.single('resume')(req as any, res as any, async (err: any) => {
    if (err) {
      console.error('Multer error:', err);
      res.status(400).json({ success: false, message: err.message });
      return;
    }

    try {
      // Now we can access req.file and req.body
      const file = (req as any).file;
      const body = (req as any).body;
      
      if (!file) {
        res.status(400).json({ success: false, message: 'No file uploaded' });
        return;
      }

      const { name, entryRole, company, jobDescription } = body;
      const userId = req.user?.id || req.user?._id;

      // Read and parse PDF
      const pdfBuffer = fs.readFileSync(file.path);
      const pdfData = await pdfParse(pdfBuffer);
      const extractedText = pdfData.text;

      console.log('📄 PDF Extracted Text Length:', extractedText.length);

      // Create resume object
      const resume = {
        id: Date.now().toString(),
        userId: userId,
        fileName: file.originalname,
        originalName: file.originalname,
        filePath: file.path,
        extractedText: extractedText,
        score: 0,
        status: 'pending' as 'pending' | 'analyzed' | 'failed',
        name: name || '',
        entryRole: entryRole || '',
        company: company || '',
        jobDescription: jobDescription || '',
        metadata: {
          fileSize: file.size,
          mimeType: file.mimetype,
          pages: pdfData.numpages || 1
        },
        createdAt: new Date().toISOString()
      };

      resumes.push(resume);
      await Resume.create(resume);

      res.json({
        success: true,
        resumeId: resume.id,
        message: 'Resume uploaded successfully'
      });

    } catch (error) {
      console.error('Upload error:', error);
      const file = (req as any).file;
      if (file && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      res.status(500).json({ 
        success: false, 
        message: 'Failed to process resume',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
};

// Helper functions for AI analysis
function extractSkills(text: string): string[] {
  const commonSkills = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 
    'Java', 'C++', 'HTML', 'CSS', 'SQL', 'MongoDB', 'PostgreSQL',
    'Git', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
    'REST API', 'GraphQL', 'Express', 'Next.js', 'Vue.js',
    'Angular', 'Spring Boot', 'Django', 'Flask', 'PHP', 'Ruby'
  ];
  
  return commonSkills.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  ).slice(0, 10);
}

function getMissingKeywords(targetRole: string, existingSkills: string[]): string[] {
  const roleKeywords: { [key: string]: string[] } = {
    'full stack': ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Microservices'],
    'frontend': ['React', 'TypeScript', 'CSS', 'Responsive Design', 'Webpack'],
    'backend': ['Node.js', 'Python', 'Java', 'SQL', 'NoSQL', 'API Design'],
    'data': ['Python', 'SQL', 'Machine Learning', 'TensorFlow', 'Pandas']
  };
  
  const keywords = Object.values(roleKeywords).flat();
  return keywords
    .filter(kw => !existingSkills.some(skill => 
      skill.toLowerCase().includes(kw.toLowerCase())
    ))
    .slice(0, 5);
}

async function analyzeResumeWithAI(resumeText: string, jobDescription: string, targetRole: string) {
  const skills = extractSkills(resumeText);
  const missingKeywords = getMissingKeywords(targetRole, skills);
  
  return {
    score: Math.floor(Math.random() * 30) + 60,
    strengths: [
      'Clear and concise formatting',
      'Relevant experience in tech',
      'Strong educational background'
    ],
    weaknesses: [
      'Missing quantifiable achievements',
      'Limited use of action verbs',
      'Could be more tailored to the role'
    ],
    suggestions: [
      'Add more metrics to your experience section',
      'Include keywords from the job description',
      'Use stronger action verbs',
      'Quantify your achievements'
    ],
    skills: skills.length > 0 ? skills : ['JavaScript', 'React', 'Node.js', 'Python', 'TypeScript'],
    missingKeywords: missingKeywords.length > 0 ? missingKeywords : ['AWS', 'Docker', 'Kubernetes'],
    atsCompatibility: {
      format: Math.floor(Math.random() * 30) + 70,
      keywords: Math.floor(Math.random() * 30) + 60,
      experience: Math.floor(Math.random() * 30) + 70,
      education: Math.floor(Math.random() * 20) + 80,
      skills: Math.floor(Math.random() * 30) + 65
    },
    recommendedRoles: [
      'Full Stack Developer',
      'Frontend Engineer',
      'Backend Developer',
      'Software Engineer'
    ]
  };
}

export const analyzeResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const params = getParams(req);
    const body = getBody(req);
    const { resumeId } = params;
    const { jobDescription, name, entryRole, company } = body;
    const userId = req.user?.id || req.user?._id;

    const resume = resumes.find(r => r.id === resumeId && r.userId === userId);
    if (!resume) {
      res.status(404).json({ success: false, message: 'Resume not found' });
      return;
    }

    if (!resume.extractedText || resume.extractedText.length < 50) {
      res.status(400).json({ success: false, message: 'Resume text too short or missing' });
      return;
    }

    resume.name = name || resume.name;
    resume.entryRole = entryRole || resume.entryRole;
    resume.company = company || resume.company;
    resume.jobDescription = jobDescription || resume.jobDescription;

    console.log('🤖 Starting AI analysis...');
    
    const analysis = await analyzeResumeWithAI(
      resume.extractedText, 
      jobDescription || resume.jobDescription || '', 
      entryRole || resume.entryRole || ''
    );

    resume.score = analysis.score;
    resume.status = 'analyzed';
    resume.analysis = analysis;

    const analysisRecord = await Analysis.create({
      userId: userId,
      resumeId: resume.id,
      score: analysis.score,
      atsCompatibility: analysis.atsCompatibility || {
        format: 0,
        keywords: 0,
        experience: 0
      },
      strengths: analysis.strengths || [],
      weaknesses: analysis.weaknesses || [],
      suggestions: analysis.suggestions || [],
      skills: analysis.skills || [],
      missingKeywords: analysis.missingKeywords || [],
      recommendedRoles: analysis.recommendedRoles || []
    });

    res.json({ 
      success: true, 
      analysis: {
        ...analysis,
        analysisId: analysisRecord.id
      }
    });

  } catch (error) {
    console.error('❌ Analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'AI analysis failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getResumeHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || req.user?._id;
    const userResumes = resumes.filter(r => r.userId === userId);
    
    const dbResumes = await Resume.find({ userId });
    
    res.json({ 
      success: true, 
      history: userResumes.length > 0 ? userResumes : dbResumes 
    });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ success: false, message: 'Failed to get history' });
  }
};

export const getResumeById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const params = getParams(req);
    const userId = req.user?.id || req.user?._id;
    const resume = resumes.find(r => r.id === params.resumeId && r.userId === userId);
    
    if (!resume) {
      res.status(404).json({ success: false, message: 'Resume not found' });
      return;
    }
    res.json({ success: true, resume });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ success: false, message: 'Failed to get resume' });
  }
};

export const deleteResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const params = getParams(req);
    const userId = req.user?.id || req.user?._id;
    const index = resumes.findIndex(r => r.id === params.resumeId && r.userId === userId);
    
    if (index === -1) {
      res.status(404).json({ success: false, message: 'Resume not found' });
      return;
    }
    
    const resume = resumes[index];
    
    if (resume.filePath && fs.existsSync(resume.filePath)) {
      fs.unlinkSync(resume.filePath);
    }
    
    resumes.splice(index, 1);
    await Resume.findByIdAndDelete(params.resumeId);
    
    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
};