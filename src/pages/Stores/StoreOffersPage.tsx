import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Clock, Copy, ExternalLink, Grid2x2 as Grid, List } from 'lucide-react';
import {
  Card,
  Button,
  Badge,
  Pagination,
  ErrorState,
  EmptyState,
} from '../../components/ui';
import { useOffers } from '../../hooks/useApi';
import toast from 'react-hot-toast';
import { Offer } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { offersApi } from '../../api';
import { useParams } from 'react-router-dom';
import StoreOffersPageSkeleton from './StoreOffersPageSkeleton';

const INITIAL_FILTERS = {
  search: '',
  sortBy: 'popularity' as 'cashback' | 'expiry' | 'popularity',
  sortOrder: 'desc' as 'asc' | 'desc',
  page: 1,
  limit: 12,
};

export const StoreOffersPage: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { id: storeId } = useParams<{ id: string }>();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const { data: offersData, isLoading, error } = useOffers({ ...filters, store: storeId });

  const offers = offersData?.offers || [];
  const storeName = offers.length > 0 ? offers[0].store.name : 'Store';

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

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
    } catch (err) {
      toast.dismiss(toastId);
      toast.error('Could not track click, redirecting anyway.');
      console.error("Failed to track offer click:", err);
      window.open(offerUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const renderContent = () => {
    if (isLoading) {
        return <StoreOffersPageSkeleton viewMode={viewMode} />
    }

    if (error) {
      return <ErrorState title="Failed to Load Offers" message="We couldn't fetch the offers right now. Please try again later." />;
    }

    if (!offers || offers.length === 0) {
      return <EmptyState title="No Offers Found" message="There are no offers available for this store at the moment." />;
    }

    return (
      <>
        <div className={`mb-8 ${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
          }`}>
            {offers.map((offer: Offer, index: number) => (
              <motion.div
                key={offer._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="h-full"
              >
                {viewMode === 'grid' ? (
                    <Card className="group overflow-hidden h-full flex flex-col min-h-[480px]" hover padding="sm">
                        <div className="relative mb-4">
                            <img
                                src={offer.imageUrl}
                                alt={offer.title}
                                className="w-full h-48 object-cover rounded-lg"
                            />
                            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                                {offer.isExclusive && (
                                    <Badge variant="danger" size="sm">Exclusive</Badge>
                                )}
                                {offer.isTrending && (
                                    <Badge variant="warning" size="sm">🔥 Trending</Badge>
                                )}
                            </div>
                            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                                {offer.cashbackRate}% back
                            </div>
                        </div>

                        <div className="space-y-3 flex-1 flex flex-col">
                           <div className="flex items-center space-x-2 mb-2">
                                <img
                                    src={offer.store?.logo || 'https://placehold.co/40x40/eee/ccc?text=Logo'}
                                    alt={offer.store?.name || 'Store'}
                                    className="w-6 h-6 rounded-full object-cover"
                                />
                                <span className="text-sm font-medium text-gray-600">
                                    {offer.store?.name || 'Unknown Store'}
                                </span>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-base leading-tight">
                                    {offer.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-3 h-16">
                                    {offer.description.length > 100 ? `${offer.description.substring(0, 100)}...` : offer.description}
                                </p>
                            </div>

                            {offer.originalPrice && offer.discountedPrice && (
                                <div className="flex items-center space-x-2">
                                    <span className="text-lg font-bold text-gray-900">₹{offer.discountedPrice.toLocaleString()}</span>
                                    <span className="text-sm text-gray-500 line-through">₹{offer.originalPrice.toLocaleString()}</span>
                                </div>
                            )}

                            <div className="flex items-center text-sm text-orange-600 mb-4">
                                <Clock className="w-4 h-4 mr-1" />
                                <span>Valid till {new Date(offer.expiryDate).toLocaleDateString()}</span>
                            </div>

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
                                        <Button variant="primary" size="sm" icon={ExternalLink} onClick={() => handleOfferClick(offer)}>
                                            {t('offers.shopNow')}
                                        </Button>
                                    </div>
                                ) : (
                                    <Button variant="primary" size="sm" fullWidth icon={ExternalLink} onClick={() => handleOfferClick(offer)}>
                                        {t('offers.getOffer')}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Card>
                ) : (
                    <Card className="group cursor-pointer w-full" hover>
                        <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0">
                            <div className="flex-shrink-0 w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center p-2">
                                <img
                                    src={offer.imageUrl}
                                    alt={offer.title}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                            <div className="flex-1 min-w-0 text-center sm:text-left">
                                <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2">
                                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                                        {offer.title}
                                    </h3>
                                    {offer.isExclusive && <Badge variant="danger">Exclusive</Badge>}
                                </div>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                                    {offer.description}
                                </p>
                                 <div className="flex items-center justify-center sm:justify-start text-sm text-orange-600 mb-4">
                                    <Clock className="w-4 h-4 mr-1" />
                                    <span>Valid till {new Date(offer.expiryDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="flex-shrink-0 flex flex-col items-center justify-center space-y-3 w-full sm:w-48">
                                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-base font-bold">
                                    {offer.cashbackRate}% Cashback
                                </div>
                                {offer.couponCode ? (
                                    <div className="flex flex-col gap-2 w-full">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            icon={Copy}
                                            onClick={() => handleCopyCode(offer.couponCode!)}
                                        >
                                            {offer.couponCode}
                                        </Button>
                                        <Button variant="primary" size="sm" icon={ExternalLink} onClick={() => handleOfferClick(offer)}>
                                            {t('offers.shopNow')}
                                        </Button>
                                    </div>
                                ) : (
                                    <Button variant="primary" size="md" fullWidth icon={ExternalLink} onClick={() => handleOfferClick(offer)}>
                                        {t('offers.getOffer')}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Card>
                )}
              </motion.div>
            ))}
        </div>
        {offersData && offersData.total > filters.limit && (
          <div className="flex justify-center">
              <Pagination
                currentPage={filters.page}
                totalPages={Math.ceil(offersData.total / filters.limit)}
                onPageChange={handlePageChange}
              />
          </div>
        )}
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <section className="bg-gradient-to-br from-orange-500 to-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Offers for {storeName}
            </h1>
            <p className="text-xl text-orange-100 mb-8">
              Discover the best deals, coupons, and cashback offers
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          {!isLoading && offersData ? (
             <p className="text-gray-600">
                Showing <span className="font-semibold">{offers.length}</span> of <span className="font-semibold">{offersData.total}</span> offers
            </p>
          ) : <div />}
          
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
        
        {renderContent()}

      </div>
    </div>
  );
};
