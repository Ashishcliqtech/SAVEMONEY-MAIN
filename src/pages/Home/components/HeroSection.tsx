import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, Percent } from 'lucide-react';
import { Button } from '../../../components/ui';
import { useContentSections } from '../../../hooks/useContent';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants';
import { ContentSection } from '../../../types';

const HeroSectionSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    <div className="space-y-6">
      <div className="w-48 h-8 bg-white/30 rounded-full animate-pulse" />
      <div className="w-full h-12 bg-white/30 rounded animate-pulse" />
      <div className="w-full h-12 bg-white/30 rounded animate-pulse" />
      <div className="w-4/5 h-8 bg-white/30 rounded animate-pulse" />
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <div className="w-48 h-14 bg-white/30 rounded-lg animate-pulse" />
        <div className="w-36 h-14 bg-white/20 rounded-lg animate-pulse" />
      </div>
    </div>
    <div className="w-full h-96 bg-white/20 rounded-3xl animate-pulse" />
  </div>
);

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const { data: heroData, isLoading } = useContentSections({
    page: 'homepage',
    status: 'published',
  });

  const heroContent: ContentSection | undefined = heroData?.find((section) => section.contentType === 'hero');

  // Safely access nested content
  const content = typeof heroContent?.content === 'object' && heroContent.content !== null 
                  ? heroContent.content 
                  : {};

  return (
    <section className="relative bg-gradient-to-br from-[#6A11CB] via-[#8E2DE2] to-[#2575FC] text-white overflow-hidden">
      {/* Subtle background effects */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-teal-400/20 rounded-full blur-3xl animate-pulse delay-300" />
        <div className="absolute top-1/3 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 flex flex-col justify-center min-h-[600px]">
        {isLoading ? (
          <HeroSectionSkeleton />
        ) : heroContent ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center lg:text-left"
            >
              {content.badge && (
                <div className="inline-flex items-center mb-6 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold text-white/90">
                  <Percent className="w-4 h-4 mr-2" />
                  {content.badge}
                </div>
              )}

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight mb-6 drop-shadow-lg">
                {content.title || heroContent.title}
              </h1>

              {content.subtitle && (
                <p className="text-lg sm:text-xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  {content.subtitle}
                </p>
              )}

              {content.cta && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link to={ROUTES.OFFERS}>
                    <Button
                      variant="secondary"
                      size="lg"
                      icon={ArrowRight}
                      iconPosition="right"
                      className="bg-black text-purple-700 hover:bg-purple-100 font-bold px-8 py-6 rounded-full shadow-lg transition-all duration-300"
                    >
                      {content.cta.text}
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>

            {/* Right Side (Hero Image) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative flex justify-center lg:justify-end"
            >
              {heroContent.imageUrl ? (
                <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-2xl aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={heroContent.imageUrl}
                    alt={content.title || heroContent.title}
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
              ) : (
                <div className="w-full h-80 bg-white/20 rounded-3xl animate-pulse" />
              )}
            </motion.div>
          </div>
        ) : null}
      </div>
    </section>
  );
};
