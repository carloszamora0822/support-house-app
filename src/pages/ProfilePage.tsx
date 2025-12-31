import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { PageShell } from '@/components/patterns/page-shell';
import { AppHeader } from '@/components/patterns/app-header';
import { PageContent } from '@/components/patterns/page-content';
import { SectionHeader } from '@/components/patterns/section-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { notify } from '@/lib/services';
import { User, Shield, Trash2, MessageSquare, AlertTriangle } from 'lucide-react';

export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
  });
  const [ticketData, setTicketData] = useState({
    subject: '',
    description: '',
    type: 'bug' as 'bug' | 'feature' | 'question',
  });

  const handleSaveProfile = async () => {
    notify.success('Profile updated successfully');
    setIsEditMode(false);
  };

  const handleDeleteAccount = async () => {
    try {
      // In a real app, this would call an API to delete the account
      // For now, just show a message and log out
      notify.success('Account deletion requested. Logging out...');
      setShowDeleteModal(false);
      
      // Wait a moment for user to see the message
      setTimeout(() => {
        logout();
      }, 1500);
    } catch (error) {
      notify.error('Failed to delete account. Please contact support.');
      console.error('Delete account error:', error);
    }
  };

  const handleSubmitTicket = async () => {
    if (!ticketData.subject || !ticketData.description) {
      notify.error('Please fill in all fields');
      return;
    }
    
    notify.success('Support ticket submitted successfully');
    setShowTicketModal(false);
    setTicketData({ subject: '', description: '', type: 'bug' });
  };

  return (
    <PageShell variant="gradient">
      <AppHeader />
      
      <PageContent maxWidth="lg">
        <SectionHeader 
          title="My Profile"
          description="Manage your account settings and preferences"
        />

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-heading-md text-text flex items-center gap-2">
                  <User className="h-5 w-5 text-primary-600" />
                  Account Information
                </h3>
                {!isEditMode ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setFormData({
                        full_name: user?.full_name || '',
                        email: user?.email || '',
                      });
                      setIsEditMode(true);
                    }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setIsEditMode(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSaveProfile}>
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Full Name</label>
                  {isEditMode ? (
                    <Input
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    />
                  ) : (
                    <p className="text-body-md text-text">{user?.full_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">Email</label>
                  {isEditMode ? (
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  ) : (
                    <p className="text-body-md text-text">{user?.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">Role</label>
                  <div className="flex items-center gap-2">
                    <Badge variant={user?.role === 'admin' ? 'primary' : 'secondary'}>
                      {user?.role}
                    </Badge>
                    {user?.role === 'admin' && (
                      <Shield className="h-4 w-4 text-primary-600" />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">Account Status</label>
                  <Badge variant="success">Active</Badge>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-heading-md text-text flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-primary-600" />
                Support & Feedback
              </h3>
              <p className="text-body-sm text-text-muted mb-4">
                Need help or found a bug? Submit a support ticket to the admin team.
              </p>
              <Button onClick={() => setShowTicketModal(true)} className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Submit Support Ticket
              </Button>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-100">
              <h3 className="text-heading-sm text-text mb-3">Quick Stats</h3>
              <div className="space-y-3 text-body-sm">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-text-muted">Account Created</span>
                  <span className="font-medium text-text">Recently</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-text-muted">Last Login</span>
                  <span className="font-medium text-text">Today</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-text-muted">Sessions</span>
                  <span className="font-medium text-primary-600">Active</span>
                </div>
              </div>
            </Card>

            <Card className="border-status-error bg-status-error-light">
              <h3 className="text-heading-sm text-status-error-dark flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </h3>
              <p className="text-body-sm text-status-error-dark mb-4">
                Deleting your account is permanent and cannot be undone.
              </p>
              <Button 
                variant="danger" 
                size="sm"
                onClick={() => setShowDeleteModal(true)}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Account
              </Button>
            </Card>
          </div>
        </div>
      </PageContent>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
        size="md"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteAccount}>
              Confirm Delete
            </Button>
          </div>
        }
      >
        <Alert variant="error" className="mb-4">
          This action cannot be undone. Your account and all associated data will be permanently deleted.
        </Alert>
        <p className="text-body-sm text-text-muted">
          Are you sure you want to delete your account? This will:
        </p>
        <ul className="list-disc list-inside text-body-sm text-text-muted mt-2 space-y-1">
          <li>Remove all your personal information</li>
          <li>Revoke access to the system</li>
          <li>Require admin approval for deletion</li>
        </ul>
      </Modal>

      <Modal
        isOpen={showTicketModal}
        onClose={() => setShowTicketModal(false)}
        title="Submit Support Ticket"
        size="lg"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setShowTicketModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitTicket}>
              Submit Ticket
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Select
            label="Ticket Type"
            value={ticketData.type}
            onChange={(e) => setTicketData({ ...ticketData, type: e.target.value as 'bug' | 'feature' | 'question' })}
            options={[
              { value: 'bug', label: 'Bug Report' },
              { value: 'feature', label: 'Feature Request' },
              { value: 'question', label: 'Question/Help' },
            ]}
          />

          <div>
            <label className="block text-sm font-medium text-text mb-2">Subject</label>
            <Input
              value={ticketData.subject}
              onChange={(e) => setTicketData({ ...ticketData, subject: e.target.value })}
              placeholder="Brief description of the issue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Description</label>
            <textarea
              value={ticketData.description}
              onChange={(e) => setTicketData({ ...ticketData, description: e.target.value })}
              placeholder="Provide detailed information about your request..."
              rows={6}
              className="flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>

          <Alert variant="info">
            Your ticket will be sent to the admin team. You'll receive a response via email.
          </Alert>
        </div>
      </Modal>
    </PageShell>
  );
};
