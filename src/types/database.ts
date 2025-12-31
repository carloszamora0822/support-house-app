export interface User {
  id: string;
  email: string;
  role: 'admin' | 'staff' | 'viewer';
  full_name: string;
  created_at: string;
  last_login: string | null;
  is_active: boolean;
}

export interface Patient {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  
  first_name: string;
  middle_name: string | null;
  last_name: string;
  goes_by: string | null;
  dob: string;
  age_at_intake: number | null;
  
  email: string | null;
  phone_primary: string | null;
  phone_second: string | null;
  phone_other: string | null;
  
  guardian_name: string | null;
  guardian_relationship: string | null;
  
  address: string | null;
  city: string | null;
  county: string | null;
  state: string | null;
  zip: string | null;
  
  status: 'female' | 'male' | 'child' | null;
  ethnicity: string[] | null;
  ethnicity_other: string | null;
  language: string[] | null;
  language_other: string | null;
  education: string | null;
  
  has_insurance: boolean | null;
  insurance_type: string[] | null;
  is_veteran: boolean | null;
  
  employment_status: string | null;
  employer_name: string | null;
  occupation: string | null;
  home_has_employed: boolean | null;
  
  marital_status: string | null;
  spouse_name: string | null;
  spouse_cell: string | null;
  spouse_work: string | null;
  caregiver_name: string | null;
  caregiver_relation: string | null;
  caregiver_phone: string | null;
  
  diagnosis_primary: string | null;
  diagnosis_date: string | null;
  mets_to: string | null;
  
  oncologist_mercy: string[] | null;
  oncologist_baptist: string[] | null;
  oncologist_other: string | null;
  
  rad_oncologist_mercy: string | null;
  rad_oncologist_baptist: string | null;
  rad_oncologist_other: string | null;
  
  provider_other_role: string | null;
  provider_other_location: string | null;
  provider_other_city: string | null;
  provider_other_state: string | null;
  
  surgeon_name: string | null;
  surgeon_location: string | null;
  surgeon_city: string | null;
  surgeon_state: string | null;
  
  general_doctor: string | null;
  general_location: string | null;
  general_city: string | null;
  general_state: string | null;
  
  treatment_surgery_dates: string | null;
  treatment_chemo_start_1: string | null;
  treatment_chemo_end_1: string | null;
  treatment_chemo_start_2: string | null;
  treatment_chemo_end_2: string | null;
  treatment_radiation_start: string | null;
  treatment_radiation_end: string | null;
  treatment_other: string | null;
  
  initial_visit_date: string | null;
  time_in: string | null;
  time_out: string | null;
  file_updated_date: string | null;
  
  referral_source: string | null;
  referral_other: string | null;
  
  assistance_types: string[] | null;
  assistance_other: string | null;
  
  patient_signature: string | null;
  patient_printed_name: string | null;
  patient_signature_date: string | null;
  interviewed_by: string | null;
  interviewed_date: string | null;
  
  last_visit_date: string | null;
  visit_count: number;
  
  patient_status: 'active' | 'inactive' | 'deceased';
  
  // Medical release tracking
  has_received_medical_release: boolean | null;
  medical_release_sent_date: string | null;
  medical_release_received_date: string | null;
}

export interface Visit {
  id: string;
  patient_id: string;
  visit_type: 'intake' | 'returning' | 'phone' | 'other';
  check_in_timestamp: string;
  check_out_timestamp: string | null;
  staff_user_id: string | null;
  staff_name: string | null;
  assistance_requested: string[] | null;
  assistance_provided: string[] | null;
  assistance_other: string | null;
  visit_notes: string | null;
  created_at: string;
}

export interface MinorChild {
  id: string;
  patient_id: string;
  dob: string;
  sex: 'M' | 'F' | null;
  name: string | null;
  created_at: string;
}

export interface EmergencyContact {
  id: string;
  patient_id: string;
  name: string;
  relationship: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  phone: string | null;
  created_at: string;
}

export interface DisclosureForm {
  id: string;
  patient_id: string;
  fax_form_date: string | null;
  fax_to_office: string | null;
  fax_patient_name: string | null;
  fax_patient_dob: string | null;
  fax_patient_address: string | null;
  fax_patient_city: string | null;
  fax_patient_state: string | null;
  fax_patient_zip: string | null;
  fax_patient_phone: string | null;
  office_patient_diagnosis: string | null;
  office_stage: string | null;
  office_expected_treatments: number | null;
  office_treatment_start_date: string | null;
  office_treatment_end_date: string | null;
  office_chemo_type: string[] | null;
  office_chemo_frequency: string | null;
  office_chemo_every_weeks: number | null;
  office_radiation_frequency: string | null;
  office_radiation_every_weeks: number | null;
  office_status_flags: string[] | null;
  office_staff_signature: string | null;
  office_staff_signature_date: string | null;
  fax_patient_signature: string | null;
  fax_patient_signature_date: string | null;
  fax_patient_printed_name: string | null;
  fax_rep_relationship: string | null;
  created_at: string;
  created_by: string | null;
}

export interface FormSubmission {
  id: string;
  patient_id: string | null;
  form_type: 'intake' | 'disclosure' | 'follow_up';
  status: 'draft' | 'submitted' | 'approved';
  current_step: number;
  submitted_by: string | null;
  submitted_at: string | null;
  form_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
