import { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils/cn';
import { Radio } from '@/components/ui/radio';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  label: string;
  name?: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  variant?: 'default' | 'button';
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  (
    {
      label,
      name,
      options,
      value,
      onChange,
      required = false,
      disabled = false,
      error,
      hint,
      variant = 'default',
      orientation = 'vertical',
      className,
    },
    ref
  ) => {
    const generatedId = useId();
    const groupName = name || generatedId;

    return (
      <fieldset ref={ref} className={cn('space-y-3', className)}>
        <legend className="block text-sm font-semibold text-text">
          {label}
          {required && <span className="text-status-error ml-1 font-bold">*</span>}
        </legend>

        {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}

        <div
          className={cn(
            variant === 'button' ? 'flex flex-wrap gap-2' : 'space-y-3',
            orientation === 'horizontal' && variant === 'default' && 'flex flex-wrap gap-4'
          )}
        >
          {options.map((option) => {
            const isSelected = value === option.value;
            const isDisabled = disabled || option.disabled;

            if (variant === 'button') {
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => !isDisabled && onChange(option.value)}
                  disabled={isDisabled}
                  className={cn(
                    'px-4 py-2.5 rounded-lg border-2 font-medium text-sm transition-all duration-normal',
                    'focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    isSelected
                      ? 'bg-primary-600 border-primary-600 text-white shadow-md'
                      : 'bg-white border-border text-text hover:border-primary-300 hover:shadow-sm',
                    error && !isSelected && 'border-status-error'
                  )}
                >
                  {option.label}
                </button>
              );
            }

            return (
              <Radio
                key={option.value}
                id={`${groupName}-${option.value}`}
                name={groupName}
                value={option.value}
                checked={isSelected}
                onChange={(e) => onChange(e.target.value)}
                disabled={isDisabled}
                label={option.label}
                description={option.description}
              />
            );
          })}
        </div>

        {error && (
          <p className="text-xs text-status-error mt-2" role="alert">
            {error}
          </p>
        )}
      </fieldset>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
