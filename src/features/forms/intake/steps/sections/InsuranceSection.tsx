import React from 'react';
import { CheckboxGroup } from '@/components/forms/CheckboxGroup';
import { ConditionalSection } from '@/components/forms/ConditionalSection';
import { Checkbox } from '@/components/common/Checkbox';

const INSURANCE_TYPES = [
  { value: 'medicare', label: 'Medicare' },
  { value: 'medicaid', label: 'Medicaid' },
  { value: 'private', label: 'Private Insurance' },
  { value: 'other', label: 'Other' },
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

      {/* Has Insurance */}
      <div className="flex items-center">
        <Checkbox
          id="has_insurance"
          checked={formData.has_insurance}
          onChange={(e) => onChange('has_insurance', e.target.checked)}
        />
        <label htmlFor="has_insurance" className="ml-2 text-sm text-gray-700">
          Has Insurance
        </label>
      </div>

      {/* Insurance Types (conditional) */}
      <ConditionalSection condition={formData.has_insurance}>
        <CheckboxGroup
          label="Insurance Type"
          options={INSURANCE_TYPES}
          value={formData.insurance_type || []}
          onChange={(selected) => onChange('insurance_type', selected)}
          error={errors.insurance_type}
        />
      </ConditionalSection>

      {/* Veteran Status */}
      <div className="flex items-center">
        <Checkbox
          id="is_veteran"
          checked={formData.is_veteran}
          onChange={(e) => onChange('is_veteran', e.target.checked)}
        />
        <label htmlFor="is_veteran" className="ml-2 text-sm text-gray-700">
          Veteran
        </label>
      </div>
    </div>
  );
};
