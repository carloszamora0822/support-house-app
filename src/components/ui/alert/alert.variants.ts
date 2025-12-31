import { cva, type VariantProps } from 'class-variance-authority';

export const alertVariants = cva(
  ['rounded-md border p-4', 'flex items-start gap-3'],
  {
    variants: {
      variant: {
        info: 'bg-status-info-light text-status-info-dark border-status-info',
        success: 'bg-status-success-light text-status-success-dark border-status-success',
        warning: 'bg-status-warning-light text-status-warning-dark border-status-warning',
        error: 'bg-status-error-light text-status-error-dark border-status-error',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

export type AlertVariants = VariantProps<typeof alertVariants>;
