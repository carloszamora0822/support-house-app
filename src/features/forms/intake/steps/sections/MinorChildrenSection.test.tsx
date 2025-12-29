import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MinorChildrenSection } from './MinorChildrenSection';

describe('MinorChildrenSection', () => {
  const mockFormData = {
    minor_children: [],
  };

  const mockOnChange = vi.fn();
  const mockErrors = {};

  it('renders section title', () => {
    render(
      <MinorChildrenSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByRole('heading', { name: /minor children/i })).toBeInTheDocument();
  });

  it('renders add button', () => {
    render(
      <MinorChildrenSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByText(/add child/i)).toBeInTheDocument();
  });

  it('displays empty message when no children', () => {
    render(
      <MinorChildrenSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByText(/no minor children added/i)).toBeInTheDocument();
  });

  it('renders existing children', () => {
    const dataWithChildren = {
      minor_children: [
        { name: 'Child 1', dob: '2015-01-01', sex: 'M' as const },
        { name: 'Child 2', dob: '2018-06-15', sex: 'F' as const },
      ],
    };

    render(
      <MinorChildrenSection
        formData={dataWithChildren}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    expect(screen.getByDisplayValue('Child 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Child 2')).toBeInTheDocument();
  });

  it('calls onChange when add button clicked', async () => {
    const user = userEvent.setup();

    render(
      <MinorChildrenSection
        formData={mockFormData}
        onChange={mockOnChange}
        errors={mockErrors}
      />
    );

    await user.click(screen.getByText(/add child/i));

    expect(mockOnChange).toHaveBeenCalledWith('minor_children', expect.any(Array));
  });

  it('displays errors', () => {
    const errorsWithChildren = {
      'minor_children.0.name': 'Name is required',
    };

    const dataWithChildren = {
      minor_children: [{ name: '', dob: '', sex: 'M' as const }],
    };

    render(
      <MinorChildrenSection
        formData={dataWithChildren}
        onChange={mockOnChange}
        errors={errorsWithChildren}
      />
    );

    expect(screen.getByText('Name is required')).toBeInTheDocument();
  });
});
