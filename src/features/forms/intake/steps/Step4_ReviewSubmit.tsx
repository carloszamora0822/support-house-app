import React from 'react';
import { AssistanceTrackingSection } from '@/features/assistance/AssistanceTrackingSection';
import type { AssistanceItemInput } from '@/services/assistanceItemService';

interface Step4Props {
  patientData: any;
  medicalData: any;
  disclosureData: any;
  assistanceItems: AssistanceItemInput[];
  onAssistanceChange: (items: AssistanceItemInput[]) => void;
  onSubmit: () => void;
  onEdit: (step: number) => void;
  isSubmitting: boolean;
}

export const Step4_ReviewSubmit: React.FC<Step4Props> = ({
  patientData,
  medicalData,
  disclosureData,
  assistanceItems,
  onAssistanceChange,
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

        {/* Assistance Tracking */}
        <div>
          <AssistanceTrackingSection
            items={assistanceItems}
            onChange={onAssistanceChange}
            title="Initial Assistance Provided"
            description="Track items and services provided during intake"
          />
        </div>
      </div>

      {/* Note: Submit button is in the navigation bar below */}
      <div className="pt-6 border-t">
        <p className="text-sm text-gray-600 text-center">
          Click the "Submit Intake Form" button below to complete the intake process.
        </p>
      </div>
    </div>
  );
};
