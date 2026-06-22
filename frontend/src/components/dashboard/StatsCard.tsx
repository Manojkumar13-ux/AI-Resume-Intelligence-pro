import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../common/GlassCard';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'primary' | 'green' | 'purple' | 'orange' | 'red';
  trend?: number;
  subtitle?: string;
}

const colorMap = {
  primary: 'border-primary-500',
  green: 'border-green-500',
  purple: 'border-purple-500',
  orange: 'border-orange-500',
  red: 'border-red-500',
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
  subtitle,
}) => {
  return (
    <GlassCard className={`border-l-4 ${colorMap[color]}`} hover>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold dark:text-white">{value}</h3>
          {subtitle && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {subtitle}
            </p>
          )}
          {trend !== undefined && (
            <div className="flex items-center mt-1">
              <span
                className={`text-xs ${
                  trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-gray-400'
                }`}
              >
                {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </GlassCard>
  );
};