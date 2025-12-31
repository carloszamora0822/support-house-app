import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { formatPhoneNumber } from '@/utils/formatters';
import { calculateAge, formatDate } from '@/utils/dateUtils';
import type { Patient } from '@/types';

interface PatientCardProps {
  patient: Patient;
}

export const PatientCard = ({ patient }: PatientCardProps) => {
  const navigate = useNavigate();
  const age = patient.dob ? calculateAge(new Date(patient.dob)) : null;
  
  const handleClick = () => {
    navigate(`/patients/${patient.id}`);
  };

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {patient.first_name} {patient.last_name}
            </h3>
            {patient.goes_by && (
              <span className="text-sm text-gray-600">(goes by: {patient.goes_by})</span>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">DOB:</span> {formatDate(patient.dob)}
              {age !== null && ` (${age} years)`}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {formatPhoneNumber(patient.phone_primary)}
            </div>
            <div>
              <span className="font-medium">Location:</span> {patient.city}, {patient.state} {patient.zip}
            </div>
            {patient.email && (
              <div>
                <span className="font-medium">Email:</span> {patient.email}
              </div>
            )}
          </div>
        </div>
        
        <div className="text-right space-y-2">
          {patient.last_visit_date && (
            <div className="text-sm">
              <div className="text-gray-500">Last Visit</div>
              <div className="font-medium">{formatDate(patient.last_visit_date)}</div>
            </div>
          )}
          <Badge variant={patient.visit_count > 0 ? 'primary' : 'secondary'}>
            {patient.visit_count || 0} visits
          </Badge>
        </div>
      </div>
    </Card>
  );
};
