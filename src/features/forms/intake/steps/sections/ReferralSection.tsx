import React from 'react';
import { FormField } from '@/components/forms/FormField';
import { CheckboxGroup } from '@/components/forms/CheckboxGroup';
import { ConditionalSection } from '@/components/forms/ConditionalSection';

const ASSISTANCE_TYPES = [
  { value: 'food', label: 'Food' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'wigs', label: 'Wigs/Salon' },
  { value: 'financial', label: 'Financial Assistance' },
  { value: 'counseling', label: 'Counseling' },
  { value: 'other', label: 'Other' },
];

interface ReferralSectionProps {
  formData: {
    referral_source: string;
    referral_other?: string;
    assistance_types: string[];
    assistance_other?: string;
  };
  onChange: (field: string, value: string | string[]) => void;
  errors: Record<string, string>;
}

export const ReferralSection: React.FC<ReferralSectionProps> = ({
  formData,
  onChange,
  errors,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Referral & Assistance</h3>

      <FormField
        label="Referral Source"
        name="referral_source"
        value={formData.referral_source}
        onChange={handleInputChange}
        required
        error={errors.referral_source}
      />

      <ConditionalSection condition={formData.referral_source === 'other'}>
        <FormField
          label="Other Referral Source"
          name="referral_other"
          value={formData.referral_other || ''}
          onChange={handleInputChange}
          error={errors.referral_other}
        />
      </ConditionalSection>

      <CheckboxGroup
        label="Assistance Types"
        options={ASSISTANCE_TYPES}
        value={formData.assistance_types}
        onChange={(selected) => onChange('assistance_types', selected)}
        required
        error={errors.assistance_types}
      />

      <ConditionalSection condition={formData.assistance_types.includes('other')}>
        <FormField
          label="Other Assistance Type"
          name="assistance_other"
          value={formData.assistance_other || ''}
          onChange={handleInputChange}
          error={errors.assistance_other}
        />
      </ConditionalSection>
    </div>
  );
};
