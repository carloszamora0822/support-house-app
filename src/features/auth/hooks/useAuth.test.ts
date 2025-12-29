import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from './useAuth';
import { authService } from '../services/authService';

vi.mock('../services/authService', () => ({
  authService: {
    login: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
    getSession: vi.fn(),
  },
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null user when not authenticated', async () => {
    vi.mocked(authService.getCurrentUser).mockResolvedValue(null);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
  });

  it('returns user when authenticated', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      role: 'staff' as const,
      full_name: 'Test User',
      created_at: '2024-01-01',
      last_login: null,
      is_active: true,
    };

    vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });
  });

  it('login function updates user state', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      role: 'staff' as const,
      full_name: 'Test User',
      created_at: '2024-01-01',
      last_login: null,
      is_active: true,
    };

    vi.mocked(authService.getCurrentUser).mockResolvedValue(null);
    vi.mocked(authService.login).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await result.current.login({
      email: 'test@example.com',
      password: 'password123',
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });
  });

  it('logout function clears user state', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      role: 'staff' as const,
      full_name: 'Test User',
      created_at: '2024-01-01',
      last_login: null,
      is_active: true,
    };

    vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUser);
    vi.mocked(authService.logout).mockResolvedValue();

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });

    await result.current.logout();

    await waitFor(() => {
      expect(result.current.user).toBeNull();
    });
  });

  it('isLoading is true during login', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      role: 'staff' as const,
      full_name: 'Test User',
      created_at: '2024-01-01',
      last_login: null,
      is_active: true,
    };

    vi.mocked(authService.getCurrentUser).mockResolvedValue(null);
    vi.mocked(authService.login).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockUser), 100))
    );

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    result.current.login({
      email: 'test@example.com',
      password: 'password123',
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('error is set on login failure', async () => {
    vi.mocked(authService.getCurrentUser).mockResolvedValue(null);
    vi.mocked(authService.login).mockRejectedValue(new Error('Invalid credentials'));

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await expect(
      result.current.login({
        email: 'wrong@example.com',
        password: 'wrongpass',
      })
    ).rejects.toThrow('Invalid credentials');

    await waitFor(() => {
      expect(result.current.error).toBe('Invalid credentials');
    });
  });
});
