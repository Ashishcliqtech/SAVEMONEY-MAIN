
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title: string;
  message: string;
  onRetry?: () => void;
  showPlaceholder?: boolean;
  placeholderData?: any[];
  renderPlaceholder?: (data: any[]) => React.ReactNode;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  title, 
  message, 
  onRetry,
  showPlaceholder = false,
  placeholderData = [],
  renderPlaceholder,
}) => {
  // If we should show placeholder data and have data to show
  if (showPlaceholder && placeholderData.length > 0 && renderPlaceholder) {
    return (
      <div className="space-y-6">
        <div className="text-center p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <AlertTriangle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <p className="text-sm text-orange-700 font-medium">
            {title} - Showing sample data
          </p>
          <p className="text-xs text-orange-600 mt-1">
            {message}
          </p>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="mt-2 border-orange-300 text-orange-700 hover:bg-orange-100"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
        {renderPlaceholder(placeholderData)}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center p-8 md:p-12 rounded-lg bg-red-50 border-2 border-dashed border-red-200"
    >
      <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-red-800 mb-2">{title}</h3>
      <p className="text-red-600 max-w-sm mx-auto mb-6">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="danger"
          className="font-semibold"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </motion.div>
  );
};
