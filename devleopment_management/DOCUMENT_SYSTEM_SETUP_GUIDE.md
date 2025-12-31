# Document Management System - Setup Guide

## Phase 1: Database & Storage Setup

### Step 1: Apply Database Migration

Run this SQL in your Supabase SQL Editor:

```bash
# Copy the contents of:
supabase/migrations/019_create_patient_documents_table.sql
```

This creates the `patient_documents` table with:
- Document metadata (name, type, size)
- File path to Supabase Storage
- Expiry tracking (1 year for disclosure forms)
- Automatic `is_expired` calculation

### Step 2: Create Storage Bucket

**Option A: Via Supabase Dashboard (Recommended)**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Storage** in left sidebar
4. Click **New bucket**
5. Settings:
   - Name: `patient-documents`
   - Public: **OFF** (private)
   - File size limit: 10MB
   - Allowed MIME types: `application/pdf`
6. Click **Create bucket**

**Option B: Via SQL (if Dashboard doesn't work)**
```sql
-- Run in Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'patient-documents',
  'patient-documents',
  false,
  10485760,
  ARRAY['application/pdf']
) ON CONFLICT DO NOTHING;
```

### Step 3: Set Up Storage Policies

After creating the bucket, run the SQL from:
```bash
supabase/setup_storage_bucket.sql
```

This creates RLS policies so authenticated users can:
- Upload documents
- Read documents
- Update documents
- Delete documents

### Step 4: Verify Setup

Run this in SQL Editor to verify:
```sql
-- Check bucket exists
SELECT * FROM storage.buckets WHERE name = 'patient-documents';

-- Check policies exist
SELECT * FROM storage.policies WHERE bucket_id = 'patient-documents';

-- Check table exists
SELECT * FROM patient_documents LIMIT 1;
```

---

## What's Next

Once setup is complete, the system will:
1. ✅ Save PDFs to Supabase Storage when forms are submitted
2. ✅ Track document metadata in `patient_documents` table
3. ✅ Calculate expiry automatically (1 year for disclosure forms)
4. ✅ Allow viewing/downloading documents from patient profile
5. ✅ Show expiry warnings and renewal options

---

## Testing

After setup, test with:
1. Submit an intake form
2. Check console for "Document uploaded" message
3. Verify document appears in `patient_documents` table
4. Verify PDF file exists in Storage bucket
5. Check expiry date is set to 1 year from now

---

## Troubleshooting

**Error: "Bucket not found"**
- Make sure bucket name is exactly `patient-documents`
- Check bucket was created successfully in Storage tab

**Error: "Permission denied"**
- Verify RLS policies were created
- Check user is authenticated
- Ensure policies allow authenticated users

**Error: "File too large"**
- PDFs must be under 10MB
- Adjust file_size_limit in bucket settings if needed

**Error: "Invalid MIME type"**
- Only PDF files are allowed
- Check file is actually a PDF
