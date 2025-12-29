import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssistanceSelector } from './AssistanceSelector';
import { ASSISTANCE_TYPES } from '@/constants/assistanceTypes';

describe('AssistanceSelector', () => {
  it('renders all assistance type checkboxes', () => {
    render(
      <AssistanceSelector
        selected={[]}
        onChange={vi.fn()}
      />
    );

    ASSISTANCE_TYPES.forEach((type) => {
      expect(screen.getByLabelText(type.label)).toBeInTheDocument();
    });
  });

  it('renders assistance types from constants', () => {
    render(
      <AssistanceSelector
        selected={[]}
        onChange={vi.fn()}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(ASSISTANCE_TYPES.length);
  });

  it('calls onChange when checkbox clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <AssistanceSelector
        selected={[]}
        onChange={onChange}
      />
    );

    const foodCheckbox = screen.getByLabelText('Food');
    await user.click(foodCheckbox);

    expect(onChange).toHaveBeenCalledWith(['food'], '');
  });

  it('allows multiple selections', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <AssistanceSelector
        selected={[]}
        onChange={onChange}
      />
    );

    const foodCheckbox = screen.getByLabelText('Food');
    const wigsCheckbox = screen.getByLabelText('Wigs/Salon');

    await user.click(foodCheckbox);
    expect(onChange).toHaveBeenCalledWith(['food'], '');

    await user.click(wigsCheckbox);
    expect(onChange).toHaveBeenCalledWith(['wigs_salon'], '');
  });

  it('shows selected checkboxes as checked', () => {
    render(
      <AssistanceSelector
        selected={['food', 'wigs_salon']}
        onChange={vi.fn()}
      />
    );

    const foodCheckbox = screen.getByLabelText('Food') as HTMLInputElement;
    const wigsCheckbox = screen.getByLabelText('Wigs/Salon') as HTMLInputElement;
    const gasCheckbox = screen.getByLabelText('Gas Card') as HTMLInputElement;

    expect(foodCheckbox.checked).toBe(true);
    expect(wigsCheckbox.checked).toBe(true);
    expect(gasCheckbox.checked).toBe(false);
  });

  it('shows "Other" text input when Other selected', () => {
    render(
      <AssistanceSelector
        selected={['other']}
        onChange={vi.fn()}
      />
    );

    const otherInput = screen.getByPlaceholderText(/specify other/i);
    expect(otherInput).toBeInTheDocument();
  });

  it('hides "Other" text input when Other not selected', () => {
    render(
      <AssistanceSelector
        selected={['food']}
        onChange={vi.fn()}
      />
    );

    const otherInput = screen.queryByPlaceholderText(/specify other/i);
    expect(otherInput).not.toBeInTheDocument();
  });

  it('includes "Other" text in onChange callback', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <AssistanceSelector
        selected={['other']}
        onChange={onChange}
        otherText=""
      />
    );

    const otherInput = screen.getByPlaceholderText(/specify other/i);
    await user.type(otherInput, 'X');

    // Check that onChange was called with the text
    expect(onChange).toHaveBeenCalledWith(['other'], 'X');
  });

  it('removes item when unchecking', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <AssistanceSelector
        selected={['food', 'wigs_salon']}
        onChange={onChange}
      />
    );

    const foodCheckbox = screen.getByLabelText('Food');
    await user.click(foodCheckbox);

    expect(onChange).toHaveBeenCalledWith(['wigs_salon'], '');
  });
});
