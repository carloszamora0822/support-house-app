import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RadiationDetailsSection } from './RadiationDetailsSection';

describe('RadiationDetailsSection', () => {
  const mockFormData = {
    office_radiation_frequency: '',
    office_radiation_every_weeks: undefined,
  };

  const mockOnChange = vi.fn();
  const mockErrors = {};

  it('renders section title', () => {
    render(
      <RadiationDetailsSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByRole('heading', { name: /radiation details/i })).toBeInTheDocument();
  });

  it('renders frequency field', () => {
    render(
      <RadiationDetailsSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByLabelText(/frequency/i)).toBeInTheDocument();
  });

  it('renders every weeks field', () => {
    render(
      <RadiationDetailsSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByLabelText(/every.*weeks/i)).toBeInTheDocument();
  });

  it('displays field values', () => {
    const dataWithValues = {
      office_radiation_frequency: 'daily',
      office_radiation_every_weeks: 1,
    };

    render(
      <RadiationDetailsSection
        formData={dataWithValues}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByDisplayValue('daily')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
  });
});
