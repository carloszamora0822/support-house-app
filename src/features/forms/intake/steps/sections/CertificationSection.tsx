import React from 'react';
import { FormField } from '@/components/forms/FormField';
import { SignatureCanvas } from '@/components/forms/SignatureCanvas';

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
    <div className="space-y-8">
      <h3 className="text-xl md:text-2xl font-semibold text-gray-900">Certification</h3>

      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-6">
        <p className="text-base md:text-lg text-gray-800 font-medium">
          I certify that the information provided in this form is true and accurate to the best of my knowledge.
        </p>
      </div>

      {/* Patient Signature Canvas */}
      <div className="border-2 border-gray-300 rounded-lg p-6 bg-white">
        <SignatureCanvas
          label="Patient Signature"
          value={formData.patient_signature}
          onChange={(sig) => onChange('patient_signature', sig)}
          required
          error={errors.patient_signature}
          width={600}
          height={200}
        />
      </div>

      {/* Patient Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Printed Name"
          name="patient_printed_name"
          value={formData.patient_printed_name}
          onChange={handleInputChange}
          required
          error={errors.patient_printed_name}
          className="text-base md:text-lg p-4"
        />
        <FormField
          label="Signature Date"
          name="patient_signature_date"
          type="date"
          value={formData.patient_signature_date || new Date().toISOString().split('T')[0]}
          onChange={handleInputChange}
          required
          error={errors.patient_signature_date}
          className="text-base md:text-lg p-4"
        />
      </div>

      {/* Staff Info */}
      <div className="border-t-2 border-gray-200 pt-6">
        <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-6">For Staff Use</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Interviewed By (Staff Name)"
            name="interviewed_by"
            value={formData.interviewed_by}
            onChange={handleInputChange}
            required
            error={errors.interviewed_by}
            className="text-base md:text-lg p-4"
          />
          <FormField
            label="Interview Date"
            name="interviewed_date"
            type="date"
            value={formData.interviewed_date || new Date().toISOString().split('T')[0]}
            onChange={handleInputChange}
            required
            error={errors.interviewed_date}
            className="text-base md:text-lg p-4"
          />
        </div>
      </div>
    </div>
  );
};
