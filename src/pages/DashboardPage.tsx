import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { PageShell } from '@/components/patterns/page-shell';
import { AppHeader } from '@/components/patterns/app-header';
import { PageContent } from '@/components/patterns/page-content';
import { SectionHeader } from '@/components/patterns/section-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, CheckCircle, TrendingUp, Users } from 'lucide-react';
import { animations } from '@/lib/tokens/animations';
import { cn } from '@/lib/utils/cn';
import { supabase } from '@/lib/supabase';

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Get today's check-ins by this user
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count: todayCheckIns } = await supabase
        .from('visits')
        .select('*', { count: 'exact', head: true })
        .eq('checked_in_by', user.id)
        .gte('check_in_timestamp', today.toISOString());

      // Get recent patients (last 5 viewed/searched)
      const { data: recentActivity } = await supabase
        .from('audit_logs')
        .select('metadata')
        .eq('user_id', user.id)
        .in('event_type', ['patient_view', 'patient_search'])
        .order('created_at', { ascending: false })
        .limit(5);

      // Extract unique patient IDs
      const patientIds = recentActivity
        ?.map((log: { metadata?: { patient_id?: string } }) => log.metadata?.patient_id)
        .filter((id: string | undefined) => id)
        .filter((id: string, index: number, self: string[]) => self.indexOf(id) === index)
        .slice(0, 5) || [];

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
      }

      setStats({
        todayCheckIns: todayCheckIns || 0,
        pendingForms: 0, // TODO: Track incomplete forms
        recentSearches: recentActivity?.length || 0,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Patient Search',
      description: 'Find existing patients by name, phone, or DOB',
      icon: Search,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      route: '/search',
      badge: stats.recentSearches > 0 ? `${stats.recentSearches} recent` : null,
    },
    {
      title: 'New Patient Intake',
      description: 'Complete multi-step patient registration form',
      icon: FileText,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-gradient-to-br from-pink-50 to-pink-100',
      route: '/intake/new',
      badge: stats.pendingForms > 0 ? `${stats.pendingForms} pending` : null,
    },
    {
      title: 'Check-In Patient',
      description: 'Record patient visit with assistance tracking',
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      route: '/search',
      badge: stats.todayCheckIns > 0 ? `${stats.todayCheckIns} today` : null,
    },
  ];

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
        {/* Personalized Welcome */}
        <div className="mb-8">
          <h1 className="text-display-md bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-2">
            {getGreeting()}, {user?.full_name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-body-lg text-text-muted">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-white border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-900 mb-1">Check-ins Today</p>
                <p className="text-3xl font-bold text-purple-600">{stats.todayCheckIns}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-purple-600 opacity-50" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-pink-50 to-white border-pink-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-pink-900 mb-1">Recent Searches</p>
                <p className="text-3xl font-bold text-pink-600">{stats.recentSearches}</p>
              </div>
              <Search className="h-10 w-10 text-pink-600 opacity-50" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-white border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-900 mb-1">Pending Forms</p>
                <p className="text-3xl font-bold text-green-600">{stats.pendingForms}</p>
              </div>
              <FileText className="h-10 w-10 text-green-600 opacity-50" />
            </div>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Actions - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <SectionHeader 
              title="Quick Actions"
              description="What would you like to do?"
            />

            <div className="grid gap-6">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Card
                    key={action.title}
                    className="group cursor-pointer overflow-hidden border-2 border-transparent hover:border-primary-300 transition-all hover:scale-105"
                    onClick={() => navigate(action.route)}
                  >
                    <div className={cn('p-6', action.bgColor)}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            'p-4 rounded-2xl bg-gradient-to-br shadow-lg',
                            action.color
                          )}>
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-heading-md text-text mb-1 flex items-center gap-2">
                              {action.title}
                              {action.badge && (
                                <Badge variant="secondary">{action.badge}</Badge>
                              )}
                            </h3>
                            <p className="text-body-sm text-text-muted">
                              {action.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-primary-600 group-hover:translate-x-1 transition-transform">
                          →
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Sidebar - Recent Activity */}
          <div className="space-y-6">
            <SectionHeader 
              title="Recent Patients"
              description="Quick access to recently viewed"
            />

            {isLoading ? (
              <Card className="p-4">
                <div className="animate-pulse space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-surface-muted rounded" />
                  ))}
                </div>
              </Card>
            ) : recentPatients.length > 0 ? (
              <Card className="p-4">
                <div className="space-y-2">
                  {recentPatients.map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => navigate(`/patients/${patient.id}`)}
                      className="w-full p-3 rounded-lg hover:bg-surface-muted transition-colors text-left"
                    >
                      <p className="font-semibold text-text">
                        {patient.first_name} {patient.last_name}
                      </p>
                      {patient.diagnosis_primary && (
                        <p className="text-sm text-text-muted">{patient.diagnosis_primary}</p>
                      )}
                    </button>
                  ))}
                </div>
              </Card>
            ) : (
              <Card className="p-6 text-center">
                <Users className="h-12 w-12 mx-auto mb-3 text-text-muted opacity-50" />
                <p className="text-text-muted">No recent patients</p>
                <p className="text-sm text-text-subtle mt-1">
                  Start by searching for a patient
                </p>
              </Card>
            )}

            {/* Quick Tips */}
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-white border-blue-200">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900 mb-1">💡 Pro Tip</p>
                  <p className="text-sm text-blue-800">
                    Use keyboard shortcuts: <kbd className="px-2 py-1 bg-white rounded border text-xs">Ctrl+K</kbd> to search patients quickly
                  </p>
                </div>
              </div>
            </Card>

            {/* System Status */}
            <Card className="p-4 bg-gradient-to-br from-green-50 to-white border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-900 mb-1">System Status</p>
                  <p className="text-lg font-bold text-green-600">All Systems Operational</p>
                </div>
                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
              </div>
            </Card>
          </div>
        </div>
      </PageContent>
    </PageShell>
  );
};
