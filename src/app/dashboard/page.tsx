// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { getUser, User } from '@/services/auth';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';

interface DashboardStat {
  title: string;
  value: number;
  icon: React.ReactNode;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

interface RecentActivity {
  id: string;
  action: string;
  user: string;
  target: string;
  timestamp: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock data - in a real app, this would come from an API
  const [stats, setStats] = useState<DashboardStat[]>([
    {
      title: 'Total Panti Asuhan',
      value: 42,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-dark" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Relawan Aktif',
      value: 156,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-dark" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      ),
      change: '+7%',
      trend: 'up'
    },
    {
      title: 'Program Aktif',
      value: 24,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-forest-dark" viewBox="0 0 20 20" fill="currentColor">
          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
        </svg>
      ),
      change: '+20%',
      trend: 'up'
    },
    {
      title: 'Blog Posts',
      value: 87,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-mango-dark" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
          <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
        </svg>
      ),
      change: '+5%',
      trend: 'up'
    }
  ]);

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      action: 'Menambahkan panti asuhan baru',
      user: 'Ahmad Fauzi',
      target: 'Panti Kasih Sayang',
      timestamp: '2 jam yang lalu'
    },
    {
      id: '2',
      action: 'Memperbarui program',
      user: 'Siti Rahayu',
      target: 'Bantuan Pendidikan 2025',
      timestamp: '5 jam yang lalu'
    },
    {
      id: '3',
      action: 'Mendaftarkan relawan',
      user: 'Budi Santoso',
      target: 'Daftar Relawan Medis',
      timestamp: '1 hari yang lalu'
    },
    {
      id: '4',
      action: 'Mempublikasikan artikel blog',
      user: 'Dewi Lestari',
      target: 'Pentingnya Pendidikan untuk Anak Panti',
      timestamp: '1 hari yang lalu'
    },
    {
      id: '5',
      action: 'Menambahkan wilayah baru',
      user: 'Rudi Hartono',
      target: 'Kalimantan Timur',
      timestamp: '2 hari yang lalu'
    }
  ]);

  useEffect(() => {
    // Get user data from local storage
    const userData = getUser();
    setUser(userData);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loading size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Selamat datang kembali, {user?.username || 'Admin'}!
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            }
          >
            Tambah Data
          </Button>
          <Button 
            variant="primary" 
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            }
          >
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className="rounded-full bg-gray-100 p-3">
                {stat.icon}
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {stat.trend === 'up' && (
                <span className="text-green-500 flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                  {stat.change}
                </span>
              )}
              {stat.trend === 'down' && (
                <span className="text-red-500 flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                  </svg>
                  {stat.change}
                </span>
              )}
              <span className="text-gray-500 text-sm ml-2">dari bulan lalu</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start">
                <div className="rounded-full bg-babyBlue-light p-2 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-babyBlue-dark" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">
                    {activity.action}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">{activity.user}</span> - {activity.target}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">{activity.timestamp}</p>
                </div>
                <Button variant="ghost" size="sm">
                  Lihat Detail
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-3 border-t border-gray-100 text-center">
          <Button variant="link">Lihat semua aktivitas</Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="primary" 
              leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              }
            >
              Tambah Panti
            </Button>
            <Button 
              variant="secondary" 
              leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              }
            >
              Tambah Relawan
            </Button>
            <Button 
              variant="accent" 
              leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
                  <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
                </svg>
              }
            >
              Tambah Blog
            </Button>
            <Button 
              variant="outline" 
              leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
              }
            >
              Tambah Program
            </Button>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Laporan Terakhir</h2>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-md">
              <div className="mr-4 rounded-full bg-lavender-light p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lavender-dark" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v6a1 1 0 102 0V8z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-800">Laporan Keuangan</h3>
                <p className="text-xs text-gray-500">April 2025</p>
              </div>
              <Button variant="ghost" size="sm">
                Lihat
              </Button>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-md">
              <div className="mr-4 rounded-full bg-babyBlue-light p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-babyBlue-dark" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-800">Statistik Relawan</h3>
                <p className="text-xs text-gray-500">Triwulan 1 2025</p>
              </div>
              <Button variant="ghost" size="sm">
                Lihat
              </Button>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-md">
              <div className="mr-4 rounded-full bg-mango-light p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-mango-dark" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-800">Perkembangan Program</h3>
                <p className="text-xs text-gray-500">Q1 2025</p>
              </div>
              <Button variant="ghost" size="sm">
                Lihat
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}