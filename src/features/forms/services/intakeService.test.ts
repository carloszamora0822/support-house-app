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
        emergency_contact_name: 'Jane Doe',
        emergency_contact_relationship: 'Spouse',
        emergency_contact_phone: '555-987-6543',
        minor_children_count: 2,
        minor_children: [
          { name: 'Child 1', age: 8 },
          { name: 'Child 2', age: 5 },
        ],
      },
      medicalData: {
        diagnosis_primary: 'Breast Cancer',
        diagnosis_date: '2024-01-15',
      },
      disclosureData: {
        fax_form_date: '2024-01-15',
        fax_to_office: 'Mercy Oncology',
        office_patient_diagnosis: 'Breast Cancer Stage II',
        fax_patient_signature: 'John Doe',
        fax_patient_signature_date: '2024-01-15',
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
      } as unknown);

      const result = await intakeService.submitIntakeForm(mockFormData);

      expect(mockInsert).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    it('creates initial visit record', async () => {
      const mockPatientInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: '123' },
            error: null,
          }),
        }),
      });

      const mockVisitInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: 'visit-123' },
            error: null,
          }),
        }),
      });

      let callCount = 0;
      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'patients') {
          return { insert: mockPatientInsert } as unknown;
        }
        if (table === 'visits') {
          callCount++;
          return { insert: mockVisitInsert } as unknown;
        }
        return { insert: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: {}, error: null }) }) }) } as unknown;
      });

      await intakeService.submitIntakeForm(mockFormData);

      expect(callCount).toBeGreaterThan(0);
    });

    it('creates emergency contact record', async () => {
      const mockPatientInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: '123' },
            error: null,
          }),
        }),
      });

      const mockEmergencyInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: 'emergency-123' },
            error: null,
          }),
        }),
      });

      let emergencyCallCount = 0;
      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'patients') {
          return { insert: mockPatientInsert } as unknown;
        }
        if (table === 'emergency_contacts') {
          emergencyCallCount++;
          return { insert: mockEmergencyInsert } as unknown;
        }
        return { insert: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: {}, error: null }) }) }) } as unknown;
      });

      await intakeService.submitIntakeForm(mockFormData);

      expect(emergencyCallCount).toBeGreaterThan(0);
    });

    it('creates minor children records', async () => {
      const mockPatientInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: '123' },
            error: null,
          }),
        }),
      });

      const mockChildrenInsert = vi.fn().mockReturnValue({
        data: [{ id: 'child-1' }, { id: 'child-2' }],
        error: null,
      });

      let childrenCallCount = 0;
      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'patients') {
          return { insert: mockPatientInsert } as unknown;
        }
        if (table === 'minor_children') {
          childrenCallCount++;
          return { insert: mockChildrenInsert } as unknown;
        }
        return { insert: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: {}, error: null }) }) }) } as unknown;
      });

      await intakeService.submitIntakeForm(mockFormData);

      expect(childrenCallCount).toBeGreaterThan(0);
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

      vi.mocked(supabase.from).mockImplementation(() => {
        return { insert: mockInsert } as unknown;
      });

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
      } as unknown);

      const result = await intakeService.submitIntakeForm(mockFormData);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Database error');
    });
  });
});
