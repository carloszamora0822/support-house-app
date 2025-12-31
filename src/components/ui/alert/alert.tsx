import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import { alertVariants, type AlertVariants } from './alert.variants';
import { Info, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

export interface AlertProps extends HTMLAttributes<HTMLDivElement>, AlertVariants {}

const iconMap = {
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  error: XCircle,
};

export const Alert = ({ className, variant = 'info', children, ...props }: AlertProps) => {
  const Icon = variant ? iconMap[variant] : iconMap.info;
  
  return (
    <div
      className={cn(alertVariants({ variant }), className)}
      role="alert"
      {...props}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <div className="flex-1">{children}</div>
    </div>
  );
};
