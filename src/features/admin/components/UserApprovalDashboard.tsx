import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Clock, Mail, Phone, Calendar } from 'lucide-react';

interface PendingUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  phone?: string;
  volunteer_start_date?: string;
  notes?: string;
  email_verified: boolean;
  status: string;
  created_at: string;
}

export function UserApprovalDashboard() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    loadCurrentUser();
    loadPendingUsers();
  }, []);

  const loadCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      setCurrentUser(data);
    }
  };

  const loadPendingUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pending_users')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingUsers(data || []);
    } catch (error) {
      console.error('Error loading pending users:', error);
      toast.error('Failed to load pending users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (pendingUserId: string, userEmail: string) => {
    if (!currentUser) {
      toast.error('You must be logged in as admin');
      return;
    }

    const confirmed = window.confirm(
      `Approve user ${userEmail}? They will be able to log in immediately.`
    );

    if (!confirmed) return;

    try {
      // In production, you'd create the Supabase Auth user here via Admin API
      // For now, we'll just update the database
      const { data, error } = await supabase.rpc('approve_user', {
        pending_user_id: pendingUserId,
        admin_user_id: currentUser.id,
        initial_password: 'temp_password_123', // In production, send password reset email
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string };

      if (!result.success) {
        toast.error(result.error || 'Approval failed');
        return;
      }

      toast.success('User approved! They can now log in.');
      loadPendingUsers(); // Refresh list
    } catch (error) {
      console.error('Error approving user:', error);
      toast.error('Failed to approve user');
    }
  };

  const handleReject = async (pendingUserId: string, userEmail: string) => {
    if (!currentUser) {
      toast.error('You must be logged in as admin');
      return;
    }

    const reason = window.prompt(
      `Reject user ${userEmail}?\n\nPlease provide a reason (optional):`
    );

    if (reason === null) return; // User cancelled

    try {
      const { data, error } = await supabase.rpc('reject_user', {
        pending_user_id: pendingUserId,
        admin_user_id: currentUser.id,
        reason: reason || 'No reason provided',
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string };

      if (!result.success) {
        toast.error(result.error || 'Rejection failed');
        return;
      }

      toast.success('User registration rejected');
      loadPendingUsers(); // Refresh list
    } catch (error) {
      console.error('Error rejecting user:', error);
      toast.error('Failed to reject user');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading pending users...</div>
      </div>
    );
  }

  if (pendingUsers.length === 0) {
    return (
      <Card className="p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
        <p className="text-gray-600">No pending user registrations at this time.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pending User Approvals</h2>
          <p className="text-gray-600 mt-1">
            {pendingUsers.length} user{pendingUsers.length !== 1 ? 's' : ''} awaiting approval
          </p>
        </div>
        <Button onClick={loadPendingUsers} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {pendingUsers.map((user) => (
          <Card key={user.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{user.full_name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.role === 'staff' 
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                  {user.email_verified ? (
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      Email Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-orange-600">
                      <Clock className="h-4 w-4" />
                      Email Not Verified
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  
                  {user.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  
                  {user.volunteer_start_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Start Date: {new Date(user.volunteer_start_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  {user.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
                      <p className="text-sm text-gray-600">{user.notes}</p>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 mt-2">
                    Registered: {new Date(user.created_at).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <Button
                  onClick={() => handleApprove(user.id, user.email)}
                  disabled={!user.email_verified}
                  className="bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleReject(user.id, user.email)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
            </div>

            {!user.email_verified && (
              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
                <p className="text-sm text-orange-800">
                  ⚠️ User must verify their email before you can approve their account.
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
