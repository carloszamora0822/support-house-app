import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PatientIdentitySection } from './PatientIdentitySection';

describe('PatientIdentitySection', () => {
  const mockFormData = {
    first_name: '',
    middle_name: '',
    last_name: '',
    goes_by: '',
    dob: '',
    address: '',
    city: '',
    county: '',
    state: '',
    zip: '',
  };

  const mockOnChange = vi.fn();
  const mockErrors = {};

  describe('Rendering', () => {
    it('renders all identity fields', () => {
      render(
        <PatientIdentitySection
          formData={mockFormData}
          onChange={mockOnChange}
          errors={mockErrors}
        />
      );

      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/middle name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/goes by/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
    });

    it('renders all address fields', () => {
      render(
        <PatientIdentitySection
          formData={mockFormData}
          onChange={mockOnChange}
          errors={mockErrors}
        />
      );

      expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/county/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/zip/i)).toBeInTheDocument();
    });

    it('marks required fields with asterisk', () => {
      render(
        <PatientIdentitySection
          formData={mockFormData}
          onChange={mockOnChange}
          errors={mockErrors}
        />
      );

      const requiredFields = screen.getAllByText('*');
      expect(requiredFields.length).toBeGreaterThan(0);
    });

    it('renders section title', () => {
      render(
        <PatientIdentitySection
          formData={mockFormData}
          onChange={mockOnChange}
          errors={mockErrors}
        />
      );

      expect(screen.getByText(/patient identity/i)).toBeInTheDocument();
    });
  });

  describe('Field Values', () => {
    it('displays initial values', () => {
      const dataWithValues = {
        ...mockFormData,
        first_name: 'John',
        last_name: 'Doe',
        city: 'Austin',
      };

      render(
        <PatientIdentitySection
          formData={dataWithValues}
          onChange={mockOnChange}
          errors={mockErrors}
        />
      );

      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Austin')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('calls onChange when first name is entered', async () => {
      const user = userEvent.setup();

      render(
        <PatientIdentitySection
          formData={mockFormData}
          onChange={mockOnChange}
          errors={mockErrors}
        />
      );

      const firstNameInput = screen.getByLabelText(/first name/i);
      await user.type(firstNameInput, 'Jane');

      expect(mockOnChange).toHaveBeenCalled();
    });

    it('calls onChange with correct field name and value', async () => {
      const user = userEvent.setup();

      render(
        <PatientIdentitySection
          formData={mockFormData}
          onChange={mockOnChange}
          errors={mockErrors}
        />
      );

      const cityInput = screen.getByLabelText(/city/i);
      await user.type(cityInput, 'A');

      expect(mockOnChange).toHaveBeenCalledWith('city', expect.any(String));
    });
  });

  describe('Error Display', () => {
    it('displays error for first_name field', () => {
      const errorsWithFirstName = {
        first_name: 'First name is required',
      };

      render(
        <PatientIdentitySection
          formData={mockFormData}
          onChange={mockOnChange}
          errors={errorsWithFirstName}
        />
      );

      expect(screen.getByText('First name is required')).toBeInTheDocument();
    });

    it('displays multiple errors', () => {
      const multipleErrors = {
        first_name: 'First name is required',
        last_name: 'Last name is required',
        dob: 'Date of birth is required',
      };

      render(
        <PatientIdentitySection
          formData={mockFormData}
          onChange={mockOnChange}
          errors={multipleErrors}
        />
      );

      expect(screen.getByText('First name is required')).toBeInTheDocument();
      expect(screen.getByText('Last name is required')).toBeInTheDocument();
      expect(screen.getByText('Date of birth is required')).toBeInTheDocument();
    });

    it('does not display errors when errors object is empty', () => {
      render(
        <PatientIdentitySection
          formData={mockFormData}
          onChange={mockOnChange}
          errors={{}}
        />
      );

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Field Types', () => {
    it('renders date input for DOB', () => {
      render(
        <PatientIdentitySection
          formData={mockFormData}
          onChange={mockOnChange}
          errors={mockErrors}
        />
      );

      const dobInput = screen.getByLabelText(/date of birth/i);
      expect(dobInput).toHaveAttribute('type', 'date');
    });

    it('renders text inputs for name fields', () => {
      render(
        <PatientIdentitySection
          formData={mockFormData}
          onChange={mockOnChange}
          errors={mockErrors}
        />
      );

      const firstNameInput = screen.getByLabelText(/first name/i);
      expect(firstNameInput).toHaveAttribute('type', 'text');
    });
  });

  describe('Layout', () => {
    it('renders fields in a grid layout', () => {
      const { container } = render(
        <PatientIdentitySection
          formData={mockFormData}
          onChange={mockOnChange}
          errors={mockErrors}
        />
      );

      const gridElements = container.querySelectorAll('.grid');
      expect(gridElements.length).toBeGreaterThan(0);
    });
  });
});
