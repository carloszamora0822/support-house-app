import { cva, type VariantProps } from 'class-variance-authority';

export const selectVariants = cva(
  [
    'flex w-full appearance-none rounded-lg border bg-white',
    'px-4 py-2.5 pr-10 font-sans font-medium',
    'focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-muted',
    'transition-all duration-normal',
    'shadow-sm hover:shadow-md',
    'text-text',
    // Style the dropdown options
    '[&>option]:bg-white [&>option]:text-text [&>option]:font-sans [&>option]:py-2',
    '[&>option]:hover:bg-primary-50',
    '[&>option:checked]:bg-primary-100 [&>option:checked]:font-semibold',
  ],
  {
    variants: {
      variant: {
        default: 'border-primary-200 hover:border-primary-400 focus:border-primary-600',
        error: 'border-status-error focus:ring-status-error',
        success: 'border-status-success focus:ring-status-success',
        filled: 'bg-gradient-to-br from-white to-purple-50 border-purple-200 hover:border-purple-400',
      },
      selectSize: {
        sm: 'h-9 text-xs px-3 py-2 pr-8',
        md: 'h-11 text-sm px-4 py-2.5 pr-10',
        lg: 'h-13 text-base px-5 py-3 pr-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      selectSize: 'md',
    },
  }
);

export type SelectVariants = VariantProps<typeof selectVariants>;
