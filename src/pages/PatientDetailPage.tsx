import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { patientService } from '@/features/patients/services/patientService';
import type { PatientWithVisits } from '@/features/patients/types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { formatPhoneNumber } from '@/utils/formatters';
import { formatDate, formatDateTime } from '@/utils/dateUtils';
import { CheckInModal } from '@/features/checkin/components/CheckInModal';
import { Toaster } from 'react-hot-toast';
import { ASSISTANCE_TYPES } from '@/constants/assistanceTypes';

export const PatientDetailPage = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [patient, setPatient] = useState<PatientWithVisits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load patient');
    } finally {
      setIsLoading(false);
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
          <Button onClick={() => navigate('/search')}>Back to Search</Button>
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
            <Button variant="outline" onClick={() => navigate('/search')}>
              ← Back to Search
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
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {patient.first_name} {patient.last_name}
              {patient.goes_by && ` "${patient.goes_by}"`}
            </h1>
            <p className="text-gray-600 mt-1">Patient ID: {patient.id}</p>
          </div>
          <Button 
            onClick={() => setIsCheckInModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            ✅ Check In This Patient
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Email:</span>
                <span className="ml-2 font-medium">{patient.email || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-600">Primary Phone:</span>
                <span className="ml-2 font-medium">{formatPhoneNumber(patient.phone_primary)}</span>
              </div>
              {patient.phone_second && (
                <div>
                  <span className="text-gray-600">Secondary Phone:</span>
                  <span className="ml-2 font-medium">{formatPhoneNumber(patient.phone_second)}</span>
                </div>
              )}
              <div>
                <span className="text-gray-600">Address:</span>
                <span className="ml-2 font-medium">
                  {patient.address}, {patient.city}, {patient.state} {patient.zip}
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Visit Summary</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Total Visits:</span>
                <span className="ml-2 font-medium text-2xl text-purple-600">{patient.visit_count || 0}</span>
              </div>
              <div>
                <span className="text-gray-600">Last Visit:</span>
                <span className="ml-2 font-medium">
                  {patient.last_visit_date ? formatDate(patient.last_visit_date) : 'Never'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className="ml-2 font-medium capitalize">{patient.patient_status}</span>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Visit History ({patient.visits?.length || 0})
          </h3>
          {patient.visits && patient.visits.length > 0 ? (
            <div className="space-y-3">
              {patient.visits.map((visit) => {
                const assistanceList = Array.isArray(visit.assistance_requested) 
                  ? visit.assistance_requested 
                  : [];
                const hasOther = assistanceList.includes('other');
                const formattedAssistance = assistanceList
                  .map(type => formatAssistanceType(type))
                  .join(', ');

                return (
                  <div key={visit.id} className="border-l-4 border-purple-500 pl-4 py-2">
                    <div className="font-medium text-gray-900">{formatDateTime(visit.check_in_timestamp)}</div>
                    <div className="text-sm text-gray-600">Staff: {visit.staff_name || 'Unknown'}</div>
                    {assistanceList.length > 0 && (
                      <div className="text-sm text-gray-600">
                        Assistance: {formattedAssistance}
                      </div>
                    )}
                    {visit.visit_notes && (
                      <div className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">{hasOther ? 'Other Details: ' : 'Notes: '}</span>
                        {visit.visit_notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">No visits recorded</p>
          )}
        </Card>
      </main>

      {patient && (
        <CheckInModal
          isOpen={isCheckInModalOpen}
          onClose={() => setIsCheckInModalOpen(false)}
          patientId={patient.id}
          patientName={`${patient.first_name} ${patient.last_name}`}
          lastVisitDate={patient.last_visit_date}
          onSuccess={handleCheckInSuccess}
        />
      )}
    </div>
  );
};
