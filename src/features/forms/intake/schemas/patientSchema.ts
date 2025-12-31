import { z } from 'zod';

// Phone number regex - validates proper 10-digit US phone format
// Accepts formats: (555) 123-4567, 555-123-4567, 555.123.4567, 5551234567
const phoneRegex = /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;

// ZIP code regex - accepts 5 digits or ZIP+4
const zipRegex = /^\d{5}(-\d{4})?$/;

// Minor child schema
const minorChildSchema = z.object({
  dob: z.string().min(1, 'Date of birth is required'),
  sex: z.enum(['M', 'F'], { required_error: 'Sex is required' }),
  name: z.string().optional(),
});

// Emergency contact schema - all fields optional but validate format if provided
const emergencyContactSchema = z.object({
  name: z.string().optional().or(z.literal('')),
  relationship: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  state: z.string().optional().or(z.literal('')),
  zip: z.string().optional().or(z.literal('')).refine((val) => !val || zipRegex.test(val), 'Invalid ZIP code format'),
  phone: z.string().optional().or(z.literal('')).refine((val) => !val || phoneRegex.test(val), 'Invalid phone number'),
});

// Base patient information schema
export const patientInformationSchema = z.object({
  // Identity
  first_name: z.string().min(1, 'First name is required'),
  middle_name: z.string().optional(),
  last_name: z.string().min(1, 'Last name is required'),
  goes_by: z.string().optional(),
  dob: z.string().min(1, 'Date of birth is required').refine((date) => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime()) && parsed <= new Date();
  }, 'Date of birth must be a valid date in the past'),
  
  // Contact
  email: z.string().optional().or(z.literal('')).refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), 'Invalid email format'),
  phone_primary: z.string().min(1, 'Primary phone is required').refine((val) => phoneRegex.test(val), 'Invalid phone number format (use: 555-123-4567)'),
  phone_second: z.string().optional().or(z.literal('')).refine((val) => !val || phoneRegex.test(val), 'Invalid phone number format'),
  phone_other: z.string().optional().or(z.literal('')).refine((val) => !val || phoneRegex.test(val), 'Invalid phone number format'),
  
  // Address
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  county: z.string().optional(),
  state: z.string().min(1, 'State is required'),
  zip: z.string().regex(zipRegex, 'Invalid ZIP code format'),
  
  // Demographics
  status: z.enum(['female', 'male', 'child'], { required_error: 'Status is required' }),
  ethnicity: z.array(z.string()).default([]),
  ethnicity_other: z.string().optional(),
  language: z.array(z.string()).default([]),
  language_other: z.string().optional(),
  education: z.string().optional(),
  
  // Guardian (conditional)
  guardian_name: z.string().optional(),
  guardian_relationship: z.string().optional(),
  
  // Insurance
  has_insurance: z.boolean().default(false),
  insurance_type: z.array(z.string()).optional(),
  is_veteran: z.boolean().default(false),
  
  // Employment
  employment_status: z.string().optional(),
  employer_name: z.string().optional(),
  occupation: z.string().optional(),
  home_has_employed: z.boolean().optional(),
  
  // Marital
  marital_status: z.string().optional(),
  spouse_name: z.string().optional(),
  spouse_cell: z.string().optional(),
  spouse_work: z.string().optional(),
  
  // Caregiver
  caregiver_name: z.string().optional(),
  caregiver_relation: z.string().optional(),
  caregiver_phone: z.string().optional(),
  
  // Minor children
  minor_children: z.array(minorChildSchema).default([]),
  
  // Emergency contact
  emergency_contact: emergencyContactSchema,
  
  // Referral
  referral_source: z.string().optional().or(z.literal('')),
  referral_other: z.string().optional(),
  
  // Assistance
  assistance_types: z.array(z.string()).default([]),
  assistance_other: z.string().optional(),
  
  // Certification - optional for step 1, can be filled later
  patient_signature: z.string().optional().or(z.literal('')),
  patient_printed_name: z.string().optional().or(z.literal('')),
  patient_signature_date: z.string().optional().or(z.literal('')),
  interviewed_by: z.string().optional().or(z.literal('')),
  interviewed_date: z.string().optional().or(z.literal('')),
}).refine((data) => {
  // Conditional validation: guardian required if status is child
  if (data.status === 'child') {
    return !!data.guardian_name && !!data.guardian_relationship;
  }
  return true;
}, {
  message: 'Guardian information is required when status is child',
  path: ['guardian_name'],
}).refine((data) => {
  // Conditional validation: spouse name required if married
  if (data.marital_status === 'married') {
    return !!data.spouse_name;
  }
  return true;
}, {
  message: 'Spouse name is required when marital status is married',
  path: ['spouse_name'],
});

export type PatientInformationFormData = z.infer<typeof patientInformationSchema>;
