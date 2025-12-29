import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormField } from './FormField';

describe('FormField', () => {
  describe('Rendering', () => {
    it('renders label and input', () => {
      render(
        <FormField
          label="First Name"
          name="first_name"
          value=""
          onChange={() => {}}
        />
      );

      expect(screen.getByLabelText('First Name')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders with initial value', () => {
      render(
        <FormField
          label="First Name"
          name="first_name"
          value="John"
          onChange={() => {}}
        />
      );

      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    });

    it('renders required indicator when required', () => {
      render(
        <FormField
          label="First Name"
          name="first_name"
          value=""
          onChange={() => {}}
          required
        />
      );

      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('does not render required indicator when not required', () => {
      render(
        <FormField
          label="First Name"
          name="first_name"
          value=""
          onChange={() => {}}
        />
      );

      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });
  });

  describe('Input Types', () => {
    it('renders text input by default', () => {
      render(
        <FormField
          label="Name"
          name="name"
          value=""
          onChange={() => {}}
        />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('renders email input', () => {
      render(
        <FormField
          label="Email"
          name="email"
          type="email"
          value=""
          onChange={() => {}}
        />
      );

      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('renders date input', () => {
      render(
        <FormField
          label="Date of Birth"
          name="dob"
          type="date"
          value=""
          onChange={() => {}}
        />
      );

      const input = screen.getByLabelText('Date of Birth');
      expect(input).toHaveAttribute('type', 'date');
    });

    it('renders tel input', () => {
      render(
        <FormField
          label="Phone"
          name="phone"
          type="tel"
          value=""
          onChange={() => {}}
        />
      );

      const input = screen.getByLabelText('Phone');
      expect(input).toHaveAttribute('type', 'tel');
    });

    it('renders textarea when multiline is true', () => {
      render(
        <FormField
          label="Notes"
          name="notes"
          value=""
          onChange={() => {}}
          multiline
        />
      );

      expect(screen.getByRole('textbox')).toHaveProperty('tagName', 'TEXTAREA');
    });
  });

  describe('Error Handling', () => {
    it('displays error message when provided', () => {
      render(
        <FormField
          label="Email"
          name="email"
          value="invalid"
          onChange={() => {}}
          error="Invalid email format"
        />
      );

      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    });

    it('applies error styling when error exists', () => {
      render(
        <FormField
          label="Email"
          name="email"
          value="invalid"
          onChange={() => {}}
          error="Invalid email format"
        />
      );

      const input = screen.getByLabelText('Email');
      expect(input).toHaveClass('border-red-500');
    });

    it('does not display error when not provided', () => {
      render(
        <FormField
          label="Email"
          name="email"
          value=""
          onChange={() => {}}
        />
      );

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Helper Text', () => {
    it('displays helper text when provided', () => {
      render(
        <FormField
          label="Password"
          name="password"
          value=""
          onChange={() => {}}
          helperText="Must be at least 8 characters"
        />
      );

      expect(screen.getByText('Must be at least 8 characters')).toBeInTheDocument();
    });

    it('does not display helper text when not provided', () => {
      const { container } = render(
        <FormField
          label="Name"
          name="name"
          value=""
          onChange={() => {}}
        />
      );

      const helperText = container.querySelector('.text-gray-500');
      expect(helperText).not.toBeInTheDocument();
    });

    it('shows error instead of helper text when both provided', () => {
      render(
        <FormField
          label="Email"
          name="email"
          value="invalid"
          onChange={() => {}}
          helperText="Enter your email"
          error="Invalid email format"
        />
      );

      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
      expect(screen.queryByText('Enter your email')).not.toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('disables input when disabled prop is true', () => {
      render(
        <FormField
          label="Name"
          name="name"
          value=""
          onChange={() => {}}
          disabled
        />
      );

      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('enables input by default', () => {
      render(
        <FormField
          label="Name"
          name="name"
          value=""
          onChange={() => {}}
        />
      );

      expect(screen.getByRole('textbox')).not.toBeDisabled();
    });
  });

  describe('Placeholder', () => {
    it('displays placeholder text', () => {
      render(
        <FormField
          label="Name"
          name="name"
          value=""
          onChange={() => {}}
          placeholder="Enter your name"
        />
      );

      expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('associates label with input using htmlFor', () => {
      render(
        <FormField
          label="First Name"
          name="first_name"
          value=""
          onChange={() => {}}
        />
      );

      const label = screen.getByText('First Name');
      const input = screen.getByRole('textbox');
      
      expect(label).toHaveAttribute('for', 'first_name');
      expect(input).toHaveAttribute('id', 'first_name');
    });

    it('marks input as required when required prop is true', () => {
      render(
        <FormField
          label="Name"
          name="name"
          value=""
          onChange={() => {}}
          required
        />
      );

      expect(screen.getByRole('textbox')).toBeRequired();
    });

    it('associates error message with input using aria-describedby', () => {
      render(
        <FormField
          label="Email"
          name="email"
          value="invalid"
          onChange={() => {}}
          error="Invalid email format"
        />
      );

      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('aria-describedby', 'email-error');
      expect(screen.getByText('Invalid email format')).toHaveAttribute('id', 'email-error');
    });

    it('marks input as invalid when error exists', () => {
      render(
        <FormField
          label="Email"
          name="email"
          value="invalid"
          onChange={() => {}}
          error="Invalid email format"
        />
      );

      expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('Custom className', () => {
    it('applies custom className to container', () => {
      const { container } = render(
        <FormField
          label="Name"
          name="name"
          value=""
          onChange={() => {}}
          className="custom-class"
        />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});
