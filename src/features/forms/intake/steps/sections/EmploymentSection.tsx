import React from 'react';
import { FormField } from '@/components/forms/FormField';
import { Checkbox } from '@/components/common/Checkbox';

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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Employment</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Employment Status"
          name="employment_status"
          value={formData.employment_status || ''}
          onChange={handleInputChange}
          error={errors.employment_status}
        />
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
