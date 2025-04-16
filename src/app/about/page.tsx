// src/app/about/page.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import { Header, Footer} from '@/components/common';
import { Button } from '@/components/ui/Button';

// Hero Section Component with enhanced styling
const AboutHero = () => {
    return (
      <section className="relative py-24 bg-gradient-to-br from-babyBlue-light/30 to-lavender-light/30 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-mango-light/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-poppy-light/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8 items-start">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-px bg-poppy mr-4"></div>
                <p className="text-sm uppercase tracking-wider font-semibold text-poppy-dark">TENTANG KAMI</p>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
                Kami adalah organisasi <span className="text-babyBlue-dark">non-pemerintah</span> yang fokus pada <span className="text-poppy">komunitas</span>
              </h1>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold mb-3 text-forest-dark">Kami membantu menghubungkan sumber daya dengan mereka yang membutuhkan</h2>
              <p className="text-gray-600 mb-4">
                BakuBantu hadir untuk menjembatani kepedulian masyarakat dengan kebutuhan nyata di lapangan. Kami percaya pada kekuatan kolaborasi dan gotong royong untuk menciptakan dampak positif yang berkelanjutan di Sulawesi Utara.
              </p>
              <div className="mt-8">
                <Button 
                  variant="primary" 
                  leftIcon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  }
                >
                  Tonton Video Kami
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };
  

// Video Section Component with enhanced styling
const VideoSection = () => {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute left-0 top-1/4 w-64 h-64 bg-mango/10 rounded-full blur-3xl"></div>
      <div className="absolute right-0 bottom-1/4 w-64 h-64 bg-babyBlue/10 rounded-full blur-3xl"></div>
      <div className="container mx-auto px-6 relative">
        <div className="relative rounded-2xl overflow-hidden shadow-xl">
          <div className="aspect-w-16 aspect-h-9 h-[500px]">
            <Image 
              src="/images/cta-background.jpeg" 
              alt="Misi kami dalam aksi"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40 flex items-center justify-center">
              <button 
                className="group w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
                aria-label="Putar video"
              >
                <div className="w-20 h-20 rounded-full bg-poppy flex items-center justify-center group-hover:bg-poppy-dark transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-3xl mx-auto text-center mt-12">
          <div className="inline-block mb-4">
            <div className="flex items-center justify-center">
              <div className="w-12 h-px bg-mango mr-4"></div>
              <h2 className="text-3xl font-bold text-gray-900">Cerita Kami</h2>
              <div className="w-12 h-px bg-mango ml-4"></div>
            </div>
          </div>
          <p className="text-gray-600 text-lg">
            Pada tahun 2024, Baku Bantu memulai proyek pertama yaitu melakukan Survei Kebutuhan Panti di Kota Tomohon, Kabupaten Minahasa, dan Kabupaten Minahasa Selatan. Survei dilakukan oleh tim berisikan 16 relawan dari berbagai komunitas.
          </p>
        </div>
      </div>
    </section>
  );
};

// Mission & Vision Section with enhanced styling
const MissionVision = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-white to-babyBlue-light/30 relative overflow-hidden">
      <div className="absolute right-0 bottom-0 w-96 h-96 bg-lavender/10 rounded-full blur-3xl"></div>
      <div className="container mx-auto px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-babyBlue transform hover:-translate-y-2 transition-transform duration-300">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-babyBlue-light mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-babyBlue-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold uppercase mb-4 text-babyBlue-dark">MISI KAMI</h3>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Membangun Dampak Sosial yang Efektif
            </h2>
            <div className="space-y-4 text-gray-600">
              <div className="flex">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-babyBlue-light flex items-center justify-center mr-3">
                  <span className="font-bold text-babyBlue-dark">1</span>
                </div>
                <p>Mengidentifikasi dan menganalisis masalah-masalah sosial yang dihadapi oleh kelompok masyarakat yang rentan di Sulawesi Utara</p>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-babyBlue-light flex items-center justify-center mr-3">
                  <span className="font-bold text-babyBlue-dark">2</span>
                </div>
                <p>Merancang aksi respon terhadap masalah-masalah sosial yang ditemukan dalam proses identifikasi dan analisis</p>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-babyBlue-light flex items-center justify-center mr-3">
                  <span className="font-bold text-babyBlue-dark">3</span>
                </div>
                <p>Mempopulerkan aksi sosial yang efektif, bertanggungjawab, dan berlandaskan etika moral</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-lavender transform hover:-translate-y-2 transition-transform duration-300">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-lavender-light mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-lavender-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold uppercase mb-4 text-lavender-dark">VISI KAMI</h3>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Menjadi Katalisator Dampak Sosial yang Efektif
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600 border-l-2 border-lavender-light pl-4">
                Kami bercita-cita menjadi katalisator dampak sosial yang penuh arti dan efektif di Sulawesi Utara, dengan pendekatan berbasis data dan berlandaskan empati.
              </p>
              <p className="text-gray-600 border-l-2 border-lavender-light pl-4">
                &ldquo;Sitou timou tumou tou&rdquo; menjadi pendorong kami untuk percaya bahwa manusia diciptakan untuk hidup berdampingan dan saling membantu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Team Section Component with enhanced styling
