import { supabase } from '@/lib/supabase';

/**
 * Email service using Supabase Auth's built-in email system
 * Handles user registration with automatic email verification
 */
export const emailService = {
  /**
   * Register new user with Supabase Auth (sends verification email automatically)
   */
  async registerUserWithEmail(
    email: string,
    password: string,
    metadata: {
      full_name: string;
      role: string;
      phone?: string;
      volunteer_start_date?: string;
      notes?: string;
    }
  ) {
    try {
      // Create auth user - Supabase automatically sends verification email
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`,
          data: {
            full_name: metadata.full_name,
            role: metadata.role,
            phone: metadata.phone,
            volunteer_start_date: metadata.volunteer_start_date,
            notes: metadata.notes,
          },
        },
      });

      if (error) throw error;

      return {
        success: true,
        user: data.user,
        message: 'Verification email sent! Please check your inbox.',
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Resend verification email
   */
  async resendVerificationEmail(email: string) {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) throw error;

      return {
        success: true,
        message: 'Verification email resent!',
      };
    } catch (error) {
      console.error('Resend verification error:', error);
      throw error;
    }
  },
};
