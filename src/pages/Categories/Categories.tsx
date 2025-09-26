import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Search, Filter, Grid2x2 as Grid, List, ExternalLink, Star, Shirt, Smartphone, Plane, Utensils, Sparkles, Home, BookOpen, Heart } from 'lucide-react';
import { Card, Button, Badge, SearchBar, LoadingSpinner } from '../../components/ui';
import { useCategories } from '../../hooks/useSupabase';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';

export const Categories: React.FC = () => {
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'stores' | 'offers'>('name');

  const { data: categories, isLoading } = useCategories();

  const iconMap = {
    shirt: Shirt,
    smartphone: Smartphone,
    plane: Plane,
    utensils: Utensils,
    sparkles: Sparkles,
    home: Home,
    'book-open': BookOpen,
    heart: Heart,
  };

  const bgColors = [
    'bg-purple-100',
    'bg-blue-100',
    'bg-green-100',
    'bg-orange-100',
    'bg-pink-100',
    'bg-teal-100',
    'bg-indigo-100',
    'bg-red-100',
  ];

  const textColors = [
    'text-purple-600',
    'text-blue-600',
    'text-green-600',
    'text-orange-600',
    'text-pink-600',
    'text-teal-600',
    'text-indigo-600',
    'text-red-600',
  ];

  const filteredCategories = categories?.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    switch (sortBy) {
      case 'stores':
        return b.storeCount - a.storeCount;
      case 'offers':
        return b.offerCount - a.offerCount;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              {t('categories.title')}
            </h1>
            <p className="text-xl text-indigo-100 mb-8">
              Discover amazing deals across all your favorite categories
            </p>
            
            <div className="max-w-2xl mx-auto">
              <SearchBar
                placeholder="Search categories..."
                onSearch={setSearchQuery}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t('categories.allCategories')}
            </h2>
            <p className="text-gray-600">
              {filteredCategories?.length || 0} categories available
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="name">Sort by Name</option>
              <option value="stores">Most Stores</option>
              <option value="offers">Most Offers</option>
            </select>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-8">
          {filteredCategories?.map((category, index) => {
            const IconComponent = iconMap[category.icon as keyof typeof iconMap];
            const bgColor = bgColors[index % bgColors.length];
            const textColor = textColors[index % textColors.length];

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/categories/${category.id}`}>
                  <Card className="text-center group cursor-pointer h-full flex flex-col" hover padding="md">
                    <div className={`w-20 h-20 mx-auto rounded-2xl ${bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}>
                      <IconComponent className={`w-10 h-10 ${textColor}`} />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {category.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                      {category.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">
                          {category.storeCount}
                        </div>
                        <div className="text-sm text-gray-500">
                          {t('categories.stores')}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          {category.offerCount}
                        </div>
                        <div className="text-sm text-gray-500">
                          {t('categories.offers')}
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        icon={ExternalLink}
                        className="group-hover:bg-indigo-50 group-hover:border-indigo-300"
                      >
                        Explore Category
                      </Button>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Popular Categories Highlight */}
        <section className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Most Popular Categories
            </h2>
            <p className="text-gray-600">
              Categories with the highest user engagement and best offers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredCategories?.slice(0, 3).map((category, index) => {
              const IconComponent = iconMap[category.icon as keyof typeof iconMap];
              const bgColor = bgColors[index % bgColors.length];
              const textColor = textColors[index % textColors.length];

              return (
                <motion.div
                  key={`popular-${category.id}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="text-center relative overflow-hidden" hover>
                    <div className="absolute top-2 right-2">
                      <Badge variant="warning" size="sm">
                        🔥 Hot
                      </Badge>
                    </div>
                    
                    <div className={`w-16 h-16 mx-auto rounded-2xl ${bgColor} flex items-center justify-center mb-4`}>
                      <IconComponent className={`w-8 h-8 ${textColor}`} />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {category.name}
                    </h3>
                    
                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 mb-4">
                      <span>{category.storeCount} stores</span>
                      <span>•</span>
                      <span className="text-green-600 font-medium">
                        {category.offerCount} offers
                      </span>
                    </div>

                    <Link to={`/categories/${category.id}`}>
                      <Button variant="primary" size="sm" fullWidth>
                        Shop Now
                      </Button>
                    </Link>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};