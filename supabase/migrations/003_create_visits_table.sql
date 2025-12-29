-- Visits table - tracks all patient visits (one-to-many with patients)
CREATE TABLE IF NOT EXISTS visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  
  -- Visit Details
  visit_type TEXT NOT NULL DEFAULT 'returning' CHECK (visit_type IN ('intake', 'returning', 'phone', 'other')),
  check_in_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  check_out_timestamp TIMESTAMPTZ,
  
  -- Staff
  staff_user_id UUID REFERENCES users(id),
  staff_name TEXT,
  
  -- Assistance (what they requested/received THIS visit)
  assistance_requested TEXT[],
  assistance_provided TEXT[],
  assistance_other TEXT,
  
  -- Notes
  visit_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for analytics
CREATE INDEX idx_visits_patient_id ON visits(patient_id);
CREATE INDEX idx_visits_check_in_timestamp ON visits(check_in_timestamp);
CREATE INDEX idx_visits_visit_type ON visits(visit_type);
CREATE INDEX idx_visits_staff_user_id ON visits(staff_user_id);
CREATE INDEX idx_visits_created_at ON visits(created_at);

-- Enable Row Level Security
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- Policy: Staff and admins can read all visits
CREATE POLICY visits_select_staff_admin ON visits
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role IN ('admin', 'staff', 'viewer')
    )
  );

-- Policy: Staff and admins can insert visits
CREATE POLICY visits_insert_staff_admin ON visits
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role IN ('admin', 'staff')
    )
  );

-- Policy: Staff and admins can update visits
CREATE POLICY visits_update_staff_admin ON visits
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role IN ('admin', 'staff')
    )
  );
