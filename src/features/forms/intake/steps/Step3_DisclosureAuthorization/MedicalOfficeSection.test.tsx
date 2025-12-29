import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MedicalOfficeSection } from './MedicalOfficeSection';

describe('MedicalOfficeSection', () => {
  const mockFormData = {
    office_patient_diagnosis: '',
    office_stage: '',
    office_expected_treatments: undefined,
    office_treatment_start_date: '',
    office_treatment_end_date: '',
  };

  const mockOnChange = vi.fn();
  const mockErrors = {};

  it('renders section title', () => {
    render(
      <MedicalOfficeSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByRole('heading', { name: /medical office staff/i })).toBeInTheDocument();
  });

  it('renders diagnosis field', () => {
    render(
      <MedicalOfficeSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByLabelText(/patient diagnosis/i)).toBeInTheDocument();
  });

  it('renders stage field', () => {
    render(
      <MedicalOfficeSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByLabelText(/stage/i)).toBeInTheDocument();
  });

  it('renders expected treatments field', () => {
    render(
      <MedicalOfficeSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByLabelText(/expected treatments/i)).toBeInTheDocument();
  });

  it('renders treatment date fields', () => {
    render(
      <MedicalOfficeSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByLabelText(/treatment start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/treatment end date/i)).toBeInTheDocument();
  });

  it('displays field values', () => {
    const dataWithValues = {
      office_patient_diagnosis: 'Breast Cancer Stage II',
      office_stage: 'Stage II',
      office_expected_treatments: 8,
      office_treatment_start_date: '2024-02-01',
      office_treatment_end_date: '2024-09-01',
    };

    render(
      <MedicalOfficeSection
        formData={dataWithValues}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByDisplayValue('Breast Cancer Stage II')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Stage II')).toBeInTheDocument();
    expect(screen.getByDisplayValue('8')).toBeInTheDocument();
  });
});
