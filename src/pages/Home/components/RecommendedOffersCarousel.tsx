import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  discount?: string;
  originalPrice?: number;
  discountedPrice?: number;
}

export const RecommendedOffersCarousel: React.FC = () => {
  const { data: offers, isLoading, error } = useFeaturedOffers();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const nextSlide = useCallback(() => {
    if (offers && offers.length > 0) {
      setDirection('right');
      setCurrentIndex((prevIndex) => (prevIndex + 1) % offers.length);
    }
  }, [offers]);

  const prevSlide = useCallback(() => {
    if (offers && offers.length > 0) {
      setDirection('left');
      setCurrentIndex((prevIndex) => (prevIndex - 1 + offers.length) % offers.length);
    }
  }, [offers]);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentIndex ? 'right' : 'left');
    setCurrentIndex(index);
  }, [currentIndex]);

  const handleCopyCode = async (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  useEffect(() => {
    if (!isAutoPlaying || isHovered || !offers || offers.length === 0) return;

    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovered, nextSlide, offers]);

  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      const difference = touchStartX - touchEndX;

      if (Math.abs(difference) > 50) {
        if (difference > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    };

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
      carousel.addEventListener('touchend', handleTouchEnd, { passive: true });
      return () => {
        carousel.removeEventListener('touchstart', handleTouchStart);
        carousel.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [nextSlide, prevSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
      <div className="w-full h-[500px] md:h-[600px] lg:h-[700px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading Featured Offers..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[500px] md:h-[600px] lg:h-[700px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center text-red-400 px-4">
        <AlertTriangle className="w-12 h-12 md:w-16 md:h-16 mb-4" />
        <h3 className="text-xl md:text-2xl font-semibold text-center">Failed to Load Offers</h3>
        <p className="text-red-300 text-center mt-2">There was a problem fetching the featured offers. Please try again later.</p>
      </div>
    );
  }

  if (!offers || offers.length === 0) {
    return (
      <div className="w-full h-[500px] md:h-[600px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <p className="text-gray-400 text-lg">No featured offers available at the moment.</p>
      </div>
    );
  }

  return (
    <section
      ref={carouselRef}
      className="relative w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Featured offers carousel"
    >
      <div className="relative h-[500px] md:h-[600px] lg:h-[700px]">
        {offers.map((offer, index) => {
          const discount = calculateDiscount(offer);
          const isActive = index === currentIndex;
          const isPrev = index === (currentIndex - 1 + offers.length) % offers.length;
          const isNext = index === (currentIndex + 1) % offers.length;

          return (
            <div
              key={offer.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                isActive
                  ? 'opacity-100 scale-100 z-20'
                  : isPrev
                    ? 'opacity-0 -translate-x-full scale-95 z-10'
                    : isNext
                      ? 'opacity-0 translate-x-full scale-95 z-10'
                      : 'opacity-0 z-0'
              }`}
            >
              <div className="absolute inset-0">
                <img
                  src={offer.imageUrl}
                  alt={offer.title}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent md:from-black/80 md:via-black/50" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/30 to-blue-900/20" />
              </div>

              <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-center md:justify-end h-full py-12 md:py-16 lg:py-24">
                  <div className={`w-full md:w-4/5 lg:w-3/5 xl:w-1/2 space-y-3 sm:space-y-4 md:space-y-5 transition-all duration-700 ${
                    isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl bg-white/10 backdrop-blur-md p-2 flex items-center justify-center border border-white/20 shadow-xl">
                        <img
                          src={offer.store.logo}
                          alt={`${offer.store.name} logo`}
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </div>
                      <div>
                        <span className="text-white font-bold text-base sm:text-lg md:text-xl block">{offer.store.name}</span>
                        <span className="text-blue-300 text-xs sm:text-sm font-medium flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                          Verified Partner
                        </span>
                      </div>
                    </div>

                    {discount && (
                      <div className="inline-flex items-center animate-pulse">
                        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-full font-extrabold text-lg sm:text-xl md:text-2xl shadow-2xl border-2 border-white/20">
                          Save {discount}
                        </div>
                      </div>
                    )}

                    <h2 className="text-white font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight drop-shadow-2xl">
                        {offer.title}
                    </h2>

                    <p className="text-gray-200 text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl leading-relaxed drop-shadow-lg">
                      {offer.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      {offer.isTrending && (
                        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md border border-yellow-400/40 rounded-full text-yellow-300 text-xs sm:text-sm font-semibold shadow-lg">
                          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                          Trending Now
                        </div>
                      )}
                      {offer.expiryDate && (
                        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-red-500/20 backdrop-blur-md border border-red-400/40 rounded-full text-red-300 text-xs sm:text-sm font-semibold shadow-lg">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          Ends {new Date(offer.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2 sm:pt-4">
                      {offer.couponCode && (
                        <button
                          onClick={(e) => handleCopyCode(offer.couponCode!, e)}
                          className="group relative flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:to-red-600 text-white font-extrabold rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <Copy className={`w-4 h-4 sm:w-5 sm:h-5 relative z-10 transition-transform ${copiedCode === offer.couponCode ? 'rotate-12 scale-110' : 'group-hover:rotate-12'}`} />
                          <span className="text-sm sm:text-base md:text-lg relative z-10">
                            {copiedCode === offer.couponCode ? 'Copied!' : `Code: ${offer.couponCode}`}
                          </span>
                        </button>
                      )}
                      <a
                        href={offer.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="text-sm sm:text-base md:text-lg relative z-10">Shop Now</span>
                        <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        )}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full bg-white/10 backdrop-blur-lg hover:bg-white/25 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 active:scale-95 border border-white/30 z-30 shadow-2xl group"
        aria-label="Previous offer"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full bg-white/10 backdrop-blur-lg hover:bg-white/25 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 active:scale-95 border border-white/30 z-30 shadow-2xl group"
        aria-label="Next offer"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 group-hover:translate-x-0.5 transition-transform" />
      </button>

      <div className="absolute bottom-6 sm:bottom-8 lg:bottom-10 left-1/2 -translate-x-1/2 z-30">
        <div className="flex items-center gap-3 sm:gap-4 bg-black/30 backdrop-blur-lg rounded-full px-4 py-3 sm:px-6 sm:py-4 border border-white/20 shadow-2xl">
          <div className="flex justify-center gap-2">
            {offers.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-8 sm:w-10 h-2.5 sm:h-3 bg-white shadow-lg'
                    : 'w-2.5 sm:w-3 h-2.5 sm:h-3 bg-white/40 hover:bg-white/70 hover:scale-110'
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentIndex}
              />
            ))}
          </div>

          <div className="w-px h-6 bg-white/30" />

          <button
            onClick={toggleAutoPlay}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 active:scale-95 border border-white/30"
            aria-label={isAutoPlaying ? 'Pause autoplay' : 'Start autoplay'}
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5" />}
          </button>

          <span className="text-white/80 text-xs sm:text-sm font-medium hidden sm:block">
            {currentIndex + 1} / {offers.length}
          </span>
        </div>
      </div>

      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 z-30 bg-black/40 backdrop-blur-md text-white/90 text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/20 shadow-lg hidden md:block">
        Use ← → keys to navigate
      </div>

      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white/70 text-xs sm:text-sm text-center md:hidden bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
        Swipe to explore offers
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 sm:h-1.5 bg-gradient-to-r from-transparent via-white/10 to-transparent">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-700 ease-in-out shadow-lg"
          style={{ width: `${((currentIndex + 1) / offers.length) * 100}%` }}
        />
      </div>

      {copiedCode && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-xl shadow-2xl border-2 border-white/30 backdrop-blur-lg animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-2 sm:gap-3">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="font-bold text-sm sm:text-base">Code copied to clipboard!</span>
          </div>
        </div>
      )}
    </section>
  );
};