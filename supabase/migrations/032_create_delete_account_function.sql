-- ============================================================================
-- Migration 032: Create Delete Account Function
-- ============================================================================
-- Description: Creates RPC function to permanently delete user account and all data
-- Author: System
-- Date: 2025-12-30
-- ============================================================================

-- Drop function if exists
DROP FUNCTION IF EXISTS delete_user_account(UUID);

-- Create function to delete user account and all related data
CREATE OR REPLACE FUNCTION delete_user_account(user_id_to_delete UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify the requesting user is deleting their own account
  IF auth.uid() != user_id_to_delete THEN
    RAISE EXCEPTION 'You can only delete your own account';
  END IF;

  -- Delete user's audit logs (optional - keep for compliance)
  -- DELETE FROM audit_logs WHERE user_id = user_id_to_delete;

  -- Delete user from auth.users (this will cascade to related tables)
  DELETE FROM auth.users WHERE id = user_id_to_delete;

  RAISE NOTICE 'User account % deleted successfully', user_id_to_delete;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_user_account TO authenticated;

-- Add comment
COMMENT ON FUNCTION delete_user_account IS 'Permanently deletes user account and all associated data. Users can only delete their own account.';

-- ============================================================================
-- VERIFICATION
-- ============================================================================

DO $$
BEGIN
  ASSERT (SELECT COUNT(*) FROM information_schema.routines WHERE routine_name = 'delete_user_account') = 1,
    'delete_user_account function not created';
  
  RAISE NOTICE '✅ Migration 032 completed successfully';
  RAISE NOTICE '   - delete_user_account function created';
  RAISE NOTICE '   - Users can permanently delete their own accounts';
  RAISE NOTICE '   - Account deletion is irreversible';
END $$;
