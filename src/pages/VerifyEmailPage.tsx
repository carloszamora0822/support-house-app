import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Supabase automatically handles email verification via the URL hash
        // We just need to check if the user is now verified
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session?.user) {
          // Email verified! Now mark as verified in pending_users table
          const { error: updateError } = await supabase
            .from('pending_users')
            .update({ email_verified: true })
            .eq('email', session.user.email);

          if (updateError) {
            console.error('Error updating pending user:', updateError);
          }

          setStatus('success');
          setMessage('Email verified successfully!');

          // Sign out the user (they need admin approval before they can actually use the app)
          await supabase.auth.signOut();
        } else {
          setStatus('error');
          setMessage('Verification failed. Please try again.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('Verification failed. Please try again.');
      }
    };

    verifyEmail();
  }, []);

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
          <div className="text-center">
            {status === 'verifying' && (
              <>
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Email...</h2>
                <p className="text-gray-600">Please wait while we verify your email address.</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
                <p className="text-gray-600 mb-4">{message}</p>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-purple-800">
                    <strong>Next Step:</strong> Your registration is now pending admin approval. 
                    You'll receive an email notification once your account is approved.
                  </p>
                </div>
                <Button
                  onClick={() => navigate('/login')}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Go to Login
                </Button>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="text-6xl mb-4">❌</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="space-y-3">
                  <Button
                    onClick={() => navigate('/register')}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Try Registering Again
                  </Button>
                  <Button
                    onClick={() => navigate('/login')}
                    variant="outline"
                    className="w-full"
                  >
                    Back to Login
                  </Button>
                </div>
              </>
            )}
          </div>
        </Card>
        
        <p className="mt-6 text-center text-sm text-purple-600">
          💜 Caring for those who need it most
        </p>
      </div>
    </div>
  );
}
