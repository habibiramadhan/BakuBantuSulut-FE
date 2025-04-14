// src/components/common/Footer.tsx
import React from 'react';
import Link from 'next/link';

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
      </div>
    </footer>
  );
};

export default Footer;