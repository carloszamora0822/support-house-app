// Type definitions for patient intake form

export interface MinorChild {
  dob: string;
  sex: 'M' | 'F';
  name?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

export interface PatientInformationInput {
  // Identity
  first_name: string;
  middle_name?: string;
  last_name: string;
  goes_by?: string;
  dob: string;
  
  // Contact
  email?: string;
  phone_primary: string;
  phone_second?: string;
  phone_other?: string;
  
  // Address
  address: string;
  city: string;
  county?: string;
  state: string;
  zip: string;
  
  // Demographics
  status: 'female' | 'male' | 'child';
  ethnicity: string[];
  ethnicity_other?: string;
  language: string[];
  language_other?: string;
  education?: string;
  
  // Guardian (conditional - required if status = child)
  guardian_name?: string;
  guardian_relationship?: string;
  
  // Insurance
  has_insurance: boolean;
  insurance_type?: string[];
  is_veteran: boolean;
  
  // Employment
  employment_status?: string;
  employer_name?: string;
  occupation?: string;
  home_has_employed?: boolean;
  
  // Marital (conditional - spouse fields required if married)
  marital_status?: string;
  spouse_name?: string;
  spouse_cell?: string;
  spouse_work?: string;
  
  // Caregiver
  caregiver_name?: string;
  caregiver_relation?: string;
  caregiver_phone?: string;
  
  // Minor children
  minor_children: MinorChild[];
  
  // Emergency contact
  emergency_contact: EmergencyContact;
  
  // Referral
  referral_source: string;
  referral_other?: string;
  
  // Assistance
  assistance_types: string[];
  assistance_other?: string;
  
  // Certification
  patient_signature: string;
  patient_printed_name: string;
  patient_signature_date: string;
  interviewed_by: string;
  interviewed_date: string;
}

export interface FormStep {
  id: number;
  title: string;
  isComplete: boolean;
  isActive: boolean;
}

export interface IntakeFormState {
  currentStep: number;
  totalSteps: number;
  formData: Partial<PatientInformationInput>;
  isDraft: boolean;
  lastSaved?: Date;
}
