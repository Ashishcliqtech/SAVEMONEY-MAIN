import React from 'react';
import { Card } from './Card';

interface OfferCardSkeletonProps {
  viewMode: 'grid' | 'list';
}

export const OfferCardSkeleton: React.FC<OfferCardSkeletonProps> = ({ viewMode }) => {
  const commonClasses = 'bg-gray-200 rounded animate-pulse';

  return (
    <Card
      className={`group h-full flex flex-col rounded-2xl overflow-hidden bg-white shadow-md ${viewMode === 'list' ? 'flex-row' : ''}`}
      padding="sm"
    >
      <div
        className={`relative ${viewMode === 'list' ? 'w-1/3 min-w-[180px]' : 'mb-4'}`}
      >
        <div className={`w-full h-48 ${commonClasses}`} />
      </div>

      <div
        className={`flex flex-col justify-between ${viewMode === 'list' ? 'flex-1 px-4 py-2' : ''}`}
      >
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className={`w-6 h-6 rounded-full ${commonClasses}`} />
            <div className={`w-24 h-4 ${commonClasses}`} />
          </div>

          <div className={`w-full h-5 ${commonClasses} mb-2`} />
          <div className={`w-3/4 h-5 ${commonClasses} mb-3`} />

          <div className={`w-full h-12 ${commonClasses} mb-3`} />

          <div className={`w-1/2 h-4 ${commonClasses} mb-3`} />
        </div>

        <div className={`w-full h-10 ${commonClasses}`} />
      </div>
    </Card>
  );
};
