-- ============================================
-- FIX VISIT COUNT DISCREPANCY
-- ============================================
-- This script recalculates visit_count for all patients
-- based on their actual visit records in the visits table
--
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================

-- Step 1: Recalculate visit_count from actual visits
UPDATE patients
SET visit_count = (
  SELECT COUNT(*)
  FROM visits
  WHERE visits.patient_id = patients.id
);

-- Step 2: Update last_visit_date to match most recent visit
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

-- Step 3: Verify the fix - show patients with their actual vs old counts
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
