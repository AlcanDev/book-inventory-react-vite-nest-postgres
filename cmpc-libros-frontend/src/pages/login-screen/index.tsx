import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoginHeader from './components/LoginHeader';
import LoginBackground from './components/LoginBackground';
import LoginForm from './components/LoginForm';

const LoginScreen = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (isAuthenticated && !isLoading) {
      navigate('/inventory', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <LoginHeader />
      
      <LoginBackground>
        <main className="flex items-center justify-center min-h-screen pt-16 pb-20 px-4">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </main>
      </LoginBackground>
    </div>
  );
};

export default LoginScreen;