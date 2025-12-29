import { supabase } from '@/lib/supabase';

interface IntakeFormData {
  patientData: any;
  medicalData: any;
  disclosureData: any;
}

interface SubmitResult {
  success: boolean;
  data?: any;
  error?: string;
}

export const intakeService = {
  async submitIntakeForm(formData: IntakeFormData): Promise<SubmitResult> {
    try {
      // Create patient record
      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .insert({
          name_first: formData.patientData.name_first,
          name_last: formData.patientData.name_last,
          dob: formData.patientData.dob,
          email: formData.patientData.email,
          phone_primary: formData.patientData.phone_primary,
          address: formData.patientData.address,
          city: formData.patientData.city,
          state: formData.patientData.state,
          zip: formData.patientData.zip,
          visit_count: 1,
          last_visit_date: new Date().toISOString(),
        })
        .select()
        .single();

      if (patientError) {
        return {
          success: false,
          error: `Failed to create patient: ${patientError.message}`,
        };
      }

      // TODO: Create visit, emergency contact, minor children, disclosure records
      // This will be implemented with full transaction logic

      return {
        success: true,
        data: patient,
      };
    } catch (error) {
      return {
        success: false,
        error: `Submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  },
};
