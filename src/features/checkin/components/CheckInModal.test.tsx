import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CheckInModal } from './CheckInModal';
import { useCheckIn } from '../hooks/useCheckIn';

vi.mock('../hooks/useCheckIn');
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('CheckInModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();
  const mockCheckIn = vi.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    patientId: 'patient-123',
    patientName: 'John Doe',
    lastVisitDate: '2024-01-15',
    onSuccess: mockOnSuccess,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCheckIn).mockReturnValue({
      checkIn: mockCheckIn,
      isLoading: false,
      error: null,
    });
  });

  it('renders nothing when closed', () => {
    const { container } = render(<CheckInModal {...defaultProps} isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders with patient name', () => {
    render(<CheckInModal {...defaultProps} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders assistance checkboxes', () => {
    render(<CheckInModal {...defaultProps} />);
    expect(screen.getByLabelText('Food')).toBeInTheDocument();
  });

  it('renders notes textarea', () => {
    render(<CheckInModal {...defaultProps} />);
    expect(screen.getByPlaceholderText(/Add any notes/i)).toBeInTheDocument();
  });

  it('disables confirm when no assistance', () => {
    render(<CheckInModal {...defaultProps} />);
    const btn = screen.getByRole('button', { name: /Confirm Check-In/i });
    expect(btn).toBeDisabled();
  });

  it('enables confirm when assistance selected', async () => {
    const user = userEvent.setup();
    render(<CheckInModal {...defaultProps} />);

    await user.click(screen.getByLabelText('Food'));

    const btn = screen.getByRole('button', { name: /Confirm Check-In/i });
    expect(btn).toBeEnabled();
  });

  it('calls checkIn with data', async () => {
    const user = userEvent.setup();
    mockCheckIn.mockResolvedValue({ id: 'visit-123' });

    render(<CheckInModal {...defaultProps} />);

    await user.click(screen.getByLabelText('Food'));
    await user.type(screen.getByPlaceholderText(/Add any notes/i), 'Test notes');
    await user.click(screen.getByRole('button', { name: /Confirm Check-In/i }));

    await waitFor(() => {
      expect(mockCheckIn).toHaveBeenCalledWith({
        patient_id: 'patient-123',
        assistance_requested: ['food'],
        visit_notes: 'Test notes',
      });
    });
  });

  it('shows loading state', () => {
    vi.mocked(useCheckIn).mockReturnValue({
      checkIn: mockCheckIn,
      isLoading: true,
      error: null,
    });

    render(<CheckInModal {...defaultProps} />);
    expect(screen.getByText(/Checking in.../i)).toBeInTheDocument();
  });

  it('displays errors', () => {
    vi.mocked(useCheckIn).mockReturnValue({
      checkIn: mockCheckIn,
      isLoading: false,
      error: 'Already checked in',
    });

    render(<CheckInModal {...defaultProps} />);
    expect(screen.getByText(/Already checked in/i)).toBeInTheDocument();
  });

  it('handles multiple assistance types', async () => {
    const user = userEvent.setup();
    mockCheckIn.mockResolvedValue({ id: 'visit-123' });

    render(<CheckInModal {...defaultProps} />);

    await user.click(screen.getByLabelText('Food'));
    await user.click(screen.getByLabelText('Wigs/Salon'));
    await user.click(screen.getByRole('button', { name: /Confirm Check-In/i }));

    await waitFor(() => {
      expect(mockCheckIn).toHaveBeenCalledWith(
        expect.objectContaining({
          assistance_requested: expect.arrayContaining(['food', 'wigs_salon']),
        })
      );
    });
  });

  it('passes undefined for empty notes', async () => {
    const user = userEvent.setup();
    mockCheckIn.mockResolvedValue({ id: 'visit-123' });

    render(<CheckInModal {...defaultProps} />);

    await user.click(screen.getByLabelText('Food'));
    await user.click(screen.getByRole('button', { name: /Confirm Check-In/i }));

    await waitFor(() => {
      expect(mockCheckIn).toHaveBeenCalledWith({
        patient_id: 'patient-123',
        assistance_requested: ['food'],
        visit_notes: undefined,
      });
    });
  });

  it('calls onClose when Cancel clicked', async () => {
    const user = userEvent.setup();
    render(<CheckInModal {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
