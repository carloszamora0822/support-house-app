import React from 'react';
import { FormField } from '@/components/forms/FormField';

interface TreatmentHistorySectionProps {
  formData: {
    treatment_surgery_dates?: string;
    treatment_chemo_start_1?: string;
    treatment_chemo_end_1?: string;
    treatment_chemo_start_2?: string;
    treatment_chemo_end_2?: string;
    treatment_radiation_start?: string;
    treatment_radiation_end?: string;
    treatment_other?: string;
  };
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

export const TreatmentHistorySection: React.FC<TreatmentHistorySectionProps> = ({
  formData,
  onChange,
  errors,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Treatment History</h3>

      {/* Surgery */}
      <FormField
        label="Surgery Dates"
        name="treatment_surgery_dates"
        value={formData.treatment_surgery_dates || ''}
        onChange={handleInputChange}
        error={errors.treatment_surgery_dates}
        helperText="Enter all surgery dates (e.g., 01/15/2024, 03/20/2024)"
      />

      {/* Chemo Cycle 1 */}
      <div>
        <h4 className="text-md font-medium text-gray-800 mb-3">Chemotherapy Cycle 1</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Chemo Cycle 1 Start"
            name="treatment_chemo_start_1"
            type="date"
            value={formData.treatment_chemo_start_1 || ''}
            onChange={handleInputChange}
            error={errors.treatment_chemo_start_1}
          />
          <FormField
            label="Chemo Cycle 1 End"
            name="treatment_chemo_end_1"
            type="date"
            value={formData.treatment_chemo_end_1 || ''}
            onChange={handleInputChange}
            error={errors.treatment_chemo_end_1}
          />
        </div>
      </div>

      {/* Chemo Cycle 2 */}
      <div>
        <h4 className="text-md font-medium text-gray-800 mb-3">Chemotherapy Cycle 2</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Chemo Cycle 2 Start"
            name="treatment_chemo_start_2"
            type="date"
            value={formData.treatment_chemo_start_2 || ''}
            onChange={handleInputChange}
            error={errors.treatment_chemo_start_2}
          />
          <FormField
            label="Chemo Cycle 2 End"
            name="treatment_chemo_end_2"
            type="date"
            value={formData.treatment_chemo_end_2 || ''}
            onChange={handleInputChange}
            error={errors.treatment_chemo_end_2}
          />
        </div>
      </div>

      {/* Radiation */}
      <div>
        <h4 className="text-md font-medium text-gray-800 mb-3">Radiation</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Radiation Start"
            name="treatment_radiation_start"
            type="date"
            value={formData.treatment_radiation_start || ''}
            onChange={handleInputChange}
            error={errors.treatment_radiation_start}
          />
          <FormField
            label="Radiation End"
            name="treatment_radiation_end"
            type="date"
            value={formData.treatment_radiation_end || ''}
            onChange={handleInputChange}
            error={errors.treatment_radiation_end}
          />
        </div>
      </div>

      {/* Other Treatment */}
      <FormField
        label="Other Treatment"
        name="treatment_other"
        value={formData.treatment_other || ''}
        onChange={handleInputChange}
        multiline
        rows={3}
        error={errors.treatment_other}
        helperText="Any other treatments not listed above"
      />
    </div>
  );
};
