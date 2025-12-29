import React from 'react';
import { FormField } from '@/components/forms/FormField';
import { Checkbox } from '@/components/common/Checkbox';
import { EMPLOYMENT_STATUSES } from '@/constants/employmentStatuses';

interface EmploymentSectionProps {
  formData: {
    employment_status?: string;
    employer_name?: string;
    occupation?: string;
    home_has_employed?: boolean;
  };
  onChange: (field: string, value: string | boolean) => void;
  errors: Record<string, string>;
}

export const EmploymentSection: React.FC<EmploymentSectionProps> = ({
  formData,
  onChange,
  errors,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Employment</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="employment_status" className="block text-sm font-medium text-gray-700 mb-1">
            Employment Status
          </label>
          <select
            id="employment_status"
            name="employment_status"
            value={formData.employment_status || ''}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.employment_status ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
            }`}
            aria-invalid={errors.employment_status ? 'true' : 'false'}
            aria-describedby={errors.employment_status ? 'employment_status-error' : undefined}
          >
            <option value="">Select Employment Status</option>
            {EMPLOYMENT_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          {errors.employment_status && (
            <p id="employment_status-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.employment_status}
            </p>
          )}
        </div>
        <FormField
          label="Employer Name"
          name="employer_name"
          value={formData.employer_name || ''}
          onChange={handleInputChange}
          error={errors.employer_name}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Occupation"
          name="occupation"
          value={formData.occupation || ''}
          onChange={handleInputChange}
          error={errors.occupation}
        />
        <div className="flex items-center pt-8">
          <Checkbox
            id="home_has_employed"
            checked={formData.home_has_employed || false}
            onChange={(e) => onChange('home_has_employed', e.target.checked)}
          />
          <label htmlFor="home_has_employed" className="ml-2 text-sm text-gray-700">
            Home Has Employed
          </label>
        </div>
      </div>
    </div>
  );
};
