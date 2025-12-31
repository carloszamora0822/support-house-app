import React from 'react';
import { FormField } from '@/components/forms/FormField';

interface DiagnosisSectionProps {
  formData: {
    diagnosis_primary: string;
    diagnosis_date: string;
    mets_to?: string;
  };
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

export const DiagnosisSection: React.FC<DiagnosisSectionProps> = ({
  formData,
  onChange,
  errors,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <div className="space-y-8">
      <h3 className="text-xl md:text-2xl font-semibold text-gray-900">Diagnosis Information</h3>

      <FormField
        label="Primary Diagnosis"
        name="diagnosis_primary"
        value={formData.diagnosis_primary}
        onChange={handleInputChange}
        required
        error={errors.diagnosis_primary}
        helperText="Enter the primary cancer diagnosis (e.g., Breast Cancer, Lung Cancer)"
        className="text-base md:text-lg p-4"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Diagnosis Date"
          name="diagnosis_date"
          type="date"
          value={formData.diagnosis_date}
          onChange={handleInputChange}
          required
          error={errors.diagnosis_date}
          className="text-base md:text-lg p-4"
        />
        <FormField
          label="Metastasis To (Optional)"
          name="mets_to"
          value={formData.mets_to || ''}
          onChange={handleInputChange}
          error={errors.mets_to}
          helperText="If applicable, where has it spread?"
          className="text-base md:text-lg p-4"
        />
      </div>
    </div>
  );
};
