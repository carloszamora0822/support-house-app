import { describe, it, expect, beforeEach, vi } from 'vitest';
import { formService } from './formService';
import type { PatientInformationInput } from '../intake/types';

describe('formService', () => {
  const mockFormData: Partial<PatientInformationInput> = {
    first_name: 'John',
    last_name: 'Doe',
    dob: '1980-01-15',
    phone_primary: '555-123-4567',
    address: '123 Main St',
    city: 'Fort Smith',
    state: 'AR',
    zip: '72901',
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  describe('saveDraft', () => {
    it('saves form data to localStorage', () => {
      formService.saveDraft('patient-intake', mockFormData);
      
      const saved = localStorage.getItem('draft_patient-intake');
      expect(saved).toBeTruthy();
      
      const parsed = JSON.parse(saved!);
      expect(parsed.data).toEqual(mockFormData);
    });

    it('includes timestamp when saving', () => {
      const beforeSave = Date.now();
      formService.saveDraft('patient-intake', mockFormData);
      const afterSave = Date.now();
      
      const saved = localStorage.getItem('draft_patient-intake');
      const parsed = JSON.parse(saved!);
      
      expect(parsed.timestamp).toBeGreaterThanOrEqual(beforeSave);
      expect(parsed.timestamp).toBeLessThanOrEqual(afterSave);
    });

    it('overwrites existing draft', () => {
      formService.saveDraft('patient-intake', { first_name: 'Jane' });
      formService.saveDraft('patient-intake', mockFormData);
      
      const saved = localStorage.getItem('draft_patient-intake');
      const parsed = JSON.parse(saved!);
      
      expect(parsed.data.first_name).toBe('John');
    });

    it('handles empty data', () => {
      formService.saveDraft('patient-intake', {});
      
      const saved = localStorage.getItem('draft_patient-intake');
      expect(saved).toBeTruthy();
      
      const parsed = JSON.parse(saved!);
      expect(parsed.data).toEqual({});
    });

    it('returns true on successful save', () => {
      const result = formService.saveDraft('patient-intake', mockFormData);
      expect(result).toBe(true);
    });

    it('returns false on localStorage error', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      
      const result = formService.saveDraft('patient-intake', mockFormData);
      expect(result).toBe(false);
    });
  });

  describe('loadDraft', () => {
    it('loads saved draft from localStorage', () => {
      formService.saveDraft('patient-intake', mockFormData);
      
      const loaded = formService.loadDraft('patient-intake');
      expect(loaded).toEqual(mockFormData);
    });

    it('returns null when no draft exists', () => {
      const loaded = formService.loadDraft('patient-intake');
      expect(loaded).toBeNull();
    });

    it('returns null for corrupted data', () => {
      localStorage.setItem('draft_patient-intake', 'invalid json');
      
      const loaded = formService.loadDraft('patient-intake');
      expect(loaded).toBeNull();
    });

    it('returns null for draft without data property', () => {
      localStorage.setItem('draft_patient-intake', JSON.stringify({ timestamp: Date.now() }));
      
      const loaded = formService.loadDraft('patient-intake');
      expect(loaded).toBeNull();
    });

    it('loads most recent draft when multiple saves', () => {
      formService.saveDraft('patient-intake', { first_name: 'Jane' });
      formService.saveDraft('patient-intake', mockFormData);
      
      const loaded = formService.loadDraft('patient-intake');
      expect(loaded?.first_name).toBe('John');
    });
  });

  describe('clearDraft', () => {
    it('removes draft from localStorage', () => {
      formService.saveDraft('patient-intake', mockFormData);
      formService.clearDraft('patient-intake');
      
      const saved = localStorage.getItem('draft_patient-intake');
      expect(saved).toBeNull();
    });

    it('does nothing when no draft exists', () => {
      expect(() => formService.clearDraft('patient-intake')).not.toThrow();
    });

    it('clears specific draft without affecting others', () => {
      formService.saveDraft('patient-intake', mockFormData);
      formService.saveDraft('medical-info', { cancer_type: 'breast' });
      
      formService.clearDraft('patient-intake');
      
      expect(localStorage.getItem('draft_patient-intake')).toBeNull();
      expect(localStorage.getItem('draft_medical-info')).toBeTruthy();
    });
  });

  describe('hasDraft', () => {
    it('returns true when draft exists', () => {
      formService.saveDraft('patient-intake', mockFormData);
      
      const result = formService.hasDraft('patient-intake');
      expect(result).toBe(true);
    });

    it('returns false when no draft exists', () => {
      const result = formService.hasDraft('patient-intake');
      expect(result).toBe(false);
    });

    it('returns false for corrupted draft', () => {
      localStorage.setItem('draft_patient-intake', 'invalid');
      
      const result = formService.hasDraft('patient-intake');
      expect(result).toBe(false);
    });
  });

  describe('getDraftAge', () => {
    it('returns age in milliseconds', () => {
      formService.saveDraft('patient-intake', mockFormData);
      
      vi.useFakeTimers();
      vi.advanceTimersByTime(5000); // 5 seconds
      
      const age = formService.getDraftAge('patient-intake');
      expect(age).toBeGreaterThanOrEqual(5000);
      
      vi.useRealTimers();
    });

    it('returns null when no draft exists', () => {
      const age = formService.getDraftAge('patient-intake');
      expect(age).toBeNull();
    });

    it('returns null for corrupted draft', () => {
      localStorage.setItem('draft_patient-intake', 'invalid');
      
      const age = formService.getDraftAge('patient-intake');
      expect(age).toBeNull();
    });
  });

  describe('getAllDrafts', () => {
    it('returns all draft keys', () => {
      formService.saveDraft('patient-intake', mockFormData);
      formService.saveDraft('medical-info', {});
      formService.saveDraft('disclosure', {});
      
      const drafts = formService.getAllDrafts();
      expect(drafts).toHaveLength(3);
      expect(drafts).toContain('patient-intake');
      expect(drafts).toContain('medical-info');
      expect(drafts).toContain('disclosure');
    });

    it('returns empty array when no drafts exist', () => {
      const drafts = formService.getAllDrafts();
      expect(drafts).toEqual([]);
    });

    it('ignores non-draft localStorage items', () => {
      localStorage.setItem('user-settings', 'value');
      localStorage.setItem('theme', 'dark');
      formService.saveDraft('patient-intake', mockFormData);
      
      const drafts = formService.getAllDrafts();
      expect(drafts).toHaveLength(1);
      expect(drafts).toContain('patient-intake');
    });
  });

  describe('clearAllDrafts', () => {
    it('removes all drafts from localStorage', () => {
      formService.saveDraft('patient-intake', mockFormData);
      formService.saveDraft('medical-info', {});
      formService.saveDraft('disclosure', {});
      
      formService.clearAllDrafts();
      
      expect(formService.getAllDrafts()).toHaveLength(0);
    });

    it('preserves non-draft localStorage items', () => {
      localStorage.setItem('user-settings', 'value');
      formService.saveDraft('patient-intake', mockFormData);
      
      formService.clearAllDrafts();
      
      expect(localStorage.getItem('user-settings')).toBe('value');
      expect(formService.getAllDrafts()).toHaveLength(0);
    });
  });

  describe('Edge Cases', () => {
    it('handles special characters in data', () => {
      const specialData = {
        first_name: "O'Brien",
        last_name: 'Müller',
        notes: 'Test "quotes" and \'apostrophes\'',
      };
      
      const saved = formService.saveDraft('patient-intake', specialData);
      expect(saved).toBe(true);
      
      const loaded = formService.loadDraft('patient-intake');
      expect(loaded).toEqual(specialData);
    });

    it('handles undefined values', () => {
      const dataWithUndefined = {
        first_name: 'John',
        middle_name: undefined,
      };
      
      const saved = formService.saveDraft('patient-intake', dataWithUndefined);
      expect(saved).toBe(true);
      
      const loaded = formService.loadDraft('patient-intake');
      expect(loaded?.first_name).toBe('John');
    });
  });
});
