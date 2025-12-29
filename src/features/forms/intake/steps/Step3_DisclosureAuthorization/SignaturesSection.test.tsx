import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SignaturesSection } from './SignaturesSection';

describe('SignaturesSection', () => {
  const mockFormData = {
    office_staff_signature: '',
    office_staff_signature_date: '',
    fax_patient_signature: '',
    fax_patient_signature_date: '',
    fax_patient_printed_name: '',
    fax_rep_relationship: '',
  };

  const mockOnChange = vi.fn();
  const mockErrors = {};

  it('renders section title', () => {
    render(
      <SignaturesSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByRole('heading', { name: /signatures/i })).toBeInTheDocument();
  });

  it('renders office staff signature fields', () => {
    render(
      <SignaturesSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByText('Office Staff')).toBeInTheDocument();
    expect(screen.getAllByText(/office staff signature/i).length).toBeGreaterThanOrEqual(2);
  });

  it('renders patient signature fields', () => {
    render(
      <SignaturesSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByText('Patient Signature')).toBeInTheDocument();
    expect(screen.getByText(/patient signature date/i)).toBeInTheDocument();
    expect(screen.getByText(/patient printed name/i)).toBeInTheDocument();
  });

  it('renders representative relationship field', () => {
    render(
      <SignaturesSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByLabelText(/representative relationship/i)).toBeInTheDocument();
  });

  it('marks required fields', () => {
    render(
      <SignaturesSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    const requiredIndicators = screen.getAllByText('*');
    expect(requiredIndicators.length).toBeGreaterThanOrEqual(5);
  });

  it('displays field values', () => {
    const dataWithValues = {
      office_staff_signature: 'Dr. Smith',
      office_staff_signature_date: '2024-01-15',
      fax_patient_signature: 'Jane Doe',
      fax_patient_signature_date: '2024-01-15',
      fax_patient_printed_name: 'Jane Doe',
      fax_rep_relationship: 'Self',
    };

    render(
      <SignaturesSection
        formData={dataWithValues}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByDisplayValue('Dr. Smith')).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('Jane Doe')).toHaveLength(2);
    expect(screen.getByDisplayValue('Self')).toBeInTheDocument();
  });
});
