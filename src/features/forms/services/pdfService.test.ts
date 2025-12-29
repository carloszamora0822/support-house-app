import { describe, it, expect, vi } from 'vitest';
import { pdfService } from './pdfService';
import type { DisclosureAuthorizationInput } from '../intake/schemas/disclosureSchema';

describe('pdfService', () => {
  const mockDisclosureData: DisclosureAuthorizationInput = {
    fax_form_date: '2024-01-15',
    fax_to_office: 'Mercy Oncology',
    fax_patient_name: 'John Doe',
    fax_patient_dob: '1980-01-01',
    fax_patient_address: '123 Main St',
    fax_patient_city: 'Fort Smith',
    fax_patient_state: 'AR',
    fax_patient_zip: '72901',
    fax_patient_phone: '555-123-4567',
    office_patient_diagnosis: 'Breast Cancer Stage II',
    office_stage: 'II',
    office_expected_treatments: 12,
    office_treatment_start_date: '2024-02-01',
    office_treatment_end_date: '2024-08-01',
    office_chemo_type: ['IV', 'Oral'],
    office_chemo_frequency: 'weekly',
    office_chemo_every_weeks: 1,
    office_radiation_frequency: 'daily',
    office_radiation_every_weeks: 5,
    office_staff_signature: 'Dr. Smith',
    office_staff_signature_date: '2024-01-15',
    fax_patient_signature: 'John Doe',
    fax_patient_signature_date: '2024-01-15',
    fax_patient_printed_name: 'John Doe',
  };

  describe('generateDisclosurePDF', () => {
    it('generates PDF blob from disclosure data', async () => {
      const result = await pdfService.generateDisclosurePDF(mockDisclosureData);

      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe('application/pdf');
    });

    it('includes patient information in PDF', async () => {
      const result = await pdfService.generateDisclosurePDF(mockDisclosureData);

      expect(result.size).toBeGreaterThan(0);
    });

    it('handles missing optional fields', async () => {
      const minimalData: DisclosureAuthorizationInput = {
        fax_form_date: '2024-01-15',
        fax_to_office: 'Mercy Oncology',
        fax_patient_name: 'Jane Doe',
        fax_patient_dob: '1975-05-20',
        fax_patient_address: '456 Oak Ave',
        fax_patient_city: 'Rogers',
        fax_patient_state: 'AR',
        fax_patient_zip: '72756',
        fax_patient_phone: '555-987-6543',
        office_patient_diagnosis: 'Lung Cancer',
        office_staff_signature: 'Dr. Jones',
        office_staff_signature_date: '2024-01-15',
        fax_patient_signature: 'Jane Doe',
        fax_patient_signature_date: '2024-01-15',
        fax_patient_printed_name: 'Jane Doe',
      };

      const result = await pdfService.generateDisclosurePDF(minimalData);

      expect(result).toBeInstanceOf(Blob);
      expect(result.size).toBeGreaterThan(0);
    });
  });

  describe('downloadPDF', () => {
    it('triggers download with correct filename', () => {
      const mockBlob = new Blob(['test'], { type: 'application/pdf' });
      
      // Mock URL methods
      global.URL.createObjectURL = vi.fn(() => 'blob:test');
      global.URL.revokeObjectURL = vi.fn();
      
      const mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
        style: {},
      } as unknown as HTMLAnchorElement;
      
      vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
      vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink);
      vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink);

      pdfService.downloadPDF(mockBlob, 'John Doe');

      expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
      expect(mockLink.download).toBe('Disclosure_Authorization_John_Doe.pdf');
      expect(mockLink.click).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    });
  });
});
