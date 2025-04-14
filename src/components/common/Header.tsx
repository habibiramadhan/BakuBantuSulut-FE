// src/components/common/Header.tsx
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/80 backdrop-blur-md py-4'}`}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <h1 className="text-2xl font-medium text-gray-900 transition-all duration-300 
                             group-hover:scale-105 transform origin-left">
                baku<span className="font-bold text-babyBlue-dark">bantu</span>
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            <Link href="/" className="px-4 py-2 text-gray-700 hover:text-babyBlue-dark hover:bg-babyBlue-light/20 rounded-md transition-all duration-200">
              Beranda
            </Link>
            <Link href="#about" className="px-4 py-2 text-gray-700 hover:text-babyBlue-dark hover:bg-babyBlue-light/20 rounded-md transition-all duration-200">
              Tentang Kami
            </Link>
            <Link href="#services" className="px-4 py-2 text-gray-700 hover:text-babyBlue-dark hover:bg-babyBlue-light/20 rounded-md transition-all duration-200">
              Layanan
            </Link>
            <Link href="#projects" className="px-4 py-2 text-gray-700 hover:text-babyBlue-dark hover:bg-babyBlue-light/20 rounded-md transition-all duration-200">
              Media
            </Link>
            <Link href="#contact" className="px-4 py-2 text-gray-700 hover:text-babyBlue-dark hover:bg-babyBlue-light/20 rounded-md transition-all duration-200">
              Kontak
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-babyBlue-dark hover:bg-babyBlue-light/20 transition-colors"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Buka menu utama</span>
              <svg
                className={`h-6 w-6 ${isMenuOpen ? 'hidden' : 'block'}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`h-6 w-6 ${isMenuOpen ? 'block' : 'hidden'}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-80' : 'max-h-0'}`}>
        <div className="px-4 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md shadow-inner">
          <Link href="/" className="block px-3 py-2 text-gray-700 rounded-md hover:bg-babyBlue-light/30 hover:text-babyBlue-dark">Beranda</Link>
          <Link href="#about" className="block px-3 py-2 text-gray-700 rounded-md hover:bg-babyBlue-light/30 hover:text-babyBlue-dark">Tentang Kami</Link>
          <Link href="#services" className="block px-3 py-2 text-gray-700 rounded-md hover:bg-babyBlue-light/30 hover:text-babyBlue-dark">Layanan</Link>
          <Link href="#projects" className="block px-3 py-2 text-gray-700 rounded-md hover:bg-babyBlue-light/30 hover:text-babyBlue-dark">Media</Link>
          <Link href="#contact" className="block px-3 py-2 text-gray-700 rounded-md hover:bg-babyBlue-light/30 hover:text-babyBlue-dark">Kontak</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;