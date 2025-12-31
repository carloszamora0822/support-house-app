-- Server-side rate limiting to prevent brute force attacks
-- SECURITY FIX: Move rate limiting from client-side localStorage to database
-- Prevents bypassing rate limits by clearing browser storage

-- Create table to track login attempts
CREATE TABLE IF NOT EXISTS login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  attempt_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  success BOOLEAN NOT NULL DEFAULT FALSE,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_login_attempts_email_timestamp 
  ON login_attempts(email, attempt_timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_login_attempts_ip_timestamp 
  ON login_attempts(ip_address, attempt_timestamp DESC);

-- Function to check if account is locked out
CREATE OR REPLACE FUNCTION is_account_locked_out(
  user_email TEXT,
  lockout_minutes INT DEFAULT 15,
  max_attempts INT DEFAULT 5
)
RETURNS BOOLEAN AS $$
DECLARE
  failed_attempts INT;
  lockout_time TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Calculate lockout window start time
  lockout_time := NOW() - (lockout_minutes || ' minutes')::INTERVAL;
  
  -- Count failed attempts in lockout window
  SELECT COUNT(*) INTO failed_attempts
  FROM login_attempts
  WHERE email = user_email
    AND attempt_timestamp >= lockout_time
    AND success = FALSE;
  
  -- Return true if locked out
  RETURN failed_attempts >= max_attempts;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record login attempt
CREATE OR REPLACE FUNCTION record_login_attempt(
  user_email TEXT,
  attempt_success BOOLEAN,
  client_ip TEXT DEFAULT NULL,
  client_user_agent TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  -- Insert login attempt
  INSERT INTO login_attempts (email, success, ip_address, user_agent)
  VALUES (user_email, attempt_success, client_ip, client_user_agent);
  
  -- Clean up old attempts (keep last 30 days)
  DELETE FROM login_attempts
  WHERE attempt_timestamp < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clear lockout after successful login
CREATE OR REPLACE FUNCTION clear_failed_attempts(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  -- Delete failed attempts for this email
  DELETE FROM login_attempts
  WHERE email = user_email
    AND success = FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION is_account_locked_out TO authenticated, anon;
GRANT EXECUTE ON FUNCTION record_login_attempt TO authenticated, anon;
GRANT EXECUTE ON FUNCTION clear_failed_attempts TO authenticated, anon;

-- RLS policies for login_attempts table
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

-- Only admins can view login attempts
CREATE POLICY login_attempts_select_admin ON login_attempts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role = 'admin'
    )
  );

-- System can insert (via functions with SECURITY DEFINER)
-- No direct INSERT/UPDATE/DELETE allowed

-- Comments
COMMENT ON TABLE login_attempts IS 'Server-side rate limiting - tracks login attempts to prevent brute force attacks';
COMMENT ON FUNCTION is_account_locked_out IS 'Check if account is locked due to too many failed login attempts';
COMMENT ON FUNCTION record_login_attempt IS 'Record a login attempt (success or failure) with IP and user agent';
COMMENT ON FUNCTION clear_failed_attempts IS 'Clear failed login attempts after successful authentication';

-- Performance note: Indexes ensure fast lookups even with millions of attempts
-- Auto-cleanup keeps table size manageable
