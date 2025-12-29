import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadiationOncologistSection } from './RadiationOncologistSection';

describe('RadiationOncologistSection', () => {
  const mockFormData = {
    rad_oncologist_mercy: '',
    rad_oncologist_baptist: '',
    rad_oncologist_other: '',
  };

  const mockOnChange = vi.fn();
  const mockErrors = {};

  it('renders section title', () => {
    render(
      <RadiationOncologistSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByRole('heading', { name: /radiation oncologist/i })).toBeInTheDocument();
  });

  it('renders all radiation oncologist fields', () => {
    render(
      <RadiationOncologistSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByLabelText(/mercy radiation oncologist/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/baptist radiation oncologist/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/other radiation oncologist/i)).toBeInTheDocument();
  });

  it('displays field values', () => {
    const dataWithValues = {
      rad_oncologist_mercy: 'Dr. Mercy Radiation',
      rad_oncologist_baptist: 'Dr. Baptist Radiation',
      rad_oncologist_other: 'Dr. External Radiation',
    };

    render(
      <RadiationOncologistSection
        formData={dataWithValues}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByDisplayValue('Dr. Mercy Radiation')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Dr. Baptist Radiation')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Dr. External Radiation')).toBeInTheDocument();
  });

  it('calls onChange when field is updated', async () => {
    const user = userEvent.setup();

    render(
      <RadiationOncologistSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    const mercyInput = screen.getByLabelText(/mercy radiation oncologist/i);
    await user.type(mercyInput, 'Dr. Smith');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('displays errors', () => {
    const errorsWithRad = {
      rad_oncologist_mercy: 'Invalid name',
    };

    render(
      <RadiationOncologistSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={errorsWithRad}
      />
    );

    expect(screen.getByText('Invalid name')).toBeInTheDocument();
  });
});
