import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FaxHeaderSection } from './FaxHeaderSection';

describe('FaxHeaderSection', () => {
  const mockFormData = {
    fax_form_date: '',
    fax_to_office: '',
  };

  const mockOnChange = vi.fn();
  const mockErrors = {};

  it('renders section title', () => {
    render(
      <FaxHeaderSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByRole('heading', { name: /fax header/i })).toBeInTheDocument();
  });

  it('renders fax form date field', () => {
    render(
      <FaxHeaderSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByLabelText(/fax form date/i)).toBeInTheDocument();
  });

  it('renders fax to office field', () => {
    render(
      <FaxHeaderSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByLabelText(/fax to office/i)).toBeInTheDocument();
  });

  it('marks required fields', () => {
    render(
      <FaxHeaderSection
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
      fax_form_date: '2024-01-15',
      fax_to_office: 'Mercy Oncology',
    };

    render(
      <FaxHeaderSection
        formData={dataWithValues}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByDisplayValue('2024-01-15')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Mercy Oncology')).toBeInTheDocument();
  });

  it('displays errors', () => {
    const errorsWithFax = {
      fax_form_date: 'Date is required',
      fax_to_office: 'Office is required',
    };

    render(
      <FaxHeaderSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={errorsWithFax}
      />
    );

    expect(screen.getByText('Date is required')).toBeInTheDocument();
    expect(screen.getByText('Office is required')).toBeInTheDocument();
  });
});
