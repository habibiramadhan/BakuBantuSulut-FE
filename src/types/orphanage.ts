// src/types/orphanage.ts

export interface Orphanage {
    id: string;
    name: string;
    location: string;
    foundation: string;
    childrenCount: number;
    description: string;
    imageUrl: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
    address?: string;
    website?: string;
    foundedYear?: number;
    needs?: string[];
  }
  
  export interface OrphanageFilterProps {
    searchTerm: string;
    selectedRegion: string;
    selectedFoundation: string;
    onSearchChange: (value: string) => void;
    onRegionChange: (value: string) => void;
    onFoundationChange: (value: string) => void;
    onResetFilters: () => void;
  }
  
  export interface OrphanageGridProps {
    orphanages: Orphanage[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }
  
  export interface OrphanageCardProps {
    orphanage: Orphanage;
  }