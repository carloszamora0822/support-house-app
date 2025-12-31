import React from 'react';
import { Select } from '@/components/ui/select';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[] | readonly SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
}

/**
 * SelectField - Wrapper around the design system Select component
 * Provides backward compatibility for existing form code while using the new design system
 */
export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  required = false,
  disabled = false,
  error,
  helperText,
  className = '',
}) => {
  return (
    <div className={className}>
      <Select
        label={label}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        options={options.map(opt => ({ value: opt.value, label: opt.label }))}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        error={!!error}
        hint={error || helperText}
        selectSize="lg"
      />
    </div>
  );
};
