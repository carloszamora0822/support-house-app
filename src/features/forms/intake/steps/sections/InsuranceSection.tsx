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
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Insurance</h3>

      <RadioGroup
        label="Do you have insurance?"
        options={YES_NO_OPTIONS}
        value={formData.has_insurance ? 'true' : 'false'}
        onChange={(value) => onChange('has_insurance', value === 'true')}
        error={errors.has_insurance}
        horizontal
      />

      <ConditionalSection condition={formData.has_insurance}>
        <div className="p-4 bg-blue-50 rounded-md">
          <CheckboxGroup
            label="Insurance Type"
            options={INSURANCE_TYPES}
            value={formData.insurance_type || []}
            onChange={(selected) => onChange('insurance_type', selected)}
            error={errors.insurance_type}
          />
        </div>
      </ConditionalSection>

      <div className="border-t pt-6">
        <RadioGroup
          label="Are you a veteran?"
          options={YES_NO_OPTIONS}
          value={formData.is_veteran ? 'true' : 'false'}
          onChange={(value) => onChange('is_veteran', value === 'true')}
          error={errors.is_veteran}
          horizontal
        />
      </div>
    </div>
  );
};
