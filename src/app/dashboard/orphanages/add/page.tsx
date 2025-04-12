// src/app/dashboard/orphanages/add/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { useToast } from '@/contexts/ToastContext';

interface FormData {
  name: string;
  address: string;
  region: string;
  phoneNumber: string;
  email: string;
  contactPerson: string;
  childrenCount: number;
  description: string;
  facilities: string[];
  status: 'active' | 'inactive';
}

export default function AddOrphanagePage() {
  const router = useRouter();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    address: '',
    region: '',
    phoneNumber: '',
    email: '',
    contactPerson: '',
    childrenCount: 0,
    description: '',
    facilities: [],
    status: 'active'
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const facilityOptions = [
    { id: 'library', label: 'Perpustakaan' },
    { id: 'computer_lab', label: 'Laboratorium Komputer' },
    { id: 'playground', label: 'Taman Bermain' },
    { id: 'sports_field', label: 'Lapangan Olahraga' },
    { id: 'kitchen', label: 'Dapur' },
    { id: 'medical_room', label: 'Ruang Kesehatan' },
    { id: 'study_room', label: 'Ruang Belajar' },
    { id: 'prayer_room', label: 'Musholla' }
  ];

  const regionOptions = [
    'DKI Jakarta',
    'Jawa Barat',
    'Jawa Tengah',
    'Jawa Timur',
    'Bali',
    'Sumatera Utara',
    'Sumatera Selatan',
    'Kalimantan Timur',
    'Sulawesi Selatan',
    'Papua'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numberValue = parseInt(value) || 0;
    setFormData(prev => ({
      ...prev,
      [name]: numberValue
    }));
  };

  const handleFacilityChange = (facilityId: string) => {
    setFormData(prev => {
      const facilities = prev.facilities.includes(facilityId)
        ? prev.facilities.filter(id => id !== facilityId)
        : [...prev.facilities, facilityId];
      
      return {
        ...prev,
        facilities
      };
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nama panti asuhan wajib diisi';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Alamat wajib diisi';
    }
    
    if (!formData.region) {
      newErrors.region = 'Wilayah wajib dipilih';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Nomor telepon wajib diisi';
    } else if (!/^[0-9+\-\s]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Format nomor telepon tidak valid';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Nama kontak wajib diisi';
    }
    
    if (formData.childrenCount <= 0) {
      newErrors.childrenCount = 'Jumlah anak tidak valid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Mohon perbaiki kesalahan pada formulir');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Panti asuhan berhasil ditambahkan');
      router.push('/dashboard/orphanages');
    } catch (error) {
      toast.error('Gagal menambahkan panti asuhan. Silakan coba lagi.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tambah Panti Asuhan</h1>
          <p className="text-gray-600 mt-1">Isi formulir di bawah untuk menambahkan panti asuhan baru</p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.back()}
          leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          }
        >
          Kembali
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="Nama Panti Asuhan"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wilayah
              </label>
              <select
                name="region"
                className={`h-10 w-full rounded-md border ${errors.region ? 'border-red-500' : 'border-gray-300'} bg-white px-3 py-2 text-sm shadow-sm focus:border-babyBlue focus:outline-none focus:ring-1 focus:ring-babyBlue`}
                value={formData.region}
                onChange={handleInputChange}
                required
              >
                <option value="">Pilih Wilayah</option>
                {regionOptions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              {errors.region && (
                <p className="mt-1.5 text-sm text-red-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.region}
                </p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alamat Lengkap
              </label>
              <textarea
                name="address"
                rows={3}
                className={`w-full rounded-md border ${errors.address ? 'border-red-500' : 'border-gray-300'} bg-white px-3 py-2 text-sm shadow-sm focus:border-babyBlue focus:outline-none focus:ring-1 focus:ring-babyBlue`}
                value={formData.address}
                onChange={handleInputChange}
                required
              ></textarea>
              {errors.address && (
                <p className="mt-1.5 text-sm text-red-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.address}
                </p>
              )}
            </div>
            
            <Input
              label="Nomor Telepon"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              error={errors.phoneNumber}
              required
            />
            
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
            />
            
            <Input
              label="Nama Kontak"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleInputChange}
              error={errors.contactPerson}
              required
            />
            
            <Input
              label="Jumlah Anak"
              type="number"
              name="childrenCount"
              value={formData.childrenCount.toString()}
              onChange={handleNumberChange}
              error={errors.childrenCount}
              required
              min={0}
            />
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi
              </label>
              <textarea
                name="description"
                rows={4}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-babyBlue focus:outline-none focus:ring-1 focus:ring-babyBlue"
                value={formData.description}
                onChange={handleInputChange}
              ></textarea>
            </div>
            
            <div className="md:col-span-2">
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-2">
                  Fasilitas
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {facilityOptions.map(facility => (
                    <Checkbox
                      key={facility.id}
                      id={`facility-${facility.id}`}
                      label={facility.label}
                      checked={formData.facilities.includes(facility.id)}
                      onChange={() => handleFacilityChange(facility.id)}
                    />
                  ))}
                </div>
              </fieldset>
            </div>
            
            <div>
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </legend>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input
                      id="status-active"
                      name="status"
                      type="radio"
                      value="active"
                      checked={formData.status === 'active'}
                      onChange={() => setFormData(prev => ({ ...prev, status: 'active' }))}
                      className="h-4 w-4 border-gray-300 text-babyBlue focus:ring-babyBlue"
                    />
                    <label htmlFor="status-active" className="ml-2 block text-sm text-gray-700">
                      Aktif
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="status-inactive"
                      name="status"
                      type="radio"
                      value="inactive"
                      checked={formData.status === 'inactive'}
                      onChange={() => setFormData(prev => ({ ...prev, status: 'inactive' }))}
                      className="h-4 w-4 border-gray-300 text-babyBlue focus:ring-babyBlue"
                    />
                    <label htmlFor="status-inactive" className="ml-2 block text-sm text-gray-700">
                      Tidak Aktif
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Panti Asuhan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )};