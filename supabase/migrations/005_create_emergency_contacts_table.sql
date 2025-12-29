-- Emergency contacts table (one-to-one with patients)
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(patient_id)
);

-- Index for patient lookups
CREATE INDEX idx_emergency_contacts_patient_id ON emergency_contacts(patient_id);

-- Enable Row Level Security
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Policy: Staff and admins can read all emergency contacts
CREATE POLICY emergency_contacts_select_staff_admin ON emergency_contacts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role IN ('admin', 'staff', 'viewer')
    )
  );

-- Policy: Staff and admins can insert emergency contacts
CREATE POLICY emergency_contacts_insert_staff_admin ON emergency_contacts
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role IN ('admin', 'staff')
    )
  );

-- Policy: Staff and admins can update emergency contacts
CREATE POLICY emergency_contacts_update_staff_admin ON emergency_contacts
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role IN ('admin', 'staff')
    )
  );
