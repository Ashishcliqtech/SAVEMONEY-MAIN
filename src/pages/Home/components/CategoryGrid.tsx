import React from 'react';
import { motion } from 'framer-motion';
import {
  Shirt,
  Smartphone,
  Plane,
  Utensils,
  Sparkles,
  Home,
  BookOpen,
  Heart,
  Package,
} from 'lucide-react';
import { Card } from '../../../components/ui';
import { Category } from '../../../types';
import { Link } from 'react-router-dom';

interface CategoryGridProps {
  categories: Category[];
  isLoading: boolean;
}

const CategorySkeleton: React.FC = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="text-center group cursor-pointer h-full min-h-[180px] flex flex-col p-4 rounded-lg bg-gray-100 animate-pulse">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-200 mb-4" />
                <div className="w-24 h-5 bg-gray-200 rounded mx-auto mb-2" />
                <div className="w-16 h-4 bg-gray-200 rounded mx-auto" />
                <div className="w-16 h-4 bg-gray-200 rounded mx-auto mt-1" />
            </div>
        ))}
    </div>
);

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, isLoading }) => {
  const iconMap: { [key: string]: React.ElementType } = {
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

  if (isLoading) {
    return <CategorySkeleton />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 sm:gap-6">
      {categories.map((category, index) => {
        const IconComponent = iconMap[category.icon] || Package;
        const bgColor = bgColors[index % bgColors.length];
        const textColor = textColors[index % textColors.length];
        
        return (
          <Link to={`/categories/${category.id}`} key={category.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center group cursor-pointer h-full min-h-[180px] flex flex-col" hover>
                <div className={`w-16 h-16 mx-auto rounded-2xl ${bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <IconComponent className={`w-8 h-8 ${textColor}`} />
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">{category.name}</h3>
                
                <div className="space-y-1 mt-auto">
                  <div className="text-xs text-gray-600">
                    {category.storeCount || 0} stores
                  </div>
                  <div className="text-xs text-green-600 font-medium">
                    {category.offerCount || 0} offers
                  </div>
                </div>
              </Card>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
};
