-- Create surgeries table
CREATE TABLE IF NOT EXISTS surgeries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Create chemo_cycles table
CREATE TABLE IF NOT EXISTS chemo_cycles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Create radiation_treatments table
CREATE TABLE IF NOT EXISTS radiation_treatments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_surgeries_patient_id ON surgeries(patient_id);
CREATE INDEX IF NOT EXISTS idx_surgeries_date ON surgeries(date);
CREATE INDEX IF NOT EXISTS idx_chemo_cycles_patient_id ON chemo_cycles(patient_id);
CREATE INDEX IF NOT EXISTS idx_chemo_cycles_dates ON chemo_cycles(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_radiation_treatments_patient_id ON radiation_treatments(patient_id);
CREATE INDEX IF NOT EXISTS idx_radiation_treatments_dates ON radiation_treatments(start_date, end_date);

-- Enable RLS
ALTER TABLE surgeries ENABLE ROW LEVEL SECURITY;
ALTER TABLE chemo_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE radiation_treatments ENABLE ROW LEVEL SECURITY;

-- Create policies for surgeries
CREATE POLICY "Users can view all surgeries"
  ON surgeries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert surgeries"
  ON surgeries FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update surgeries"
  ON surgeries FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete surgeries"
  ON surgeries FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for chemo_cycles
CREATE POLICY "Users can view all chemo_cycles"
  ON chemo_cycles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert chemo_cycles"
  ON chemo_cycles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update chemo_cycles"
  ON chemo_cycles FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete chemo_cycles"
  ON chemo_cycles FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for radiation_treatments
CREATE POLICY "Users can view all radiation_treatments"
  ON radiation_treatments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert radiation_treatments"
  ON radiation_treatments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update radiation_treatments"
  ON radiation_treatments FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete radiation_treatments"
  ON radiation_treatments FOR DELETE
  TO authenticated
  USING (true);

-- Create triggers for updated_at
CREATE TRIGGER update_surgeries_updated_at
  BEFORE UPDATE ON surgeries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chemo_cycles_updated_at
  BEFORE UPDATE ON chemo_cycles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_radiation_treatments_updated_at
  BEFORE UPDATE ON radiation_treatments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
