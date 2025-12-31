import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { User } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: User['role'][];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  // DEBUG: Log user and role check
  console.log('🔐 ProtectedRoute check:', {
    user: user ? { email: user.email, role: user.role } : null,
    allowedRoles,
    isLoading,
    hasAccess: allowedRoles ? allowedRoles.includes(user?.role || '') : true
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.error('❌ Access denied:', {
      userRole: user.role,
      allowedRoles,
      userEmail: user.email
    });
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You do not have permission to view this page.</p>
          <p className="text-sm text-gray-500 mt-4">Your role: {user.role}</p>
          <p className="text-sm text-gray-500">Required: {allowedRoles.join(', ')}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
