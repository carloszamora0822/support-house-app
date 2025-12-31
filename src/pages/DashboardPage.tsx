import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { PageShell } from '@/components/patterns/page-shell';
import { AppHeader } from '@/components/patterns/app-header';
import { PageContent } from '@/components/patterns/page-content';
import { SectionHeader } from '@/components/patterns/section-header';
import { Card } from '@/components/ui/card';
import { Search, FileText, CheckCircle, Database, Lightbulb } from 'lucide-react';
import { animations } from '@/lib/tokens/animations';
import { cn } from '@/lib/utils/cn';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Patient Search',
      description: 'Search for existing patients by name, phone, or DOB',
      icon: Search,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-white to-purple-50',
      route: '/search'
    },
    {
      title: 'New Patient Intake',
      description: 'Complete multi-step patient registration form',
      icon: FileText,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'from-white to-pink-50',
      route: '/intake/new'
    },
    {
      title: 'Check-In Patient',
      description: 'Record patient visit with assistance tracking',
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-white to-green-50',
      route: '/search'
    },
  ];

  return (
    <PageShell variant="gradient">
      <AppHeader />
      
      <PageContent>
        <SectionHeader 
          title={`Welcome back, ${user?.full_name?.split(' ')[0]}! 👋`}
          description="What would you like to do today?"
        />

        <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6 sm:mb-8">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.title}
                onClick={() => navigate(action.route)}
                className={cn(
                  'cursor-pointer border-purple-100 bg-gradient-to-br',
                  action.bgColor,
                  animations.hoverLift
                )}
              >
                <div className={cn(
                  'p-3 bg-gradient-to-br rounded-xl shadow-md inline-flex mb-4',
                  action.color
                )}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-base sm:text-heading-sm text-text mb-2 font-semibold">{action.title}</h3>
                <p className="text-xs sm:text-body-sm text-text-muted">{action.description}</p>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 md:grid-cols-2">
          <Card className="border-purple-100 bg-surface">
            <h3 className="text-heading-sm text-text mb-4 flex items-center gap-2">
              <Database className="h-5 w-5 text-primary-600" />
              System Information
            </h3>
            <div className="space-y-3 text-body-sm">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-text-muted">Database Status</span>
                <span className="font-medium text-status-success flex items-center gap-1">
                  <span className="w-2 h-2 bg-status-success rounded-full"></span>
                  Connected
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-text-muted">Your Role</span>
                <span className="font-medium text-primary-600 capitalize">{user?.role}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-text-muted">Account Status</span>
                <span className="font-medium text-status-success">Active</span>
              </div>
            </div>
          </Card>

          <Card className="border-purple-100 bg-gradient-to-br from-white to-purple-50">
            <h3 className="text-heading-sm text-text mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary-600" />
              Quick Tips
            </h3>
            <ul className="space-y-3 text-body-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-0.5">▸</span>
                <div>
                  <span className="font-medium text-text">Patient Check-In</span>
                  <p className="text-text-muted text-caption mt-0.5">Search for a patient first, then click "Check In This Patient" on their detail page</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-0.5">▸</span>
                <div>
                  <span className="font-medium text-text">New Patient Registration</span>
                  <p className="text-text-muted text-caption mt-0.5">Complete all 4 steps of the intake form to register a new patient</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-0.5">▸</span>
                <div>
                  <span className="font-medium text-text">Patient Search</span>
                  <p className="text-text-muted text-caption mt-0.5">Search by name, phone number, email, or date of birth</p>
                </div>
              </li>
            </ul>
          </Card>
        </div>
      </PageContent>
    </PageShell>
  );
};
