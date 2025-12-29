-- Migration: Create audit logs table for HIPAA compliance
-- Created: 2025-12-29
-- Purpose: Server-side audit trail for all PHI access and system events

-- ============================================================================
-- AUDIT_LOGS TABLE
-- ============================================================================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Event Information
  event_type TEXT NOT NULL CHECK (event_type IN (
    'LOGIN',
    'LOGOUT',
    'LOGIN_FAILED',
    'SESSION_TIMEOUT',
    'PATIENT_VIEWED',
    'PATIENT_CREATED',
    'PATIENT_UPDATED',
    'PATIENT_DELETED',
    'PATIENT_SEARCHED',
    'VISIT_CREATED',
    'VISIT_UPDATED',
    'FORM_SUBMITTED',
    'DATA_EXPORTED',
    'UNAUTHORIZED_ACCESS',
    '2FA_ENABLED',
    '2FA_DISABLED',
    '2FA_VERIFIED'
  )),
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
  
  -- Additional Context
  details JSONB,
  
  -- Indexes for fast querying
  created_at_idx TIMESTAMPTZ,
  user_id_idx UUID,
  event_type_idx TEXT
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Index on created_at for time-based queries
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Index on user_id for user-specific queries
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id) WHERE user_id IS NOT NULL;

-- Index on event_type for filtering by event
CREATE INDEX idx_audit_logs_event_type ON audit_logs(event_type);

-- Index on resource for PHI access tracking
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id) 
  WHERE resource_type IS NOT NULL;

-- Index on success for finding failures
CREATE INDEX idx_audit_logs_failures ON audit_logs(created_at DESC) 
  WHERE success = false;

-- Composite index for user activity over time
CREATE INDEX idx_audit_logs_user_activity ON audit_logs(user_id, created_at DESC) 
  WHERE user_id IS NOT NULL;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view audit logs
CREATE POLICY audit_logs_select_admin ON audit_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role = 'admin'
    )
  );

-- Policy: System can insert audit logs (no user context needed)
-- This allows the application to write logs even during failed auth
CREATE POLICY audit_logs_insert_system ON audit_logs
  FOR INSERT
  WITH CHECK (true);

-- Policy: No updates allowed (audit logs are immutable)
-- Audit logs should NEVER be modified after creation

-- Policy: Only admins can delete old logs (for retention policies)
CREATE POLICY audit_logs_delete_admin ON audit_logs
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role = 'admin'
    )
  );

-- ============================================================================
-- FUNCTIONS FOR AUDIT LOG QUERIES
-- ============================================================================

-- Function to get recent audit logs
CREATE OR REPLACE FUNCTION get_recent_audit_logs(
  limit_count INTEGER DEFAULT 100,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  created_at TIMESTAMPTZ,
  event_type TEXT,
  action TEXT,
  success BOOLEAN,
  user_email TEXT,
  user_name TEXT,
  resource_type TEXT,
  resource_id TEXT,
  ip_address INET
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    al.id,
    al.created_at,
    al.event_type,
    al.action,
    al.success,
    al.user_email,
    al.user_name,
    al.resource_type,
    al.resource_id,
    al.ip_address
  FROM audit_logs al
  ORDER BY al.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get patient access history (HIPAA requirement)
CREATE OR REPLACE FUNCTION get_patient_access_history(patient_uuid UUID)
RETURNS TABLE (
  accessed_at TIMESTAMPTZ,
  accessed_by TEXT,
  action TEXT,
  ip_address INET
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    al.created_at as accessed_at,
    al.user_name as accessed_by,
    al.action,
    al.ip_address
  FROM audit_logs al
  WHERE al.resource_type = 'patient'
    AND al.resource_id = patient_uuid::text
    AND al.event_type IN ('PATIENT_VIEWED', 'PATIENT_CREATED', 'PATIENT_UPDATED', 'PATIENT_DELETED')
  ORDER BY al.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get failed login attempts
CREATE OR REPLACE FUNCTION get_failed_login_attempts(
  hours_back INTEGER DEFAULT 24
)
RETURNS TABLE (
  attempted_at TIMESTAMPTZ,
  email TEXT,
  ip_address INET,
  details JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    al.created_at as attempted_at,
    al.user_email as email,
    al.ip_address,
    al.details
  FROM audit_logs al
  WHERE al.event_type = 'LOGIN_FAILED'
    AND al.created_at > NOW() - (hours_back || ' hours')::INTERVAL
  ORDER BY al.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get audit statistics
CREATE OR REPLACE FUNCTION get_audit_statistics(
  hours_back INTEGER DEFAULT 24
)
RETURNS TABLE (
  total_events BIGINT,
  failed_events BIGINT,
  unique_users BIGINT,
  patient_accesses BIGINT,
  failed_logins BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_events,
    COUNT(*) FILTER (WHERE success = false) as failed_events,
    COUNT(DISTINCT user_id) FILTER (WHERE user_id IS NOT NULL) as unique_users,
    COUNT(*) FILTER (WHERE resource_type = 'patient') as patient_accesses,
    COUNT(*) FILTER (WHERE event_type = 'LOGIN_FAILED') as failed_logins
  FROM audit_logs
  WHERE created_at > NOW() - (hours_back || ' hours')::INTERVAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- RETENTION POLICY (Optional - for automatic cleanup)
-- ============================================================================

-- Function to clean up old audit logs (keep last 2 years for HIPAA)
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM audit_logs
  WHERE created_at < NOW() - INTERVAL '2 years';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE audit_logs IS 'HIPAA-compliant audit trail for all system events and PHI access';
COMMENT ON COLUMN audit_logs.event_type IS 'Type of event that occurred';
COMMENT ON COLUMN audit_logs.resource_type IS 'Type of resource accessed (e.g., patient, visit)';
COMMENT ON COLUMN audit_logs.resource_id IS 'ID of the specific resource accessed';
COMMENT ON COLUMN audit_logs.ip_address IS 'IP address of the user (for security monitoring)';
COMMENT ON COLUMN audit_logs.details IS 'Additional context stored as JSON';

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Allow authenticated users to insert audit logs
GRANT INSERT ON audit_logs TO authenticated;

-- Allow admins to query audit logs
GRANT SELECT ON audit_logs TO authenticated;

-- ============================================================================
-- VERIFICATION QUERIES (commented out - for manual testing)
-- ============================================================================

-- Test inserting an audit log
-- INSERT INTO audit_logs (event_type, action, user_email, success)
-- VALUES ('LOGIN', 'User logged in', 'test@example.com', true);

-- Test querying recent logs
-- SELECT * FROM get_recent_audit_logs(10);

-- Test getting patient access history
-- SELECT * FROM get_patient_access_history('some-patient-uuid');

-- Test getting failed logins
-- SELECT * FROM get_failed_login_attempts(24);

-- Test getting statistics
-- SELECT * FROM get_audit_statistics(24);
