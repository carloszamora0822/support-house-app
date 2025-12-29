import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReferralSection } from './ReferralSection';

describe('ReferralSection', () => {
  const mockFormData = {
    referral_source: '',
    referral_other: '',
    assistance_types: [],
    assistance_other: '',
  };

  const mockOnChange = vi.fn();
  const mockErrors = {};

  it('renders section title', () => {
    render(
      <ReferralSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByRole('heading', { name: /referral/i })).toBeInTheDocument();
  });

  it('renders referral source field', () => {
    render(
      <ReferralSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByLabelText(/referral source/i)).toBeInTheDocument();
  });

  it('renders assistance types checkboxes', () => {
    render(
      <ReferralSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByText(/assistance types/i)).toBeInTheDocument();
  });

  it('shows other field when referral_source is other', () => {
    const dataWithOther = {
      ...mockFormData,
      referral_source: 'other',
    };

    render(
      <ReferralSection
        formData={dataWithOther}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByLabelText(/other referral source/i)).toBeInTheDocument();
  });

  it('displays errors', () => {
    const errorsWithReferral = {
      referral_source: 'Referral source is required',
      assistance_types: 'At least one assistance type is required',
    };

    render(
      <ReferralSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={errorsWithReferral}
      />
    );

    expect(screen.getByText('Referral source is required')).toBeInTheDocument();
    expect(screen.getByText('At least one assistance type is required')).toBeInTheDocument();
  });
});