const TeamSection = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Leonard John Davies",
      position: "Pendiri, CEO",
      image: "/images/example-profile-01.jpeg",
      socials: {
        facebook: "#",
        twitter: "#",
        linkedin: "#"
      }
    },
    {
      id: 2,
      name: "Francis Weber", 
      position: "Wakil Ketua",
      image: "/images/example-profile-02.jpeg",
      socials: {
        facebook: "#",
        twitter: "#",
        linkedin: "#"
      }
    },
    {
      id: 3,
      name: "Kyla O'brien",
      position: "Kepala Otoritas",
      image: "/images/example-profile-01.jpeg",
      socials: {
        facebook: "#",
        twitter: "#",
        linkedin: "#"
      }
    },
    {
      id: 4,
      name: "Adrian Dixon",
      position: "Eksekutif Pendukung",
      image: "/images/example-profile-02.jpeg",
      socials: {
        facebook: "#",
        twitter: "#",
        linkedin: "#"
      }
    },
    {
      id: 5,
      name: "Freddy Busby",
      position: "Manajer Proyek",
      image: "/images/example-profile-01.jpeg",
      socials: {
        facebook: "#",
        twitter: "#",
        linkedin: "#"
      }
    },
    {
      id: 6,
      name: "Dale Banks",
      position: "Akuntan, Keuangan",
      image: "/images/example-profile-02.jpeg",
      socials: {
        facebook: "#",
        twitter: "#",
        linkedin: "#"
      }
    },
    {
      id: 7,
      name: "Miriam Middleton",
      position: "Pendiri, CEO",
      image: "/images/example-profile-01.jpeg",
      socials: {
        facebook: "#",
        twitter: "#",
        linkedin: "#"
      }
    },
    {
      id: 8,
      name: "Ellen Walton",
      position: "Wakil Ketua",
      image: "/images/example-profile-02.jpeg",
      socials: {
        facebook: "#",
        twitter: "#",
        linkedin: "#"
      }
    }
  ];

  return (
    <section className="py-20 bg-white relative">
      <div className="absolute left-0 top-0 w-72 h-72 bg-forest/10 rounded-full blur-3xl"></div>
      <div className="absolute right-0 bottom-0 w-72 h-72 bg-mango/10 rounded-full blur-3xl"></div>
      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-px bg-poppy mr-4"></div>
            <p className="text-sm uppercase tracking-wider font-semibold text-poppy">ORANG-ORANG HEBAT</p>
            <div className="w-12 h-px bg-poppy ml-4"></div>
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-forest to-babyBlue-dark bg-clip-text text-transparent">Tim Kami</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tim kami terdiri dari individu-individu yang berkomitmen untuk menciptakan perubahan positif di Sulawesi Utara.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <div key={member.id} className="group">
              <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-xl">
                <div className="rounded-t-xl overflow-hidden aspect-square relative">
                  <Image 
                    src={member.image} 
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex justify-center space-x-3">
                      <a href={member.socials.facebook} aria-label={`Facebook ${member.name}`} className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-gray-800 hover:bg-poppy hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a href={member.socials.twitter} aria-label={`Twitter ${member.name}`} className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-gray-800 hover:bg-babyBlue hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                      <a href={member.socials.linkedin} aria-label={`LinkedIn ${member.name}`} className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-gray-800 hover:bg-forest hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Enhanced CallToAction component
const EnhancedCallToAction = () => {
  return (
    <section className="py-24 my-16">
      <div className="container mx-auto px-12">
        <div className="bg-cover bg-center rounded-3xl overflow-hidden relative" style={{ backgroundImage: "url('/images/cta-background.jpeg')", minHeight: "320px" }}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/50"></div>
          <div className="relative z-10 text-center text-white py-24 px-4 md:px-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">
              Di sini torang bantu ngoni<br />
              <span className="text-mango">Supaya ngoni boleh bantu yang laeng!</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              <button className="bg-mango hover:bg-mango-dark text-black px-8 py-3 rounded-md font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                Bergabung sebagai Relawan
              </button>
              <button className="bg-white hover:bg-gray-100 text-black px-8 py-3 rounded-md font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                Donasi Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Sponsors Section with enhanced styling
const SponsorsSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-white to-lavender-light/20 relative overflow-hidden">
      <div className="absolute left-0 bottom-0 w-72 h-72 bg-mango/10 rounded-full blur-3xl"></div>
      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-10">
          <h3 className="text-xl font-semibold text-lavender-dark">PENDUKUNG KAMI</h3>
          <div className="w-24 h-1 bg-gradient-to-r from-lavender-light to-lavender-dark mx-auto mt-3"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex justify-center transform transition-transform duration-300 hover:scale-110">
              <Image 
                src={`/images/sponsors/logo${i}.svg`} 
                alt={`Sponsor ${i}`}
                width={120}
                height={60}
                className="h-12 w-auto opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Main About Us Page Component
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <AboutHero />
        <VideoSection />
        <MissionVision />
        <TeamSection />
        <EnhancedCallToAction />
        <SponsorsSection />
      </main>
      <Footer />
    </div>
  );
}