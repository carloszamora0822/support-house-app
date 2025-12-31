import { cn } from '@/lib/utils/cn';

interface PageContentProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
}

const maxWidths = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-[1400px]',
  '2xl': 'max-w-[1600px]',
  full: 'max-w-full',
};

export const PageContent = ({ 
  children, 
  maxWidth = 'lg', 
  className 
}: PageContentProps) => {
  return (
    <main className={cn(
      maxWidths[maxWidth],
      'mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8',
      className
    )}>
      {children}
    </main>
  );
};
