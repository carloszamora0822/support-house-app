import type { Patient } from '@/types';

export interface SearchQuery {
  term?: string;
  name?: string;
  dob?: Date;
  phone?: string;
  email?: string;
  zip?: string;
}

export interface SearchResult extends Patient {
  matchScore?: number;
}

export interface SearchFilters {
  sortBy?: 'name' | 'last_visit' | 'visit_count';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}
