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
