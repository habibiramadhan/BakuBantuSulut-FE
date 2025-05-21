// src/components/pages/orphanages/EditOrphanageForm.tsx
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/contexts/ToastContext';
import orphanageService, { UpdateOrphanageDetailParams } from '@/services/orphanageService';
import Image from 'next/image';

// Interface yang menyesuaikan dengan struktur JSON dari API
interface OrphanageAPIData {
  id_panti: number;
  nama_panti: string;
  foto_utama: string | null;
  deskripsi_singkat: string;
  jumlah_anak: number;
  status: string;
  yayasan: {
    id_yayasan: number;
    nama_yayasan: string;
    kontak_yayasan: Array<{
      jabatan: string;
      nama_kontak: string;
      nomor_telepon: string;
    }>;
  };
  wilayah: {
    id_wilayah: number;
    nama_wilayah: string;
    provinsi: string | null;
  };
  detail: {
    fokus_pelayanan: string;
    alamat_lengkap: string;
    deskripsi_lengkap: string;
    jumlah_pengasuh: number;
    jumlah_penghuni: {
      laki_laki: number;
      perempuan: number;
    };
    kategori_kebutuhan: string[];
    sumbangan_diterima: string[];
  };
}

interface EditOrphanageFormProps {
  orphanage: OrphanageAPIData;
  onSubmit: (data: FormData, detailData: UpdateOrphanageDetailParams) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

interface Wilayah {
  id: number;
  nama: string;
  status?: string;
}

interface Yayasan {
  id: number;
  namaYayasan: string;
  status?: string;
}

const EditOrphanageForm: React.FC<EditOrphanageFormProps> = ({
  orphanage,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [wilayahs, setWilayahs] = useState<Wilayah[]>([]);
  const [yayasans, setYayasans] = useState<Yayasan[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(
    orphanage.foto_utama || null
  );
  
  // Form state yang disesuaikan dengan format data API
  const [formData, setFormData] = useState({
    namaPanti: orphanage.nama_panti || '',
    deskripsiSingkat: orphanage.deskripsi_singkat || '',
    jumlahAnak: orphanage.jumlah_anak || 0,
    status: orphanage.status?.toUpperCase() || 'ACTIVE',
    yayasanId: orphanage.yayasan?.id_yayasan || null,
    wilayahId: orphanage.wilayah?.id_wilayah || null,
    fotoUtama: null as File | null
  });
  
  // Detail form state yang disesuaikan dengan format data API
  const [detailFormData, setDetailFormData] = useState<UpdateOrphanageDetailParams>({
    fokusPelayanan: (orphanage.detail?.fokus_pelayanan) || 'Umum',
    alamatLengkap: (orphanage.detail?.alamat_lengkap) || '',
    deskripsiLengkap: (orphanage.detail?.deskripsi_lengkap) || orphanage.deskripsi_singkat || '',
    jumlahPengasuh: (orphanage.detail?.jumlah_pengasuh) || 0,
    jumlahPenghuni: (orphanage.detail?.jumlah_penghuni) || {
      laki_laki: 0,
      perempuan: 0
    },
    kategoriKebutuhan: (orphanage.detail?.kategori_kebutuhan) || [],
    sumbanganDiterima: (orphanage.detail?.sumbangan_diterima) || []
  });
  
  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  console.log("Form data initialized with:", { formData, detailFormData });

  // Fetch wilayahs and yayasans data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch active wilayahs
        const wilayahResponse = await orphanageService.getActiveWilayah();
        setWilayahs(wilayahResponse.data || []);

        // Fetch active yayasans
        const yayasanResponse = await orphanageService.getActiveYayasan();
        setYayasans(yayasanResponse.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Gagal memuat data wilayah dan yayasan');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Update form data
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numberValue = parseInt(value, 10) || 0;
    setFormData(prev => ({
      ...prev,
      [name]: numberValue
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value ? parseInt(value, 10) : null
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFormData(prev => ({
        ...prev,
        fotoUtama: file
      }));

      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Update detail form data
  const handleDetailInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDetailFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDetailNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numberValue = parseInt(value, 10) || 0;
    setDetailFormData(prev => ({
      ...prev,
      [name]: numberValue
    }));
  };

  const handlePenghuniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const gender = name === 'laki_laki' ? 'laki_laki' : 'perempuan';
    const numberValue = parseInt(value, 10) || 0;
    
    setDetailFormData(prev => ({
      ...prev,
      jumlahPenghuni: {
        ...prev.jumlahPenghuni,
        [gender]: numberValue
      }
    }));
  };

  const handleCheckboxChange = (category: string, type: 'kategoriKebutuhan' | 'sumbanganDiterima') => {
    setDetailFormData(prev => {
      const currentCategories = prev[type] || [];
      const newCategories = currentCategories.includes(category)
        ? currentCategories.filter(item => item !== category)
        : [...currentCategories, category];
      
      return {
        ...prev,
        [type]: newCategories
      };
    });
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.namaPanti.trim()) {
      newErrors.namaPanti = 'Nama panti asuhan wajib diisi';
    }
    
    if (!formData.deskripsiSingkat.trim()) {
      newErrors.deskripsiSingkat = 'Deskripsi singkat wajib diisi';
    }
    
    if (!formData.wilayahId) {
      newErrors.wilayahId = 'Wilayah wajib dipilih';
    }
    
    if (!formData.yayasanId) {
      newErrors.yayasanId = 'Yayasan wajib dipilih';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Mohon perbaiki kesalahan pada formulir');
      return;
    }
    
    // Create FormData object for sending file
    const formDataObj = new FormData();
    
    // Add all fields to FormData
    formDataObj.append('namaPanti', formData.namaPanti);
    formDataObj.append('deskripsiSingkat', formData.deskripsiSingkat);
    formDataObj.append('jumlahAnak', String(formData.jumlahAnak || 0));
    formDataObj.append('status', formData.status);
    
    // Pastikan yayasanId dan wilayahId tidak null sebelum append
    if (formData.yayasanId !== null) {
      formDataObj.append('yayasanId', String(formData.yayasanId));
    }
    
    if (formData.wilayahId !== null) {
      formDataObj.append('wilayahId', String(formData.wilayahId));
    }
    
    // Add file if available
    if (formData.fotoUtama) {
      formDataObj.append('fotoUtama', formData.fotoUtama);
    }
    
    await onSubmit(formDataObj, detailFormData);
  };

  // Options for dropdown menus
  const kategoriKebutuhanOptions = [
    'Sembako',
    'Peralatan Sekolah',
    'Peralatan Mandi',
    'Perlengkapan Belajar',
    'Mainan Edukatif',
    'Pakaian',
    'Obat-obatan',
    'Kebutuhan Bayi'
  ];

  const sumbanganOptions = [
    'Pangan',
    'Sandang',
    'Tunai',
    'Kebutuhan Asuh',
    'Layanan Kesehatan',
    'Pendidikan',
    'Transportasi',
    'Kebutuhan Ibadah'
  ];

  const fokusPelayananOptions = [
    'Umum',
    'Anak Yatim Piatu',
    'Dhuafa',
    'Anak dengan Kebutuhan Khusus',
    'Lansia',
    'Anak Jalanan',
    'Anak Yatim Piatu dan Dhuafa',
    'Anak Yatim Piatu, Dhuafa, dan Anak dengan Kebutuhan Khusus'
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-babyBlue-dark"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Dasar</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            label="Nama Panti Asuhan"
            name="namaPanti"
            value={formData.namaPanti}
            onChange={handleInputChange}
            error={errors.namaPanti}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wilayah <span className="text-red-500">*</span>
            </label>
            <select
              name="wilayahId"
              className={`h-10 w-full rounded-md border ${errors.wilayahId ? 'border-red-500' : 'border-gray-300'} bg-white px-3 py-2 text-sm shadow-sm focus:border-babyBlue focus:outline-none focus:ring-1 focus:ring-babyBlue`}
              value={formData.wilayahId || ''}
              onChange={handleSelectChange}
              required
            >
              <option value="">Pilih Wilayah</option>
              {wilayahs.map(wilayah => (
                <option key={wilayah.id} value={wilayah.id}>{wilayah.nama}</option>
              ))}
            </select>
            {errors.wilayahId && (
              <p className="mt-1.5 text-sm text-red-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.wilayahId}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Yayasan <span className="text-red-500">*</span>
            </label>
            <select
              name="yayasanId"
              className={`h-10 w-full rounded-md border ${errors.yayasanId ? 'border-red-500' : 'border-gray-300'} bg-white px-3 py-2 text-sm shadow-sm focus:border-babyBlue focus:outline-none focus:ring-1 focus:ring-babyBlue`}
              value={formData.yayasanId || ''}
              onChange={handleSelectChange}
              required
            >
              <option value="">Pilih Yayasan</option>
              {yayasans.map(yayasan => (
                <option key={yayasan.id} value={yayasan.id}>{yayasan.namaYayasan}</option>
              ))}
            </select>
            {errors.yayasanId && (
              <p className="mt-1.5 text-sm text-red-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.yayasanId}
              </p>
            )}
          </div>
          
          <Input
            label="Jumlah Anak"
            type="number"
            name="jumlahAnak"
            value={String(formData.jumlahAnak || 0)}
            onChange={handleNumberChange}
            min={0}
          />
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi Singkat <span className="text-red-500">*</span>
            </label>
            <textarea
              name="deskripsiSingkat"
              rows={3}
              className={`w-full rounded-md border ${errors.deskripsiSingkat ? 'border-red-500' : 'border-gray-300'} bg-white px-3 py-2 text-sm shadow-sm focus:border-babyBlue focus:outline-none focus:ring-1 focus:ring-babyBlue`}
              value={formData.deskripsiSingkat}
              onChange={handleInputChange}
              required
            ></textarea>
            {errors.deskripsiSingkat && (
              <p className="mt-1.5 text-sm text-red-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.deskripsiSingkat}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  id="status-active"
                  name="status"
                  type="radio"
                  value="ACTIVE"
                  checked={formData.status === 'ACTIVE'}
                  onChange={() => setFormData(prev => ({ ...prev, status: 'ACTIVE' }))}
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
                  value="INACTIVE"
                  checked={formData.status === 'INACTIVE'}
                  onChange={() => setFormData(prev => ({ ...prev, status: 'INACTIVE' }))}
                  className="h-4 w-4 border-gray-300 text-babyBlue focus:ring-babyBlue"
                />
                <label htmlFor="status-inactive" className="ml-2 block text-sm text-gray-700">
                  Tidak Aktif
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="status-pending"
                  name="status"
                  type="radio"
                  value="PENDING"
                  checked={formData.status === 'PENDING'}
                  onChange={() => setFormData(prev => ({ ...prev, status: 'PENDING' }))}
                  className="h-4 w-4 border-gray-300 text-babyBlue focus:ring-babyBlue"
                />
                <label htmlFor="status-pending" className="ml-2 block text-sm text-gray-700">
                  Menunggu
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Foto Utama
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {selectedImage ? (
                  <div className="relative">
                    <img 
                      src={selectedImage} 
                      alt="Preview" 
                      className="mx-auto h-40 w-auto object-cover" 
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        setFormData(prev => ({ ...prev, fotoUtama: null }));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-babyBlue hover:text-babyBlue-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-babyBlue"
                      >
                        <span>Upload foto</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">atau drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Detail</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fokus Pelayanan
            </label>
            <select
              name="fokusPelayanan"
              className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-babyBlue focus:outline-none focus:ring-1 focus:ring-babyBlue"
              value={detailFormData.fokusPelayanan}
              onChange={handleDetailInputChange}
            >
              {fokusPelayananOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <Input
            label="Jumlah Pengasuh"
            type="number"
            name="jumlahPengasuh"
            value={String(detailFormData.jumlahPengasuh || 0)}
            onChange={handleDetailNumberChange}
            min={0}
          />
          
          <Input
            label="Jumlah Penghuni Laki-laki"
            type="number"
            name="laki_laki"
            value={String(detailFormData.jumlahPenghuni?.laki_laki || 0)}
            onChange={handlePenghuniChange}
            min={0}
          />
          
          <Input
            label="Jumlah Penghuni Perempuan"
            type="number"
            name="perempuan"
            value={String(detailFormData.jumlahPenghuni?.perempuan || 0)}
            onChange={handlePenghuniChange}
            min={0}
          />
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat Lengkap
            </label>
            <textarea
              name="alamatLengkap"
              rows={3}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-babyBlue focus:outline-none focus:ring-1 focus:ring-babyBlue"
              value={detailFormData.alamatLengkap}
              onChange={handleDetailInputChange}
            ></textarea>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi Lengkap
            </label>
            <textarea
              name="deskripsiLengkap"
              rows={4}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-babyBlue focus:outline-none focus:ring-1 focus:ring-babyBlue"
              value={detailFormData.deskripsiLengkap}
              onChange={handleDetailInputChange}
            ></textarea>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori Kebutuhan
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {kategoriKebutuhanOptions.map(category => (
                <div key={category} className="flex items-center">
                  <input
                    id={`kategori-${category}`}
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-babyBlue focus:ring-babyBlue"
                    checked={detailFormData.kategoriKebutuhan?.includes(category) || false}
                    onChange={() => handleCheckboxChange(category, 'kategoriKebutuhan')}
                  />
                  <label htmlFor={`kategori-${category}`} className="ml-2 block text-sm text-gray-700">
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sumbangan Diterima
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {sumbanganOptions.map(category => (
                <div key={category} className="flex items-center">
                  <input
                    id={`sumbangan-${category}`}
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-babyBlue focus:ring-babyBlue"
                    checked={detailFormData.sumbanganDiterima?.includes(category) || false}
                    onChange={() => handleCheckboxChange(category, 'sumbanganDiterima')}
                  />
                  <label htmlFor={`sumbangan-${category}`} className="ml-2 block text-sm text-gray-700">
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4 pt-4 border-t">
       <Button
         type="button"
         variant="outline"
         onClick={onCancel}
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
         {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
       </Button>
     </div>
   </form>
 );
};

export default EditOrphanageForm;