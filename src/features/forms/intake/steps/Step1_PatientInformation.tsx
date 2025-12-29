import React from 'react';
import { PatientIdentitySection } from './sections/PatientIdentitySection';
import { DemographicsSection } from './sections/DemographicsSection';
import { InsuranceSection } from './sections/InsuranceSection';
import { EmploymentSection } from './sections/EmploymentSection';
import { MaritalStatusSection } from './sections/MaritalStatusSection';
import { MinorChildrenSection } from './sections/MinorChildrenSection';
import { EmergencyContactSection } from './sections/EmergencyContactSection';
import { ReferralSection } from './sections/ReferralSection';
import { CertificationSection } from './sections/CertificationSection';

interface Step1Props {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export const Step1_PatientInformation: React.FC<Step1Props> = ({
  formData,
  onChange,
  errors,
}) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient Information</h2>
        <p className="text-gray-600">Complete patient registration form</p>
      </div>

      <div className="space-y-8 divide-y divide-gray-200">
        <PatientIdentitySection
          formData={formData}
          onChange={onChange}
          errors={errors}
        />

        <div className="pt-8">
          <DemographicsSection
            formData={formData}
            onChange={onChange}
            errors={errors}
          />
        </div>

        <div className="pt-8">
          <InsuranceSection
            formData={formData}
            onChange={onChange}
            errors={errors}
          />
        </div>

        <div className="pt-8">
          <EmploymentSection
            formData={formData}
            onChange={onChange}
            errors={errors}
          />
        </div>

        <div className="pt-8">
          <MaritalStatusSection
            formData={formData}
            onChange={onChange}
            errors={errors}
          />
        </div>

        <div className="pt-8">
          <MinorChildrenSection
            formData={formData}
            onChange={onChange}
            errors={errors}
          />
        </div>

        <div className="pt-8">
          <EmergencyContactSection
            formData={formData}
            onChange={onChange}
            errors={errors}
          />
        </div>

        <div className="pt-8">
          <ReferralSection
            formData={formData}
            onChange={onChange}
            errors={errors}
          />
        </div>

        <div className="pt-8">
          <CertificationSection
            formData={formData}
            onChange={onChange}
            errors={errors}
          />
        </div>
      </div>
    </div>
  );
};
