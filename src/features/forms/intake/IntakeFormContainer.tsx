import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Step1_PatientInformation } from './steps/Step1_PatientInformation';
import { Step2_MedicalInformation } from './steps/Step2_MedicalInformation';
import { Step3_DisclosureAuthorization } from './steps/Step3_DisclosureAuthorization';
import { Step4_ReviewSubmit } from './steps/Step4_ReviewSubmit';
import { useFormSubmit } from './hooks/useFormSubmit';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import toast from 'react-hot-toast';

export const IntakeFormContainer = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    patientData: {
      first_name: '',
      last_name: '',
      dob: '',
      phone_primary: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      patient_status: 'female',
      ethnicity: [],
      language: [],
      insurance: false,
      veteran: false,
      marital_status: '',
      minor_children_count: 0,
      minor_children: [],
      employment_status: '',
      referral_source: '',
      emergency_contact: {
        name: '',
        relationship: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
      },
    },
    medicalData: {
      diagnosis_primary: '',
      diagnosis_date: '',
      oncologist_mercy: [],
      oncologist_baptist: [],
      rad_oncologist_mercy: '',
      rad_oncologist_baptist: '',
    },
    disclosureData: {
      fax_form_date: '',
      fax_to_office: '',
      fax_patient_name: '',
      fax_patient_dob: '',
      fax_patient_address: '',
      fax_patient_city: '',
      fax_patient_state: '',
      fax_patient_zip: '',
      fax_patient_phone: '',
      office_patient_diagnosis: '',
      office_staff_signature: '',
      office_staff_signature_date: '',
      fax_patient_signature: '',
      fax_patient_signature_date: '',
      fax_patient_printed_name: '',
    },
  });
  const [errors] = useState<Record<string, string>>({});
  const { isSubmitting, submitForm } = useFormSubmit();

  const handleFieldChange = (step: 'patientData' | 'medicalData' | 'disclosureData') => 
    (field: string, value: any) => {
      setFormData((prev) => ({
        ...prev,
        [step]: {
          ...prev[step],
          [field]: value,
        },
      }));
    };

  const handleNext = () => {
    if (currentStep < 4) {
      // Auto-fill Step 3 patient info from Step 1 when moving to Step 3
      if (currentStep === 2) {
        setFormData((prev) => ({
          ...prev,
          disclosureData: {
            ...prev.disclosureData,
            fax_patient_name: `${prev.patientData.first_name || ''} ${prev.patientData.last_name || ''}`.trim(),
            fax_patient_dob: prev.patientData.dob || '',
            fax_patient_address: prev.patientData.address || '',
            fax_patient_city: prev.patientData.city || '',
            fax_patient_state: prev.patientData.state || '',
            fax_patient_zip: prev.patientData.zip || '',
            fax_patient_phone: prev.patientData.phone_primary || '',
          },
        }));
      }
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleEdit = (step: number) => {
    setCurrentStep(step);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    await submitForm(formData, (patientId) => {
      toast.success(`Patient created successfully! ID: ${patientId}`);
      navigate(`/patients/${patientId}`);
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1_PatientInformation
            formData={formData.patientData}
            onChange={handleFieldChange('patientData')}
            errors={errors}
          />
        );
      case 2:
        return (
          <Step2_MedicalInformation
            formData={formData.medicalData}
            onChange={handleFieldChange('medicalData')}
            errors={errors}
          />
        );
      case 3:
        return (
          <Step3_DisclosureAuthorization
            formData={formData.disclosureData}
            onChange={handleFieldChange('disclosureData')}
            errors={errors}
          />
        );
      case 4:
        return (
          <Step4_ReviewSubmit
            patientData={formData.patientData}
            medicalData={formData.medicalData}
            disclosureData={formData.disclosureData}
            onSubmit={handleSubmit}
            onEdit={handleEdit}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">New Patient Intake</h2>
            <div className="text-sm text-gray-600">Step {currentStep} of 4</div>
          </div>
          <div className="mt-4 flex gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex-1 h-2 rounded-full ${
                  step <= currentStep ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-600">
            <span>Patient Info</span>
            <span>Medical Info</span>
            <span>Disclosure</span>
            <span>Review</span>
          </div>
        </Card>

        {/* Step Content */}
        <Card className="mb-6">{renderStep()}</Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          {currentStep > 1 && (
            <Button variant="outline" onClick={handleBack}>
              ← Back
            </Button>
          )}
          <div className="ml-auto">
            {currentStep < 4 ? (
              <Button onClick={handleNext} className="bg-purple-600 hover:bg-purple-700">
                Next →
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Intake Form'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
