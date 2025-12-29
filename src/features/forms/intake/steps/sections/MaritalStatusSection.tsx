import React from 'react';
import { FormField } from '@/components/forms/FormField';
import { ConditionalSection } from '@/components/forms/ConditionalSection';

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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Marital Status</h3>

      <FormField
        label="Marital Status"
        name="marital_status"
        value={formData.marital_status || ''}
        onChange={handleInputChange}
        error={errors.marital_status}
      />

      <ConditionalSection condition={formData.marital_status === 'married'}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-md">
          <FormField
            label="Spouse Name"
            name="spouse_name"
            value={formData.spouse_name || ''}
            onChange={handleInputChange}
            error={errors.spouse_name}
          />
          <FormField
            label="Spouse Cell"
            name="spouse_cell"
            type="tel"
            value={formData.spouse_cell || ''}
            onChange={handleInputChange}
            error={errors.spouse_cell}
          />
          <FormField
            label="Spouse Work"
            name="spouse_work"
            value={formData.spouse_work || ''}
            onChange={handleInputChange}
            error={errors.spouse_work}
          />
        </div>
      </ConditionalSection>
    </div>
  );
};
