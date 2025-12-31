-- Create physicians table to store all physician associations
CREATE TABLE IF NOT EXISTS patient_physicians (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  physician_name TEXT NOT NULL,
  physician_location TEXT NOT NULL,
  physician_phone TEXT,
  physician_fax TEXT,
  physician_type TEXT NOT NULL CHECK (physician_type IN ('mercy_oncologist', 'mercy_radiation', 'baptist_oncologist', 'baptist_radiation', 'custom')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_patient_physicians_patient_id ON patient_physicians(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_physicians_type ON patient_physicians(physician_type);

-- Enable RLS
ALTER TABLE patient_physicians ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all patient_physicians"
  ON patient_physicians FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert patient_physicians"
  ON patient_physicians FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update patient_physicians"
  ON patient_physicians FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete patient_physicians"
  ON patient_physicians FOR DELETE
  TO authenticated
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_patient_physicians_updated_at
  BEFORE UPDATE ON patient_physicians
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
