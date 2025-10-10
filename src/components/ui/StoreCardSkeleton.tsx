import React from 'react';
import { Card } from './Card';

interface StoreCardSkeletonProps {
  viewMode: 'grid' | 'list';
}

export const StoreCardSkeleton: React.FC<StoreCardSkeletonProps> = ({ viewMode }) => {
  const commonClasses = 'bg-gray-200 rounded animate-pulse';

  if (viewMode === 'list') {
    return (
      <Card className="w-full">
        <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0">
          <div className={`flex-shrink-0 w-32 h-32 ${commonClasses}`} />
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className={`w-32 h-6 ${commonClasses} mb-2`} />
            <div className={`w-24 h-4 ${commonClasses} mb-3`} />
            <div className={`w-full h-10 ${commonClasses}`} />
          </div>
          <div className="flex-shrink-0 flex flex-col items-center justify-center space-y-3 w-full sm:w-48">
            <div className={`w-3/4 h-8 ${commonClasses} mb-2`} />
            <div className={`w-1/2 h-4 ${commonClasses} mb-3`} />
            <div className={`w-full h-10 ${commonClasses}`} />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <div className={`relative mb-4 h-40 ${commonClasses}`} />
      <div className="space-y-3 flex-1 flex flex-col p-4">
        <div>
          <div className={`w-3/4 h-6 ${commonClasses} mb-2`} />
          <div className={`w-1/2 h-4 ${commonClasses}`} />
        </div>
        <div className={`w-full h-10 ${commonClasses} flex-1`} />
        <div className="flex items-center justify-between">
          <div className={`w-1/4 h-4 ${commonClasses}`} />
          <div className={`w-1/4 h-4 ${commonClasses}`} />
        </div>
        <div className={`w-full h-10 ${commonClasses} mt-auto`} />
      </div>
    </Card>
  );
};
