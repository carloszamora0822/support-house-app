import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DiagnosisSection } from './DiagnosisSection';

describe('DiagnosisSection', () => {
  const mockFormData = {
    diagnosis_primary: '',
    diagnosis_date: '',
    mets_to: '',
  };

  const mockOnChange = vi.fn();
  const mockErrors = {};

  it('renders section title', () => {
    render(
      <DiagnosisSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByRole('heading', { name: /diagnosis/i })).toBeInTheDocument();
  });

  it('renders all diagnosis fields', () => {
    render(
      <DiagnosisSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByLabelText(/primary diagnosis/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/diagnosis date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/metastasis/i)).toBeInTheDocument();
  });

  it('marks required fields', () => {
    render(
      <DiagnosisSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    const requiredIndicators = screen.getAllByText('*');
    expect(requiredIndicators.length).toBeGreaterThanOrEqual(2);
  });

  it('displays field values', () => {
    const dataWithValues = {
      diagnosis_primary: 'Breast Cancer Stage II',
      diagnosis_date: '2024-01-15',
      mets_to: 'Liver',
    };

    render(
      <DiagnosisSection
        formData={dataWithValues}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByDisplayValue('Breast Cancer Stage II')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-01-15')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Liver')).toBeInTheDocument();
  });

  it('calls onChange when diagnosis is entered', async () => {
    const user = userEvent.setup();

    render(
      <DiagnosisSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    const diagnosisInput = screen.getByLabelText(/primary diagnosis/i);
    await user.type(diagnosisInput, 'Lung Cancer');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('displays errors', () => {
    const errorsWithDiagnosis = {
      diagnosis_primary: 'Primary diagnosis is required',
      diagnosis_date: 'Diagnosis date is required',
    };

    render(
      <DiagnosisSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={errorsWithDiagnosis}
      />
    );

    expect(screen.getByText('Primary diagnosis is required')).toBeInTheDocument();
    expect(screen.getByText('Diagnosis date is required')).toBeInTheDocument();
  });

  it('renders date input for diagnosis_date', () => {
    render(
      <DiagnosisSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    const dateInput = screen.getByLabelText(/diagnosis date/i);
    expect(dateInput).toHaveAttribute('type', 'date');
  });
});
