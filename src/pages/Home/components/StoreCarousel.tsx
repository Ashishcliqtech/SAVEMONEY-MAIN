import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Card } from '../../../components/ui';
import { usePopularStores } from '../../../hooks/useSupabase';

export const StoreCarousel: React.FC = () => {
  const { data: stores } = usePopularStores();

  if (!stores) return null;

  return (
    <div className="relative">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4 sm:gap-6">
        {stores.map((store, index) => (
          <motion.div
            key={store.id}
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
              
              <div className="flex items-center justify-between mt-auto">
                <div className="text-xs">
                  <span className="text-green-600 font-semibold">
                    {store.cashbackRate}% back
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};