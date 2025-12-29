import { useState, useEffect, useCallback } from 'react';
import type { PatientInformationInput } from '../types';
import { patientInformationSchema } from '../schemas/patientSchema';
import { formService } from '../../../forms/services/formService';
import { ZodError } from 'zod';

const DRAFT_KEY = 'patient-intake';
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

export const useIntakeForm = () => {
  const [formData, setFormData] = useState<PatientInformationInput>({
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
    status: '' as 'female' | 'male' | 'child',
    ethnicity: [],
    ethnicity_other: '',
    language: [],
    language_other: '',
    education: '',
    guardian_name: '',
    guardian_relationship: '',
    has_insurance: false,
    insurance_type: [],
    is_veteran: false,
    employment_status: '',
    employer_name: '',
    occupation: '',
    home_has_employed: false,
    marital_status: '',
    spouse_name: '',
    spouse_cell: '',
    spouse_work: '',
    caregiver_name: '',
    caregiver_relation: '',
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
    assistance_other: '',
    patient_signature: '',
    patient_printed_name: '',
    patient_signature_date: '',
    interviewed_by: '',
    interviewed_date: '',
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load draft on mount
  useEffect(() => {
    const loadDraft = async () => {
      const draft = await formService.loadDraft<PatientInformationInput>(DRAFT_KEY);
      if (draft) {
        setFormData(draft);
      }
      setIsLoading(false);
    };
    loadDraft();
  }, []);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (isLoading) return;
    
    const interval = setInterval(async () => {
      await formService.saveDraft(DRAFT_KEY, formData);
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [formData, isLoading]);

  const updateField = useCallback(<K extends keyof PatientInformationInput>(
    field: K,
    value: PatientInformationInput[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const validateStep = useCallback(async (step: number): Promise<boolean> => {
    if (step !== 1) {
      return true;
    }

    try {
      await patientInformationSchema.parseAsync(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          const path = err.path.join('.');
          fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  }, [formData]);

  const nextStep = useCallback(async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep(prev => prev + 1);
      await formService.saveDraft(DRAFT_KEY, formData);
    }
  }, [currentStep, validateStep, formData]);

  const previousStep = useCallback(() => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  }, []);

  const saveDraft = useCallback(async () => {
    await formService.saveDraft(DRAFT_KEY, formData);
  }, [formData]);

  const clearDraft = useCallback(() => {
    formService.clearDraft(DRAFT_KEY);
  }, []);

  return {
    formData,
    currentStep,
    errors,
    isLoading,
    updateField,
    validateStep,
    nextStep,
    previousStep,
    saveDraft,
    clearDraft,
  };
};
