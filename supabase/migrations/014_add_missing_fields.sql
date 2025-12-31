-- Add missing fields to visits table
ALTER TABLE visits ADD COLUMN IF NOT EXISTS duration_minutes INTEGER GENERATED ALWAYS AS (
  CASE 
    WHEN check_out_timestamp IS NOT NULL 
    THEN EXTRACT(EPOCH FROM (check_out_timestamp - check_in_timestamp)) / 60
    ELSE NULL
  END
) STORED;

-- Add function to calculate days since last visit
CREATE OR REPLACE FUNCTION calculate_days_since_last_visit(last_visit DATE)
RETURNS INTEGER AS $$
BEGIN
  IF last_visit IS NULL THEN
    RETURN NULL;
  END IF;
  RETURN DATE_PART('day', CURRENT_DATE - last_visit)::INTEGER;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create view with computed days_since_last_visit
CREATE OR REPLACE VIEW patients_with_computed_fields AS
SELECT 
  p.*,
  calculate_days_since_last_visit(p.last_visit_date) AS days_since_last_visit
FROM patients p;

-- Add missing indexes for performance
CREATE INDEX IF NOT EXISTS idx_patients_phone_primary ON patients(phone_primary);
CREATE INDEX IF NOT EXISTS idx_patients_phone_second ON patients(phone_second);
CREATE INDEX IF NOT EXISTS idx_patients_phone_other ON patients(phone_other);
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);
