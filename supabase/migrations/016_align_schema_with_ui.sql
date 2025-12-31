-- Migration to align database schema with UI form fields
-- This ensures all form fields from IntakeFormContainer can be saved

-- Add missing columns to patients table
ALTER TABLE patients
  ADD COLUMN IF NOT EXISTS middle_name TEXT,
  ADD COLUMN IF NOT EXISTS goes_by TEXT,
  ADD COLUMN IF NOT EXISTS county TEXT,
  ADD COLUMN IF NOT EXISTS ethnicity_other TEXT,
  ADD COLUMN IF NOT EXISTS language_other TEXT,
  ADD COLUMN IF NOT EXISTS spouse_cell TEXT,
  ADD COLUMN IF NOT EXISTS spouse_work TEXT,
  ADD COLUMN IF NOT EXISTS assistance_other TEXT,
  ADD COLUMN IF NOT EXISTS referral_other TEXT,
  ADD COLUMN IF NOT EXISTS patient_printed_name TEXT,
  ADD COLUMN IF NOT EXISTS interviewed_by TEXT,
  ADD COLUMN IF NOT EXISTS interviewed_date DATE;

-- Ensure all array columns exist
DO $$ 
BEGIN
  -- Check and add ethnicity if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'patients' AND column_name = 'ethnicity'
  ) THEN
    ALTER TABLE patients ADD COLUMN ethnicity TEXT[];
  END IF;

  -- Check and add language if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'patients' AND column_name = 'language'
  ) THEN
    ALTER TABLE patients ADD COLUMN language TEXT[];
  END IF;

  -- Check and add insurance_type if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'patients' AND column_name = 'insurance_type'
  ) THEN
    ALTER TABLE patients ADD COLUMN insurance_type TEXT[];
  END IF;

  -- Check and add assistance_types if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'patients' AND column_name = 'assistance_types'
  ) THEN
    ALTER TABLE patients ADD COLUMN assistance_types TEXT[];
  END IF;

  -- Check and add oncologist_mercy if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'patients' AND column_name = 'oncologist_mercy'
  ) THEN
    ALTER TABLE patients ADD COLUMN oncologist_mercy TEXT[];
  END IF;

  -- Check and add oncologist_baptist if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'patients' AND column_name = 'oncologist_baptist'
  ) THEN
    ALTER TABLE patients ADD COLUMN oncologist_baptist TEXT[];
  END IF;
END $$;

-- Add indexes for new searchable fields
CREATE INDEX IF NOT EXISTS idx_patients_county ON patients(county);
CREATE INDEX IF NOT EXISTS idx_patients_goes_by ON patients(goes_by);
CREATE INDEX IF NOT EXISTS idx_patients_interviewed_date ON patients(interviewed_date);

-- Add comment for documentation
COMMENT ON TABLE patients IS 'Main patient records table - aligned with intake form UI fields';
