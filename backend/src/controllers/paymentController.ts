import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { User } from '../models/User.js';

export const createCheckoutSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { plan } = req.body;
    
    if (!['pro', 'enterprise'].includes(plan)) {
      res.status(400).json({ message: 'Invalid plan' });
      return;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    user.subscription = {
      plan,
      expiresAt
    };
    await user.save();

    res.json({
      success: true,
      message: `Upgraded to ${plan} plan successfully`,
      subscription: user.subscription
    });

  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSubscriptionStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      success: true,
      subscription: {
        plan: user.subscription.plan,
        expiresAt: user.subscription.expiresAt,
        isActive: user.isPro,
        credits: user.credits
      }
    });

  } catch (error) {
    console.error('Subscription status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const cancelSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.subscription = {
      plan: 'free',
      expiresAt: null
    };
    await user.save();

    res.json({
      success: true,
      message: 'Subscription cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};