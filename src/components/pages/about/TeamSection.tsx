// src/components/pages/about/TeamSection.tsx
"use client";

import React from 'react';
import Image from 'next/image';

/**
 * Interface for team member data
 */
interface TeamMember {
  id: number;
  name: string;
  position: string;
  image: string;
  socials: {
    facebook: string;
    twitter: string;
    linkedin: string;
  };
}

/**
 * Team members section for the About page
 * Displays a grid of team members with their images and positions
 */
const TeamSection: React.FC = () => {
  // Team members data
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Leonard John Davies",
      position: "Pendiri, CEO",
      image: "/images/example-profile-03.jpeg",
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
      image: "/images/example-profile-03.jpeg",
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
      image: "/images/example-profile-03.jpeg",
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
      image: "/images/example-profile-03.jpeg",
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
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * Individual team member card component
 */
interface TeamMemberCardProps {
  member: TeamMember;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
  return (
    <div className="group">
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
  );
};

export default TeamSection;