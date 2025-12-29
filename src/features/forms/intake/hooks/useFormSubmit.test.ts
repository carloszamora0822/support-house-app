import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useFormSubmit } from './useFormSubmit';
import { intakeService } from '@/features/forms/services/intakeService';

vi.mock('@/features/forms/services/intakeService', () => ({
  intakeService: {
    submitIntakeForm: vi.fn(),
  },
}));

describe('useFormSubmit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockFormData = {
    patientData: {
      name_first: 'John',
      name_last: 'Doe',
      dob: '1980-01-01',
    },
    medicalData: {
      diagnosis_primary: 'Breast Cancer',
      diagnosis_date: '2024-01-15',
    },
    disclosureData: {
      fax_form_date: '2024-01-15',
      fax_to_office: 'Mercy Oncology',
    },
  };

  it('initializes with not submitting state', () => {
    const { result } = renderHook(() => useFormSubmit());

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.success).toBe(false);
  });

  it('sets isSubmitting true during submission', async () => {
    vi.mocked(intakeService.submitIntakeForm).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ success: true, data: { id: '123' } }), 100))
    );

    const { result } = renderHook(() => useFormSubmit());

    act(() => {
      result.current.submitForm(mockFormData);
    });

    expect(result.current.isSubmitting).toBe(true);

    await waitFor(() => {
      expect(result.current.isSubmitting).toBe(false);
    });
  });

  it('sets success true after successful submission', async () => {
    vi.mocked(intakeService.submitIntakeForm).mockResolvedValue({
      success: true,
      data: { id: '123' },
    });

    const { result } = renderHook(() => useFormSubmit());

    await act(async () => {
      await result.current.submitForm(mockFormData);
    });

    expect(result.current.success).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('sets error on submission failure', async () => {
    vi.mocked(intakeService.submitIntakeForm).mockResolvedValue({
      success: false,
      error: 'Database error',
    });

    const { result } = renderHook(() => useFormSubmit());

    await act(async () => {
      await result.current.submitForm(mockFormData);
    });

    expect(result.current.success).toBe(false);
    expect(result.current.error).toBe('Database error');
  });

  it('calls intakeService with correct data', async () => {
    vi.mocked(intakeService.submitIntakeForm).mockResolvedValue({
      success: true,
      data: { id: '123' },
    });

    const { result } = renderHook(() => useFormSubmit());

    await act(async () => {
      await result.current.submitForm(mockFormData);
    });

    expect(intakeService.submitIntakeForm).toHaveBeenCalledWith(mockFormData);
  });

  it('calls onSuccess callback with patient ID', async () => {
    const onSuccess = vi.fn();
    vi.mocked(intakeService.submitIntakeForm).mockResolvedValue({
      success: true,
      data: { id: '123' },
    });

    const { result } = renderHook(() => useFormSubmit());

    await act(async () => {
      await result.current.submitForm(mockFormData, onSuccess);
    });

    expect(onSuccess).toHaveBeenCalledWith('123');
  });

  it('resets state when reset is called', async () => {
    vi.mocked(intakeService.submitIntakeForm).mockResolvedValue({
      success: true,
      data: { id: '123' },
    });

    const { result } = renderHook(() => useFormSubmit());

    await act(async () => {
      await result.current.submitForm(mockFormData);
    });

    expect(result.current.success).toBe(true);

    act(() => {
      result.current.reset();
    });

    expect(result.current.success).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isSubmitting).toBe(false);
  });
});
