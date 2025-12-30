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

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Employment</h3>

      <SelectField
        label="Employment Status"
        name="employment_status"
        value={formData.employment_status || ''}
        onChange={handleInputChange}
        options={EMPLOYMENT_STATUSES}
        placeholder="Select Employment Status"
        error={errors.employment_status}
      />

      <ConditionalSection condition={isEmployed}>
        <div className="p-4 bg-blue-50 rounded-md space-y-4">
          <p className="text-sm font-medium text-blue-900 mb-3">Employment Details</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Employer Name"
              name="employer_name"
              value={formData.employer_name || ''}
              onChange={handleInputChange}
              error={errors.employer_name}
            />
            <FormField
              label="Occupation"
              name="occupation"
              value={formData.occupation || ''}
              onChange={handleInputChange}
              error={errors.occupation}
            />
          </div>
        </div>
      </ConditionalSection>

      <div className="border-t pt-6">
        <RadioGroup
          label="Does your home have anyone employed?"
          options={YES_NO_OPTIONS}
          value={formData.home_has_employed ? 'true' : 'false'}
          onChange={(value) => onChange('home_has_employed', value === 'true')}
          error={errors.home_has_employed}
          horizontal
        />
      </div>
    </div>
  );
};
