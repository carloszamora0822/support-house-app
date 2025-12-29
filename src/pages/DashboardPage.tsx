import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';

export const DashboardPage = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold text-gray-900">Support House Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {user?.full_name} ({user?.role})
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome!</h3>
            <p className="text-gray-600">
              Sprint 1 foundation is complete. Patient search, check-in, and intake features coming in future sprints.
            </p>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Stats</h3>
            <p className="text-gray-600">Analytics dashboard coming in Sprint 6</p>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Recent Activity</h3>
            <p className="text-gray-600">Visit history coming in Sprint 3</p>
          </Card>
        </div>
      </main>
    </div>
  );
};
