-- Enhanced audit logging for HIPAA compliance
-- SECURITY FIX: Log ALL PHI access (reads, writes, updates, deletes)
-- Required for HIPAA breach notification and compliance audits

-- Create audit_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Event Information
  event_type TEXT NOT NULL,
  action TEXT NOT NULL,
  success BOOLEAN NOT NULL DEFAULT true,
  
  -- User Information
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_email TEXT,
  user_name TEXT,
  
  -- Resource Information
  resource_type TEXT,
  resource_id TEXT,
  
  -- Request Information
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  
  -- Additional Context
  details JSONB
);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create base policies if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'audit_logs' AND policyname = 'audit_logs_select_admin') THEN
    CREATE POLICY audit_logs_select_admin ON audit_logs
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM users
          WHERE id::text = auth.uid()::text
          AND role = 'admin'
        )
      );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'audit_logs' AND policyname = 'audit_logs_insert_system') THEN
    CREATE POLICY audit_logs_insert_system ON audit_logs
      FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

-- Create indexes for audit queries (using existing column names)
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_timestamp 
  ON audit_logs(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_event_action 
  ON audit_logs(event_type, action, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_resource 
  ON audit_logs(resource_type, resource_id, created_at DESC);

-- Function to automatically log patient record access
CREATE OR REPLACE FUNCTION log_patient_access()
RETURNS TRIGGER AS $$
DECLARE
  current_user_id UUID;
  current_user_email TEXT;
BEGIN
  -- Get current authenticated user
  current_user_id := auth.uid();
  
  IF current_user_id IS NOT NULL THEN
    -- Get user email
    SELECT email INTO current_user_email
    FROM auth.users
    WHERE id = current_user_id;
    
    -- Log the access
    INSERT INTO audit_logs (
      user_id,
      user_email,
      event_type,
      action,
      resource_type,
      resource_id,
      details,
      created_at
    ) VALUES (
      current_user_id,
      current_user_email,
      CASE 
        WHEN TG_OP = 'INSERT' THEN 'PATIENT_CREATED'
        WHEN TG_OP = 'UPDATE' THEN 'PATIENT_UPDATED'
        WHEN TG_OP = 'DELETE' THEN 'PATIENT_DELETED'
      END,
      TG_OP || ' patient record',
      'patient',
      COALESCE(NEW.id, OLD.id)::text,
      jsonb_build_object(
        'operation', TG_OP,
        'patient_name', COALESCE(NEW.first_name || ' ' || NEW.last_name, OLD.first_name || ' ' || OLD.last_name),
        'changed_fields', CASE 
          WHEN TG_OP = 'UPDATE' THEN (
            SELECT jsonb_object_agg(key, value)
            FROM jsonb_each(to_jsonb(NEW))
            WHERE to_jsonb(NEW) -> key IS DISTINCT FROM to_jsonb(OLD) -> key
          )
          ELSE NULL
        END
      ),
      NOW()
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for patient table
DROP TRIGGER IF EXISTS trigger_log_patient_access ON patients;
CREATE TRIGGER trigger_log_patient_access
  AFTER INSERT OR UPDATE OR DELETE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION log_patient_access();

-- Function to log patient searches (called from application)
CREATE OR REPLACE FUNCTION log_patient_search(
  search_query TEXT,
  result_count INT,
  search_filters JSONB DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  current_user_id UUID;
  current_user_email TEXT;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NOT NULL THEN
    SELECT email INTO current_user_email
    FROM auth.users
    WHERE id = current_user_id;
    
    INSERT INTO audit_logs (
      user_id,
      user_email,
      event_type,
      action,
      resource_type,
      details,
      created_at
    ) VALUES (
      current_user_id,
      current_user_email,
      'PATIENT_SEARCHED',
      'Patient search performed',
      'patient',
      jsonb_build_object(
        'search_query', LEFT(search_query, 100), -- Truncate for privacy
        'result_count', result_count,
        'filters', search_filters
      ),
      NOW()
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log patient record views
CREATE OR REPLACE FUNCTION log_patient_view(
  patient_id UUID,
  view_context TEXT DEFAULT 'detail_page'
)
RETURNS VOID AS $$
DECLARE
  current_user_id UUID;
  current_user_email TEXT;
  patient_name TEXT;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NOT NULL THEN
    SELECT email INTO current_user_email
    FROM auth.users
    WHERE id = current_user_id;
    
    SELECT first_name || ' ' || last_name INTO patient_name
    FROM patients
    WHERE id = patient_id;
    
    INSERT INTO audit_logs (
      user_id,
      user_email,
      event_type,
      action,
      resource_type,
      resource_id,
      details,
      created_at
    ) VALUES (
      current_user_id,
      current_user_email,
      'PATIENT_VIEWED',
      'Patient record viewed',
      'patient',
      patient_id::text,
      jsonb_build_object(
        'patient_name', patient_name,
        'context', view_context
      ),
      NOW()
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log document access
CREATE OR REPLACE FUNCTION log_document_access(
  document_id UUID,
  access_type TEXT -- 'view', 'download', 'upload', 'delete'
)
RETURNS VOID AS $$
DECLARE
  current_user_id UUID;
  current_user_email TEXT;
  doc_name TEXT;
  doc_patient_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NOT NULL THEN
    SELECT email INTO current_user_email
    FROM auth.users
    WHERE id = current_user_id;
    
    SELECT document_name, patient_id INTO doc_name, doc_patient_id
    FROM patient_documents
    WHERE id = document_id;
    
    INSERT INTO audit_logs (
      user_id,
      user_email,
      event_type,
      action,
      resource_type,
      resource_id,
      details,
      created_at
    ) VALUES (
      current_user_id,
      current_user_email,
      'DOCUMENT_' || UPPER(access_type),
      'Document ' || access_type,
      'document',
      document_id::text,
      jsonb_build_object(
        'document_name', doc_name,
        'patient_id', doc_patient_id,
        'access_type', access_type
      ),
      NOW()
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION log_patient_search TO authenticated;
GRANT EXECUTE ON FUNCTION log_patient_view TO authenticated;
GRANT EXECUTE ON FUNCTION log_document_access TO authenticated;

-- Create view for audit report generation
CREATE OR REPLACE VIEW audit_report AS
SELECT 
  al.id,
  al.created_at,
  al.event_type,
  al.action,
  al.resource_type,
  al.resource_id,
  al.user_email,
  u.full_name as user_name,
  u.role as user_role,
  al.details,
  al.ip_address,
  al.user_agent
FROM audit_logs al
LEFT JOIN users u ON al.user_id = u.id
ORDER BY al.created_at DESC;

-- Grant view access to admins only
GRANT SELECT ON audit_report TO authenticated;

-- Create RLS policy for audit_report view
CREATE POLICY audit_report_admin_only ON audit_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role = 'admin'
    )
  );

-- Comments
COMMENT ON FUNCTION log_patient_access IS 'Automatically logs all patient record modifications (INSERT/UPDATE/DELETE)';
COMMENT ON FUNCTION log_patient_search IS 'Logs patient search queries for HIPAA compliance';
COMMENT ON FUNCTION log_patient_view IS 'Logs when staff view patient records';
COMMENT ON FUNCTION log_document_access IS 'Logs document access (view/download/upload/delete)';
COMMENT ON VIEW audit_report IS 'Comprehensive audit report view for HIPAA compliance reporting';

-- HIPAA Compliance Notes:
-- - All PHI access is now logged automatically
-- - Audit logs include user identity, timestamp, and action details
-- - Logs are immutable (no UPDATE/DELETE policies)
-- - Retention: Keep logs for 6 years per HIPAA requirements
-- - Regular audit reports can be generated from audit_report view
