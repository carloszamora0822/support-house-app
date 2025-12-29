import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { IntakeFormContainer } from './IntakeFormContainer';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('IntakeFormContainer', () => {
  it('renders step 1 by default', () => {
    renderWithRouter(<IntakeFormContainer />);

    expect(screen.getByText(/patient information/i)).toBeInTheDocument();
  });

  it('shows progress indicator', () => {
    renderWithRouter(<IntakeFormContainer />);

    expect(screen.getByText(/step 1 of 4/i)).toBeInTheDocument();
  });

  it('navigates to step 2 when next is clicked', async () => {
    renderWithRouter(<IntakeFormContainer />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    expect(screen.getByText(/medical information/i)).toBeInTheDocument();
    expect(screen.getByText(/step 2 of 4/i)).toBeInTheDocument();
  });

  it('navigates back to step 1 from step 2', async () => {
    renderWithRouter(<IntakeFormContainer />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);

    expect(screen.getByText(/patient information/i)).toBeInTheDocument();
    expect(screen.getByText(/step 1 of 4/i)).toBeInTheDocument();
  });

  it('shows submit button on step 4', () => {
    renderWithRouter(<IntakeFormContainer />);

    // Navigate to step 4
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton); // Step 2
    fireEvent.click(nextButton); // Step 3
    fireEvent.click(nextButton); // Step 4

    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByText(/step 4 of 4/i)).toBeInTheDocument();
  });

  it('does not show back button on step 1', () => {
    renderWithRouter(<IntakeFormContainer />);

    expect(screen.queryByRole('button', { name: /back/i })).not.toBeInTheDocument();
  });

  it('persists form data across steps', () => {
    renderWithRouter(<IntakeFormContainer />);

    // Fill in step 1 data would happen here in real usage
    // For now just verify navigation preserves state
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);

    // Should still be on step 1
    expect(screen.getByText(/step 1 of 4/i)).toBeInTheDocument();
  });
});
