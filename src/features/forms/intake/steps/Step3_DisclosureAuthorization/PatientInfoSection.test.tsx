import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PatientInfoSection } from './PatientInfoSection';

describe('PatientInfoSection', () => {
  const mockFormData = {
    fax_patient_name: 'John Doe',
    fax_patient_dob: '1980-01-01',
    fax_patient_address: '123 Main St',
    fax_patient_city: 'Fort Smith',
    fax_patient_state: 'AR',
    fax_patient_zip: '72901',
    fax_patient_phone: '555-123-4567',
  };

  const mockOnChange = vi.fn();
  const mockErrors = {};

  it('renders section title', () => {
    render(
      <PatientInfoSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByRole('heading', { name: /patient information/i })).toBeInTheDocument();
  });

  it('renders all patient info fields as read-only', () => {
    render(
      <PatientInfoSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1980-01-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123 Main St')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Fort Smith')).toBeInTheDocument();
    expect(screen.getByDisplayValue('AR')).toBeInTheDocument();
    expect(screen.getByDisplayValue('72901')).toBeInTheDocument();
    expect(screen.getByDisplayValue('555-123-4567')).toBeInTheDocument();
  });

  it('shows helper text about auto-fill', () => {
    render(
      <PatientInfoSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByText(/auto-filled from step 1/i)).toBeInTheDocument();
  });
});
