-- User Management System with Admin Approval
-- SECURITY: All new users require admin approval before accessing system
-- Includes: Email verification, 2FA, role-based access, audit trail

-- ============================================================================
-- PENDING USERS TABLE (Registration Requests)
-- ============================================================================

CREATE TABLE IF NOT EXISTS pending_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('staff', 'volunteer')), -- Cannot self-register as admin
  volunteer_start_date DATE,
  phone TEXT,
  notes TEXT, -- Why they want access
  
  -- Verification
  email_verified BOOLEAN DEFAULT FALSE,
  verification_token TEXT UNIQUE,
  verification_sent_at TIMESTAMPTZ,
  
  -- Approval workflow
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'revoked')),
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_pending_users_email ON pending_users(email);
CREATE INDEX idx_pending_users_status ON pending_users(status);
CREATE INDEX idx_pending_users_created ON pending_users(created_at DESC);

-- ============================================================================
-- UPDATE USERS TABLE
-- ============================================================================

-- Add new columns to existing users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS volunteer_start_date DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_secret TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS backup_codes TEXT[]; -- Array of backup codes
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_status TEXT DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'deactivated'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

-- ============================================================================
-- USER ACTIVITY TRACKING
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'login', 'logout', 'patient_view', 'patient_edit', 'search', etc.
  entity_type TEXT, -- 'patient', 'visit', 'document'
  entity_id TEXT,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX idx_user_activity_user_time ON user_activity(user_id, created_at DESC);
CREATE INDEX idx_user_activity_type ON user_activity(activity_type, created_at DESC);
CREATE INDEX idx_user_activity_entity ON user_activity(entity_type, entity_id);

-- ============================================================================
-- 2FA VERIFICATION CODES
-- ============================================================================

CREATE TABLE IF NOT EXISTS two_factor_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_2fa_codes_user ON two_factor_codes(user_id, expires_at DESC);

-- Auto-delete expired codes
CREATE OR REPLACE FUNCTION cleanup_expired_2fa_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM two_factor_codes WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNCTIONS: USER REGISTRATION
-- ============================================================================

