import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChemoDetailsSection } from './ChemoDetailsSection';

describe('ChemoDetailsSection', () => {
  const mockFormData = {
    office_chemo_type: [],
    office_chemo_frequency: '',
    office_chemo_every_weeks: undefined,
  };

  const mockOnChange = vi.fn();
  const mockErrors = {};

  it('renders section title', () => {
    render(
      <ChemoDetailsSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByRole('heading', { name: /chemotherapy details/i })).toBeInTheDocument();
  });

  it('renders chemo type checkboxes', () => {
    render(
      <ChemoDetailsSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByRole('checkbox', { name: /iv/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /oral/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /pump/i })).toBeInTheDocument();
  });

  it('renders frequency field', () => {
    render(
      <ChemoDetailsSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByLabelText(/frequency/i)).toBeInTheDocument();
  });

  it('displays selected chemo types', () => {
    const dataWithTypes = {
      office_chemo_type: ['IV', 'Oral'],
      office_chemo_frequency: 'weekly',
      office_chemo_every_weeks: 2,
    };

    render(
      <ChemoDetailsSection
        formData={dataWithTypes}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByRole('checkbox', { name: /iv/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /oral/i })).toBeChecked();
  });
});
