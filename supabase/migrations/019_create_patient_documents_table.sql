-- Migration 019: Create patient_documents table for storing PDFs and tracking expiry
-- This enables document management with 1-year expiry tracking for disclosure forms

-- Create patient_documents table
CREATE TABLE IF NOT EXISTS patient_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('disclosure_form', 'intake_form', 'other')),
  document_name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Supabase Storage path: patient-documents/{patient_id}/{document_type}/{timestamp}_{filename}.pdf
  file_size INTEGER,
  mime_type TEXT DEFAULT 'application/pdf',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE, -- 1 year from created_at for disclosure forms
  created_by UUID REFERENCES users(id),
  notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_patient_documents_patient_id ON patient_documents(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_documents_expires_at ON patient_documents(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_patient_documents_type ON patient_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_patient_documents_created_at ON patient_documents(created_at DESC);

-- Enable RLS
ALTER TABLE patient_documents ENABLE ROW LEVEL SECURITY;

-- Create policies for patient_documents
CREATE POLICY "Users can view all patient_documents"
  ON patient_documents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert patient_documents"
  ON patient_documents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update patient_documents"
  ON patient_documents FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete patient_documents"
  ON patient_documents FOR DELETE
  TO authenticated
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_patient_documents_updated_at
  BEFORE UPDATE ON patient_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add helpful comment
COMMENT ON TABLE patient_documents IS 'Stores patient documents (PDFs) with expiry tracking. Disclosure forms expire after 1 year.';
COMMENT ON COLUMN patient_documents.file_path IS 'Supabase Storage path in format: patient-documents/{patient_id}/{document_type}/{timestamp}_{filename}.pdf';
COMMENT ON COLUMN patient_documents.expires_at IS 'Expiry date for document. Check in application: expires_at < NOW() to determine if expired';
