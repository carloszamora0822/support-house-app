import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Alert } from '@/components/common/Alert';
import { MFAVerificationModal } from './MFAVerificationModal';
import { mfaService } from '../services/mfaService';
import type { LoginCredentials } from '../types';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => Promise<void>;
}

export const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMFAModal, setShowMFAModal] = useState(false);
  const [pendingCredentials, setPendingCredentials] = useState<LoginCredentials | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  const handleFormSubmit = async (data: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // First, attempt login with password
      await onSubmit(data);
      
      // Check if user has MFA enabled
      const mfaEnabled = await mfaService.isMFAEnabled();
      
      if (mfaEnabled) {
        // Store credentials and show MFA modal
        setPendingCredentials(data);
        setShowMFAModal(true);
        setIsLoading(false);
      }
      // If no MFA, login is complete (onSubmit already succeeded)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setIsLoading(false);
    }
  };

  const handleMFASuccess = () => {
    setShowMFAModal(false);
    setPendingCredentials(null);
    // Login complete - user is already authenticated
  };

  const handleMFACancel = async () => {
    setShowMFAModal(false);
    setPendingCredentials(null);
    setError('2FA verification required to complete login');
    // Log out since MFA was not completed
    try {
      const { supabase } = await import('@/lib/supabase');
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Failed to sign out after MFA cancel:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          error={!!errors.email}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          error={!!errors.password}
          disabled={isLoading}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" loading={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-purple-600 hover:text-purple-700 font-medium">
            Request Access
          </a>
        </p>
        <p className="text-xs text-gray-500 mt-2">
          New users require admin approval
        </p>
      </div>

      <MFAVerificationModal
        isOpen={showMFAModal}
        onSuccess={handleMFASuccess}
        onCancel={handleMFACancel}
      />
    </form>
  );
};
