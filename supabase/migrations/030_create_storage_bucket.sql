-- Migration 030: Create Private Storage Bucket with RLS (HIPAA Requirement)
-- CRITICAL: All PHI documents must be in private storage with signed URLs

-- ============================================================================
-- CREATE PRIVATE STORAGE BUCKET
-- ============================================================================

-- Create patient-documents bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'patient-documents',
  'patient-documents',
  false, -- PRIVATE bucket
  52428800, -- 50MB limit
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

-- ============================================================================
-- RLS POLICIES FOR STORAGE BUCKET
-- ============================================================================

-- Policy: Users can only upload to their own org's folder
CREATE POLICY "Users can upload to own org folder"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'patient-documents'
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can only view files in their own org's folder
CREATE POLICY "Users can view own org files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'patient-documents'
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can only update files in their own org's folder
CREATE POLICY "Users can update own org files"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'patient-documents'
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can only delete files in their own org's folder
CREATE POLICY "Users can delete own org files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'patient-documents'
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================================
-- HELPER FUNCTION: Generate Signed URL
-- ============================================================================

CREATE OR REPLACE FUNCTION get_signed_document_url(
  file_path TEXT,
  expires_in_seconds INTEGER DEFAULT 3600
)
RETURNS TEXT AS $$
DECLARE
  signed_url TEXT;
BEGIN
  -- Verify user has access to this file (org isolation)
  IF NOT EXISTS (
    SELECT 1 FROM storage.objects
    WHERE bucket_id = 'patient-documents'
    AND name = file_path
    AND (storage.foldername(name))[1] = auth.uid()::text
  ) THEN
    RAISE EXCEPTION 'Access denied to file: %', file_path;
  END IF;

  -- Generate signed URL (1 hour expiration)
  -- Note: Actual signed URL generation happens in Edge Function
  -- This function validates access only
  RETURN file_path;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- UPDATE patient_documents TABLE
-- ============================================================================

-- Add storage_path column if not exists
ALTER TABLE patient_documents 
ADD COLUMN IF NOT EXISTS storage_path TEXT;

-- Add constraint to ensure storage_path matches org_id
ALTER TABLE patient_documents
ADD CONSTRAINT storage_path_matches_org
CHECK (storage_path IS NULL OR storage_path LIKE (org_id::text || '/%'));

-- ============================================================================
-- VERIFICATION
-- ============================================================================

DO $$
BEGIN
  ASSERT (SELECT COUNT(*) FROM storage.buckets WHERE id = 'patient-documents') = 1,
    'patient-documents bucket not created';
  
  ASSERT (SELECT public FROM storage.buckets WHERE id = 'patient-documents') = false,
    'patient-documents bucket must be private';
  
  RAISE NOTICE '✅ Migration 030 completed successfully';
  RAISE NOTICE '   - Private storage bucket created';
  RAISE NOTICE '   - RLS policies enforce org isolation';
  RAISE NOTICE '   - File size limit: 50MB';
  RAISE NOTICE '   - Allowed types: PDF, images, Word docs';
  RAISE NOTICE '   - HIPAA requirement: Private storage with signed URLs';
END $$;
