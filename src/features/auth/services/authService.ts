import { supabase } from '@/lib/supabase';
import type { User } from '@/types';
import type { LoginCredentials } from '../types';
import { rateLimiter } from '@/utils/rateLimiter';
import { auditLogger } from '@/utils/auditLogger';
import { sessionManager } from '@/utils/sessionManager';

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    // Check if account is locked out
    if (rateLimiter.isLockedOut(credentials.email)) {
      const timeRemaining = rateLimiter.getLockoutTimeRemaining(credentials.email);
      const minutes = Math.ceil(timeRemaining / 60);
      
      // Log failed attempt due to lockout
      await auditLogger.logAuth('LOGIN_FAILED', credentials.email, false, {
        reason: 'account_locked',
        timeRemaining: timeRemaining,
      });
      
      throw new Error(
        `Account temporarily locked due to multiple failed login attempts. Please try again in ${minutes} minute${minutes !== 1 ? 's' : ''}.`
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error || !data.user) {
      // Record failed login attempt
      rateLimiter.recordAttempt(credentials.email, false);
      
      // Log failed login
      await auditLogger.logAuth('LOGIN_FAILED', credentials.email, false, {
        reason: error?.message || 'invalid_credentials',
      });
      
      const failedCount = rateLimiter.getFailedAttemptCount(credentials.email);
      const remainingAttempts = 5 - failedCount;
      
      if (remainingAttempts > 0 && remainingAttempts <= 2) {
        throw new Error(
          `Invalid credentials. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining before account lockout.`
        );
      }
      
      throw new Error(error?.message || 'Login failed');
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    if (userError) {
      throw new Error(userError?.message || 'Failed to fetch user data');
    }

    if (!userData) {
      console.error('User record not found for authenticated user:', data.user.id);
      throw new Error('Unable to load user profile. Please contact an administrator.');
    }

    // Record successful login
    rateLimiter.recordAttempt(credentials.email, true);
    
    // Log successful login
    await auditLogger.logAuth('LOGIN', credentials.email, true, {
      userId: userData.id,
      userName: userData.full_name,
    });
    
    // Initialize session management
    sessionManager.reset();

    return userData as User;
  },

  async logout(): Promise<void> {
    // Get current user for audit log
    const currentUser = await this.getCurrentUser();
    
    // Clear all encrypted drafts on logout for security
    const { formService } = await import('@/features/forms/services/formService');
    formService.clearAllDrafts();
    
    // End session
    sessionManager.end();
    
    // Log logout
    if (currentUser) {
      await auditLogger.logAuth('LOGOUT', currentUser.email, true, {
        userId: currentUser.id,
        userName: currentUser.full_name,
      });
    }
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
      throw new Error('Unable to log out. Please try again.');
    }
  },

  async getCurrentUser(): Promise<User | null> {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return null;
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    if (userError || !userData) {
      return null;
    }

    return userData as User;
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      return null;
    }
    return data.session;
  },
};
