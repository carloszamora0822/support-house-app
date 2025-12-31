import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { PageShell } from '@/components/patterns/page-shell';
import { AppHeader } from '@/components/patterns/app-header';
import { PageContent } from '@/components/patterns/page-content';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { InlinePatientSearch } from '@/features/lookup/components/InlinePatientSearch';

interface RecentPatient {
  id: string;
  first_name: string;
  last_name: string;
  diagnosis_primary: string | null;
  last_visit: string | null;
}

interface DashboardStats {
  todayCheckIns: number;
  pendingForms: number;
  recentSearches: number;
}

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recentPatients, setRecentPatients] = useState<RecentPatient[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    todayCheckIns: 0,
    pendingForms: 0,
    recentSearches: 0,
  });

  const loadDashboardData = useCallback(async () => {
    if (!user) return;

    try {
      // Get today's check-ins (all check-ins today, not just by this user)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count: todayCheckIns } = await supabase
        .from('visits')
        .select('*', { count: 'exact', head: true })
        .gte('check_in_timestamp', today.toISOString());

      console.log('Today check-ins:', todayCheckIns);

      // Get recent search activity (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { count: recentSearchCount } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('event_type', 'patient_search')
        .gte('created_at', sevenDaysAgo.toISOString());

      console.log('Recent searches:', recentSearchCount);

      // Get recent patients (last 5 viewed/searched)
      const { data: recentActivity } = await supabase
        .from('audit_logs')
        .select('metadata')
        .eq('user_id', user.id)
        .in('event_type', ['patient_view', 'patient_search'])
        .order('created_at', { ascending: false })
        .limit(10);

      console.log('Recent activity:', recentActivity);

      // Extract unique patient IDs
      const patientIds = (recentActivity
        ?.map((log: { metadata?: { patient_id?: string } }) => log.metadata?.patient_id)
        .filter((id): id is string => !!id) || [])
        .filter((id, index, self) => self.indexOf(id) === index)
        .slice(0, 5);

      console.log('Patient IDs:', patientIds);

      if (patientIds.length > 0) {
        const { data: patients } = await supabase
          .from('patients')
          .select('id, first_name, last_name, diagnosis_primary')
          .in('id', patientIds);

        const formattedPatients = patients?.map(p => ({
          ...p,
          last_visit: null
        })) || [];
        setRecentPatients(formattedPatients);
        console.log('Recent patients:', formattedPatients);
      }

      setStats({
        todayCheckIns: todayCheckIns || 0,
        pendingForms: 0, // TODO: Track incomplete forms
        recentSearches: recentSearchCount || 0,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      console.error('Error details:', error);
    }
  }, [user]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <PageShell variant="gradient">
      <AppHeader />
      
      <PageContent>
        {/* Compact Welcome + Primary Action */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-heading-xl text-text mb-1">
                {getGreeting()}, {user?.full_name?.split(' ')[0]}!
              </h1>
              <p className="text-sm text-text-muted">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
            </div>
            <Badge variant="secondary">{user?.role}</Badge>
          </div>

          {/* DOMINANT PRIMARY ACTION - INLINE SEARCH */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-heading-xl text-text mb-1">Patient Lookup</h2>
                <p className="text-sm text-text-muted">Start typing to search instantly</p>
              </div>
              <button
                onClick={() => navigate('/intake/new')}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-all flex items-center gap-2 shadow-lg"
              >
                <FileText className="h-5 w-5" />
                New Intake
              </button>
            </div>
            
            <InlinePatientSearch />
          </div>
        </div>

        {/* Operational Stats - Informational Only */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3 bg-surface border border-border rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-text-muted uppercase tracking-wide">Check-ins Today</span>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-text mb-0.5">{stats.todayCheckIns}</p>
            <p className="text-xs text-green-600">↑ 4 from yesterday</p>
          </div>

          <div className="p-3 bg-surface border border-border rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-text-muted uppercase tracking-wide">Pending Forms</span>
              <FileText className="h-4 w-4 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-text mb-0.5">{stats.pendingForms}</p>
            <p className="text-xs text-text-muted">Forms awaiting completion</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          {/* Activity Timeline - 3 columns */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">Recent Activity</h3>
            
            {recentPatients.length > 0 ? (
              <div className="space-y-2">
                {recentPatients.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => navigate(`/patients/${patient.id}`)}
                    className="w-full p-3 bg-surface border border-border rounded-lg hover:border-primary-300 hover:bg-white transition-all text-left flex items-center gap-3 group"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <Users className="h-4 w-4 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text group-hover:text-primary-600 transition-colors truncate">
                        {patient.first_name} {patient.last_name}
                      </p>
                      {patient.diagnosis_primary && (
                        <p className="text-xs text-text-muted truncate">{patient.diagnosis_primary}</p>
                      )}
                    </div>
                    <span className="text-xs text-text-muted">Viewed</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-surface border border-border rounded-lg text-center">
                <p className="text-sm text-text-muted">No recent activity</p>
              </div>
            )}
          </div>

          {/* Utility Panel */}
          <div>
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">Shortcuts</h3>
            <details className="group" open>
              <summary className="cursor-pointer p-2 bg-surface rounded-lg hover:bg-white text-xs font-medium text-text-muted list-none flex items-center justify-between border border-border">
                <span>⌨️ Keyboard</span>
                <span className="text-xs group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-2 p-2 bg-surface border border-border rounded-lg text-xs space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Search</span>
                  <kbd className="px-1.5 py-0.5 bg-white rounded border text-text text-xs">Ctrl+K</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">New Intake</span>
                  <kbd className="px-1.5 py-0.5 bg-white rounded border text-text text-xs">Ctrl+N</kbd>
                </div>
              </div>
            </details>
          </div>
        </div>
      </PageContent>
    </PageShell>
  );
};
