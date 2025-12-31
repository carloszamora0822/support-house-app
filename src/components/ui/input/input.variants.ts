import { cva, type VariantProps } from 'class-variance-authority';

export const inputVariants = cva(
  [
    'flex w-full rounded-lg border bg-white',
    'px-4 py-2.5 text-sm font-sans font-normal text-text',
    'placeholder:text-text-subtle placeholder:font-normal',
    'focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-muted',
    'transition-all duration-normal',
  ],
  {
    variants: {
      variant: {
        default: 'border-border hover:border-primary-300',
        error: 'border-status-error focus:ring-status-error',
        success: 'border-status-success focus:ring-status-success',
      },
      inputSize: {
        sm: 'h-9 text-xs px-3 py-2',
        md: 'h-11 text-sm px-4 py-2.5',
        lg: 'h-13 text-base px-5 py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
    },
  }
);

export type InputVariants = VariantProps<typeof inputVariants>;
