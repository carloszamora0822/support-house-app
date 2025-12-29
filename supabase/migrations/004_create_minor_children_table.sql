-- Minor children table (one-to-many with patients)
CREATE TABLE IF NOT EXISTS minor_children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  dob DATE NOT NULL,
  sex TEXT CHECK (sex IN ('M', 'F')),
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for patient lookups
CREATE INDEX idx_minor_children_patient_id ON minor_children(patient_id);

-- Enable Row Level Security
ALTER TABLE minor_children ENABLE ROW LEVEL SECURITY;

-- Policy: Staff and admins can read all minor children
CREATE POLICY minor_children_select_staff_admin ON minor_children
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role IN ('admin', 'staff', 'viewer')
    )
  );

-- Policy: Staff and admins can insert minor children
CREATE POLICY minor_children_insert_staff_admin ON minor_children
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role IN ('admin', 'staff')
    )
  );
