import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const generatedId = useId();
    const radioId = id || generatedId;

    return (
      <div className="flex items-start gap-3">
        <div className="relative flex items-center justify-center">
          <input
            type="radio"
            id={radioId}
            ref={ref}
            className={cn(
              'peer h-5 w-5 shrink-0 appearance-none rounded-full border-2 border-border',
              'bg-surface cursor-pointer transition-all duration-normal',
              'hover:border-primary-400 hover:shadow-sm',
              'focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2',
              'checked:border-primary-600',
              'disabled:cursor-not-allowed disabled:opacity-50',
              className
            )}
            {...props}
          />
          <div className="absolute h-2.5 w-2.5 rounded-full bg-primary-600 opacity-0 peer-checked:opacity-100 transition-opacity" />
        </div>
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <label
                htmlFor={radioId}
                className="text-sm font-medium text-text cursor-pointer select-none"
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-text-muted mt-0.5">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';
