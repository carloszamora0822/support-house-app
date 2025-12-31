import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils/cn';
import { AlertCircle } from 'lucide-react';

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
  hint?: string;
  multiline?: boolean;
  rows?: number;
  sensitive?: boolean;
  className?: string;
}

export const FormField = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  error,
  hint,
  multiline = false,
  rows = 3,
  sensitive = false,
  className,
}: FormFieldProps) => {
  const inputId = `field-${name}`;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className={cn('space-y-2.5', className)}>
      <label 
        htmlFor={inputId} 
        className="block text-sm font-semibold text-text"
      >
        {label}
        {required && <span className="text-status-error ml-1 font-bold">*</span>}
        {sensitive && (
          <span className="ml-2 text-xs font-medium text-sensitive-text bg-sensitive-bg px-2.5 py-1 rounded-md border border-sensitive-border">
            Sensitive
          </span>
        )}
      </label>

      {multiline ? (
        <textarea
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          className={cn(
            'flex w-full rounded-lg border bg-surface',
            'px-4 py-3 text-sm font-medium',
            'placeholder:text-text-subtle placeholder:font-normal',
            'focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-muted',
            'transition-all duration-normal shadow-sm hover:shadow-md',
            error ? 'border-status-error focus:ring-status-error' : 'border-border hover:border-primary-300',
            sensitive && 'border-sensitive-border bg-sensitive-bg'
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={cn(
            error && errorId,
            hint && hintId
          )}
        />
      ) : (
        <Input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          error={!!error}
          className={cn(
            sensitive && 'border-sensitive-border bg-sensitive-bg'
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={cn(
            error && errorId,
            hint && hintId
          )}
        />
      )}

      {error && (
        <div id={errorId} className="flex items-start gap-2 text-status-error" role="alert">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!error && hint && (
        <p id={hintId} className="text-sm text-text-muted">
          {hint}
        </p>
      )}
    </div>
  );
};
