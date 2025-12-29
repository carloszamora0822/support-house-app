import React from 'react';
import { FormField } from '@/components/forms/FormField';
import { CheckboxGroup } from '@/components/forms/CheckboxGroup';

const CHEMO_TYPES = [
  { value: 'IV', label: 'IV' },
  { value: 'Oral', label: 'Oral' },
  { value: 'Pump', label: 'Pump' },
];

interface ChemoDetailsSectionProps {
  formData: {
    office_chemo_type?: string[];
    office_chemo_frequency?: string;
    office_chemo_every_weeks?: number;
  };
  onChange: (field: string, value: string[] | string | number) => void;
  errors: Record<string, string>;
}

export const ChemoDetailsSection: React.FC<ChemoDetailsSectionProps> = ({
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
      <h3 className="text-lg font-semibold text-gray-900">Chemotherapy Details</h3>

      <CheckboxGroup
        label="Chemo Type"
        options={CHEMO_TYPES}
        value={formData.office_chemo_type || []}
        onChange={(selected) => onChange('office_chemo_type', selected)}
        error={errors.office_chemo_type}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Frequency"
          name="office_chemo_frequency"
          value={formData.office_chemo_frequency || ''}
          onChange={handleInputChange}
          error={errors.office_chemo_frequency}
          helperText="e.g., daily, weekly, monthly"
        />
        <FormField
          label="Every (weeks)"
          name="office_chemo_every_weeks"
          type="number"
          value={formData.office_chemo_every_weeks?.toString() || ''}
          onChange={handleInputChange}
          error={errors.office_chemo_every_weeks}
        />
      </div>
    </div>
  );
};
