import { useNavigate } from 'react-router-dom';
import { usePatientSearch } from '@/features/lookup/hooks/usePatientSearch';
import { Input } from '@/components/common/Input';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { calculateAge } from '@/utils/dateUtils';
import { formatPhoneNumber } from '@/utils/formatters';

export const SearchPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { searchTerm, setSearchTerm, results, isLoading, error } = usePatientSearch();

  const handleSelectPatient = (patientId: string) => {
    navigate(`/patients/${patientId}`);
  };

  const handleLogout = async () => {
    await logout();
  };

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
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                Dashboard
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Patient Search 🔍</h2>
          <p className="text-purple-600">Search by name, phone, email, or ZIP code</p>
        </div>

        <Card className="mb-6">
          <Input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-lg"
          />
        </Card>

        {error && (
          <Card className="mb-6 bg-red-50 border-red-200">
            <p className="text-red-600">{error}</p>
          </Card>
        )}

        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        )}

        {!isLoading && searchTerm && results.length === 0 && (
          <Card className="text-center py-12">
            <span className="text-6xl mb-4 block">🔍</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No patients found</h3>
            <p className="text-gray-600">Try searching with a different term</p>
          </Card>
        )}

        {!isLoading && results.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">{results.length} patient{results.length !== 1 ? 's' : ''} found</p>
            {results.map((patient) => (
              <Card
                key={patient.id}
                className="hover:shadow-lg transition-shadow cursor-pointer border-purple-100"
                onClick={() => handleSelectPatient(patient.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {patient.first_name} {patient.last_name}
                      {patient.goes_by && <span className="text-purple-600 ml-2">"{patient.goes_by}"</span>}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p><span className="font-medium">DOB:</span> {patient.dob} ({calculateAge(patient.dob)} years old)</p>
                        <p><span className="font-medium">Phone:</span> {formatPhoneNumber(patient.phone_primary)}</p>
                      </div>
                      <div>
                        <p><span className="font-medium">City:</span> {patient.city}, {patient.state} {patient.zip}</p>
                        <p><span className="font-medium">Visits:</span> {patient.visit_count || 0} total</p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <Button variant="outline" size="sm">View Details →</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
