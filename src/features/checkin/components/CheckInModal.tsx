import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { AssistanceSelector } from './AssistanceSelector';
import { useCheckIn } from '../hooks/useCheckIn';
import { calculateDaysSince } from '@/utils/dateUtils';
import toast from 'react-hot-toast';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  lastVisitDate?: string | null;
  onSuccess?: () => void;
}

export const CheckInModal = ({
  isOpen,
  onClose,
  patientId,
  patientName,
  lastVisitDate,
  onSuccess,
}: CheckInModalProps) => {
  const [selectedAssistance, setSelectedAssistance] = useState<string[]>([]);
  const [otherText, setOtherText] = useState('');
  const [notes, setNotes] = useState('');

  const { checkIn, isLoading, error } = useCheckIn({
    onSuccess: () => {
      toast.success('Patient checked in successfully!');
      handleClose();
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  const handleClose = () => {
    setSelectedAssistance([]);
    setOtherText('');
    setNotes('');
    onClose();
  };

  const handleSubmit = async () => {
    if (selectedAssistance.length === 0) {
      toast.error('Please select at least one assistance type');
      return;
    }

    try {
      await checkIn({
        patient_id: patientId,
        assistance_requested: selectedAssistance,
        visit_notes: notes || undefined,
      });
    } catch (err) {
      toast.error(error || 'Failed to check in patient');
    }
  };

  const daysSinceLastVisit = lastVisitDate
    ? calculateDaysSince(new Date(lastVisitDate))
    : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Check In Patient"
      footer={
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || selectedAssistance.length === 0}
          >
            {isLoading ? 'Checking In...' : 'Confirm Check-In'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900">{patientName}</h4>
          {lastVisitDate && (
            <p className="text-sm text-gray-600">
              Last visit: {new Date(lastVisitDate).toLocaleDateString()}
              {daysSinceLastVisit !== null && ` (${daysSinceLastVisit} days ago)`}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assistance Requested *
          </label>
          <AssistanceSelector
            selected={selectedAssistance}
            onChange={(selected, other) => {
              setSelectedAssistance(selected);
              if (other !== undefined) {
                setOtherText(other);
              }
            }}
            otherText={otherText}
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Add any notes about this visit..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}
      </div>
    </Modal>
  );
};
