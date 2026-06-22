import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/common/Navbar';
import { GlassCard } from '../components/common/GlassCard';

const Home: React.FC = () => {
  const { user } = useAuth();

  const features = [
    { icon: '🎯', title: 'ATS Score', description: 'Get a detailed ATS compatibility score' },
    { icon: '📊', title: 'Skill Analysis', description: 'Identify your key skills and gaps' },
    { icon: '💡', title: 'Smart Suggestions', description: 'Get AI-powered improvement tips' },
    { icon: '📄', title: 'PDF Reports', description: 'Download professional analysis reports' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-6"
          >
            🧠
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-6">
            AI Resume Intelligence Pro
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Optimize your resume for ATS systems and land your dream job with AI-powered analysis
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {user ? (
              <Link to="/dashboard" className="btn-primary text-lg">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary text-lg">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn-secondary text-lg">
                  Sign In
                </Link>
              </>
            )}
          </div>
          {!user && (
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Free users get 3 credits • No credit card required
            </p>
          )}
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="text-center" hover>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold dark:text-white">{feature.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {feature.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <GlassCard className="text-center p-12">
          <h2 className="text-3xl font-bold dark:text-white mb-4">
            Ready to Improve Your Resume?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Join thousands of job seekers who have improved their ATS scores with our AI
          </p>
          {!user && (
            <Link to="/register" className="btn-primary text-lg inline-block">
              Start Your Free Trial
            </Link>
          )}
        </GlassCard>
      </section>
    </div>
  );
};

export default Home;