import { forwardRef, useId } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import { ChevronDown } from 'lucide-react';
import { selectVariants, type SelectVariants } from './select.variants';

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement>,
    SelectVariants {
  error?: boolean;
  options?: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
  label?: string;
  hint?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant, selectSize, error, options, placeholder, label, hint, children, ...props }, ref) => {
    const generatedId = useId();
    const selectId = props.id || generatedId;
    
    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-semibold text-text">
            {label}
            {props.required && <span className="text-status-error ml-1 font-bold">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              selectVariants({ 
                variant: error ? 'error' : variant, 
                selectSize 
              }),
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options ? (
              options.map((option) => (
                <option 
                  key={option.value} 
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))
            ) : (
              children
            )}
          </select>
          <ChevronDown className={cn(
            'absolute top-1/2 -translate-y-1/2 pointer-events-none text-text-muted transition-transform',
            selectSize === 'sm' ? 'right-2 h-4 w-4' : selectSize === 'lg' ? 'right-4 h-6 w-6' : 'right-3 h-5 w-5'
          )} />
        </div>
        {hint && !error && (
          <p className="text-xs text-text-muted">{hint}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
