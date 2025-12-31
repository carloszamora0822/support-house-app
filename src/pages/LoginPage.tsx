import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { PageShell } from '@/components/patterns/page-shell';
import { Card } from '@/components/ui/card';
import { Heart } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (credentials: { email: string; password: string }) => {
    await login(credentials);
    navigate('/dashboard');
  };

  return (
    <PageShell variant="gradient">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl mb-4 shadow-lg">
              <Heart className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-display-md bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Support House
            </h1>
            <p className="mt-2 text-body-sm text-primary-600 font-medium">Patient Management System</p>
          </div>
          
          <Card className="shadow-xl border-purple-100">
            <h2 className="text-heading-lg text-text mb-6">Welcome back! 👋</h2>
            <LoginForm onSubmit={handleLogin} />
          </Card>
          
          <p className="mt-6 text-center text-body-sm text-primary-600">
            💜 Caring for those who need it most
          </p>
        </div>
      </div>
    </PageShell>
  );
};
