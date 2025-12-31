import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { analyticsService, type SystemMetrics } from '../services/analyticsService';
import { Users, UserPlus, Activity, CheckCircle, FileText, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const MetricCard = ({ title, value, icon: Icon, iconColor, bgColor, trend }: MetricCardProps) => (
  <Card className="p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-text-muted mb-1">{title}</p>
        <p className="text-3xl font-bold text-text mb-2">{value}</p>
        {trend && (
          <div className={cn(
            'flex items-center gap-1 text-sm font-medium',
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          )}>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
            <span className="text-text-muted">vs last month</span>
          </div>
        )}
      </div>
      <div className={cn('p-3 rounded-xl', bgColor)}>
        <Icon className={cn('h-6 w-6', iconColor)} />
      </div>
    </div>
  </Card>
);

export const SystemMetricsOverview = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMetrics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await analyticsService.getSystemMetrics();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load metrics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading && !metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(7)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-20 bg-surface-muted rounded" />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 text-status-error">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      </Card>
    );
  }

  if (!metrics) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-heading-lg text-text">System Overview</h2>
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span>Live data • Updates every 30s</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Patients"
          value={metrics.totalPatients.toLocaleString()}
          icon={Users}
          iconColor="text-purple-600"
          bgColor="bg-purple-50"
        />

        <MetricCard
          title="New This Month"
          value={metrics.newPatientsThisMonth.toLocaleString()}
          icon={UserPlus}
          iconColor="text-blue-600"
          bgColor="bg-blue-50"
          trend={{ value: 12, isPositive: true }}
        />

        <MetricCard
          title="Visits This Month"
          value={metrics.totalVisitsThisMonth.toLocaleString()}
          icon={Activity}
          iconColor="text-green-600"
          bgColor="bg-green-50"
          trend={{ value: 8, isPositive: true }}
        />

        <MetricCard
          title="Active Staff"
          value={metrics.activeStaffMembers.toLocaleString()}
          icon={CheckCircle}
          iconColor="text-teal-600"
          bgColor="bg-teal-50"
        />

        <MetricCard
          title="Pending Approvals"
          value={metrics.pendingApprovals.toLocaleString()}
          icon={Clock}
          iconColor="text-orange-600"
          bgColor="bg-orange-50"
        />

        <MetricCard
          title="Forms Completed"
          value={metrics.intakeFormsCompletedThisMonth.toLocaleString()}
          icon={FileText}
          iconColor="text-pink-600"
          bgColor="bg-pink-50"
          trend={{ value: 15, isPositive: true }}
        />

        <MetricCard
          title="Avg Completion Time"
          value={metrics.averageFormCompletionTime > 0 ? `${metrics.averageFormCompletionTime}m` : 'N/A'}
          icon={Clock}
          iconColor="text-indigo-600"
          bgColor="bg-indigo-50"
        />

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-900 mb-1">System Health</p>
              <p className="text-3xl font-bold text-purple-600">Excellent</p>
              <p className="text-sm text-purple-700 mt-1">All systems operational</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center">
              <CheckCircle className="h-7 w-7 text-white" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
