import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Search, Filter, Grid2x2 as Grid, List, ExternalLink, Star } from 'lucide-react';
import { Card, Button, Badge, SearchBar, Pagination, LoadingSpinner } from '../../components/ui';
import { useStores, useCategories } from '../../hooks/useSupabase';

export const Stores: React.FC = () => {
  const { t } = useTranslation();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    sortBy: 'popularity' as 'name' | 'cashback' | 'popularity',
    sortOrder: 'desc' as 'asc' | 'desc',
    page: 1,
    limit: 12,
  });

  const { data: storesData, isLoading } = useStores(filters);
  const { data: categories } = useCategories();

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query, page: 1 }));
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              {t('stores.title')}
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              Shop from 500+ partner stores and earn cashback on every purchase
            </p>
            
            {/* Search Bar */}
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
        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div className="flex flex-wrap items-center gap-4">
            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Categories</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Sort Options */}
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

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              icon={Grid}
              onClick={() => setViewMode('grid')}
            />
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              icon={List}
              onClick={() => setViewMode('list')}
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {storesData?.stores.length || 0} of {storesData?.total || 0} stores
          </p>
        </div>

        {/* Stores Grid/List */}
        <div className={`mb-8 ${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6' 
            : 'space-y-4'
        }`}>
          {storesData?.stores.map((store, index) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="h-full"
            >
              {viewMode === 'grid' ? (
                <Card className="group cursor-pointer overflow-hidden h-full flex flex-col" hover>
                  {/* Store Image */}
                  <div className="relative mb-4">
                    <img
                      src={store.logo}
                      alt={store.name}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    {store.isPopular && (
                      <Badge variant="warning" size="sm" className="absolute top-2 left-2">
                        🔥 Popular
                      </Badge>
                    )}
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                      {store.cashbackRate}% back
                    </div>
                  </div>

                  {/* Store Info */}
                  <div className="space-y-3 flex-1 flex flex-col">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-purple-600 transition-colors mb-1">
                        {store.name}
                      </h3>
                      <p className="text-sm text-gray-500">{store.category}</p>
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

                    <div className="mt-auto">
                      <Button
                        variant="primary"
                        size="sm"
                        fullWidth
                        icon={ExternalLink}
                      >
                        {t('stores.visitStore')}
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="group cursor-pointer h-full" hover>
                  <div className="flex items-center space-x-4">
                    <img
                      src={store.logo}
                      alt={store.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-purple-600 transition-colors">
                          {store.name}
                        </h3>
                        {store.isPopular && (
                          <Badge variant="warning" size="sm">
                            🔥 Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{store.category}</p>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {store.description}
                      </p>
                    </div>

                    <div className="text-right space-y-2">
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {store.cashbackRate}% back
                      </div>
                      <div className="text-sm text-gray-500">
                        {store.totalOffers} offers
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        icon={ExternalLink}
                      >
                        {t('stores.visitStore')}
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {storesData && storesData.total > filters.limit && (
          <Pagination
            currentPage={filters.page}
            totalPages={Math.ceil(storesData.total / filters.limit)}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};