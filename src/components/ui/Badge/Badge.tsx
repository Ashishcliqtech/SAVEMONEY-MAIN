import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 font-bold',
    secondary: 'bg-teal-100 text-teal-800',
    success: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 font-semibold',
    warning: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 font-semibold',
    danger: 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 font-bold',
    info: 'bg-blue-100 text-blue-800',
  };
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  const badgeClasses = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size]
  );

  return (
    <span className={badgeClasses}>
      {children}
    </span>
  );
};