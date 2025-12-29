import React from 'react';
import { FormField } from '@/components/forms/FormField';
import { RadioGroup } from '@/components/forms/RadioGroup';
import { CheckboxGroup } from '@/components/forms/CheckboxGroup';
import { ConditionalSection } from '@/components/forms/ConditionalSection';

const STATUS_OPTIONS = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'child', label: 'Child' },
];

const ETHNICITY_OPTIONS = [
  { value: 'white', label: 'White' },
  { value: 'black', label: 'Black/African American' },
  { value: 'hispanic', label: 'Hispanic/Latino' },
  { value: 'asian', label: 'Asian' },
  { value: 'native', label: 'Native American' },
  { value: 'pacific', label: 'Pacific Islander' },
  { value: 'other', label: 'Other' },
];

const LANGUAGE_OPTIONS = [
  { value: 'english', label: 'English' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'vietnamese', label: 'Vietnamese' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'other', label: 'Other' },
];

interface DemographicsSectionProps {
  formData: {
    status: string;
    ethnicity: string[];
    ethnicity_other?: string;
    language: string[];
    language_other?: string;
    education?: string;
    guardian_name?: string;
    guardian_relationship?: string;
  };
  onChange: (field: string, value: string | string[]) => void;
  errors: Record<string, string>;
}

export const DemographicsSection: React.FC<DemographicsSectionProps> = ({
  formData,
  onChange,
  errors,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Demographics</h3>

      {/* Status */}
      <RadioGroup
        label="Status"
        options={STATUS_OPTIONS}
        value={formData.status}
        onChange={(value) => onChange('status', value)}
        required
        error={errors.status}
        horizontal
      />

      {/* Conditional Guardian Fields */}
      <ConditionalSection condition={formData.status === 'child'}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-md">
          <FormField
            label="Guardian Name"
            name="guardian_name"
            value={formData.guardian_name || ''}
            onChange={handleInputChange}
            required
            error={errors.guardian_name}
          />
          <FormField
            label="Guardian Relationship"
            name="guardian_relationship"
            value={formData.guardian_relationship || ''}
            onChange={handleInputChange}
            required
            error={errors.guardian_relationship}
          />
        </div>
      </ConditionalSection>

      {/* Ethnicity */}
      <CheckboxGroup
        label="Ethnicity"
        options={ETHNICITY_OPTIONS}
        value={formData.ethnicity}
        onChange={(selected) => onChange('ethnicity', selected)}
        required
        error={errors.ethnicity}
      />

      {/* Ethnicity Other */}
      <ConditionalSection condition={formData.ethnicity.includes('other')}>
        <FormField
          label="Other Ethnicity"
          name="ethnicity_other"
          value={formData.ethnicity_other || ''}
          onChange={handleInputChange}
          error={errors.ethnicity_other}
        />
      </ConditionalSection>

      {/* Language */}
      <CheckboxGroup
        label="Language"
        options={LANGUAGE_OPTIONS}
        value={formData.language}
        onChange={(selected) => onChange('language', selected)}
        required
        error={errors.language}
      />

      {/* Language Other */}
      <ConditionalSection condition={formData.language.includes('other')}>
        <FormField
          label="Other Language"
          name="language_other"
          value={formData.language_other || ''}
          onChange={handleInputChange}
          error={errors.language_other}
        />
      </ConditionalSection>

      {/* Education */}
      <FormField
        label="Education Level"
        name="education"
        value={formData.education || ''}
        onChange={handleInputChange}
        error={errors.education}
      />
    </div>
  );
};
