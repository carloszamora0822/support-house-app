import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CheckboxGroup } from './CheckboxGroup';

describe('CheckboxGroup', () => {
  const options = [
    { value: 'food', label: 'Food' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'wigs', label: 'Wigs/Salon' },
  ];

  describe('Rendering', () => {
    it('renders all options', () => {
      render(
        <CheckboxGroup
          label="Assistance Types"
          options={options}
          value={[]}
          onChange={() => {}}
        />
      );

      expect(screen.getByLabelText('Food')).toBeInTheDocument();
      expect(screen.getByLabelText('Transportation')).toBeInTheDocument();
      expect(screen.getByLabelText('Wigs/Salon')).toBeInTheDocument();
    });

    it('renders group label', () => {
      render(
        <CheckboxGroup
          label="Assistance Types"
          options={options}
          value={[]}
          onChange={() => {}}
        />
      );

      expect(screen.getByText('Assistance Types')).toBeInTheDocument();
    });

    it('renders required indicator when required', () => {
      render(
        <CheckboxGroup
          label="Assistance Types"
          options={options}
          value={[]}
          onChange={() => {}}
          required
        />
      );

      expect(screen.getByText('*')).toBeInTheDocument();
    });
  });

  describe('Selection', () => {
    it('checks selected options', () => {
      render(
        <CheckboxGroup
          label="Assistance Types"
          options={options}
          value={['food', 'wigs']}
          onChange={() => {}}
        />
      );

      expect(screen.getByLabelText('Food')).toBeChecked();
      expect(screen.getByLabelText('Transportation')).not.toBeChecked();
      expect(screen.getByLabelText('Wigs/Salon')).toBeChecked();
    });

    it('calls onChange when option is checked', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(
        <CheckboxGroup
          label="Assistance Types"
          options={options}
          value={[]}
          onChange={onChange}
        />
      );

      await user.click(screen.getByLabelText('Food'));

      expect(onChange).toHaveBeenCalledWith(['food']);
    });

    it('calls onChange when option is unchecked', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(
        <CheckboxGroup
          label="Assistance Types"
          options={options}
          value={['food', 'transportation']}
          onChange={onChange}
        />
      );

      await user.click(screen.getByLabelText('Food'));

      expect(onChange).toHaveBeenCalledWith(['transportation']);
    });

    it('allows multiple selections', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(
        <CheckboxGroup
          label="Assistance Types"
          options={options}
          value={['food']}
          onChange={onChange}
        />
      );

      await user.click(screen.getByLabelText('Transportation'));

      expect(onChange).toHaveBeenCalledWith(['food', 'transportation']);
    });
  });

  describe('Error Handling', () => {
    it('displays error message when provided', () => {
      render(
        <CheckboxGroup
          label="Assistance Types"
          options={options}
          value={[]}
          onChange={() => {}}
          error="Please select at least one option"
        />
      );

      expect(screen.getByText('Please select at least one option')).toBeInTheDocument();
    });

    it('applies error styling when error exists', () => {
      const { container } = render(
        <CheckboxGroup
          label="Assistance Types"
          options={options}
          value={[]}
          onChange={() => {}}
          error="Error message"
        />
      );

      expect(container.querySelector('.text-red-600')).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('disables all checkboxes when disabled', () => {
      render(
        <CheckboxGroup
          label="Assistance Types"
          options={options}
          value={[]}
          onChange={() => {}}
          disabled
        />
      );

      expect(screen.getByLabelText('Food')).toBeDisabled();
      expect(screen.getByLabelText('Transportation')).toBeDisabled();
      expect(screen.getByLabelText('Wigs/Salon')).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('uses fieldset and legend for grouping', () => {
      const { container } = render(
        <CheckboxGroup
          label="Assistance Types"
          options={options}
          value={[]}
          onChange={() => {}}
        />
      );

      expect(container.querySelector('fieldset')).toBeInTheDocument();
      expect(container.querySelector('legend')).toBeInTheDocument();
    });

    it('associates error with fieldset', () => {
      render(
        <CheckboxGroup
          label="Assistance Types"
          options={options}
          value={[]}
          onChange={() => {}}
          error="Error message"
        />
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
