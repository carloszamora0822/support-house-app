-- Migration 029: Add org_id for Multi-Tenant Isolation (HIPAA Requirement)
-- CRITICAL: Enforces "minimum necessary" access control

-- ============================================================================
-- ADD ORG_ID TO ALL PHI TABLES
-- ============================================================================

-- Add org_id to patients table
ALTER TABLE patients 
ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- Add org_id to visits table
ALTER TABLE visits 
ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- Add org_id to emergency_contacts table
ALTER TABLE emergency_contacts 
ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- Add org_id to minor_children table
ALTER TABLE minor_children 
ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- Add org_id to disclosure_forms table
ALTER TABLE disclosure_forms 
ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- Add org_id to patient_documents table
ALTER TABLE patient_documents 
ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- Add org_id to form_submissions table
ALTER TABLE form_submissions 
ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- Add org_id to patient_physicians table
ALTER TABLE patient_physicians 
ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- Add org_id to surgeries table
ALTER TABLE surgeries 
ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- Add org_id to chemo_cycles table
ALTER TABLE chemo_cycles 
ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- Add org_id to radiation_treatments table
ALTER TABLE radiation_treatments 
ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- Add org_id to assistance_items table
ALTER TABLE assistance_items 
ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- Add org_id to pending_tasks table
ALTER TABLE pending_tasks 
ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- ============================================================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_patients_org_id ON patients(org_id);
CREATE INDEX IF NOT EXISTS idx_visits_org_id ON visits(org_id);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_org_id ON emergency_contacts(org_id);
CREATE INDEX IF NOT EXISTS idx_minor_children_org_id ON minor_children(org_id);
CREATE INDEX IF NOT EXISTS idx_disclosure_forms_org_id ON disclosure_forms(org_id);
CREATE INDEX IF NOT EXISTS idx_patient_documents_org_id ON patient_documents(org_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_org_id ON form_submissions(org_id);
CREATE INDEX IF NOT EXISTS idx_patient_physicians_org_id ON patient_physicians(org_id);
CREATE INDEX IF NOT EXISTS idx_surgeries_org_id ON surgeries(org_id);
CREATE INDEX IF NOT EXISTS idx_chemo_cycles_org_id ON chemo_cycles(org_id);
CREATE INDEX IF NOT EXISTS idx_radiation_treatments_org_id ON radiation_treatments(org_id);
CREATE INDEX IF NOT EXISTS idx_assistance_items_org_id ON assistance_items(org_id);
CREATE INDEX IF NOT EXISTS idx_pending_tasks_org_id ON pending_tasks(org_id);

-- ============================================================================
-- UPDATE RLS POLICIES TO ENFORCE ORG ISOLATION
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS patients_select_staff_admin ON patients;
DROP POLICY IF EXISTS patients_insert_staff_admin ON patients;
DROP POLICY IF EXISTS patients_update_staff_admin ON patients;

-- Create new org-isolated policies for patients
CREATE POLICY patients_select_own_org ON patients
  FOR SELECT
  USING (
    org_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'staff', 'viewer')
    )
  );

CREATE POLICY patients_insert_own_org ON patients
  FOR INSERT
  WITH CHECK (
    org_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'staff')
    )
  );

CREATE POLICY patients_update_own_org ON patients
  FOR UPDATE
  USING (
    org_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'staff')
    )
  );

-- Update visits policies
DROP POLICY IF EXISTS visits_select_staff_admin ON visits;
DROP POLICY IF EXISTS visits_insert_staff_admin ON visits;
DROP POLICY IF EXISTS visits_update_staff_admin ON visits;

CREATE POLICY visits_select_own_org ON visits
  FOR SELECT
  USING (org_id = auth.uid());

CREATE POLICY visits_insert_own_org ON visits
  FOR INSERT
  WITH CHECK (org_id = auth.uid());

CREATE POLICY visits_update_own_org ON visits
  FOR UPDATE
  USING (org_id = auth.uid());

-- Update emergency_contacts policies
DROP POLICY IF EXISTS emergency_contacts_select_staff_admin ON emergency_contacts;
DROP POLICY IF EXISTS emergency_contacts_insert_staff_admin ON emergency_contacts;
DROP POLICY IF EXISTS emergency_contacts_update_staff_admin ON emergency_contacts;

CREATE POLICY emergency_contacts_select_own_org ON emergency_contacts
  FOR SELECT
  USING (org_id = auth.uid());

CREATE POLICY emergency_contacts_insert_own_org ON emergency_contacts
  FOR INSERT
  WITH CHECK (org_id = auth.uid());

CREATE POLICY emergency_contacts_update_own_org ON emergency_contacts
  FOR UPDATE
  USING (org_id = auth.uid());

-- Update minor_children policies
DROP POLICY IF EXISTS minor_children_select_staff_admin ON minor_children;
DROP POLICY IF EXISTS minor_children_insert_staff_admin ON minor_children;
DROP POLICY IF EXISTS minor_children_update_staff_admin ON minor_children;

CREATE POLICY minor_children_select_own_org ON minor_children
  FOR SELECT
  USING (org_id = auth.uid());

