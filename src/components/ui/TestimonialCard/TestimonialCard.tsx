import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Card } from '../Card';

interface TestimonialCardProps {
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  savings: string;
  delay?: number;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  avatar,
  rating,
  comment,
  savings,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="h-full">
        <div className="flex items-center mb-4">
          <img
            src={avatar}
            alt={name}
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
          <div>
            <h4 className="font-semibold text-gray-900">{name}</h4>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <p className="text-gray-600 mb-4 italic">"{comment}"</p>
        <div className="text-green-600 font-semibold">
          Saved {savings} this month!
        </div>
      </Card>
    </motion.div>
  );
};