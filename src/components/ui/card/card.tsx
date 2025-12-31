import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = ({ className, children, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-surface p-4 sm:p-5 md:p-card shadow-sm',
        'transition-all duration-normal',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
