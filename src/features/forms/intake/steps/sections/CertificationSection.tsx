import React from 'react';
import { FormField } from '@/components/forms/FormField';

interface CertificationSectionProps {
  formData: {
    patient_signature: string;
    patient_printed_name: string;
    patient_signature_date: string;
    interviewed_by: string;
    interviewed_date: string;
  };
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

export const CertificationSection: React.FC<CertificationSectionProps> = ({
  formData,
  onChange,
  errors,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Certification</h3>

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <p className="text-sm text-gray-700">
          I certify that the information provided in this form is true and accurate to the best of my knowledge.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Patient Signature"
          name="patient_signature"
          value={formData.patient_signature}
          onChange={handleInputChange}
          required
          error={errors.patient_signature}
          helperText="Type your full name as signature"
        />
        <FormField
          label="Printed Name"
          name="patient_printed_name"
          value={formData.patient_printed_name}
          onChange={handleInputChange}
          required
          error={errors.patient_printed_name}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Signature Date"
          name="patient_signature_date"
          type="date"
          value={formData.patient_signature_date}
          onChange={handleInputChange}
          required
          error={errors.patient_signature_date}
        />
        <FormField
          label="Interviewed By"
          name="interviewed_by"
          value={formData.interviewed_by}
          onChange={handleInputChange}
          required
          error={errors.interviewed_by}
        />
      </div>

      <FormField
        label="Interview Date"
        name="interviewed_date"
        type="date"
        value={formData.interviewed_date}
        onChange={handleInputChange}
        required
        error={errors.interviewed_date}
      />
    </div>
  );
};
