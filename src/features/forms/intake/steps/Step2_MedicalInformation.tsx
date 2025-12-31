import React from 'react';
import { DiagnosisSection } from './Step2_MedicalInformation/DiagnosisSection';
import { PhysiciansSection } from './Step2_MedicalInformation/PhysiciansSection';
import { TreatmentHistorySection } from './Step2_MedicalInformation/TreatmentHistorySectionNew';
import type { MedicalInformationInput } from '../schemas/medicalSchema';
import type { Surgery, ChemoCycle, RadiationTreatment, SelectedPhysician, CustomPhysician } from '../types';

interface Step2Props {
  formData: MedicalInformationInput;
  onChange: (field: string, value: string | string[] | Surgery[] | ChemoCycle[] | RadiationTreatment[] | SelectedPhysician[] | CustomPhysician[]) => void;
  errors: Record<string, string>;
}

export const Step2_MedicalInformation: React.FC<Step2Props> = ({
  formData,
  onChange,
  errors,
}) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Medical Information</h2>
        <p className="text-gray-600">Staff use only - Complete medical history and provider details</p>
      </div>

      <div className="space-y-8 divide-y divide-gray-200">
        <DiagnosisSection
          formData={formData}
          onChange={onChange}
          errors={errors}
        />

        <div className="pt-8">
          <PhysiciansSection
            formData={formData}
            onChange={onChange}
            errors={errors}
          />
        </div>

        <div className="pt-8">
          <TreatmentHistorySection
            formData={formData}
            onChange={onChange}
            errors={errors}
          />
        </div>
      </div>
    </div>
  );
};
