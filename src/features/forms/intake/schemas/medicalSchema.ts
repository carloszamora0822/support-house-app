import { z } from 'zod';

// Treatment history schemas
const surgerySchema = z.object({
  date: z.string().min(1, 'Surgery date is required'),
  notes: z.string().optional(),
});

const chemoCycleSchema = z.object({
  start_date: z.string().min(1, 'Chemo start date is required'),
  end_date: z.string().min(1, 'Chemo end date is required'),
  notes: z.string().optional(),
});

const radiationTreatmentSchema = z.object({
  start_date: z.string().min(1, 'Radiation start date is required'),
  end_date: z.string().min(1, 'Radiation end date is required'),
  notes: z.string().optional(),
});

// Physician schemas
const selectedPhysicianSchema = z.object({
  name: z.string(),
  location: z.string(),
  phone: z.string(),
  fax: z.string(),
});

const customPhysicianSchema = z.object({
  name: z.string().min(1, 'Physician name is required'),
  location: z.string().min(1, 'Location is required'),
  phone: z.string().optional(),
  fax: z.string().optional(),
});

export const medicalInformationSchema = z.object({
  // Diagnosis
  diagnosis_primary: z.string().min(1, 'Primary diagnosis is required'),
  diagnosis_date: z.string().min(1, 'Diagnosis date is required'),
  mets_to: z.string().optional(),
  
  // Physicians (consolidated structure)
  mercy_oncologists: z.array(selectedPhysicianSchema).default([]),
  mercy_radiation: z.array(selectedPhysicianSchema).default([]),
  baptist_oncologists: z.array(selectedPhysicianSchema).default([]),
  baptist_radiation: z.array(selectedPhysicianSchema).default([]),
  custom_physicians: z.array(customPhysicianSchema).default([]),
  
  // Treatment History (dynamic arrays)
  surgeries: z.array(surgerySchema).default([]),
  chemo_cycles: z.array(chemoCycleSchema).default([]),
  radiation_treatments: z.array(radiationTreatmentSchema).default([]),
  treatment_other: z.string().optional(),
});

export type MedicalInformationInput = z.infer<typeof medicalInformationSchema>;
