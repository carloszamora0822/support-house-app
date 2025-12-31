import { useState, useRef } from 'react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import toast from 'react-hot-toast';
import { fileUploadService } from '@/services/fileUploadService';
import { taskService } from '@/services/taskService';
import { documentService } from '@/services/documentService';
import { supabase } from '@/lib/supabase';
import type { PendingTask } from '@/services/taskService';

interface CompleteTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: PendingTask;
  patientName: string;
  patientId: string;
  onSuccess: () => void;
}

export const CompleteTaskModal = ({ isOpen, onClose, task, patientName, patientId, onSuccess }: CompleteTaskModalProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Medical staff data fields (only for upload_medical_release tasks)
  const [medicalData, setMedicalData] = useState({
    diagnosis: '',
    stage: '',
    expectedTreatments: '',
    treatmentStartDate: '',
    treatmentEndDate: '',
    chemoType: [] as string[],
    chemoFrequency: '',
    chemoEveryWeeks: '',
    radiationFrequency: '',
    radiationEveryWeeks: '',
    staffSignatureDate: new Date().toISOString().split('T')[0],
  });

  if (!isOpen) return null;

  // Check if this is a medical release task
  const isMedicalReleaseTask = task.task_type === 'upload_medical_release' || task.task_type === 'renew_medical_release';

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    const validation = fileUploadService.validateFile(file);
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid file');
      return;
    }

    setUploadedFile(file);
    toast.success(`File selected: ${file.name}`);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleMedicalDataChange = (field: string, value: string | string[]) => {
    setMedicalData(prev => ({ ...prev, [field]: value }));
  };

  const handleChemoTypeToggle = (type: string) => {
    setMedicalData(prev => ({
      ...prev,
      chemoType: prev.chemoType.includes(type)
        ? prev.chemoType.filter(t => t !== type)
        : [...prev.chemoType, type],
    }));
  };

  const handleRegenerateOutform = async () => {
    setIsRegenerating(true);
    try {
      console.log('🔄 Regenerating Outform PDF...');
      
      // Get patient's disclosure data
      const { data: disclosureData, error: disclosureError } = await supabase
        .from('disclosure_forms')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (disclosureError || !disclosureData) {
        toast.error('Could not find disclosure form data');
        setIsRegenerating(false);
        return;
      }

      // Generate new PDF
      const { pdfService } = await import('@/features/forms/services/pdfService');
      const pdfBlob = await pdfService.generateDisclosurePDF(disclosureData);

      // Upload as new Outform
      const documentName = `ReynoldsCancerSupportHouse: ${patientName}, Outform`;
      const uploadResult = await documentService.uploadDocument({
        patientId,
        documentType: 'disclosure_form',
        documentName,
        pdfBlob,
        expiresInDays: 365,
        notes: 'Regenerated Outform PDF',
      });

      if (uploadResult.success) {
        toast.success('✅ Outform PDF regenerated successfully!');
      } else {
        toast.error(uploadResult.error || 'Failed to regenerate PDF');
      }
    } catch (error) {
      console.error('❌ Error regenerating PDF:', error);
      toast.error('Failed to regenerate PDF');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleComplete = async () => {
    if (!uploadedFile) {
      toast.error('Please upload the signed form');
      return;
    }

    // Only validate medical data for medical release tasks
    if (isMedicalReleaseTask && !medicalData.diagnosis) {
      toast.error('Please enter the diagnosis from medical staff');
      return;
    }

    setIsUploading(true);

    try {
      // Determine document naming based on task type
      let documentName = '';
      if (isMedicalReleaseTask) {
        documentName = `ReynoldsCancerSupportHouse: ${patientName}, Inform`;
      } else {
        // For other task types, use generic naming
        documentName = `${task.task_type}_${patientName}_${Date.now()}`;
      }

      // Step 1: Upload signed document
      console.log('📤 Uploading signed document...');
      
      const uploadResult = await fileUploadService.uploadSignedForm(
        uploadedFile,
        task.patient_id,
        documentName
      );

      if (!uploadResult.success) {
        toast.error(uploadResult.error || 'Failed to upload file');
        setIsUploading(false);
        return;
      }

      console.log('✅ Document uploaded');

      // Step 2: Update disclosure_forms table with medical staff data
      console.log('💾 Saving medical staff information...');
      const { error: disclosureError } = await supabase
        .from('disclosure_forms')
        .update({
          office_patient_diagnosis: medicalData.diagnosis,
          office_stage: medicalData.stage || null,
          office_expected_treatments: medicalData.expectedTreatments ? parseInt(medicalData.expectedTreatments) : null,
          office_treatment_start_date: medicalData.treatmentStartDate || null,
          office_treatment_end_date: medicalData.treatmentEndDate || null,
          office_chemo_type: medicalData.chemoType.length > 0 ? medicalData.chemoType : null,
          office_chemo_frequency: medicalData.chemoFrequency || null,
          office_chemo_every_weeks: medicalData.chemoEveryWeeks ? parseInt(medicalData.chemoEveryWeeks) : null,
          office_radiation_frequency: medicalData.radiationFrequency || null,
          office_radiation_every_weeks: medicalData.radiationEveryWeeks ? parseInt(medicalData.radiationEveryWeeks) : null,
          office_staff_signature_date: medicalData.staffSignatureDate,
        })
        .eq('patient_id', task.patient_id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (disclosureError) {
        console.error('❌ Error updating disclosure form:', disclosureError);
        toast.error('Failed to save medical staff information');
        setIsUploading(false);
        return;
      }

      console.log('✅ Medical staff information saved');

      // Step 3: Update patient record - mark as received
      const { error: patientError } = await supabase
        .from('patients')
        .update({
          has_received_medical_release: true,
          medical_release_received_date: new Date().toISOString(),
        })
        .eq('id', task.patient_id);

      if (patientError) {
        console.error('❌ Error updating patient:', patientError);
      }

      // Step 4: Delete old Outform PDF (replace with Inform)
      console.log('🗑️ Removing old Outform PDF...');
      const { data: oldDocs } = await supabase
        .from('patient_documents')
        .select('*')
        .eq('patient_id', task.patient_id)
        .eq('document_type', 'disclosure_form')
        .ilike('document_name', '%Outform%');

      if (oldDocs && oldDocs.length > 0) {
        for (const doc of oldDocs) {
          await documentService.deleteDocument(doc.id);
        }
        console.log('✅ Old Outform PDF removed');
      }

      // Step 5: Complete the task
      const completeResult = await taskService.completeTask(task.id, {
        uploadedDocumentId: uploadResult.documentId,
        medicalStaffData: medicalData,
        notes: `Signed medical release received and processed. Diagnosis: ${medicalData.diagnosis}`,
      });

      if (!completeResult.success) {
        toast.error('Failed to complete task');
        setIsUploading(false);
        return;
      }

      toast.success('✅ Task completed successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('❌ Error completing task:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Complete Task</h2>
              <p className="text-gray-600 mt-1">{task.title}</p>
              <p className="text-sm text-gray-500 mt-1">Task Type: {task.task_type}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              disabled={isUploading}
            >
              ×
            </button>
          </div>
          
          {/* Regenerate Outform Button (for medical release tasks only) */}
          {isMedicalReleaseTask && (
            <div className="mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={handleRegenerateOutform}
                disabled={isRegenerating || isUploading}
              >
                {isRegenerating ? '⏳ Regenerating...' : '🔄 Regenerate Outform PDF'}
              </Button>
              <p className="text-xs text-gray-500 mt-1">
                Generate a new unsigned Outform PDF to send to medical provider
              </p>
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* Step 1: Upload Signed Form */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Step 1: Upload Signed Form
            </h3>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {uploadedFile ? (
                <div className="space-y-2">
                  <div className="text-4xl">✅</div>
                  <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-600">
                    {fileUploadService.formatFileSize(uploadedFile.size)}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setUploadedFile(null)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-4xl">📎</div>
                  <p className="text-gray-900 font-medium">
                    Drag & drop file here, or click to browse
                  </p>
                  <p className="text-sm text-gray-600">
                    Accepts: PDF, JPEG, PNG (max 10MB)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  <Button
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Browse Files
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Step 2: Enter Medical Staff Information (only for medical release tasks) */}
          {isMedicalReleaseTask && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Step 2: Enter Medical Staff Information
              </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Diagnosis <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={medicalData.diagnosis}
                    onChange={(e) => handleMedicalDataChange('diagnosis', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g., Lung Cancer Stage IIIA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stage
                  </label>
                  <input
                    type="text"
                    value={medicalData.stage}
                    onChange={(e) => handleMedicalDataChange('stage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g., Stage IIIA"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Treatments
                  </label>
                  <input
                    type="number"
                    value={medicalData.expectedTreatments}
                    onChange={(e) => handleMedicalDataChange('expectedTreatments', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g., 18"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Treatment Start Date
                  </label>
                  <input
                    type="date"
                    value={medicalData.treatmentStartDate}
                    onChange={(e) => handleMedicalDataChange('treatmentStartDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Treatment End Date
                  </label>
                  <input
                    type="date"
                    value={medicalData.treatmentEndDate}
                    onChange={(e) => handleMedicalDataChange('treatmentEndDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chemotherapy Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={medicalData.chemoType.includes('iv')}
                      onChange={() => handleChemoTypeToggle('iv')}
                      className="mr-2"
                    />
                    IV
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={medicalData.chemoType.includes('oral')}
                      onChange={() => handleChemoTypeToggle('oral')}
                      className="mr-2"
                    />
                    Oral
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chemo Frequency
                  </label>
                  <select
                    value={medicalData.chemoFrequency}
                    onChange={(e) => handleMedicalDataChange('chemoFrequency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select...</option>
                    <option value="weekly">Weekly</option>
                    <option value="bi_weekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Radiation Frequency
                  </label>
                  <select
                    value={medicalData.radiationFrequency}
                    onChange={(e) => handleMedicalDataChange('radiationFrequency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select...</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>
            </div>
            </Card>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleComplete}
            disabled={isUploading || !uploadedFile}
            variant="primary"
          >
            {isUploading ? '⏳ Processing...' : '✅ Complete Task'}
          </Button>
        </div>
      </div>
    </div>
  );
};
