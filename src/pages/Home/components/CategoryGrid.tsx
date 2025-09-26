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
} from 'lucide-react';
import { Card } from '../../../components/ui';
import { useCategories } from '../../../hooks/useSupabase';

export const CategoryGrid: React.FC = () => {
  const { data: categories } = useCategories();

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

  if (!categories) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 sm:gap-6">
      {categories.map((category, index) => {
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
            <Card className="text-center group cursor-pointer h-full min-h-[180px] flex flex-col" hover>
              <div className={`w-16 h-16 mx-auto rounded-2xl ${bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <IconComponent className={`w-8 h-8 ${textColor}`} />
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">{category.name}</h3>
              
              <div className="space-y-1 mt-auto">
                <div className="text-xs text-gray-600">
                  {category.storeCount} stores
                </div>
                <div className="text-xs text-green-600 font-medium">
                  {category.offerCount} offers
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};