import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center',
    'rounded-md font-medium',
    'transition-colors duration-normal',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-primary-600 text-white',
          'hover:bg-primary-700',
          'focus-visible:ring-primary-600',
        ],
        secondary: [
          'bg-surface text-text',
          'border border-border',
          'hover:bg-surface-muted',
          'focus-visible:ring-primary-600',
        ],
        outline: [
          'border border-border bg-surface text-text',
          'hover:bg-surface-muted',
          'focus-visible:ring-primary-600',
        ],
        ghost: [
          'text-text',
          'hover:bg-surface-muted',
          'focus-visible:ring-primary-600',
        ],
        danger: [
          'bg-status-error text-white',
          'hover:bg-status-error-dark',
          'focus-visible:ring-status-error',
        ],
      },
      size: {
        sm: 'px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm',
        md: 'px-3 sm:px-4 py-2 text-sm sm:text-base',
        lg: 'px-4 sm:px-6 py-2.5 sm:py-3 text-base sm:text-lg',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
