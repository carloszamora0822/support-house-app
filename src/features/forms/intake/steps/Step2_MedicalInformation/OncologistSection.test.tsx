import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OncologistSection } from './OncologistSection';

describe('OncologistSection', () => {
  const mockFormData = {
    oncologist_mercy: [],
    oncologist_baptist: [],
    oncologist_other: '',
  };

  const mockOnChange = vi.fn();
  const mockErrors = {};

  it('renders section title', () => {
    render(
      <OncologistSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByRole('heading', { name: /oncologist/i })).toBeInTheDocument();
  });

  it('renders Mercy oncologist checkboxes', () => {
    render(
      <OncologistSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByRole('checkbox', { name: /reddy/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /mackey/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /samman/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /shrestha/i })).toBeInTheDocument();
  });

  it('renders Baptist oncologist checkbox', () => {
    render(
      <OncologistSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByRole('checkbox', { name: /arzoumanian/i })).toBeInTheDocument();
  });

  it('renders other oncologist text field', () => {
    render(
      <OncologistSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByLabelText(/other oncologist/i)).toBeInTheDocument();
  });

  it('displays selected Mercy oncologists', () => {
    const dataWithSelections = {
      oncologist_mercy: ['Reddy', 'Mackey'],
      oncologist_baptist: [],
      oncologist_other: '',
    };

    render(
      <OncologistSection
        formData={dataWithSelections}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByRole('checkbox', { name: /reddy/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /mackey/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /samman/i })).not.toBeChecked();
  });

  it('displays selected Baptist oncologist', () => {
    const dataWithBaptist = {
      oncologist_mercy: [],
      oncologist_baptist: ['Arzoumanian'],
      oncologist_other: '',
    };

    render(
      <OncologistSection
        formData={dataWithBaptist}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByRole('checkbox', { name: /arzoumanian/i })).toBeChecked();
  });

  it('displays other oncologist text', () => {
    const dataWithOther = {
      oncologist_mercy: [],
      oncologist_baptist: [],
      oncologist_other: 'Dr. External Specialist',
    };

    render(
      <OncologistSection
        formData={dataWithOther}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByDisplayValue('Dr. External Specialist')).toBeInTheDocument();
  });

  it('calls onChange when Mercy oncologist is selected', async () => {
    const user = userEvent.setup();

    render(
      <OncologistSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    await user.click(screen.getByRole('checkbox', { name: /reddy/i }));

    expect(mockOnChange).toHaveBeenCalledWith('oncologist_mercy', expect.arrayContaining(['Reddy']));
  });

  it('calls onChange when Baptist oncologist is selected', async () => {
    const user = userEvent.setup();

    render(
      <OncologistSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    await user.click(screen.getByRole('checkbox', { name: /arzoumanian/i }));

    expect(mockOnChange).toHaveBeenCalledWith('oncologist_baptist', expect.arrayContaining(['Arzoumanian']));
  });

  it('calls onChange when other oncologist is entered', async () => {
    const user = userEvent.setup();

    render(
      <OncologistSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    const otherInput = screen.getByLabelText(/other oncologist/i);
    await user.type(otherInput, 'Dr. Smith');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('displays errors', () => {
    const errorsWithOncologist = {
      oncologist_mercy: 'At least one oncologist is required',
    };

    render(
      <OncologistSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={errorsWithOncologist}
      />
    );

    expect(screen.getByText('At least one oncologist is required')).toBeInTheDocument();
  });
});
