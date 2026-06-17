import User from '../models/User.js';
import { createCheckoutSession, getSubscriptionStatus, cancelSubscription } from '../services/stripeService.js';

// Create checkout session
export const createCheckout = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const url = await createCheckoutSession(user._id.toString(), user.email);
    res.json({
      success: true,
      url,
    });
  } catch (error) {
    console.error('Create checkout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create checkout session',
    });
  }
};

// Get subscription status
export const getSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      isPro: user.isPro,
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subscription status',
    });
  }
};

// Cancel subscription
export const cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.subscriptionId) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription found',
      });
    }

    await cancelSubscription(user.subscriptionId);
    user.isPro = false;
    user.subscriptionId = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel subscription',
    });
  }
};

// Stripe webhook
export const webhook = async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'];
    const event = await handleWebhook(req.body, signature);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata.userId;
        await User.findByIdAndUpdate(userId, {
          isPro: true,
          stripeCustomerId: session.customer,
        });
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await User.findOneAndUpdate(
          { subscriptionId: subscription.id },
          { isPro: false, subscriptionId: null }
        );
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({
      success: false,
      message: 'Webhook failed',
    });
  }
};