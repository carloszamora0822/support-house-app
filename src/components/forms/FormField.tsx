import React from 'react';
import { FormField as DesignSystemFormField } from '@/components/patterns/form-field';

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: 'text' | 'email' | 'tel' | 'date' | 'number' | 'password';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  multiline?: boolean;
  rows?: number;
  className?: string;
}

/**
 * FormField - Wrapper around design system FormField pattern
 * Provides backward compatibility for existing form code while using the new design system
 * @deprecated Use @/components/patterns/form-field directly for new code
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  error,
  helperText,
  multiline = false,
  rows = 3,
  className = '',
}) => {
  return (
    <div className={className}>
      <DesignSystemFormField
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        error={error}
        hint={helperText}
        multiline={multiline}
        rows={rows}
      />
    </div>
  );
};
