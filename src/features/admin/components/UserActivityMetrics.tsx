import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { analyticsService, type UserActivityMetric } from '../services/analyticsService';
import { TrendingUp, Search, FileText, CheckCircle, Activity } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export const UserActivityMetrics = () => {
  const [metrics, setMetrics] = useState<UserActivityMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadMetrics = async () => {
    try {
      setIsLoading(true);
      const data = await analyticsService.getUserActivityMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to load user activity metrics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
    
    // Refresh every 60 seconds
    const interval = setInterval(loadMetrics, 60000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-surface-muted rounded w-1/3" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-surface-muted rounded" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const topUsers = metrics.slice(0, 10);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-primary-600" />
          <h3 className="text-heading-md text-text">Most Active Users (Last 30 Days)</h3>
        </div>
        <Badge variant="secondary">{metrics.length} Active Users</Badge>
      </div>

      <div className="space-y-4">
        {topUsers.map((user, index) => (
          <div
            key={user.userId}
            className={cn(
              'p-4 rounded-lg border transition-all hover:shadow-md',
              index < 3 ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200' : 'bg-surface border-border'
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'h-10 w-10 rounded-full flex items-center justify-center font-bold text-white',
                  index === 0 ? 'bg-yellow-500' :
                  index === 1 ? 'bg-gray-400' :
                  index === 2 ? 'bg-orange-600' :
                  'bg-primary-600'
                )}>
                  {index < 3 ? ['🥇', '🥈', '🥉'][index] : index + 1}
                </div>
                <div>
                  <p className="font-semibold text-text">{user.fullName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={user.role === 'admin' ? 'primary' : 'secondary'}>
                      {user.role}
                    </Badge>
                    <span className="text-xs text-text-muted">
                      Last login: {new Date(user.lastLogin).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary-600">{user.actionsCount}</p>
                <p className="text-xs text-text-muted">Total Actions</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Activity className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="font-semibold text-text">{user.loginCount}</p>
                  <p className="text-xs text-text-muted">Logins</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Search className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="font-semibold text-text">{user.patientsSearched}</p>
                  <p className="text-xs text-text-muted">Searches</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-pink-600" />
                <div>
                  <p className="font-semibold text-text">{user.intakeFormsCompleted}</p>
                  <p className="text-xs text-text-muted">Forms</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <p className="font-semibold text-text">{user.checkinsPerformed}</p>
                  <p className="text-xs text-text-muted">Check-ins</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {metrics.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No user activity data available</p>
        </div>
      )}
    </Card>
  );
};
