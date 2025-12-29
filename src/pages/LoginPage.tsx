import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Card } from '@/components/common/Card';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (credentials: { email: string; password: string }) => {
    await login(credentials);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Support House</h1>
          <p className="mt-2 text-sm text-gray-600">Patient Management System</p>
        </div>
        
        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Sign in to your account</h2>
          <LoginForm onSubmit={handleLogin} />
        </Card>
      </div>
    </div>
  );
};
