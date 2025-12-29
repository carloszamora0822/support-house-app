import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DemographicsSection } from './DemographicsSection';

describe('DemographicsSection', () => {
  const mockFormData = {
    status: '',
    ethnicity: [],
    ethnicity_other: '',
    language: [],
    language_other: '',
    education: '',
    guardian_name: '',
    guardian_relationship: '',
  };

  const mockOnChange = vi.fn();
  const mockErrors = {};

  describe('Rendering', () => {
    it('renders section title', () => {
      render(
        <DemographicsSection
          formData={mockFormData}
          onChange={mockOnChange}
          errors={mockErrors}
        />
      );

      expect(screen.getByText(/demographics/i)).toBeInTheDocument();
    });

    it('renders status radio group', () => {
      render(
        <DemographicsSection
          formData={mockFormData}
          onChange={mockOnChange}
          errors={mockErrors}
        />
      );

      expect(screen.getByRole('radio', { name: 'Female' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: 'Male' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: 'Child' })).toBeInTheDocument();
    });

    it('renders ethnicity checkbox group', () => {
      render(
        <DemographicsSection
          formData={mockFormData}
          onChange={mockOnChange}
          errors={mockErrors}
        />
      );

      expect(screen.getByText(/ethnicity/i)).toBeInTheDocument();
    });

    it('renders language checkbox group', () => {
      render(
        <DemographicsSection
          formData={mockFormData}
          onChange={mockOnChange}
          errors={mockErrors}
        />
      );

      expect(screen.getByText(/language/i)).toBeInTheDocument();
    });

    it('renders education field', () => {
      render(
        <DemographicsSection
          formData={mockFormData}
          onChange={mockOnChange}
          errors={mockErrors}
        />
      );

      expect(screen.getByLabelText(/education/i)).toBeInTheDocument();
    });
  });

  describe('Conditional Guardian Fields', () => {
    it('does not show guardian fields when status is not child', () => {
      const dataWithAdultStatus = {
        ...mockFormData,
        status: 'female',
      };

      render(
        <DemographicsSection
          formData={dataWithAdultStatus}
          onChange={mockOnChange}
          errors={mockErrors}
        />
      );

      expect(screen.queryByLabelText(/guardian name/i)).not.toBeInTheDocument();
    });

    it('shows guardian fields when status is child', () => {
      const dataWithChildStatus = {
        ...mockFormData,
        status: 'child',
      };

      render(
        <DemographicsSection
          formData={dataWithChildStatus}
          onChange={mockOnChange}
          errors={mockErrors}
        />
      );

      expect(screen.getByLabelText(/guardian name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/guardian relationship/i)).toBeInTheDocument();
    });

    it('marks guardian fields as required when status is child', () => {
      const dataWithChildStatus = {
        ...mockFormData,
        status: 'child',
      };

      render(
        <DemographicsSection
          formData={dataWithChildStatus}
          onChange={mockOnChange}
          errors={mockErrors}
        />
      );

      const requiredIndicators = screen.getAllByText('*');
      expect(requiredIndicators.length).toBeGreaterThan(0);
    });
  });

  describe('User Interactions', () => {
    it('calls onChange when status is selected', async () => {
      const user = userEvent.setup();

      render(
        <DemographicsSection
          formData={mockFormData}
          onChange={mockOnChange}
          errors={mockErrors}
        />
      );

      await user.click(screen.getByLabelText(/female/i));

      expect(mockOnChange).toHaveBeenCalledWith('status', 'female');
    });

    it('calls onChange when ethnicity is selected', async () => {
      const user = userEvent.setup();

      render(
        <DemographicsSection
          formData={mockFormData}
          onChange={mockOnChange}
          errors={mockErrors}
        />
      );

      const whiteCheckbox = screen.getByRole('checkbox', { name: /white/i });
      await user.click(whiteCheckbox);
      expect(mockOnChange).toHaveBeenCalled();
    });

    it('calls onChange when guardian name is entered', async () => {
      const user = userEvent.setup();
      const dataWithChildStatus = {
        ...mockFormData,
        status: 'child',
      };

      render(
        <DemographicsSection
          formData={dataWithChildStatus}
          onChange={mockOnChange}
          errors={mockErrors}
        />
      );

      const guardianInput = screen.getByLabelText(/guardian name/i);
      await user.type(guardianInput, 'Jane Doe');

      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  describe('Field Values', () => {
    it('displays selected status', () => {
      const dataWithStatus = {
        ...mockFormData,
        status: 'female',
      };

      render(
        <DemographicsSection
          formData={dataWithStatus}
          onChange={mockOnChange}
          errors={mockErrors}
        />
      );

      const femaleRadio = screen.getByRole('radio', { name: 'Female' });
      expect(femaleRadio).toBeChecked();
    });

    it('displays guardian information when provided', () => {
      const dataWithGuardian = {
        ...mockFormData,
        status: 'child',
        guardian_name: 'John Smith',
        guardian_relationship: 'Father',
      };

      render(
        <DemographicsSection
          formData={dataWithGuardian}
          onChange={mockOnChange}
          errors={mockErrors}
        />
      );

      expect(screen.getByDisplayValue('John Smith')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Father')).toBeInTheDocument();
    });
  });

  describe('Error Display', () => {
    it('displays error for status field', () => {
      const errorsWithStatus = {
        status: 'Status is required',
      };

      render(
        <DemographicsSection
          formData={mockFormData}
          onChange={mockOnChange}
          errors={errorsWithStatus}
        />
      );

      expect(screen.getByText('Status is required')).toBeInTheDocument();
    });

    it('displays error for guardian fields', () => {
      const dataWithChildStatus = {
        ...mockFormData,
        status: 'child',
      };
      const errorsWithGuardian = {
        guardian_name: 'Guardian name is required',
      };

      render(
        <DemographicsSection
          formData={dataWithChildStatus}
          onChange={mockOnChange}
          errors={errorsWithGuardian}
        />
      );

      expect(screen.getByText('Guardian name is required')).toBeInTheDocument();
    });
  });
});
