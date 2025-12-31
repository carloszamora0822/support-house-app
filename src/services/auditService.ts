import { supabase } from '@/lib/supabase';

/**
 * Enhanced Audit Service with Edge Function for IP Tracking
 * HIPAA Compliance: Server-side audit logging with real IP addresses
 */

export type AuditEventType =
  | 'LOGIN'
  | 'LOGOUT'
  | 'LOGIN_FAILED'
  | 'SESSION_TIMEOUT'
  | 'PATIENT_VIEWED'
  | 'PATIENT_CREATED'
  | 'PATIENT_UPDATED'
  | 'PATIENT_DELETED'
  | 'PATIENT_SEARCHED'
  | 'VISIT_CREATED'
  | 'VISIT_UPDATED'
  | 'FORM_SUBMITTED'
  | 'DATA_EXPORTED'
  | 'UNAUTHORIZED_ACCESS'
  | '2FA_ENABLED'
  | '2FA_DISABLED'
  | '2FA_VERIFIED';

interface AuditLogOptions {
  userId?: string;
  userEmail?: string;
  userName?: string;
  resourceType?: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  success?: boolean;
}

export const auditService = {
  /**
   * Log an audit event using Edge Function for IP tracking
   * Falls back to direct database insert if Edge Function unavailable
   */
  async log(
    eventType: AuditEventType,
    action: string,
    options: AuditLogOptions = {}
  ): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.warn('No active session for audit logging');
        return;
      }

      const payload = {
        event_type: eventType,
        action,
        success: options.success ?? true,
        user_id: options.userId,
        user_email: options.userEmail,
        user_name: options.userName,
        resource_type: options.resourceType,
        resource_id: options.resourceId,
        details: options.details,
        user_agent: navigator.userAgent,
      };

      // Try to use Edge Function for IP tracking
      const { data, error } = await supabase.functions.invoke('audit-log', {
        body: payload,
      });

      if (error) {
        console.warn('Edge Function unavailable, falling back to direct insert:', error);
        // Fallback to direct database insert (without IP address)
        await this.logDirect(eventType, action, options);
        return;
      }

      if (import.meta.env.DEV) {
        console.log('[AUDIT]', eventType, action, data);
      }
    } catch (error) {
      console.error('Failed to log audit event:', error);
      // Try fallback
      try {
        await this.logDirect(eventType, action, options);
      } catch (fallbackError) {
        console.error('Fallback audit logging also failed:', fallbackError);
      }
    }
  },

  /**
   * Direct database insert (fallback when Edge Function unavailable)
   * Note: IP address will be null without Edge Function
   */
  async logDirect(
    eventType: AuditEventType,
    action: string,
    options: AuditLogOptions = {}
  ): Promise<void> {
    const { error } = await supabase.from('audit_logs').insert({
      event_type: eventType,
      action,
      success: options.success ?? true,
      user_id: options.userId || null,
      user_email: options.userEmail || null,
      user_name: options.userName || null,
      resource_type: options.resourceType || null,
      resource_id: options.resourceId || null,
      ip_address: null, // Cannot get real IP client-side
      user_agent: navigator.userAgent,
      details: options.details || null,
    });

    if (error) {
      throw error;
    }
  },

  /**
   * Log patient access (HIPAA requirement)
   */
  async logPatientAccess(
    action: 'VIEW' | 'CREATE' | 'UPDATE' | 'DELETE',
    patientId: string,
    userId: string,
    userEmail: string
  ): Promise<void> {
    const eventTypeMap = {
      VIEW: 'PATIENT_VIEWED' as const,
      CREATE: 'PATIENT_CREATED' as const,
      UPDATE: 'PATIENT_UPDATED' as const,
      DELETE: 'PATIENT_DELETED' as const,
    };

    await this.log(eventTypeMap[action], `Patient ${action.toLowerCase()}`, {
      userId,
      userEmail,
      resourceType: 'patient',
      resourceId: patientId,
      success: true,
    });
  },

  /**
   * Log authentication events
   */
  async logAuth(
    eventType: 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED' | 'SESSION_TIMEOUT' | '2FA_ENABLED' | '2FA_DISABLED' | '2FA_VERIFIED',
    email: string,
    success: boolean,
    details?: Record<string, unknown>
  ): Promise<void> {
    await this.log(eventType, eventType.toLowerCase().replace('_', ' '), {
      userEmail: email,
      success,
      details,
    });
  },

  /**
   * Log search operations
   */
  async logSearch(
    searchTerm: string,
    resultCount: number,
    userId: string,
    userEmail: string
  ): Promise<void> {
    await this.log('PATIENT_SEARCHED', 'Patient search performed', {
      userId,
      userEmail,
      details: {
        searchTerm: searchTerm.substring(0, 50),
        resultCount,
      },
      success: true,
    });
  },

  /**
   * Log form submission
   */
  async logFormSubmission(
    formType: string,
    patientId: string,
    userId: string,
    userEmail: string
  ): Promise<void> {
    await this.log('FORM_SUBMITTED', `${formType} form submitted`, {
      userId,
      userEmail,
      resourceType: 'form',
      resourceId: patientId,
      details: { formType },
      success: true,
    });
  },

  /**
   * Log data export
   */
  async logDataExport(
    exportType: string,
    recordCount: number,
    userId: string,
    userEmail: string
  ): Promise<void> {
    await this.log('DATA_EXPORTED', `Data export: ${exportType}`, {
      userId,
      userEmail,
      details: {
        exportType,
        recordCount,
      },
      success: true,
    });
  },

  /**
   * Log unauthorized access attempt
   */
  async logUnauthorizedAccess(
    attemptedResource: string,
    userId?: string,
    userEmail?: string
  ): Promise<void> {
    await this.log('UNAUTHORIZED_ACCESS', 'Unauthorized access attempt', {
      userId,
      userEmail,
      resourceType: attemptedResource,
      success: false,
    });
  },
};
