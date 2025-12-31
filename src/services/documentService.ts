import { supabase } from '@/lib/supabase';

export interface PatientDocument {
  id: string;
  patient_id: string;
  document_type: 'disclosure_form' | 'intake_form' | 'other';
  document_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string;
  created_at: string;
  expires_at: string | null;
  is_expired: boolean | null;
  created_by: string | null;
  notes: string | null;
}

export interface UploadDocumentParams {
  patientId: string;
  documentType: 'disclosure_form' | 'intake_form' | 'other';
  documentName: string;
  pdfBlob: Blob;
  expiresInDays?: number; // Default 365 for disclosure forms
  notes?: string;
}

export const documentService = {
  /**
   * Upload a PDF document to Supabase Storage and create database record
   */
  async uploadDocument(params: UploadDocumentParams): Promise<{ success: boolean; documentId?: string; error?: string }> {
    try {
      const { patientId, documentType, documentName, pdfBlob, expiresInDays, notes } = params;

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Generate unique file path
      const timestamp = Date.now();
      const fileName = `${timestamp}_${documentName.replace(/[^a-zA-Z0-9.-]/g, '_')}.pdf`;
      const filePath = `${patientId}/${documentType}/${fileName}`;

      console.log('📤 Uploading document to storage:', filePath);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('patient-documents')
        .upload(filePath, pdfBlob, {
          contentType: 'application/pdf',
          upsert: false,
        });

      if (uploadError) {
        console.error('❌ Storage upload error:', uploadError);
        return { success: false, error: `Failed to upload file: ${uploadError.message}` };
      }

      console.log('✅ File uploaded to storage:', uploadData.path);

      // Calculate expiry date (default 365 days for disclosure forms)
      let expiresAt: string | null = null;
      if (documentType === 'disclosure_form' || expiresInDays) {
        const days = expiresInDays || 365;
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + days);
        expiresAt = expiryDate.toISOString();
      }

      // Create database record
      const { data: docData, error: docError } = await supabase
        .from('patient_documents')
        .insert({
          patient_id: patientId,
          document_type: documentType,
          document_name: documentName,
          file_path: uploadData.path,
          file_size: pdfBlob.size,
          mime_type: 'application/pdf',
          expires_at: expiresAt,
          created_by: user.id,
          notes: notes || null,
        })
        .select()
        .single();

      if (docError) {
        console.error('❌ Database insert error:', docError);
        // Try to clean up uploaded file
        await supabase.storage.from('patient-documents').remove([uploadData.path]);
        return { success: false, error: `Failed to create document record: ${docError.message}` };
      }

      console.log('✅ Document record created:', docData.id);

      return { success: true, documentId: docData.id };
    } catch (error) {
      console.error('❌ Unexpected error in uploadDocument:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  /**
   * Get all documents for a patient
   */
  async getPatientDocuments(patientId: string): Promise<{ success: boolean; documents?: PatientDocument[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('patient_documents')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching documents:', error);
        return { success: false, error: error.message };
      }

      return { success: true, documents: data };
    } catch (error) {
      console.error('❌ Unexpected error in getPatientDocuments:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  /**
   * Download a document from storage
   */
  async downloadDocument(filePath: string): Promise<{ success: boolean; blob?: Blob; error?: string }> {
    try {
      const { data, error } = await supabase.storage
        .from('patient-documents')
        .download(filePath);

      if (error) {
        console.error('❌ Error downloading document:', error);
        return { success: false, error: error.message };
      }

      return { success: true, blob: data };
    } catch (error) {
      console.error('❌ Unexpected error in downloadDocument:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  /**
   * Get a public URL for a document (temporary signed URL)
   */
  async getDocumentUrl(filePath: string, expiresIn: number = 3600): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const { data, error } = await supabase.storage
        .from('patient-documents')
        .createSignedUrl(filePath, expiresIn);

      if (error) {
        console.error('❌ Error creating signed URL:', error);
        return { success: false, error: error.message };
      }

      return { success: true, url: data.signedUrl };
    } catch (error) {
      console.error('❌ Unexpected error in getDocumentUrl:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  /**
   * Delete a document (removes from storage and database)
   */
  async deleteDocument(documentId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Get document record to find file path
      const { data: doc, error: fetchError } = await supabase
        .from('patient_documents')
        .select('file_path')
        .eq('id', documentId)
        .single();

      if (fetchError || !doc) {
        return { success: false, error: 'Document not found' };
      }

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('patient-documents')
        .remove([doc.file_path]);

      if (storageError) {
        console.error('❌ Error deleting from storage:', storageError);
        // Continue to delete DB record even if storage delete fails
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('patient_documents')
        .delete()
        .eq('id', documentId);

      if (dbError) {
        console.error('❌ Error deleting from database:', dbError);
        return { success: false, error: dbError.message };
      }

      console.log('✅ Document deleted:', documentId);
      return { success: true };
    } catch (error) {
      console.error('❌ Unexpected error in deleteDocument:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  /**
   * Check if a document is expired
   */
  isDocumentExpired(document: PatientDocument): boolean {
    if (!document.expires_at) return false;
    return new Date(document.expires_at) < new Date();
  },

  /**
   * Get days until expiry (negative if expired)
   */
  getDaysUntilExpiry(document: PatientDocument): number | null {
    if (!document.expires_at) return null;
    const expiryDate = new Date(document.expires_at);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  },
};
