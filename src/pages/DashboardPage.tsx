import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const quickActions = [
    {
      title: 'Patient Search',
      description: 'Search for existing patients',
      icon: '🔍',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-white to-purple-50',
      available: true,
      route: '/search'
    },
    {
      title: 'New Patient Intake',
      description: 'Register a new patient',
      icon: '📝',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'from-white to-pink-50',
      available: true,
      route: '/intake',
      badge: '✨ Sprint 4'
    },
    {
      title: 'Check-In Patient',
      description: 'Search for patient, then check them in',
      icon: '✅',
      color: 'from-accent-500 to-accent-600',
      bgColor: 'from-white to-accent-50',
      available: true,
      route: '/search',
      badge: '✨ Sprint 3'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Support House
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                <p className="text-xs text-purple-600 capitalize">{user?.role}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="border-purple-200 hover:bg-purple-50">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.full_name?.split(' ')[0]}! 👋</h2>
          <p className="text-purple-600">What would you like to do today?</p>
          <p className="text-sm text-purple-500 mt-2">🚧 MVP Dashboard - Full analytics coming in future sprint</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {quickActions.map((action) => (
            <Card 
              key={action.title}
              onClick={() => action.available && action.route && navigate(action.route)}
              className={`border-purple-100 transition-all bg-gradient-to-br ${action.bgColor} ${
                action.available 
                  ? 'hover:shadow-lg cursor-pointer hover:-translate-y-1' 
                  : 'opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 bg-gradient-to-br ${action.color} rounded-xl shadow-md`}>
                  <span className="text-3xl">{action.icon}</span>
                </div>
                {!action.available && action.comingSoon && (
                  <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                    {action.comingSoon}
                  </span>
                )}
                {action.available && action.badge && (
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                    {action.badge}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-purple-100 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">📋</span>
              System Information
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Database Status</span>
                <span className="font-medium text-green-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Connected
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Your Role</span>
                <span className="font-medium text-purple-600 capitalize">{user?.role}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Account Status</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
            </div>
          </Card>

          <Card className="border-purple-100 bg-gradient-to-br from-white to-purple-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              Coming Soon
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">▸</span>
                <div>
                  <span className="font-medium text-gray-900">Patient Search & Lookup</span>
                  <p className="text-gray-600 text-xs mt-0.5">Find patients by name, phone, or ID</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">▸</span>
                <div>
                  <span className="font-medium text-gray-900">Quick Check-In</span>
                  <p className="text-gray-600 text-xs mt-0.5">Fast patient check-in with assistance tracking</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">▸</span>
                <div>
                  <span className="font-medium text-gray-900">Multi-Step Intake Forms</span>
                  <p className="text-gray-600 text-xs mt-0.5">Complete patient registration workflow</p>
                </div>
              </li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
};
