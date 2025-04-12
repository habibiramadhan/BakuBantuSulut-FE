// src/app/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/services/auth';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-2">
          baku<span className="font-extrabold">bantu</span>
        </h1>
        <p className="text-gray-600 mb-8">Connect and help your community</p>
        
        <div className="space-y-4">
          <Link href="/login">
            <Button variant="primary" size="full">
              Log in
            </Button>
          </Link>
          
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Link href="/register" className="text-babyBlue font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}