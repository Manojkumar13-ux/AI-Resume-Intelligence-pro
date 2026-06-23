import { Request, Response } from 'express';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import { AuthRequest } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

let resumes: any[] = [];

export const uploadResume = async (req: AuthRequest, res: Response): Promise<void> => {
  upload.single('resume')(req, res, async (err: any) => {
    if (err) {
      console.error('Multer error:', err);
      res.status(400).json({ success: false, message: err.message });
      return;
    }

    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded' });
        return;
      }

      const { name, entryRole, company, jobDescription } = req.body;

      const pdfBuffer = fs.readFileSync(req.file.path);
      const pdfData = await pdfParse(pdfBuffer);
      const extractedText = pdfData.text;

      console.log('📄 PDF Extracted Text Length:', extractedText.length);

      const resume = {
        id: Date.now().toString(),
        userId: req.user._id,
        fileName: req.file.originalname,
        filePath: req.file.path,
        extractedText: extractedText,
        score: 0,
        status: 'uploaded',
        name: name || '',
        entryRole: entryRole || '',
        company: company || '',
        jobDescription: jobDescription || '',
        metadata: {
          fileSize: req.file.size,
          mimeType: req.file.mimetype,
          pages: pdfData.numpages || 1
        },
        createdAt: new Date().toISOString()
      };

      resumes.push(resume);

      res.json({
        success: true,
        resumeId: resume.id,
        message: 'Resume uploaded successfully'
      });

    } catch (error) {
      console.error('Upload error:', error);
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ success: false, message: 'Failed to process resume' });
    }
  });
};

export const analyzeResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { resumeId } = req.params;
    const { jobDescription, name, entryRole, company } = req.body;

    const resume = resumes.find(r => r.id === resumeId && r.userId === req.user._id);
    if (!resume) {
      res.status(404).json({ success: false, message: 'Resume not found' });
      return;
    }

    if (!resume.extractedText || resume.extractedText.length < 50) {
      res.status(400).json({ success: false, message: 'Resume text too short' });
      return;
    }

    resume.name = name || resume.name;
    resume.entryRole = entryRole || resume.entryRole;
    resume.company = company || resume.company;
    resume.jobDescription = jobDescription || resume.jobDescription;

    console.log('🤖 Calling Ollama AI with resume text length:', resume.extractedText.length);
    const analysis = await analyzeWithOllama(resume.extractedText, jobDescription || '', entryRole || '');

    resume.score = analysis.score;
    resume.status = 'analyzed';
    resume.analysis = analysis;

    res.json({ success: true, analysis });

  } catch (error) {
    console.error('❌ Analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'AI analysis failed: ' + String(error)
    });
  }
};

async function analyzeWithOllama(resumeText: string, jobDescription: string, targetRole: string) {
  const prompt = `
    You are an expert ATS resume analyst. Analyze this resume and provide a detailed JSON response.

    Resume Text:
    ${resumeText.substring(0, 8000)}

    ${targetRole ? `Target Role: ${targetRole}` : ''}
    ${jobDescription ? `Job Description: ${jobDescription}` : ''}

    Return ONLY valid JSON with:
    {
      "score": number (0-100),
      "strengths": string[] (3-5 specific strengths),
      "weaknesses": string[] (3-5 specific weaknesses),
      "suggestions": string[] (4-6 actionable suggestions),
      "skills": string[] (top 8-10 skills found),
      "missingKeywords": string[] (important missing keywords),
      "atsCompatibility": {
        "format": number,
        "keywords": number,
        "experience": number,
        "education": number,
        "skills": number
      },
      "recommendedRoles": string[] (3-4 job roles)
    }
  `;

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2:1b',
        prompt: prompt,
        stream: false,
        options: { temperature: 0.3 }
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`);
    }

    const data = await response.json();
    console.log('📝 Ollama Response length:', data.response?.length || 0);

    const jsonMatch = data.response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in Ollama response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Ollama error:', error);
    throw error;
  }
}

export const getResumeHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userResumes = resumes.filter(r => r.userId === req.user._id);
    res.json({ success: true, history: userResumes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get history' });
  }
};

export const getResumeById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const resume = resumes.find(r => r.id === req.params.resumeId && r.userId === req.user._id);
    if (!resume) {
      res.status(404).json({ success: false, message: 'Resume not found' });
      return;
    }
    res.json({ success: true, resume });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get resume' });
  }
};

export const deleteResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const index = resumes.findIndex(r => r.id === req.params.resumeId && r.userId === req.user._id);
    if (index === -1) {
      res.status(404).json({ success: false, message: 'Resume not found' });
      return;
    }
    const resume = resumes[index];
    if (fs.existsSync(resume.filePath)) {
      fs.unlinkSync(resume.filePath);
    }
    resumes.splice(index, 1);
    res.json({ success: true, message: 'Resume deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
};