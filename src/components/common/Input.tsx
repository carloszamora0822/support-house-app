import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Input as DesignSystemInput } from '@/components/ui/input';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

/**
 * Input - Wrapper around design system Input component
 * Provides backward compatibility for existing code while using the new design system
 * @deprecated Use @/components/ui/input directly for new code
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, ...props }, ref) => {
    return (
      <DesignSystemInput
        error={error}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
