import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '../../../components/ui';
import { useContentSections } from '../../../hooks/useContent';
import { Link } from 'react-router-dom';
import { ContentSection } from '../../../types';

const HeroSectionSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    <div className="space-y-6">
      <div className="w-full h-12 bg-white/30 rounded animate-pulse" />
      <div className="w-full h-8 bg-white/30 rounded animate-pulse" />
      <div className="w-4/5 h-8 bg-white/30 rounded animate-pulse" />
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <div className="w-48 h-14 bg-white/30 rounded-lg animate-pulse" />
      </div>
      <div className="w-full h-6 bg-white/30 rounded animate-pulse" />
    </div>
    <div className="w-full h-96 bg-white/20 rounded-3xl animate-pulse" />
  </div>
);

export const HeroSection: React.FC = () => {
  const { data: heroData, isLoading } = useContentSections({
    page: 'homepage',
    status: 'published',
  });

  const heroContent: ContentSection | undefined = heroData?.find(
    (section) => section.contentType === 'hero'
  );

  const content = heroContent?.content as {
    title?: string;
    subtitle?: string;
    cta?: { text?: string; };
    highlight?: string;
  } | undefined;

  return (
    <section className="relative bg-gradient-to-br from-[#1E3A8A] via-[#3B82F6] to-[#BFDBFE] text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-300" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
        {isLoading ? (
          <HeroSectionSkeleton />
        ) : heroContent && content ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
                {content.title}
              </h1>

              <p className="text-lg sm:text-xl text-blue-100 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {content.subtitle}
              </p>

              {content.cta && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link to="/offers">
                    <Button
                      size="lg"
                      icon={ArrowRight}
                      iconPosition="right"
                      className="bg-white text-blue-600 hover:bg-blue-100 font-bold px-8 py-4 rounded-full shadow-lg transition-all duration-300 w-full sm:w-auto"
                    >
                      {content.cta.text}
                    </Button>
                  </Link>
                </div>
              )}

              {content.highlight && (
                <p className="mt-8 text-sm text-blue-200 font-semibold tracking-wider">
                  {content.highlight}
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative flex justify-center lg:justify-end"
            >
              {heroContent.imageUrl && (
                <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl bg-white/10 p-4">
                  <div
                    className="w-full h-full rounded-2xl bg-cover bg-center"
                    style={{ backgroundImage: `url(${heroContent.imageUrl})` }}
                  />
                </div>
              )}
            </motion.div>
          </div>
        ) : null}
      </div>
    </section>
  );
};
