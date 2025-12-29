-- Fix visit_count to match actual visit records
-- This recalculates visit_count for all patients based on their actual visits

UPDATE patients
SET visit_count = (
  SELECT COUNT(*)
  FROM visits
  WHERE visits.patient_id = patients.id
);

-- Also update last_visit_date to match the most recent visit
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
