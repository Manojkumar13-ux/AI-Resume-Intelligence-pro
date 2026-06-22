import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { GlassCard } from '../components/common/GlassCard';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const PricingPage: React.FC = () => {
  const { user } = useAuth();

  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for getting started',
      features: [
        '3 free resume analyses',
        'Basic ATS score',
        'Improvement suggestions',
        'PDF download',
      ],
      button: 'Get Started',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$19',
      period: '/month',
      description: 'For serious job seekers',
      features: [
        'Unlimited resume analyses',
        'Job description matching',
        'AI resume rewriting',
        'Advanced ATS simulation',
        'Resume comparison',
        'Priority support',
      ],
      button: 'Upgrade to Pro',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$49',
      period: '/month',
      description: 'For teams and organizations',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Custom branding',
        'API access',
        'Dedicated account manager',
        'Custom integrations',
      ],
      button: 'Contact Sales',
      popular: false,
    },
  ];

  const handleUpgrade = (plan: string) => {
    if (!user) {
      toast.error('Please sign in first');
      return;
    }
    toast.success(`Upgrading to ${plan} plan...`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
            Get the tools you need to land your dream job
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard
                className={`text-center h-full flex flex-col ${
                  plan.popular ? 'border-2 border-primary-500 relative' : ''
                }`}
                whileHoverScale={1.03}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary-500 to-purple-500 text-white text-xs font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold dark:text-white">{plan.name}</h3>
                  <div className="mt-4 mb-2">
                    <span className="text-4xl font-bold dark:text-white">{plan.price}</span>
                    {plan.period && (
                      <span className="text-gray-500 dark:text-gray-400">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{plan.description}</p>
                  <ul className="mt-6 space-y-3 text-left">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <span className="text-green-500">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => handleUpgrade(plan.name)}
                  className={`mt-8 w-full py-3 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                >
                  {plan.button}
                </button>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            All plans include a 30-day money-back guarantee. No questions asked.
          </p>
        </div>
      </main>
    </div>
  );
};

export default PricingPage;