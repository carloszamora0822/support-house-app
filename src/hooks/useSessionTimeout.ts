// Hook for managing session timeout
import { useEffect, useState, useCallback } from 'react';
import { sessionManager } from '@/utils/sessionManager';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/features/auth/services/authService';
import { auditService } from '@/services/auditService';

export function useSessionTimeout() {
  const [showWarning, setShowWarning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const navigate = useNavigate();

  const handleTimeout = useCallback(async () => {
    // Log session timeout
    await auditService.logAuth('SESSION_TIMEOUT', 'Session expired due to inactivity', true, {
      success: false,
    });

    // Logout user
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error during timeout logout:', error);
    }

    // Redirect to login
    navigate('/login', {
      state: { message: 'Your session has expired. Please log in again.' },
    });
  }, [navigate]);

  const handleWarning = useCallback((seconds: number) => {
    setSecondsRemaining(seconds);
    setShowWarning(true);
  }, []);

  const handleExtend = useCallback(() => {
    sessionManager.extend();
    setShowWarning(false);
  }, []);

  const handleLogoutNow = useCallback(async () => {
    setShowWarning(false);
    await authService.logout();
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    // Initialize session manager
    sessionManager.init(handleTimeout, handleWarning);

    return () => {
      sessionManager.destroy();
    };
  }, [handleTimeout, handleWarning]);

  return {
    showWarning,
    secondsRemaining,
    handleExtend,
    handleLogoutNow,
  };
}
