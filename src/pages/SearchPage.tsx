import { useNavigate } from 'react-router-dom';
import { usePatientSearch } from '@/features/lookup/hooks/usePatientSearch';
import { PageShell } from '@/components/patterns/page-shell';
import { AppHeader } from '@/components/patterns/app-header';
import { PageContent } from '@/components/patterns/page-content';
import { SectionHeader } from '@/components/patterns/section-header';
import { LoadingState } from '@/components/patterns/loading-state';
import { EmptyState } from '@/components/patterns/empty-state';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { calculateAge } from '@/utils/dateUtils';
import { formatPhoneNumber } from '@/utils/formatters';
import { Search, Users } from 'lucide-react';

export const SearchPage = () => {
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm, results, isLoading, error } = usePatientSearch();

  const handleSelectPatient = (patientId: string) => {
    navigate(`/patients/${patientId}`);
  };

  return (
    <PageShell variant="gradient">
      <AppHeader />
      
      <PageContent>
        <SectionHeader 
          title="Patient Search"
          description="Search by name, phone, email, or ZIP code"
        />

        <Card className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
            <Input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-lg"
            />
          </div>
        </Card>

        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        {isLoading && <LoadingState message="Searching patients..." />}

        {!isLoading && searchTerm && results.length === 0 && (
          <EmptyState
            icon={Users}
            title="No patients found"
            description="Try searching with a different term or check your spelling"
          />
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
      </PageContent>
    </PageShell>
  );
};
