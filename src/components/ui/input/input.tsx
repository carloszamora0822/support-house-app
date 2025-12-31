import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import { inputVariants, type InputVariants } from './input.variants';

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    InputVariants {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, error, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          inputVariants({ 
            variant: error ? 'error' : variant, 
            inputSize 
          }),
          'shadow-sm hover:shadow-md transition-all duration-normal',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
