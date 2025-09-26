import React, { forwardRef } from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon: Icon, iconPosition = 'left', className, ...props }, ref) => {
    const inputClasses = clsx(
      'w-full px-4 py-3 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
      Icon && iconPosition === 'left' && 'pl-12',
      Icon && iconPosition === 'right' && 'pr-12',
      error ? 'border-red-500' : 'border-gray-300',
      props.disabled && 'bg-gray-100 cursor-not-allowed opacity-50',
      className
    );

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && iconPosition === 'left' && (
            <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          )}
          <input
            ref={ref}
            className={inputClasses}
            {...props}
          />
          {Icon && iconPosition === 'right' && (
            <Icon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';