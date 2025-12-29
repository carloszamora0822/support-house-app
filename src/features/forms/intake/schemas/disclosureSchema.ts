import { z } from 'zod';

export const disclosureAuthorizationSchema = z.object({
  // Fax Header
  fax_form_date: z.string().min(1, 'Fax form date is required'),
  fax_to_office: z.string().min(1, 'Fax to office is required'),
  
  // Patient Info (auto-filled from Step 1)
  fax_patient_name: z.string().min(1, 'Patient name is required'),
  fax_patient_dob: z.string().min(1, 'Patient DOB is required'),
  fax_patient_address: z.string().min(1, 'Patient address is required'),
  fax_patient_city: z.string().min(1, 'Patient city is required'),
  fax_patient_state: z.string().min(1, 'Patient state is required'),
  fax_patient_zip: z.string().min(1, 'Patient ZIP is required'),
  fax_patient_phone: z.string().min(1, 'Patient phone is required'),
  
  // Medical Office Staff Section
  office_patient_diagnosis: z.string().min(1, 'Diagnosis is required'),
  office_stage: z.string().optional(),
  office_expected_treatments: z.number().optional(),
  office_treatment_start_date: z.string().optional(),
  office_treatment_end_date: z.string().optional(),
  
  // Chemo Details
  office_chemo_type: z.array(z.string()).optional(),
  office_chemo_frequency: z.string().optional(),
  office_chemo_every_weeks: z.number().optional(),
  
  // Radiation Details
  office_radiation_frequency: z.string().optional(),
  office_radiation_every_weeks: z.number().optional(),
  
  // Status Flags
  office_status_flags: z.array(z.string()).optional(),
  
  // Signatures
  office_staff_signature: z.string().min(1, 'Office staff signature is required'),
  office_staff_signature_date: z.string().min(1, 'Office staff signature date is required'),
  fax_patient_signature: z.string().min(1, 'Patient signature is required'),
  fax_patient_signature_date: z.string().min(1, 'Patient signature date is required'),
  fax_patient_printed_name: z.string().min(1, 'Patient printed name is required'),
  fax_rep_relationship: z.string().optional(),
});

export type DisclosureAuthorizationInput = z.infer<typeof disclosureAuthorizationSchema>;
