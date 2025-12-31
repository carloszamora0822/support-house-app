import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { useCheckOut } from '../hooks/useCheckOut';
import { formatDuration } from '@/utils/dateUtils';
import toast from 'react-hot-toast';

interface CheckOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitId: string;
  patientName: string;
  checkInTime: string;
  onSuccess?: () => void;
}

export const CheckOutModal = ({
  isOpen,
  onClose,
  visitId,
  patientName,
  checkInTime,
  onSuccess,
}: CheckOutModalProps) => {
  const [notes, setNotes] = useState('');

  const { checkOut, isLoading } = useCheckOut({
    onSuccess: () => {
      toast.success('Patient checked out successfully!');
      handleClose();
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  const handleClose = () => {
    setNotes('');
    onClose();
  };

  const handleSubmit = async () => {
    try {
      await checkOut({
        visit_id: visitId,
        check_out_notes: notes || undefined,
      });
    } catch (err) {
      toast.error('Failed to check out patient');
    }
  };

  const duration = formatDuration(new Date(checkInTime), new Date());

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Check Out Patient"
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
            disabled={isLoading}
          >
            {isLoading ? 'Checking Out...' : 'Confirm Check-Out'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900">{patientName}</h4>
          <p className="text-sm text-gray-600">
            Check-in time: {new Date(checkInTime).toLocaleTimeString()}
          </p>
          <p className="text-sm text-gray-600">
            Time in facility: {duration}
          </p>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Check-out Notes (Optional)
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
      </div>
    </Modal>
  );
};
