// src/lib/validations/volunteer-schema.ts
/**
 * Skema validasi untuk formulir pendaftaran relawan
 */

export interface VolunteerFormData {
    namaLengkap: string;
    jenisKelamin: 'MALE' | 'FEMALE';
    tempatLahir: string;
    tanggalLahir: string;
    alamatDomisili: string;
    kewarganegaraan: string; // Changed from enum to string to match API
    nomorHP: string;
    email: string;
    wilayahId: string;
    profileImage?: File | null;
  }
  
  // Fungsi untuk validasi formulir step 1
  export const validateStep1 = (formData: Partial<VolunteerFormData>) => {
    const errors: Partial<Record<keyof VolunteerFormData, string>> = {};
    
    if (!formData.namaLengkap?.trim()) {
      errors.namaLengkap = 'Nama lengkap wajib diisi';
    }
    
    if (!formData.tempatLahir?.trim()) {
      errors.tempatLahir = 'Tempat lahir wajib diisi';
    }
    
    if (!formData.tanggalLahir) {
      errors.tanggalLahir = 'Tanggal lahir wajib diisi';
    } else {
      const birthDate = new Date(formData.tanggalLahir);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 17) {
        errors.tanggalLahir = 'Usia minimal 17 tahun';
      }
    }
    
    if (!formData.alamatDomisili?.trim()) {
      errors.alamatDomisili = 'Alamat domisili wajib diisi';
    }
    
    return errors;
  };
  
  // Fungsi untuk validasi formulir step 2
  export const validateStep2 = (formData: Partial<VolunteerFormData>) => {
    const errors: Partial<Record<keyof VolunteerFormData, string>> = {};
    
    if (!formData.nomorHP?.trim()) {
      errors.nomorHP = 'Nomor HP wajib diisi';
    } else if (!/^[0-9+\-\s]+$/.test(formData.nomorHP)) {
      errors.nomorHP = 'Format nomor HP tidak valid';
    }
    
    if (!formData.email?.trim()) {
      errors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Format email tidak valid';
    }
    
    if (!formData.wilayahId) {
      errors.wilayahId = 'Wilayah wajib dipilih';
    }
    
    return errors;
  };
  
  // Fungsi validasi untuk foto profil
  export const validateProfilePicture = (file: File | null | undefined) => {
    if (!file) {
      return 'Foto profil wajib diunggah';
    }
    
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      return 'Ukuran file maksimal 2MB';
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return 'Hanya file JPG, JPEG, dan PNG yang diperbolehkan';
    }
    
    return '';
  };
  
  // Fungsi untuk validasi keseluruhan formulir
  export const validateVolunteerForm = (formData: VolunteerFormData) => {
    const step1Errors = validateStep1(formData);
    const step2Errors = validateStep2(formData);
    const profilePictureError = validateProfilePicture(formData.profileImage);
    
    const errors: Partial<Record<keyof VolunteerFormData, string>> = {
      ...step1Errors,
      ...step2Errors
    };
    
    if (profilePictureError) {
      errors.profileImage = profilePictureError;
    }
    
    return errors;
  };