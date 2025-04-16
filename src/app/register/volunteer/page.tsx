// src/app/register/volunteer/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FileInput } from '@/components/ui/FileInput';
import { useToast } from '@/contexts/ToastContext';
import AuthLayout from '@/components/layouts/AuthLayout';
import { VolunteerFormData, validateStep1, validateStep2, validateProfilePicture } from '@/lib/validations/volunteer-schema';
import { registerVolunteer, getWilayahList } from '@/services/volunteer';
import { Tooltip } from '@/components/ui/Tooltip';

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
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  
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
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 }
    }
  };
  
  const successAnimation = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  };
  
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast.error('Mohon perbaiki kesalahan pada formulir');
    }
  };
  
  // Handler untuk tombol previous step
  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        // Tampilkan animasi sukses
        setShowSuccessAnimation(true);
        
        // Set session storage untuk halaman success
        sessionStorage.setItem('volunteer_registered', 'true');
        
        toast.success(response.message || 'Pendaftaran relawan berhasil! Silakan tunggu konfirmasi dari admin.');
        
        // Redirect ke halaman sukses dengan delay untuk menampilkan animasi
        setTimeout(() => {
          router.push('/volunteer/success');
        }, 2000);
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

  // Komponen animasi sukses yang ditampilkan setelah submit berhasil
  const SuccessAnimation = () => (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-2xl text-center w-11/12 max-w-md"
        variants={successAnimation}
        initial="hidden"
        animate="visible"
      >
        <div className="mb-6 inline-flex justify-center">
          <div className="rounded-full bg-green-100 p-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Pendaftaran Berhasil!</h2>
        <p className="text-gray-600 mb-6">Terima kasih telah mendaftar sebagai relawan. Kami akan menghubungi Anda segera.</p>
        <motion.div 
          className="h-2 bg-gray-200 rounded-full overflow-hidden mb-6"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5 }}
        >
          <motion.div 
            className="h-full bg-gradient-to-r from-babyBlue to-green-500"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5 }}
          />
        </motion.div>
        <p className="text-sm text-gray-500">Mengalihkan ke halaman sukses...</p>
      </motion.div>
    </motion.div>
  );
  
  // Render step 1 - Informasi Pribadi
  const renderStep1 = () => {
    return (
      <motion.div 
        className="space-y-6"
        key="step1"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="bg-gradient-to-r from-babyBlue-light/20 to-lavender-light/20 p-6 rounded-xl mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-babyBlue-dark" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            Informasi Pribadi
          </h3>
          <p className="text-gray-600 text-sm">Langkah 1 dari 3: Informasi dasar untuk identitas Anda sebagai relawan</p>
        </div>

        <div className="group">
          <Input
            label="Nama Lengkap"
            name="namaLengkap"
            value={formData.namaLengkap}
            onChange={handleInputChange}
            placeholder="Contoh: Budi Santoso"
            error={errors.namaLengkap}
            required
            className="transition-all duration-300 group-hover:shadow-md"
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            }
          />
          {formData.namaLengkap && !errors.namaLengkap && (
            <motion.div 
              className="flex items-center text-green-600 mt-1 text-xs"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Nama lengkap valid
            </motion.div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jenis Kelamin <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div 
              className={`border rounded-xl p-4 flex items-center space-x-3 cursor-pointer transition-all ${
                formData.jenisKelamin === 'MALE' 
                  ? 'border-babyBlue bg-babyBlue-light/20 shadow-md' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
              onClick={() => setFormData(prev => ({ ...prev, jenisKelamin: 'MALE' }))}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                formData.jenisKelamin === 'MALE' ? 'border-babyBlue' : 'border-gray-400'
              }`}>
                {formData.jenisKelamin === 'MALE' && (
                  <motion.div 
                    className="w-3 h-3 rounded-full bg-babyBlue" 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  />
                )}
              </div>
              <div>
                <span className="font-medium">Laki-laki</span>
                <p className="text-xs text-gray-500">Pilih jika Anda adalah laki-laki</p>
              </div>
            </div>
            
            <div 
              className={`border rounded-xl p-4 flex items-center space-x-3 cursor-pointer transition-all ${
                formData.jenisKelamin === 'FEMALE' 
                  ? 'border-lavender bg-lavender-light/20 shadow-md' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
              onClick={() => setFormData(prev => ({ ...prev, jenisKelamin: 'FEMALE' }))}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                formData.jenisKelamin === 'FEMALE' ? 'border-lavender' : 'border-gray-400'
              }`}>
                {formData.jenisKelamin === 'FEMALE' && (
                  <motion.div 
                    className="w-3 h-3 rounded-full bg-lavender" 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  />
                )}
              </div>
              <div>
                <span className="font-medium">Perempuan</span>
                <p className="text-xs text-gray-500">Pilih jika Anda adalah perempuan</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="group">
            <Input
              label="Tempat Lahir"
              name="tempatLahir"
              value={formData.tempatLahir}
              onChange={handleInputChange}
              placeholder="Contoh: Jakarta"
              error={errors.tempatLahir}
              required
              className="transition-all duration-300 group-hover:shadow-md"
              leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              }
            />
          </div>
          
          <div className="group">
            <Input
              label="Tanggal Lahir"
              type="date"
              name="tanggalLahir"
              value={formData.tanggalLahir}
              onChange={handleInputChange}
              error={errors.tanggalLahir}
              helperText="Usia minimal 17 tahun"
              required
              className="transition-all duration-300 group-hover:shadow-md"
              leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              }
            />
          </div>
        </div>
        
        <div className="relative group">
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            Alamat Domisili <span className="text-red-500">*</span>
            <Tooltip content="Isi dengan alamat tempat tinggal Anda saat ini">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </Tooltip>
          </label>
          <textarea
            name="alamatDomisili"
            rows={4}
            className={`w-full rounded-xl border ${errors.alamatDomisili ? 'border-red-500' : 'border-gray-300'} bg-white px-4 py-3 text-sm shadow-sm focus:border-babyBlue focus:outline-none focus:ring-1 focus:ring-babyBlue transition-all duration-300 group-hover:shadow-md`}
            value={formData.alamatDomisili}
            onChange={handleInputChange}
            placeholder="Contoh: Jl. Sudirman No. 123, RT 01/RW 02, Kelurahan Setiabudi, Kecamatan Setiabudi, Jakarta Selatan, DKI Jakarta, 12910"
            required
          />
          {errors.alamatDomisili && (
            <motion.p 
              className="mt-1.5 text-sm text-red-500 flex items-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.alamatDomisili}
            </motion.p>
          )}
        </div>
        
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Kewarganegaraan
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
              </svg>
            </div>
            <select
              name="kewarganegaraan"
              className="h-10 w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm shadow-sm focus:border-babyBlue focus:outline-none focus:ring-1 focus:ring-babyBlue transition-all duration-300 group-hover:shadow-md"
              value={formData.kewarganegaraan}
              onChange={handleInputChange}
            >
              <option value="WNI">WNI (Warga Negara Indonesia)</option>
              <option value="WNA">WNA (Warga Negara Asing)</option>
            </select>
          </div>
        </div>
        
        <div className="pt-6">
          <motion.div 
            className="flex justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              type="button" 
              variant="primary" 
              size="full" 
              onClick={handleNextStep}
              className="bg-gradient-to-r from-babyBlue to-babyBlue-dark shadow-lg"
            >
              Lanjutkan
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  };
  
  // Render step 2 - Informasi Kontak
  const renderStep2 = () => {
    return (
      <motion.div 
        className="space-y-6"
        key="step2"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="bg-gradient-to-r from-poppy-light/20 to-mango-light/20 p-6 rounded-xl mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-poppy" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            Informasi Kontak
          </h3>
          <p className="text-gray-600 text-sm">Langkah 2 dari 3: Informasi kontak untuk komunikasi dengan Anda</p>
        </div>

        <div className="group">
          <Input
            label="Nomor HP"
            name="nomorHP"
            value={formData.nomorHP}
            onChange={handleInputChange}
            placeholder="Contoh: 081234567890"
            error={errors.nomorHP}
            required
            className="transition-all duration-300 group-hover:shadow-md"
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            }
          />
          {formData.nomorHP && !errors.nomorHP && (
            <motion.div 
              className="flex items-center text-green-600 mt-1 text-xs"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Nomor HP valid
            </motion.div>
          )}
        </div>
        
        <div className="group">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Contoh: nama@email.com"
            error={errors.email}
            required
            className="transition-all duration-300 group-hover:shadow-md"
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            }
          />
          {formData.email && !errors.email && (
            <motion.div 
              className="flex items-center text-green-600 mt-1 text-xs"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Email valid
            </motion.div>
          )}
        </div>
        
        <div className="group relative">
          <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
            Wilayah <span className="text-red-500">*</span>
            <Tooltip content="Pilih wilayah tempat Anda akan melakukan kegiatan relawan">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </Tooltip>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            {isLoadingWilayah ? (
              <div className="h-10 w-full rounded-xl border border-gray-300 bg-gray-50 pl-10 pr-4 py-2 text-sm shadow-sm flex items-center transition-all">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-babyBlue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-gray-500">Memuat data wilayah...</span>
              </div>
            ) : (
              <select
                name="wilayahId"
                className={`h-10 w-full rounded-xl border ${errors.wilayahId ? 'border-red-500' : 'border-gray-300'} bg-white pl-10 pr-4 py-2 text-sm shadow-sm focus:border-babyBlue focus:outline-none focus:ring-1 focus:ring-babyBlue transition-all duration-300 group-hover:shadow-md`}
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
          </div>
          {errors.wilayahId && (
            <motion.p 
              className="mt-1.5 text-sm text-red-500 flex items-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.wilayahId}
            </motion.p>
          )}
        </div>
        
        {/* Tips untuk kontak */}
        <div className="my-6 bg-babyBlue-light/20 p-4 rounded-xl border border-babyBlue-light/40">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-babyBlue-dark mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-medium text-babyBlue-dark text-sm">Tips</h4>
              <p className="text-sm text-gray-600 mt-1">
                Pastikan alamat email dan nomor HP Anda aktif. Tim kami akan menghubungi Anda melalui kontak ini untuk proses selanjutnya.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between space-x-4 pt-6">
          <motion.div 
            whileHover={{ scale: 1.02, x: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              type="button" 
              variant="outline" 
              onClick={handlePrevStep}
              className="border-gray-300 hover:border-gray-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Kembali
            </Button>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              type="button" 
              variant="primary" 
              onClick={handleNextStep}
              className="bg-gradient-to-r from-poppy to-poppy-dark shadow-lg"
            >
              Lanjutkan
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  };
  
  // Render step 3 - Upload Foto
  const renderStep3 = () => {
    return (
      <motion.div 
        className="space-y-6"
        key="step3"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="bg-gradient-to-r from-forest-light/20 to-mango-light/20 p-6 rounded-xl mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-forest" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            Foto Profil
          </h3>
          <p className="text-gray-600 text-sm">Langkah 3 dari 3: Unggah foto profil Anda</p>
        </div>

        <div className="text-center">
          <div className="mb-10 max-w-md mx-auto">
            <FileInput
              label=""
              showPreview
              previewUrl={previewUrl}
              onFileChange={handleFileUpload}
              buttonLabel={previewUrl ? "Ganti Foto" : "Pilih Foto"}
              buttonIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              }
              error={errors.profile_picture}
              helperText="Upload foto formal dengan latar polos. Ukuran maksimal 2MB (format: JPG, JPEG, PNG)"
              acceptedFileTypes="image/jpeg,image/png,image/jpg"
              maxSizeMB={2}
              className="mx-auto"
            />
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-6">
            <h4 className="font-medium text-lg mb-4">Panduan Foto Profil</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="aspect-square rounded-lg bg-green-50 flex items-center justify-center mb-2 p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xs text-gray-600">Wajah terlihat jelas</p>
              </div>
              <div className="text-center">
                <div className="aspect-square rounded-lg bg-green-50 flex items-center justify-center mb-2 p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xs text-gray-600">Latar polos</p>
              </div>
              <div className="text-center">
                <div className="aspect-square rounded-lg bg-red-50 flex items-center justify-center mb-2 p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xs text-gray-600">Jangan gunakan filter</p>
              </div>
              <div className="text-center">
                <div className="aspect-square rounded-lg bg-red-50 flex items-center justify-center mb-2 p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xs text-gray-600">Hindari foto selfie</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-6">
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
          <motion.div 
            whileHover={{ scale: 1.02, x: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              type="button" 
              variant="outline" 
              onClick={handlePrevStep}
              className="border-gray-300 hover:border-gray-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Kembali
            </Button>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              type="submit" 
              variant="primary" 
              onClick={handleSubmit}
              isLoading={isSubmitting}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-forest to-forest-dark shadow-lg"
            >
              {isSubmitting ? 'Mendaftar...' : 'Daftar Sekarang'}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  };
  
  return (
    <AuthLayout
      title="Daftar Relawan"
      subtitle="Bergabunglah dengan kami dan jadilah bagian dari perubahan positif"
      heroTitle="Jadilah penyambung kebaikan"
      heroDescription="Dengan menjadi relawan, Anda dapat membantu kami mewujudkan misi untuk membantu mereka yang membutuhkan"
      imageSrc="/images/logo_kecil_01.png"
      imageAlt="Relawan BakuBantu"
    >
      {/* Animasi sukses */}
      <AnimatePresence>
        {showSuccessAnimation && <SuccessAnimation />}
      </AnimatePresence>
      
      {/* Progress indicator */}
      <div className="mb-8">
        
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <div 
              key={step} 
              className={`flex flex-col items-center ${
                step <= currentStep 
                  ? 'text-gray-800' 
                  : 'text-gray-400'
              }`}
            >
              <div 
                className={`w-12 h-12 rounded-full ${
                  step < currentStep 
                    ? 'bg-babyBlue-light' 
                    : step === currentStep 
                      ? 'bg-white border-2 border-babyBlue shadow-md' 
                      : 'bg-gray-100 border border-gray-200'
                } flex items-center justify-center mb-2 transition-all duration-300`}
              >
                {step < currentStep ? (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.2 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-babyBlue-dark" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                ) : (
                  <span className={step === currentStep ? 'text-babyBlue-dark font-semibold' : 'text-gray-400'}>
                    {step}
                  </span>
                )}
              </div>
              <motion.span 
                className="text-sm font-medium text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {step === 1 ? 'Informasi Pribadi' : step === 2 ? 'Kontak' : 'Foto Profil'}
              </motion.span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }} className="space-y-6 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <AnimatePresence mode="wait">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </AnimatePresence>
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