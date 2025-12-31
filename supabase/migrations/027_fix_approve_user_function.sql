-- Fix approve_user function to handle users who already have auth accounts
-- (from email verification flow)

CREATE OR REPLACE FUNCTION approve_user(
  pending_user_id UUID,
  admin_user_id UUID,
  initial_password TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  pending_user pending_users;
  new_user_id UUID;
  auth_user_exists BOOLEAN;
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
  
  -- Check if auth user already exists (from email verification)
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE email = pending_user.email
  ) INTO auth_user_exists;
  
  IF auth_user_exists THEN
    -- User already has auth account (from registration with email verification)
    -- Just get their ID and create users table record
    SELECT id INTO new_user_id
    FROM auth.users
    WHERE email = pending_user.email;
    
    -- Check if they're already in users table
    IF EXISTS (SELECT 1 FROM users WHERE id = new_user_id) THEN
      RETURN jsonb_build_object(
        'success', false, 
        'error', 'User already exists in system. They may have already been approved.'
      );
    END IF;
  ELSE
    -- No auth user exists - would need to create one via Supabase Admin API
    -- For now, return error asking admin to have user register first
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User must complete registration and email verification first.'
    );
  END IF;
  
  -- Create user in users table
  INSERT INTO users (
    id,
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
    new_user_id,
    pending_user.email,
    pending_user.full_name,
    pending_user.role,
    pending_user.phone,
    pending_user.volunteer_start_date,
    'active',
    admin_user_id,
    NOW(),
    NOW()
  );
  
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

COMMENT ON FUNCTION approve_user IS 'Approve pending user - handles users who already have auth accounts from email verification';
