import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders checkbox correctly', () => {
    render(<Checkbox aria-label="Accept terms" />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('handles checked state changes', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    
    render(<Checkbox onChange={handleChange} aria-label="Accept" />);
    const checkbox = screen.getByRole('checkbox');
    
    await user.click(checkbox);
    expect(handleChange).toHaveBeenCalled();
  });

  it('is disabled when disabled=true', () => {
    render(<Checkbox disabled aria-label="Disabled" />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<Checkbox className="custom-class" aria-label="Custom" />);
    expect(screen.getByRole('checkbox')).toHaveClass('custom-class');
  });

  it('can be checked by default', () => {
    render(<Checkbox defaultChecked aria-label="Checked" />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });
});
