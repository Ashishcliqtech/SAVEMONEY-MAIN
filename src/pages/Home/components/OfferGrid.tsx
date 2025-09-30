import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Copy, ExternalLink } from 'lucide-react';
import { Card, Button, Badge } from '../../../components/ui';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useAuth } from '../../../hooks/useAuth'; // Import useAuth
import { offersApi } from '../../../api'; // Import offersApi

interface OfferGridProps {
  offers: any[];
}

export const OfferGrid: React.FC<OfferGridProps> = memo(({ offers }) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth(); // Get authentication status

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Coupon code copied!');
  };

  // New function to handle tracking and redirecting
  const handleOfferClick = async (offer: any) => {
    // If the user is not logged in, just redirect them to the store
    if (!isAuthenticated) {
      window.open(offer.url, '_blank', 'noopener,noreferrer');
      return;
    }

    try {
      // Show a loading toast for better UX
      const toastId = toast.loading('Redirecting to store...');
      
      // Call the backend to track the click
      const response = await offersApi.trackOfferClick(offer.id);
      
      // Use the redirect URL from the backend if available, otherwise fallback to the offer's URL
      const redirectUrl = response.redirectUrl || offer.url;
      
      toast.dismiss(toastId);
      window.open(redirectUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error("Failed to track offer click:", error);
      // Fallback: redirect the user anyway so the flow isn't broken
      window.open(offer.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {offers.map((offer, index) => (
        <motion.div
          key={offer.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="h-full"
        >
          <Card className="group overflow-hidden h-full flex flex-col min-h-[420px]" hover padding="sm">
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
                <span className="text-sm font-medium text-gray-600">{offer.store.name}</span>
              </div>

              {/* Title & Description */}
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-base leading-tight">
                {offer.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-3 h-16">
                {offer.description.length > 100 ? `${offer.description.substring(0, 100)}...` : offer.description}
              </p>

              {/* Price Info */}
              {offer.originalPrice && offer.discountedPrice && (
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-lg font-bold text-gray-900">
                    ₹{offer.discountedPrice.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ₹{offer.originalPrice.toLocaleString()}
                  </span>
                </div>
              )}

              {/* Expiry */}
              <div className="flex items-center text-sm text-orange-600 mb-3">
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
                      className="flex-1 min-w-0"
                    >
                      {offer.couponCode}
                    </Button>
                    {/* UPDATED onClick HANDLER */}
                    <Button variant="primary" size="sm" icon={ExternalLink} onClick={() => handleOfferClick(offer)}>
                      {t('offers.shopNow')}
                    </Button>
                  </div>
                ) : (
                  // UPDATED onClick HANDLER
                  <Button variant="primary" size="sm" fullWidth icon={ExternalLink} onClick={() => handleOfferClick(offer)}>
                    {t('offers.getOffer')}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
});