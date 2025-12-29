import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCheckIn } from './useCheckIn';
import { visitService } from '../services/visitService';

vi.mock('../services/visitService', () => ({
  visitService: {
    checkInPatient: vi.fn(),
  },
}));

describe('useCheckIn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns checkIn function', () => {
    const { result } = renderHook(() => useCheckIn());
    expect(typeof result.current.checkIn).toBe('function');
  });

  it('returns isLoading state', () => {
    const { result } = renderHook(() => useCheckIn());
    expect(result.current.isLoading).toBe(false);
  });

  it('returns error state', () => {
    const { result } = renderHook(() => useCheckIn());
    expect(result.current.error).toBeNull();
  });

  it('sets isLoading true during check-in', async () => {
    const mockVisit = { id: 'visit-123', patient_id: 'patient-123' };
    vi.mocked(visitService.checkInPatient).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockVisit as any), 100))
    );

    const { result } = renderHook(() => useCheckIn());

    act(() => {
      result.current.checkIn({
        patient_id: 'patient-123',
        assistance_requested: ['Food Pantry'],
      });
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('sets isLoading false after success', async () => {
    const mockVisit = { id: 'visit-123', patient_id: 'patient-123' };
    vi.mocked(visitService.checkInPatient).mockResolvedValue(mockVisit as any);

    const { result } = renderHook(() => useCheckIn());

    await act(async () => {
      await result.current.checkIn({
        patient_id: 'patient-123',
        assistance_requested: ['Food Pantry'],
      });
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('sets isLoading false after error', async () => {
    vi.mocked(visitService.checkInPatient).mockRejectedValue(
      new Error('Check-in failed')
    );

    const { result } = renderHook(() => useCheckIn());

    await act(async () => {
      try {
        await result.current.checkIn({
          patient_id: 'patient-123',
          assistance_requested: ['Food Pantry'],
        });
      } catch (error) {
        // Expected error
      }
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('calls visitService.checkInPatient with correct data', async () => {
    const mockVisit = { id: 'visit-123', patient_id: 'patient-123' };
    vi.mocked(visitService.checkInPatient).mockResolvedValue(mockVisit as any);

    const { result } = renderHook(() => useCheckIn());

    const checkInData = {
      patient_id: 'patient-123',
      assistance_requested: ['Food Pantry', 'Transportation'],
      visit_notes: 'Patient needs extra help',
    };

    await act(async () => {
      await result.current.checkIn(checkInData);
    });

    expect(visitService.checkInPatient).toHaveBeenCalledWith(checkInData);
  });

  it('sets error on check-in failure', async () => {
    const errorMessage = 'Patient already checked in today';
    vi.mocked(visitService.checkInPatient).mockRejectedValue(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => useCheckIn());

    await act(async () => {
      try {
        await result.current.checkIn({
          patient_id: 'patient-123',
          assistance_requested: ['Food Pantry'],
        });
      } catch (error) {
        // Expected error
      }
    });

    expect(result.current.error).toBe(errorMessage);
  });

  it('clears error on successful check-in', async () => {
    const mockVisit = { id: 'visit-123', patient_id: 'patient-123' };
    
    // First call fails
    vi.mocked(visitService.checkInPatient).mockRejectedValueOnce(
      new Error('Network error')
    );

    const { result } = renderHook(() => useCheckIn());

    // First attempt - should set error
    await act(async () => {
      try {
        await result.current.checkIn({
          patient_id: 'patient-123',
          assistance_requested: ['Food Pantry'],
        });
      } catch (error) {
        // Expected error
      }
    });

    expect(result.current.error).toBe('Network error');

    // Second call succeeds
    vi.mocked(visitService.checkInPatient).mockResolvedValue(mockVisit as any);

    // Second attempt - should clear error
    await act(async () => {
      await result.current.checkIn({
        patient_id: 'patient-123',
        assistance_requested: ['Food Pantry'],
      });
    });

    expect(result.current.error).toBeNull();
  });

  it('calls onSuccess callback after successful check-in', async () => {
    const mockVisit = { id: 'visit-123', patient_id: 'patient-123' };
    vi.mocked(visitService.checkInPatient).mockResolvedValue(mockVisit as any);

    const onSuccess = vi.fn();
    const { result } = renderHook(() => useCheckIn({ onSuccess }));

    await act(async () => {
      await result.current.checkIn({
        patient_id: 'patient-123',
        assistance_requested: ['Food Pantry'],
      });
    });

    expect(onSuccess).toHaveBeenCalledWith(mockVisit);
  });
});
