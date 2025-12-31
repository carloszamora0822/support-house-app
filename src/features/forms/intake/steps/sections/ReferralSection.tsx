import React from 'react';
import { FormField } from '@/components/forms/FormField';
import { SelectField } from '@/components/forms/SelectField';
import { CheckboxGroup } from '@/components/forms/CheckboxGroup';
import { ConditionalSection } from '@/components/forms/ConditionalSection';
import { REFERRAL_SOURCES } from '@/constants/referralSources';

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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <div className="space-y-8">
      <h3 className="text-xl md:text-2xl font-semibold text-gray-900">Referral & Assistance</h3>

      <SelectField
        label="How did you hear about us?"
        name="referral_source"
        value={formData.referral_source}
        onChange={handleInputChange}
        options={REFERRAL_SOURCES}
        placeholder="Select Referral Source"
        required
        error={errors.referral_source}
        className="text-base md:text-lg p-4"
      />

      <ConditionalSection condition={formData.referral_source === 'other'}>
        <FormField
          label="Other Referral Source (Please Specify)"
          name="referral_other"
          value={formData.referral_other || ''}
          onChange={handleInputChange}
          error={errors.referral_other}
          className="text-base md:text-lg p-4"
        />
      </ConditionalSection>

      <div className="space-y-3">
        <CheckboxGroup
          label="What assistance are you seeking? (Select all that apply)"
          options={ASSISTANCE_TYPES}
          value={formData.assistance_types || []}
          onChange={(selected) => onChange('assistance_types', selected)}
          required
          error={errors.assistance_types}
          className="text-base md:text-lg"
        />
      </div>

      <ConditionalSection condition={(formData.assistance_types || []).includes('other')}>
        <FormField
          label="Other Assistance Type (Please Specify)"
          name="assistance_other"
          value={formData.assistance_other || ''}
          onChange={handleInputChange}
          error={errors.assistance_other}
          className="text-base md:text-lg p-4"
        />
      </ConditionalSection>
    </div>
  );
};
