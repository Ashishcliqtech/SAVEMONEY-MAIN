import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  padding = 'md',
  onClick,
}) => {
  const baseClasses = 'bg-white rounded-xl border border-gray-200 shadow-sm';
  const hoverClasses = hover ? 'hover:shadow-lg hover:border-gray-300 cursor-pointer' : '';
  
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const cardClasses = clsx(
    baseClasses,
    hoverClasses,
    paddingClasses[padding],
    className
  );

  const CardComponent = onClick ? motion.div : 'div';

  return (
    <CardComponent
      className={cardClasses}
      onClick={onClick}
      {...(onClick && motion.div === CardComponent && {
        whileHover: { y: -2 },
        whileTap: { y: 0 },
      })}
    >
      {children}
    </CardComponent>
  );
};