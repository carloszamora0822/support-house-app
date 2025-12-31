import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { AssistanceTrackingSection } from '@/features/assistance/AssistanceTrackingSection';
import { useCheckIn } from '../hooks/useCheckIn';
import { calculateDaysSince } from '@/utils/dateUtils';
import { assistanceItemService, type AssistanceItemInput } from '@/services/assistanceItemService';
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
  const [assistanceItems, setAssistanceItems] = useState<AssistanceItemInput[]>([]);
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
    setAssistanceItems([]);
    setNotes('');
    onClose();
  };

  const handleSubmit = async () => {
    if (assistanceItems.length === 0) {
      toast.error('Please add at least one assistance item');
      return;
    }

    try {
      // Create visit with check-in
      const visit = await checkIn({
        patient_id: patientId,
        assistance_requested: assistanceItems.map(item => item.assistance_type),
        visit_notes: notes || undefined,
      });

      // If visit created successfully, save detailed assistance items
      if (visit?.id) {
        await assistanceItemService.createAssistanceItems(
          visit.id,
          patientId,
          assistanceItems
        );
      }
    } catch {
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
            disabled={isLoading || assistanceItems.length === 0}
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

        <AssistanceTrackingSection
          items={assistanceItems}
          onChange={setAssistanceItems}
          title="Assistance Provided Today"
          description="Track items and services provided during this visit"
        />

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Visit Notes (Optional)
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
