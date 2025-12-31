import { cva, type VariantProps } from 'class-variance-authority';

export const badgeVariants = cva(
  ['inline-flex items-center rounded-full border', 'px-2.5 py-0.5 text-xs font-medium'],
  {
    variants: {
      variant: {
        primary: 'bg-primary-100 text-primary-800 border-primary-200',
        secondary: 'bg-surface-muted text-text-muted border-border',
        success: 'bg-status-success-light text-status-success-dark border-status-success',
        warning: 'bg-status-warning-light text-status-warning-dark border-status-warning',
        error: 'bg-status-error-light text-status-error-dark border-status-error',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;
