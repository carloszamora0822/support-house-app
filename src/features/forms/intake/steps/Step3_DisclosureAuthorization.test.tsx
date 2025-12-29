import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Step3_DisclosureAuthorization } from './Step3_DisclosureAuthorization';
import type { DisclosureAuthorizationInput } from './schemas/disclosureSchema';

describe('Step3_DisclosureAuthorization', () => {
  const mockFormData: DisclosureAuthorizationInput = {
    fax_form_date: '',
    fax_to_office: '',
    fax_patient_name: 'John Doe',
    fax_patient_dob: '1980-01-01',
    fax_patient_address: '123 Main St',
    fax_patient_city: 'Fort Smith',
    fax_patient_state: 'AR',
    fax_patient_zip: '72901',
    fax_patient_phone: '555-123-4567',
    office_patient_diagnosis: '',
    office_staff_signature: '',
    office_staff_signature_date: '',
    fax_patient_signature: '',
    fax_patient_signature_date: '',
    fax_patient_printed_name: '',
  };

  const mockOnChange = vi.fn();
  const mockErrors = {};

  it('renders step title', () => {
    render(
      <Step3_DisclosureAuthorization
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByRole('heading', { name: /authorization to disclose/i, level: 2 })).toBeInTheDocument();
  });

  it('renders all sections', () => {
    render(
      <Step3_DisclosureAuthorization
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByRole('heading', { name: /fax header/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /patient information/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /medical office staff/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /chemotherapy details/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /radiation details/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /signatures/i })).toBeInTheDocument();
  });

  it('passes formData to all sections', () => {
    render(
      <Step3_DisclosureAuthorization
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Fort Smith')).toBeInTheDocument();
  });
});
