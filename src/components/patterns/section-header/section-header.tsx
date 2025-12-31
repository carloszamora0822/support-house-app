import { cn } from '@/lib/utils/cn';

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader = ({ 
  title, 
  description, 
  action,
  className 
}: SectionHeaderProps) => {
  return (
    <div className={cn('mb-4 sm:mb-5 md:mb-6', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl md:text-heading-lg text-text font-bold truncate">{title}</h2>
          {description && (
            <p className="text-xs sm:text-sm md:text-body-sm text-text-muted mt-1">{description}</p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
};
