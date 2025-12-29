import { supabase } from '@/lib/supabase';
import type { Patient } from '@/types';
import type { SearchQuery, SearchFilters } from '../types';

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
      throw new Error(error.message);
    }

    return (data as Patient[]) || [];
  },

  async quickSearch(term: string, limit: number = 50): Promise<Patient[]> {
    if (!term || term.trim().length === 0) {
      return [];
    }

    const searchTerm = term.toLowerCase();
    const phoneSearch = term.replace(/\D/g, '');

    // Build OR conditions for search
    const conditions: string[] = [];
    
    // Name search (case-insensitive partial match)
    conditions.push(`first_name.ilike.%${searchTerm}%`);
    conditions.push(`last_name.ilike.%${searchTerm}%`);
    conditions.push(`goes_by.ilike.%${searchTerm}%`);
    
    // Email search
    if (term.includes('@')) {
      conditions.push(`email.ilike.%${searchTerm}%`);
    }
    
    // Phone search (if contains digits)
    if (phoneSearch.length > 0) {
      conditions.push(`phone_primary.ilike.%${phoneSearch}%`);
      conditions.push(`phone_second.ilike.%${phoneSearch}%`);
      conditions.push(`phone_other.ilike.%${phoneSearch}%`);
    }
    
    // ZIP search (exact match if 5 digits)
    if (/^\d{5}$/.test(term)) {
      conditions.push(`zip.eq.${term}`);
    }
    
    // City search
    conditions.push(`city.ilike.%${searchTerm}%`);

    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .or(conditions.join(','))
      .order('last_visit_date', { ascending: false, nullsFirst: false })
      .limit(limit);

    if (error) {
      throw new Error(error.message);
    }

    return (data as Patient[]) || [];
  },
};
