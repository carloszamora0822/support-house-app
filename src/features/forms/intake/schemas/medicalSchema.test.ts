import { describe, it, expect } from 'vitest';
import { medicalInformationSchema } from './medicalSchema';

describe('medicalInformationSchema', () => {
  describe('Required Fields', () => {
    it('requires diagnosis_primary', () => {
      const result = medicalInformationSchema.safeParse({
        diagnosis_date: '2024-01-01',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('diagnosis_primary');
      }
    });

    it('requires diagnosis_date', () => {
      const result = medicalInformationSchema.safeParse({
        diagnosis_primary: 'Breast Cancer',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('diagnosis_date');
      }
    });

    it('passes with minimum required fields', () => {
      const result = medicalInformationSchema.safeParse({
        diagnosis_primary: 'Breast Cancer',
        diagnosis_date: '2024-01-01',
        oncologist_mercy: [],
        oncologist_baptist: [],
      });

      expect(result.success).toBe(true);
    });
  });

  describe('Optional Fields', () => {
    it('accepts mets_to as optional', () => {
      const result = medicalInformationSchema.safeParse({
        diagnosis_primary: 'Lung Cancer',
        diagnosis_date: '2024-01-01',
        mets_to: 'Liver',
        oncologist_mercy: [],
        oncologist_baptist: [],
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.mets_to).toBe('Liver');
      }
    });

    it('accepts oncologist_other as optional', () => {
      const result = medicalInformationSchema.safeParse({
        diagnosis_primary: 'Colon Cancer',
        diagnosis_date: '2024-01-01',
        oncologist_mercy: [],
        oncologist_baptist: [],
        oncologist_other: 'Dr. Smith',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.oncologist_other).toBe('Dr. Smith');
      }
    });

    it('accepts all provider fields as optional', () => {
      const result = medicalInformationSchema.safeParse({
        diagnosis_primary: 'Pancreatic Cancer',
        diagnosis_date: '2024-01-01',
        oncologist_mercy: [],
        oncologist_baptist: [],
        surgeon_name: 'Dr. Johnson',
        surgeon_location: 'Mercy Hospital',
        surgeon_city: 'Fort Smith',
        surgeon_state: 'AR',
        general_doctor: 'Dr. Williams',
        general_location: 'Family Clinic',
        general_city: 'Rogers',
        general_state: 'AR',
      });

      expect(result.success).toBe(true);
    });
  });

  describe('Oncologist Arrays', () => {
    it('accepts empty oncologist arrays', () => {
      const result = medicalInformationSchema.safeParse({
        diagnosis_primary: 'Breast Cancer',
        diagnosis_date: '2024-01-01',
        oncologist_mercy: [],
        oncologist_baptist: [],
      });

      expect(result.success).toBe(true);
    });

    it('accepts multiple Mercy oncologists', () => {
      const result = medicalInformationSchema.safeParse({
        diagnosis_primary: 'Breast Cancer',
        diagnosis_date: '2024-01-01',
        oncologist_mercy: ['Reddy', 'Mackey', 'Samman'],
        oncologist_baptist: [],
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.oncologist_mercy).toHaveLength(3);
      }
    });

    it('accepts multiple Baptist oncologists', () => {
      const result = medicalInformationSchema.safeParse({
        diagnosis_primary: 'Lung Cancer',
        diagnosis_date: '2024-01-01',
        oncologist_mercy: [],
        oncologist_baptist: ['Arzoumanian'],
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.oncologist_baptist).toHaveLength(1);
      }
    });
  });

  describe('Treatment History', () => {
    it('accepts treatment dates as optional', () => {
      const result = medicalInformationSchema.safeParse({
        diagnosis_primary: 'Ovarian Cancer',
        diagnosis_date: '2024-01-01',
        oncologist_mercy: [],
        oncologist_baptist: [],
        treatment_chemo_start_1: '2024-02-01',
        treatment_chemo_end_1: '2024-04-01',
        treatment_radiation_start: '2024-05-01',
        treatment_radiation_end: '2024-06-01',
      });

      expect(result.success).toBe(true);
    });

    it('accepts surgery dates as string', () => {
      const result = medicalInformationSchema.safeParse({
        diagnosis_primary: 'Breast Cancer',
        diagnosis_date: '2024-01-01',
        oncologist_mercy: [],
        oncologist_baptist: [],
        treatment_surgery_dates: '01/15/2024, 03/20/2024',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.treatment_surgery_dates).toBe('01/15/2024, 03/20/2024');
      }
    });

    it('accepts two chemo cycles', () => {
      const result = medicalInformationSchema.safeParse({
        diagnosis_primary: 'Colon Cancer',
        diagnosis_date: '2024-01-01',
        oncologist_mercy: [],
        oncologist_baptist: [],
        treatment_chemo_start_1: '2024-02-01',
        treatment_chemo_end_1: '2024-04-01',
        treatment_chemo_start_2: '2024-06-01',
        treatment_chemo_end_2: '2024-08-01',
      });

      expect(result.success).toBe(true);
    });

    it('accepts treatment_other as optional text', () => {
      const result = medicalInformationSchema.safeParse({
        diagnosis_primary: 'Lymphoma',
        diagnosis_date: '2024-01-01',
        oncologist_mercy: [],
        oncologist_baptist: [],
        treatment_other: 'Immunotherapy started 03/2024',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.treatment_other).toBe('Immunotherapy started 03/2024');
      }
    });
  });

  describe('Complete Medical Record', () => {
    it('accepts fully populated medical information', () => {
      const result = medicalInformationSchema.safeParse({
        diagnosis_primary: 'Breast Cancer Stage II',
        diagnosis_date: '2024-01-15',
        mets_to: 'None',
        oncologist_mercy: ['Reddy', 'Mackey'],
        oncologist_baptist: [],
        oncologist_other: 'Dr. External Oncologist',
        rad_oncologist_mercy: 'Dr. Mercy Radiation',
        rad_oncologist_baptist: '',
        rad_oncologist_other: '',
        provider_other_role: 'Nutritionist',
        provider_other_location: 'Wellness Center',
        provider_other_city: 'Fort Smith',
        provider_other_state: 'AR',
        surgeon_name: 'Dr. Johnson',
        surgeon_location: 'Mercy Hospital',
        surgeon_city: 'Fort Smith',
        surgeon_state: 'AR',
        general_doctor: 'Dr. Williams',
        general_location: 'Family Clinic',
        general_city: 'Rogers',
        general_state: 'AR',
        treatment_surgery_dates: '01/20/2024',
        treatment_chemo_start_1: '2024-02-01',
        treatment_chemo_end_1: '2024-04-01',
        treatment_chemo_start_2: '2024-06-01',
        treatment_chemo_end_2: '2024-08-01',
        treatment_radiation_start: '2024-09-01',
        treatment_radiation_end: '2024-10-01',
        treatment_other: 'Physical therapy ongoing',
      });

      expect(result.success).toBe(true);
    });
  });
});
