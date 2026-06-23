import express from 'express';
import {
  createCheckoutSession,
  getSubscriptionStatus,
  cancelSubscription
} from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/checkout', createCheckoutSession);
router.get('/subscription', getSubscriptionStatus);
router.post('/cancel-subscription', cancelSubscription);

export default router;