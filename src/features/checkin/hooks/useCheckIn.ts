import { useState } from 'react';
import { visitService } from '../services/visitService';
import type { CheckInInput } from '../types';
import type { Visit } from '@/types';

interface UseCheckInOptions {
  onSuccess?: (visit: Visit) => void;
}

export const useCheckIn = (options?: UseCheckInOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkIn = async (input: CheckInInput): Promise<Visit> => {
    setIsLoading(true);
    setError(null);

    try {
      const visit = await visitService.checkInPatient(input);
      
      if (options?.onSuccess) {
        options.onSuccess(visit);
      }

      return visit;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Check-in failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    checkIn,
    isLoading,
    error,
  };
};
