import React from 'react';
import { Card } from '../../components/ui/Card/Card';

interface StoreOffersPageSkeletonProps {
  viewMode: 'grid' | 'list';
}

const StoreOffersPageSkeleton: React.FC<StoreOffersPageSkeletonProps> = ({ viewMode }) => {
  const commonClasses = 'bg-gray-200 rounded animate-pulse';

  return (
    <div>
        <div className="flex items-center justify-between mb-6">
            <div className={`h-6 w-48 ${commonClasses}`} />
            <div className="flex items-center space-x-2">
                <div className={`h-10 w-10 ${commonClasses}`} />
                <div className={`h-10 w-10 ${commonClasses}`} />
            </div>
        </div>
        <div className={`mb-8 ${
            viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-4'
        }`}>
        {Array.from({ length: 8 }).map((_, index) => (
            viewMode === 'grid' ? (
            <Card key={index} className="group overflow-hidden h-full flex flex-col" padding="sm">
                <div className={`relative mb-4 h-48 ${commonClasses}`} />
                <div className="space-y-3 flex-1 flex flex-col">
                <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-6 h-6 rounded-full ${commonClasses}`} />
                    <div className={`h-4 w-24 ${commonClasses}`} />
                </div>
                <div>
                    <div className={`h-5 w-3/4 mb-2 ${commonClasses}`} />
                    <div className={`h-5 w-1/2 mb-2 ${commonClasses}`} />
                    <div className={`h-12 w-full mt-4 ${commonClasses}`} />
                </div>
                <div className={`h-6 w-3/4 mt-4 ${commonClasses}`} />
                <div className="space-y-2 mt-auto pt-4">
                    <div className={`h-10 w-full ${commonClasses}`} />
                </div>
                </div>
            </Card>
            ) : (
                <Card key={index} className="w-full">
                    <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0">
                        <div className={`flex-shrink-0 w-48 h-48 ${commonClasses}`} />
                        <div className="flex-1 min-w-0 text-center sm:text-left">
                            <div className={`h-6 w-3/4 mb-2 ${commonClasses}`} />
                            <div className={`h-4 w-full mb-3 ${commonClasses}`} />
                            <div className={`h-4 w-5/6 mb-4 ${commonClasses}`} />
                            <div className={`h-6 w-1/2 ${commonClasses}`} />
                        </div>
                        <div className="flex-shrink-0 flex flex-col items-center justify-center space-y-3 w-full sm:w-48">
                            <div className={`h-10 w-3/4 ${commonClasses} rounded-full`} />
                            <div className={`h-10 w-full ${commonClasses}`} />
                        </div>
                    </div>
                </Card>
            )
        ))}
        </div>
    </div>
  );
};

export default StoreOffersPageSkeleton;
