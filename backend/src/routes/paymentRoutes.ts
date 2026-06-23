import { Router } from 'express';
import { 
  createPaymentIntent, 
  getPricingPlans,
  createCheckoutSession,
  getSubscriptionStatus,
  cancelSubscription
} from '../controllers/paymentController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.post('/create-payment', auth, createPaymentIntent);
router.post('/create-checkout-session', auth, createCheckoutSession);
router.get('/plans', getPricingPlans);
router.get('/subscription-status', auth, getSubscriptionStatus);
router.post('/cancel-subscription', auth, cancelSubscription);

export default router;