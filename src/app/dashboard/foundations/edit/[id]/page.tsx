// src/app/dashboard/foundations/edit/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { useToast } from '@/contexts/ToastContext';
import EditYayasanForm from '@/components/pages/yayasan/EditYayasanForm';
import { useYayasan } from '@/hooks/useYayasan';
import { YayasanResponse } from '@/services/yayasanService';

export default function EditYayasanPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id ? parseInt(params.id as string, 10) : 0;
  const toast = useToast();
  
  const { fetchYayasanById, updateYayasan, isSaving } = useYayasan();
  const [yayasan, setYayasan] = useState<YayasanResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadYayasan() {
      if (!id || isNaN(id)) {
        toast.error('ID Yayasan tidak valid');
        router.push('/dashboard/foundations');
        return;
      }

      try {
        setIsLoading(true);
        const data = await fetchYayasanById(id);
        if (data) {
          setYayasan(data);
        } else {
          toast.error('Yayasan tidak ditemukan');
          router.push('/dashboard/foundations');
        }
      } catch (error) {
        console.error('Error fetching yayasan:', error);
        toast.error('Gagal memuat data yayasan');
        router.push('/dashboard/foundations');
      } finally {
        setIsLoading(false);
      }
    }

    loadYayasan();
  }, [id, router, toast, fetchYayasanById]);

  const handleSubmit = async (data: any) => {
    try {
      const success = await updateYayasan(id, data);
      if (success) {
        toast.success('Yayasan berhasil diperbarui');
        router.push('/dashboard/foundations');
      }
    } catch (error) {
      console.error('Error updating yayasan:', error);
      toast.error('Gagal memperbarui yayasan');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading size="lg" text="Memuat data yayasan..." />
      </div>
    );
  }

  if (!yayasan) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Yayasan tidak ditemukan</h3>
        <p className="mt-2 text-gray-500">Data yayasan yang Anda cari tidak dapat ditemukan.</p>
        <Button 
          variant="primary" 
          className="mt-4"
          onClick={() => router.push('/dashboard/foundations')}
        >
          Kembali ke Daftar Yayasan
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Yayasan</h1>
          <p className="text-gray-600 mt-1">
            Perbarui informasi yayasan {yayasan.namaYayasan}
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
        <EditYayasanForm
          yayasan={yayasan}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          isSubmitting={isSaving}
        />
      </div>
    </div>
  );
}