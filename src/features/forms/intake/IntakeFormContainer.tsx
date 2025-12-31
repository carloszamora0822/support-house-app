import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Step1_PatientInformation } from './steps/Step1_PatientInformation';
import { Step2_MedicalInformation } from './steps/Step2_MedicalInformation';
import { Step3_DisclosureAuthorization } from './steps/Step3_DisclosureAuthorization';
import { Step4_ReviewSubmit } from './steps/Step4_ReviewSubmit';
import { useFormSubmit } from './hooks/useFormSubmit';
import { PageShell } from '@/components/patterns/page-shell';
import { AppHeader } from '@/components/patterns/app-header';
import { PageContent } from '@/components/patterns/page-content';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { notify } from '@/lib/services';
import { ArrowLeft } from 'lucide-react';
import type { Surgery, ChemoCycle, RadiationTreatment, SelectedPhysician, CustomPhysician } from './types';
import type { AssistanceItemInput } from '@/services/assistanceItemService';

export const IntakeFormContainer = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    patientData: {
      first_name: '',
      middle_name: '',
      last_name: '',
      goes_by: '',
      dob: '',
      email: '',
      phone_primary: '',
      phone_second: '',
      phone_other: '',
      address: '',
      city: '',
      county: '',
      state: '',
      zip: '',
      status: 'female',  // Fixed field name
      ethnicity: [],
      ethnicity_other: '',  // Added missing field
      language: [],
      language_other: '',  // Added missing field
      education: '',
      guardian_name: '',
      guardian_relationship: '',
      has_insurance: false,  // Fixed field name
      insurance_type: [],  // Fixed field name
      is_veteran: false,  // Fixed field name
      employment_status: '',
      employer_name: '',  // Fixed field name
      occupation: '',
      home_has_employed: false,
      marital_status: '',
      spouse_name: '',
      spouse_cell: '',  // Added missing field
      spouse_work: '',  // Added missing field
      caregiver_name: '',
      caregiver_relation: '',  // Fixed field name
      caregiver_phone: '',
      minor_children: [],
      emergency_contact: {
        name: '',
        relationship: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
      },
      referral_source: '',
      referral_other: '',
      assistance_types: [],
      assistance_other: '',  // Added missing field
      assistanceItems: [] as AssistanceItemInput[],  // Detailed assistance tracking
      patient_signature: '',
      patient_printed_name: '',
      patient_signature_date: '',  // Fixed field name
      interviewed_by: '',
      interviewed_date: '',  // Added missing field
    },
    medicalData: {
      diagnosis_primary: '',
      diagnosis_date: '',
      mercy_oncologists: [],
      mercy_radiation: [],
      baptist_oncologists: [],
      baptist_radiation: [],
      custom_physicians: [],
      surgeries: [],
      chemo_cycles: [],
      radiation_treatments: [],
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

  // Listen for mock data fill event (development only)
  useEffect(() => {
    const handleFillMockData = (event: CustomEvent) => {
      const { patientData, medicalData, disclosureData } = event.detail;
      setFormData({
        patientData,
        medicalData,
        disclosureData,
      });
      console.log('✅ Form filled with mock data!');
    };

    window.addEventListener('fillMockData', handleFillMockData as EventListener);
    return () => {
      window.removeEventListener('fillMockData', handleFillMockData as EventListener);
    };
  }, []);

  const handleFieldChange = (step: 'patientData' | 'medicalData' | 'disclosureData') => 
    (field: string, value: string | string[] | boolean | number | Surgery[] | ChemoCycle[] | RadiationTreatment[] | SelectedPhysician[] | CustomPhysician[] | Record<string, string | string[] | boolean | number>) => {
      setFormData((prev) => ({
        ...prev,
        [step]: {
          ...prev[step],
          [field]: value,
        },
      }));
    };

  const handleNext = async () => {
    if (currentStep < 4) {
      // Log current step data
      console.log('=== FORM DATA PAYLOAD ===');
      console.log(`Step ${currentStep} Data:`, 
        currentStep === 1 ? formData.patientData : 
        currentStep === 2 ? formData.medicalData : 
        formData.disclosureData
      );
      console.log('Complete Form Data:', formData);
      console.log('========================');
      
      // Validate current step before proceeding
      let isValid = true;
      
      if (currentStep === 1) {
        // Validate Step 1 using patient schema
        const { patientInformationSchema } = await import('./schemas/patientSchema');
        try {
          await patientInformationSchema.parseAsync(formData.patientData);
          console.log('✅ Step 1 validation passed');
        } catch (error) {
          console.error('❌ Step 1 validation failed:', error);
          notify.error('Please complete all required fields before proceeding');
          isValid = false;
        }
      } else if (currentStep === 2) {
        // Validate Step 2 using medical schema
        const { medicalInformationSchema } = await import('./schemas/medicalSchema');
        try {
          await medicalInformationSchema.parseAsync(formData.medicalData);
          console.log('✅ Step 2 validation passed');
        } catch (error) {
          console.error('❌ Step 2 validation failed:', error);
          notify.error('Please complete all required medical information');
          isValid = false;
        }
      } else if (currentStep === 3) {
        // Validate Step 3 using disclosure schema
        const { disclosureAuthorizationSchema } = await import('./schemas/disclosureSchema');
        try {
          await disclosureAuthorizationSchema.parseAsync(formData.disclosureData);
          console.log('✅ Step 3 validation passed');
        } catch (error) {
          console.error('❌ Step 3 validation failed:', error);
          notify.error('Please complete all required disclosure fields');
          isValid = false;
        }
      }
      
      if (!isValid) {
        return;
      }
      
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
    console.log('=== FINAL SUBMISSION PAYLOAD ===');
    console.log('Patient Data:', formData.patientData);
    console.log('Medical Data:', formData.medicalData);
    console.log('Disclosure Data:', formData.disclosureData);
    console.log('Complete Payload:', JSON.stringify(formData, null, 2));
    console.log('================================');
    
    try {
      await submitForm(formData, () => {
        notify.success('Patient intake completed successfully!');
        navigate('/dashboard');
      });
    } catch (error) {
      console.error('❌ Submission failed:', error);
      notify.error(error instanceof Error ? error.message : 'Failed to submit intake form');
    }
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
            assistanceItems={formData.patientData.assistanceItems}
            onAssistanceChange={(items) => {
              setFormData(prev => ({
                ...prev,
                patientData: {
                  ...prev.patientData,
                  assistanceItems: items
                }
              }));
            }}
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
    <PageShell variant="gradient">
      <AppHeader />
      <PageContent maxWidth="xl">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <Card className="mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-lg text-text">New Patient Intake</h2>
            <div className="text-body-lg text-text-muted">Step {currentStep} of 4</div>
          </div>
          <div className="mt-6 flex gap-3">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex-1 h-3 md:h-4 rounded-full ${
                  step <= currentStep ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3 text-caption text-text-muted font-medium">
            <span className="text-center">Patient Info</span>
            <span className="text-center">Medical Info</span>
            <span className="text-center">Disclosure</span>
            <span className="text-center">Review</span>
          </div>
        </Card>

        <Card className="mb-8">{renderStep()}</Card>

        <div className="flex justify-between gap-4">
          {currentStep > 1 && (
            <Button 
              variant="outline" 
              onClick={handleBack}
              size="lg"
            >
              ← Back
            </Button>
          )}
          <div className="ml-auto">
            {currentStep < 4 ? (
              <Button 
                onClick={handleNext}
                size="lg"
              >
                Next →
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                loading={isSubmitting}
                size="lg"
                className="bg-status-success hover:bg-status-success-dark"
              >
                {isSubmitting ? 'Submitting...' : '✓ Submit Intake Form'}
              </Button>
            )}
          </div>
        </div>
      </PageContent>
    </PageShell>
  );
};
