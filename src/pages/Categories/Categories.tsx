import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  Shirt,
  Smartphone,
  Plane,
  Utensils,
  Sparkles,
  Home,
  BookOpen,
  Heart,
} from 'lucide-react';
import { Card, Button, Badge, SearchBar, LoadingSpinner } from '../../components/ui';
import { useCategories } from '../../hooks/useApi';
import { Link } from 'react-router-dom';
import { Category } from '../../types';

type SortByType = 'name' | 'stores' | 'offers';

export const Categories: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortByType>('name');

  const { data: apiCategories, isLoading } = useCategories();
  const categories: Category[] = apiCategories || [];

  const iconMap: Record<string, React.ElementType> = {
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
    'bg-indigo-100',
    'bg-green-100',
    'bg-yellow-100',
    'bg-pink-100',
    'bg-purple-100',
    'bg-teal-100',
    'bg-orange-100',
    'bg-red-100',
  ];

  const textColors = [
    'text-indigo-600',
    'text-green-600',
    'text-yellow-600',
    'text-pink-600',
    'text-purple-600',
    'text-teal-600',
    'text-orange-600',
    'text-red-600',
  ];

  const filteredCategories = categories
    .filter(
      (category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (category.description &&
          category.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'stores':
          return (b.storeCount || 0) - (a.storeCount || 0);
        case 'offers':
          return (b.offerCount || 0) - (a.offerCount || 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="xl" text="Loading categories..." color="text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-700 to-purple-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {t('categories.title')}
          </motion.h1>
          <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
            Discover exclusive deals and trending categories loved by our shoppers.
          </p>
          <div className="max-w-md mx-auto">
            <SearchBar placeholder="Search categories..." onSearch={setSearchQuery} />
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-6xl mx-auto px-4 mt-12">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
          🔥 Most Popular Categories
        </h2>
        <p className="text-gray-500 text-center mb-8">
          Explore categories with the highest offers and engagement
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredCategories.slice(0, 3).map((category, index) => {
            const IconComponent =
              category.icon && Object.prototype.hasOwnProperty.call(iconMap, category.icon)
                ? iconMap[category.icon]
                : Sparkles;
            const bgColor = bgColors[index % bgColors.length];
            const textColor = textColors[index % textColors.length];

            return (
              <motion.div
                key={`popular-${category.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 text-center shadow-lg hover:shadow-xl transition-all bg-white rounded-2xl border border-gray-100">
                  <div className="absolute top-3 right-3">
                    <Badge variant="warning" size="sm">
                      Trending
                    </Badge>
                  </div>
                  <div
                    className={`w-16 h-16 mx-auto rounded-2xl ${bgColor} flex items-center justify-center mb-4`}
                  >
                    {IconComponent && <IconComponent className={`w-8 h-8 ${textColor}`} />}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {category.storeCount ?? 0} stores •{' '}
                    <span className="text-green-600 font-medium">
                      {category.offerCount ?? 0} offers
                    </span>
                  </p>
                  <Link to={`/categories/${category.id}`}>
                    <Button variant="primary" fullWidth size="sm">
                      Shop Now
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* All Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">All Categories</h2>
            <p className="text-gray-600">{filteredCategories.length} categories found</p>
          </div>

          <div className="flex items-center space-x-3">
            <label className="text-gray-700 text-sm font-medium">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortByType)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="name">Name</option>
              <option value="stores">Most Stores</option>
              <option value="offers">Most Offers</option>
            </select>
          </div>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredCategories.map((category, index) => {
            const IconComponent =
              category.icon && Object.prototype.hasOwnProperty.call(iconMap, category.icon)
                ? iconMap[category.icon]
                : Sparkles;
            const bgColor = bgColors[index % bgColors.length];
            const textColor = textColors[index % textColors.length];

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/categories/${category.id}`}>
                  <Card className="text-center group hover:shadow-xl bg-white border border-gray-100 rounded-2xl p-6 transition-all flex flex-col h-full">
                    <div
                      className={`w-20 h-20 mx-auto rounded-2xl ${bgColor} flex items-center justify-center mb-5 group-hover:scale-105 transition-transform`}
                    >
                      {IconComponent && <IconComponent className={`w-10 h-10 ${textColor}`} />}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {category.name}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {category.description || 'No description available.'}
                    </p>

                    <div className="flex justify-around mb-4 text-sm text-gray-700">
                      <div>
                        <div className="font-semibold">{category.storeCount ?? 0}</div>
                        <span className="text-gray-500">Stores</span>
                      </div>
                      <div>
                        <div className="font-semibold text-green-600">
                          {category.offerCount ?? 0}
                        </div>
                        <span className="text-gray-500">Offers</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      icon={ExternalLink}
                      className="mt-auto border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                    >
                      Explore
                    </Button>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
