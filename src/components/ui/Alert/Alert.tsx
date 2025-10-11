import React from 'react';
import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';
import clsx from 'clsx';

const variantClasses = {
  default: 'bg-blue-100 border-blue-400 text-blue-700',
  error: 'bg-red-100 border-red-400 text-red-700',
  success: 'bg-green-100 border-green-400 text-green-700',
  warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
};

const icons = {
  error: <XCircle className="h-5 w-5" />,
  success: <CheckCircle className="h-5 w-5" />,
  warning: <AlertCircle className="h-5 w-5" />,
  default: <Info className="h-5 w-5" />,
};

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  variant?: 'default' | 'error' | 'success' | 'warning';
}

export const Alert: React.FC<AlertProps> = ({ className, variant = 'default', title, children, ...props }) => {
  const icon = icons[variant];
  return (
    <div
      role="alert"
      className={clsx('relative rounded-lg border p-4', variantClasses[variant], className)}
      {...props}
    >
      <div className="flex">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-3">
          {title && <h5 className="font-medium leading-none tracking-tight">{title}</h5>}
          <div className="text-sm [&_p]:leading-relaxed mt-2">{children}</div>
        </div>
      </div>
    </div>
  );
};
