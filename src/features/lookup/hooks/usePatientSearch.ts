import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { searchService } from '../services/searchService';
import type { Patient } from '@/types';

export const usePatientSearch = (initialTerm: string = '') => {
  const [searchTerm, setSearchTerm] = useState(initialTerm);
  const [debouncedTerm] = useDebounce(searchTerm, 300);
  const [results, setResults] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedTerm || debouncedTerm.trim().length === 0) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const searchResults = await searchService.quickSearch(debouncedTerm);
        setResults(searchResults);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedTerm]);

  return {
    searchTerm,
    setSearchTerm,
    results,
    isLoading,
    error,
  };
};
