import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, LoadingCard } from '../../../components/ui';
import { usePopularStores } from '../../../hooks/useSupabase';
import { placeholderStores } from '../../../data/placeholderData';
import { Link } from 'react-router-dom';

interface StoreCarouselProps {
  stores?: any[];
}

export const StoreCarousel: React.FC<StoreCarouselProps> = memo(({ stores: propStores }) => {
  const { data: apiStores, isLoading, error } = usePopularStores();
  
  // Use prop stores, API stores, or fallback to placeholder data
  const stores = propStores || 
    (error || !apiStores || apiStores.length === 0 ? placeholderStores : apiStores);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <LoadingCard key={index} height="h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4 sm:gap-6">
        {stores.map((store, index) => (
          <Link to={`/stores/${store.id}`} key={store.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center group cursor-pointer h-full flex flex-col min-h-[200px]" hover padding="md">
                <div className="relative mb-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden bg-gray-100">
                    <img
                      src={store.logo}
                      alt={store.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {store.isPopular && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">🔥</span>
                    </div>
                  )}
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{store.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{store.category?.name || 'General'}</p>
                
                <div className="flex items-center justify-center mt-auto">
                  <div className="text-xs">
                    <span className="text-green-600 font-semibold">
                      {store.cashbackRate}% back
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
});
