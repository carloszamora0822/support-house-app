// Admin dashboard component for viewing audit logs
// HIPAA Compliance: Provides visibility into all PHI access

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { AuditEventType } from '@/utils/auditLogger';

interface AuditLog {
  id: string;
  created_at: string;
  event_type: AuditEventType;
  action: string;
  success: boolean;
  user_email: string | null;
  user_name: string | null;
  resource_type: string | null;
  resource_id: string | null;
  ip_address: string | null;
}

interface AuditStats {
  total_events: number;
  failed_events: number;
  unique_users: number;
  patient_accesses: number;
  failed_logins: number;
}

export function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AuditEventType | 'ALL'>('ALL');
  const [timeRange, setTimeRange] = useState<number>(24); // hours

  useEffect(() => {
    loadLogs();
    loadStats();
  }, [filter, timeRange]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('audit_logs')
        .select('*')
        .gte('created_at', new Date(Date.now() - timeRange * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(100);

      if (filter !== 'ALL') {
        query = query.eq('event_type', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_audit_statistics', {
        hours_back: timeRange,
      });

      if (error) throw error;
      if (data && data.length > 0) {
        setStats(data[0]);
      }
    } catch (error) {
      console.error('Failed to load audit statistics:', error);
    }
  };

  const getEventColor = (eventType: AuditEventType, success: boolean) => {
    if (!success) return 'text-red-600 bg-red-50';
    
    switch (eventType) {
      case 'LOGIN':
        return 'text-green-600 bg-green-50';
      case 'LOGOUT':
        return 'text-gray-600 bg-gray-50';
      case 'LOGIN_FAILED':
        return 'text-red-600 bg-red-50';
      case 'PATIENT_VIEWED':
      case 'PATIENT_CREATED':
      case 'PATIENT_UPDATED':
        return 'text-blue-600 bg-blue-50';
      case 'PATIENT_DELETED':
        return 'text-orange-600 bg-orange-50';
      case 'UNAUTHORIZED_ACCESS':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Audit Logs</h2>
        <p className="text-gray-600 mt-1">
          HIPAA-compliant audit trail of all system events and PHI access
        </p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">Total Events</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total_events}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">Failed Events</div>
            <div className="text-2xl font-bold text-red-600">{stats.failed_events}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">Unique Users</div>
            <div className="text-2xl font-bold text-blue-600">{stats.unique_users}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">Patient Accesses</div>
            <div className="text-2xl font-bold text-purple-600">{stats.patient_accesses}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">Failed Logins</div>
            <div className="text-2xl font-bold text-orange-600">{stats.failed_logins}</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Type
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as AuditEventType | 'ALL')}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="ALL">All Events</option>
              <option value="LOGIN">Logins</option>
              <option value="LOGIN_FAILED">Failed Logins</option>
              <option value="PATIENT_VIEWED">Patient Views</option>
              <option value="PATIENT_CREATED">Patient Created</option>
              <option value="PATIENT_UPDATED">Patient Updated</option>
              <option value="PATIENT_DELETED">Patient Deleted</option>
              <option value="UNAUTHORIZED_ACCESS">Unauthorized Access</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Range
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value={1}>Last Hour</option>
              <option value={24}>Last 24 Hours</option>
              <option value={168}>Last Week</option>
              <option value={720}>Last 30 Days</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={loadLogs}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Event
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Resource
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  IP Address
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Loading audit logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No audit logs found for the selected filters
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getEventColor(log.event_type, log.success)}`}
                      >
                        {log.event_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div>{log.user_name || 'System'}</div>
                      <div className="text-xs text-gray-500">{log.user_email}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{log.action}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {log.resource_type && (
                        <div>
                          <span className="font-medium">{log.resource_type}</span>
                          {log.resource_id && (
                            <div className="text-xs text-gray-500 truncate max-w-xs">
                              {log.resource_id}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                      {log.ip_address || '-'}
                    </td>
                    <td className="px-4 py-3">
                      {log.success ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-red-600">✗</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* HIPAA Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>HIPAA Compliance:</strong> All audit logs are retained for 2 years minimum
          as required by HIPAA regulations. Logs are immutable and cannot be modified or
          deleted except by administrators following retention policies.
        </p>
      </div>
    </div>
  );
}
