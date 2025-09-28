
import React from 'react';
import { motion } from 'framer-motion';

interface LoadingCardProps {
  count?: number;
  className?: string;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({ count = 1, className }) => {
  return (
    <div className={className}>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.5 }}
          animate={{
            opacity: [0.5, 1, 0.5],
            transition: {
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
          className="bg-gray-200 rounded-lg p-4 space-y-3"
        >
          <div className="h-32 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </motion.div>
      ))}
    </div>
  );
};
