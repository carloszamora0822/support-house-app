import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIntakeForm } from './useIntakeForm';
import * as formServiceModule from '../../../forms/services/formService';

vi.mock('../../../forms/services/formService', () => ({
  formService: {
    saveDraft: vi.fn(),
    loadDraft: vi.fn(),
    clearDraft: vi.fn(),
  },
}));

describe('useIntakeForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Initialization', () => {
    it('initializes with empty form data', () => {
      const { result } = renderHook(() => useIntakeForm());

      expect(result.current.formData.first_name).toBe('');
      expect(result.current.formData.last_name).toBe('');
      expect(result.current.formData.dob).toBe('');
    });

    it('initializes with current step as 1', () => {
      const { result } = renderHook(() => useIntakeForm());

      expect(result.current.currentStep).toBe(1);
    });

    it('initializes with no validation errors', () => {
      const { result } = renderHook(() => useIntakeForm());

      expect(result.current.errors).toEqual({});
    });
  });

  describe('Form Updates', () => {
    it('updates single field', () => {
      const { result } = renderHook(() => useIntakeForm());

      act(() => {
        result.current.updateField('first_name', 'John');
      });

      expect(result.current.formData.first_name).toBe('John');
    });

    it('updates multiple fields independently', () => {
      const { result } = renderHook(() => useIntakeForm());

      act(() => {
        result.current.updateField('first_name', 'John');
        result.current.updateField('last_name', 'Doe');
      });

      expect(result.current.formData.first_name).toBe('John');
      expect(result.current.formData.last_name).toBe('Doe');
    });

    it('updates nested fields', () => {
      const { result } = renderHook(() => useIntakeForm());

      act(() => {
        result.current.updateField('minor_children', [{ name: 'Child 1', dob: '2020-01-01' }]);
      });

      expect(result.current.formData.minor_children).toHaveLength(1);
      expect(result.current.formData.minor_children[0].name).toBe('Child 1');
    });
  });

  describe('Validation', () => {
    it('validates required fields', async () => {
      const { result } = renderHook(() => useIntakeForm());

      const isValid = await act(async () => {
        return result.current.validateStep(1);
      });

      expect(isValid).toBe(false);
      expect(result.current.errors).toBeDefined();
    });

    it('passes validation with valid data', async () => {
      const { result } = renderHook(() => useIntakeForm());

      act(() => {
        result.current.updateField('first_name', 'John');
        result.current.updateField('last_name', 'Doe');
        result.current.updateField('dob', '1990-01-01');
        result.current.updateField('phone_primary', '555-123-4567');
        result.current.updateField('address', '123 Main St');
        result.current.updateField('city', 'Austin');
        result.current.updateField('county', 'Travis');
        result.current.updateField('state', 'TX');
        result.current.updateField('zip', '78701');
        result.current.updateField('status', 'female');
        result.current.updateField('ethnicity', ['white']);
        result.current.updateField('language', ['english']);
        result.current.updateField('has_insurance', false);
        result.current.updateField('is_veteran', false);
        result.current.updateField('emergency_contact', {
          name: 'Jane Doe',
          relationship: 'Sister',
          address: '456 Oak St',
          city: 'Austin',
          state: 'TX',
          zip: '78702',
          phone: '555-987-6543',
        });
        result.current.updateField('referral_source', 'friend');
        result.current.updateField('assistance_types', ['food']);
        result.current.updateField('patient_signature', 'John Doe');
        result.current.updateField('patient_printed_name', 'John Doe');
        result.current.updateField('patient_signature_date', '2024-01-01');
        result.current.updateField('interviewed_by', 'Staff');
        result.current.updateField('interviewed_date', '2024-01-01');
      });

      const isValid = await act(async () => {
        return result.current.validateStep(1);
      });

      expect(isValid).toBe(true);
      expect(Object.keys(result.current.errors)).toHaveLength(0);
    });

    it('validates email format', async () => {
      const { result } = renderHook(() => useIntakeForm());

      act(() => {
        result.current.updateField('email', 'invalid-email');
      });

      await act(async () => {
        await result.current.validateStep(1);
      });

      expect(result.current.errors.email).toBeDefined();
    });

    it('validates phone format', async () => {
      const { result } = renderHook(() => useIntakeForm());

      act(() => {
        result.current.updateField('phone_primary', '123');
      });

      await act(async () => {
        await result.current.validateStep(1);
      });

      expect(result.current.errors.phone_primary).toBeDefined();
    });
  });

  describe('Draft Management', () => {
    it('saves draft manually', async () => {
      const { result } = renderHook(() => useIntakeForm());
      
      // Wait a tick for initial render
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      vi.clearAllMocks(); // Clear auto-save calls

      act(() => {
        result.current.updateField('first_name', 'John');
      });

      // Wait for state update
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      act(() => {
        result.current.saveDraft();
      });

      expect(formServiceModule.formService.saveDraft).toHaveBeenCalled();
      const lastCall = vi.mocked(formServiceModule.formService.saveDraft).mock.calls.slice(-1)[0];
      expect(lastCall[0]).toBe('patient-intake');
      expect(lastCall[1].first_name).toBe('John');
    });

    it('loads draft on initialization', () => {
      vi.mocked(formServiceModule.formService.loadDraft).mockReturnValue({
        first_name: 'Jane',
        last_name: 'Smith',
      });

      const { result } = renderHook(() => useIntakeForm());

      expect(result.current.formData.first_name).toBe('Jane');
      expect(result.current.formData.last_name).toBe('Smith');
    });

    it('clears draft', () => {
      const { result } = renderHook(() => useIntakeForm());

      act(() => {
        result.current.clearDraft();
      });

      expect(formServiceModule.formService.clearDraft).toHaveBeenCalledWith('patient-intake');
    });
  });

  describe('Step Navigation', () => {
    it('advances to next step after validation', async () => {
      const { result } = renderHook(() => useIntakeForm());

      act(() => {
        result.current.updateField('first_name', 'John');
        result.current.updateField('last_name', 'Doe');
        result.current.updateField('dob', '1990-01-01');
        result.current.updateField('phone_primary', '555-123-4567');
        result.current.updateField('address', '123 Main St');
        result.current.updateField('city', 'Austin');
        result.current.updateField('county', 'Travis');
        result.current.updateField('state', 'TX');
        result.current.updateField('zip', '78701');
        result.current.updateField('status', 'female');
        result.current.updateField('ethnicity', ['white']);
        result.current.updateField('language', ['english']);
        result.current.updateField('has_insurance', false);
        result.current.updateField('is_veteran', false);
        result.current.updateField('emergency_contact', {
          name: 'Jane Doe',
          relationship: 'Sister',
          address: '456 Oak St',
          city: 'Austin',
          state: 'TX',
          zip: '78702',
          phone: '555-987-6543',
        });
        result.current.updateField('referral_source', 'friend');
        result.current.updateField('assistance_types', ['food']);
        result.current.updateField('patient_signature', 'John Doe');
        result.current.updateField('patient_printed_name', 'John Doe');
        result.current.updateField('patient_signature_date', '2024-01-01');
        result.current.updateField('interviewed_by', 'Staff');
        result.current.updateField('interviewed_date', '2024-01-01');
      });

      await act(async () => {
        await result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(2);
    });

    it('does not advance with validation errors', async () => {
      const { result } = renderHook(() => useIntakeForm());

      await act(async () => {
        await result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(1);
    });

    it('goes back to previous step', async () => {
      const { result } = renderHook(() => useIntakeForm());

      // First advance to step 2
      act(() => {
        result.current.updateField('first_name', 'John');
        result.current.updateField('last_name', 'Doe');
        result.current.updateField('dob', '1990-01-01');
        result.current.updateField('phone_primary', '555-123-4567');
        result.current.updateField('address', '123 Main St');
        result.current.updateField('city', 'Austin');
        result.current.updateField('county', 'Travis');
        result.current.updateField('state', 'TX');
        result.current.updateField('zip', '78701');
        result.current.updateField('status', 'female');
        result.current.updateField('ethnicity', ['white']);
        result.current.updateField('language', ['english']);
        result.current.updateField('has_insurance', false);
        result.current.updateField('is_veteran', false);
        result.current.updateField('emergency_contact', {
          name: 'Jane Doe',
          relationship: 'Sister',
          address: '456 Oak St',
          city: 'Austin',
          state: 'TX',
          zip: '78702',
          phone: '555-987-6543',
        });
        result.current.updateField('referral_source', 'friend');
        result.current.updateField('assistance_types', ['food']);
        result.current.updateField('patient_signature', 'John Doe');
        result.current.updateField('patient_printed_name', 'John Doe');
        result.current.updateField('patient_signature_date', '2024-01-01');
        result.current.updateField('interviewed_by', 'Staff');
        result.current.updateField('interviewed_date', '2024-01-01');
      });

      await act(async () => {
        await result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(2);

      // Now go back
      act(() => {
        result.current.previousStep();
      });

      expect(result.current.currentStep).toBe(1);
    });

    it('does not go below step 1', () => {
      const { result } = renderHook(() => useIntakeForm());

      act(() => {
        result.current.previousStep();
      });

      expect(result.current.currentStep).toBe(1);
    });
  });

  describe('Auto-save', () => {
    it('auto-saves draft every 30 seconds', async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useIntakeForm());

      act(() => {
        result.current.updateField('first_name', 'John');
      });

      act(() => {
        vi.advanceTimersByTime(30000);
      });

      expect(formServiceModule.formService.saveDraft).toHaveBeenCalled();

      vi.useRealTimers();
    });
  });
});
