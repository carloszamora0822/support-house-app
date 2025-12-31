import { useState } from 'react';
import { mfaService } from '../services/mfaService';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import toast from 'react-hot-toast';

interface MFAVerificationModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export const MFAVerificationModal = ({ isOpen, onSuccess, onCancel }: MFAVerificationModalProps) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);
    try {
      const result = await mfaService.verifyMFALogin(verificationCode);

      if (!result.success) {
        toast.error(result.error || 'Invalid verification code');
        setVerificationCode('');
        return;
      }

      toast.success('Verification successful!');
      onSuccess();
    } catch (error) {
      console.error('MFA verification error:', error);
      toast.error('Failed to verify code');
      setVerificationCode('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && verificationCode.length === 6) {
      handleVerify();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Two-Factor Authentication
          </h2>
          <p className="text-gray-600 mb-6">
            Enter the 6-digit code from your authenticator app
          </p>

          <div className="mb-6">
            <Input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              onKeyPress={handleKeyPress}
              placeholder="000000"
              maxLength={6}
              className="text-center text-2xl tracking-widest font-mono"
              autoFocus
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleVerify}
              disabled={isLoading || verificationCode.length !== 6}
              className="flex-1"
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Lost access to your authenticator? Contact an administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
