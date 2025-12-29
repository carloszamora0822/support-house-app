-- Trigger to automatically update patient visit_count and last_visit_date when a visit is created
CREATE OR REPLACE FUNCTION update_patient_visit_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE patients
  SET 
    visit_count = visit_count + 1,
    last_visit_date = DATE(NEW.check_in_timestamp)
  WHERE id = NEW.patient_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_patient_visit_stats
  AFTER INSERT ON visits
  FOR EACH ROW
  EXECUTE FUNCTION update_patient_visit_stats();

-- Trigger to set staff_name from users table when visit is created
CREATE OR REPLACE FUNCTION set_visit_staff_name()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.staff_user_id IS NOT NULL THEN
    SELECT full_name INTO NEW.staff_name
    FROM users
    WHERE id = NEW.staff_user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_visit_staff_name
  BEFORE INSERT ON visits
  FOR EACH ROW
  EXECUTE FUNCTION set_visit_staff_name();

-- Trigger to calculate age at intake
CREATE OR REPLACE FUNCTION calculate_age_at_intake()
RETURNS TRIGGER AS $$
BEGIN
  NEW.age_at_intake = EXTRACT(YEAR FROM AGE(NEW.created_at, NEW.dob));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_age_at_intake
  BEFORE INSERT ON patients
  FOR EACH ROW
  EXECUTE FUNCTION calculate_age_at_intake();
