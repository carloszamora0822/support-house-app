-- Disclosure forms table (one-to-many with patients)
CREATE TABLE IF NOT EXISTS disclosure_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  
  -- Fax Header
  fax_form_date DATE,
  fax_to_office TEXT,
  
  -- Patient Info (snapshot for form)
  fax_patient_name TEXT,
  fax_patient_dob DATE,
  fax_patient_address TEXT,
  fax_patient_city TEXT,
  fax_patient_state TEXT,
  fax_patient_zip TEXT,
  fax_patient_phone TEXT,
  
  -- Medical Office Staff Section
  office_patient_diagnosis TEXT,
  office_stage TEXT,
  office_expected_treatments INTEGER,
  office_treatment_start_date DATE,
  office_treatment_end_date DATE,
  
  -- Chemo Treatment
  office_chemo_type TEXT[],
  office_chemo_frequency TEXT,
  office_chemo_every_weeks INTEGER,
  
  -- Radiation Treatment
  office_radiation_frequency TEXT,
  office_radiation_every_weeks INTEGER,
  
  -- Status Flags
  office_status_flags TEXT[],
  
  -- Office Staff Signature
  office_staff_signature TEXT,
  office_staff_signature_date DATE,
  
  -- Patient Signature
  fax_patient_signature TEXT,
  fax_patient_signature_date DATE,
  fax_patient_printed_name TEXT,
  fax_rep_relationship TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Indexes
CREATE INDEX idx_disclosure_forms_patient_id ON disclosure_forms(patient_id);
CREATE INDEX idx_disclosure_forms_created_at ON disclosure_forms(created_at);

-- Enable Row Level Security
ALTER TABLE disclosure_forms ENABLE ROW LEVEL SECURITY;

-- Policy: Staff and admins can read all disclosure forms
CREATE POLICY disclosure_forms_select_staff_admin ON disclosure_forms
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role IN ('admin', 'staff', 'viewer')
    )
  );

-- Policy: Staff and admins can insert disclosure forms
CREATE POLICY disclosure_forms_insert_staff_admin ON disclosure_forms
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role IN ('admin', 'staff')
    )
  );
