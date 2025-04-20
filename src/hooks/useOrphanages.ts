// src/hooks/useOrphanages.ts
import { useState, useEffect, useMemo } from 'react';
import { Orphanage } from '@/types/orphanage';

// Mock data for development
const mockOrphanages: Orphanage[] = [
  {
    id: '1',
    name: 'Panti Asuhan Kasih Bersama',
    location: 'Manado',
    foundation: 'Yayasan Peduli Kasih',
    childrenCount: 45,
    description: 'Merawat dan mendidik anak-anak kurang mampu agar memiliki masa depan yang cerah. Fokus pada pendidikan formal dan pelatihan keterampilan hidup.',
    imageUrl: '/images/orphanages/orphanage-1.jpg'
  },
  {
    id: '2',
    name: 'Panti Asuhan Tunas Harapan',
    location: 'Tomohon',
    foundation: 'Yayasan Harapan Baru',
    childrenCount: 32,
    description: 'Didirikan tahun 1995 untuk menampung anak-anak dari keluarga tidak mampu. Menyediakan pendidikan, perawatan kesehatan, dan dukungan psikologis.',
    imageUrl: '/images/orphanages/orphanage-2.jpg'
  },
  {
    id: '3',
    name: 'Rumah Anak Ceria',
    location: 'Minahasa',
    foundation: 'Yayasan Cinta Anak',
    childrenCount: 28,
    description: 'Berusaha menciptakan lingkungan yang hangat dan positif bagi anak-anak yatim piatu. Memberikan pendidikan karakter dan keterampilan praktis.',
    imageUrl: '/images/orphanages/orphanage-3.jpg'
  },
  {
    id: '4',
    name: 'Panti Asuhan Bersinar',
    location: 'Minahasa Selatan',
    foundation: 'Yayasan Peduli Anak Bangsa',
    childrenCount: 38,
    description: 'Membantu anak-anak yang kurang beruntung mendapatkan hak pendidikan dan kehidupan yang layak. Fokus pada pendidikan formal dan informal.',
    imageUrl: '/images/orphanages/orphanage-4.jpg'
  },
  {
    id: '5',
    name: 'Panti Asuhan Mentari Pagi',
    location: 'Manado',
    foundation: 'Yayasan Cinta Anak',
    childrenCount: 25,
    description: 'Menyediakan tempat tinggal dan pendidikan bagi anak-anak dari keluarga rentan. Melaksanakan program pemberdayaan anak dengan kegiatan seni dan olahraga.',
    imageUrl: '/images/orphanages/orphanage-5.jpg'
  }
];

// Define constants
const ITEMS_PER_PAGE = 10;

export function useOrphanages() {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedFoundation, setSelectedFoundation] = useState<string>('');

  // Fetch orphanages data (simulated)
  useEffect(() => {
    const fetchOrphanages = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API request
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Set mock data
        setOrphanages(mockOrphanages);
        setError(null);
      } catch (err) {
        setError('Gagal memuat data panti asuhan. Silakan coba lagi nanti.');
        console.error('Error fetching orphanages:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrphanages();
  }, []);

  // Filter orphanages based on search term and filters
  const filteredOrphanages = useMemo(() => {
    return orphanages.filter(orphanage => {
      // Filter by search term
      const matchesSearch = searchTerm 
        ? orphanage.name.toLowerCase().includes(searchTerm.toLowerCase()) 
        : true;
      
      // Filter by region
      const matchesRegion = selectedRegion 
        ? orphanage.location === selectedRegion 
        : true;
      
      // Filter by foundation
      const matchesFoundation = selectedFoundation 
        ? orphanage.foundation === selectedFoundation 
        : true;
      
      return matchesSearch && matchesRegion && matchesFoundation;
    });
  }, [orphanages, searchTerm, selectedRegion, selectedFoundation]);

  // Get unique regions for filter
  const regions = useMemo(() => {
    const uniqueRegions = [...new Set(orphanages.map(o => o.location))];
    return uniqueRegions.sort();
  }, [orphanages]);

  // Get unique foundations for filter
  const foundations = useMemo(() => {
    const uniqueFoundations = [...new Set(orphanages.map(o => o.foundation))];
    return uniqueFoundations.sort();
  }, [orphanages]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredOrphanages.length / ITEMS_PER_PAGE);

  // Get current page items
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrphanages.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredOrphanages, currentPage]);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedRegion('');
    setSelectedFoundation('');
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of the list
    window.scrollTo({
      top: document.getElementById('orphanage-grid')?.offsetTop || 0,
      behavior: 'smooth'
    });
  };

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Handle region change
  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle foundation change
  const handleFoundationChange = (value: string) => {
    setSelectedFoundation(value);
    setCurrentPage(1); // Reset to first page when filters change
  };

  return {
    orphanages,
    filteredOrphanages: currentItems,
    regions,
    foundations,
    currentPage,
    totalPages,
    isLoading,
    error,
    searchTerm,
    selectedRegion,
    selectedFoundation,
    handleSearchChange,
    handleRegionChange,
    handleFoundationChange,
    resetFilters,
    handlePageChange
  };
}