// src/app/dashboard/orphanages/edit/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { useToast } from '@/contexts/ToastContext';
import EditOrphanageForm from '@/components/pages/orphanages/EditOrphanageForm';
import orphanageService, { UpdateOrphanageDetailParams } from '@/services/orphanageService';

// Interface untuk data API
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

export default function EditOrphanagePage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string, 10);
  const toast = useToast();
  
  const [orphanage, setOrphanage] = useState<OrphanageAPIData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadOrphanage() {
      if (!id || isNaN(id)) {
        toast.error('ID Panti Asuhan tidak valid');
        router.push('/dashboard/orphanages');
        return;
      }

      try {
        setIsLoading(true);
        const response = await orphanageService.getOrphanageById(id);
        
        // Menyesuaikan response ke format yang kita inginkan
        if (response && response.data && response.data.panti) {
          // Di sini kita mungkin perlu melakukan mapping jika formatnya berbeda
          console.log("API Response:", response.data.panti);
          setOrphanage(response.data.panti as unknown as OrphanageAPIData);
        } else {
          toast.error('Panti asuhan tidak ditemukan');
          router.push('/dashboard/orphanages');
        }
      } catch (error) {
        console.error('Error fetching orphanage:', error);
        toast.error('Gagal memuat data panti asuhan');
        router.push('/dashboard/orphanages');
      } finally {
        setIsLoading(false);
      }
    }

    loadOrphanage();
  }, [id, router, toast]);

  const handleSubmit = async (formData: FormData, detailData: UpdateOrphanageDetailParams) => {
    try {
      setIsSubmitting(true);
      
      // First update the orphanage basic info
      await orphanageService.updateOrphanage(id, formData);
      
      // Then update the orphanage details
      await orphanageService.updateOrphanageDetail(id, detailData);
      
      toast.success('Panti asuhan berhasil diperbarui');
      router.push('/dashboard/orphanages');
    } catch (error) {
      console.error('Error updating orphanage:', error);
      toast.error('Gagal memperbarui panti asuhan');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading size="lg" text="Memuat data panti asuhan..." />
      </div>
    );
  }

  if (!orphanage) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Panti asuhan tidak ditemukan</h3>
        <p className="mt-2 text-gray-500">Data panti asuhan yang Anda cari tidak dapat ditemukan.</p>
        <Button 
          variant="primary" 
          className="mt-4"
          onClick={() => router.push('/dashboard/orphanages')}
        >
          Kembali ke Daftar Panti Asuhan
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Panti Asuhan</h1>
          <p className="text-gray-600 mt-1">
            Perbarui informasi panti asuhan {orphanage.nama_panti}
          </p>
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
        <EditOrphanageForm
          orphanage={orphanage}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}