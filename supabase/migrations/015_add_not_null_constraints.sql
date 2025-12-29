-- Migration: Add NOT NULL constraints to required fields
-- Created: 2025-12-29
-- Purpose: Fix database validation gap (Security Issue #8)
-- Ensures database constraints match Zod schema validation

-- ============================================================================
-- STEP 1: Update existing NULL values to prevent constraint violations
-- ============================================================================

-- Update patients table - set empty strings for required text fields
UPDATE patients SET first_name = '' WHERE first_name IS NULL;
UPDATE patients SET last_name = '' WHERE last_name IS NULL;
UPDATE patients SET address = '' WHERE address IS NULL;
UPDATE patients SET city = '' WHERE city IS NULL;
UPDATE patients SET state = '' WHERE state IS NULL;
UPDATE patients SET zip = '' WHERE zip IS NULL;
UPDATE patients SET phone_primary = '' WHERE phone_primary IS NULL;
UPDATE patients SET referral_source = '' WHERE referral_source IS NULL;

-- Set default date for dob if NULL (should not happen in production)
UPDATE patients SET dob = '1900-01-01' WHERE dob IS NULL;

-- Set default status if NULL
UPDATE patients SET status = 'female' WHERE status IS NULL;

-- ============================================================================
-- STEP 2: Add NOT NULL constraints to patients table
-- ============================================================================

-- Identity fields
ALTER TABLE patients ALTER COLUMN first_name SET NOT NULL;
ALTER TABLE patients ALTER COLUMN last_name SET NOT NULL;
ALTER TABLE patients ALTER COLUMN dob SET NOT NULL;

-- Contact fields
ALTER TABLE patients ALTER COLUMN phone_primary SET NOT NULL;

-- Address fields
ALTER TABLE patients ALTER COLUMN address SET NOT NULL;
ALTER TABLE patients ALTER COLUMN city SET NOT NULL;
ALTER TABLE patients ALTER COLUMN state SET NOT NULL;
ALTER TABLE patients ALTER COLUMN zip SET NOT NULL;

-- Demographics
ALTER TABLE patients ALTER COLUMN status SET NOT NULL;

-- Referral
ALTER TABLE patients ALTER COLUMN referral_source SET NOT NULL;

-- ============================================================================
-- STEP 3: Add NOT NULL constraints to visits table
-- ============================================================================

-- Visit timestamp is already NOT NULL in original migration
-- Verify patient_id is NOT NULL
ALTER TABLE visits ALTER COLUMN patient_id SET NOT NULL;
ALTER TABLE visits ALTER COLUMN check_in_timestamp SET NOT NULL;

-- ============================================================================
-- STEP 4: Add NOT NULL constraints to minor_children table
-- ============================================================================

ALTER TABLE minor_children ALTER COLUMN patient_id SET NOT NULL;
ALTER TABLE minor_children ALTER COLUMN dob SET NOT NULL;

-- ============================================================================
-- STEP 5: Add NOT NULL constraints to emergency_contacts table
-- ============================================================================

-- Update existing NULL values
UPDATE emergency_contacts SET name = '' WHERE name IS NULL;

ALTER TABLE emergency_contacts ALTER COLUMN patient_id SET NOT NULL;
ALTER TABLE emergency_contacts ALTER COLUMN name SET NOT NULL;

-- ============================================================================
-- STEP 6: Add NOT NULL constraints to disclosure_forms table
-- ============================================================================

ALTER TABLE disclosure_forms ALTER COLUMN patient_id SET NOT NULL;

-- ============================================================================
-- STEP 7: Add NOT NULL constraints to form_submissions table
-- ============================================================================

-- Update existing NULL values
UPDATE form_submissions SET form_type = 'intake' WHERE form_type IS NULL;
UPDATE form_submissions SET status = 'draft' WHERE status IS NULL;

ALTER TABLE form_submissions ALTER COLUMN form_type SET NOT NULL;
ALTER TABLE form_submissions ALTER COLUMN status SET NOT NULL;

-- ============================================================================
-- STEP 8: Add NOT NULL constraints to users table
-- ============================================================================

-- These should already be NOT NULL from original migration, but verify
ALTER TABLE users ALTER COLUMN email SET NOT NULL;
ALTER TABLE users ALTER COLUMN role SET NOT NULL;
ALTER TABLE users ALTER COLUMN full_name SET NOT NULL;

-- ============================================================================
-- VERIFICATION QUERIES (commented out - for manual testing)
-- ============================================================================

-- Verify patients table constraints
-- SELECT column_name, is_nullable, data_type
-- FROM information_schema.columns
-- WHERE table_name = 'patients'
-- AND column_name IN ('first_name', 'last_name', 'dob', 'phone_primary', 'address', 'city', 'state', 'zip', 'status', 'referral_source')
-- ORDER BY column_name;

-- Check for any NULL values in required fields
-- SELECT COUNT(*) as null_first_names FROM patients WHERE first_name IS NULL;
-- SELECT COUNT(*) as null_last_names FROM patients WHERE last_name IS NULL;
-- SELECT COUNT(*) as null_dobs FROM patients WHERE dob IS NULL;
