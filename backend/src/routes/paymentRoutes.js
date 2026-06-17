import express from 'express';
import {
  createCheckout,
  getSubscription,
  cancelSubscription,
  webhook,
} from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-checkout', authenticate, createCheckout);
router.get('/subscription', authenticate, getSubscription);
router.post('/cancel', authenticate, cancelSubscription);
router.post('/webhook', express.raw({ type: 'application/json' }), webhook);

export default router;