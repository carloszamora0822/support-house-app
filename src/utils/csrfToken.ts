import { supabase } from '@/lib/supabase';

/**
 * CSRF Token Management for HIPAA Compliance
 * Protects against Cross-Site Request Forgery attacks
 */

const CSRF_TOKEN_KEY = 'csrf_token';
const CSRF_TOKEN_EXPIRY = 1; // 1 hour

export const csrfToken = {
  /**
   * Generate a new CSRF token for the current user
   */
  async generate(): Promise<string | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('No authenticated user for CSRF token generation');
        return null;
      }

      const { data, error } = await supabase.rpc('generate_csrf_token', {
        p_user_id: user.id,
        p_expires_in_hours: CSRF_TOKEN_EXPIRY,
      });

      if (error) {
        console.error('Failed to generate CSRF token:', error);
        return null;
      }

      // Store token in sessionStorage (not localStorage for security)
      sessionStorage.setItem(CSRF_TOKEN_KEY, data as string);
      
      return data as string;
    } catch (error) {
      console.error('CSRF token generation exception:', error);
      return null;
    }
  },

  /**
   * Get the current CSRF token from session storage
   */
  get(): string | null {
    return sessionStorage.getItem(CSRF_TOKEN_KEY);
  },

  /**
   * Validate a CSRF token
   */
  async validate(token: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return false;
      }

      const { data, error } = await supabase.rpc('validate_csrf_token', {
        p_user_id: user.id,
        p_token: token,
      });

      if (error) {
        console.error('Failed to validate CSRF token:', error);
        return false;
      }

      return data as boolean;
    } catch (error) {
      console.error('CSRF token validation exception:', error);
      return false;
    }
  },

  /**
   * Clear the CSRF token from session storage
   */
  clear(): void {
    sessionStorage.removeItem(CSRF_TOKEN_KEY);
  },

  /**
   * Ensure a valid CSRF token exists, generate if needed
   */
  async ensure(): Promise<string | null> {
    let token = this.get();
    
    if (!token) {
      token = await this.generate();
    }
    
    return token;
  },

  /**
   * Get CSRF token as header object for API requests
   */
  async getHeader(): Promise<{ 'X-CSRF-Token': string } | Record<string, never>> {
    const token = await this.ensure();
    
    if (!token) {
      return {};
    }
    
    return { 'X-CSRF-Token': token };
  },
};
