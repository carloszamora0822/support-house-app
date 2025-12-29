-- Additional indexes for analytics and performance optimization

-- Composite indexes for common query patterns
CREATE INDEX idx_patients_status_last_visit ON patients(patient_status, last_visit_date);
CREATE INDEX idx_patients_state_ethnicity ON patients(state, ethnicity);
CREATE INDEX idx_visits_patient_timestamp ON visits(patient_id, check_in_timestamp DESC);
CREATE INDEX idx_visits_staff_timestamp ON visits(staff_user_id, check_in_timestamp DESC);

-- GIN indexes for array columns (assistance types, languages, etc.)
CREATE INDEX idx_patients_assistance_types ON patients USING GIN(assistance_types);
CREATE INDEX idx_patients_language ON patients USING GIN(language);
CREATE INDEX idx_patients_insurance_type ON patients USING GIN(insurance_type);
CREATE INDEX idx_visits_assistance_requested ON visits USING GIN(assistance_requested);
CREATE INDEX idx_visits_assistance_provided ON visits USING GIN(assistance_provided);

-- Text search indexes for name searches
CREATE INDEX idx_patients_full_name ON patients USING GIN(to_tsvector('english', first_name || ' ' || COALESCE(middle_name, '') || ' ' || last_name));

-- Partial indexes for active patients only
CREATE INDEX idx_patients_active_last_visit ON patients(last_visit_date) WHERE patient_status = 'active';
CREATE INDEX idx_patients_active_diagnosis ON patients(diagnosis_primary) WHERE patient_status = 'active';
