import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { usePopularStores } from '../../../hooks/useApi'; 
import { ROUTES } from '../../../constants';

const FeaturedStoreCard = ({ store, index }: { store: any; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="flex-shrink-0"
  >
    <Link to={`/stores/${store.id}/offers`} className="block w-[130px] md:w-[180px]">
      <div className="group relative rounded-2xl overflow-hidden aspect-[3/4] shadow-lg">
        <img
          src={store.logo}
          alt={store.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-3 md:p-4">
          <h3 className="text-white font-semibold text-sm md:text-base tracking-wide">
            {store.name}
          </h3>
        </div>
      </div>
    </Link>
  </motion.div>
);

const SkeletonCard = () => (
  <div className="flex-shrink-0 w-[130px] md:w-[180px] aspect-[3/4] bg-gray-200 rounded-2xl animate-pulse" />
);

export const FeaturedStores = () => {
  const { data: stores, isLoading, error } = usePopularStores(8); 

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex gap-4 md:gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-10">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800">Failed to load stores</h3>
          <p className="text-gray-500 mt-2">Please try refreshing the page.</p>
        </div>
      );
    }

    if (!stores || stores.length === 0) {
      return (
        <div className="text-center text-gray-500 py-10">
          No featured stores available right now.
        </div>
      );
    }

    return (
      <div className="flex gap-4 md:gap-6 pb-2 -mb-2 overflow-x-auto scrollbar-hide">
        {stores.map((store, index) => (
          <FeaturedStoreCard key={store.id} store={store} index={index} />
        ))}
      </div>
    );
  };

  return (
    <section className="pt-6 md:pt-8 pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Featured Stores
          </h2>
          <Link to={ROUTES.STORES}>
            <button className="flex items-center gap-1 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors">
              View all
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
        {renderContent()}
      </div>
    </section>
  );
};
