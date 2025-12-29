import { describe, it, expect } from 'vitest';
import { disclosureAuthorizationSchema } from './disclosureSchema';

describe('disclosureAuthorizationSchema', () => {
  describe('Required Fields', () => {
    it('requires fax_form_date', () => {
      const result = disclosureAuthorizationSchema.safeParse({
        fax_to_office: 'Test Office',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('fax_form_date');
      }
    });

    it('requires fax_to_office', () => {
      const result = disclosureAuthorizationSchema.safeParse({
        fax_form_date: '2024-01-01',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('fax_to_office');
      }
    });

    it('requires patient info fields', () => {
      const result = disclosureAuthorizationSchema.safeParse({
        fax_form_date: '2024-01-01',
        fax_to_office: 'Test Office',
      });

      expect(result.success).toBe(false);
    });

    it('requires office_patient_diagnosis', () => {
      const minData = {
        fax_form_date: '2024-01-01',
        fax_to_office: 'Test Office',
        fax_patient_name: 'John Doe',
        fax_patient_dob: '1980-01-01',
        fax_patient_address: '123 Main St',
        fax_patient_city: 'Fort Smith',
        fax_patient_state: 'AR',
        fax_patient_zip: '72901',
        fax_patient_phone: '555-123-4567',
        office_staff_signature: 'Staff Name',
        office_staff_signature_date: '2024-01-01',
        fax_patient_signature: 'John Doe',
        fax_patient_signature_date: '2024-01-01',
        fax_patient_printed_name: 'John Doe',
      };

      const result = disclosureAuthorizationSchema.safeParse(minData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('office_patient_diagnosis');
      }
    });

    it('requires signatures', () => {
      const result = disclosureAuthorizationSchema.safeParse({
        fax_form_date: '2024-01-01',
        fax_to_office: 'Test Office',
        fax_patient_name: 'John Doe',
        fax_patient_dob: '1980-01-01',
        fax_patient_address: '123 Main St',
        fax_patient_city: 'Fort Smith',
        fax_patient_state: 'AR',
        fax_patient_zip: '72901',
        fax_patient_phone: '555-123-4567',
        office_patient_diagnosis: 'Breast Cancer',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('Optional Fields', () => {
    it('accepts optional office fields', () => {
      const validData = {
        fax_form_date: '2024-01-01',
        fax_to_office: 'Test Office',
        fax_patient_name: 'John Doe',
        fax_patient_dob: '1980-01-01',
        fax_patient_address: '123 Main St',
        fax_patient_city: 'Fort Smith',
        fax_patient_state: 'AR',
        fax_patient_zip: '72901',
        fax_patient_phone: '555-123-4567',
        office_patient_diagnosis: 'Breast Cancer',
        office_stage: 'Stage II',
        office_expected_treatments: 6,
        office_treatment_start_date: '2024-02-01',
        office_treatment_end_date: '2024-08-01',
        office_staff_signature: 'Staff Name',
        office_staff_signature_date: '2024-01-01',
        fax_patient_signature: 'John Doe',
        fax_patient_signature_date: '2024-01-01',
        fax_patient_printed_name: 'John Doe',
      };

      const result = disclosureAuthorizationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('accepts chemo details as optional', () => {
      const validData = {
        fax_form_date: '2024-01-01',
        fax_to_office: 'Test Office',
        fax_patient_name: 'John Doe',
        fax_patient_dob: '1980-01-01',
        fax_patient_address: '123 Main St',
        fax_patient_city: 'Fort Smith',
        fax_patient_state: 'AR',
        fax_patient_zip: '72901',
        fax_patient_phone: '555-123-4567',
        office_patient_diagnosis: 'Breast Cancer',
        office_chemo_type: ['IV', 'Oral'],
        office_chemo_frequency: 'weekly',
        office_chemo_every_weeks: 2,
        office_staff_signature: 'Staff Name',
        office_staff_signature_date: '2024-01-01',
        fax_patient_signature: 'John Doe',
        fax_patient_signature_date: '2024-01-01',
        fax_patient_printed_name: 'John Doe',
      };

      const result = disclosureAuthorizationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('accepts radiation details as optional', () => {
      const validData = {
        fax_form_date: '2024-01-01',
        fax_to_office: 'Test Office',
        fax_patient_name: 'John Doe',
        fax_patient_dob: '1980-01-01',
        fax_patient_address: '123 Main St',
        fax_patient_city: 'Fort Smith',
        fax_patient_state: 'AR',
        fax_patient_zip: '72901',
        fax_patient_phone: '555-123-4567',
        office_patient_diagnosis: 'Breast Cancer',
        office_radiation_frequency: 'daily',
        office_radiation_every_weeks: 1,
        office_staff_signature: 'Staff Name',
        office_staff_signature_date: '2024-01-01',
        fax_patient_signature: 'John Doe',
        fax_patient_signature_date: '2024-01-01',
        fax_patient_printed_name: 'John Doe',
      };

      const result = disclosureAuthorizationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('accepts status flags as optional array', () => {
      const validData = {
        fax_form_date: '2024-01-01',
        fax_to_office: 'Test Office',
        fax_patient_name: 'John Doe',
        fax_patient_dob: '1980-01-01',
        fax_patient_address: '123 Main St',
        fax_patient_city: 'Fort Smith',
        fax_patient_state: 'AR',
        fax_patient_zip: '72901',
        fax_patient_phone: '555-123-4567',
        office_patient_diagnosis: 'Breast Cancer',
        office_status_flags: ['not_in_treatment', 'pending'],
        office_staff_signature: 'Staff Name',
        office_staff_signature_date: '2024-01-01',
        fax_patient_signature: 'John Doe',
        fax_patient_signature_date: '2024-01-01',
        fax_patient_printed_name: 'John Doe',
      };

      const result = disclosureAuthorizationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('accepts representative relationship as optional', () => {
      const validData = {
        fax_form_date: '2024-01-01',
        fax_to_office: 'Test Office',
        fax_patient_name: 'John Doe',
        fax_patient_dob: '1980-01-01',
        fax_patient_address: '123 Main St',
        fax_patient_city: 'Fort Smith',
        fax_patient_state: 'AR',
        fax_patient_zip: '72901',
        fax_patient_phone: '555-123-4567',
        office_patient_diagnosis: 'Breast Cancer',
        office_staff_signature: 'Staff Name',
        office_staff_signature_date: '2024-01-01',
        fax_patient_signature: 'John Doe',
        fax_patient_signature_date: '2024-01-01',
        fax_patient_printed_name: 'John Doe',
        fax_rep_relationship: 'Spouse',
      };

      const result = disclosureAuthorizationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('Complete Disclosure Form', () => {
    it('accepts fully populated disclosure form', () => {
      const result = disclosureAuthorizationSchema.safeParse({
        fax_form_date: '2024-01-15',
        fax_to_office: 'Mercy Oncology',
        fax_patient_name: 'Jane Doe',
        fax_patient_dob: '1975-03-20',
        fax_patient_address: '456 Oak Street',
        fax_patient_city: 'Fort Smith',
        fax_patient_state: 'AR',
        fax_patient_zip: '72901',
        fax_patient_phone: '(555) 123-4567',
        office_patient_diagnosis: 'Breast Cancer Stage II',
        office_stage: 'Stage II',
        office_expected_treatments: 8,
        office_treatment_start_date: '2024-02-01',
        office_treatment_end_date: '2024-09-01',
        office_chemo_type: ['IV', 'Oral'],
        office_chemo_frequency: 'weekly',
        office_chemo_every_weeks: 2,
        office_radiation_frequency: 'daily',
        office_radiation_every_weeks: 1,
        office_status_flags: ['pending'],
        office_staff_signature: 'Dr. Smith',
        office_staff_signature_date: '2024-01-15',
        fax_patient_signature: 'Jane Doe',
        fax_patient_signature_date: '2024-01-15',
        fax_patient_printed_name: 'Jane Doe',
        fax_rep_relationship: '',
      });

      expect(result.success).toBe(true);
    });
  });
});
