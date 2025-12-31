import React from 'react';
import { RadioGroup as DesignSystemRadioGroup } from '@/components/ui/radio-group';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  label: string;
  name?: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  horizontal?: boolean;
  className?: string;
}

/**
 * RadioGroup - Wrapper around design system RadioGroup component
 * Provides backward compatibility for existing form code while using the new design system
 * @deprecated Use @/components/ui/radio-group directly for new code
 */
export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  horizontal = false,
  className = '',
}) => {
  return (
    <DesignSystemRadioGroup
      label={label}
      name={name}
      options={options}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      error={error}
      variant="button"
      orientation={horizontal ? 'horizontal' : 'vertical'}
      className={className}
    />
  );
};
