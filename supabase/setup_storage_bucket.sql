-- Setup Supabase Storage bucket for patient documents
-- Run this in Supabase SQL Editor after applying migration 019

-- Note: Storage buckets are typically created via Supabase Dashboard or API
-- This file documents the required configuration

-- Storage Bucket Configuration:
-- Bucket name: patient-documents
-- Public: false (private)
-- File size limit: 10MB (10485760 bytes)
-- Allowed MIME types: application/pdf

-- To create the bucket, run this in your application or use Supabase Dashboard:
-- Storage > Create new bucket > Name: patient-documents > Public: OFF

-- RLS Policies for Storage (run after bucket is created)
-- These policies allow authenticated users to access patient documents

-- Policy 1: Allow authenticated users to SELECT (read) documents
CREATE POLICY "Authenticated users can read patient documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'patient-documents');

-- Policy 2: Allow authenticated users to INSERT (upload) documents
CREATE POLICY "Authenticated users can upload patient documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'patient-documents');

-- Policy 3: Allow authenticated users to UPDATE documents
CREATE POLICY "Authenticated users can update patient documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'patient-documents');

-- Policy 4: Allow authenticated users to DELETE documents
CREATE POLICY "Authenticated users can delete patient documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'patient-documents');

-- Verify bucket exists
SELECT * FROM storage.buckets WHERE name = 'patient-documents';

-- Note: Policies are created above using CREATE POLICY statements
-- They will be automatically applied to the storage.objects table
