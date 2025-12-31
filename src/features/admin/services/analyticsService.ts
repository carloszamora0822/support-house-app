import { supabase } from '@/lib/supabase';

export interface SystemMetrics {
  totalPatients: number;
  newPatientsThisMonth: number;
  totalVisitsThisMonth: number;
  activeStaffMembers: number;
  pendingApprovals: number;
  intakeFormsCompletedThisMonth: number;
  averageFormCompletionTime: number;
}

export interface UserActivityMetric {
  userId: string;
  fullName: string;
  role: string;
  loginCount: number;
  lastLogin: string;
  actionsCount: number;
  patientsSearched: number;
  intakeFormsStarted: number;
  intakeFormsCompleted: number;
  checkinsPerformed: number;
}

export interface IntakeFormMetric {
  totalStarted: number;
  totalCompleted: number;
  completionRate: number;
  averageCompletionTime: number;
  abandonmentRate: number;
  formsByStaff: Array<{
    staffName: string;
    started: number;
    completed: number;
  }>;
}

export interface SystemHealthMetric {
  errorRate: number;
  failedLoginAttempts: number;
  averageSessionDuration: number;
  activeSessionsNow: number;
}

export const analyticsService = {
  /**
   * Get system overview metrics
   */
  async getSystemMetrics(): Promise<SystemMetrics> {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Total patients
    const { count: totalPatients } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true });

    // New patients this month
    const { count: newPatientsThisMonth } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', firstDayOfMonth.toISOString());

    // Total visits this month
    const { count: totalVisitsThisMonth } = await supabase
      .from('visits')
      .select('*', { count: 'exact', head: true })
      .gte('check_in_timestamp', firstDayOfMonth.toISOString());

    // Active staff members (approved users)
    const { count: activeStaffMembers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('approved', true);

    // Pending approvals
    const { count: pendingApprovals } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('approved', false);

    // Intake forms completed this month (patients created this month)
    const { count: intakeFormsCompletedThisMonth } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', firstDayOfMonth.toISOString());

    return {
      totalPatients: totalPatients || 0,
      newPatientsThisMonth: newPatientsThisMonth || 0,
      totalVisitsThisMonth: totalVisitsThisMonth || 0,
      activeStaffMembers: activeStaffMembers || 0,
      pendingApprovals: pendingApprovals || 0,
      intakeFormsCompletedThisMonth: intakeFormsCompletedThisMonth || 0,
      averageFormCompletionTime: 0, // TODO: Calculate from audit logs
    };
  },

  /**
   * Get user activity metrics
   */
  async getUserActivityMetrics(): Promise<UserActivityMetric[]> {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get all users
    const { data: users } = await supabase
      .from('users')
      .select('id, full_name, role, last_login')
      .eq('approved', true);

    if (!users) return [];

    // Get activity counts from audit logs for each user
    const userMetrics = await Promise.all(
      users.map(async (user: { id: string; full_name: string; role: string; last_login: string | null }) => {
        // Login count (last 30 days)
        const { count: loginCount } = await supabase
          .from('audit_logs')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('event_type', 'login')
          .gte('created_at', thirtyDaysAgo.toISOString());

        // Total actions count
        const { count: actionsCount } = await supabase
          .from('audit_logs')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', thirtyDaysAgo.toISOString());

        // Patients searched
        const { count: patientsSearched } = await supabase
          .from('audit_logs')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('event_type', 'patient_search')
          .gte('created_at', thirtyDaysAgo.toISOString());

        // Check-ins performed
        const { count: checkinsPerformed } = await supabase
          .from('visits')
          .select('*', { count: 'exact', head: true })
          .eq('checked_in_by', user.id)
          .gte('check_in_timestamp', thirtyDaysAgo.toISOString());

        return {
          userId: user.id,
          fullName: user.full_name,
          role: user.role,
          loginCount: loginCount || 0,
          lastLogin: user.last_login || 'Never',
          actionsCount: actionsCount || 0,
          patientsSearched: patientsSearched || 0,
          intakeFormsStarted: 0, // TODO: Track in audit logs
          intakeFormsCompleted: 0, // TODO: Track in audit logs
          checkinsPerformed: checkinsPerformed || 0,
        };
      })
    );

    return userMetrics.sort((a: UserActivityMetric, b: UserActivityMetric) => b.actionsCount - a.actionsCount);
  },

  /**
   * Get intake form metrics
   */
  async getIntakeFormMetrics(): Promise<IntakeFormMetric> {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Total completed (patients created this month)
    const { count: totalCompleted } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', firstDayOfMonth.toISOString());

    // TODO: Track forms started in audit logs
    const totalStarted = totalCompleted || 0;

    const completionRate = totalStarted > 0 ? (totalCompleted || 0) / totalStarted : 0;
    const abandonmentRate = 1 - completionRate;

    return {
      totalStarted,
      totalCompleted: totalCompleted || 0,
      completionRate: completionRate * 100,
      averageCompletionTime: 0, // TODO: Calculate from timestamps
      abandonmentRate: abandonmentRate * 100,
      formsByStaff: [], // TODO: Aggregate by staff member
    };
  },

  /**
   * Get system health metrics
   */
  async getSystemHealthMetrics(): Promise<SystemHealthMetric> {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Failed login attempts (last 24 hours)
    const { count: failedLoginAttempts } = await supabase
      .from('audit_logs')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'login_failed')
      .gte('created_at', last24Hours.toISOString());

    // Active sessions (users logged in within last hour)
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const { count: activeSessionsNow } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('last_login', oneHourAgo.toISOString());

    return {
      errorRate: 0, // TODO: Calculate from error logs
      failedLoginAttempts: failedLoginAttempts || 0,
      averageSessionDuration: 0, // TODO: Calculate from session data
      activeSessionsNow: activeSessionsNow || 0,
    };
  },

  /**
   * Get recent activity feed
   */
  async getRecentActivity(limit: number = 20) {
    const { data: activities } = await supabase
      .from('audit_logs')
      .select(`
        *,
        users!audit_logs_user_id_fkey (
          full_name,
          role
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    return activities || [];
  },
};
