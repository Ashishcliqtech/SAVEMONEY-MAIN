import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Grid2x2 as Grid, List, ExternalLink, Star } from 'lucide-react';
import {
  Card,
  Button,
  Badge,
  SearchBar,
  Pagination,
  ErrorState,
  EmptyState,
  StoreCardSkeleton,
} from '../../components/ui';
import { useStores, useCategories } from '../../hooks/useSupabase';
import { Store } from '../../types';

export const Stores: React.FC = () => {
  const { t } = useTranslation();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    sortBy: 'popularity' as 'name' | 'cashback' | 'popularity',
    sortOrder: 'desc' as 'asc' | 'desc',
    page: 1,
    limit: 15,
  });

  const { data: storesData, isLoading, error } = useStores(filters);
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query, page: 1 }));
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={`mb-8 ${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6' 
              : 'space-y-4'
          }`}>
          {Array.from({ length: filters.limit }).map((_, index) => (
            <StoreCardSkeleton key={index} viewMode={viewMode} />
          ))}
        </div>
      );
    }

    if (error) {
      return <ErrorState title="Failed to Load Stores" message="We couldn't fetch the stores right now. Please try again later." />;
    }

    if (!storesData || !storesData.stores || storesData.stores.length === 0) {
      return <EmptyState title="No Stores Found" message="Try adjusting your search or filters." />;
    }

    return (
      <>
        <div className={`mb-8 ${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6' 
              : 'space-y-4'
          }`}>
          {storesData.stores.map((store: Store, index: number) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="h-full"
            >
              {viewMode === 'grid' ? (
                <Link to={`/stores/${store._id}/offers`} className="h-full block">
                  <Card className="group cursor-pointer overflow-hidden h-full flex flex-col" hover>
                    <div className="relative mb-4 bg-gray-50 rounded-t-lg">
                      <img
                        src={store.logo}
                        alt={store.name}
                        className="w-full h-40 object-contain p-4 rounded-t-lg"
                      />
                      {store.isPopular && (
                        <Badge variant="warning" size="sm" className="absolute top-2 left-2">
                          🔥 Popular
                        </Badge>
                      )}
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                        {store.cashback_rate}% back
                      </div>
                    </div>
                    <div className="space-y-3 flex-1 flex flex-col p-4">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-purple-600 transition-colors mb-1 truncate">
                          {store.name}
                        </h3>
                        <p className="text-sm text-gray-500">{store.category?.name || 'General'}</p>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 flex-1">
                        {store.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">4.5</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {store.totalOffers} offers
                        </span>
                      </div>
                      <div className="mt-auto pt-4">
                        <Button variant="primary" size="sm" fullWidth icon={ExternalLink}>
                          {t('stores.visitStore')}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              ) : (
                <Link to={`/stores/${store._id}/offers`} className="h-full block">
                    <Card className="group cursor-pointer w-full" hover>
                        <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0">
                            <div className="flex-shrink-0 w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center p-2">
                                <img
                                    src={store.logo}
                                    alt={store.name}
                                    className="w-28 h-28 object-contain"
                                />
                            </div>
                            <div className="flex-1 min-w-0 text-center sm:text-left">
                                <div className="flex items-center justify-center sm:justify-start space-x-2 mb-1">
                                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-purple-600 transition-colors">
                                        {store.name}
                                    </h3>
                                    {store.isPopular && (
                                        <Badge variant="warning" size="sm">
                                            🔥 Popular
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 mb-2">{store.category?.name || 'General'}</p>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {store.description}
                                </p>
                            </div>
                            <div className="flex-shrink-0 flex flex-col items-center justify-center space-y-3 w-full sm:w-48">
                                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-base font-bold">
                                    Upto {store.cashback_rate}% Cashback
                                </div>
                                <span className="text-sm text-gray-500">
                                    {store.totalOffers} offers available
                                </span>
                                <Button variant="primary" size="md" className="w-full sm:w-auto" icon={ExternalLink}>
                                    {t('stores.visitStore')}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </Link>
              )}
            </motion.div>
          ))}
        </div>
        {storesData.totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={filters.page}
              totalPages={storesData.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <section className="bg-gradient-to-br from-purple-600 to-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              {t('stores.title')}
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              Shop from 500+ partner stores and earn cashback on every purchase
            </p>
            <div className="max-w-2xl mx-auto">
              <SearchBar
                placeholder="Search stores..."
                onSearch={handleSearch}
                className="bg-white/10 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div className="flex flex-wrap items-center gap-4">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={categoriesLoading}
            >
              <option value="">All Categories</option>
              {categories && categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                handleFilterChange('sortBy', sortBy);
                handleFilterChange('sortOrder', sortOrder);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="popularity-desc">Most Popular</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="cashback-desc">Highest Cashback</option>
              <option value="cashback-asc">Lowest Cashback</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="icon"
              icon={Grid}
              onClick={() => setViewMode('grid')}
              aria-label="Grid View"
            />
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="icon"
              icon={List}
              onClick={() => setViewMode('list')}
              aria-label="List View"
            />
          </div>
        </div>

        {!isLoading && storesData && storesData.stores && storesData.stores.length > 0 && (
             <div className="mb-6">
                <p className="text-gray-600">
                    Showing <span className="font-semibold">{storesData.stores.length}</span> stores (Page <span className="font-semibold">{filters.page}</span> of <span className="font-semibold">{storesData.totalPages}</span>)
                </p>
            </div>
        )}

        {renderContent()}

      </div>
    </div>
  );
};
