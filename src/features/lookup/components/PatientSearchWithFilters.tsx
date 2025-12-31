import { useState } from 'react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Select } from '@/components/common/Select';
import { Card } from '@/components/common/Card';
import { Search, Calendar, Filter } from 'lucide-react';
import { usePatientSearch } from '../hooks/usePatientSearch';
import { SearchResults } from './SearchResults';
import { STATES } from '@/constants/states';

export const PatientSearchWithFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dobFilter, setDobFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'last_visit' | 'visit_count'>('last_visit');
  const [showFilters, setShowFilters] = useState(false);

  const { results, isLoading, error } = usePatientSearch(searchTerm);

  // Filter results based on DOB and state
  const filteredResults = results.filter(patient => {
    if (dobFilter && patient.dob !== dobFilter) return false;
    if (stateFilter && patient.state !== stateFilter) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'name') {
      return (a.last_name + a.first_name).localeCompare(b.last_name + b.first_name);
    } else if (sortBy === 'visit_count') {
      return (b.visit_count || 0) - (a.visit_count || 0);
    } else {
      // Sort by last_visit (most recent first)
      const dateA = a.last_visit_date ? new Date(a.last_visit_date).getTime() : 0;
      const dateB = b.last_visit_date ? new Date(b.last_visit_date).getTime() : 0;
      return dateB - dateA;
    }
  });

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <Card>
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search by name, phone, email, or ZIP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="date"
                    value={dobFilter}
                    onChange={(e) => setDobFilter(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <Select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                >
                  <option value="">All States</option>
                  {STATES.map(state => (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'last_visit' | 'visit_count')}
                >
                  <option value="last_visit">Last Visit</option>
                  <option value="name">Name</option>
                  <option value="visit_count">Visit Count</option>
                </Select>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Search Results */}
      {error && (
        <Card className="bg-red-50 border-red-200">
          <p className="text-red-600">{error}</p>
        </Card>
      )}

      {isLoading ? (
        <Card>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </Card>
      ) : filteredResults.length > 0 ? (
        <SearchResults patients={filteredResults} />
      ) : searchTerm && !isLoading ? (
        <Card>
          <p className="text-center text-gray-500 py-8">
            No patients found matching your search criteria.
          </p>
        </Card>
      ) : null}
    </div>
  );
};
