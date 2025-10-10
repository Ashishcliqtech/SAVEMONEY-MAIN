import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, Percent } from 'lucide-react';
import { Button } from '../../../components/ui';
import { useContentSections } from '../../../hooks/useContent';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants';

const HeroSectionSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    {/* Left side skeleton */}
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
    {/* Right side skeleton */}
    <div className="w-full h-96 bg-white/20 rounded-3xl animate-pulse" />
  </div>
);

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const { data: heroData, isLoading, error } = useContentSections({ page: 'homepage', status: 'published' });

  // Find the specific hero section from the array
  const heroContent = heroData?.find((section) => section.contentType === 'hero');

  return (
    <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-teal-600 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-teal-400/20 rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-[500px]">
        {isLoading ? (
          <HeroSectionSkeleton />
        ) : heroContent ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {heroContent.content && (
                <>
                  <div className="mb-6">
                    <span className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                      <Percent className="w-4 h-4 mr-2" />
                      {heroContent.content.badge}
                    </span>
                  </div>
                  <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                    {heroContent.content.title}
                  </h1>
                  <p className="text-xl text-purple-100 mb-8 leading-relaxed">
                    {heroContent.content.subtitle}
                  </p>
                  {heroContent.content.cta && (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link to={ROUTES.OFFERS}>
                        <Button
                          variant="secondary"
                          size="lg"
                          icon={ArrowRight}
                          iconPosition="right"
                          className="bg-black text-purple-600 hover:bg-gray-100 font-bold px-8"
                        >
                          {heroContent.content.cta.text}
                        </Button>
                      </Link>
                    </div>
                  )}
                </>
              )}
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {heroContent.imageUrl && (
                <img
                  src={heroContent.imageUrl}
                  alt={heroContent.content?.title || 'Hero Image'}
                  className="rounded-3xl shadow-2xl"
                />
              )}
            </motion.div>
          </div>
        ) : null}
      </div>
    </section>
  );
};
