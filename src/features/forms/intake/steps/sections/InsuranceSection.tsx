import React from 'react';
import { CheckboxGroup } from '@/components/forms/CheckboxGroup';
import { RadioGroup } from '@/components/forms/RadioGroup';
import { ConditionalSection } from '@/components/forms/ConditionalSection';

const INSURANCE_TYPES = [
  { value: 'medicare', label: 'Medicare' },
  { value: 'medicaid', label: 'Medicaid' },
  { value: 'private', label: 'Private Insurance' },
  { value: 'other', label: 'Other' },
];

const YES_NO_OPTIONS = [
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
];

interface InsuranceSectionProps {
  formData: {
    has_insurance: boolean;
    insurance_type?: string[];
    is_veteran: boolean;
  };
  onChange: (field: string, value: boolean | string[]) => void;
  errors: Record<string, string>;
}

export const InsuranceSection: React.FC<InsuranceSectionProps> = ({
  formData,
  onChange,
  errors,
}) => {
  // Ensure boolean values are never undefined
  const hasInsurance = formData.has_insurance ?? false;
  const isVeteran = formData.is_veteran ?? false;
  const insuranceTypes = formData.insurance_type || [];

  return (
    <div className="space-y-8">
      <h3 className="text-xl md:text-2xl font-semibold text-gray-900">Insurance & Veteran Status</h3>

      <div className="space-y-3">
        <RadioGroup
          label="Do you have insurance?"
          options={YES_NO_OPTIONS}
          value={hasInsurance ? 'true' : 'false'}
          onChange={(value) => onChange('has_insurance', value === 'true')}
          error={errors.has_insurance}
          horizontal
          className="text-base md:text-lg"
        />
      </div>

      <ConditionalSection condition={hasInsurance}>
        <div className="p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
          <CheckboxGroup
            label="Insurance Type (Select all that apply)"
            options={INSURANCE_TYPES}
            value={insuranceTypes}
            onChange={(selected) => onChange('insurance_type', selected)}
            error={errors.insurance_type}
            className="text-base md:text-lg"
          />
        </div>
      </ConditionalSection>

      <div className="border-t-2 border-gray-200 pt-8">
        <div className="space-y-3">
          <RadioGroup
            label="Are you a veteran?"
            options={YES_NO_OPTIONS}
            value={isVeteran ? 'true' : 'false'}
            onChange={(value) => onChange('is_veteran', value === 'true')}
            error={errors.is_veteran}
            horizontal
            className="text-base md:text-lg"
          />
        </div>
      </div>
    </div>
  );
};
