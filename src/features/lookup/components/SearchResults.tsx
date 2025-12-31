import { PatientCard } from './PatientCard';
import type { Patient } from '@/types';

interface SearchResultsProps {
  patients: Patient[];
}

export const SearchResults = ({ patients }: SearchResultsProps) => {
  return (
    <div className="space-y-3">
      {patients.map((patient) => (
        <PatientCard key={patient.id} patient={patient} />
      ))}
    </div>
  );
};
