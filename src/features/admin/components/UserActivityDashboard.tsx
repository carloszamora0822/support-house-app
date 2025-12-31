import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Select } from '@/components/ui/select';
import { Card } from '@/components/common/Card';
import { Activity, User, Search, FileText, Eye, Edit, TrendingUp } from 'lucide-react';

interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  entity_type?: string;
  entity_id?: string;
  details?: any;
  created_at: string;
  user_email?: string;
  user_name?: string;
}

interface UserStats {
  user_id: string;
  user_email: string;
  user_name: string;
  user_role: string;
  total_activities: number;
  patient_views: number;
  patient_edits: number;
  searches: number;
  last_activity: string;
}

export function UserActivityDashboard() {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(24); // hours
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [timeRange, selectedUser]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([loadActivities(), loadUserStats()]);
    } catch (error) {
      console.error('Error loading activity data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadActivities = async () => {
    const cutoffTime = new Date(Date.now() - timeRange * 60 * 60 * 1000).toISOString();
    
    let query = supabase
      .from('user_activity')
      .select(`
        *,
        users!inner(email, full_name)
      `)
      .gte('created_at', cutoffTime)
      .order('created_at', { ascending: false })
      .limit(100);

    if (selectedUser) {
      query = query.eq('user_id', selectedUser);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Transform data to include user info
    const transformed = (data || []).map((activity: any) => ({
      ...activity,
      user_email: activity.users?.email,
      user_name: activity.users?.full_name,
    }));

    setActivities(transformed);
  };

  const loadUserStats = async () => {
    const cutoffTime = new Date(Date.now() - timeRange * 60 * 60 * 1000).toISOString();

    // Get aggregated stats per user
    const { data, error } = await supabase
      .from('user_activity')
      .select(`
        user_id,
        activity_type,
        created_at,
        users!inner(email, full_name, role)
      `)
      .gte('created_at', cutoffTime);

    if (error) throw error;

    // Aggregate stats by user
    const statsMap = new Map<string, UserStats>();

    (data || []).forEach((activity: any) => {
      const userId = activity.user_id;
      if (!statsMap.has(userId)) {
        statsMap.set(userId, {
          user_id: userId,
          user_email: activity.users?.email || 'Unknown',
          user_name: activity.users?.full_name || 'Unknown',
          user_role: activity.users?.role || 'unknown',
          total_activities: 0,
          patient_views: 0,
          patient_edits: 0,
          searches: 0,
          last_activity: activity.created_at,
        });
      }

      const stats = statsMap.get(userId)!;
      stats.total_activities++;

      if (activity.activity_type === 'patient_view') stats.patient_views++;
      if (activity.activity_type === 'patient_edit') stats.patient_edits++;
      if (activity.activity_type === 'search') stats.searches++;

      if (new Date(activity.created_at) > new Date(stats.last_activity)) {
        stats.last_activity = activity.created_at;
      }
    });

    const statsArray = Array.from(statsMap.values()).sort(
      (a, b) => b.total_activities - a.total_activities
    );

    setUserStats(statsArray);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'patient_view':
        return <Eye className="h-4 w-4" />;
      case 'patient_edit':
        return <Edit className="h-4 w-4" />;
      case 'search':
        return <Search className="h-4 w-4" />;
      case 'document_view':
      case 'document_download':
        return <FileText className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'patient_view':
        return 'text-blue-600 bg-blue-50';
      case 'patient_edit':
        return 'text-orange-600 bg-orange-50';
      case 'search':
        return 'text-purple-600 bg-purple-50';
      case 'document_view':
      case 'document_download':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatActivityType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading activity data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Activity Dashboard</h2>
          <p className="text-gray-600 mt-1">Monitor all user actions and access patterns</p>
        </div>
        <div className="flex gap-2">
          <Select
            value={timeRange.toString()}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            selectSize="md"
            options={[
              { value: '1', label: 'Last Hour' },
              { value: '24', label: 'Last 24 Hours' },
              { value: '168', label: 'Last Week' },
              { value: '720', label: 'Last 30 Days' },
            ]}
          />
        </div>
      </div>

      {/* User Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userStats.slice(0, 6).map((stats) => (
          <Card
            key={stats.user_id}
            className={`p-4 cursor-pointer transition-all ${
              selectedUser === stats.user_id ? 'ring-2 ring-purple-500' : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedUser(selectedUser === stats.user_id ? null : stats.user_id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{stats.user_name}</h3>
                  <p className="text-xs text-gray-500">{stats.user_role}</p>
                </div>
              </div>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Total Actions</p>
                <p className="font-semibold text-gray-900">{stats.total_activities}</p>
              </div>
              <div>
                <p className="text-gray-500">Patient Views</p>
                <p className="font-semibold text-gray-900">{stats.patient_views}</p>
              </div>
              <div>
                <p className="text-gray-500">Edits</p>
                <p className="font-semibold text-gray-900">{stats.patient_edits}</p>
              </div>
              <div>
                <p className="text-gray-500">Searches</p>
                <p className="font-semibold text-gray-900">{stats.searches}</p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t text-xs text-gray-500">
              Last active: {new Date(stats.last_activity).toLocaleString()}
            </div>
          </Card>
        ))}
      </div>

      {/* Activity Feed */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Activity {selectedUser && '(Filtered)'}
          </h3>
          {selectedUser && (
            <button
              onClick={() => setSelectedUser(null)}
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              Clear Filter
            </button>
          )}
        </div>

        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No activity in the selected time range
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${getActivityColor(activity.activity_type)}`}>
                  {getActivityIcon(activity.activity_type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{activity.user_name}</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-sm text-gray-600">
                      {formatActivityType(activity.activity_type)}
                    </span>
                  </div>

                  {activity.entity_type && (
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.entity_type}: {activity.entity_id}
                    </p>
                  )}

                  {activity.details && (
                    <p className="text-xs text-gray-500 mt-1">
                      {JSON.stringify(activity.details).slice(0, 100)}
                    </p>
                  )}

                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
