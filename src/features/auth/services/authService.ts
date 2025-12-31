import { supabase } from '@/lib/supabase';
import type { User } from '@/types';
import type { LoginCredentials } from '../types';
import { auditLogger } from '@/utils/auditLogger';
import { sessionManager } from '@/utils/sessionManager';

// SECURITY: Server-side rate limiting to prevent bypass via localStorage clearing

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    // SECURITY FIX: Check server-side rate limiting (cannot be bypassed)
    const { data: isLocked, error: lockCheckError } = await supabase
      .rpc('is_account_locked_out', { user_email: credentials.email });
    
    if (lockCheckError) {
      console.error('Rate limit check failed:', lockCheckError);
      // Continue with login attempt even if check fails (fail open for availability)
    }
    
    if (isLocked) {
      // Log failed attempt due to lockout
      await auditLogger.logAuth('LOGIN_FAILED', credentials.email, false, {
        reason: 'account_locked',
      });
      
      throw new Error(
        'Account temporarily locked due to multiple failed login attempts. Please try again in 15 minutes.'
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error || !data.user) {
      // SECURITY FIX: Record failed attempt in database (server-side)
      await supabase.rpc('record_login_attempt', {
        user_email: credentials.email,
        attempt_success: false,
        client_ip: null, // Could be added via edge function
        client_user_agent: navigator.userAgent,
      });
      
      // Log failed login
      await auditLogger.logAuth('LOGIN_FAILED', credentials.email, false, {
        reason: error?.message || 'invalid_credentials',
      });
      
      throw new Error(error?.message || 'Invalid credentials');
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

    // SECURITY: Check account status
    if (userData.account_status !== 'active') {
      await supabase.auth.signOut();
      
      if (userData.account_status === 'suspended') {
        throw new Error('Your account has been suspended. Please contact an administrator.');
      }
      if (userData.account_status === 'deactivated') {
        throw new Error('Your account has been deactivated. Please contact an administrator.');
      }
      throw new Error('Your account is not active. Please contact an administrator.');
    }

    // SECURITY FIX: Record successful login in database and clear failed attempts
    await supabase.rpc('record_login_attempt', {
      user_email: credentials.email,
      attempt_success: true,
      client_ip: null,
      client_user_agent: navigator.userAgent,
    });
    
    await supabase.rpc('clear_failed_attempts', {
      user_email: credentials.email,
    });
    
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
