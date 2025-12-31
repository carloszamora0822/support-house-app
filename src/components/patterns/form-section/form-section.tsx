import { cn } from '@/lib/utils/cn';
import type { LucideIcon } from 'lucide-react';

interface FormSectionProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export const FormSection = ({ 
  title, 
  description, 
  icon: Icon, 
  children, 
  className 
}: FormSectionProps) => {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="border-b border-border pb-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-2 bg-primary-50 rounded-lg">
              <Icon className="h-5 w-5 text-primary-600" />
            </div>
          )}
          <div>
            <h3 className="text-heading-md text-text font-semibold">{title}</h3>
            {description && (
              <p className="text-body-sm text-text-muted mt-1">{description}</p>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-5">
        {children}
      </div>
    </div>
  );
};
