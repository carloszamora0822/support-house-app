import { z } from 'zod';

export const medicalInformationSchema = z.object({
  // Diagnosis
  diagnosis_primary: z.string().min(1, 'Primary diagnosis is required'),
  diagnosis_date: z.string().min(1, 'Diagnosis date is required'),
  mets_to: z.string().optional(),
  
  // Oncologists
  oncologist_mercy: z.array(z.string()).default([]),
  oncologist_baptist: z.array(z.string()).default([]),
  oncologist_other: z.string().optional(),
  
  // Radiation Oncologists
  rad_oncologist_mercy: z.string().optional(),
  rad_oncologist_baptist: z.string().optional(),
  rad_oncologist_other: z.string().optional(),
  
  // Other Provider
  provider_other_role: z.string().optional(),
  provider_other_location: z.string().optional(),
  provider_other_city: z.string().optional(),
  provider_other_state: z.string().optional(),
  
  // Surgeon
  surgeon_name: z.string().optional(),
  surgeon_location: z.string().optional(),
  surgeon_city: z.string().optional(),
  surgeon_state: z.string().optional(),
  
  // General Doctor
  general_doctor: z.string().optional(),
  general_location: z.string().optional(),
  general_city: z.string().optional(),
  general_state: z.string().optional(),
  
  // Treatment History
  treatment_surgery_dates: z.string().optional(),
  treatment_chemo_start_1: z.string().optional(),
  treatment_chemo_end_1: z.string().optional(),
  treatment_chemo_start_2: z.string().optional(),
  treatment_chemo_end_2: z.string().optional(),
  treatment_radiation_start: z.string().optional(),
  treatment_radiation_end: z.string().optional(),
  treatment_other: z.string().optional(),
});

export type MedicalInformationInput = z.infer<typeof medicalInformationSchema>;
