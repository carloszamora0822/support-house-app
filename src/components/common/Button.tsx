import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { Button as DesignSystemButton } from '@/components/ui/button';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

/**
 * Button - Wrapper around design system Button component
 * Provides backward compatibility for existing code while using the new design system
 * @deprecated Use @/components/ui/button directly for new code
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, ...props }, ref) => {
    return (
      <DesignSystemButton
        ref={ref}
        variant={variant}
        size={size}
        loading={loading}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
