-- Patients table - main entity for patient information
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  
  -- Identity
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  goes_by TEXT,
  dob DATE NOT NULL,
  age_at_intake INTEGER,
  
  -- Contact
  email TEXT,
  phone_primary TEXT,
  phone_second TEXT,
  phone_other TEXT,
  
  -- Guardian (if status = child)
  guardian_name TEXT,
  guardian_relationship TEXT,
  
  -- Address
  address TEXT,
  city TEXT,
  county TEXT,
  state TEXT,
  zip TEXT,
  
  -- Demographics
  status TEXT CHECK (status IN ('female', 'male', 'child')),
  ethnicity TEXT[],
  ethnicity_other TEXT,
  language TEXT[],
  language_other TEXT,
  education TEXT,
  
  -- Insurance & Veteran
  has_insurance BOOLEAN,
  insurance_type TEXT[],
  is_veteran BOOLEAN,
  
  -- Employment
  employment_status TEXT,
  employer_name TEXT,
  occupation TEXT,
  home_has_employed BOOLEAN,
  
  -- Marital & Caregiver
  marital_status TEXT,
  spouse_name TEXT,
  spouse_cell TEXT,
  spouse_work TEXT,
  caregiver_name TEXT,
  caregiver_relation TEXT,
  caregiver_phone TEXT,
  
  -- Medical
  diagnosis_primary TEXT,
  diagnosis_date DATE,
  mets_to TEXT,
  
  -- Oncologists
  oncologist_mercy TEXT[],
  oncologist_baptist TEXT[],
  oncologist_other TEXT,
  
  -- Radiation Oncologists
  rad_oncologist_mercy TEXT,
  rad_oncologist_baptist TEXT,
  rad_oncologist_other TEXT,
  
  -- Other Providers
  provider_other_role TEXT,
  provider_other_location TEXT,
  provider_other_city TEXT,
  provider_other_state TEXT,
  
  surgeon_name TEXT,
  surgeon_location TEXT,
  surgeon_city TEXT,
  surgeon_state TEXT,
  
  general_doctor TEXT,
  general_location TEXT,
  general_city TEXT,
  general_state TEXT,
  
  -- Treatment History
  treatment_surgery_dates TEXT,
  treatment_chemo_start_1 DATE,
  treatment_chemo_end_1 DATE,
  treatment_chemo_start_2 DATE,
  treatment_chemo_end_2 DATE,
  treatment_radiation_start DATE,
  treatment_radiation_end DATE,
  treatment_other TEXT,
  
  -- Visits & Tracking
  initial_visit_date DATE,
  time_in TIME,
  time_out TIME,
  file_updated_date DATE,
  
  -- Referral
  referral_source TEXT,
  referral_other TEXT,
  
  -- Assistance Requested
  assistance_types TEXT[],
  assistance_other TEXT,
  
  -- Certification
  patient_signature TEXT,
  patient_printed_name TEXT,
  patient_signature_date DATE,
  interviewed_by TEXT,
  interviewed_date DATE,
  
  -- Visit Tracking (computed/updated)
  last_visit_date DATE,
  visit_count INTEGER DEFAULT 0,
  
  -- Status
  patient_status TEXT DEFAULT 'active' CHECK (patient_status IN ('active', 'inactive', 'deceased'))
);

-- Indexes for common queries
CREATE INDEX idx_patients_diagnosis_primary ON patients(diagnosis_primary);
CREATE INDEX idx_patients_ethnicity ON patients USING GIN(ethnicity);
CREATE INDEX idx_patients_state ON patients(state);
CREATE INDEX idx_patients_diagnosis_date ON patients(diagnosis_date);
CREATE INDEX idx_patients_patient_status ON patients(patient_status);
CREATE INDEX idx_patients_last_visit_date ON patients(last_visit_date);
CREATE INDEX idx_patients_created_at ON patients(created_at);
CREATE INDEX idx_patients_last_name ON patients(last_name);
CREATE INDEX idx_patients_first_name ON patients(first_name);
CREATE INDEX idx_patients_dob ON patients(dob);

-- Enable Row Level Security
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Policy: Staff and admins can read all patients
CREATE POLICY patients_select_staff_admin ON patients
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role IN ('admin', 'staff', 'viewer')
    )
  );

-- Policy: Staff and admins can insert patients
CREATE POLICY patients_insert_staff_admin ON patients
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role IN ('admin', 'staff')
    )
  );

-- Policy: Staff and admins can update patients
CREATE POLICY patients_update_staff_admin ON patients
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role IN ('admin', 'staff')
    )
  );

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
