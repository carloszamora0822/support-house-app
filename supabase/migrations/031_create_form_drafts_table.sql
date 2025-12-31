-- Migration 031: Server-Side Form Drafts (HIPAA Requirement)
-- CRITICAL: Remove PHI from localStorage - store drafts server-side only

-- ============================================================================
-- CREATE FORM DRAFTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS form_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  form_type TEXT NOT NULL CHECK (form_type IN ('patient-intake', 'patient-edit', 'disclosure')),
  draft_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
  
  -- Ensure one draft per user per form type
  UNIQUE(user_id, form_type)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_form_drafts_user_id ON form_drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_form_drafts_org_id ON form_drafts(org_id);
CREATE INDEX IF NOT EXISTS idx_form_drafts_expires_at ON form_drafts(expires_at);
CREATE INDEX IF NOT EXISTS idx_form_drafts_form_type ON form_drafts(form_type);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

ALTER TABLE form_drafts ENABLE ROW LEVEL SECURITY;

-- Users can only see their own drafts in their org
CREATE POLICY form_drafts_select_own ON form_drafts
  FOR SELECT
  USING (
    user_id = auth.uid()
    AND org_id = auth.uid()
  );

-- Users can only insert their own drafts
CREATE POLICY form_drafts_insert_own ON form_drafts
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND org_id = auth.uid()
  );

-- Users can only update their own drafts
CREATE POLICY form_drafts_update_own ON form_drafts
  FOR UPDATE
  USING (
    user_id = auth.uid()
    AND org_id = auth.uid()
  );

-- Users can only delete their own drafts
CREATE POLICY form_drafts_delete_own ON form_drafts
  FOR DELETE
  USING (
    user_id = auth.uid()
    AND org_id = auth.uid()
  );

-- ============================================================================
-- AUTO-UPDATE TIMESTAMP TRIGGER
-- ============================================================================

CREATE TRIGGER update_form_drafts_updated_at
  BEFORE UPDATE ON form_drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- CLEANUP EXPIRED DRAFTS FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION cleanup_expired_form_drafts()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM form_drafts
  WHERE expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION cleanup_expired_form_drafts IS 'Run daily to remove expired form drafts (older than 24 hours)';

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Save or update draft
CREATE OR REPLACE FUNCTION save_form_draft(
  p_form_type TEXT,
  p_draft_data JSONB
)
RETURNS UUID AS $$
DECLARE
  v_draft_id UUID;
BEGIN
  -- Upsert draft
  INSERT INTO form_drafts (org_id, user_id, form_type, draft_data, expires_at)
  VALUES (
    auth.uid(),
    auth.uid(),
    p_form_type,
    p_draft_data,
    NOW() + INTERVAL '24 hours'
  )
  ON CONFLICT (user_id, form_type)
  DO UPDATE SET
    draft_data = p_draft_data,
    updated_at = NOW(),
    expires_at = NOW() + INTERVAL '24 hours'
  RETURNING id INTO v_draft_id;
  
  RETURN v_draft_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get draft
CREATE OR REPLACE FUNCTION get_form_draft(p_form_type TEXT)
RETURNS JSONB AS $$
DECLARE
  v_draft_data JSONB;
BEGIN
  SELECT draft_data INTO v_draft_data
  FROM form_drafts
  WHERE user_id = auth.uid()
    AND org_id = auth.uid()
    AND form_type = p_form_type
    AND expires_at > NOW();
  
  RETURN v_draft_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Delete draft
CREATE OR REPLACE FUNCTION delete_form_draft(p_form_type TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  DELETE FROM form_drafts
  WHERE user_id = auth.uid()
    AND org_id = auth.uid()
    AND form_type = p_form_type;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- GRANTS
-- ============================================================================

GRANT EXECUTE ON FUNCTION save_form_draft TO authenticated;
GRANT EXECUTE ON FUNCTION get_form_draft TO authenticated;
GRANT EXECUTE ON FUNCTION delete_form_draft TO authenticated;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

DO $$
BEGIN
  ASSERT (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'form_drafts') = 1,
    'form_drafts table not created';
  
  ASSERT (SELECT COUNT(*) FROM information_schema.routines WHERE routine_name = 'save_form_draft') = 1,
    'save_form_draft function not created';
  
  RAISE NOTICE '✅ Migration 031 completed successfully';
  RAISE NOTICE '   - form_drafts table created with RLS';
  RAISE NOTICE '   - Server-side draft storage replaces localStorage';
  RAISE NOTICE '   - Drafts expire after 24 hours';
  RAISE NOTICE '   - HIPAA requirement: No PHI in localStorage';
END $$;
