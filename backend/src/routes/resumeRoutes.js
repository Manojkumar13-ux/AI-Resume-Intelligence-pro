import express from 'express';
import upload from '../middleware/upload.js';
import { authenticate } from '../middleware/auth.js';
import {
  uploadResume,
  getResumes,
  getResumeById,
  deleteResume,
  getStats,
} from '../controllers/resumeController.js';

const router = express.Router();

router.use(authenticate);

router.post('/upload', upload.single('resume'), uploadResume);
router.get('/', getResumes);
router.get('/stats', getStats);
router.get('/:id', getResumeById);
router.delete('/:id', deleteResume);

export default router;