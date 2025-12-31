import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { patientService } from '@/features/patients/services/patientService';
import type { PatientWithVisits } from '@/features/patients/types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { formatPhoneNumber } from '@/utils/formatters';
import { formatDate, formatDateTime, calculateDaysSince } from '@/utils/dateUtils';
import { CheckInModal } from '@/features/checkin/components/CheckInModal';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { ASSISTANCE_TYPES } from '@/constants/assistanceTypes';
import { documentService } from '@/services/documentService';
import { taskService } from '@/services/taskService';
import type { PatientDocument } from '@/services/documentService';
import type { PendingTask } from '@/services/taskService';
import { PatientApplicationView } from '@/features/patients/components/PatientApplicationView';
import { CompleteTaskModal } from '@/features/tasks/CompleteTaskModal';
import { PDFPreviewModal } from '@/components/common/PDFPreviewModal';

export const PatientDetailPage = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [patient, setPatient] = useState<PatientWithVisits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [documents, setDocuments] = useState<PatientDocument[]>([]);
  const [pendingTasks, setPendingTasks] = useState<PendingTask[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [activeTab, setActiveTab] = useState<'application' | 'documents'>('application');
  const [isCompleteTaskModalOpen, setIsCompleteTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<PendingTask | null>(null);
  const [isPDFPreviewOpen, setIsPDFPreviewOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<PatientDocument | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>('');

  const formatAssistanceType = (value: string): string => {
    const type = ASSISTANCE_TYPES.find(t => t.value === value);
    return type ? type.label : value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const loadPatient = async () => {
    if (!patientId) return;

    try {
      setIsLoading(true);
      const data = await patientService.getPatientWithVisits(patientId);
      setPatient(data);
      
      // Load documents and tasks in parallel
      loadDocumentsAndTasks(patientId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load patient');
    } finally {
      setIsLoading(false);
    }
  };

  const loadDocumentsAndTasks = async (patientId: string) => {
    setIsLoadingDocuments(true);
    
    // Load documents
    const docsResult = await documentService.getPatientDocuments(patientId);
    if (docsResult.success && docsResult.documents) {
      setDocuments(docsResult.documents);
    }
    
    // Load pending tasks
    const tasksResult = await taskService.getPendingTasks(patientId);
    if (tasksResult.success && tasksResult.tasks) {
      setPendingTasks(tasksResult.tasks);
    }
    
    setIsLoadingDocuments(false);
  };

  const handleDownloadDocument = async (doc: PatientDocument) => {
    try {
      const result = await documentService.downloadDocument(doc.file_path);
      if (result.success && result.blob) {
        const url = URL.createObjectURL(result.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.document_name + '.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Document downloaded!');
      } else {
        toast.error(result.error || 'Failed to download document');
      }
    } catch (error) {
      toast.error('Failed to download document');
    }
  };

  useEffect(() => {
    loadPatient();
  }, [patientId]);

  const handleLogout = async () => {
    await logout();
  };

  const handleCheckInSuccess = () => {
    loadPatient();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 flex items-center justify-center">
        <Card className="max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Patient not found'}</p>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      <Toaster position="top-right" />
      
      <nav className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              ← Back to Dashboard
            </Button>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                <p className="text-xs text-purple-600 capitalize">{user?.role}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {patient.first_name} {patient.last_name}
                {patient.goes_by && ` "${patient.goes_by}"`}
              </h1>
              <p className="text-gray-600 mt-1">Patient ID: {patient.id}</p>
              {patient.diagnosis_primary && (
                <p className="text-purple-600 font-medium mt-1">📋 {patient.diagnosis_primary}</p>
              )}
            </div>
            <div>
              <Button 
                onClick={() => setIsCheckInModalOpen(true)}
                variant="primary"
              >
                ✅ Check In
              </Button>
            </div>
          </div>

          {/* Pending Tasks Alert */}
          {!patient.has_received_medical_release && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-yellow-800">
                    PENDING: Awaiting Signed Medical Release Form
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>Pre-filled disclosure form was sent to medical provider on {formatDate(patient.medical_release_sent_date || '')}.</p>
                    <p className="mt-1">Waiting {calculateDaysSince(new Date(patient.medical_release_sent_date || ''))} days for signed form to be returned.</p>
                  </div>
                  {pendingTasks.length > 0 && (
                    <div className="mt-3">
                      <Button 
                        size="sm"
                        onClick={() => {
                          setSelectedTask(pendingTasks[0]);
                          setIsCompleteTaskModalOpen(true);
                        }}
                        className="bg-yellow-600 hover:bg-yellow-700"
                      >
                        📋 Complete Pending Tasks ({pendingTasks.length})
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('application')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'application'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📋 Application
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'documents'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📄 Documents ({documents.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Application Tab */}
        {activeTab === 'application' && (
          <PatientApplicationView patient={patient} onUpdate={loadPatient} />
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Documents</h3>
              {isLoadingDocuments ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                </div>
              ) : documents.length > 0 ? (
                <div className="space-y-3">
                  {documents.map((doc) => {
                    const daysUntilExpiry = documentService.getDaysUntilExpiry(doc);
                    const isExpired = daysUntilExpiry !== null && daysUntilExpiry < 0;
                    const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry > 0 && daysUntilExpiry <= 30;
                    
                    return (
                      <div key={doc.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">📄</span>
                              <div>
                                <h4 className="font-medium text-gray-900">{doc.document_name}</h4>
                                <p className="text-sm text-gray-600">Created: {formatDate(doc.created_at)}</p>
                                {doc.expires_at && (
                                  <p className={`text-sm font-medium ${
                                    isExpired ? 'text-red-600' : isExpiringSoon ? 'text-yellow-600' : 'text-gray-600'
                                  }`}>
                                    {isExpired ? '🔴 EXPIRED' : isExpiringSoon ? '⚠️ Expires soon' : 'Expires'}: {formatDate(doc.expires_at)}
                                    {daysUntilExpiry !== null && (
                                      <span className="ml-1">({Math.abs(daysUntilExpiry)} days {isExpired ? 'ago' : 'remaining'})</span>
                                    )}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={async () => {
                                const result = await documentService.getDocumentUrl(doc.file_path);
                                if (result.success && result.url) {
                                  setPdfUrl(result.url);
                                  setSelectedDocument(doc);
                                  setIsPDFPreviewOpen(true);
                                } else {
                                  toast.error('Failed to load PDF preview');
                                }
                              }}
                            >
                              👁️ Preview
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleDownloadDocument(doc)}
                              variant="primary"
                            >
                              📥 Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-600">
                  <p className="text-4xl mb-2">📄</p>
                  <p>No documents found</p>
                  <p className="text-sm mt-1">Documents will appear here after intake form submission</p>
                </div>
              )}
            </Card>
          </div>
        )}

      </main>

      {patient && (
        <>
          <CheckInModal
            isOpen={isCheckInModalOpen}
            onClose={() => setIsCheckInModalOpen(false)}
            patientId={patient.id}
            patientName={`${patient.first_name} ${patient.last_name}`}
            lastVisitDate={patient.last_visit_date}
            onSuccess={handleCheckInSuccess}
          />
          
          {selectedTask && (
            <CompleteTaskModal
              isOpen={isCompleteTaskModalOpen}
              onClose={() => {
                setIsCompleteTaskModalOpen(false);
                setSelectedTask(null);
              }}
              task={selectedTask}
              patientName={`${patient.first_name} ${patient.last_name}`}
              patientId={patient.id}
              onSuccess={() => {
                loadPatient();
                loadDocumentsAndTasks(patient.id);
              }}
            />
          )}
        </>
      )}
      {selectedDocument && pdfUrl && (
        <PDFPreviewModal
          isOpen={isPDFPreviewOpen}
          onClose={() => {
            setIsPDFPreviewOpen(false);
            setSelectedDocument(null);
            setPdfUrl('');
          }}
          pdfUrl={pdfUrl}
          documentName={selectedDocument.document_name}
        />
      )}
    </div>
  );
};
