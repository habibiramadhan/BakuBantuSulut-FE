// src/app/register/volunteer/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FileInput } from '@/components/ui/FileInput';
import { useToast } from '@/contexts/ToastContext';
import AuthLayout from '@/components/layouts/AuthLayout';
import { VolunteerFormData, validateStep1, validateStep2, validateProfilePicture } from '@/lib/validations/volunteer-schema';
import { registerVolunteer, getWilayahList } from '@/services/volunteer';

interface Wilayah {
  id: string;
  nama: string;
}

export default function VolunteerRegistrationPage() {
  const router = useRouter();
  const toast = useToast();
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Data state
  const [wilayahList, setWilayahList] = useState<Wilayah[]>([]);
  const [isLoadingWilayah, setIsLoadingWilayah] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<keyof VolunteerFormData, string>>>({});
  const [formData, setFormData] = useState<VolunteerFormData>({
    namaLengkap: '',
    jenisKelamin: 'MALE',
    tempatLahir: '',
    tanggalLahir: '',
    alamatDomisili: '',
    kewarganegaraan: 'WNI',
    nomorHP: '',
    email: '',
    wilayahId: '',
    profile_picture: null
  });
  
  // Mengambil data wilayah ketika komponen dimuat
  useEffect(() => {
    async function fetchWilayah() {
      setIsLoadingWilayah(true);
      try {
        const response = await getWilayahList();
        if (response.success && response.data) {
          setWilayahList(response.data);
        } else {
          toast.error(response.message || 'Gagal mengambil data wilayah');
        }
      } catch (error) {
        toast.error('Terjadi kesalahan saat memuat data wilayah');
      } finally {
        setIsLoadingWilayah(false);
      }
    }
    
    fetchWilayah();
  }, [toast]);

  // Handler untuk perubahan input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name as keyof VolunteerFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  // Handler untuk unggah foto profil
  const handleFileUpload = (file: File | null) => {
    if (file) {
      const error = validateProfilePicture(file);
      
      if (error) {
        setErrors(prev => ({
          ...prev,
          profile_picture: error
        }));
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        profile_picture: file
      }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear error
      setErrors(prev => ({
        ...prev,
        profile_picture: undefined
      }));
    } else {
      // Jika file dihapus
      setFormData(prev => ({
        ...prev,
        profile_picture: null
      }));
      setPreviewUrl(null);
    }
  };
  
  // Validasi form
  const validateStep = (step: number): boolean => {
    let newErrors = {};
    
    if (step === 1) {
      newErrors = validateStep1(formData);
    } else if (step === 2) {
      newErrors = validateStep2(formData);
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handler untuk tombol next step
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      toast.error('Mohon perbaiki kesalahan pada formulir');
    }
  };
  
  // Handler untuk tombol previous step
  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };
  
  // Handler untuk submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      toast.error('Mohon perbaiki kesalahan pada formulir');
      return;
    }
    
    const profilePictureError = validateProfilePicture(formData.profile_picture);
    if (profilePictureError) {
      setErrors(prev => ({
        ...prev,
        profile_picture: profilePictureError
      }));
      toast.error(profilePictureError);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Kirim data ke API
      const response = await registerVolunteer(formData);
      
      if (response.success) {
        // Set session storage untuk halaman success
        sessionStorage.setItem('volunteer_registered', 'true');
        
        toast.success(response.message || 'Pendaftaran relawan berhasil! Silakan tunggu konfirmasi dari admin.');
        
        // Redirect ke halaman sukses
        setTimeout(() => {
          router.push('/volunteer/success');
        }, 1500);
      } else {
        // Handle error dari API
        if (response.errors) {
          setErrors(response.errors);
        }
        
        toast.error(response.message || 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
      setIsSubmitting(false);
    }
  };
  
  // Render step 1 - Informasi Pribadi
  const renderStep1 = () => {
    return (
      <div className="space-y-6">
        <Input
          label="Nama Lengkap"
          name="namaLengkap"
          value={formData.namaLengkap}
          onChange={handleInputChange}
          placeholder="Masukkan nama lengkap Anda"
          error={errors.namaLengkap}
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jenis Kelamin <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div 
              className={`border rounded-md p-3 flex items-center space-x-3 cursor-pointer transition ${
                formData.jenisKelamin === 'MALE' 
                  ? 'border-babyBlue bg-babyBlue-light/20' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onClick={() => setFormData(prev => ({ ...prev, jenisKelamin: 'MALE' }))}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                formData.jenisKelamin === 'MALE' ? 'border-babyBlue' : 'border-gray-400'
              }`}>
                {formData.jenisKelamin === 'MALE' && (
                  <div className="w-3 h-3 rounded-full bg-babyBlue"></div>
                )}
              </div>
              <span>Laki-laki</span>
            </div>
            
            <div 
              className={`border rounded-md p-3 flex items-center space-x-3 cursor-pointer transition ${
                formData.jenisKelamin === 'FEMALE' 
                  ? 'border-babyBlue bg-babyBlue-light/20' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onClick={() => setFormData(prev => ({ ...prev, jenisKelamin: 'FEMALE' }))}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                formData.jenisKelamin === 'FEMALE' ? 'border-babyBlue' : 'border-gray-400'
              }`}>
                {formData.jenisKelamin === 'FEMALE' && (
                  <div className="w-3 h-3 rounded-full bg-babyBlue"></div>
                )}
              </div>
              <span>Perempuan</span>
            </div>
          </div>
        </div>
        
        <Input
          label="Tempat Lahir"
          name="tempatLahir"
          value={formData.tempatLahir}
          onChange={handleInputChange}
          placeholder="Masukkan tempat lahir Anda"
          error={errors.tempatLahir}
          required
        />
        
        <Input
          label="Tanggal Lahir"
          type="date"
          name="tanggalLahir"
          value={formData.tanggalLahir}
          onChange={handleInputChange}
          error={errors.tanggalLahir}
          helperText="Usia minimal 17 tahun"
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alamat Domisili <span className="text-red-500">*</span>
          </label>
          <textarea
            name="alamatDomisili"
            rows={4}
            className={`w-full rounded-md border ${errors.alamatDomisili ? 'border-red-500' : 'border-gray-300'} bg-white px-3 py-2 text-sm shadow-sm focus:border-babyBlue focus:outline-none focus:ring-1 focus:ring-babyBlue`}
            value={formData.alamatDomisili}
            onChange={handleInputChange}
            placeholder="Masukkan alamat lengkap domisili Anda"
            required
          />
          {errors.alamatDomisili && (
            <p className="mt-1.5 text-sm text-red-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.alamatDomisili}
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kewarganegaraan
          </label>
          <select
            name="kewarganegaraan"
            className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-babyBlue focus:outline-none focus:ring-1 focus:ring-babyBlue"
            value={formData.kewarganegaraan}
            onChange={handleInputChange}
          >
            <option value="WNI">WNI (Warga Negara Indonesia)</option>
            <option value="WNA">WNA (Warga Negara Asing)</option>
          </select>
        </div>
        
        <div className="pt-4">
          <Button 
            type="button" 
            variant="primary" 
            size="full" 
            onClick={handleNextStep}
          >
            Lanjutkan
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Button>
        </div>
      </div>
    );
  };
  
  // Render step 2 - Informasi Kontak
  const renderStep2 = () => {
    return (
      <div className="space-y-6">
        <Input
          label="Nomor HP"
          name="nomorHP"
          value={formData.nomorHP}
          onChange={handleInputChange}
          placeholder="Contoh: 081234567890"
          error={errors.nomorHP}
          required
        />
        
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Masukkan email Anda"
          error={errors.email}
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Wilayah <span className="text-red-500">*</span>
          </label>
          {isLoadingWilayah ? (
            <div className="h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-sm flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-babyBlue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memuat data wilayah...
            </div>
          ) : (
            <select
              name="wilayahId"
              className={`h-10 w-full rounded-md border ${errors.wilayahId ? 'border-red-500' : 'border-gray-300'} bg-white px-3 py-2 text-sm shadow-sm focus:border-babyBlue focus:outline-none focus:ring-1 focus:ring-babyBlue`}
              value={formData.wilayahId}
              onChange={handleInputChange}
              required
            >
              <option value="">Pilih Wilayah</option>
              {wilayahList.map(wilayah => (
                <option key={wilayah.id} value={wilayah.id}>{wilayah.nama}</option>
              ))}
            </select>
          )}
          {errors.wilayahId && (
            <p className="mt-1.5 text-sm text-red-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.wilayahId}
            </p>
          )}
        </div>
        
        <div className="flex justify-between space-x-4 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handlePrevStep}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Kembali
          </Button>
          <Button 
            type="button" 
            variant="primary" 
            onClick={handleNextStep}
          >
            Lanjutkan
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Button>
        </div>
      </div>
    );
  };
  
  // Render step 3 - Upload Foto
  const renderStep3 = () => {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-1">Unggah Foto Profil</h3>
          <p className="text-sm text-gray-600 mb-4">Unggah foto profil Anda dengan ukuran maksimal 2MB (format: JPG, JPEG, PNG)</p>
          
          <div className="mb-6 flex flex-col items-center">
            <FileInput
              label=""
              showPreview
              previewUrl={previewUrl}
              onFileChange={handleFileUpload}
              buttonLabel="Pilih Foto"
              buttonIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              }
              error={errors.profile_picture}
              helperText="Foto akan digunakan untuk identifikasi relawan"
              acceptedFileTypes="image/jpeg,image/png,image/jpg"
              maxSizeMB={2}
              className="mx-auto max-w-sm"
            />
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md mb-4">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mt-0.5 mr-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-blue-800">Perhatian</h4>
              <p className="mt-1 text-sm text-blue-700">
                Dengan mendaftar sebagai relawan, Anda setuju untuk mematuhi peraturan dan ketentuan yang berlaku di BakuBantu. Admin akan memverifikasi data Anda sebelum status relawan aktif.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between space-x-4 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handlePrevStep}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Kembali
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Mendaftar...' : 'Daftar Sekarang'}
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <AuthLayout
      title="Daftar Relawan"
      subtitle="Bergabunglah dengan kami dan jadilah bagian dari perubahan positif"
      heroTitle="Jadilah penyambung kebaikan"
      heroDescription="Dengan menjadi relawan, Anda dapat membantu kami mewujudkan misi untuk membantu mereka yang membutuhkan"
      imageSrc="/images/volunteer.png"
      imageAlt="Relawan BakuBantu"
    >
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map((step) => (
            <div 
              key={step} 
              className={`flex flex-col items-center ${
                step < currentStep 
                  ? 'text-babyBlue-dark' 
                  : step === currentStep 
                    ? 'text-gray-800' 
                    : 'text-gray-400'
              }`}
            >
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                step < currentStep 
                  ? 'border-babyBlue bg-babyBlue-light text-babyBlue-dark' 
                  : step === currentStep 
                    ? 'border-gray-800' 
                    : 'border-gray-300'
              }`}>
                {step < currentStep ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step
                )}
              </div>
              <span className="text-xs mt-2">
                {step === 1 ? 'Informasi Pribadi' : step === 2 ? 'Kontak' : 'Foto Profil'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }} className="space-y-6">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Sudah memiliki akun?{' '}
        <Link href="/login" className="font-medium text-babyBlue-dark hover:text-babyBlue transition-colors">
          Masuk di sini
        </Link>
      </p>
    </AuthLayout>
  );
}