
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
  showPlaceholder?: boolean;
  placeholderData?: any[];
  renderPlaceholder?: (data: any[]) => React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  message,
  actionText,
  onAction,
  showPlaceholder = false,
  placeholderData = [],
  renderPlaceholder,
}) => {
  // If we should show placeholder data and have data to show
  if (showPlaceholder && placeholderData.length > 0 && renderPlaceholder) {
    return (
      <div className="space-y-6">
        <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <Icon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-sm text-blue-700 font-medium">
            {title} - Showing sample data
          </p>
          <p className="text-xs text-blue-600 mt-1">
            {message}
          </p>
        </div>
        {renderPlaceholder(placeholderData)}
      </div>
    );
  }

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
