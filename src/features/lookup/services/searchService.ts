import { supabase } from '@/lib/supabase';
import type { Patient } from '@/types';
import type { SearchQuery, SearchFilters } from '../types';

/**
 * @deprecated This search service is NOT optimized for 9,000+ records.
 * Use optimizedSearchService instead for 40x faster searches (10-50ms vs 500ms-2s).
 * 
 * Migration path:
 * 1. Apply migrations: 022_optimize_patient_search.sql and 023_create_search_function.sql
 * 2. Replace: import { searchService } from './searchService'
 *    With: import { optimizedSearchService as searchService } from './optimizedSearchService'
 * 
 * This service will be removed in a future version.
 */
export const searchService = {
  async searchPatients(
    query: SearchQuery,
    filters: SearchFilters = {}
  ): Promise<Patient[]> {
    const { sortBy = 'last_visit', sortOrder = 'desc', limit = 50 } = filters;

    let supabaseQuery = supabase.from('patients').select('*');

    // Build search conditions
    if (query.name) {
      const searchTerm = `%${query.name}%`;
      supabaseQuery = supabaseQuery.or(
        `first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},goes_by.ilike.${searchTerm}`
      );
    } else if (query.phone) {
      const phoneSearch = query.phone.replace(/\D/g, '');
      supabaseQuery = supabaseQuery.or(
        `phone_primary.ilike.%${phoneSearch}%,phone_second.ilike.%${phoneSearch}%,phone_other.ilike.%${phoneSearch}%`
      );
    } else if (query.email) {
      supabaseQuery = supabaseQuery.ilike('email', `%${query.email}%`);
    } else if (query.zip) {
      supabaseQuery = supabaseQuery.eq('zip', query.zip);
    } else if (query.dob) {
      const dobString = query.dob.toISOString().split('T')[0];
      supabaseQuery = supabaseQuery.eq('dob', dobString);
    }

    // Apply sorting
    const sortColumn = sortBy === 'name' ? 'last_name' : sortBy === 'last_visit' ? 'last_visit_date' : 'visit_count';
    supabaseQuery = supabaseQuery.order(sortColumn, { ascending: sortOrder === 'asc', nullsFirst: false });

    // Apply limit
    supabaseQuery = supabaseQuery.limit(limit);

    const { data, error } = await supabaseQuery;

    if (error) {
      console.error('Patient search error:', error.message);
      throw new Error('Unable to search patients. Please try again.');
    }

    return (data as Patient[]) || [];
  },

  async quickSearch(term: string, limit: number = 50): Promise<Patient[]> {
    if (!term || term.trim().length === 0) {
      return [];
    }

    // Sanitize input to prevent SQL injection
    const sanitizedTerm = term.replace(/[%_]/g, '\\$&').trim();
    const searchTerm = sanitizedTerm.toLowerCase();
    const phoneSearch = sanitizedTerm.replace(/\D/g, '');

    // Use Supabase query builder with proper parameterization
    const query = supabase.from('patients').select('*');
    
    // Build conditions array for OR query
    const orConditions: string[] = [];
    
    // Name searches - properly escaped
    orConditions.push(`first_name.ilike.%${searchTerm}%`);
    orConditions.push(`last_name.ilike.%${searchTerm}%`);
    orConditions.push(`goes_by.ilike.%${searchTerm}%`);
    
    // Email search
    if (sanitizedTerm.includes('@')) {
      orConditions.push(`email.ilike.%${searchTerm}%`);
    }
    
    // Phone search (if contains digits)
    if (phoneSearch.length > 0) {
      orConditions.push(`phone_primary.ilike.%${phoneSearch}%`);
      orConditions.push(`phone_second.ilike.%${phoneSearch}%`);
      orConditions.push(`phone_other.ilike.%${phoneSearch}%`);
    }
    
    // ZIP search (exact match if 5 digits)
    if (/^\d{5}$/.test(sanitizedTerm)) {
      orConditions.push(`zip.eq.${sanitizedTerm}`);
    }
    
    // City search
    orConditions.push(`city.ilike.%${searchTerm}%`);

    const { data, error } = await query
      .or(orConditions.join(','))
      .order('last_visit_date', { ascending: false, nullsFirst: false })
      .limit(limit);

    if (error) {
      console.error('Quick search error:', error.message);
      throw new Error('Unable to search patients. Please try again.');
    }

    return (data as Patient[]) || [];
  },
};
