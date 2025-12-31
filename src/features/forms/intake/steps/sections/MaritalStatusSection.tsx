import React from 'react';
import { FormField } from '@/components/forms/FormField';
import { SelectField } from '@/components/forms/SelectField';
import { ConditionalSection } from '@/components/forms/ConditionalSection';
import { MARITAL_STATUSES } from '@/constants/maritalStatuses';

interface MaritalStatusSectionProps {
  formData: {
    marital_status?: string;
    spouse_name?: string;
    spouse_cell?: string;
    spouse_work?: string;
  };
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

export const MaritalStatusSection: React.FC<MaritalStatusSectionProps> = ({
  formData,
  onChange,
  errors,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <div className="space-y-8">
      <h3 className="text-xl md:text-2xl font-semibold text-gray-900">Marital Status</h3>

      <SelectField
        label="Marital Status"
        name="marital_status"
        value={formData.marital_status || ''}
        onChange={handleInputChange}
        options={MARITAL_STATUSES}
        placeholder="Select Marital Status"
        error={errors.marital_status}
        className="text-base md:text-lg p-4"
      />

      <ConditionalSection condition={formData.marital_status === 'married'}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
          <FormField
            label="Spouse Name"
            name="spouse_name"
            value={formData.spouse_name || ''}
            onChange={handleInputChange}
            error={errors.spouse_name}
            className="text-base md:text-lg p-4"
          />
          <FormField
            label="Spouse Cell Phone"
            name="spouse_cell"
            type="tel"
            value={formData.spouse_cell || ''}
            onChange={handleInputChange}
            error={errors.spouse_cell}
            placeholder="555-123-4567"
            className="text-base md:text-lg p-4"
          />
          <FormField
            label="Spouse Work Phone"
            name="spouse_work"
            type="tel"
            value={formData.spouse_work || ''}
            onChange={handleInputChange}
            error={errors.spouse_work}
            placeholder="555-123-4567"
            className="text-base md:text-lg p-4"
          />
        </div>
      </ConditionalSection>
    </div>
  );
};
