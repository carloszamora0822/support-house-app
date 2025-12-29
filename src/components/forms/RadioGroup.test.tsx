import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioGroup } from './RadioGroup';

describe('RadioGroup', () => {
  const options = [
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
    { value: 'child', label: 'Child' },
  ];

  describe('Rendering', () => {
    it('renders all options', () => {
      render(
        <RadioGroup
          label="Status"
          options={options}
          value=""
          onChange={() => {}}
        />
      );

      expect(screen.getByLabelText('Female')).toBeInTheDocument();
      expect(screen.getByLabelText('Male')).toBeInTheDocument();
      expect(screen.getByLabelText('Child')).toBeInTheDocument();
    });

    it('renders group label', () => {
      render(
        <RadioGroup
          label="Status"
          options={options}
          value=""
          onChange={() => {}}
        />
      );

      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('renders required indicator when required', () => {
      render(
        <RadioGroup
          label="Status"
          options={options}
          value=""
          onChange={() => {}}
          required
        />
      );

      expect(screen.getByText('*')).toBeInTheDocument();
    });
  });

  describe('Selection', () => {
    it('checks selected option', () => {
      render(
        <RadioGroup
          label="Status"
          options={options}
          value="female"
          onChange={() => {}}
        />
      );

      expect(screen.getByLabelText('Female')).toBeChecked();
      expect(screen.getByLabelText('Male')).not.toBeChecked();
      expect(screen.getByLabelText('Child')).not.toBeChecked();
    });

    it('calls onChange when option is selected', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(
        <RadioGroup
          label="Status"
          options={options}
          value=""
          onChange={onChange}
        />
      );

      await user.click(screen.getByLabelText('Female'));

      expect(onChange).toHaveBeenCalledWith('female');
    });

    it('allows changing selection', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(
        <RadioGroup
          label="Status"
          options={options}
          value="female"
          onChange={onChange}
        />
      );

      await user.click(screen.getByLabelText('Male'));

      expect(onChange).toHaveBeenCalledWith('male');
    });

    it('only allows single selection', () => {
      render(
        <RadioGroup
          label="Status"
          options={options}
          value="female"
          onChange={() => {}}
        />
      );

      const radios = screen.getAllByRole('radio');
      const checkedRadios = radios.filter(radio => (radio as HTMLInputElement).checked);
      
      expect(checkedRadios).toHaveLength(1);
    });
  });

  describe('Error Handling', () => {
    it('displays error message when provided', () => {
      render(
        <RadioGroup
          label="Status"
          options={options}
          value=""
          onChange={() => {}}
          error="Please select an option"
        />
      );

      expect(screen.getByText('Please select an option')).toBeInTheDocument();
    });

    it('applies error styling when error exists', () => {
      const { container } = render(
        <RadioGroup
          label="Status"
          options={options}
          value=""
          onChange={() => {}}
          error="Error message"
        />
      );

      expect(container.querySelector('.text-red-600')).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('disables all radio buttons when disabled', () => {
      render(
        <RadioGroup
          label="Status"
          options={options}
          value=""
          onChange={() => {}}
          disabled
        />
      );

      expect(screen.getByLabelText('Female')).toBeDisabled();
      expect(screen.getByLabelText('Male')).toBeDisabled();
      expect(screen.getByLabelText('Child')).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('uses fieldset and legend for grouping', () => {
      const { container } = render(
        <RadioGroup
          label="Status"
          options={options}
          value=""
          onChange={() => {}}
        />
      );

      expect(container.querySelector('fieldset')).toBeInTheDocument();
      expect(container.querySelector('legend')).toBeInTheDocument();
    });

    it('associates error with fieldset', () => {
      render(
        <RadioGroup
          label="Status"
          options={options}
          value=""
          onChange={() => {}}
          error="Error message"
        />
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('groups radio buttons with same name', () => {
      const { container } = render(
        <RadioGroup
          label="Status"
          options={options}
          value=""
          onChange={() => {}}
        />
      );

      const radios = container.querySelectorAll('input[type="radio"]');
      const names = Array.from(radios).map(radio => (radio as HTMLInputElement).name);
      const uniqueNames = new Set(names);

      expect(uniqueNames.size).toBe(1);
    });
  });

  describe('Layout', () => {
    it('renders options horizontally when horizontal prop is true', () => {
      const { container } = render(
        <RadioGroup
          label="Status"
          options={options}
          value=""
          onChange={() => {}}
          horizontal
        />
      );

      expect(container.querySelector('.flex-row')).toBeInTheDocument();
    });

    it('renders options vertically by default', () => {
      const { container } = render(
        <RadioGroup
          label="Status"
          options={options}
          value=""
          onChange={() => {}}
        />
      );

      expect(container.querySelector('.space-y-2')).toBeInTheDocument();
    });
  });
});
