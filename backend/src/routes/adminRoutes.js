import express from 'express';
import { getStats, getAllUsers } from '../controllers/adminController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all admin routes
router.use(authenticate);

router.get('/stats', getStats);
router.get('/users', getAllUsers);

export default router;