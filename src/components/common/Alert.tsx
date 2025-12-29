import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
}

export const Alert = ({ className, variant = 'info', children, ...props }: AlertProps) => {
  const variantStyles = {
    info: 'bg-blue-50 text-blue-900 border-blue-200',
    success: 'bg-green-50 text-green-900 border-green-200',
    warning: 'bg-yellow-50 text-yellow-900 border-yellow-200',
    error: 'bg-red-50 text-red-900 border-red-200',
  };

  return (
    <div
      className={cn(
        'rounded-md border p-4',
        variantStyles[variant],
        className
      )}
      role="alert"
      {...props}
    >
      {children}
    </div>
  );
};
