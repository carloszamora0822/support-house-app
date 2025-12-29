import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProviderDetailsSection } from './ProviderDetailsSection';

describe('ProviderDetailsSection', () => {
  const mockFormData = {
    provider_other_role: '',
    provider_other_location: '',
    provider_other_city: '',
    provider_other_state: '',
    surgeon_name: '',
    surgeon_location: '',
    surgeon_city: '',
    surgeon_state: '',
    general_doctor: '',
    general_location: '',
    general_city: '',
    general_state: '',
  };

  const mockOnChange = vi.fn();
  const mockErrors = {};

  it('renders section title', () => {
    render(
      <ProviderDetailsSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByRole('heading', { name: /provider details/i })).toBeInTheDocument();
  });

  it('renders other provider fields', () => {
    render(
      <ProviderDetailsSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByLabelText(/other provider role/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/other provider location/i)).toBeInTheDocument();
  });

  it('renders surgeon fields', () => {
    render(
      <ProviderDetailsSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByLabelText(/surgeon name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/surgeon location/i)).toBeInTheDocument();
  });

  it('renders general doctor fields', () => {
    render(
      <ProviderDetailsSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByLabelText(/general doctor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/general location/i)).toBeInTheDocument();
  });

  it('displays field values', () => {
    const dataWithValues = {
      ...mockFormData,
      surgeon_name: 'Dr. Johnson',
      surgeon_location: 'Mercy Hospital',
      general_doctor: 'Dr. Williams',
      general_location: 'Family Clinic',
    };

    render(
      <ProviderDetailsSection
        formData={dataWithValues}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByDisplayValue('Dr. Johnson')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Mercy Hospital')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Dr. Williams')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Family Clinic')).toBeInTheDocument();
  });
});
