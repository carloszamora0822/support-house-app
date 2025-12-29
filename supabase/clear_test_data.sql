-- Clear test data from Support House App
-- Run this in Supabase SQL Editor to remove all test patients
-- WARNING: This will delete ALL patient data!

-- Delete in order due to foreign key constraints
DELETE FROM visits;
DELETE FROM minor_children;
DELETE FROM emergency_contacts;
DELETE FROM disclosure_forms;
DELETE FROM form_submissions;
DELETE FROM patients;

-- Verify deletion
SELECT 
  (SELECT COUNT(*) FROM patients) as patients_count,
  (SELECT COUNT(*) FROM visits) as visits_count,
  (SELECT COUNT(*) FROM emergency_contacts) as emergency_contacts_count;

SELECT 'All test data cleared!' as status;
