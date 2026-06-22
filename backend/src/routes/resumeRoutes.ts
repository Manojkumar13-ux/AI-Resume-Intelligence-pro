import express from 'express';
import {
  uploadResume,
  analyzeResume,
  getResumeHistory,
  getResumeById,
  deleteResume
} from '../controllers/resumeController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/upload', uploadResume);
router.post('/:resumeId/analyze', analyzeResume);
router.get('/history', getResumeHistory);
router.get('/:resumeId', getResumeById);
router.delete('/:resumeId', deleteResume);

export default router;