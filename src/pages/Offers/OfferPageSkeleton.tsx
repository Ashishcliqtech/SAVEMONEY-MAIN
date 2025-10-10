import React from 'react';

const OfferPageSkeleton: React.FC = () => {
  const commonClasses = 'bg-gray-200 rounded animate-pulse';
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className={`h-8 w-3/4 mb-4 ${commonClasses}`} />
        <div className={`h-4 w-full mb-2 ${commonClasses}`} />
        <div className={`h-4 w-5/6 mb-6 ${commonClasses}`} />
        <div className="flex items-center justify-between">
          <div className={`h-6 w-1/4 ${commonClasses}`} />
          <div className={`h-10 w-28 bg-gray-300 rounded animate-pulse`} />
        </div>
      </div>
    </div>
  );
};

export default OfferPageSkeleton;
