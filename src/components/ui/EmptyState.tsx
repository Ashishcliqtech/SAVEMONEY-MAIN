
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  message,
  actionText,
  onAction,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center p-8 md:p-12 rounded-lg bg-gray-50 border-2 border-dashed border-gray-200"
    >
      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-sm mx-auto mb-6">{message}</p>
      {actionText && onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          className="bg-orange-500 hover:bg-orange-600 font-semibold"
        >
          {actionText}
        </Button>
      )}
    </motion.div>
  );
};
