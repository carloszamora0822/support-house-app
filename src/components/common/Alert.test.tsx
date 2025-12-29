import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Alert } from './Alert';

describe('Alert', () => {
  it('renders children correctly', () => {
    render(<Alert>Alert message</Alert>);
    expect(screen.getByText('Alert message')).toBeInTheDocument();
  });

  it('applies variant styles correctly', () => {
    const { rerender } = render(<Alert variant="info">Info</Alert>);
    expect(screen.getByText('Info').parentElement).toHaveClass('bg-blue-50');
    
    rerender(<Alert variant="success">Success</Alert>);
    expect(screen.getByText('Success').parentElement).toHaveClass('bg-green-50');
    
    rerender(<Alert variant="warning">Warning</Alert>);
    expect(screen.getByText('Warning').parentElement).toHaveClass('bg-yellow-50');
    
    rerender(<Alert variant="error">Error</Alert>);
    expect(screen.getByText('Error').parentElement).toHaveClass('bg-red-50');
  });

  it('applies custom className', () => {
    render(<Alert className="custom-class">Content</Alert>);
    const alert = screen.getByText('Content').parentElement;
    expect(alert).toHaveClass('custom-class');
  });
});
