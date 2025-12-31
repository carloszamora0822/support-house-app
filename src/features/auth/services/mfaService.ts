import { supabase } from '@/lib/supabase';
import { auditService } from '@/services/auditService';

export interface MFAEnrollmentResponse {
  success: boolean;
  qrCode?: string;
  secret?: string;
  error?: string;
}

export interface MFAVerificationResponse {
  success: boolean;
  error?: string;
}

export const mfaService = {
  /**
   * Enroll user in MFA using TOTP (Time-based One-Time Password)
   * Returns QR code for scanning with authenticator app
   */
  async enrollMFA(): Promise<MFAEnrollmentResponse> {
    try {
      // Verify user is authenticated first
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('User not authenticated:', userError);
        return { 
          success: false, 
          error: 'You must be logged in to enable MFA. Please refresh and try again.' 
        };
      }

      console.log('Enrolling MFA for user:', user.id);

      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
      });

      if (error) {
        console.error('MFA enrollment error:', error);
        return { success: false, error: error.message };
      }

      if (!data) {
        return { success: false, error: 'No enrollment data returned' };
      }

      // Log MFA enrollment
      await auditService.logAuth('MFA_ENROLLED', 'User enrolled in MFA');

      return {
        success: true,
        qrCode: data.totp.qr_code,
        secret: data.totp.secret,
      };
    } catch (error) {
      console.error('MFA enrollment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to enroll in MFA',
      };
    }
  },

  /**
   * Verify MFA code during enrollment
   * Must be called after enrollMFA to complete setup
   */
  async verifyMFA(factorId: string, code: string): Promise<MFAVerificationResponse> {
    try {
      // Verify user is authenticated
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        return { 
          success: false, 
          error: 'You must be logged in to verify MFA. Please refresh and try again.' 
        };
      }

      const { data, error } = await supabase.auth.mfa.challenge({
        factorId,
      });

      if (error || !data) {
        return { success: false, error: 'Failed to create MFA challenge' };
      }

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: data.id,
        code,
      });

      if (verifyError) {
        console.error('MFA verification error:', verifyError);
        return { success: false, error: verifyError.message };
      }

      // Log successful MFA verification
      await auditService.logAuth('MFA_VERIFIED', 'User verified MFA code');

      return { success: true };
    } catch (error) {
      console.error('MFA verification error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to verify MFA',
      };
    }
  },

  /**
   * Verify MFA code during login
   */
  async verifyMFALogin(code: string): Promise<MFAVerificationResponse> {
    try {
      const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();

      if (factorsError || !factors || factors.totp.length === 0) {
        return {
          success: false,
          error: 'No MFA factors found',
        };
      }

      const factorId = factors.totp[0].id;

      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId,
      });

      if (challengeError || !challenge) {
        return {
          success: false,
          error: 'Failed to create MFA challenge',
        };
      }

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code,
      });

      if (verifyError) {
        const user = await supabase.auth.getUser();
        if (user.data.user) {
          await auditService.logAuth('LOGIN_FAILED', user.data.user.email || '', false, {
            reason: 'invalid_mfa_code',
          });
        }

        return {
          success: false,
          error: 'Invalid verification code',
        };
      }

      const user = await supabase.auth.getUser();
      if (user.data.user) {
        await auditService.logAuth('2FA_VERIFIED', user.data.user.email || '', true, {
          userId: user.data.user.id,
        });
      }

      return { success: true };
    } catch (error) {
      console.error('MFA login verification exception:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during verification',
      };
    }
  },

  /**
   * Unenroll from MFA (disable 2FA)
   */
  async unenrollMFA(factorId: string): Promise<MFAVerificationResponse> {
    try {
      const { error } = await supabase.auth.mfa.unenroll({
        factorId,
      });

      if (error) {
        return {
          success: false,
          error: error.message || 'Failed to disable MFA',
        };
      }

      const user = await supabase.auth.getUser();
      if (user.data.user) {
        await auditService.logAuth('2FA_DISABLED', user.data.user.email || '', true, {
          userId: user.data.user.id,
        });
      }

      return { success: true };
    } catch (error) {
      console.error('MFA unenroll exception:', error);
      return {
        success: false,
        error: 'An unexpected error occurred while disabling MFA',
      };
    }
  },

  /**
   * Check if user has MFA enabled
   */
  async isMFAEnabled(): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();

      if (error || !data) {
        return false;
      }

      return data.totp.length > 0;
    } catch (error) {
      console.error('MFA status check exception:', error);
      return false;
    }
  },

  /**
   * Get MFA factors for current user
   */
  async getMFAFactors() {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();

      if (error) {
        console.error('Failed to get MFA factors:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('MFA factors exception:', error);
      return null;
    }
  },
};
