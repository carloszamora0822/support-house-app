import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export const LoadingState = ({ 
  message = 'Loading...', 
  size = 'md',
  className 
}: LoadingStateProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12', className)}>
      <Loader2 className={cn('animate-spin text-primary-600', sizes[size])} />
      <p className="text-text-muted text-sm mt-4">{message}</p>
    </div>
  );
};
