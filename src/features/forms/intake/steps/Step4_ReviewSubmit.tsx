import React from 'react';

interface Step4Props {
  patientData: any;
  medicalData: any;
  disclosureData: any;
  onSubmit: () => void;
  onEdit: (step: number) => void;
  isSubmitting: boolean;
}

export const Step4_ReviewSubmit: React.FC<Step4Props> = ({
  patientData,
  medicalData,
  disclosureData,
  onSubmit,
  onEdit,
  isSubmitting,
}) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h2>
        <p className="text-gray-600">Please review all information before submitting</p>
      </div>

      <div className="space-y-6">
        {/* Patient Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Name:</span> {patientData.name_first} {patientData.name_last}
            </div>
            <div>
              <span className="font-medium">DOB:</span> {patientData.dob}
            </div>
            <div>
              <span className="font-medium">Email:</span> {patientData.email}
            </div>
          </div>
          <button
            onClick={() => onEdit(1)}
            className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit Patient Info
          </button>
        </div>

        {/* Medical Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Diagnosis:</span> {medicalData.diagnosis_primary}
            </div>
            <div>
              <span className="font-medium">Date:</span> {medicalData.diagnosis_date}
            </div>
          </div>
          <button
            onClick={() => onEdit(2)}
            className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit Medical Info
          </button>
        </div>

        {/* Disclosure Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Disclosure Authorization</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Fax To:</span> {disclosureData.fax_to_office}
            </div>
            <div>
              <span className="font-medium">Diagnosis:</span> {disclosureData.office_patient_diagnosis}
            </div>
          </div>
          <button
            onClick={() => onEdit(3)}
            className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit Disclosure Info
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-6 border-t">
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Intake Form'}
        </button>
      </div>
    </div>
  );
};
