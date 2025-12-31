import { cn } from '@/lib/utils/cn';
import { badgeVariants, type BadgeVariants } from './badge.variants';

interface BadgeProps extends BadgeVariants {
  children: React.ReactNode;
  className?: string;
}

export const Badge = ({ children, variant = 'primary', className }: BadgeProps) => {
  return (
    <span className={cn(badgeVariants({ variant }), className)}>
      {children}
    </span>
  );
};
