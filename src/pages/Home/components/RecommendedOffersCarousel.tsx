import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, Clock, Copy, ExternalLink, Star, Zap, Play, Pause, Sparkles, Shield,TrendingUp,Gift } from 'lucide-react';

import { Button, Badge } from '../../../components/ui';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { useFeaturedOffers } from '../../../hooks/useSupabase';
import toast from 'react-hot-toast';
import { placeholderOffers } from '../../../data/placeholderData';

interface RecommendedOffersCarouselProps {
  offers?: any[];
}

export const RecommendedOffersCarousel: React.FC<RecommendedOffersCarouselProps> = ({ 
  offers: propOffers 
}) => {
  const autoplay = Autoplay({ delay: 6000, stopOnInteraction: false });
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'center',
    containScroll: 'trimSnaps',
    dragFree: false,
    skipSnaps: false,
  }, [autoplay]);
  
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const { data: apiOffers, isLoading, error } = useFeaturedOffers();
  
  // Use prop offers, API offers, or fallback to placeholder data
  const offers = propOffers || 
    (error || !apiOffers || apiOffers.length === 0 ? placeholderOffers : apiOffers);

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
    toast.success('🎉 Coupon code copied!', {
      style: {
        background: '#10B981',
        color: 'white',
        fontWeight: 'bold',
      },
    });
  };

  const handleOfferClick = (offerId: string) => {
    console.log('Offer clicked:', offerId);
    // Track offer click analytics
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16 md:py-24">
        <LoadingSpinner 
          size="xl" 
          text="Loading exclusive offers..." 
          color="text-orange-500" 
        />
      </div>
    );
  }

  return (
    <div className="relative w-full bg-gradient-to-br from-orange-50 via-white to-red-50 py-8 md:py-12 lg:py-16">
      {/* Floating Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            y: [-20, 20, -20],
            x: [-10, 10, -10]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 left-10 w-32 h-32 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 rounded-full blur-2xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 md:mb-12 space-y-4 lg:space-y-0">
          <div className="flex items-start space-x-4">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-2xl">
                <Zap className="w-7 h-7 md:w-8 md:h-8 text-white drop-shadow-sm" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
              >
                <Sparkles className="w-3 h-3 text-white" />
              </motion.div>
            </motion.div>
            
            <div className="flex-1">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent leading-tight"
              >
                🔥 Exclusive Deals Just for You
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 md:text-lg mt-1 md:mt-2 font-medium"
              >
                Handpicked premium offers with maximum cashback rewards
              </motion.p>
              
              {/* Stats Row */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-4 md:space-x-6 mt-3 md:mt-4"
              >
                <div className="flex items-center space-x-1 text-sm md:text-base">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-green-600 font-semibold">Verified</span>
                </div>
                <div className="flex items-center space-x-1 text-sm md:text-base">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span className="text-blue-600 font-semibold">Trending</span>
                </div>
                <div className="flex items-center space-x-1 text-sm md:text-base">
                  <Gift className="w-4 h-4 text-purple-500" />
                  <span className="text-purple-600 font-semibold">Limited Time</span>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Enhanced Controls */}
          <div className="flex items-center justify-center lg:justify-end space-x-2 md:space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleAutoplay}
              className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm border border-orange-200/50 flex items-center justify-center hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-orange-600" />
              ) : (
                <Play className="w-5 h-5 text-orange-600" />
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollPrev}
              disabled={!prevBtnEnabled}
              className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/90 backdrop-blur-sm border border-orange-200/50 flex items-center justify-center hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-orange-600" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollNext}
              disabled={!nextBtnEnabled}
              className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/90 backdrop-blur-sm border border-orange-200/50 flex items-center justify-center hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-orange-600" />
            </motion.button>
          </div>
        </div>

        {/* Enhanced Carousel */}
        <div 
          className="overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-r from-gray-900 to-gray-800" 
          ref={emblaRef}
          onTouchStart={handleTouchStart}
        >
          <div className="flex">
            {offers.map((offer, index) => (
              <div key={offer.id} className="flex-[0_0_100%] min-w-0">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative h-[500px] md:h-[600px] lg:h-[700px] cursor-pointer group overflow-hidden"
                  onClick={() => handleOfferClick(offer.id)}
                >
                  {/* Dynamic Background with Multiple Layers */}
                  <div className="absolute inset-0">
                    <img
                      src={offer.imageUrl}
                      alt={offer.title}
                      className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                      loading="lazy"
                    />
                    
                    {/* Multi-layer Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-transparent to-red-900/20" />
                  </div>

                  {/* Main Content */}
                  <div className="relative h-full flex items-center">
                    <div className="w-full px-4 sm:px-6 lg:px-8">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center max-w-7xl mx-auto">
                        
                        {/* Left Content - More Responsive */}
                        <div className="lg:col-span-7 text-white space-y-4 md:space-y-6 lg:space-y-8">
                          
                          {/* Store Info - Enhanced */}
                          <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center space-x-3 md:space-x-4"
                          >
                            <div className="relative">
                              <img
                                src={offer.store.logo}
                                alt={offer.store.name}
                                className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white p-2 md:p-3 shadow-2xl"
                              />
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <Shield className="w-3 h-3 text-white" />
                              </div>
                            </div>
                            <div>
                              <div className="text-lg md:text-xl lg:text-2xl font-bold">
                                {offer.store.name}
                              </div>
                              <div className="text-orange-200 text-sm md:text-base flex items-center space-x-2">
                                <Star className="w-4 h-4 fill-current" />
                                <span>Verified Partner</span>
                              </div>
                            </div>
                          </motion.div>

                          {/* Enhanced Badges */}
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap gap-2 md:gap-3"
                          >
                            {offer.isExclusive && (
                              <Badge 
                                variant="danger" 
                                size="md" 
                                className="bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold px-3 py-2 md:px-4 md:py-2 shadow-lg animate-pulse"
                              >
                                🎯 EXCLUSIVE
                              </Badge>
                            )}
                            {offer.isTrending && (
                              <Badge 
                                variant="warning" 
                                size="md" 
                                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold px-3 py-2 md:px-4 md:py-2 shadow-lg"
                              >
                                🔥 TRENDING
                              </Badge>
                            )}
                            <Badge 
                              variant="success" 
                              size="md" 
                              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold px-3 py-2 md:px-4 md:py-2 shadow-lg"
                            >
                              ⚡ LIMITED TIME
                            </Badge>
                          </motion.div>

                          {/* Enhanced Title */}
                          <motion.h3 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-bold leading-tight bg-gradient-to-r from-white via-orange-100 to-white bg-clip-text text-transparent"
                          >
                            {offer.title}
                          </motion.h3>

                          {/* Enhanced Description */}
                          <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-base md:text-lg lg:text-xl text-gray-200 leading-relaxed max-w-2xl"
                          >
                            {offer.description}
                          </motion.p>

                          {/* Enhanced Price & Cashback */}
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="space-y-3 md:space-y-4"
                          >
                            {offer.originalPrice && offer.discountedPrice && (
                              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                                <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                                  ₹{offer.discountedPrice.toLocaleString()}
                                </span>
                                <div className="flex items-center space-x-3">
                                  <span className="text-lg md:text-xl text-gray-300 line-through">
                                    ₹{offer.originalPrice.toLocaleString()}
                                  </span>
                                  <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-sm md:text-base font-bold shadow-lg">
                                    {Math.round(((offer.originalPrice - offer.discountedPrice) / offer.originalPrice) * 100)}% OFF
                                  </span>
                                </div>
                              </div>
                            )}
                            
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl font-bold text-lg md:text-xl shadow-2xl border-2 border-green-400/50">
                                🎁 {offer.cashbackRate}% CASHBACK
                              </div>
                              <div className="text-green-200 text-sm md:text-base">
                                + Extra ₹{Math.round((offer.minOrderValue || 1000) * offer.cashbackRate / 100)} rewards
                              </div>
                            </div>
                          </motion.div>

                          {/* Enhanced Expiry */}
                          <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 }}
                            className="flex items-center text-orange-200 bg-black/20 backdrop-blur-sm px-4 py-3 rounded-xl border border-orange-400/30"
                          >
                            <Clock className="w-5 h-5 mr-3 animate-pulse" />
                            <span className="font-medium text-base">
                              Offer ends {new Date(offer.expiryDate).toLocaleDateString('en-IN', { 
                                day: 'numeric', 
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                          </motion.div>

                          {/* Enhanced Action Buttons */}
                          <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="flex flex-col sm:flex-row gap-3 md:gap-4"
                          >
                            {offer.couponCode ? (
                              <>
                                <Button
                                  variant="secondary"
                                  size="lg"
                                  icon={Copy}
                                  onClick={(e) => handleCopyCode(offer.couponCode!, e)}
                                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold px-6 py-4 md:px-8 md:py-5 text-base md:text-lg border-4 border-yellow-300/50 shadow-2xl transform hover:scale-105 transition-all duration-300"
                                >
                                  COPY: {offer.couponCode}
                                </Button>
                                <Button 
                                  variant="primary" 
                                  size="lg" 
                                  icon={ExternalLink}
                                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 font-bold px-6 py-4 md:px-8 md:py-5 text-base md:text-lg shadow-2xl transform hover:scale-105 transition-all duration-300"
                                >
                                  SHOP NOW
                                </Button>
                              </>
                            ) : (
                              <Button 
                                variant="primary" 
                                size="lg" 
                                icon={ExternalLink}
                                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 font-bold px-6 py-4 md:px-8 md:py-5 text-base md:text-lg shadow-2xl transform hover:scale-105 transition-all duration-300"
                              >
                                GET OFFER NOW
                              </Button>
                            )}
                          </motion.div>

                          {/* Enhanced Info Card */}
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                            className="text-sm md:text-base text-gray-200 bg-gradient-to-r from-black/40 to-black/20 backdrop-blur-sm p-4 md:p-6 rounded-xl md:rounded-2xl border border-white/10"
                          >
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="block text-gray-400 text-xs md:text-sm">Minimum Order</span>
                                <span className="font-bold text-lg">₹{offer.minOrderValue?.toLocaleString() || 0}</span>
                              </div>
                              <div className="text-right">
                                <span className="block text-gray-400 text-xs md:text-sm">Max Cashback</span>
                                <span className="text-green-300 font-bold text-lg">₹{Math.round((offer.minOrderValue || 1000) * offer.cashbackRate / 100 * 10)}</span>
                              </div>
                            </div>
                          </motion.div>
                        </div>

                        {/* Right Content - Phone Mockup - Enhanced Responsive */}
                        <div className="hidden lg:flex lg:col-span-5 justify-center">
                          <motion.div 
                            initial={{ opacity: 0, x: 50, rotateY: -15 }}
                            animate={{ opacity: 1, x: 0, rotateY: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="relative"
                            style={{ perspective: '1000px' }}
                          >
                            {/* Phone Container */}
                            <div className="relative transform hover:scale-105 transition-transform duration-500">
                              <div className="w-72 h-[500px] xl:w-80 xl:h-[550px] bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-[3rem] shadow-2xl overflow-hidden border-8 border-gray-700 relative">
                                
                                {/* Screen Content */}
                                <div className="relative h-full bg-white overflow-hidden rounded-[2rem]">
                                  {/* Status Bar */}
                                  <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 text-white relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
                                    <div className="relative z-10">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold opacity-90">🔥 HOT DEAL</span>
                                        <span className="text-xs">9:41 AM</span>
                                      </div>
                                      <div className="flex items-center space-x-2 mt-2">
                                        <div className="text-2xl font-bold">{offer.cashbackRate}%</div>
                                        <div className="flex-1">
                                          <div className="text-sm font-bold">Cashback</div>
                                          <div className="text-xs opacity-90">+ Extra Rewards</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* App Content */}
                                  <div className="p-6 space-y-4">
                                    <div className="relative overflow-hidden rounded-2xl">
                                      <img
                                        src={offer.imageUrl}
                                        alt={offer.title}
                                        className="w-full h-40 object-cover"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                      <div className="absolute bottom-3 left-3 right-3">
                                        <Badge className="bg-red-500 text-white text-xs font-bold px-2 py-1">
                                          LIMITED TIME
                                        </Badge>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                      <h4 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2">
                                        {offer.title}
                                      </h4>
                                      
                                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                        <div className="text-center">
                                          <div className="text-green-600 font-bold text-lg">
                                            {offer.cashbackRate}%
                                          </div>
                                          <div className="text-xs text-gray-500">Cashback</div>
                                        </div>
                                        
                                        <div className="text-center">
                                          <div className="text-orange-600 font-bold text-lg">
                                            {Math.round(((offer.originalPrice - offer.discountedPrice) / offer.originalPrice) * 100)}%
                                          </div>
                                          <div className="text-xs text-gray-500">Discount</div>
                                        </div>
                                        
                                        <div className="text-center">
                                          <div className="text-purple-600 font-bold text-lg">
                                            ₹{Math.round((offer.minOrderValue || 1000) * offer.cashbackRate / 100)}
                                          </div>
                                          <div className="text-xs text-gray-500">Extra</div>
                                        </div>
                                      </div>
                                      
                                      <Button 
                                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-xl shadow-lg"
                                        size="sm"
                                      >
                                        {offer.couponCode ? `Use Code: ${offer.couponCode}` : 'Get Deal Now'}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Floating Cashback Badge */}
                              <motion.div
                                animate={{ 
                                  y: [-10, 10, -10],
                                  rotate: [-5, 5, -5]
                                }}
                                transition={{ 
                                  duration: 4, 
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                                className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 rounded-3xl flex flex-col items-center justify-center text-white font-bold shadow-2xl border-4 border-white"
                              >
                                <div className="text-lg font-black">{offer.cashbackRate}%</div>
                                <div className="text-xs font-bold">BACK</div>
                              </motion.div>
                              
                              {/* Sparkle Effects */}
                              <motion.div
                                animate={{ 
                                  scale: [1, 1.2, 1],
                                  rotate: [0, 180, 360]
                                }}
                                transition={{ 
                                  duration: 3, 
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                                className="absolute -bottom-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
                              >
                                <Sparkles className="w-4 h-4 text-white" />
                              </motion.div>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/30 backdrop-blur-sm">
                    <motion.div
                      className="h-full bg-gradient-to-r from-orange-400 via-red-500 to-pink-600 shadow-lg"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 6, ease: 'linear' }}
                      key={selectedIndex}
                    />
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Navigation Dots */}
        <div className="flex justify-center mt-8 md:mt-10 space-x-3">
          {offers.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`transition-all duration-300 ${
                index === selectedIndex 
                  ? 'w-8 h-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg' 
                  : 'w-4 h-4 bg-gray-300 rounded-full hover:bg-orange-300 shadow-md'
              }`}
            />
          ))}
        </div>

        {/* Enhanced Counter & Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center mt-6 md:mt-8 space-y-4"
        >
          <div className="text-sm md:text-base text-gray-600 font-medium">
            <span className="text-orange-600 font-bold text-lg">{selectedIndex + 1}</span>
            <span className="mx-2">of</span>
            <span className="text-orange-600 font-bold text-lg">{offers.length}</span>
            <span className="ml-2">exclusive premium offers</span>
          </div>
          
          <div className="flex justify-center items-center space-x-6 md:space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-gray-600">Live Offers</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="text-gray-600">Verified Partners</span>
            </div>
            <div className="flex items-center space-x-2">
              <Gift className="w-4 h-4 text-purple-500" />
              <span className="text-gray-600">Maximum Cashback</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};