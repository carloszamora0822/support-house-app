# Apply Database Migrations Manually

Since Supabase CLI installation failed (Xcode version issue), apply these migrations manually via the Supabase Dashboard.

---

## 🔗 Step 1: Access Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Log in to your account
3. Select your **support-house-app** project

---

## 📝 Step 2: Apply Migration 014 - DELETE Policies

1. Click **"SQL Editor"** in the left sidebar
2. Click **"New Query"**
3. Copy and paste the entire content below:

```sql
-- Migration: Add DELETE policies for all tables
-- Created: 2025-12-29
-- Purpose: Fix missing DELETE RLS policies (Security Issue #3)

-- ============================================================================
-- PATIENTS TABLE - DELETE POLICY
-- ============================================================================

-- Policy: Admins can delete patients
CREATE POLICY patients_delete_admin ON patients
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role = 'admin'
    )
  );

-- ============================================================================
-- VISITS TABLE - DELETE POLICY
-- ============================================================================

-- Policy: Admins and staff can delete visits
CREATE POLICY visits_delete_staff_admin ON visits
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role IN ('admin', 'staff')
    )
  );

-- ============================================================================
-- MINOR_CHILDREN TABLE - DELETE POLICY
-- ============================================================================

-- Policy: Admins and staff can delete minor children records
CREATE POLICY minor_children_delete_staff_admin ON minor_children
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role IN ('admin', 'staff')
    )
  );

-- ============================================================================
-- EMERGENCY_CONTACTS TABLE - DELETE POLICY
-- ============================================================================

-- Policy: Admins and staff can delete emergency contacts
CREATE POLICY emergency_contacts_delete_staff_admin ON emergency_contacts
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role IN ('admin', 'staff')
    )
  );

-- ============================================================================
-- DISCLOSURE_FORMS TABLE - DELETE POLICY
-- ============================================================================

-- Policy: Admins can delete disclosure forms
CREATE POLICY disclosure_forms_delete_admin ON disclosure_forms
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role = 'admin'
    )
  );

-- ============================================================================
-- FORM_SUBMISSIONS TABLE - DELETE POLICY
-- ============================================================================

-- Policy: Admins and staff can delete form submissions
CREATE POLICY form_submissions_delete_staff_admin ON form_submissions
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role IN ('admin', 'staff')
    )
  );

-- ============================================================================
-- USERS TABLE - DELETE POLICY
-- ============================================================================

-- Policy: Only admins can delete user accounts
CREATE POLICY users_delete_admin ON users
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role = 'admin'
    )
  );
```

4. Click **"Run"** (or press Cmd+Enter)
5. Verify you see: **"Success. No rows returned"**

---

## 📝 Step 3: Apply Migration 015 - NOT NULL Constraints

1. Click **"New Query"** again
2. Copy and paste the entire content below:

```sql
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
```

3. Click **"Run"** (or press Cmd+Enter)
4. You should see success messages for each ALTER TABLE statement

---

## ✅ Step 4: Verify Migrations Applied

Run this verification query:

```sql
-- Check that DELETE policies exist
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE policyname LIKE '%delete%'
ORDER BY tablename, policyname;

-- Check NOT NULL constraints on patients table
SELECT column_name, is_nullable, data_type
FROM information_schema.columns
WHERE table_name = 'patients'
AND column_name IN ('first_name', 'last_name', 'dob', 'phone_primary', 'address', 'city', 'state', 'zip', 'status', 'referral_source')
ORDER BY column_name;
```

**Expected Results:**
- DELETE policies should show for all 7 tables
- All listed columns should have `is_nullable = 'NO'`

---

## ⚠️ Troubleshooting

### If you get "policy already exists" errors:
- The policies were already created
- This is safe to ignore
- Continue with the next migration

### If you get constraint violation errors:
- Check if you have existing NULL data
- The UPDATE statements should handle this
- Contact support if issues persist

### If tables don't exist:
- Make sure you're in the correct Supabase project
- Run the earlier migrations first (001-013)
- Check the "Table Editor" to see what tables exist

---

---

## 📝 Step 5: Fix Visit Count Discrepancy (Optional but Recommended)

If you notice patient visit counts are incorrect (e.g., showing 17 visits when they only have 5):

1. Click **"New Query"** again
2. Copy and paste the content from **`FIX_VISIT_COUNT.sql`** (in project root):

```sql
-- Recalculate visit_count from actual visits
UPDATE patients
SET visit_count = (
  SELECT COUNT(*)
  FROM visits
  WHERE visits.patient_id = patients.id
);

-- Update last_visit_date to match most recent visit
UPDATE patients
SET last_visit_date = (
  SELECT DATE(MAX(check_in_timestamp))
  FROM visits
  WHERE visits.patient_id = patients.id
)
WHERE EXISTS (
  SELECT 1
  FROM visits
  WHERE visits.patient_id = patients.id
);

-- Verify the fix
SELECT 
  p.id,
  p.first_name,
  p.last_name,
  p.visit_count as "Current Count",
  (SELECT COUNT(*) FROM visits WHERE patient_id = p.id) as "Actual Visits",
  p.last_visit_date
FROM patients p
WHERE p.visit_count > 0
ORDER BY p.visit_count DESC
LIMIT 10;
```

3. Click **"Run"**
4. Check the verification query results - "Current Count" should now match "Actual Visits"
5. Refresh your patient detail pages to see corrected counts

---

## 📝 Step 6: Apply Audit Logs Migration (HIPAA Compliance)

For full observability and HIPAA compliance:

1. Click **"New Query"** again
2. Copy and paste the content from **`supabase/migrations/016_create_audit_logs_table.sql`**
3. Click **"Run"**
4. This creates the `audit_logs` table with all necessary indexes and functions

**What this enables:**
- ✅ Server-side audit logging
- ✅ Track all PHI access (HIPAA requirement)
- ✅ Admin audit log viewer
- ✅ Security monitoring

---

## 🎉 Done!

Once all migrations are applied successfully:
1. ✅ DELETE RLS policies are in place
2. ✅ NOT NULL constraints match your Zod schemas
3. ✅ Visit counts are accurate
4. ✅ Audit logging is enabled (HIPAA compliance)
5. ✅ Database security is significantly improved

You can now proceed with testing the application!
