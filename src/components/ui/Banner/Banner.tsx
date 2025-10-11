import React from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRight, Star } from 'lucide-react';
import { Button } from '../Button';
import { ContentSection } from '../../../types';
import { Link } from 'react-router-dom';
import { Badge } from '../Badge';

interface BannerProps {
  bannerData: ContentSection;
  onDismiss: () => void;
  isSidebarOpen: boolean;
  isMobile: boolean;
}

export const Banner: React.FC<BannerProps> = ({ bannerData, onDismiss, isSidebarOpen, isMobile }) => {
  const content = typeof bannerData.content === 'object' && bannerData.content !== null
    ? bannerData.content
    : {};

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDismiss();
  };

  const imageUrl = bannerData.imageUrl || content.image || '/assets/saving.png';

  const bannerClassName = [
    'fixed top-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-purple-900 to-indigo-900 text-white shadow-2xl overflow-hidden group',
    !isMobile && isSidebarOpen ? 'lg:left-64' : 'left-0',
    'transition-all duration-300 ease-in-out' // Added transition for smooth movement
  ].join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: -200 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -200, transition: { duration: 0.3 } }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, mass: 1 }}
      className={bannerClassName}
    >
      {/* Layered background for a premium feel */}
      <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
        {imageUrl && <img src={imageUrl} alt="Promotional background" className="w-full h-full object-cover object-center" />}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-purple-900/70 to-indigo-900/80"></div>

      <div className="relative px-6 sm:px-8 lg:px-12 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Main content section */}
          <div className="flex-1 text-center md:text-left z-10">
            {content.badge && (
              <Badge variant="solid" color="white" className="mb-4 text-sm font-bold bg-white/10 border border-white/20">
                <Star className="w-4 h-4 mr-1.5 inline-block text-yellow-300" />
                {content.badge}
              </Badge>
            )}
            {/* Enhanced typography for better impact and readability */}
            <h3 className="font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tighter !leading-tight">
              {content.title || bannerData.title}
            </h3>
            {content.subtitle && (
              <p className="text-base sm:text-lg text-indigo-200 mt-2 max-w-2xl mx-auto md:mx-0">
                {content.subtitle}
              </p>
            )}
          </div>

          {/* CTA Button */}
          <div className="flex-shrink-0 z-10 mt-4 md:mt-0">
            {content.cta && content.cta.text && content.cta.link && (
              <Link to={content.cta.link}>
                <Button
                  variant="outline"
                  size="lg" // Kept size="lg" but increased padding for a larger feel
                  // Premium glassmorphism button style with enhanced hover effects.
                  className="bg-white/10 hover:bg-white/20 border-2 border-white/30 text-white font-bold transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm rounded-full px-8 py-3"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  {content.cta.text}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stylized dismiss button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDismiss}
        className="absolute top-3 right-3 z-20 text-indigo-200/70 hover:text-white hover:bg-white/10 rounded-full"
        aria-label="Dismiss banner"
      >
        <X className="h-6 w-6" />
      </Button>
    </motion.div>
  );
};
