// src/app/login/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { login, setAuthData, isAuthenticated } from '@/services/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await login({ email, password });
      // Store auth data in localStorage
      setAuthData(response.data.token, response.data.user);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex flex-col justify-center px-8 md:px-16 w-full lg:w-1/2">
        <div className="max-w-md mx-auto w-full">
          {/* Header dengan teks bakubantu */}
          <div className="mb-12">
            <h1 className="text-3xl font-medium">
              baku<span className="font-bold">bantu</span>
            </h1>
          </div>

          {/* Login Form */}
          <div className="mb-8">
             <h1 className="text-3xl font-bold text-gray-900 mb-3">Login</h1>
             <p className="text-gray-600">Log in to your baku<strong>bantu</strong> account and continue spreading kindness</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@gmail.com"
                required
                disabled={isLoading}
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••••••"
                showPasswordToggle
                required
                disabled={isLoading}
              />

              <div className="flex items-center justify-between">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  label="Remember me"
                  disabled={isLoading}
                />
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-poppy hover:text-poppy-light"
                >
                  Forgot Password
                </Link>
              </div>

              <Button 
                type="submit" 
                size="full" 
                variant="primary"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Image Section - Only visible on large screens */}
      <div className="hidden lg:block lg:w-1/2 bg-pink-50">
        <div className="flex h-full items-center justify-center p-12">
          <Image
            src="/images/logo_01.png"
            alt="Login secure illustration"
            width={600}
            height={600}
            className="max-w-full h-auto"
            priority
          />
        </div>
      </div>
    </div>
  );
}