import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmploymentSection } from './EmploymentSection';

describe('EmploymentSection', () => {
  const mockFormData = {
    employment_status: '',
    employer_name: '',
    occupation: '',
    home_has_employed: false,
  };

  const mockOnChange = vi.fn();
  const mockErrors = {};

  it('renders section title', () => {
    render(
      <EmploymentSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByRole('heading', { name: /employment/i })).toBeInTheDocument();
  });

  it('renders all employment fields', () => {
    render(
      <EmploymentSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByLabelText(/employment status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/employer name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/occupation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/home has employed/i)).toBeInTheDocument();
  });

  it('displays field values', () => {
    const dataWithValues = {
      ...mockFormData,
      employment_status: 'Full-time',
      employer_name: 'Acme Corp',
    };

    render(
      <EmploymentSection
        formData={dataWithValues}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByDisplayValue('Full-time')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Acme Corp')).toBeInTheDocument();
  });

  it('displays errors', () => {
    const errorsWithEmployment = {
      employer_name: 'Employer name is required',
    };

    render(
      <EmploymentSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={errorsWithEmployment}
      />
    );

    expect(screen.getByText('Employer name is required')).toBeInTheDocument();
  });
});
