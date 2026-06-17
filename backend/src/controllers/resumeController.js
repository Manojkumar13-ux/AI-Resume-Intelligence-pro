import Resume from '../models/Resume.js';
import { extractTextFromFile, deleteFile } from '../services/fileService.js';
import { analyzeResume } from '../services/atsService.js';
import { getAIFeedback, getFallbackFeedback } from '../services/openaiService.js';

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded.'
      });
    }

    const { jobTitle } = req.body;
    const userId = req.userId;
    const text = await extractTextFromFile(req.file.path, req.file.mimetype);

    if (!text || text.trim().length === 0) {
      deleteFile(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Could not extract text from the file.'
      });
    }

    const analysis = analyzeResume(text, jobTitle || 'Full Stack Developer');

    let aiFeedback = null;
    try {
      const aiResult = await getAIFeedback(text, jobTitle || 'Full Stack Developer');
      if (aiResult) {
        aiFeedback = {
          summary: aiResult.summary,
          recommendations: aiResult.recommendations || [],
        };
      }
    } catch (error) {
      console.log('AI skipped, using fallback');
    }

    if (!aiFeedback) {
      const fallback = getFallbackFeedback(text);
      aiFeedback = {
        summary: fallback.summary,
        recommendations: fallback.recommendations || [],
      };
    }

    const resume = await Resume.create({
      userId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      extractedText: text,
      jobTitle: jobTitle || 'Full Stack Developer',
      atsScore: analysis.atsScore,
      analysis: analysis.analysis,
      strengths: analysis.strengths,
      improvements: analysis.improvements,
      missingKeywords: analysis.missingKeywords,
      aiFeedback,
    });

    res.status(201).json({
      success: true,
      message: 'Resume uploaded and analyzed successfully!',
      data: {
        id: resume._id,
        filename: resume.originalName,
        atsScore: resume.atsScore,
        analysis: resume.analysis,
        strengths: resume.strengths,
        improvements: resume.improvements,
        missingKeywords: resume.missingKeywords,
        aiFeedback: resume.aiFeedback,
        createdAt: resume.createdAt,
      },
    });

  } catch (error) {
    console.error('Upload error:', error);
    if (req.file && req.file.path) deleteFile(req.file.path);
    res.status(500).json({
      success: false,
      message: 'Error processing resume: ' + error.message,
    });
  }
};

export const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select('originalName atsScore createdAt');
    res.json({ success: true, data: resumes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch resumes' });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.userId });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    res.json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch resume' });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.userId });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    deleteFile(resume.filePath);
    await resume.deleteOne();
    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete resume' });
  }
};

export const getStats = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.userId });
    const stats = {
      total: resumes.length,
      avgScore: resumes.length > 0 
        ? Math.round(resumes.reduce((sum, r) => sum + r.atsScore, 0) / resumes.length)
        : 0,
      highest: resumes.length > 0 ? Math.max(...resumes.map(r => r.atsScore)) : 0,
      lowest: resumes.length > 0 ? Math.min(...resumes.map(r => r.atsScore)) : 0,
    };
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
};