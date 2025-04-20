// src/types/orphanage.ts

export interface Orphanage {
  id: number;
  namaPanti: string;
  fotoUtama: string;
  deskripsiSingkat: string;
  jumlahAnak: number;
  status: string;
  yayasanId: number;
  wilayahId: number;
  createdAt: string;
  updatedAt: string;
  yayasan: {
    id: number;
    namaYayasan: string;
  };
  wilayah: {
    id: number;
    nama: string;
    provinsi: string | null;
  };
}

export interface Wilayah {
  id: number;
  nama: string;
  provinsi: string | null;
  createdAt: string;
  updatedAt: string;
  status: string;
}

export interface Yayasan {
  id: number;
  namaYayasan: string;
  alamatYayasan: string;
  emailYayasan: string;
  kontakYayasan: {
    jabatan: string;
    nama_kontak: string;
    nomor_telepon: string;
  }[];
}

export interface OrphanageFilterProps {
  searchTerm: string;
  selectedRegion: number | null;
  selectedYayasan: number | null;
  onSearchChange: (value: string) => void;
  onRegionChange: (value: number | null) => void;
  onYayasanChange: (value: number | null) => void;
  onResetFilters: () => void;
}

export interface OrphanageGridProps {
  orphanages: Orphanage[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export interface OrphanageCardProps {
  orphanage: Orphanage;
}