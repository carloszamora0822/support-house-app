import { useState } from 'react';
import { mfaService } from '../services/mfaService';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import toast from 'react-hot-toast';

interface MFASetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const MFASetupModal = ({ isOpen, onClose, onSuccess }: MFASetupModalProps) => {
  const [step, setStep] = useState<'enroll' | 'verify'>('enroll');
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [factorId, setFactorId] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEnroll = async () => {
    setIsLoading(true);
    try {
      const result = await mfaService.enrollMFA();

      if (!result.success || !result.qrCode || !result.secret) {
        toast.error(result.error || 'Failed to enroll in 2FA');
        return;
      }

      setQrCode(result.qrCode);
      setSecret(result.secret);
      
      const factors = await mfaService.getMFAFactors();
      if (factors && factors.totp.length > 0) {
        setFactorId(factors.totp[0].id);
      }

      setStep('verify');
      toast.success('Scan the QR code with your authenticator app');
    } catch (error) {
      console.error('Enrollment error:', error);
      toast.error('Failed to set up 2FA');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);
    try {
      const result = await mfaService.verifyEnrollment(verificationCode, factorId);

      if (!result.success) {
        toast.error(result.error || 'Invalid verification code');
        return;
      }

      toast.success('Two-factor authentication enabled successfully!');
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Failed to verify code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep('enroll');
    setQrCode('');
    setSecret('');
    setFactorId('');
    setVerificationCode('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {step === 'enroll' ? 'Enable Two-Factor Authentication' : 'Verify Your Code'}
          </h2>

          {step === 'enroll' ? (
            <div>
              <p className="text-gray-600 mb-6">
                Two-factor authentication adds an extra layer of security to your account.
                You'll need an authenticator app like Google Authenticator or Authy.
              </p>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>HIPAA Requirement:</strong> Admin accounts must have 2FA enabled
                  to protect patient data.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleEnroll}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'Setting up...' : 'Continue'}
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Scan this QR code with your authenticator app:
                </p>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-4 flex justify-center mb-4">
                  <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-xs text-gray-600 mb-2">
                    Or enter this code manually:
                  </p>
                  <code className="text-sm font-mono text-gray-900 break-all">
                    {secret}
                  </code>
                </div>

                <p className="text-gray-600 mb-4">
                  Enter the 6-digit code from your authenticator app:
                </p>

                <Input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="text-center text-2xl tracking-widest font-mono"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
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
                  {isLoading ? 'Verifying...' : 'Verify & Enable'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
