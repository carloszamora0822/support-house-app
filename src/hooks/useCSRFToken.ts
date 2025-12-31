import { useEffect, useState } from 'react';
import { csrfToken } from '@/utils/csrfToken';

/**
 * React hook for CSRF token management
 * Automatically generates and manages CSRF tokens for forms
 */
export const useCSRFToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initToken = async () => {
      try {
        setIsLoading(true);
        const newToken = await csrfToken.ensure();
        
        if (!newToken) {
          setError('Failed to generate CSRF token');
        } else {
          setToken(newToken);
          setError(null);
        }
      } catch (err) {
        console.error('CSRF token initialization error:', err);
        setError('Failed to initialize CSRF protection');
      } finally {
        setIsLoading(false);
      }
    };

    initToken();
  }, []);

  const refresh = async () => {
    try {
      setIsLoading(true);
      const newToken = await csrfToken.generate();
      
      if (!newToken) {
        setError('Failed to refresh CSRF token');
      } else {
        setToken(newToken);
        setError(null);
      }
    } catch (err) {
      console.error('CSRF token refresh error:', err);
      setError('Failed to refresh CSRF protection');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    token,
    isLoading,
    error,
    refresh,
  };
};
