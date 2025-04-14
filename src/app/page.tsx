// src/app/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

// Header Component
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
// Hero Section Component
const HeroSection = () => {
  return (
    <section className="relative bg-cover bg-center h-screen flex items-center" 
             style={{ backgroundImage: "url('/images/Hero.png')" }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="container mx-auto px-6 relative z-10 text-white">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Bersama Kita Bantu, Bersama Kita Tumbuh
          </h1>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link href="#what-we-do">
              <Button variant="primary" size="lg">Apa yang Kami Lakukan</Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-0 right-0 flex justify-between px-10 lg:px-20 text-white">
        <div className="text-center">
          <p className="text-xl md:text-2xl font-bold">230</p>
          <p className="text-sm md:text-base">anak dalam asuhan kami</p>
        </div>
        <div className="border-t border-white/30 my-4 flex-grow mx-8 mt-6"></div>
        <div className="text-center">
          <p className="text-xl md:text-2xl font-bold">58</p>
          <p className="text-sm md:text-base">donasi terkumpul</p>
        </div>
      </div>
    </section>
  );
};

// About Section Component
const AboutSection = () => {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2">
            <div className="flex items-center mb-6">
              <div className="w-12 h-px bg-babyBlue-dark mr-4"></div>
              <p className="text-sm uppercase tracking-wider font-semibold text-gray-600">TENTANG KAMI</p>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Menjembatani kepedulian untuk mereka yang membutuhkan
            </h2>
            
            <p className="text-gray-600 mb-6">
              Di bakubantu, kami percaya bahwa kebersamaan adalah kunci perubahan sosial. Kami menghubungkan sumber daya dengan panti asuhan dan komunitas yang membutuhkan di seluruh Indonesia, berfokus pada pemberdayaan berkelanjutan yang berdampak positif.
            </p>
            
            <p className="text-gray-600 mb-8">
              Kami berkolaborasi dengan masyarakat lokal, relawan, dan organisasi mitra untuk memastikan bahwa mereka yang rentan mendapatkan akses pendidikan berkualitas, layanan kesehatan, dan dukungan emosional. Program kami dirancang untuk berkelanjutan dan digerakkan oleh semangat gotong royong.
            </p>
            
            <Link href="#learn-more">
              <Button variant="secondary">Pelajari Lebih Lanjut</Button>
            </Link>
          </div>
          
          <div className="lg:w-1/2">
            <div className="relative rounded-lg overflow-hidden">
              <Image 
                src="/images/about_us_01.jpeg" 
                alt="Children walking together" 
                width={600} 
                height={400} 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Services Section Component
const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-babyBlue-light/20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/2">
            <div className="flex items-center mb-6">
              <div className="w-12 h-px bg-babyBlue-dark mr-4"></div>
              <p className="text-sm uppercase tracking-wider font-semibold text-gray-600">LAYANAN KAMI</p>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Beberapa layanan yang kami berikan untuk anak-anak
            </h2>
            
            <p className="text-gray-600 mb-10">
              Kami menyediakan berbagai layanan untuk memastikan kesejahteraan dan perkembangan anak-anak dalam asuhan kami. Pendekatan holistik kami memenuhi kebutuhan fisik, emosional, dan pendidikan mereka.
            </p>
            
            <div className="space-y-8">
              <div className="flex">
                <div className="flex-shrink-0 h-12 w-12 bg-lavender-light rounded-lg flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-lavender-dark" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Dukungan Keluarga</h3>
                  <p className="text-gray-600">Kami memberikan bimbingan dan sumber daya kepada keluarga anak berkebutuhan khusus, membantu mereka menghadapi tantangan dan mengakses layanan dukungan.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 h-12 w-12 bg-babyBlue-light rounded-lg flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-babyBlue-dark" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Manfaat Kesehatan</h3>
                  <p className="text-gray-600">Pemeriksaan kesehatan rutin, panduan gizi, dan akses ke perawatan medis untuk memastikan kesejahteraan dan perkembangan fisik anak-anak.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 h-12 w-12 bg-poppy-light rounded-lg flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-poppy-dark" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Beasiswa</h3>
                  <p className="text-gray-600">Kami menyediakan kesempatan pendidikan melalui beasiswa, memastikan anak-anak memiliki akses ke pendidikan berkualitas terlepas dari keadaan mereka.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 h-12 w-12 bg-forest-light rounded-lg flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-forest-dark" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Terapi</h3>
                  <p className="text-gray-600">Layanan terapi khusus termasuk fisik, okupasi, dan terapi wicara untuk membantu anak-anak mengembangkan keterampilan dan kemampuan penting.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 flex items-center justify-center">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <Image 
                src="/images/services-learning.jpeg" 
                alt="Anak-anak sedang belajar" 
                width={500} 
                height={600} 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Komponen Bagian Proyek
const ProjectsSection = () => {
  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-6">
        <div className="flex items-center mb-10">
          <div className="w-12 h-px bg-babyBlue-dark mr-4"></div>
          <p className="text-sm uppercase tracking-wider font-semibold text-gray-600">PROYEK YANG TELAH KAMI LAKUKAN</p>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
          Kami menciptakan tempat di mana anak-anak berkebutuhan khusus dapat berkembang
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative rounded-lg overflow-hidden h-96 group">
            <Image 
              src="/images/project-1.jpg" 
              alt="Misi senyum" 
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Misi senyum 1000: Amal di luar ruangan</h3>
              <p className="text-white/80 mb-4">Inisiatif kami untuk membawa kegembiraan dan pengalaman di luar ruangan kepada 1.000 anak di panti asuhan di seluruh Indonesia.</p>
              <Link href="#learn-more">
                <Button variant="outline" size="sm" className="border-white text-white hover:bg-white/10 w-fit">
                  Pelajari lebih lanjut
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative rounded-lg overflow-hidden h-96 group">
            <Image 
              src="/images/project-2.jpg" 
              alt="Kegiatan mingguan" 
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Kegiatan mingguan</h3>
              <p className="text-white/80 mb-4">Kegiatan rutin yang memberikan anak-anak kesempatan pendidikan dan rekreasi di luar lingkungan sehari-hari mereka.</p>
              <Link href="#learn-more">
                <Button variant="outline" size="sm" className="border-white text-white hover:bg-white/10 w-fit">
                  Pelajari lebih lanjut
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative rounded-lg overflow-hidden h-96 group">
            <Image 
              src="/images/project-3.jpg" 
              alt="Kesadaran publik bulanan" 
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Kesadaran publik bulanan</h3>
              <p className="text-white/80 mb-4">Acara dan kampanye publik untuk meningkatkan kesadaran tentang kebutuhan anak-anak yatim piatu dan bagaimana masyarakat dapat mendukung mereka.</p>
              <Link href="#learn-more">
                <Button variant="outline" size="sm" className="border-white text-white hover:bg-white/10 w-fit">
                  Pelajari lebih lanjut
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Komponen Bagian Donasi
const DonationSection = () => {
  return (
    <section className="py-20 bg-black text-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Bagaimana kami menggunakan donasi Anda dan ke mana donasi tersebut dialokasikan
            </h2>
            <p className="text-white/80 mb-8">
              Kami memahami bahwa ketika Anda berdonasi, Anda ingin tahu persis ke mana uang Anda mengalir dan kami berjanji untuk transparan.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-babyBlue rounded-sm mr-2"></div>
                <span>40% panti asuhan</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-lavender rounded-sm mr-2"></div>
                <span>35% program kebersihan</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-mango rounded-sm mr-2"></div>
                <span>10% kegiatan luar</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-poppy rounded-sm mr-2"></div>
                <span>5% memberi makan</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-forest rounded-sm mr-2"></div>
                <span>10% membantu orang</span>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 flex justify-center">
            <div className="w-64 h-64 relative">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#555" strokeWidth="8" />
                {/* 40% panti asuhan */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#9FC4E8" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="150.72" transform="rotate(-90 50 50)" />
                {/* 35% program kebersihan */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#CFA4CC" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="163.28" transform="rotate(54 50 50)" />
                {/* 10% kegiatan luar */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F5AB54" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="226.08" transform="rotate(180 50 50)" />
                {/* 5% memberi makan */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#EE5A36" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="238.64" transform="rotate(216 50 50)" />
                {/* 10% membantu orang */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1A9562" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="226.08" transform="rotate(234 50 50)" />
                <circle cx="50" cy="50" r="20" fill="black" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Komponen Ajakan Bertindak
const CallToActionSection = () => {
  return (
    <section className="relative py-16 bg-cover bg-center" style={{ backgroundImage: "url('/images/cta-background.jpg')" }}>
      <div className="absolute inset-0 bg-black opacity-70"></div>
      <div className="container mx-auto px-6 relative z-10 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Di Sini Torang Bantu Ngoni, Supaya Ngoni Boleh Bantu Yang Laeng!
        </h2>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Button 
            variant="secondary"
            size="lg"
          >
            Bergabung sebagai relawan
          </Button>
          <Button 
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white/10"
          >
            Donasi
          </Button>
        </div>
      </div>
    </section>
  );
};

// Komponen Bagian Acara
const EventsSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-10">Acara Kami</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-mango-light rounded-lg p-6 flex justify-between items-center">
            <div>
              <div className="text-center mb-2">
                <span className="text-3xl font-bold">13</span>
                <p className="text-xs uppercase">APR</p>
              </div>
              <h3 className="text-xl font-semibold mt-4">Sehari bersama anak-anak luar biasa kami</h3>
            </div>
            <div className="bg-white rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          
          <div className="bg-mango-light rounded-lg p-6 flex justify-between items-center">
            <div>
              <div className="text-center mb-2">
                <span className="text-3xl font-bold">25</span>
                <p className="text-xs uppercase">APR</p>
              </div>
              <h3 className="text-xl font-semibold mt-4">Seminar: Merawat anak-anak dengan autisme</h3>
            </div>
            <div className="bg-white rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Komponen Footer
const Footer = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-gray-800">
          <div>
            <h2 className="text-2xl font-medium mb-6">
              baku<span className="font-bold text-babyBlue">bantu</span>
            </h2>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Beranda</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white">Beranda</Link></li>
              <li><Link href="#about" className="text-gray-400 hover:text-white">Tentang kami</Link></li>
              <li><Link href="#team" className="text-gray-400 hover:text-white">Tim</Link></li>
              <li><Link href="#what-we-do" className="text-gray-400 hover:text-white">Yang kami lakukan</Link></li>
              <li><Link href="#contact" className="text-gray-400 hover:text-white">Kontak</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Lainnya</h3>
            <ul className="space-y-2">
              <li><Link href="#projects" className="text-gray-400 hover:text-white">Proyek</Link></li>
              <li><Link href="#events" className="text-gray-400 hover:text-white">Acara</Link></li>
              <li><Link href="#donate" className="text-gray-400 hover:text-white">Donasi</Link></li>
              <li><Link href="#blog" className="text-gray-400 hover:text-white">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Terhubung</h3>
            <ul className="space-y-2">
              <li><Link href="#facebook" className="text-gray-400 hover:text-white">Facebook</Link></li>
              <li><Link href="#instagram" className="text-gray-400 hover:text-white">Instagram</Link></li>
              <li><Link href="#twitter" className="text-gray-400 hover:text-white">Twitter</Link></li>
              <li><Link href="#linkedin" className="text-gray-400 hover:text-white">Linkedin</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-10 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold mb-4">Berlangganan untuk mendapatkan pembaruan terbaru</h3>
          </div>
          
          <div className="flex w-full md:w-auto">
            <input 
              type="email" 
              placeholder="Email Anda" 
              className="bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-l-md w-full md:w-64 focus:outline-none focus:ring-1 focus:ring-babyBlue"
            />
            <button className="bg-white text-black px-6 py-2 rounded-r-md font-medium">
              Berlangganan
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Komponen Halaman Utama
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <DonationSection />
        <CallToActionSection />
        <EventsSection />
      </main>
      <Footer />
    </div>
  )};