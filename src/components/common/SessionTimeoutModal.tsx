// Session timeout warning modal for HIPAA compliance
import { useEffect, useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

interface SessionTimeoutModalProps {
  isOpen: boolean;
  secondsRemaining: number;
  onExtend: () => void;
  onLogout: () => void;
}

export function SessionTimeoutModal({
  isOpen,
  secondsRemaining,
  onExtend,
  onLogout,
}: SessionTimeoutModalProps) {
  const [countdown, setCountdown] = useState(secondsRemaining);

  useEffect(() => {
    setCountdown(secondsRemaining);
  }, [secondsRemaining]);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, onLogout]);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onExtend}
      title="Session Timeout Warning"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <svg
            className="w-6 h-6 text-yellow-600 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <p className="font-medium text-yellow-900">
              Your session is about to expire
            </p>
            <p className="text-sm text-yellow-700 mt-1">
              For security purposes, you will be automatically logged out due to inactivity.
            </p>
          </div>
        </div>

        <div className="text-center py-6">
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
          <p className="text-gray-600">
            Time remaining until automatic logout
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>HIPAA Compliance Notice:</strong> Sessions automatically expire after 15 minutes
            of inactivity to protect patient information.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            onClick={onLogout}
            variant="outline"
            className="flex-1"
          >
            Log Out Now
          </Button>
          <Button
            onClick={onExtend}
            variant="primary"
            className="flex-1"
          >
            Stay Logged In
          </Button>
        </div>
      </div>
    </Modal>
  );
}
