-- Seed data for Support House App
-- Run this in Supabase SQL Editor to create test patients

-- Insert mock patients
INSERT INTO patients (
  first_name, last_name, goes_by, dob, email,
  phone_primary, phone_second, phone_other,
  address, city, state, zip,
  status, ethnicity, language, education,
  employment_status, marital_status,
  visit_count, last_visit_date,
  patient_status
) VALUES
-- Patient 1: Maria Garcia
(
  'Maria', 'Garcia', 'Mari', '1975-03-15', 'maria.garcia@email.com',
  '555-0101', '555-0102', NULL,
  '123 Main Street', 'San Antonio', 'TX', '78201',
  'female', ARRAY['Hispanic/Latino'], ARRAY['Spanish'], 'High School',
  'Employed Full-Time', 'Married',
  5, '2024-12-15', 'active'
),

-- Patient 2: John Smith
(
  'John', 'Smith', NULL, '1968-07-22', 'john.smith@email.com',
  '555-0201', NULL, '555-0203',
  '456 Oak Avenue', 'Austin', 'TX', '78701',
  'male', ARRAY['White/Caucasian'], ARRAY['English'], 'Bachelor''s Degree',
  'Retired', 'Widowed',
  12, '2024-12-10', 'active'
),

-- Patient 3: Aisha Johnson
(
  'Aisha', 'Johnson', NULL, '1982-11-08', 'aisha.j@email.com',
  '555-0301', '555-0302', NULL,
  '789 Pine Road', 'Houston', 'TX', '77001',
  'female', ARRAY['Black/African American'], ARRAY['English'], 'Associate Degree',
  'Employed Part-Time', 'Single',
  3, '2024-11-28', 'active'
),

-- Patient 4: Robert Chen
(
  'Robert', 'Chen', 'Bob', '1955-05-30', 'robert.chen@email.com',
  '555-0401', NULL, NULL,
  '321 Elm Street', 'Dallas', 'TX', '75201',
  'male', ARRAY['Asian'], ARRAY['English'], 'Master''s Degree',
  'Retired', 'Married',
  8, '2024-12-18', 'active'
),

-- Patient 5: Linda Martinez
(
  'Linda', 'Martinez', NULL, '1990-09-12', 'linda.martinez@email.com',
  '555-0501', '555-0502', '555-0503',
  '654 Maple Drive', 'San Antonio', 'TX', '78202',
  'female', ARRAY['Hispanic/Latino'], ARRAY['English', 'Spanish'], 'Some College',
  'Unemployed', 'Divorced',
  2, '2024-10-05', 'active'
),

-- Patient 6: James Wilson
(
  'James', 'Wilson', 'Jim', '1972-01-25', 'jwilson@email.com',
  '555-0601', NULL, NULL,
  '987 Cedar Lane', 'Austin', 'TX', '78702',
  'male', ARRAY['White/Caucasian'], ARRAY['English'], 'High School',
  'Employed Full-Time', 'Married',
  15, '2024-12-20', 'active'
),

-- Patient 7: Patricia Lee
(
  'Patricia', 'Lee', 'Pat', '1965-04-18', 'patricia.lee@email.com',
  '555-0701', '555-0702', NULL,
  '147 Birch Court', 'Houston', 'TX', '77002',
  'female', ARRAY['Asian'], ARRAY['English'], 'Bachelor''s Degree',
  'Employed Part-Time', 'Married',
  6, '2024-12-12', 'active'
),

-- Patient 8: Michael Brown
(
  'Michael', 'Brown', 'Mike', '1988-08-07', 'mbrown@email.com',
  '555-0801', NULL, NULL,
  '258 Spruce Avenue', 'Dallas', 'TX', '75202',
  'male', ARRAY['Black/African American'], ARRAY['English'], 'Some College',
  'Employed Full-Time', 'Single',
  1, '2024-09-15', 'active'
),

-- Patient 9: Jennifer Rodriguez
(
  'Jennifer', 'Rodriguez', 'Jen', '1978-12-03', 'jen.rodriguez@email.com',
  '555-0901', '555-0902', NULL,
  '369 Willow Street', 'San Antonio', 'TX', '78203',
  'female', ARRAY['Hispanic/Latino'], ARRAY['Spanish'], 'Associate Degree',
  'Self-Employed', 'Married',
  9, '2024-12-08', 'active'
),

-- Patient 10: David Kim
(
  'David', 'Kim', NULL, '1992-06-20', 'david.kim@email.com',
  '555-1001', NULL, '555-1003',
  '741 Ash Boulevard', 'Austin', 'TX', '78703',
  'male', ARRAY['Asian'], ARRAY['English'], 'Bachelor''s Degree',
  'Employed Full-Time', 'Single',
  4, '2024-11-22', 'active'
);

-- Add some emergency contacts for a few patients
INSERT INTO emergency_contacts (patient_id, name, relationship, phone)
SELECT 
  p.id,
  CASE 
    WHEN p.first_name = 'Maria' THEN 'Carlos Garcia'
    WHEN p.first_name = 'John' THEN 'Sarah Smith'
    WHEN p.first_name = 'Robert' THEN 'Susan Chen'
    WHEN p.first_name = 'James' THEN 'Mary Wilson'
    WHEN p.first_name = 'Jennifer' THEN 'Miguel Rodriguez'
  END as name,
  CASE 
    WHEN p.marital_status = 'Married' THEN 'Spouse'
    ELSE 'Sibling'
  END as relationship,
  '555-' || LPAD((RANDOM() * 10000)::INT::TEXT, 4, '0') as phone
FROM patients p
WHERE p.first_name IN ('Maria', 'John', 'Robert', 'James', 'Jennifer');

-- Add some visit history for patients
INSERT INTO visits (patient_id, check_in_timestamp, staff_user_id, staff_name, assistance_requested)
SELECT 
  p.id,
  NOW() - (RANDOM() * INTERVAL '90 days') as check_in_timestamp,
  (SELECT id FROM users LIMIT 1) as staff_user_id,
  (SELECT full_name FROM users LIMIT 1) as staff_name,
  ARRAY[
    CASE (RANDOM() * 5)::INT
      WHEN 0 THEN 'Food Pantry'
      WHEN 1 THEN 'Financial Assistance'
      WHEN 2 THEN 'Transportation'
      WHEN 3 THEN 'Counseling'
      ELSE 'General Support'
    END
  ] as assistance_requested
FROM patients p
CROSS JOIN generate_series(1, (RANDOM() * 3 + 1)::INT) -- 1-4 visits per patient
ORDER BY RANDOM()
LIMIT 25; -- Total of ~25 visits across all patients

-- Verify the data
SELECT 
  COUNT(*) as total_patients,
  COUNT(DISTINCT city) as cities,
  COUNT(DISTINCT ethnicity) as ethnicities
FROM patients;

SELECT 'Seed data inserted successfully!' as status;
