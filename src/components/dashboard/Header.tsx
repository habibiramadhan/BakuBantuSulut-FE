// src/components/dashboard/Header.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { logout, getUser } from '@/services/auth';
import { Button } from '@/components/ui/Button';

const Header = () => {
  const router = useRouter();
  const user = getUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <h1 className="text-xl font-medium">
                baku<span className="font-bold">bantu</span>
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/dashboard" className="text-gray-700 px-3 py-2 rounded-md hover:bg-gray-100">
              Dashboard
            </Link>
          </nav>

          {/* Profile Dropdown */}
          <div className="relative">
            <div className="flex items-center">
              <button
                type="button"
                className="flex items-center space-x-3"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-700">{user?.username}</span>
                  <span className="text-xs text-gray-500">{user?.role}</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-babyBlue-light flex items-center justify-center text-babyBlue-dark font-medium">
                  {user?.username?.charAt(0)}
                </div>
              </button>
            </div>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                <Link 
                  href="/dashboard/profile" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Your Profile
                </Link>
                <div 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                >
                  Sign out
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                className="h-6 w-6"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-2 border-t border-gray-200">
            <Link 
              href="/dashboard" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <div 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setIsMenuOpen(false);
                handleLogout();
              }}
            >
              Sign out
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;