import { useState, useEffect } from 'react';
import { UserApprovalDashboard } from '@/features/admin/components/UserApprovalDashboard';
import { UserActivityDashboard } from '@/features/admin/components/UserActivityDashboard';
import { AuditLogViewer } from '@/features/admin/components/AuditLogViewer';
import { SystemMetricsOverview } from '@/features/admin/components/SystemMetricsOverview';
import { UserActivityMetrics } from '@/features/admin/components/UserActivityMetrics';
import { MFASetupModal } from '@/features/auth/components/MFASetupModal';
import { mfaService } from '@/features/auth/services/mfaService';
import { PageShell } from '@/components/patterns/page-shell';
import { AppHeader } from '@/components/patterns/app-header';
import { PageContent } from '@/components/patterns/page-content';
import { SectionHeader } from '@/components/patterns/section-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Activity, FileText, Shield, TrendingUp, Lock } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import toast from 'react-hot-toast';

type TabType = 'approvals' | 'activity' | 'audit' | 'overview';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showMFASetup, setShowMFASetup] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [isCheckingMFA, setIsCheckingMFA] = useState(true);

  useEffect(() => {
    checkMFAStatus();
  }, []);

  const checkMFAStatus = async () => {
    try {
      const enabled = await mfaService.isMFAEnabled();
      setMfaEnabled(enabled);
    } catch (error) {
      console.error('Failed to check MFA status:', error);
    } finally {
      setIsCheckingMFA(false);
    }
  };

  const handleMFASetupSuccess = () => {
    setShowMFASetup(false);
    setMfaEnabled(true);
    toast.success('Two-factor authentication enabled successfully!');
  };

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
            <div className="space-y-8">
              {/* Real-time System Metrics */}
              <SystemMetricsOverview />

              {/* User Activity Leaderboard */}
              <UserActivityMetrics />

              {/* Security Settings - 2FA */}
              <Card className="p-6">
                <h3 className="text-heading-md text-text mb-4 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-red-600" />
                  Security Settings
                </h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800">
                    <strong>HIPAA Requirement:</strong> Admin accounts must have two-factor authentication enabled.
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Two-Factor Authentication (2FA)</h4>
                    <p className="text-sm text-gray-600">
                      {mfaEnabled 
                        ? '✅ 2FA is enabled on your account' 
                        : '⚠️ 2FA is not enabled - your account is at risk'}
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowMFASetup(true)}
                    variant={mfaEnabled ? 'outline' : 'primary'}
                    disabled={isCheckingMFA}
                  >
                    {isCheckingMFA ? 'Checking...' : mfaEnabled ? 'Manage 2FA' : 'Enable 2FA'}
                  </Button>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="text-heading-md text-text mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary-600" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="h-8 w-8 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Review and approve new user registrations. All users require admin approval before accessing the system.
                  </p>
                  <Button
                    onClick={() => setActiveTab('approvals')}
                    variant="outline"
                    size="sm"
                  >
                    View Pending Approvals →
                  </Button>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Activity className="h-8 w-8 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">User Activity</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Monitor all user actions including patient views, edits, searches, and document access.
                  </p>
                  <Button
                    onClick={() => setActiveTab('activity')}
                    variant="outline"
                    size="sm"
                  >
                    View Activity Dashboard →
                  </Button>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="h-8 w-8 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Audit Logs</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    HIPAA-compliant audit trail of all PHI access, login attempts, and system events.
                  </p>
                  <Button
                    onClick={() => setActiveTab('audit')}
                    variant="outline"
                    size="sm"
                  >
                    View Audit Logs →
                  </Button>
                </Card>
                </div>
              </Card>

              {/* System Info */}
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

        <MFASetupModal
          isOpen={showMFASetup}
          onClose={() => setShowMFASetup(false)}
          onSuccess={handleMFASetupSuccess}
        />
      </PageContent>
    </PageShell>
  );
}
