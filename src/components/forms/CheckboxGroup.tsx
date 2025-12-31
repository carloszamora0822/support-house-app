import React from 'react';
import { Checkbox } from '../common/Checkbox';

interface CheckboxOption {
  value: string;
  label: string;
}

interface CheckboxGroupProps {
  label: string;
  options: CheckboxOption[];
  value: string[];
  onChange: (selected: string[]) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  options,
  value = [],
  onChange,
  required = false,
  disabled = false,
  error,
  className = '',
}) => {
  const safeValue = value ?? [];
  
  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...safeValue, optionValue]);
    } else {
      onChange(safeValue.filter(v => v !== optionValue));
    }
  };

  return (
    <fieldset className={className}>
      <legend className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </legend>
      
      <div className="space-y-2">
        {options.map(option => (
          <div key={option.value} className="flex items-center">
            <Checkbox
              id={option.value}
              checked={safeValue.includes(option.value)}
              onChange={(e) => handleChange(option.value, e.target.checked)}
              disabled={disabled}
            />
            <label
              htmlFor={option.value}
              className="ml-2 text-sm text-gray-700 cursor-pointer"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
};
