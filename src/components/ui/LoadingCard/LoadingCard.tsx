import React from 'react';
import { motion } from 'framer-motion';

interface LoadingCardProps {
  height?: string;
  className?: string;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({
  height = 'h-48',
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}>
      <div className="animate-pulse">
        {/* Image placeholder */}
        <div className={`bg-gray-200 ${height} w-full`}>
          <motion.div
            className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        
        {/* Content placeholder */}
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
          <div className="flex justify-between items-center pt-2">
            <div className="h-6 bg-gray-200 rounded w-20"></div>
            <div className="h-8 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
};