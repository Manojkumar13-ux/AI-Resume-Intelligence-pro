import express from 'express';
import {
  getDashboardData,
  getTrendData,
  getRecommendations
} from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getDashboardData);
router.get('/trend', getTrendData);
router.get('/recommendations', getRecommendations);

export default router;