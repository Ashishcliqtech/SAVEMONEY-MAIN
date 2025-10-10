import React from 'react';
import { Card } from '../../components/ui/Card/Card';

const StorePageSkeleton: React.FC = () => {
  const commonClasses = 'bg-gray-200 rounded animate-pulse';

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Store Header Skeleton */}
      <section className="relative bg-white">
        <div className={`h-48 md:h-64 ${commonClasses}`} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-24 space-y-4 md:space-y-0 md:space-x-8">
            <div className={`flex-shrink-0 w-32 h-32 md:w-48 md:h-48 rounded-lg border-4 border-white bg-white shadow-lg ${commonClasses}`} />
            <div className="text-center md:text-left py-4">
              <div className={`h-10 w-48 mb-3 ${commonClasses}`} />
              <div className={`h-4 w-80 mb-4 ${commonClasses}`} />
              <div className={`h-4 w-64 ${commonClasses}`} />
              <div className="mt-4 flex justify-center md:justify-start items-center gap-4">
                <div className={`h-10 w-32 ${commonClasses} rounded-full`} />
                <div className={`h-6 w-24 ${commonClasses} rounded-full`} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offers Section Skeleton */}
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`h-8 w-64 mb-8 ${commonClasses}`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="group overflow-hidden h-full flex flex-col" padding="sm">
                <div className={`relative mb-4 h-48 ${commonClasses}`} />
                <div className="space-y-3 flex-1 flex flex-col">
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
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StorePageSkeleton;
