import React from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRight, Star } from 'lucide-react';
import { Button } from '../Button';
import { useContentSections } from '../../../hooks/useContent';
import { ContentSection } from '../../../types';
import { Link } from 'react-router-dom';

interface BannerProps {
  onDismiss: () => void;
  isSidebarOpen: boolean;
  isMobile: boolean;
}

export const Banner: React.FC<BannerProps> = ({ onDismiss, isSidebarOpen, isMobile }) => {
  const { data: bannerData, isLoading } = useContentSections({
    page: 'homepage',
    status: 'published',
  });

  const bannerContent: ContentSection | undefined = bannerData?.find(
    (section) => section.contentType === 'banner'
  );

  const content = bannerContent?.content as {
    title?: string;
    badge?: string;
    description?: string;
    cta?: { text?: string; link?: string; subtext?: string };
    terms?: string;
  } | undefined;

  const bannerClassName = [
    'fixed top-0 right-0 z-50 text-white shadow-2xl overflow-hidden group',
    !isMobile && isSidebarOpen ? 'lg:left-64' : 'left-0',
    'transition-all duration-300 ease-in-out'
  ].join(' ');

  if (isLoading || !bannerContent || !content) {
    return null; 
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -150 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -150, transition: { duration: 0.4 } }}
      transition={{ type: 'spring', stiffness: 80, damping: 20 }}
      className={bannerClassName}
      style={{
        backgroundImage: `url(${bannerContent.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-all duration-500" />
      
      {/* Glassmorphic content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 py-8">

          <div className="flex-1 text-center lg:text-left">
            {content.badge && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold mb-4 border border-white/20"
              >
                <Star className="w-5 h-5 mr-2 text-yellow-300 drop-shadow-lg" />
                {content.badge}
              </motion.div>
            )}
            <h3 className="font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight !leading-tight drop-shadow-md">
              {content.title}
            </h3>
            {content.description && (
              <p className="text-base sm:text-lg text-gray-200 mt-3 max-w-3xl mx-auto lg:mx-0">
                {content.description}
              </p>
            )}
          </div>

          <div className="flex-shrink-0 flex flex-col items-center lg:items-end gap-3 mt-4 lg:mt-0">
            {content.cta && content.cta.text && (
              <Link to="/offers" onClick={onDismiss}>
                <Button
                  variant="solid"
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-200 font-bold transition-all duration-300 transform hover:scale-105 shadow-xl rounded-full px-8 py-4 w-full sm:w-auto"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  {content.cta.text}
                </Button>
              </Link>
            )}
            {content.cta?.subtext && <p className='text-xs text-gray-300 drop-shadow-sm'>{content.cta.subtext}</p>}
          </div>
        </div>
        {content.terms && <p className='text-xs text-gray-400 pb-4 text-center lg:text-left drop-shadow-sm'>{content.terms}</p>}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onDismiss}
        className="absolute top-4 right-4 z-20 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="h-6 w-6" />
      </Button>
    </motion.div>
  );
};
