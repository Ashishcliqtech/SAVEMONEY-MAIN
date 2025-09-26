import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { Card } from '../Card';

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  delay?: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  trend,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="text-center h-full" hover>
        <div className={`w-16 h-16 ${bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {value}
        </div>
        <div className="text-gray-600 mb-2">{title}</div>
        {trend && (
          <div className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '↗' : '↘'} {trend.value}
          </div>
        )}
      </Card>
    </motion.div>
  );
};