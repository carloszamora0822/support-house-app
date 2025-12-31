import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, User, Phone, Calendar, MapPin, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils/cn';

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  phone_primary: string | null;
  date_of_birth: string | null;
  diagnosis_primary: string | null;
  city: string | null;
  state: string | null;
  visit_count: number;
}

interface InlinePatientSearchProps {
  onPatientSelect?: (patientId: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const InlinePatientSearch = ({ 
  onPatientSelect, 
  placeholder = "Search by name, phone, or date of birth...",
  autoFocus = true 
}: InlinePatientSearchProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Patient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchPatients = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    setShowResults(true);

    try {
      const searchTerm = `%${searchQuery}%`;
      
      // Search by name, phone, or DOB
      const { data, error } = await supabase
        .from('patients')
        .select('id, first_name, last_name, phone_primary, date_of_birth, diagnosis_primary, city, state, visit_count')
        .or(`first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},phone_primary.ilike.${searchTerm},date_of_birth.ilike.${searchTerm}`)
        .order('last_name')
        .limit(10);

      if (error) throw error;

      setResults(data || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchPatients(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, searchPatients]);

  const handlePatientClick = (patientId: string) => {
    if (onPatientSelect) {
      onPatientSelect(patientId);
    } else {
      navigate(`/patients/${patientId}`);
    }
    setQuery('');
    setShowResults(false);
  };

  const formatPhone = (phone: string | null) => {
    if (!phone) return null;
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const formatDate = (date: string | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            "w-full pl-12 pr-12 py-4 text-lg",
            "bg-white border-2 border-border rounded-xl",
            "focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100",
            "transition-all duration-200",
            "placeholder:text-text-subtle"
          )}
        />
        {isSearching && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-600 animate-spin" />
        )}
        {query && !isSearching && (
          <button
            onClick={() => {
              setQuery('');
              setShowResults(false);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted hover:text-text transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {showResults && (
        <Card className="absolute top-full left-0 right-0 mt-2 max-h-[500px] overflow-y-auto shadow-2xl border-2 border-primary-200 z-50">
          {results.length > 0 ? (
            <div className="divide-y divide-border">
              {results.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => handlePatientClick(patient.id)}
                  className="w-full p-4 hover:bg-surface-muted transition-colors text-left group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Name and Badge */}
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-text group-hover:text-primary-600 transition-colors">
                            {patient.first_name} {patient.last_name}
                          </h3>
                          {patient.diagnosis_primary && (
                            <p className="text-sm text-text-muted">{patient.diagnosis_primary}</p>
                          )}
                        </div>
                      </div>

                      {/* Patient Info Grid */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm ml-13">
                        {patient.phone_primary && (
                          <div className="flex items-center gap-2 text-text-muted">
                            <Phone className="h-3 w-3" />
                            <span>{formatPhone(patient.phone_primary)}</span>
                          </div>
                        )}
                        {patient.date_of_birth && (
                          <div className="flex items-center gap-2 text-text-muted">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(patient.date_of_birth)}</span>
                          </div>
                        )}
                        {(patient.city || patient.state) && (
                          <div className="flex items-center gap-2 text-text-muted">
                            <MapPin className="h-3 w-3" />
                            <span>{[patient.city, patient.state].filter(Boolean).join(', ')}</span>
                          </div>
                        )}
                        {patient.visit_count > 0 && (
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {patient.visit_count} visit{patient.visit_count !== 1 ? 's' : ''}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="text-primary-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                      →
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-8 text-center">
              <User className="h-12 w-12 mx-auto mb-3 text-text-muted opacity-30" />
              <p className="text-text-muted mb-1">No patients found</p>
              <p className="text-sm text-text-subtle">
                Try searching by name, phone number, or date of birth
              </p>
            </div>
          ) : (
            <div className="p-8 text-center">
              <Search className="h-12 w-12 mx-auto mb-3 text-text-muted opacity-30" />
              <p className="text-text-muted">Type at least 2 characters to search</p>
            </div>
          )}
        </Card>
      )}

      {/* Keyboard Hint */}
      {!showResults && (
        <p className="text-xs text-text-muted mt-2 ml-1">
          Press <kbd className="px-2 py-1 bg-surface rounded border text-xs">Ctrl+K</kbd> to focus search
        </p>
      )}
    </div>
  );
};
