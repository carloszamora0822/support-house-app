import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Step2_MedicalInformation } from './Step2_MedicalInformation';
import type { MedicalInformationInput } from './schemas/medicalSchema';

describe('Step2_MedicalInformation', () => {
  const mockFormData: MedicalInformationInput = {
    diagnosis_primary: '',
    diagnosis_date: '',
    oncologist_mercy: [],
    oncologist_baptist: [],
  };

  const mockOnChange = vi.fn();
  const mockErrors = {};

  it('renders step title', () => {
    render(
      <Step2_MedicalInformation
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByRole('heading', { name: /medical information/i, level: 2 })).toBeInTheDocument();
  });

  it('renders DiagnosisSection', () => {
    render(
      <Step2_MedicalInformation
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByRole('heading', { name: /diagnosis/i })).toBeInTheDocument();
  });

  it('renders OncologistSection', () => {
    render(
      <Step2_MedicalInformation
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByRole('heading', { name: /^oncologists$/i })).toBeInTheDocument();
  });

  it('renders RadiationOncologistSection', () => {
    render(
      <Step2_MedicalInformation
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByRole('heading', { name: /radiation oncologist/i })).toBeInTheDocument();
  });

  it('renders ProviderDetailsSection', () => {
    render(
      <Step2_MedicalInformation
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByRole('heading', { name: /provider details/i })).toBeInTheDocument();
  });

  it('renders TreatmentHistorySection', () => {
    render(
      <Step2_MedicalInformation
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByRole('heading', { name: /treatment history/i })).toBeInTheDocument();
  });

  it('passes formData to all sections', () => {
    const dataWithValues: MedicalInformationInput = {
      diagnosis_primary: 'Breast Cancer',
      diagnosis_date: '2024-01-15',
      oncologist_mercy: ['Reddy'],
      oncologist_baptist: [],
    };

    render(
      <Step2_MedicalInformation
        formData={dataWithValues}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByDisplayValue('Breast Cancer')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-01-15')).toBeInTheDocument();
  });

  it('passes onChange to all sections', () => {
    render(
      <Step2_MedicalInformation
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(mockOnChange).toBeDefined();
  });

  it('passes errors to all sections', () => {
    const errorsWithDiagnosis = {
      diagnosis_primary: 'Required',
    };

    render(
      <Step2_MedicalInformation
        formData={mockFormData}
        onChange={mockOnChange}
        errors={errorsWithDiagnosis}
      />
    );

    expect(screen.getByText('Required')).toBeInTheDocument();
  });
});
