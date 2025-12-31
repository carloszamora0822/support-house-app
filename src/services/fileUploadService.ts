import { documentService } from './documentService';

export interface FileUploadResult {
  success: boolean;
  documentId?: string;
  error?: string;
}

export const fileUploadService = {
  // Accepted file types
  acceptedTypes: [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
  ],

  // Max file size: 10MB
  maxSize: 10 * 1024 * 1024,

  /**
   * Validate file before upload
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > this.maxSize) {
      return {
        valid: false,
        error: `File size exceeds 10MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      };
    }

    // Check file type
    if (!this.acceptedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type not supported. Please upload PDF, JPEG, or PNG files only.`,
      };
    }

    return { valid: true };
  },

  /**
   * Upload signed medical release form
   */
  async uploadSignedForm(
    file: File,
    patientId: string,
    documentName?: string
  ): Promise<FileUploadResult> {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      console.log('📤 Uploading signed form:', file.name);

      // Convert file to blob
      const blob = new Blob([file], { type: file.type });

      // Generate document name
      const name = documentName || `Signed_Medical_Release_${Date.now()}`;

      // Upload using documentService
      const result = await documentService.uploadDocument({
        patientId,
        documentType: 'disclosure_form',
        documentName: name,
        pdfBlob: blob,
        expiresInDays: 365, // 1 year expiry
        notes: 'Signed medical release form uploaded by staff',
      });

      if (!result.success) {
        return { success: false, error: result.error };
      }

      console.log('✅ Signed form uploaded successfully');
      return { success: true, documentId: result.documentId };
    } catch (error) {
      console.error('❌ Error uploading signed form:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  },

  /**
   * Get human-readable file size
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  },

  /**
   * Get file extension from filename
   */
  getFileExtension(filename: string): string {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
  },

  /**
   * Check if file is an image
   */
  isImage(file: File): boolean {
    return file.type.startsWith('image/');
  },

  /**
   * Check if file is a PDF
   */
  isPDF(file: File): boolean {
    return file.type === 'application/pdf';
  },
};
