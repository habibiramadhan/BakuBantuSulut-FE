// src/hooks/useLogin.ts
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginHookReturn {
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials, rememberMe?: boolean) => Promise<boolean>;
  clearError: () => void;
}

export function useLogin(): LoginHookReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const toast = useToast();
  const { login: contextLogin } = useAuth();

  const login = useCallback(
    async (credentials: LoginCredentials, rememberMe = false): Promise<boolean> => {
      try {
        setIsLoading(true);
        setError(null);

        // Validate inputs
        if (!credentials.email?.trim()) {
          setError('Email is required');
          toast.error('Email is required');
          return false;
        }

        if (!credentials.password) {
          setError('Password is required');
          toast.error('Password is required');
          return false;
        }

        // Call our new API endpoint
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...credentials,
            rememberMe
          }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }
        
        // Update auth context with user data
        contextLogin(data.data.user);
        
        // Store user info in localStorage for client access
        localStorage.setItem('user_info', JSON.stringify(data.data.user));
        
        // Show success message
        toast.success('Login successful!', 'Welcome back');
        
        // Redirect to dashboard
        router.push('/dashboard');
        
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Login failed';
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [contextLogin, toast, router]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    login,
    clearError,
  };
}