import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Pricing IDs – create these in Stripe Dashboard
const PRICE_IDS = {
  monthly: 'price_monthly_123',
  yearly: 'price_yearly_123',
};

export const createCheckoutSession = async (userId, email, priceId = PRICE_IDS.monthly) => {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/pricing`,
    customer_email: email,
    metadata: { userId },
  });
  return session.url;
};

export const getSubscriptionStatus = async (userId) => {
  try {
    const subscriptions = await stripe.subscriptions.list({
      limit: 1,
    });
    return subscriptions.data[0] || null;
  } catch {
    return null;
  }
};

export const cancelSubscription = async (subscriptionId) => {
  return await stripe.subscriptions.cancel(subscriptionId);
};

export const handleWebhook = async (payload, signature) => {
  const event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
  return event;
};