import React from 'react';
import { FormField } from '@/components/forms/FormField';
import { SelectField } from '@/components/forms/SelectField';
import { RadioGroup } from '@/components/forms/RadioGroup';
import { CheckboxGroup } from '@/components/forms/CheckboxGroup';
import { ConditionalSection } from '@/components/forms/ConditionalSection';
import { Select } from '@/components/ui/select';
import { EDUCATION_LEVELS } from '@/constants/educationLevels';
import { RELATIONSHIPS } from '@/constants/relationships';

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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <div className="space-y-8">
      <h3 className="text-xl md:text-2xl font-semibold text-gray-900">Demographics</h3>

      {/* Status */}
      <div className="space-y-3">
        <RadioGroup
          label="Status"
          options={STATUS_OPTIONS}
          value={formData.status}
          onChange={(value) => onChange('status', value)}
          required
          error={errors.status}
          horizontal
          className="text-base md:text-lg"
        />
      </div>

      {/* Conditional Guardian Fields */}
      <ConditionalSection condition={formData.status === 'child'}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
          <FormField
            label="Guardian Name"
            name="guardian_name"
            value={formData.guardian_name || ''}
            onChange={handleInputChange}
            required
            error={errors.guardian_name}
            className="text-base md:text-lg p-4"
          />
          <SelectField
            label="Guardian Relationship"
            name="guardian_relationship"
            value={formData.guardian_relationship || ''}
            onChange={handleInputChange}
            options={RELATIONSHIPS}
            placeholder="Select Relationship"
            required
            error={errors.guardian_relationship}
            className="text-base md:text-lg p-4"
          />
        </div>
      </ConditionalSection>

      {/* Ethnicity */}
      <div className="space-y-3">
        <CheckboxGroup
          label="Ethnicity (Select all that apply)"
          options={ETHNICITY_OPTIONS}
          value={formData.ethnicity || []}
          onChange={(selected) => onChange('ethnicity', selected)}
          required
          error={errors.ethnicity}
          className="text-base md:text-lg"
        />
      </div>

      {/* Ethnicity Other */}
      <ConditionalSection condition={(formData.ethnicity || []).includes('other')}>
        <FormField
          label="Other Ethnicity (Please Specify)"
          name="ethnicity_other"
          value={formData.ethnicity_other || ''}
          onChange={handleInputChange}
          error={errors.ethnicity_other}
          className="text-base md:text-lg p-4"
        />
      </ConditionalSection>

      {/* Language */}
      <div className="space-y-3">
        <CheckboxGroup
          label="Language (Select all that apply)"
          options={LANGUAGE_OPTIONS}
          value={formData.language || []}
          onChange={(selected) => onChange('language', selected)}
          required
          error={errors.language}
          className="text-base md:text-lg"
        />
      </div>

      {/* Language Other */}
      <ConditionalSection condition={(formData.language || []).includes('other')}>
        <FormField
          label="Other Language (Please Specify)"
          name="language_other"
          value={formData.language_other || ''}
          onChange={handleInputChange}
          error={errors.language_other}
          className="text-base md:text-lg p-4"
        />
      </ConditionalSection>

      {/* Education */}
      <Select
        label="Education Level"
        id="education"
        name="education"
        value={formData.education || ''}
        onChange={onChange}
        selectSize="lg"
        placeholder="Select Education Level"
        error={!!errors.education}
        hint={errors.education}
        options={EDUCATION_LEVELS.map(level => ({ value: level.value, label: level.label }))}
      />
    </div>
  );
};
