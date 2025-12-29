import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InsuranceSection } from './InsuranceSection';

describe('InsuranceSection', () => {
  const mockFormData = {
    has_insurance: false,
    insurance_type: [],
    is_veteran: false,
  };

  const mockOnChange = vi.fn();
  const mockErrors = {};

  it('renders section title', () => {
    render(
      <InsuranceSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByRole('heading', { name: /insurance/i })).toBeInTheDocument();
  });

  it('renders has insurance checkbox', () => {
    render(
      <InsuranceSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByLabelText(/has insurance/i)).toBeInTheDocument();
  });

  it('shows insurance types when has_insurance is true', () => {
    const dataWithInsurance = {
      ...mockFormData,
      has_insurance: true,
    };

    render(
      <InsuranceSection
        formData={dataWithInsurance}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByText(/insurance type/i)).toBeInTheDocument();
  });

  it('hides insurance types when has_insurance is false', () => {
    render(
      <InsuranceSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.queryByText(/insurance type/i)).not.toBeInTheDocument();
  });

  it('renders veteran status checkbox', () => {
    render(
      <InsuranceSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByLabelText(/veteran/i)).toBeInTheDocument();
  });

  it('calls onChange when has_insurance is toggled', async () => {
    const user = userEvent.setup();

    render(
      <InsuranceSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    await user.click(screen.getByLabelText(/has insurance/i));
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('displays errors', () => {
    const errorsWithInsurance = {
      insurance_type: 'Insurance type is required',
    };

    const dataWithInsurance = {
      ...mockFormData,
      has_insurance: true,
    };

    render(
      <InsuranceSection
        formData={dataWithInsurance}
        onChange={mockOnChange}
        errors={errorsWithInsurance}
      />
    );

    expect(screen.getByText('Insurance type is required')).toBeInTheDocument();
  });
});
