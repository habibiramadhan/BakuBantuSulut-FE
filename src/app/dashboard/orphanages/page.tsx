// src/app/dashboard/orphanages/page.tsx
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';

interface Orphanage {
  id: string;
  name: string;
  location: string;
  region: string;
  childrenCount: number;
  status: 'active' | 'inactive' | 'pending';
  lastUpdated: string;
}

export default function OrphanagesPage() {
  // Mock data - in a real app, this would come from an API
  const [orphanages, setOrphanages] = useState<Orphanage[]>([
    {
      id: '1',
      name: 'Panti Asuhan Kasih Sayang',
      location: 'Jl. Kenanga No. 123, Jakarta Selatan',
      region: 'DKI Jakarta',
      childrenCount: 45,
      status: 'active',
      lastUpdated: '2025-04-10'
    },
    {
      id: '2',
      name: 'Rumah Yatim Bahagia',
      location: 'Jl. Melati No. 45, Bandung',
      region: 'Jawa Barat',
      childrenCount: 32,
      status: 'active',
      lastUpdated: '2025-04-05'
    },
    {
      id: '3',
      name: 'Panti Asuhan Cahaya Kasih',
      location: 'Jl. Anggrek No. 67, Surabaya',
      region: 'Jawa Timur',
      childrenCount: 28,
      status: 'inactive',
      lastUpdated: '2025-03-20'
    },
    {
      id: '4',
      name: 'Yayasan Peduli Anak',
      location: 'Jl. Flamboyan No. 12, Makassar',
      region: 'Sulawesi Selatan',
      childrenCount: 37,
      status: 'active',
      lastUpdated: '2025-04-08'
    },
    {
      id: '5',
      name: 'Panti Asuhan Bina Karya',
      location: 'Jl. Dahlia No. 89, Medan',
      region: 'Sumatera Utara',
      childrenCount: 23,
      status: 'pending',
      lastUpdated: '2025-04-12'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Filtered orphanages based on search and filters
  const filteredOrphanages = orphanages.filter(orphanage => {
    const matchesSearch = orphanage.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          orphanage.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || orphanage.region === selectedRegion;
    const matchesStatus = selectedStatus === 'all' || orphanage.status === selectedStatus;
    
    return matchesSearch && matchesRegion && matchesStatus;
  });

  // Get unique regions for the filter
  const regions = Array.from(new Set(orphanages.map(o => o.region)));

  // Status badge colors
  const getStatusBadge = (status: Orphanage['status']) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Aktif</span>;
      case 'inactive':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Tidak Aktif</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Menunggu</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Panti Asuhan</h1>
        <Button 
          variant="primary" 
          leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          }
        >
          Tambah Panti Asuhan
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1">
            <Input
              placeholder="Cari nama panti atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              }
            />
          </div>
          <div className="flex-shrink-0 w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wilayah
            </label>
            <select
              className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-babyBlue focus:outline-none focus:ring-1 focus:ring-babyBlue"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value="all">Semua Wilayah</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
          <div className="flex-shrink-0 w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-babyBlue focus:outline-none focus:ring-1 focus:ring-babyBlue"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
              <option value="pending">Menunggu</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orphanages List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Panti
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lokasi
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wilayah
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah Anak
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Terakhir Diperbarui
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrphanages.map((orphanage) => (
                <tr key={orphanage.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {orphanage.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{orphanage.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{orphanage.region}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{orphanage.childrenCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(orphanage.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(orphanage.lastUpdated).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        leftIcon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        }
                      >
                        Lihat
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        leftIcon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        }
                      >
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {filteredOrphanages.length === 0 && (
          <div className="py-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Tidak ada data yang ditemukan</h3>
            <p className="mt-1 text-gray-500">Coba ubah filter pencarian atau tambahkan panti asuhan baru.</p>
            <div className="mt-6">
              <Button variant="primary">Tambah Panti Asuhan</Button>
            </div>
          </div>
        )}
        
        {/* Pagination */}
        {filteredOrphanages.length > 0 && (
          <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Menampilkan <span className="font-medium">{filteredOrphanages.length}</span> dari <span className="font-medium">{orphanages.length}</span> panti asuhan
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                disabled={true}
              >
                Sebelumnya
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                disabled={filteredOrphanages.length === orphanages.length}
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}