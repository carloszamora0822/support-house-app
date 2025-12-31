import { useState } from 'react';
import { UserApprovalDashboard } from '@/features/admin/components/UserApprovalDashboard';
import { UserActivityDashboard } from '@/features/admin/components/UserActivityDashboard';
import { AuditLogViewer } from '@/features/admin/components/AuditLogViewer';
import { PageShell } from '@/components/patterns/page-shell';
import { AppHeader } from '@/components/patterns/app-header';
import { PageContent } from '@/components/patterns/page-content';
import { SectionHeader } from '@/components/patterns/section-header';
import { Card } from '@/components/ui/card';
import { Users, Activity, FileText, Shield } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

type TabType = 'approvals' | 'activity' | 'audit' | 'overview';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: Shield },
    { id: 'approvals' as TabType, label: 'User Approvals', icon: Users },
    { id: 'activity' as TabType, label: 'User Activity', icon: Activity },
    { id: 'audit' as TabType, label: 'Audit Logs', icon: FileText },
  ];

  return (
    <PageShell variant="default">
      <AppHeader />
      <PageContent>
        <SectionHeader 
          title="Admin Dashboard"
          description="Manage users, monitor activity, and review security logs"
        />

        <div className="border-b border-border mb-6">
          <nav className="flex gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors',
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-text-muted hover:text-text hover:border-border-strong'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="h-8 w-8 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Review and approve new user registrations. All users require admin approval before accessing the system.
                  </p>
                  <button
                    onClick={() => setActiveTab('approvals')}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    View Pending Approvals →
                  </button>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Activity className="h-8 w-8 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">User Activity</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Monitor all user actions including patient views, edits, searches, and document access.
                  </p>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View Activity Dashboard →
                  </button>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="h-8 w-8 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Audit Logs</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    HIPAA-compliant audit trail of all PHI access, login attempts, and system events.
                  </p>
                  <button
                    onClick={() => setActiveTab('audit')}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    View Audit Logs →
                  </button>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Admin Approval Required</h4>
                      <p className="text-sm text-gray-600">All new users must be approved by you before accessing the system</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Email Verification</h4>
                      <p className="text-sm text-gray-600">Users must verify their email before approval</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Strong Password Policy</h4>
                      <p className="text-sm text-gray-600">12+ characters with uppercase, lowercase, number, and special character</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Rate Limiting</h4>
                      <p className="text-sm text-gray-600">5 failed login attempts = 15 minute lockout (server-enforced)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Session-Based Encryption</h4>
                      <p className="text-sm text-gray-600">PHI encrypted with user session keys (cannot decrypt offline)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Complete Audit Trail</h4>
                      <p className="text-sm text-gray-600">All PHI access automatically logged for HIPAA compliance</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'approvals' && <UserApprovalDashboard />}
          {activeTab === 'activity' && <UserActivityDashboard />}
          {activeTab === 'audit' && <AuditLogViewer />}
        </div>
      </PageContent>
    </PageShell>
  );
}
