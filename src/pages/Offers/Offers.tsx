import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Copy, ExternalLink, Grid2x2 as Grid, List, X, Filter } from 'lucide-react';
import {
  Card,
  Button,
  Badge,
  SearchBar,
  Pagination,
  EmptyState,
  ErrorState,
  OfferCardSkeleton,
} from '../../components/ui';
import { useOffers, useCategories } from '../../hooks/useApi';
import toast from 'react-hot-toast';
import { Offer, Category } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { offersApi } from '../../api';

const INITIAL_FILTERS = {
  category: '',
  offerType: '',
  minCashback: '',
  search: '',
  sortBy: 'popularity' as 'cashback' | 'expiry' | 'popularity',
  sortOrder: 'desc' as 'asc' | 'desc',
  page: 1,
  limit: 12,
};

export const Offers: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  const { data: offersData, isLoading, error } = useOffers(filters);
  const { data: categoriesData } = useCategories();

  const offers = offersData?.offers || [];
  const categories = categoriesData || [];

  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, search: query, page: 1 }));
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleClearFilters = () => setFilters(INITIAL_FILTERS);

  const handlePageChange = (page: number) => setFilters((prev) => ({ ...prev, page }));

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Coupon code copied!');
  };

  const handleOfferClick = async (offer: Offer) => {
    const offerUrl = offer.url || offer.store.url;
    if (!isAuthenticated) {
      window.open(offerUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    const toastId = toast.loading('Redirecting to store...');
    try {
      const response = await offersApi.trackOfferClick(offer._id);
      const redirectUrl = response.redirectUrl || offerUrl;
      toast.dismiss(toastId);
      window.open(redirectUrl, '_blank', 'noopener,noreferrer');
    } catch {
      toast.dismiss(toastId);
      toast.error('Could not track click, redirecting anyway.');
      window.open(offerUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div
          className={`mb-8 ${
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }`}
        >
          {Array.from({ length: filters.limit }).map((_, index) => (
            <OfferCardSkeleton key={index} viewMode={viewMode} />
          ))}
        </div>
      );
    }
    if (error) {
      return <ErrorState title="Failed to Load Offers" message="Please try again later." />;
    }
    if (!offers?.length) {
      return <EmptyState title="No Offers Found" message="Try adjusting your filters or search." />;
    }

    return (
      <>
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`mb-8 ${
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }`}
          >
            {offers.map((offer, index) => (
              <motion.div
                key={offer._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`group h-full flex flex-col rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow duration-300 ${
                    viewMode === 'list' ? 'flex-row' : ''
                  }`}
                  padding="sm"
                >
                  <div
                    className={`relative ${
                      viewMode === 'list' ? 'w-1/3 min-w-[180px]' : 'mb-4'
                    }`}
                  >
                    <img
                      src={offer.imageUrl || 'https://placehold.co/400x300?text=Offer'}
                      alt={offer.title}
                      className="w-full h-48 object-cover rounded-xl"
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
                    <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      {offer.cashbackRate}% Back
                    </div>
                  </div>

                  <div
                    className={`flex flex-col justify-between ${
                      viewMode === 'list' ? 'flex-1 px-4 py-2' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <img
                          src={
                            offer.store?.logo ||
                            'https://placehold.co/40x40/eee/ccc?text=Logo'
                          }
                          alt={offer.store?.name || 'Store'}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium text-gray-600">
                          {offer.store?.name || 'Unknown Store'}
                        </span>
                      </div>

                      <h3 className="font-semibold text-gray-900 text-base line-clamp-2 leading-tight mb-2">
                        {offer.title}
                      </h3>

                      <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                        {offer.description?.substring(0, 100) || ''}
                      </p>

                      {offer.originalPrice && offer.discountedPrice && (
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg font-bold text-gray-900">
                            ₹{offer.discountedPrice.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ₹{offer.originalPrice.toLocaleString()}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center text-xs text-orange-600 mb-3">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>
                          Valid till {new Date(offer.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto space-y-2">
                      {offer.couponCode ? (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            icon={Copy}
                            onClick={() => handleCopyCode(offer.couponCode!)}
                            className="flex-1 text-xs truncate"
                          >
                            {offer.couponCode}
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            icon={ExternalLink}
                            onClick={() => handleOfferClick(offer)}
                          >
                            {t('offers.shopNow')}
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          fullWidth
                          icon={ExternalLink}
                          onClick={() => handleOfferClick(offer)}
                        >
                          {t('offers.getOffer')}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {offersData?.total > filters.limit && (
          <Pagination
            currentPage={filters.page}
            totalPages={Math.ceil(offersData.total / filters.limit)}
            onPageChange={handlePageChange}
          />
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-600 to-red-600 text-white py-16 shadow-md">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-3">
            {t('offers.title')}
          </h1>
          <p className="text-orange-100 mb-8 text-lg">
            Discover exclusive deals, coupons, and cashback offers
          </p>
          <div className="max-w-xl mx-auto">
            <SearchBar placeholder="Search offers, stores, or brands..." onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Filters Bar */}
      <div className="sticky top-0 z-30 backdrop-blur-md bg-white/70 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="ghost"
              size="sm"
              icon={Filter}
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden"
            >
              Filters
            </Button>
            <p className="text-gray-600 text-sm hidden sm:block">
              Showing {offers.length} of {offersData?.total || 0} offers
            </p>
          </div>
          <div className="flex items-center gap-2">
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

        {/* Filter Dropdown (Mobile) */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white border-t border-gray-200 px-4 py-3 sm:hidden"
            >
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full mb-2 p-2 border rounded-lg"
              >
                <option value="">All Categories</option>
                {categories.map((c: Category) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={filters.offerType}
                onChange={(e) => handleFilterChange('offerType', e.target.value)}
                className="w-full mb-2 p-2 border rounded-lg"
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
                className="w-full mb-2 p-2 border rounded-lg"
              />

              <Button
                variant="ghost"
                size="sm"
                icon={X}
                onClick={handleClearFilters}
                fullWidth
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">{renderContent()}</div>
    </div>
  );
};
