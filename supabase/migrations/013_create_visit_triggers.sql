-- Trigger to automatically update patient.visit_count when a visit is inserted
CREATE OR REPLACE FUNCTION increment_patient_visit_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE patients
  SET visit_count = COALESCE(visit_count, 0) + 1
  WHERE id = NEW.patient_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_visit_count
  AFTER INSERT ON visits
  FOR EACH ROW
  EXECUTE FUNCTION increment_patient_visit_count();

-- Trigger to automatically update patient.last_visit_date when a visit is inserted
CREATE OR REPLACE FUNCTION update_patient_last_visit_date()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE patients
  SET last_visit_date = DATE(NEW.check_in_timestamp)
  WHERE id = NEW.patient_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_last_visit_date
  AFTER INSERT ON visits
  FOR EACH ROW
  EXECUTE FUNCTION update_patient_last_visit_date();
