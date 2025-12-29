import { describe, it, expect, vi, beforeEach } from 'vitest';
import { intakeService } from './intakeService';
import { supabase } from '@/lib/supabase';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('intakeService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('submitIntakeForm', () => {
    const mockFormData = {
      patientData: {
        name_first: 'John',
        name_last: 'Doe',
        dob: '1980-01-01',
        email: 'john@example.com',
        phone_primary: '555-123-4567',
        address: '123 Main St',
        city: 'Fort Smith',
        state: 'AR',
        zip: '72901',
      },
      medicalData: {
        diagnosis_primary: 'Breast Cancer',
        diagnosis_date: '2024-01-15',
      },
      disclosureData: {
        fax_form_date: '2024-01-15',
        fax_to_office: 'Mercy Oncology',
        office_patient_diagnosis: 'Breast Cancer Stage II',
      },
    };

    it('creates patient record', async () => {
      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: '123', ...mockFormData.patientData },
            error: null,
          }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      } as any);

      const result = await intakeService.submitIntakeForm(mockFormData);

      expect(mockInsert).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    it('returns created patient with ID', async () => {
      const mockPatient = { id: '123', name_first: 'John', name_last: 'Doe' };
      
      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockPatient,
            error: null,
          }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      } as any);

      const result = await intakeService.submitIntakeForm(mockFormData);

      expect(result.data?.id).toBe('123');
    });

    it('handles patient creation error', async () => {
      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database error' },
          }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      } as any);

      const result = await intakeService.submitIntakeForm(mockFormData);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Database error');
    });
  });
});
