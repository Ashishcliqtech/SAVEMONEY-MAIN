import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Clock, Copy, ExternalLink, Filter, Grid2x2 as Grid, List } from 'lucide-react';
import { Card, Button, Badge, SearchBar, Pagination, LoadingSpinner } from '../../components/ui';
import { useOffers, useCategories } from '../../hooks/useSupabase';
import toast from 'react-hot-toast';

export const Offers: React.FC = () => {
  const { t } = useTranslation();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    category: '',
    offerType: '',
    minCashback: '',
    search: '',
    sortBy: 'popularity' as 'cashback' | 'expiry' | 'popularity',
    sortOrder: 'desc' as 'asc' | 'desc',
    page: 1,
    limit: 12,
  });

  const { data: offersData, isLoading } = useOffers(filters);
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

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Coupon code copied!');
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
      <section className="bg-gradient-to-br from-orange-500 to-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              {t('offers.title')}
            </h1>
            <p className="text-xl text-orange-100 mb-8">
              Discover the best deals, coupons, and cashback offers
            </p>
            
            <div className="max-w-2xl mx-auto">
              <SearchBar
                placeholder="Search offers, stores, or brands..."
                onSearch={handleSearch}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">All Categories</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={filters.offerType}
              onChange={(e) => handleFilterChange('offerType', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">All Types</option>
              <option value="cashback">Cashback</option>
              <option value="coupon">Coupon</option>
              <option value="deal">Deal</option>
            </select>

            <input
              type="number"
              placeholder="Min Cashback %"
              value={filters.minCashback}
              onChange={(e) => handleFilterChange('minCashback', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                handleFilterChange('sortBy', sortBy);
                handleFilterChange('sortOrder', sortOrder);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="popularity-desc">Most Popular</option>
              <option value="cashback-desc">Highest Cashback</option>
              <option value="expiry-asc">Expiring Soon</option>
            </select>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {offersData?.offers.length || 0} of {offersData?.total || 0} offers
          </p>
          
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

        {/* Offers Grid/List */}
        <div className={`mb-8 ${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-4'
        }`}>
          {offersData?.offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="h-full"
            >
              <Card className="group overflow-hidden h-full flex flex-col min-h-[480px]" hover padding="sm">
                {/* Image */}
                <div className="relative mb-4">
                  <img
                    src={offer.imageUrl}
                    alt={offer.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {offer.isExclusive && (
                      <Badge variant="danger" size="sm">
                        Exclusive
                      </Badge>
                    )}
                    {offer.isTrending && (
                      <Badge variant="warning" size="sm">
                        🔥 Trending
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                    {offer.cashbackRate}% back
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3 flex-1 flex flex-col">
                  {/* Store Info */}
                  <div className="flex items-center space-x-2 mb-2">
                    <img
                      src={offer.store.logo}
                      alt={offer.store.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-gray-600">
                      {offer.store.name}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-base leading-tight">
                      {offer.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3 h-16">
                      {offer.description.length > 100 ? `${offer.description.substring(0, 100)}...` : offer.description}
                    </p>
                  </div>

                  {/* Price Info */}
                  {offer.originalPrice && offer.discountedPrice && (
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{offer.discountedPrice.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ₹{offer.originalPrice.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* Expiry */}
                  <div className="flex items-center text-sm text-orange-600 mb-4">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Valid till {new Date(offer.expiryDate).toLocaleDateString()}</span>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 mt-auto">
                    {offer.couponCode ? (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm" 
                          icon={Copy}
                          onClick={() => handleCopyCode(offer.couponCode!)}
                          className="flex-1 text-xs min-w-0"
                        >
                          {offer.couponCode.length > 8 ? `${offer.couponCode.substring(0, 8)}...` : offer.couponCode}
                        </Button>
                        <Button variant="primary" size="sm" icon={ExternalLink}>
                          {t('offers.shopNow')}
                        </Button>
                      </div>
                    ) : (
                      <Button variant="primary" size="sm" fullWidth icon={ExternalLink}>
                        {t('offers.getOffer')}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {offersData && offersData.total > filters.limit && (
          <Pagination
            currentPage={filters.page}
            totalPages={Math.ceil(offersData.total / filters.limit)}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};