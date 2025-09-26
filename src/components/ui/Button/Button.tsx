import React from 'react';
import { Divide as LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  type = 'button',
  className,
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 focus:ring-orange-500 shadow-lg hover:shadow-xl font-bold transform hover:scale-105 transition-all duration-200',
    secondary: 'bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-orange-500 text-orange-600 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:text-white focus:ring-orange-500 font-semibold',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg hover:shadow-xl',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm gap-1',
    md: 'px-4 py-2.5 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2',
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed';
  const fullWidthClasses = fullWidth ? 'w-full' : '';

  const buttonClasses = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabled && disabledClasses,
    fullWidthClasses,
    className
  );

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
    >
      {loading ? (
        <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
        </>
      )}
    </motion.button>
  );
};