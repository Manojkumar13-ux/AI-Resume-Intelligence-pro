import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { User } from '../models/User.js';

/**
 * Create a payment intent (Mock - Replace with Stripe in production)
 */
export const createPaymentIntent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { plan = 'pro' } = req.body;

    if (!userId) {
      res.status(401).json({ 
        success: false, 
        message: 'User not authenticated' 
      });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
      return;
    }

    // Mock payment processing
    // In production, integrate with Stripe:
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: plan === 'pro' ? 1999 : 4999,
    //   currency: 'usd',
    //   metadata: { userId, plan }
    // });

    // For now, just update user to Pro
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
    res.status(500).json({ 
      success: false, 
      message: 'Payment failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Create a checkout session (Mock - For Stripe integration)
 */
export const createCheckoutSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { plan = 'pro', successUrl, cancelUrl } = req.body;

    if (!userId) {
      res.status(401).json({ 
        success: false, 
        message: 'User not authenticated' 
      });
      return;
    }

    // Mock checkout session
    // In production, create Stripe checkout session:
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ['card'],
    //   line_items: [{ price: plan === 'pro' ? 'price_pro_123' : 'price_enterprise_456', quantity: 1 }],
    //   mode: 'subscription',
    //   success_url: successUrl || 'https://your-app.com/success',
    //   cancel_url: cancelUrl || 'https://your-app.com/cancel',
    //   metadata: { userId, plan }
    // });

    res.json({
      success: true,
      sessionId: 'cs_test_mock_session_' + Date.now(),
      url: '/checkout/success',
      message: 'Checkout session created'
    });

  } catch (error) {
    console.error('Checkout session error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create checkout session',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get pricing plans
 */
export const getPricingPlans = async (req: Request, res: Response): Promise<void> => {
  try {
    const plans = [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        currency: 'USD',
        features: [
          '3 free analyses',
          'Basic ATS score',
          'Basic suggestions',
          'Resume upload (PDF)'
        ],
        buttonText: 'Current Plan',
        popular: false
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 19.99,
        currency: 'USD',
        features: [
          'Unlimited analyses',
          'Advanced ATS scoring',
          'Detailed AI suggestions',
          'Priority support',
          'Export reports (PDF)',
          'Compare multiple resumes'
        ],
        buttonText: 'Upgrade to Pro',
        popular: true
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 49.99,
        currency: 'USD',
        features: [
          'Everything in Pro',
          'Team collaboration',
          'Custom AI model',
          'Dedicated support',
          'API access',
          'White-label reporting'
        ],
        buttonText: 'Contact Sales',
        popular: false
      }
    ];
    
    res.json({ 
      success: true, 
      plans,
      message: 'Pricing plans retrieved successfully'
    });
  } catch (error) {
    console.error('Pricing plans error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get pricing plans',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get user subscription status
 */
export const getSubscriptionStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      res.status(401).json({ 
        success: false, 
        message: 'User not authenticated' 
      });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
      return;
    }

    const isPro = User.isPro ? User.isPro(user) : 
      (user.subscription?.plan !== 'free' && 
       (!user.subscription?.expiresAt || new Date(user.subscription.expiresAt) > new Date()));

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
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get subscription status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Cancel user subscription
 */
export const cancelSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      res.status(401).json({ 
        success: false, 
        message: 'User not authenticated' 
      });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
      return;
    }

    // In production, cancel subscription in Stripe:
    // if (user.stripeSubscriptionId) {
    //   await stripe.subscriptions.update(user.stripeSubscriptionId, {
    //     cancel_at_period_end: true
    //   });
    // }

    // Update user subscription
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
    res.status(500).json({ 
      success: false, 
      message: 'Failed to cancel subscription',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};