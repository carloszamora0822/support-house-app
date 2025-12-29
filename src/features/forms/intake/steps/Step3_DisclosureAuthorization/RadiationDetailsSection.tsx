import React from 'react';
import { FormField } from '@/components/forms/FormField';

interface RadiationDetailsSectionProps {
  formData: {
    office_radiation_frequency?: string;
    office_radiation_every_weeks?: number;
  };
  onChange: (field: string, value: string | number) => void;
  errors: Record<string, string>;
}

export const RadiationDetailsSection: React.FC<RadiationDetailsSectionProps> = ({
  formData,
  onChange,
  errors,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value;
    onChange(e.target.name, value);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Radiation Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Frequency"
          name="office_radiation_frequency"
          value={formData.office_radiation_frequency || ''}
          onChange={handleInputChange}
          error={errors.office_radiation_frequency}
          helperText="e.g., daily, weekly, monthly"
        />
        <FormField
          label="Every (weeks)"
          name="office_radiation_every_weeks"
          type="number"
          value={formData.office_radiation_every_weeks?.toString() || ''}
          onChange={handleInputChange}
          error={errors.office_radiation_every_weeks}
        />
      </div>
    </div>
  );
};
