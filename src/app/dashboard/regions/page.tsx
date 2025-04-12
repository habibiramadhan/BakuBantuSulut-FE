// src/app/dashboard/regions/page.tsx
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/contexts/ToastContext';
import { getUser } from '@/services/auth';
import { useRouter } from 'next/navigation';

interface Region {
  id: string;
  name: string;
  province: string;
  orphanageCount: number;
  volunteerCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export default function RegionsPage() {
  const router = useRouter();
  const toast = useToast();
  
  // Check if user is SUPERADMIN
  const user = getUser();
  const isSuperAdmin = user?.role === 'SUPERADMIN';
  
  // If not SUPERADMIN, redirect to dashboard
  if (!isSuperAdmin) {
    toast.error('Anda tidak memiliki akses ke halaman ini', 'Akses Ditolak');
    router.push('/dashboard');
  }
  
  // Mock data - in a real app, this would come from an API
  const [regions, setRegions] = useState<Region[]>([
    {
      id: '1',
      name: 'Jakarta',
      province: 'DKI Jakarta',
      orphanageCount: 12,
      volunteerCount: 45,
      status: 'active',
      createdAt: '2025-01-10'
    },
    {
      id: '2',
      name: 'Bandung',
      province: 'Jawa Barat',
      orphanageCount: 8,
      volunteerCount: 30,
      status: 'active',
      createdAt: '2025-01-15'
    },
    {
      id: '3',
      name: 'Surabaya',
      province: 'Jawa Timur',
      orphanageCount: 10,
      volunteerCount: 38,
      status: 'active',
      createdAt: '2025-01-20'
    },
    {
      id: '4',
      name: 'Makassar',
      province: 'Sulawesi Selatan',
      orphanageCount: 5,
      volunteerCount: 18,
      status: 'active',
      createdAt: '2025-02-05'
    },
    {
      id: '5',
      name: 'Medan',
      province: 'Sumatera Utara',
      orphanageCount: 7,
      volunteerCount: 25,
      status: 'inactive',
      createdAt: '2025-02-10'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRegion, setNewRegion] = useState({
    name: '',
    province: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    province: ''
  });

  // Filtered regions based on search
  const filteredRegions = regions.filter(region => {
    return region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           region.province.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: '', province: '' };
    
    if (!newRegion.name.trim()) {
      newErrors.name = 'Nama wilayah wajib diisi';
      valid = false;
    }
    
    if (!newRegion.province.trim()) {
      newErrors.province = 'Provinsi wajib diisi';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleAddRegion = () => {
    if (!validateForm()) return;
    
    // In a real app, this would be an API call
    const newRegionData: Region = {
      id: `${regions.length + 1}`,
      name: newRegion.name,
      province: newRegion.province,
      orphanageCount: 0,
      volunteerCount: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setRegions([...regions, newRegionData]);
    setNewRegion({ name: '', province: '' });
    setShowAddForm(false);
    toast.success('Wilayah baru berhasil ditambahkan');
  };

  const handleStatusChange = (id: string, newStatus: 'active' | 'inactive') => {
    setRegions(regions.map(region => 
      region.id === id ? { ...region, status: newStatus } : region
    ));
    
    toast.success(`Status wilayah berhasil diubah menjadi ${newStatus === 'active' ? 'aktif' : 'tidak aktif'}`);
  };

  // Status badge colors
  const getStatusBadge = (status: Region['status']) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Aktif</span>;
      case 'inactive':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Tidak Aktif</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Wilayah</h1>
        <Button 
          variant="primary" 
          leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          }
          onClick={() => setShowAddForm(true)}
        >
          Tambah Wilayah
        </Button>
      </div>

      {/* Add Region Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Tambah Wilayah Baru</h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nama Wilayah"
              value={newRegion.name}
              onChange={(e) => setNewRegion({...newRegion, name: e.target.value})}
              error={errors.name}
              placeholder="Contoh: Yogyakarta"
            />
            <Input
              label="Provinsi"
              value={newRegion.province}
              onChange={(e) => setNewRegion({...newRegion, province: e.target.value})}
              error={errors.province}
              placeholder="Contoh: Daerah Istimewa Yogyakarta"
            />
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowAddForm(false)}
            >
              Batal
            </Button>
            <Button 
              variant="primary"
              onClick={handleAddRegion}
            >
              Simpan Wilayah
            </Button>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1">
            <Input
              placeholder="Cari nama wilayah atau provinsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              }
            />
          </div>
        </div>
      </div>

      {/* Regions List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Wilayah
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provinsi
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah Panti
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah Relawan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Dibuat
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRegions.map((region) => (
                <tr key={region.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {region.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{region.province}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{region.orphanageCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{region.volunteerCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(region.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(region.createdAt).toLocaleDateString('id-ID', {
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
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        }
                      >
                        Edit
                      </Button>
                      
                      {region.status === 'inactive' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          leftIcon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          }
                          className="text-green-600 hover:bg-green-50"
                          onClick={() => handleStatusChange(region.id, 'active')}
                        >
                          Aktifkan
                        </Button>
                      )}
                      
                      {region.status === 'active' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          leftIcon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                            </svg>
                          }
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleStatusChange(region.id, 'inactive')}
                        >
                          Nonaktifkan
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {filteredRegions.length === 0 && (
          <div className="py-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Tidak ada data yang ditemukan</h3>
            <p className="mt-1 text-gray-500">Coba ubah filter pencarian atau tambahkan wilayah baru.</p>
            <div className="mt-6">
              <Button variant="primary" onClick={() => setShowAddForm(true)}>Tambah Wilayah</Button>
            </div>
          </div>
        )}
        
        {/* Pagination */}
        {filteredRegions.length > 0 && (
          <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Menampilkan <span className="font-medium">{filteredRegions.length}</span> dari <span className="font-medium">{regions.length}</span> wilayah
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
                disabled={filteredRegions.length === regions.length}
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