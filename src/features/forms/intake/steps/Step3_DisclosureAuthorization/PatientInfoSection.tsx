import React from 'react';
import { FormField } from '@/components/forms/FormField';

interface PatientInfoSectionProps {
  formData: {
    fax_patient_name: string;
    fax_patient_dob: string;
    fax_patient_address: string;
    fax_patient_city: string;
    fax_patient_state: string;
    fax_patient_zip: string;
    fax_patient_phone: string;
  };
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

export const PatientInfoSection: React.FC<PatientInfoSectionProps> = ({
  formData,
  onChange,
  errors,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Patient Information</h3>
        <p className="text-sm text-gray-600 mt-1">Auto-filled from Step 1 - Patient Information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Patient Name"
          name="fax_patient_name"
          value={formData.fax_patient_name}
          onChange={handleInputChange}
          disabled
          error={errors.fax_patient_name}
        />
        <FormField
          label="Date of Birth"
          name="fax_patient_dob"
          type="date"
          value={formData.fax_patient_dob}
          onChange={handleInputChange}
          disabled
          error={errors.fax_patient_dob}
        />
      </div>

      <FormField
        label="Address"
        name="fax_patient_address"
        value={formData.fax_patient_address}
        onChange={handleInputChange}
        disabled
        error={errors.fax_patient_address}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          label="City"
          name="fax_patient_city"
          value={formData.fax_patient_city}
          onChange={handleInputChange}
          disabled
          error={errors.fax_patient_city}
        />
        <FormField
          label="State"
          name="fax_patient_state"
          value={formData.fax_patient_state}
          onChange={handleInputChange}
          disabled
          error={errors.fax_patient_state}
        />
        <FormField
          label="ZIP"
          name="fax_patient_zip"
          value={formData.fax_patient_zip}
          onChange={handleInputChange}
          disabled
          error={errors.fax_patient_zip}
        />
      </div>

      <FormField
        label="Phone"
        name="fax_patient_phone"
        value={formData.fax_patient_phone}
        onChange={handleInputChange}
        disabled
        error={errors.fax_patient_phone}
      />
    </div>
  );
};
