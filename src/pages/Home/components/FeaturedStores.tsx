import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Store, Sparkles, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePopularStores } from '../../../hooks/useApi'; 
import { ROUTES } from '../../../constants';

const FeaturedStoreCard = ({ store, index }: { store: any; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.08, type: "spring", stiffness: 100 }}
    className="flex-shrink-0 group"
  >
    <Link to={`/stores/${store.id}/offers`} className="block w-[140px] sm:w-[160px] md:w-[200px] lg:w-[220px]">
      <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden aspect-[3/4] shadow-xl hover:shadow-2xl transition-all duration-500">
        {/* Image with zoom effect */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={store.logo}
            alt={store.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
          />
        </div>
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>

        {/* Trending badge */}
        {index < 3 && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
            className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg"
          >
            <TrendingUp className="w-3 h-3" />
            Hot
          </motion.div>
        )}

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-3 md:p-4 lg:p-5">
          <div className="transform transition-transform duration-300 group-hover:translate-y-0 translate-y-1">
            <h3 className="text-white font-bold text-sm md:text-base lg:text-lg tracking-wide drop-shadow-lg mb-1">
              {store.name}
            </h3>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <span className="text-white/90 text-xs md:text-sm font-medium">
                View Offers
              </span>
              <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-white/90 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Border glow on hover */}
        <div className="absolute inset-0 rounded-2xl lg:rounded-3xl border-2 border-transparent group-hover:border-purple-400/50 transition-all duration-300" />
      </div>
    </Link>
  </motion.div>
);

const SkeletonCard = ({ index }: { index: number }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: index * 0.05 }}
    className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[200px] lg:w-[220px] aspect-[3/4] bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 rounded-2xl lg:rounded-3xl animate-pulse relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer" />
  </motion.div>
);

const ErrorState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center text-center py-12 md:py-16 px-4"
  >
    <motion.div
      animate={{ 
        rotate: [0, -10, 10, -10, 0],
      }}
      transition={{ 
        duration: 0.5,
        repeat: Infinity,
        repeatDelay: 3
      }}
      className="w-16 h-16 md:w-20 md:h-20 bg-red-100 rounded-full flex items-center justify-center mb-4 md:mb-6"
    >
      <AlertTriangle className="w-8 h-8 md:w-10 md:h-10 text-red-500" />
    </motion.div>
    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Failed to load stores</h3>
    <p className="text-sm md:text-base text-gray-500 mb-4">Please try refreshing the page.</p>
    <button 
      onClick={() => window.location.reload()}
      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
    >
      Refresh Page
    </button>
  </motion.div>
);

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center text-center py-12 md:py-16 px-4"
  >
    <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4 md:mb-6">
      <Store className="w-8 h-8 md:w-10 md:h-10 text-purple-600" />
    </div>
    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">No Featured Stores</h3>
    <p className="text-sm md:text-base text-gray-500 max-w-sm">
      Check back soon for amazing deals from your favorite stores!
    </p>
  </motion.div>
);

export const FeaturedStores = () => {
  const { data: stores, isLoading, error } = usePopularStores(8);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 pb-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} index={index} />
          ))}
        </div>
      );
    }

    if (error) {
      return <ErrorState />;
    }

    if (!stores || stores.length === 0) {
      return <EmptyState />;
    }

    return (
      <div className="relative group/scroll">
        {/* Left scroll button */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white shadow-xl rounded-full items-center justify-center opacity-0 group-hover/scroll:opacity-100 hover:bg-purple-50 transition-all duration-300 hover:scale-110"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6 text-purple-600" />
        </button>

        {/* Scrollable container */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 pb-2 -mb-2 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {stores.map((store, index) => (
            <FeaturedStoreCard key={store.id} store={store} index={index} />
          ))}
        </div>

        {/* Right scroll button */}
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white shadow-xl rounded-full items-center justify-center opacity-0 group-hover/scroll:opacity-100 hover:bg-purple-50 transition-all duration-300 hover:scale-110"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6 text-purple-600" />
        </button>

        {/* Gradient fade edges */}
        <div className="hidden md:block absolute left-0 top-0 bottom-2 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="hidden md:block absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>
    );
  };

  return (
    <section className="pt-8 md:pt-12 lg:pt-16 pb-4 md:pb-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-100/30 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-fuchsia-100/20 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-10"
        >
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-xl items-center justify-center shadow-lg">
              <Store className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                  Featured Stores
                </h2>
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-fuchsia-500" />
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                Discover amazing deals from top brands
              </p>
            </div>
          </div>
          
          <Link to={ROUTES.STORES}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white rounded-full font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300"
            >
              View all stores
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats bar */}
        {!isLoading && !error && stores && stores.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 sm:gap-6 mb-6 md:mb-8 overflow-x-auto scrollbar-hide pb-2"
          >
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-purple-50 rounded-full whitespace-nowrap">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <span className="text-xs sm:text-sm font-medium text-purple-700">
                {stores.length} Featured Stores
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-fuchsia-50 rounded-full whitespace-nowrap">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-fuchsia-600" />
              <span className="text-xs sm:text-sm font-medium text-fuchsia-700">
                Trending Now
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-orange-50 rounded-full whitespace-nowrap">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
              <span className="text-xs sm:text-sm font-medium text-orange-700">
                Best Deals
              </span>
            </div>
          </motion.div>
        )}

        {/* Content */}
        {renderContent()}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </section>
  );
};