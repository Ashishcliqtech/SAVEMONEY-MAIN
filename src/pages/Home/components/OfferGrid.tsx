import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Copy, ExternalLink } from 'lucide-react';
import { Card, Button, Badge } from '../../../components/ui';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useAuth } from '../../../hooks/useAuth';
import { offersApi } from '../../../api';

interface OfferGridProps {
  offers: any[];
}

export const OfferGrid: React.FC<OfferGridProps> = memo(({ offers }) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Coupon code copied!');
  };

  const handleOfferClick = async (offer: any) => {
    if (!isAuthenticated) {
      window.open(offer.url, '_blank', 'noopener,noreferrer');
      return;
    }

    try {
      const toastId = toast.loading('Redirecting to store...');
      const response = await offersApi.trackOfferClick(offer.id);
      const redirectUrl = response.redirectUrl || offer.url;
      toast.dismiss(toastId);
      window.open(redirectUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Failed to track offer click:', error);
      window.open(offer.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className="w-full bg-white py-10 md:py-14">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {offers.slice(0, 8).map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07, duration: 0.4 }}
            >
              <Card className="group overflow-hidden h-[420px] flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                {/* Image Section */}
                <div className="relative h-48 w-full overflow-hidden rounded-xl">
  <img
    src={offer.imageUrl}
    alt={offer.title}
    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 rounded-xl"
  />


                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
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
                  {offer.cashbackRate && (
                    <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md">
                      {offer.cashbackRate}% Cashback
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between flex-1 px-3 py-4 space-y-3">
                  {/* Store Info */}
                  <div className="flex items-center space-x-2">
                    <img
                      src={offer.store.logo}
                      alt={offer.store.name}
                      className="w-6 h-6 rounded-full object-cover border border-gray-200"
                    />
                    <span className="text-sm text-gray-600 font-medium">{offer.store.name}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-gray-900 line-clamp-2 leading-snug">
                    {offer.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 line-clamp-3 h-[56px]">
                    {offer.description?.length > 100
                      ? `${offer.description.substring(0, 100)}...`
                      : offer.description}
                  </p>

                  {/* Expiry */}
                  <div className="flex items-center text-xs text-orange-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Valid till {new Date(offer.expiryDate).toLocaleDateString()}</span>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto pt-2">
                    {offer.couponCode ? (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Copy}
                          onClick={() => handleCopyCode(offer.couponCode!)}
                          className="flex-1 text-sm"
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
        </div>
      </div>
    </section>
  );
});
