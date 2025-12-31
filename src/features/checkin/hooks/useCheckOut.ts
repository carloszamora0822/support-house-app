import { useState } from 'react';
import { visitService } from '../services/visitService';
import type { Visit } from '@/types';

interface CheckOutInput {
  visit_id: string;
  check_out_notes?: string;
}

interface UseCheckOutOptions {
  onSuccess?: (visit: Visit) => void;
}

export const useCheckOut = (options?: UseCheckOutOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkOut = async (input: CheckOutInput): Promise<Visit> => {
    setIsLoading(true);
    setError(null);

    try {
      const visit = await visitService.checkOutPatient(input.visit_id, input.check_out_notes);
      
      if (options?.onSuccess) {
        options.onSuccess(visit);
      }

      return visit;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Check-out failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    checkOut,
    isLoading,
    error,
  };
};
