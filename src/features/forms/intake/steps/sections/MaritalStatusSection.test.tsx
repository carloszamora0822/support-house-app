import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MaritalStatusSection } from './MaritalStatusSection';

describe('MaritalStatusSection', () => {
  const mockFormData = {
    marital_status: '',
    spouse_name: '',
    spouse_cell: '',
    spouse_work: '',
  };

  const mockOnChange = vi.fn();
  const mockErrors = {};

  it('renders section title', () => {
    render(
      <MaritalStatusSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByRole('heading', { name: /marital status/i })).toBeInTheDocument();
  });

  it('renders marital status field', () => {
    render(
      <MaritalStatusSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByLabelText(/marital status/i)).toBeInTheDocument();
  });

  it('hides spouse fields when not married', () => {
    render(
      <MaritalStatusSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.queryByLabelText(/spouse name/i)).not.toBeInTheDocument();
  });

  it('shows spouse fields when married', () => {
    const dataWithMarried = {
      ...mockFormData,
      marital_status: 'married',
    };

    render(
      <MaritalStatusSection
        formData={dataWithMarried}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByLabelText(/spouse name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/spouse cell/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/spouse work/i)).toBeInTheDocument();
  });

  it('displays spouse information when provided', () => {
    const dataWithSpouse = {
      ...mockFormData,
      marital_status: 'married',
      spouse_name: 'Jane Doe',
      spouse_cell: '555-1234',
    };

    render(
      <MaritalStatusSection
        formData={dataWithSpouse}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByDisplayValue('Jane Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('555-1234')).toBeInTheDocument();
  });

  it('displays errors', () => {
    const dataWithMarried = {
      ...mockFormData,
      marital_status: 'married',
    };
    const errorsWithSpouse = {
      spouse_name: 'Spouse name is required',
    };

    render(
      <MaritalStatusSection
        formData={dataWithMarried}
        onChange={mockOnChange}
        errors={errorsWithSpouse}
      />
    );

    expect(screen.getByText('Spouse name is required')).toBeInTheDocument();
  });
});