-- Function to register new user (creates pending_user)
CREATE OR REPLACE FUNCTION register_user(
  user_email TEXT,
  user_full_name TEXT,
  user_role TEXT,
  user_phone TEXT DEFAULT NULL,
  user_notes TEXT DEFAULT NULL,
  start_date DATE DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  new_pending_user pending_users;
  verification_token TEXT;
BEGIN
  -- Validate role (cannot self-register as admin)
  IF user_role NOT IN ('staff', 'volunteer') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid role. Only staff and volunteer can register.');
  END IF;
  
  -- Check if email already exists in users or pending_users
  IF EXISTS (SELECT 1 FROM users WHERE email = user_email) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Email already registered.');
  END IF;
  
  IF EXISTS (SELECT 1 FROM pending_users WHERE email = user_email AND status = 'pending') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Registration request already pending approval.');
  END IF;
  
  -- Generate verification token
  verification_token := encode(gen_random_bytes(32), 'hex');
  
  -- Create pending user
  INSERT INTO pending_users (
    email,
    full_name,
    role,
    phone,
    notes,
    volunteer_start_date,
    verification_token,
    verification_sent_at
  ) VALUES (
    user_email,
    user_full_name,
    user_role,
    user_phone,
    user_notes,
    start_date,
    verification_token,
    NOW()
  ) RETURNING * INTO new_pending_user;
  
  -- Log registration attempt
  INSERT INTO audit_logs (event_type, action, user_email, details, created_at)
  VALUES (
    'USER_REGISTRATION_REQUESTED',
    'New user registration request',
    user_email,
    jsonb_build_object(
      'full_name', user_full_name,
      'role', user_role,
      'pending_user_id', new_pending_user.id
    ),
    NOW()
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'pending_user_id', new_pending_user.id,
    'verification_token', verification_token,
    'message', 'Registration request submitted. Please verify your email and wait for admin approval.'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify email
CREATE OR REPLACE FUNCTION verify_email(token TEXT)
RETURNS JSONB AS $$
DECLARE
  pending_user pending_users;
BEGIN
  -- Find pending user by token
  SELECT * INTO pending_user
  FROM pending_users
  WHERE verification_token = token
    AND email_verified = FALSE
    AND status = 'pending';
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired verification token.');
  END IF;
  
  -- Mark email as verified
  UPDATE pending_users
  SET email_verified = TRUE,
      updated_at = NOW()
  WHERE id = pending_user.id;
  
  -- Log verification
  INSERT INTO audit_logs (event_type, action, user_email, details, created_at)
  VALUES (
    'EMAIL_VERIFIED',
    'User verified email address',
    pending_user.email,
    jsonb_build_object('pending_user_id', pending_user.id),
    NOW()
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Email verified! Your registration is now pending admin approval.'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNCTIONS: ADMIN APPROVAL
-- ============================================================================

-- Function to approve user (admin only)
CREATE OR REPLACE FUNCTION approve_user(
  pending_user_id UUID,
  admin_user_id UUID,
  initial_password TEXT
)
RETURNS JSONB AS $$
DECLARE
  pending_user pending_users;
  new_user_id UUID;
  auth_user_id UUID;
BEGIN
  -- Verify admin permissions
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = admin_user_id AND role = 'admin') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only admins can approve users.');
  END IF;
  
  -- Get pending user
  SELECT * INTO pending_user
  FROM pending_users
  WHERE id = pending_user_id
    AND status = 'pending'
    AND email_verified = TRUE;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Pending user not found or not verified.');
  END IF;
  
  -- Create auth user in Supabase Auth (this would be done via Supabase Admin API in practice)
  -- For now, we'll create the user record and assume auth user is created separately
  
  -- Create user in users table
  INSERT INTO users (
    email,
    full_name,
    role,
    phone,
    volunteer_start_date,
    account_status,
    approved_by,
    approved_at,
    created_at
  ) VALUES (
    pending_user.email,
    pending_user.full_name,
    pending_user.role,
    pending_user.phone,
    pending_user.volunteer_start_date,
    'active',
    admin_user_id,
    NOW(),
    NOW()
  ) RETURNING id INTO new_user_id;
  
  -- Update pending user status
  UPDATE pending_users
  SET status = 'approved',
      approved_by = admin_user_id,
      approved_at = NOW(),
      updated_at = NOW()
  WHERE id = pending_user_id;
  
  -- Log approval
  INSERT INTO audit_logs (
    event_type,
    action,
    user_id,
    user_email,
    resource_type,
    resource_id,
    details,
    created_at
  ) VALUES (
    'USER_APPROVED',
    'Admin approved new user',
    admin_user_id,
    (SELECT email FROM users WHERE id = admin_user_id),
    'user',
    new_user_id::text,
    jsonb_build_object(
      'approved_user_email', pending_user.email,
      'approved_user_role', pending_user.role,
      'pending_user_id', pending_user_id
    ),
    NOW()
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'user_id', new_user_id,
    'message', 'User approved successfully. They can now log in.'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reject user (admin only)
CREATE OR REPLACE FUNCTION reject_user(
  pending_user_id UUID,
  admin_user_id UUID,
  reason TEXT
)
RETURNS JSONB AS $$
DECLARE
  pending_user pending_users;
BEGIN
  -- Verify admin permissions
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = admin_user_id AND role = 'admin') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only admins can reject users.');
  END IF;
  
  -- Get pending user
  SELECT * INTO pending_user
  FROM pending_users
  WHERE id = pending_user_id AND status = 'pending';
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Pending user not found.');
  END IF;
  
  -- Update status
  UPDATE pending_users
  SET status = 'rejected',
      rejection_reason = reason,
      approved_by = admin_user_id,
      approved_at = NOW(),
      updated_at = NOW()
  WHERE id = pending_user_id;
  
  -- Log rejection
  INSERT INTO audit_logs (
    event_type,
    action,
    user_id,
    user_email,
    details,
    created_at
  ) VALUES (
    'USER_REJECTED',
    'Admin rejected user registration',
    admin_user_id,
    (SELECT email FROM users WHERE id = admin_user_id),
    jsonb_build_object(
      'rejected_user_email', pending_user.email,
      'reason', reason,
      'pending_user_id', pending_user_id
    ),
    NOW()
  );
  
  RETURN jsonb_build_object('success', true, 'message', 'User registration rejected.');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNCTIONS: USER ACTIVITY TRACKING
-- ============================================================================

CREATE OR REPLACE FUNCTION track_user_activity(
  activity_type_param TEXT,
  entity_type_param TEXT DEFAULT NULL,
  entity_id_param TEXT DEFAULT NULL,
  details_param JSONB DEFAULT NULL
)
RETURNS void AS $$
DECLARE
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NOT NULL THEN
    INSERT INTO user_activity (
      user_id,
      activity_type,
      entity_type,
      entity_id,
      details,
      created_at
    ) VALUES (
      current_user_id,
      activity_type_param,
      entity_type_param,
      entity_id_param,
      details_param,
      NOW()
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Pending users: Only admins can view
ALTER TABLE pending_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY pending_users_admin_all ON pending_users
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role = 'admin'
    )
  );

-- User activity: Users can view their own, admins can view all
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_activity_own ON user_activity
  FOR SELECT
  USING (user_id::text = auth.uid()::text);

CREATE POLICY user_activity_admin ON user_activity
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id::text = auth.uid()::text
      AND role = 'admin'
    )
  );

-- 2FA codes: Users can only access their own
ALTER TABLE two_factor_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY two_factor_codes_own ON two_factor_codes
  FOR ALL
  USING (user_id::text = auth.uid()::text);

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

GRANT EXECUTE ON FUNCTION register_user TO anon, authenticated;
GRANT EXECUTE ON FUNCTION verify_email TO anon, authenticated;
GRANT EXECUTE ON FUNCTION approve_user TO authenticated;
GRANT EXECUTE ON FUNCTION reject_user TO authenticated;
GRANT EXECUTE ON FUNCTION track_user_activity TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE pending_users IS 'Users awaiting admin approval to access system';
COMMENT ON TABLE user_activity IS 'Detailed tracking of all user actions for audit and analytics';
COMMENT ON TABLE two_factor_codes IS 'Temporary 2FA verification codes';
COMMENT ON FUNCTION register_user IS 'Self-service registration - creates pending user awaiting approval';
COMMENT ON FUNCTION approve_user IS 'Admin approves pending user and creates active account';
COMMENT ON FUNCTION reject_user IS 'Admin rejects pending user registration';
COMMENT ON FUNCTION track_user_activity IS 'Log user activity for audit trail';
