// src/services/volunteer.ts
import { VolunteerFormData } from '@/lib/validations/volunteer-schema';

// Interface untuk response dari API
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
}

/**
 * Service untuk mengirimkan data pendaftaran relawan ke API
 */
export async function registerVolunteer(formData: VolunteerFormData): Promise<ApiResponse> {
  try {
    // Dalam implementasi nyata, ini akan mengirim data ke endpoint API
    // Untuk demo, kita simulasikan proses API dengan timeout
    
    // Buat FormData object untuk mengirim file
    const apiFormData = new FormData();
    
    // Tambahkan semua field ke FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'profile_picture' && value) {
        apiFormData.append(key, value as File);
      } else if (value !== null && value !== undefined) {
        apiFormData.append(key, String(value));
      }
    });
    
    // Simulasi API call dengan timeout
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulasi response sukses
    return {
      success: true,
      message: 'Pendaftaran relawan berhasil',
      data: {
        id: 'volunteer-' + Math.floor(Math.random() * 1000),
        name: formData.namaLengkap,
        status: 'pending'
      }
    };
    
    // Dalam implementasi nyata, kode akan terlihat seperti ini:
    /*
    const response = await fetch('/api/volunteers/register', {
      method: 'POST',
      body: apiFormData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || 'Terjadi kesalahan saat mendaftar',
        errors: errorData.errors
      };
    }
    
    const data = await response.json();
    return {
      success: true,
      message: data.message || 'Pendaftaran relawan berhasil',
      data: data.data
    };
    */
    
  } catch (error) {
    console.error('Error registering volunteer:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan saat mendaftar',
    };
  }
}

/**
 * Service untuk mendapatkan daftar wilayah dari API
 */
export async function getWilayahList(): Promise<ApiResponse<{ id: string; nama: string }[]>> {
  try {
    // Dalam implementasi nyata, ini akan mengambil data dari API
    // Untuk demo, kita gunakan data dummy
    
    // Simulasi API call dengan timeout
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Data dummy wilayah
    const wilayahList = [
      { id: '923de570-e2be-480e-96ac-977fdbf22eb0', nama: 'Manado 1' },
      { id: '8f7e6d5c-4b3a-2c1d-0e9f-8a7b6c5d4e3f', nama: 'Manado 2' },
      { id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p', nama: 'Bitung' },
      { id: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6', nama: 'Tomohon' },
      { id: 'p6o5n4m3-l2k1-j0i9-h8g7-f6e5d4c3b2a1', nama: 'Minahasa' },
      { id: '6p5o4n3m-2l1k-0j9i-8h7g-6f5e4d3c2b1a', nama: 'Minahasa Utara' },
    ];
    
    return {
      success: true,
      message: 'Berhasil mendapatkan daftar wilayah',
      data: wilayahList
    };
    
  } catch (error) {
    console.error('Error fetching wilayah list:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan saat mengambil data wilayah',
      data: []
    };
  }
}