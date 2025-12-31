import { cn } from '@/lib/utils/cn';

interface PageShellProps {
  children: React.ReactNode;
  variant?: 'default' | 'gradient' | 'plain';
  className?: string;
}

const variants = {
  default: 'bg-surface-muted',
  gradient: 'bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100',
  plain: 'bg-surface',
};

export const PageShell = ({ children, variant = 'default', className }: PageShellProps) => {
  return (
    <div className={cn('min-h-screen', variants[variant], className)}>
      {children}
    </div>
  );
};
