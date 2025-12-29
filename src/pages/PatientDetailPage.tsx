import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { patientService } from '@/features/patients/services/patientService';
import type { PatientWithVisits } from '@/features/patients/types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { formatPhoneNumber } from '@/utils/formatters';
import { formatDate, formatDateTime } from '@/utils/dateUtils';

export const PatientDetailPage = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [patient, setPatient] = useState<PatientWithVisits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    loadPatient();
  }, [patientId]);

  const handleLogout = async () => {
    await logout();
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
        <Card>
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error || 'Patient not found'}</p>
          <Button onClick={() => navigate('/search')} className="mt-4">Back to Search</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Support House
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => navigate('/search')}>
                ← Back to Search
              </Button>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                <p className="text-xs text-purple-600 capitalize">{user?.role}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="border-purple-200 hover:bg-purple-50">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {patient.first_name} {patient.last_name}
            {patient.goes_by && <span className="text-purple-600 ml-2">"{patient.goes_by}"</span>}
          </h2>
          <p className="text-purple-600">{patient.age} years old • {patient.visit_count || 0} total visits</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card className="border-purple-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">👤</span>
              Contact Information
            </h3>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">DOB:</span> {formatDate(patient.dob)}</div>
              <div><span className="font-medium">Email:</span> {patient.email || 'Not provided'}</div>
              <div><span className="font-medium">Primary Phone:</span> {formatPhoneNumber(patient.phone_primary)}</div>
              {patient.phone_second && <div><span className="font-medium">Second Phone:</span> {formatPhoneNumber(patient.phone_second)}</div>}
              {patient.phone_other && <div><span className="font-medium">Other Phone:</span> {formatPhoneNumber(patient.phone_other)}</div>}
              <div className="pt-2 border-t">
                <div><span className="font-medium">Address:</span></div>
                <div>{patient.address}</div>
                <div>{patient.city}, {patient.state} {patient.zip}</div>
              </div>
            </div>
          </Card>

          <Card className="border-purple-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Demographics
            </h3>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Status:</span> {patient.status || 'Not specified'}</div>
              <div><span className="font-medium">Ethnicity:</span> {patient.ethnicity || 'Not specified'}</div>
              <div><span className="font-medium">Language:</span> {patient.language || 'Not specified'}</div>
              <div><span className="font-medium">Education:</span> {patient.education || 'Not specified'}</div>
              <div><span className="font-medium">Employment:</span> {patient.employment_status || 'Not specified'}</div>
              <div><span className="font-medium">Marital Status:</span> {patient.marital_status || 'Not specified'}</div>
            </div>
          </Card>
        </div>

        {patient.emergency_contact && (
          <Card className="border-purple-100 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🚨</span>
              Emergency Contact
            </h3>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Name:</span> {patient.emergency_contact.name}</div>
              <div><span className="font-medium">Relationship:</span> {patient.emergency_contact.relationship}</div>
              <div><span className="font-medium">Phone:</span> {formatPhoneNumber(patient.emergency_contact.phone)}</div>
            </div>
          </Card>
        )}

        <Card className="border-purple-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">📅</span>
            Visit History ({patient.visits?.length || 0})
          </h3>
          {patient.visits && patient.visits.length > 0 ? (
            <div className="space-y-3">
              {patient.visits.map((visit) => (
                <div key={visit.id} className="border-l-4 border-purple-500 pl-4 py-2">
                  <div className="font-medium text-gray-900">{formatDateTime(visit.check_in_timestamp)}</div>
                  <div className="text-sm text-gray-600">Staff: {visit.staff_name || 'Unknown'}</div>
                  {visit.assistance_requested && (
                    <div className="text-sm text-gray-600">Assistance: {visit.assistance_requested}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">No visits recorded</p>
          )}
        </Card>
      </main>
    </div>
  );
};
