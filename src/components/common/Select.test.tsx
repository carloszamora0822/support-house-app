import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

describe('Select', () => {
  const options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ];

  it('renders select with options', () => {
    render(<Select options={options} />);
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('handles value changes', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    
    render(<Select options={options} onChange={handleChange} />);
    const select = screen.getByRole('combobox');
    
    await user.selectOptions(select, '2');
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders placeholder option when provided', () => {
    render(<Select options={options} placeholder="Select an option" />);
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('applies error styles when error prop is true', () => {
    render(<Select options={options} error />);
    expect(screen.getByRole('combobox')).toHaveClass('border-red-500');
  });

  it('is disabled when disabled=true', () => {
    render(<Select options={options} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<Select options={options} className="custom-class" />);
    expect(screen.getByRole('combobox')).toHaveClass('custom-class');
  });
});
