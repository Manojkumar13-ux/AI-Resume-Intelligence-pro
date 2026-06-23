import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js'; // Added .js
import { User } from '../models/User.js'; // Added .js

export const createPaymentIntent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { plan } = req.body;

    // Mock payment - in production use Stripe
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Update user to Pro
    await User.findByIdAndUpdate(userId, {
      subscription: {
        plan: 'pro',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    });

    res.json({
      success: true,
      message: 'Payment successful! You are now a Pro user.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscription: {
          plan: 'pro',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        isPro: true
      }
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ success: false, message: 'Payment failed' });
  }
};

export const getPricingPlans = async (req: Request, res: Response): Promise<void> => {
  try {
    const plans = [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        features: [
          '3 free analyses',
          'Basic ATS score',
          'Basic suggestions'
        ]
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 19.99,
        features: [
          'Unlimited analyses',
          'Advanced ATS scoring',
          'Detailed suggestions',
          'Priority support',
          'Export reports'
        ]
      }
    ];
    
    res.json({ success: true, plans });
  } catch (error) {
    console.error('Pricing plans error:', error);
    res.status(500).json({ success: false, message: 'Failed to get plans' });
  }
};