CREATE POLICY minor_children_insert_own_org ON minor_children
  FOR INSERT
  WITH CHECK (org_id = auth.uid());

CREATE POLICY minor_children_update_own_org ON minor_children
  FOR UPDATE
  USING (org_id = auth.uid());

-- Update disclosure_forms policies
DROP POLICY IF EXISTS disclosure_forms_select_staff_admin ON disclosure_forms;
DROP POLICY IF EXISTS disclosure_forms_insert_staff_admin ON disclosure_forms;

CREATE POLICY disclosure_forms_select_own_org ON disclosure_forms
  FOR SELECT
  USING (org_id = auth.uid());

CREATE POLICY disclosure_forms_insert_own_org ON disclosure_forms
  FOR INSERT
  WITH CHECK (org_id = auth.uid());

-- Update patient_documents policies
DROP POLICY IF EXISTS "Users can view all patient_documents" ON patient_documents;
DROP POLICY IF EXISTS "Users can insert patient_documents" ON patient_documents;
DROP POLICY IF EXISTS "Users can update patient_documents" ON patient_documents;

CREATE POLICY patient_documents_select_own_org ON patient_documents
  FOR SELECT
  USING (org_id = auth.uid());

CREATE POLICY patient_documents_insert_own_org ON patient_documents
  FOR INSERT
  WITH CHECK (org_id = auth.uid());

CREATE POLICY patient_documents_update_own_org ON patient_documents
  FOR UPDATE
  USING (org_id = auth.uid());

-- ============================================================================
-- BACKFILL EXISTING DATA WITH DEFAULT ORG
-- ============================================================================

-- For single-tenant deployment, set all existing records to first admin user
DO $$
DECLARE
  default_org_id UUID;
BEGIN
  -- Get first admin user as default org
  SELECT id INTO default_org_id
  FROM users
  WHERE role = 'admin'
  ORDER BY created_at ASC
  LIMIT 1;

  IF default_org_id IS NOT NULL THEN
    -- Update all existing records
    UPDATE patients SET org_id = default_org_id WHERE org_id IS NULL;
    UPDATE visits SET org_id = default_org_id WHERE org_id IS NULL;
    UPDATE emergency_contacts SET org_id = default_org_id WHERE org_id IS NULL;
    UPDATE minor_children SET org_id = default_org_id WHERE org_id IS NULL;
    UPDATE disclosure_forms SET org_id = default_org_id WHERE org_id IS NULL;
    UPDATE patient_documents SET org_id = default_org_id WHERE org_id IS NULL;
    UPDATE form_submissions SET org_id = default_org_id WHERE org_id IS NULL;
    UPDATE patient_physicians SET org_id = default_org_id WHERE org_id IS NULL;
    UPDATE surgeries SET org_id = default_org_id WHERE org_id IS NULL;
    UPDATE chemo_cycles SET org_id = default_org_id WHERE org_id IS NULL;
    UPDATE radiation_treatments SET org_id = default_org_id WHERE org_id IS NULL;
    UPDATE assistance_items SET org_id = default_org_id WHERE org_id IS NULL;
    UPDATE pending_tasks SET org_id = default_org_id WHERE org_id IS NULL;

    RAISE NOTICE 'Backfilled org_id for all existing records with admin: %', default_org_id;
  END IF;
END $$;

-- ============================================================================
-- MAKE ORG_ID NOT NULL (After backfill)
-- ============================================================================

ALTER TABLE patients ALTER COLUMN org_id SET NOT NULL;
ALTER TABLE visits ALTER COLUMN org_id SET NOT NULL;
ALTER TABLE emergency_contacts ALTER COLUMN org_id SET NOT NULL;
ALTER TABLE minor_children ALTER COLUMN org_id SET NOT NULL;
ALTER TABLE disclosure_forms ALTER COLUMN org_id SET NOT NULL;
ALTER TABLE patient_documents ALTER COLUMN org_id SET NOT NULL;
ALTER TABLE form_submissions ALTER COLUMN org_id SET NOT NULL;
ALTER TABLE patient_physicians ALTER COLUMN org_id SET NOT NULL;
ALTER TABLE surgeries ALTER COLUMN org_id SET NOT NULL;
ALTER TABLE chemo_cycles ALTER COLUMN org_id SET NOT NULL;
ALTER TABLE radiation_treatments ALTER COLUMN org_id SET NOT NULL;
ALTER TABLE assistance_items ALTER COLUMN org_id SET NOT NULL;
ALTER TABLE pending_tasks ALTER COLUMN org_id SET NOT NULL;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

DO $$
BEGIN
  ASSERT (SELECT COUNT(*) FROM information_schema.columns 
          WHERE table_name = 'patients' AND column_name = 'org_id') = 1,
    'org_id column not added to patients table';
  
  RAISE NOTICE '✅ Migration 029 completed successfully';
  RAISE NOTICE '   - org_id added to all PHI tables';
  RAISE NOTICE '   - RLS policies updated for org isolation';
  RAISE NOTICE '   - Existing data backfilled';
  RAISE NOTICE '   - HIPAA "minimum necessary" now enforced';
END $$;
