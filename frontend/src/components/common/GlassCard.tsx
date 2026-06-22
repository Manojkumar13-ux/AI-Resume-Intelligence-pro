import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  whileHoverScale?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hover = true,
  whileHoverScale = 1.02,
}) => {
  return (
    <motion.div
      whileHover={hover ? { 
        scale: whileHoverScale,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      } : {}}
      className={`
        glass rounded-2xl p-6 shadow-xl
        border border-white/20 dark:border-gray-700/50
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};