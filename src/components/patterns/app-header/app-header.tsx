import { memo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Heart, Home, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface AppHeaderProps {
  className?: string;
  showBackToDashboard?: boolean;
}

export const AppHeader = memo(({ className, showBackToDashboard = true }: AppHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const isDashboard = location.pathname === '/dashboard';

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  const handleNavigateDashboard = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  const handleNavigateProfile = useCallback(() => {
    navigate('/profile');
  }, [navigate]);

  const handleNavigateAdmin = useCallback(() => {
    navigate('/admin');
  }, [navigate]);

  return (
    <nav className={cn(
      'bg-white/80 backdrop-blur-sm shadow-sm border-b border-purple-100 sticky top-0 z-40',
      className
    )}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between h-14 sm:h-16 items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
            <button
              onClick={handleNavigateDashboard}
              className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity flex-shrink-0"
            >
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent hidden xs:block truncate">
                Support House
              </h1>
            </button>
            
            {!isDashboard && showBackToDashboard && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNavigateDashboard}
                className="gap-1.5 sm:gap-2 hidden sm:flex"
              >
                <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNavigateProfile}
              className="gap-1.5 sm:gap-2 px-2 sm:px-3"
            >
              <User className="h-4 w-4" />
              <span className="hidden lg:inline">Profile</span>
            </Button>
            
            {user?.role === 'admin' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNavigateAdmin}
                className="gap-1.5 sm:gap-2 px-2 sm:px-3"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden lg:inline">Admin</span>
              </Button>
            )}
            
            <div className="text-right hidden xl:block">
              <p className="text-sm font-medium text-text truncate max-w-[150px]">{user?.full_name}</p>
              <p className="text-xs text-primary-600 capitalize">{user?.role}</p>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="border-purple-200 hover:bg-purple-50 px-2 sm:px-3"
            >
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Exit</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
});

AppHeader.displayName = 'AppHeader';
