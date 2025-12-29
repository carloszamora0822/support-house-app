import React from 'react';
import { FormField } from '@/components/forms/FormField';
import { CheckboxGroup } from '@/components/forms/CheckboxGroup';

const MERCY_ONCOLOGISTS = [
  { value: 'Reddy', label: 'Dr. Reddy' },
  { value: 'Mackey', label: 'Dr. Mackey' },
  { value: 'Samman', label: 'Dr. Samman' },
  { value: 'Shrestha', label: 'Dr. Shrestha' },
];

const BAPTIST_ONCOLOGISTS = [
  { value: 'Arzoumanian', label: 'Dr. Arzoumanian' },
];

interface OncologistSectionProps {
  formData: {
    oncologist_mercy: string[];
    oncologist_baptist: string[];
    oncologist_other?: string;
  };
  onChange: (field: string, value: string[] | string) => void;
  errors: Record<string, string>;
}

export const OncologistSection: React.FC<OncologistSectionProps> = ({
  formData,
  onChange,
  errors,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Oncologists</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CheckboxGroup
          label="Mercy Oncologists"
          options={MERCY_ONCOLOGISTS}
          value={formData.oncologist_mercy}
          onChange={(selected) => onChange('oncologist_mercy', selected)}
          error={errors.oncologist_mercy}
        />

        <CheckboxGroup
          label="Baptist Oncologists"
          options={BAPTIST_ONCOLOGISTS}
          value={formData.oncologist_baptist}
          onChange={(selected) => onChange('oncologist_baptist', selected)}
          error={errors.oncologist_baptist}
        />
      </div>

      <FormField
        label="Other Oncologist"
        name="oncologist_other"
        value={formData.oncologist_other || ''}
        onChange={handleInputChange}
        error={errors.oncologist_other}
        helperText="If seeing an oncologist not listed above"
      />
    </div>
  );
};
