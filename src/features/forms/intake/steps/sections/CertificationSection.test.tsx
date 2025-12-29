import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CertificationSection } from './CertificationSection';

describe('CertificationSection', () => {
  const mockFormData = {
    patient_signature: '',
    patient_printed_name: '',
    patient_signature_date: '',
    interviewed_by: '',
    interviewed_date: '',
  };

  const mockOnChange = vi.fn();
  const mockErrors = {};

  it('renders section title', () => {
    render(
      <CertificationSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByRole('heading', { name: /certification/i })).toBeInTheDocument();
  });

  it('renders all certification fields', () => {
    render(
      <CertificationSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByLabelText(/patient signature/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/printed name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/signature date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/interviewed by/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/interview date/i)).toBeInTheDocument();
  });

  it('marks required fields', () => {
    render(
      <CertificationSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    const requiredIndicators = screen.getAllByText('*');
    expect(requiredIndicators.length).toBeGreaterThan(0);
  });

  it('displays field values', () => {
    const dataWithValues = {
      patient_signature: 'John Doe',
      patient_printed_name: 'JOHN DOE',
      patient_signature_date: '2024-01-01',
      interviewed_by: 'Staff Member',
      interviewed_date: '2024-01-01',
    };

    render(
      <CertificationSection
        formData={dataWithValues}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('JOHN DOE')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Staff Member')).toBeInTheDocument();
  });

  it('displays errors', () => {
    const errorsWithCert = {
      patient_signature: 'Signature is required',
      interviewed_by: 'Interviewer name is required',
    };

    render(
      <CertificationSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={errorsWithCert}
      />
    );

    expect(screen.getByText('Signature is required')).toBeInTheDocument();
    expect(screen.getByText('Interviewer name is required')).toBeInTheDocument();
  });
});
