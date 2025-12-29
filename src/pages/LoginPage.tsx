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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl mb-4 shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Support House
          </h1>
          <p className="mt-2 text-sm text-purple-600 font-medium">Patient Management System</p>
        </div>
        
        <Card className="shadow-xl border-purple-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Welcome back! 👋</h2>
          <LoginForm onSubmit={handleLogin} />
        </Card>
        
        <p className="mt-6 text-center text-sm text-purple-600">
          💜 Caring for those who need it most
        </p>
      </div>
    </div>
  );
};
