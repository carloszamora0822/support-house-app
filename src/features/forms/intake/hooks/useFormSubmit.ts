import { useState } from 'react';
import { intakeService } from '@/features/forms/services/intakeService';

interface FormData {
  patientData: any;
  medicalData: any;
  disclosureData: any;
}

export const useFormSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitForm = async (formData: FormData, onSuccess?: (patientId: string) => void) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await intakeService.submitIntakeForm(formData);

      if (result.success) {
        setSuccess(true);
        if (onSuccess && result.data?.id) {
          onSuccess(result.data.id);
        }
      } else {
        setError(result.error || 'Submission failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setIsSubmitting(false);
    setError(null);
    setSuccess(false);
  };

  return {
    isSubmitting,
    error,
    success,
    submitForm,
    reset,
  };
};
