import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Step4_ReviewSubmit } from './Step4_ReviewSubmit';

describe('Step4_ReviewSubmit', () => {
  const mockPatientData = {
    name_first: 'John',
    name_last: 'Doe',
    dob: '1980-01-01',
    email: 'john@example.com',
  };

  const mockMedicalData = {
    diagnosis_primary: 'Breast Cancer',
    diagnosis_date: '2024-01-15',
    oncologist_mercy: ['Reddy'],
    oncologist_baptist: [],
  };

  const mockDisclosureData = {
    fax_form_date: '2024-01-15',
    fax_to_office: 'Mercy Oncology',
    office_patient_diagnosis: 'Breast Cancer Stage II',
    office_staff_signature: 'Dr. Smith',
    office_staff_signature_date: '2024-01-15',
    fax_patient_signature: 'John Doe',
    fax_patient_signature_date: '2024-01-15',
    fax_patient_printed_name: 'John Doe',
  };

  const mockOnSubmit = vi.fn();
  const mockOnEdit = vi.fn();

  it('renders step title', () => {
    render(
      <Step4_ReviewSubmit
        patientData={mockPatientData}
        medicalData={mockMedicalData}
        disclosureData={mockDisclosureData}
        onSubmit={mockOnSubmit}
        onEdit={mockOnEdit}
        isSubmitting={false}
      />
    );

    expect(screen.getByRole('heading', { name: /review.*submit/i, level: 2 })).toBeInTheDocument();
  });

  it('displays patient information', () => {
    render(
      <Step4_ReviewSubmit
        patientData={mockPatientData}
        medicalData={mockMedicalData}
        disclosureData={mockDisclosureData}
        onSubmit={mockOnSubmit}
        onEdit={mockOnEdit}
        isSubmitting={false}
      />
    );

    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
  });

  it('displays medical information', () => {
    render(
      <Step4_ReviewSubmit
        patientData={mockPatientData}
        medicalData={mockMedicalData}
        disclosureData={mockDisclosureData}
        onSubmit={mockOnSubmit}
        onEdit={mockOnEdit}
        isSubmitting={false}
      />
    );

    expect(screen.getAllByText(/breast cancer/i).length).toBeGreaterThanOrEqual(1);
  });

  it('displays disclosure information', () => {
    render(
      <Step4_ReviewSubmit
        patientData={mockPatientData}
        medicalData={mockMedicalData}
        disclosureData={mockDisclosureData}
        onSubmit={mockOnSubmit}
        onEdit={mockOnEdit}
        isSubmitting={false}
      />
    );

    expect(screen.getByText('Mercy Oncology')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(
      <Step4_ReviewSubmit
        patientData={mockPatientData}
        medicalData={mockMedicalData}
        disclosureData={mockDisclosureData}
        onSubmit={mockOnSubmit}
        onEdit={mockOnEdit}
        isSubmitting={false}
      />
    );

    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('disables submit button when submitting', () => {
    render(
      <Step4_ReviewSubmit
        patientData={mockPatientData}
        medicalData={mockMedicalData}
        disclosureData={mockDisclosureData}
        onSubmit={mockOnSubmit}
        onEdit={mockOnEdit}
        isSubmitting={true}
      />
    );

    expect(screen.getByRole('button', { name: /submitting/i })).toBeDisabled();
  });
});
