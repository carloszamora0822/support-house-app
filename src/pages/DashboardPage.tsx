import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { PageShell } from '@/components/patterns/page-shell';
import { AppHeader } from '@/components/patterns/app-header';
import { PageContent } from '@/components/patterns/page-content';
import { Card } from '@/components/ui/card';
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
  }, [user, loadDashboardData]);

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

        {/* Actionable Stats - Compressed */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button
            onClick={() => navigate('/search')}
            className="text-left p-4 bg-white border border-border rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-text-muted uppercase tracking-wide">Check-ins Today</span>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-text">{stats.todayCheckIns}</p>
            <p className="text-xs text-green-600 mt-1">→ View all</p>
          </button>

          <button
            onClick={() => navigate('/search')}
            className="text-left p-4 bg-white border border-border rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-text-muted uppercase tracking-wide">Your Searches (7d)</span>
              <Search className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-text">{stats.recentSearches}</p>
            <p className="text-xs text-purple-600 mt-1">→ Search again</p>
          </button>

          <button
            onClick={() => navigate('/intake/new')}
            className="text-left p-4 bg-white border border-border rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-text-muted uppercase tracking-wide">Pending Forms</span>
              <FileText className="h-4 w-4 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-text">{stats.pendingForms}</p>
            <p className="text-xs text-orange-600 mt-1">→ Start new</p>
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Activity - Full Width */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading-md text-text">Recent Activity</h2>
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">View all →</button>
            </div>
            
            <Card className="p-0 divide-y divide-border">
              {recentPatients.length > 0 ? (
                recentPatients.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => navigate(`/patients/${patient.id}`)}
                    className="w-full p-4 hover:bg-surface-muted transition-colors text-left flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-text group-hover:text-primary-600 transition-colors">
                          {patient.first_name} {patient.last_name}
                        </p>
                        {patient.diagnosis_primary && (
                          <p className="text-sm text-text-muted">{patient.diagnosis_primary}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-text-muted">Recently viewed</span>
                      <span className="text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center">
                  <Users className="h-12 w-12 mx-auto mb-3 text-text-muted opacity-30" />
                  <p className="text-text-muted mb-2">No recent activity</p>
                  <button
                    onClick={() => navigate('/search')}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Search for a patient →
                  </button>
                </div>
              )}
            </Card>

            {/* Compressed Secondary Actions */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => navigate('/search')}
                className="p-4 bg-white border border-border rounded-lg hover:border-primary-300 hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Search className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="font-semibold text-text group-hover:text-primary-600 transition-colors">Advanced Search</span>
                </div>
                <p className="text-xs text-text-muted">Filter by diagnosis, date, location</p>
              </button>

              <button
                onClick={() => navigate('/intake/new')}
                className="p-4 bg-white border border-border rounded-lg hover:border-primary-300 hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-pink-100 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-pink-600" />
                  </div>
                  <span className="font-semibold text-text group-hover:text-primary-600 transition-colors">New Intake Form</span>
                </div>
                <p className="text-xs text-text-muted">Complete patient registration</p>
              </button>
            </div>
          </div>

          {/* Sidebar - Workflow Shortcuts */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide">Quick Actions</h3>
            
            <div className="space-y-2">
              <button
                onClick={() => navigate('/search')}
                className="w-full p-3 bg-white border border-border rounded-lg hover:border-primary-300 hover:shadow-sm transition-all text-left flex items-center gap-3 group"
              >
                <div className="h-8 w-8 rounded bg-purple-100 flex items-center justify-center">
                  <Search className="h-4 w-4 text-purple-600" />
                </div>
                <span className="font-medium text-text group-hover:text-primary-600 transition-colors">Patient Search</span>
              </button>

              <button
                onClick={() => navigate('/intake/new')}
                className="w-full p-3 bg-white border border-border rounded-lg hover:border-primary-300 hover:shadow-sm transition-all text-left flex items-center gap-3 group"
              >
                <div className="h-8 w-8 rounded bg-pink-100 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-pink-600" />
                </div>
                <span className="font-medium text-text group-hover:text-primary-600 transition-colors">New Intake</span>
              </button>

              <button
                onClick={() => navigate('/search')}
                className="w-full p-3 bg-white border border-border rounded-lg hover:border-primary-300 hover:shadow-sm transition-all text-left flex items-center gap-3 group"
              >
                <div className="h-8 w-8 rounded bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <span className="font-medium text-text group-hover:text-primary-600 transition-colors">Check-In</span>
              </button>
            </div>

            {/* Keyboard Shortcuts - Collapsed */}
            <details className="group">
              <summary className="cursor-pointer p-3 bg-surface-muted rounded-lg hover:bg-surface text-sm font-medium text-text-muted list-none flex items-center justify-between">
                <span>⌨️ Keyboard Shortcuts</span>
                <span className="text-xs group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-2 p-3 bg-white border border-border rounded-lg text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-text-muted">Search</span>
                  <kbd className="px-2 py-1 bg-surface rounded border text-text">Ctrl+K</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">New Intake</span>
                  <kbd className="px-2 py-1 bg-surface rounded border text-text">Ctrl+N</kbd>
                </div>
              </div>
            </details>
          </div>
        </div>
      </PageContent>
    </PageShell>
  );
};
