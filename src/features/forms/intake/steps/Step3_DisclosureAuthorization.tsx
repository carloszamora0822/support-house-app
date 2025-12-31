import React from 'react';
import { FormField } from '@/components/forms/FormField';
import { SignatureCanvas } from '@/components/forms/SignatureCanvas';
import { Button } from '@/components/common/Button';
import { pdfService } from '../../services/pdfService';
import { PDF_CONSTANTS } from '@/constants/pdfConstants';
import toast from 'react-hot-toast';
import type { DisclosureAuthorizationInput } from '../schemas/disclosureSchema';

interface Step3Props {
  formData: DisclosureAuthorizationInput;
  onChange: (field: string, value: string | string[] | number) => void;
  errors: Record<string, string>;
}

export const Step3_DisclosureAuthorization: React.FC<Step3Props> = ({
  formData,
  onChange,
  errors,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(e.target.name, e.target.value);
  };

  const handleGeneratePDF = async () => {
    try {
      const blob = await pdfService.generateDisclosurePDF(formData);
      const patientName = formData.fax_patient_name || 'Patient';
      pdfService.downloadPDF(blob, patientName);
      toast.success('PDF generated successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF');
      console.error('PDF generation error:', error);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Authorization to Disclose</h2>
        <p className="text-base md:text-lg text-gray-700 mb-3">
          This form authorizes Support House to coordinate with your medical providers.
        </p>
        <p className="text-sm text-gray-600">
          <strong>Fax Number:</strong> {PDF_CONSTANTS.FAX_NUMBER}
        </p>
      </div>

      {/* Auto-populated Patient Info (Read-only) */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Patient Information (Auto-filled)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
          <div>
            <span className="font-medium text-gray-700">Name:</span>
            <span className="ml-2 text-gray-900">{formData.fax_patient_name}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">DOB:</span>
            <span className="ml-2 text-gray-900">{formData.fax_patient_dob}</span>
          </div>
          <div className="md:col-span-2">
            <span className="font-medium text-gray-700">Address:</span>
            <span className="ml-2 text-gray-900">
              {formData.fax_patient_address}, {formData.fax_patient_city}, {formData.fax_patient_state} {formData.fax_patient_zip}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Phone:</span>
            <span className="ml-2 text-gray-900">{formData.fax_patient_phone}</span>
          </div>
        </div>
      </div>

      {/* Minimal Additional Info Needed */}
      <div className="space-y-6">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900">Additional Information</h3>
        
        {/* Fax Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Today's Date"
            name="fax_form_date"
            type="date"
            value={formData.fax_form_date || new Date().toISOString().split('T')[0]}
            onChange={handleChange}
            required
            error={errors.fax_form_date}
            className="text-base md:text-lg p-4"
          />
          <FormField
            label="Fax To (Medical Office)"
            name="fax_to_office"
            value={formData.fax_to_office || ''}
            onChange={handleChange}
            required
            error={errors.fax_to_office}
            placeholder="e.g., Dr. Smith's Office"
            className="text-base md:text-lg p-4"
          />
        </div>

        {/* Medical Info from Doctor */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
          <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-4">For Medical Office Staff to Complete</h4>
          <div className="space-y-4">
            <FormField
              label="Primary Diagnosis"
              name="office_patient_diagnosis"
              value={formData.office_patient_diagnosis || ''}
              onChange={handleChange}
              required
              error={errors.office_patient_diagnosis}
              placeholder="e.g., Breast Cancer"
              className="text-base md:text-lg p-4"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Cancer Stage (Optional)"
                name="office_stage"
                value={formData.office_stage || ''}
                onChange={handleChange}
                error={errors.office_stage}
                placeholder="e.g., Stage II"
                className="text-base md:text-lg p-4"
              />
              <FormField
                label="Treatment Start Date (Optional)"
                name="office_treatment_start_date"
                type="date"
                value={formData.office_treatment_start_date || ''}
                onChange={handleChange}
                error={errors.office_treatment_start_date}
                className="text-base md:text-lg p-4"
              />
            </div>
          </div>
        </div>

        {/* Patient Signature */}
        <div className="border-2 border-gray-300 rounded-lg p-6 bg-white">
          <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Patient Authorization</h4>
          <p className="text-sm md:text-base text-gray-700 mb-6">
            By signing below, I authorize Support House to obtain and share my protected health information for coordinating cancer support services.
          </p>
          
          <div className="space-y-6">
            <SignatureCanvas
              label="Patient Signature"
              value={formData.fax_patient_signature}
              onChange={(sig) => onChange('fax_patient_signature', sig)}
              required
              error={errors.fax_patient_signature}
              width={600}
              height={200}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Printed Name"
                name="fax_patient_printed_name"
                value={formData.fax_patient_printed_name || ''}
                onChange={handleChange}
                required
                error={errors.fax_patient_printed_name}
                className="text-base md:text-lg p-4"
              />
              <FormField
                label="Date Signed"
                name="fax_patient_signature_date"
                type="date"
                value={formData.fax_patient_signature_date || new Date().toISOString().split('T')[0]}
                onChange={handleChange}
                required
                error={errors.fax_patient_signature_date}
                className="text-base md:text-lg p-4"
              />
            </div>
          </div>
        </div>

        {/* Office Staff Signature */}
        <div className="border-2 border-gray-300 rounded-lg p-6 bg-white">
          <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-4">For Office Staff</h4>
          
          <div className="space-y-6">
            <SignatureCanvas
              label="Staff Signature"
              value={formData.office_staff_signature}
              onChange={(sig) => onChange('office_staff_signature', sig)}
              required
              error={errors.office_staff_signature}
              width={600}
              height={200}
            />
            
            <FormField
              label="Date"
              name="office_staff_signature_date"
              type="date"
              value={formData.office_staff_signature_date || new Date().toISOString().split('T')[0]}
              onChange={handleChange}
              required
              error={errors.office_staff_signature_date}
              className="text-base md:text-lg p-4"
            />
          </div>
        </div>

        {/* Generate PDF Button */}
        <div className="flex justify-center pt-6">
          <Button
            type="button"
            onClick={handleGeneratePDF}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-base md:text-lg font-semibold rounded-lg shadow-lg"
          >
            📄 Generate & Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
};
