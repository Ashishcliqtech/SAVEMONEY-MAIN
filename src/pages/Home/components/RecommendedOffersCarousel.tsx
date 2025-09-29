
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Copy, ExternalLink, ShieldCheck, TrendingUp, Clock, Play, Pause, AlertTriangle } from 'lucide-react';
import { useFeaturedOffers } from '../../../hooks/useApi';
import { LoadingSpinner } from '../../../components/ui';

interface Store {
  name: string;
  logo: string;
}

interface Offer {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  couponCode?: string;
  expiryDate?: string;
  isTrending?: boolean;
  store: Store;
  discount?: string; // This can be derived or passed directly
  originalPrice?: number;
  discountedPrice?: number;
}

interface RecommendedOffersCarouselProps {}

export const RecommendedOffersCarousel: React.FC<RecommendedOffersCarouselProps> = () => {
  const { data: offers, isLoading, error } = useFeaturedOffers();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    if (offers && offers.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % offers.length);
    }
  }, [offers]);

  const prevSlide = useCallback(() => {
    if (offers && offers.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + offers.length) % offers.length);
    }
  }, [offers]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const handleCopyCode = async (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300';
      toast.textContent = 'Coupon code copied!';
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  useEffect(() => {
    if (!isAutoPlaying || isHovered || !offers || offers.length === 0) return;
    
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovered, nextSlide, offers]);

  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => { touchStartX = e.changedTouches[0].screenX; };
    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      const difference = touchStartX - touchEndX;
      
      if (Math.abs(difference) > 50) {
        if (difference > 0) { nextSlide(); } else { prevSlide(); }
      }
    };

    const carousel = document.getElementById('offers-carousel');
    if (carousel) {
      carousel.addEventListener('touchstart', handleTouchStart);
      carousel.addEventListener('touchend', handleTouchEnd);
      return () => {
        carousel.removeEventListener('touchstart', handleTouchStart);
        carousel.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [nextSlide, prevSlide]);

  const calculateDiscount = (offer: Offer) => {
    if (offer.discount) return offer.discount;
    if (offer.originalPrice && offer.discountedPrice && offer.originalPrice > offer.discountedPrice) {
        const percentage = ((offer.originalPrice - offer.discountedPrice) / offer.originalPrice) * 100;
        return `${Math.round(percentage)}%`;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="w-full h-[650px] bg-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading Top Offers..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[650px] bg-slate-900 flex flex-col items-center justify-center text-red-400">
        <AlertTriangle className="w-12 h-12 mb-4" />
        <h3 className="text-xl font-semibold">Failed to Load Offers</h3>
        <p className="text-red-300">There was a problem fetching the featured offers. Please try again later.</p>
      </div>
    );
  }

  if (!offers || offers.length === 0) {
    return (
      <div className="w-full h-96 bg-slate-800 flex items-center justify-center">
        <p className="text-gray-400">No featured offers available at the moment.</p>
      </div>
    );
  }

  return (
    <section 
      id="offers-carousel"
      className="relative w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-[450px] sm:h-[500px] lg:h-[600px] xl:h-[650px]">
        {offers.map((offer, index) => {
          const discount = calculateDiscount(offer);
          return (
            <div
              key={offer.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
                index === currentIndex 
                  ? 'opacity-100 translate-x-0 z-10' 
                  : index < currentIndex 
                    ? 'opacity-0 -translate-x-full z-0' 
                    : 'opacity-0 translate-x-full z-0'
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={offer.imageUrl}
                  alt={offer.title}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20" />
              </div>

              {/* Content */}
              <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-center h-full py-8 lg:py-16">
                  <div className="w-full lg:w-3/5 xl:w-1/2 space-y-4 sm:space-y-6">
                    {/* Store Info */}
                    <div className="flex items-center gap-3 mb-2 sm:mb-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/10 backdrop-blur-sm p-2 flex items-center justify-center border border-white/20">
                        <img 
                          src={offer.store.logo} 
                          alt={`${offer.store.name} logo`} 
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </div>
                      <div>
                        <span className="text-white font-semibold text-lg sm:text-xl block">{offer.store.name}</span>
                        <span className="text-blue-300 text-sm font-medium">Verified Partner</span>
                      </div>
                    </div>

                    {/* Discount Badge */}
                    {discount && (
                      <div className="inline-flex items-center">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full font-bold text-xl sm:text-2xl shadow-lg">
                          Up to {discount} OFF
                        </div>
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="text-white font-bold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl leading-tight">
                      <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                        {offer.title}
                      </span>
                    </h2>

                    {/* Description */}
                    <p className="text-gray-200 text-base sm:text-lg lg:text-xl max-w-2xl leading-relaxed">
                      {offer.description}
                    </p>
                    
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-full text-emerald-300 text-sm font-medium">
                        <ShieldCheck className="w-4 h-4" />
                        Verified Deal
                      </div>
                      {offer.isTrending && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/30 rounded-full text-yellow-300 text-sm font-medium">
                          <TrendingUp className="w-4 h-4" />
                          Trending
                        </div>
                      )}
                    </div>

                    {/* Expiry Date */}
                    {offer.expiryDate && (
                      <div className="flex items-center text-orange-300 text-sm sm:text-base font-medium">
                        <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>Expires: {new Date(offer.expiryDate).toLocaleDateString()}</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 pt-2">
                      {offer.couponCode && (
                        <button
                          onClick={(e) => handleCopyCode(offer.couponCode!, e)}
                          className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg w-full sm:w-auto justify-center sm:justify-start"
                        >
                          <Copy className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                          <span className="text-sm sm:text-base">Copy Code: {offer.couponCode}</span>
                        </button>
                      )}
                      <a
                        href={offer.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg w-full sm:w-auto justify-center sm:justify-start"
                      >
                        <span className="text-sm sm:text-base">Shop Now</span>
                        <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        )}
      </div>

      {/* Navigation & Controls */}
      <button onClick={prevSlide} className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 border border-white/20 z-20 hidden sm:flex" aria-label="Previous offer"><ChevronLeft className="w-6 h-6 lg:w-7 lg:h-7" /></button>
      <button onClick={nextSlide} className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 border border-white/20 z-20 hidden sm:flex" aria-label="Next offer"><ChevronRight className="w-6 h-6 lg:w-7 lg:h-7" /></button>
      
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex justify-center gap-2">
            {offers.map((_, index) => (
              <button key={index} onClick={() => goToSlide(index)} className={`transition-all duration-300 rounded-full ${index === currentIndex ? 'w-8 h-3 bg-white shadow-lg' : 'w-3 h-3 bg-white/40 hover:bg-white/70'}`} aria-label={`Go to slide ${index + 1}`} />
            ))}
          </div>
          <button onClick={toggleAutoPlay} className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 flex items-center justify-center text-white transition-all duration-300 border border-white/20" aria-label={isAutoPlaying ? 'Pause autoplay' : 'Start autoplay'}>
            {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/60 text-xs text-center sm:hidden"><p>Swipe to navigate</p></div>
      
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300" style={{ width: `${((currentIndex + 1) / offers.length) * 100}%` }} />
      </div>
    </section>
  );
};
