// src/contexts/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User, getUser, isAuthenticated, hasPermission as checkPermission } from '@/services/auth';
import { useToast } from './ToastContext';
import { Loading } from '@/components/ui/Loading';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  hasPermission: (role: 'ADMIN' | 'SUPERADMIN') => boolean;
  refreshUserData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();

  // Check authentication on mount and path changes
  useEffect(() => {
    checkAuth();
  }, [pathname]);

  // Set up periodic checks for auth status (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      // Only do a silent check, don't update loading state
      const isAuth = isAuthenticated();
      if (!isAuth && authStatus) {
        // If user was authenticated but now isn't, update state
        setUser(null);
        setAuthStatus(false);
        
        // Only redirect if on a protected route
        if (pathname?.startsWith('/dashboard')) {
          toast.warning('Your session has expired. Please login again.');
          router.push('/login');
        }
      }
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(interval);
  }, [authStatus, pathname, router, toast]);

  const checkAuth = () => {
    setIsLoading(true);
    
    if (isAuthenticated()) {
      const userData = getUser();
      setUser(userData);
      setAuthStatus(true);
    } else {
      setUser(null);
      setAuthStatus(false);
      
      // Redirect to login if accessing protected route
      if (pathname?.startsWith('/dashboard')) {
        router.push('/login');
      }
    }
    
    setIsLoading(false);
  };

  const handleLogin = (userData: User) => {
    // Update states
    setUser(userData);
    setAuthStatus(true);
    
    // Store user info in localStorage for client access
    localStorage.setItem('user_info', JSON.stringify(userData));
  };

  const handleLogout = () => {
    // Call the logout API endpoint
    fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(() => {
      // Clear localStorage data
      localStorage.removeItem('user_info');
      
      // Update state
      setUser(null);
      setAuthStatus(false);
      
      // Show success message
      toast.success('You have been successfully logged out');
      
      // Redirect to login
      router.push('/login');
    }).catch(error => {
      console.error('Logout error:', error);
      toast.error('Error during logout. Please try again.');
      
      // Even if the API call fails, clear client-side state
      localStorage.removeItem('user_info');
      setUser(null);
      setAuthStatus(false);
      router.push('/login');
    });
  };

  const hasPermission = (requiredRole: 'ADMIN' | 'SUPERADMIN'): boolean => {
    return checkPermission(requiredRole);
  };
  
  const refreshUserData = () => {
    if (isAuthenticated()) {
      const userData = getUser();
      setUser(userData);
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: authStatus,
        login: handleLogin,
        logout: handleLogout,
        hasPermission,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}