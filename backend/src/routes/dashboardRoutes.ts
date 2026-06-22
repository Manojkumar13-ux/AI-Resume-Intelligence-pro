import express from 'express';
import {
  getDashboardData,
  getTrendData,
  getRecommendations
} from '../controllers/dashboardController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.get('/', getDashboardData);
router.get('/trend', getTrendData);
router.get('/recommendations', getRecommendations);

export default router;