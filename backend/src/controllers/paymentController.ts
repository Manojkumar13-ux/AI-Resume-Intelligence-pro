import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { User } from '../models/User.js';

export const createPaymentIntent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { plan = 'pro' } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, {
      subscription: {
        plan: plan,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    });

    res.json({
      success: true,
      message: 'Payment successful! You are now a Pro user.',
      user: {
        id: updatedUser?.id,
        email: updatedUser?.email,
        name: updatedUser?.name,
        credits: updatedUser?.credits,
        subscription: updatedUser?.subscription,
        isPro: updatedUser ? User.isPro(updatedUser) : false
      }
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ success: false, message: 'Payment failed' });
  }
};

export const createCheckoutSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { plan = 'pro' } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    res.json({
      success: true,
      sessionId: 'cs_test_mock_' + Date.now(),
      url: '/checkout/success',
      message: 'Checkout session created'
    });
  } catch (error) {
    console.error('Checkout session error:', error);
    res.status(500).json({ success: false, message: 'Failed to create checkout session' });
  }
};

export const getPricingPlans = async (req: Request, res: Response): Promise<void> => {
  try {
    const plans = [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        currency: 'USD',
        features: ['3 free analyses', 'Basic ATS score', 'Basic suggestions'],
        buttonText: 'Current Plan',
        popular: false
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 19.99,
        currency: 'USD',
        features: ['Unlimited analyses', 'Advanced ATS scoring', 'Detailed AI suggestions', 'Priority support', 'Export reports'],
        buttonText: 'Upgrade to Pro',
        popular: true
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 49.99,
        currency: 'USD',
        features: ['Everything in Pro', 'Team collaboration', 'Custom AI model', 'Dedicated support'],
        buttonText: 'Contact Sales',
        popular: false
      }
    ];
    
    res.json({ success: true, plans });
  } catch (error) {
    console.error('Pricing plans error:', error);
    res.status(500).json({ success: false, message: 'Failed to get pricing plans' });
  }
};

export const getSubscriptionStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const isPro = user.subscription?.plan !== 'free' && 
                  (!user.subscription?.expiresAt || new Date(user.subscription.expiresAt) > new Date());

    res.json({
      success: true,
      subscription: {
        plan: user.subscription?.plan || 'free',
        isPro: isPro,
        expiresAt: user.subscription?.expiresAt || null,
        creditsRemaining: user.credits || 0,
        isExpired: user.subscription?.expiresAt ? new Date(user.subscription.expiresAt) < new Date() : false
      }
    });
  } catch (error) {
    console.error('Subscription status error:', error);
    res.status(500).json({ success: false, message: 'Failed to get subscription status' });
  }
};

export const cancelSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, {
      subscription: {
        plan: 'free',
        expiresAt: null
      }
    });

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      user: {
        id: updatedUser?.id,
        email: updatedUser?.email,
        name: updatedUser?.name,
        subscription: updatedUser?.subscription,
        isPro: false
      }
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel subscription' });
  }
};