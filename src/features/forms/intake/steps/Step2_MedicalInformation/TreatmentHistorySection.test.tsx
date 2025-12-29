import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TreatmentHistorySection } from './TreatmentHistorySection';

describe('TreatmentHistorySection', () => {
  const mockFormData = {
    treatment_surgery_dates: '',
    treatment_chemo_start_1: '',
    treatment_chemo_end_1: '',
    treatment_chemo_start_2: '',
    treatment_chemo_end_2: '',
    treatment_radiation_start: '',
    treatment_radiation_end: '',
    treatment_other: '',
  };

  const mockOnChange = vi.fn();
  const mockErrors = {};

  it('renders section title', () => {
    render(
      <TreatmentHistorySection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByRole('heading', { name: /treatment history/i })).toBeInTheDocument();
  });

  it('renders surgery dates field', () => {
    render(
      <TreatmentHistorySection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByLabelText(/surgery dates/i)).toBeInTheDocument();
  });

  it('renders chemo cycle 1 fields', () => {
    render(
      <TreatmentHistorySection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByLabelText(/chemo cycle 1 start/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/chemo cycle 1 end/i)).toBeInTheDocument();
  });

  it('renders chemo cycle 2 fields', () => {
    render(
      <TreatmentHistorySection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByLabelText(/chemo cycle 2 start/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/chemo cycle 2 end/i)).toBeInTheDocument();
  });

  it('renders radiation fields', () => {
    render(
      <TreatmentHistorySection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByLabelText(/radiation start/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/radiation end/i)).toBeInTheDocument();
  });

  it('renders other treatment field', () => {
    render(
      <TreatmentHistorySection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByLabelText(/other treatment/i)).toBeInTheDocument();
  });

  it('displays field values', () => {
    const dataWithValues = {
      treatment_surgery_dates: '01/15/2024',
      treatment_chemo_start_1: '2024-02-01',
      treatment_chemo_end_1: '2024-04-01',
      treatment_radiation_start: '2024-05-01',
      treatment_radiation_end: '2024-06-01',
      treatment_other: 'Immunotherapy ongoing',
      treatment_chemo_start_2: '',
      treatment_chemo_end_2: '',
    };

    render(
      <TreatmentHistorySection
        formData={dataWithValues}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByDisplayValue('01/15/2024')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-02-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Immunotherapy ongoing')).toBeInTheDocument();
  });

  it('renders date inputs for treatment dates', () => {
    render(
      <TreatmentHistorySection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    const chemoStart = screen.getByLabelText(/chemo cycle 1 start/i);
    expect(chemoStart).toHaveAttribute('type', 'date');
  });
});
