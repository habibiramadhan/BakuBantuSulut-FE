// src/components/pages/volunteer/AddVolunteerModal.tsx
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { FileInput } from '@/components/ui/FileInput';
import { useToast } from '@/contexts/ToastContext';
import { getWilayahList } from '@/services/volunteerService';
import { objectToFormData } from '@/lib/form-utils';
import { VolunteerFormData, validateStep1, validateStep2, validateProfilePicture } from '@/lib/validations/volunteer-schema';

interface AddVolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (formData: FormData) => void;
}

const AddVolunteerModal: React.FC<AddVolunteerModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<VolunteerFormData>({
    namaLengkap: '',
    jenisKelamin: 'MALE',
    tempatLahir: '',
    tanggalLahir: '',
    alamatDomisili: '',
    kewarganegaraan: 'INDONESIA',
    nomorHP: '',
    email: '',
    wilayahId: '',
    profileImage: null
  });
  
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [wilayahOptions, setWilayahOptions] = useState<{ value: string; label: string }[]>([]);
  const [isLoadingWilayah, setIsLoadingWilayah] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch wilayah options on mount
  useEffect(() => {
    fetchWilayahOptions();
  }, []);

  const fetchWilayahOptions = async () => {
    try {
      setIsLoadingWilayah(true);
      const response = await getWilayahList();
      
      if (response.success && response.data) {
        const options = response.data.map(wilayah => ({
          value: wilayah.id.toString(),
          label: wilayah.nama
        }));
        setWilayahOptions(options);
      } else {
        toast.error('Gagal memuat data wilayah');
      }
    } catch (error) {
      console.error('Error fetching wilayah:', error);
      toast.error('Terjadi kesalahan saat memuat data wilayah');
    } finally {
      setIsLoadingWilayah(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (file: File | null) => {
    setProfileImage(file);
    
    // Clear error when file is changed
    if (errors.profileImage) {
      setErrors(prev => ({ ...prev, profileImage: '' }));
    }
  };

  const validateCurrentStep = (): boolean => {
    let currentErrors: Record<string, string> = {};
    
    if (step === 1) {
      // Use proper typing for validation functions
      currentErrors = validateStep1(formData);
    } else if (step === 2) {
      currentErrors = validateStep2(formData);
    } else if (step === 3 && profileImage) {
      const profileImageError = validateProfilePicture(profileImage);
      if (profileImageError) {
        currentErrors.profileImage = profileImageError;
      }
    }
    
    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setStep(prev => prev + 1);
    } else {
      toast.error('Form berisi kesalahan. Silakan periksa kembali.');
    }
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
      toast.error('Form berisi kesalahan. Silakan periksa kembali.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create FormData object
      const submitFormData = objectToFormData(formData);
      
      // Add profile image if it exists
      if (profileImage) {
        submitFormData.append('profileImage', profileImage);
      }
      
      // Call the onSuccess callback with the form data
      onSuccess(submitFormData);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Gagal menambahkan relawan');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all">
          <div className="absolute top-4 right-4">
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Tambah Relawan Baru
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Silakan lengkapi formulir di bawah ini untuk menambahkan relawan baru.
            </p>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between">
              <div className={`text-xs ${step >= 1 ? 'text-babyBlue-dark' : 'text-gray-500'}`}>
                Informasi Pribadi
              </div>
              <div className={`text-xs ${step >= 2 ? 'text-babyBlue-dark' : 'text-gray-500'}`}>
                Kontak
              </div>
              <div className={`text-xs ${step >= 3 ? 'text-babyBlue-dark' : 'text-gray-500'}`}>
                Foto Profil
              </div>
            </div>
            <div className="mt-2 flex h-2 w-full rounded-full bg-gray-200">
              <div 
                className="rounded-full bg-babyBlue transition-all" 
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <Input
                  label="Nama Lengkap"
                  name="namaLengkap"
                  value={formData.namaLengkap}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap"
                  error={errors.namaLengkap}
                  required
                />
                
                <Select
                  label="Jenis Kelamin"
                  name="jenisKelamin"
                  value={formData.jenisKelamin}
                  onChange={handleChange}
                  options={[
                    { value: 'MALE', label: 'Laki-laki' },
                    { value: 'FEMALE', label: 'Perempuan' }
                  ]}
                  error={errors.jenisKelamin}
                />
                
                <Input
                  label="Tempat Lahir"
                  name="tempatLahir"
                  value={formData.tempatLahir}
                  onChange={handleChange}
                  placeholder="Masukkan tempat lahir"
                  error={errors.tempatLahir}
                  required
                />
                
                <Input
                  label="Tanggal Lahir"
                  name="tanggalLahir"
                  type="date"
                  value={formData.tanggalLahir}
                  onChange={handleChange}
                  error={errors.tanggalLahir}
                  helperText="Usia minimal 17 tahun"
                  required
                />
                
                <Input
                  label="Alamat Domisili"
                  name="alamatDomisili"
                  value={formData.alamatDomisili}
                  onChange={handleChange}
                  placeholder="Masukkan alamat domisili"
                  error={errors.alamatDomisili}
                  required
                />
                
                <Select
                  label="Kewarganegaraan"
                  name="kewarganegaraan"
                  value={formData.kewarganegaraan}
                  onChange={handleChange}
                  options={[
                    { value: 'INDONESIA', label: 'Indonesia' },
                    { value: 'ASING', label: 'Asing' }
                  ]}
                  error={errors.kewarganegaraan}
                />
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-4">
                <Input
                  label="Nomor HP"
                  name="nomorHP"
                  type="tel"
                  value={formData.nomorHP}
                  onChange={handleChange}
                  placeholder="Masukkan nomor HP"
                  error={errors.nomorHP}
                  required
                />
                
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Masukkan alamat email"
                  error={errors.email}
                  required
                />
                
                <Select
                  label="Wilayah"
                  name="wilayahId"
                  value={formData.wilayahId}
                  onChange={handleChange}
                  options={wilayahOptions}
                  error={errors.wilayahId}
                  helperText="Pilih wilayah kegiatan relawan"
                  required
                  disabled={isLoadingWilayah}
                />
                
                {/* Status and Jabatan are not in VolunteerFormData interface, so removed */}
              <div className="h-4"></div> {/* Spacer */}
              </div>
            )}
            
            {step === 3 && (
              <div className="space-y-4">
                <FileInput
                  label="Foto Profil"
                  showPreview={true}
                  previewUrl={profileImage ? URL.createObjectURL(profileImage) : null}
                  onFileChange={handleFileChange}
                  buttonLabel="Pilih Foto"
                  acceptedFileTypes="image/jpeg,image/png,image/jpg"
                  maxSizeMB={2}
                  error={errors.profileImage}
                  helperText="Format: JPG, JPEG, PNG. Maks: 2MB"
                  required
                />
                
                <div className="my-4 border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-500 mb-2">
                    Periksa kembali data-data yang telah diisi sebelum menyimpan.
                  </p>
                </div>
              </div>
            )}
            
            <div className="mt-8 flex justify-between">
              {step > 1 ? (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handlePrevStep}
                >
                  Kembali
                </Button>
              ) : (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                >
                  Batal
                </Button>
              )}
              
              {step < 3 ? (
                <Button 
                  type="button" 
                  variant="primary" 
                  onClick={handleNextStep}
                >
                  Lanjut
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  variant="primary" 
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Simpan Relawan
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddVolunteerModal;