import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Card, LoadingCard } from '../../../components/ui';
import { usePopularStores } from '../../../hooks/useSupabase';
import { placeholderStores } from '../../../data/placeholderData';
import { Link } from 'react-router-dom';

interface StoreCarouselProps {
  stores?: any[];
}

export const StoreCarousel: React.FC<StoreCarouselProps> = memo(({ stores: propStores }) => {
  const { data: apiStores, isLoading, error } = usePopularStores();
  
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

  if (!stores || stores.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        No stores available at the moment.
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4 sm:gap-6">
        {stores.map((store, index) => {
          if (!store) return null; 

          const {
            _id = index, 
            name = 'Unknown Store',
            logo,
            category,
            cashbackRate = 0,
            isPopular = false,
          } = store || {};

          return (
            <Link to={`/stores/${_id}/offers`} key={_id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="text-center group cursor-pointer h-full flex flex-col min-h-[200px]"
                hover
                padding="md"
              >
                <div className="relative mb-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
                    {logo ? (
                      <img
                        src={logo}
                        alt={name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            '/fallback-store.png'; 
                        }}
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">No Logo</span>
                    )}
                  </div>
                  {isPopular && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">🔥</span>
                    </div>
                  )}
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                  {name}
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  {category?.name || 'General'}
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="text-xs">
                    <span className="text-green-600 font-semibold">
                      {cashbackRate}% back
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                </div>
              </Card>
            </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
});
