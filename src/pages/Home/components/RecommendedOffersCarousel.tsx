import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, Clock, Copy, ExternalLink, Star, Zap, Play, Pause } from 'lucide-react';
import { Card, Button, Badge } from '../../../components/ui';
import { useFeaturedOffers } from '../../../hooks/useSupabase';
import toast from 'react-hot-toast';

export const RecommendedOffersCarousel: React.FC = () => {
  const autoplay = Autoplay({ delay: 5000, stopOnInteraction: false });
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'center',
    containScroll: 'trimSnaps',
  }, [autoplay]);
  
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const { data: offers, isLoading } = useFeaturedOffers();

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const toggleAutoplay = useCallback(() => {
    if (!emblaApi) return;
    const autoplayPlugin = emblaApi.plugins().autoplay;
    if (!autoplayPlugin) return;

    if (autoplayPlugin.isPlaying()) {
      autoplayPlugin.stop();
      setIsPlaying(false);
    } else {
      autoplayPlugin.play();
      setIsPlaying(true);
    }
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    toast.success('Coupon code copied!');
  };

  const handleOfferClick = (offerId: string) => {
    console.log('Offer clicked:', offerId);
    // Track offer click
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="w-full h-96 bg-gray-200 rounded-2xl"></div>
      </div>
    );
  }

  if (!offers || offers.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">🔥 Hot Deals Just for You</h2>
            <p className="text-gray-600">Exclusive offers handpicked based on your preferences</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleAutoplay}
            className="w-10 h-10 rounded-full bg-white border-2 border-orange-200 flex items-center justify-center hover:bg-orange-50 transition-colors shadow-sm"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-orange-600" />
            ) : (
              <Play className="w-4 h-4 text-orange-600" />
            )}
          </button>
          <button
            onClick={scrollPrev}
            disabled={!prevBtnEnabled}
            className="w-12 h-12 rounded-full bg-white border-2 border-orange-200 flex items-center justify-center hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-orange-600" />
          </button>
          <button
            onClick={scrollNext}
            disabled={!nextBtnEnabled}
            className="w-12 h-12 rounded-full bg-white border-2 border-orange-200 flex items-center justify-center hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
          >
            <ChevronRight className="w-6 h-6 text-orange-600" />
          </button>
        </div>
      </div>

      {/* Full Width Carousel */}
      <div className="overflow-hidden rounded-2xl shadow-2xl" ref={emblaRef}>
        <div className="flex">
          {offers.map((offer, index) => (
            <div key={offer.id} className="flex-[0_0_100%] min-w-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative h-96 lg:h-[500px] cursor-pointer group"
                onClick={() => handleOfferClick(offer.id)}
              >
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                  <img
                    src={offer.imageUrl}
                    alt={offer.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative h-full flex items-center">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      {/* Left Content */}
                      <div className="text-white space-y-6">
                        {/* Store Info */}
                        <div className="flex items-center space-x-3">
                          <img
                            src={offer.store.logo}
                            alt={offer.store.name}
                            className="w-12 h-12 rounded-xl bg-white p-2 shadow-lg"
                          />
                          <div>
                            <div className="text-lg font-bold">{offer.store.name}</div>
                            <div className="text-orange-200 text-sm">Verified Partner</div>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2">
                          {offer.isExclusive && (
                            <Badge variant="danger" size="md" className="bg-red-500 text-white font-bold px-3 py-1">
                              🎯 EXCLUSIVE
                            </Badge>
                          )}
                          {offer.isTrending && (
                            <Badge variant="warning" size="md" className="bg-orange-500 text-white font-bold px-3 py-1">
                              🔥 TRENDING
                            </Badge>
                          )}
                          <Badge variant="success" size="md" className="bg-green-500 text-white font-bold px-3 py-1">
                            ⚡ LIMITED TIME
                          </Badge>
                        </div>

                        {/* Title */}
                        <h3 className="text-3xl lg:text-5xl font-bold leading-tight">
                          {offer.title}
                        </h3>

                        {/* Description */}
                        <p className="text-lg lg:text-xl text-gray-200 leading-relaxed max-w-lg">
                          {offer.description}
                        </p>

                        {/* Price & Cashback */}
                        <div className="space-y-3">
                          {offer.originalPrice && offer.discountedPrice && (
                            <div className="flex items-center space-x-4">
                              <span className="text-3xl lg:text-4xl font-bold text-white">
                                ₹{offer.discountedPrice.toLocaleString()}
                              </span>
                              <span className="text-lg text-gray-300 line-through">
                                ₹{offer.originalPrice.toLocaleString()}
                              </span>
                              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                {Math.round(((offer.originalPrice - offer.discountedPrice) / offer.originalPrice) * 100)}% OFF
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-4">
                            <div className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-lg">
                              🎁 {offer.cashbackRate}% CASHBACK
                            </div>
                            <div className="text-green-200 text-sm">
                              + Extra ₹{Math.round((offer.minOrderValue || 1000) * offer.cashbackRate / 100)} on min order
                            </div>
                          </div>
                        </div>

                        {/* Expiry */}
                        <div className="flex items-center text-orange-200">
                          <Clock className="w-5 h-5 mr-2" />
                          <span className="font-medium">
                            Ends {new Date(offer.expiryDate).toLocaleDateString('en-IN', { 
                              day: 'numeric', 
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                          {offer.couponCode ? (
                            <>
                              <Button
                                variant="secondary"
                                size="lg"
                                icon={Copy}
                                onClick={(e) => handleCopyCode(offer.couponCode!, e)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 text-lg border-4 border-yellow-300 shadow-xl"
                              >
                                COPY CODE: {offer.couponCode}
                              </Button>
                              <Button 
                                variant="primary" 
                                size="lg" 
                                icon={ExternalLink}
                                className="bg-orange-500 hover:bg-orange-600 font-bold px-8 py-4 text-lg shadow-xl"
                              >
                                SHOP NOW
                              </Button>
                            </>
                          ) : (
                            <Button 
                              variant="primary" 
                              size="lg" 
                              icon={ExternalLink}
                              className="bg-orange-500 hover:bg-orange-600 font-bold px-8 py-4 text-lg shadow-xl"
                            >
                              GET OFFER NOW
                            </Button>
                          )}
                        </div>

                        {/* Additional Info */}
                        <div className="text-sm text-gray-300 bg-black/30 backdrop-blur-sm p-4 rounded-xl">
                          <div className="flex items-center justify-between">
                            <span>Min Order: ₹{offer.minOrderValue?.toLocaleString() || 0}</span>
                            <span className="text-green-300 font-bold">Max Cashback: ₹{Math.round((offer.minOrderValue || 1000) * offer.cashbackRate / 100 * 10)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Content - Mobile App Preview */}
                      <div className="hidden lg:flex justify-center">
                        <div className="relative">
                          <div className="w-80 h-96 bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-800">
                            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white">
                              <div className="text-xs font-bold opacity-90">🔥 EXCLUSIVE DEAL</div>
                              <div className="text-lg font-bold">{offer.cashbackRate}% Cashback</div>
                              <div className="text-xs opacity-90">+ Extra Savings</div>
                            </div>
                            <div className="p-6">
                              <img
                                src={offer.imageUrl}
                                alt={offer.title}
                                className="w-full h-32 object-cover rounded-xl mb-4"
                              />
                              <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">
                                {offer.title}
                              </h4>
                              <div className="flex items-center justify-between">
                                <div className="text-green-600 font-bold">
                                  {offer.cashbackRate}% CB
                                </div>
                                <div className="text-orange-600 font-bold">
                                  {offer.couponCode || 'No Code Needed'}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Floating Elements */}
                          <motion.div
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute -top-4 -right-4 w-16 h-16 bg-orange-400 rounded-2xl flex items-center justify-center text-white font-bold shadow-xl"
                          >
                            <div className="text-center">
                              <div className="text-lg font-bold">{offer.cashbackRate}%</div>
                              <div className="text-xs">CB</div>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                  <motion.div
                    className="h-full bg-orange-500"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                    key={selectedIndex}
                  />
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {offers.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === selectedIndex 
                ? 'bg-orange-500 scale-125' 
                : 'bg-gray-300 hover:bg-orange-300'
            }`}
          />
        ))}
      </div>

      {/* Offer Counter */}
      <div className="text-center mt-4">
        <span className="text-sm text-gray-500">
          {selectedIndex + 1} of {offers.length} exclusive offers
        </span>
      </div>
    </div>
  );
};