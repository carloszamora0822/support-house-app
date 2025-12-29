import React from 'react';
import { FaxHeaderSection } from './Step3_DisclosureAuthorization/FaxHeaderSection';
import { PatientInfoSection } from './Step3_DisclosureAuthorization/PatientInfoSection';
import { MedicalOfficeSection } from './Step3_DisclosureAuthorization/MedicalOfficeSection';
import { ChemoDetailsSection } from './Step3_DisclosureAuthorization/ChemoDetailsSection';
import { RadiationDetailsSection } from './Step3_DisclosureAuthorization/RadiationDetailsSection';
import { SignaturesSection } from './Step3_DisclosureAuthorization/SignaturesSection';
import type { DisclosureAuthorizationInput } from './schemas/disclosureSchema';

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
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Authorization to Disclose</h2>
        <p className="text-gray-600">Fax form for medical office - Patient authorization required</p>
      </div>

      <div className="space-y-8 divide-y divide-gray-200">
        <FaxHeaderSection
          formData={formData}
          onChange={onChange}
          errors={errors}
        />

        <div className="pt-8">
          <PatientInfoSection
            formData={formData}
            onChange={onChange}
            errors={errors}
          />
        </div>

        <div className="pt-8">
          <MedicalOfficeSection
            formData={formData}
            onChange={onChange}
            errors={errors}
          />
        </div>

        <div className="pt-8">
          <ChemoDetailsSection
            formData={formData}
            onChange={onChange}
            errors={errors}
          />
        </div>

        <div className="pt-8">
          <RadiationDetailsSection
            formData={formData}
            onChange={onChange}
            errors={errors}
          />
        </div>

        <div className="pt-8">
          <SignaturesSection
            formData={formData}
            onChange={onChange}
            errors={errors}
          />
        </div>
      </div>
    </div>
  );
};
