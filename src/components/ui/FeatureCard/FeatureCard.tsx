import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { Card } from '../Card';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  delay?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  color,
  bgColor,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="text-center h-full" hover>
        <div className={`w-16 h-16 ${bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      </Card>
    </motion.div>
  );
};