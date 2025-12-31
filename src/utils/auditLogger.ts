// Audit logging for HIPAA compliance
// Tracks all access to PHI (Protected Health Information)
// Now with server-side storage in Supabase!

import { supabase } from '@/lib/supabase';

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

export interface AuditEvent {
  id: string;
  timestamp: string;
  eventType: AuditEventType;
  userId?: string;
  userEmail?: string;
  userName?: string;
  resourceType?: string;
  resourceId?: string;
  action: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
}

const STORAGE_KEY = 'audit_log';
const MAX_LOCAL_LOGS = 1000; // Keep last 1000 events locally

/**
 * Get audit logs from localStorage
 */
function getLocalLogs(): AuditEvent[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * Save audit logs to localStorage
 */
function saveLocalLogs(logs: AuditEvent[]): void {
  try {
    // Keep only the most recent MAX_LOCAL_LOGS events
    const trimmed = logs.slice(-MAX_LOCAL_LOGS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Failed to save audit logs:', error);
  }
}

/**
 * Generate unique ID for audit event
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get client IP address (best effort)
 */
async function getClientIP(): Promise<string | undefined> {
  // In production, this would come from server-side
  // For now, return undefined (null in database) since we can't get real IP client-side
  return undefined;
}

/**
 * Get user agent
 */
function getUserAgent(): string {
  return navigator.userAgent;
}

export const auditLogger = {
  /**
   * Log an audit event
   */
  async log(
    eventType: AuditEventType,
    action: string,
    options: {
      userId?: string;
      userEmail?: string;
      userName?: string;
      resourceType?: string;
      resourceId?: string;
      details?: Record<string, unknown>;
      success?: boolean;
    } = {}
  ): Promise<void> {
    const event: AuditEvent = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      eventType,
      action,
      userId: options.userId,
      userEmail: options.userEmail,
      userName: options.userName,
      resourceType: options.resourceType,
      resourceId: options.resourceId,
      details: options.details,
      ipAddress: await getClientIP(),
      userAgent: getUserAgent(),
      success: options.success ?? true,
    };

    // Save to localStorage (backup)
    const logs = getLocalLogs();
    logs.push(event);
    saveLocalLogs(logs);

    // Send to Supabase for server-side storage
    try {
      await this.sendToServer(event);
    } catch (error) {
      console.error('Failed to send audit log to server:', error);
      // Log still saved locally as backup
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log('[AUDIT]', eventType, action, event);
    }
  },

  /**
   * Send audit log to Supabase (server-side storage)
   */
  async sendToServer(event: AuditEvent): Promise<void> {
    const { error } = await supabase.from('audit_logs').insert({
      event_type: event.eventType,
      action: event.action,
      success: event.success,
      user_id: event.userId || null,
      user_email: event.userEmail || null,
      user_name: event.userName || null,
      resource_type: event.resourceType || null,
      resource_id: event.resourceId || null,
      ip_address: event.ipAddress || null,
      user_agent: event.userAgent || null,
      details: event.details || null,
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
    eventType: 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED' | 'SESSION_TIMEOUT',
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
        searchTerm: searchTerm.substring(0, 50), // Truncate for privacy
        resultCount,
      },
      success: true,
    });
  },

  /**
   * Log unauthorized access attempts
   */
  async logUnauthorizedAccess(
    resource: string,
    userId?: string,
    userEmail?: string
  ): Promise<void> {
    await this.log('UNAUTHORIZED_ACCESS', 'Unauthorized access attempt', {
      userId,
      userEmail,
      resourceType: resource,
      success: false,
    });
  },

  /**
   * Get audit logs for a specific user
   */
  getUserLogs(userId: string): AuditEvent[] {
    return getLocalLogs().filter(log => log.userId === userId);
  },

  /**
   * Get audit logs for a specific patient
   */
  getPatientLogs(patientId: string): AuditEvent[] {
    return getLocalLogs().filter(
      log => log.resourceType === 'patient' && log.resourceId === patientId
    );
  },

  /**
   * Get recent audit logs
   */
  getRecentLogs(limit: number = 100): AuditEvent[] {
    const logs = getLocalLogs();
    return logs.slice(-limit).reverse();
  },

  /**
   * Get audit logs by event type
   */
  getLogsByType(eventType: AuditEventType): AuditEvent[] {
    return getLocalLogs().filter(log => log.eventType === eventType);
  },

  /**
   * Get failed access attempts
   */
  getFailedAttempts(): AuditEvent[] {
    return getLocalLogs().filter(log => !log.success);
  },

  /**
   * Clear all local logs (admin only)
   */
  clearLogs(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  /**
   * Export logs for compliance reporting
   */
  exportLogs(): string {
    const logs = getLocalLogs();
    return JSON.stringify(logs, null, 2);
  },

  /**
   * Get audit statistics
   */
  getStats() {
    const logs = getLocalLogs();
    const now = Date.now();
    const last24h = logs.filter(
      log => now - new Date(log.timestamp).getTime() < 24 * 60 * 60 * 1000
    );

    return {
      totalEvents: logs.length,
      eventsLast24h: last24h.length,
      failedAttempts: logs.filter(l => !l.success).length,
      uniqueUsers: new Set(logs.map(l => l.userId).filter(Boolean)).size,
      patientAccesses: logs.filter(l => l.resourceType === 'patient').length,
      eventTypes: logs.reduce((acc, log) => {
        acc[log.eventType] = (acc[log.eventType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  },
};
