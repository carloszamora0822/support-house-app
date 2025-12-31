import React from 'react';
import { FormField } from '@/components/forms/FormField';
import { SelectField } from '@/components/forms/SelectField';
import { RadioGroup } from '@/components/forms/RadioGroup';
import { ConditionalSection } from '@/components/forms/ConditionalSection';
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

const YES_NO_OPTIONS = [
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
];

export const EmploymentSection: React.FC<EmploymentSectionProps> = ({
  formData,
  onChange,
  errors,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(e.target.name, e.target.value);
  };

  const isEmployed = formData.employment_status === 'employed';
  // Ensure boolean value is never undefined
  const homeHasEmployed = formData.home_has_employed ?? false;

  return (
    <div className="space-y-8">
      <h3 className="text-xl md:text-2xl font-semibold text-gray-900">Employment</h3>

      <SelectField
        label="Employment Status"
        name="employment_status"
        value={formData.employment_status || ''}
        onChange={handleInputChange}
        options={EMPLOYMENT_STATUSES}
        placeholder="Select Employment Status"
        error={errors.employment_status}
        className="text-base md:text-lg p-4"
      />

      <ConditionalSection condition={isEmployed}>
        <div className="p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg space-y-6">
          <p className="text-base md:text-lg font-semibold text-blue-900">Employment Details</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Employer Name"
              name="employer_name"
              value={formData.employer_name || ''}
              onChange={handleInputChange}
              error={errors.employer_name}
              className="text-base md:text-lg p-4"
            />
            <FormField
              label="Occupation"
              name="occupation"
              value={formData.occupation || ''}
              onChange={handleInputChange}
              error={errors.occupation}
              className="text-base md:text-lg p-4"
            />
          </div>
        </div>
      </ConditionalSection>

      <div className="border-t-2 border-gray-200 pt-8">
        <div className="space-y-3">
          <RadioGroup
            label="Does your home have anyone employed?"
            options={YES_NO_OPTIONS}
            value={homeHasEmployed ? 'true' : 'false'}
            onChange={(value) => onChange('home_has_employed', value === 'true')}
            error={errors.home_has_employed}
            horizontal
            className="text-base md:text-lg"
          />
        </div>
      </div>
    </div>
  );
};
