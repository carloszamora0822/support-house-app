import React from 'react';
import { FormField } from '@/components/forms/FormField';

interface MedicalOfficeSectionProps {
  formData: {
    office_patient_diagnosis: string;
    office_stage?: string;
    office_expected_treatments?: number;
    office_treatment_start_date?: string;
    office_treatment_end_date?: string;
  };
  onChange: (field: string, value: string | number) => void;
  errors: Record<string, string>;
}

export const MedicalOfficeSection: React.FC<MedicalOfficeSectionProps> = ({
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
      <h3 className="text-lg font-semibold text-gray-900">Medical Office Staff Section</h3>

      <FormField
        label="Patient Diagnosis"
        name="office_patient_diagnosis"
        value={formData.office_patient_diagnosis}
        onChange={handleInputChange}
        required
        error={errors.office_patient_diagnosis}
        helperText="Complete diagnosis as provided by medical office"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          label="Stage"
          name="office_stage"
          value={formData.office_stage || ''}
          onChange={handleInputChange}
          error={errors.office_stage}
        />
        <FormField
          label="Expected Treatments"
          name="office_expected_treatments"
          type="number"
          value={formData.office_expected_treatments?.toString() || ''}
          onChange={handleInputChange}
          error={errors.office_expected_treatments}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Treatment Start Date"
          name="office_treatment_start_date"
          type="date"
          value={formData.office_treatment_start_date || ''}
          onChange={handleInputChange}
          error={errors.office_treatment_start_date}
        />
        <FormField
          label="Treatment End Date"
          name="office_treatment_end_date"
          type="date"
          value={formData.office_treatment_end_date || ''}
          onChange={handleInputChange}
          error={errors.office_treatment_end_date}
        />
      </div>
    </div>
  );
};
