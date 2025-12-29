import React from 'react';
import { FormField } from '@/components/forms/FormField';

interface SignaturesSectionProps {
  formData: {
    office_staff_signature: string;
    office_staff_signature_date: string;
    fax_patient_signature: string;
    fax_patient_signature_date: string;
    fax_patient_printed_name: string;
    fax_rep_relationship?: string;
  };
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

export const SignaturesSection: React.FC<SignaturesSectionProps> = ({
  formData,
  onChange,
  errors,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Signatures</h3>

      <div>
        <h4 className="text-md font-medium text-gray-800 mb-3">Office Staff</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Office Staff Signature"
            name="office_staff_signature"
            value={formData.office_staff_signature}
            onChange={handleInputChange}
            required
            error={errors.office_staff_signature}
          />
          <FormField
            label="Office Staff Signature Date"
            name="office_staff_signature_date"
            type="date"
            value={formData.office_staff_signature_date}
            onChange={handleInputChange}
            required
            error={errors.office_staff_signature_date}
          />
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-800 mb-3">Patient/Representative</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Patient Signature"
            name="fax_patient_signature"
            value={formData.fax_patient_signature}
            onChange={handleInputChange}
            required
            error={errors.fax_patient_signature}
          />
          <FormField
            label="Patient Signature Date"
            name="fax_patient_signature_date"
            type="date"
            value={formData.fax_patient_signature_date}
            onChange={handleInputChange}
            required
            error={errors.fax_patient_signature_date}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField
            label="Patient Printed Name"
            name="fax_patient_printed_name"
            value={formData.fax_patient_printed_name}
            onChange={handleInputChange}
            required
            error={errors.fax_patient_printed_name}
          />
          <FormField
            label="Representative Relationship"
            name="fax_rep_relationship"
            value={formData.fax_rep_relationship || ''}
            onChange={handleInputChange}
            error={errors.fax_rep_relationship}
            helperText="If signed by representative, specify relationship"
          />
        </div>
      </div>
    </div>
  );
};
