import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  extractedText: {
    type: String,
    required: true,
  },
  atsScore: {
    type: Number,
    required: true,
  },
  analysis: {
    skills: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    education: { type: Number, default: 0 },
    keywords: { type: Number, default: 0 },
    format: { type: Number, default: 0 },
  },
  strengths: [String],
  improvements: [String],
  missingKeywords: [String],
  jobTitle: {
    type: String,
    default: 'Full Stack Developer',
  },
  aiFeedback: {
    summary: String,
    recommendations: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Resume', resumeSchema);