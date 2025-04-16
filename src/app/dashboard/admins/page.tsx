// src/app/dashboard/admins/page.tsx
"use client";

import { useEffect } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { getUser } from '@/services/auth';
import { useRouter } from 'next/navigation';

interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SUPERADMIN';
  region: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
}

export default function AdminsPage() {
  const router = useRouter();
  const toast = useToast();
  
  // Check if user is SUPERADMIN
  const user = getUser();
  const isSuperAdmin = user?.role === 'SUPERADMIN';
  
  useEffect(() => {
    // If not SUPERADMIN, redirect to dashboard
    if (!isSuperAdmin) {
      toast.error('Anda tidak memiliki akses ke halaman ini', 'Akses Ditolak');
      router.push('/dashboard');
    }
  }, [isSuperAdmin, router, toast]);
  
  // Mock data - in a real app, this would come from an API
  const mockAdmins: Admin[] = [
    {
      id: '1',
      name: 'Admin Utama',
      email: 'superadmin@bakubantu.id',
      role: 'SUPERADMIN',
      region: 'Pusat',
      status: 'active',
      lastLogin: '2025-04-12T15:30:00',
      createdAt: '2024-12-01'
    },
    {
      id: '2',
      name: 'Ahmad Fauzi',
      email: 'ahmad.fauzi@bakubantu.id',
      role: 'ADMIN',
      region: 'DKI Jakarta',
      status: 'active',
      lastLogin: '2025-04-10T09:15:00',
      createdAt: '2025-01-10'
    },
    {
      id: '3',
      name: 'Siti Rahayu',
      email: 'siti.rahayu@bakubantu.id',
      role: 'ADMIN',
      region: 'Jawa Barat',
      status: 'active',
      lastLogin: '2025-04-11T14:20:00',
      createdAt: '2025-01-15'
    },
    {
      id: '4',
      name: 'Budi Santoso',
      email: 'budi.santoso@bakubantu.id',
      role: 'ADMIN',
      region: 'Jawa Timur',
      status: 'inactive',
      lastLogin: '2025-03-25T10:45:00',
      createdAt: '2025-02-05'
    },
    {
      id: '5',
      name: 'Dewi Lestari',
      email: 'dewi.lestari@bakubantu.id',
      role: 'ADMIN',
      region: 'Sulawesi Selatan',
      status: 'active',
      lastLogin: '2025-04-08T11:30:00',
      createdAt: '2025-02-10'
    }
  ];

  const initialFormData = {
    name: '',
    email: '',
    role: 'ADMIN',
    region: '',
    password: '',
    confirmPassword: ''
  };

  const initialFormErrors = {
    name: '',
    email: '',
    region: '',
    password: '',
    confirmPassword: ''
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: '',
      email: '',
      region: '',
      password: '',
      confirmPassword: ''
    };
    
    if (!initialFormData.name.trim()) {
      newErrors.name = 'Nama lengkap wajib diisi';
      valid = false;
    }
    
    if (!initialFormData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(initialFormData.email)) {
      newErrors.email = 'Format email tidak valid';
      valid = false;
    }
    
    if (!initialFormData.region.trim()) {
      newErrors.region = 'Wilayah wajib diisi';
      valid = false;
    }
    
    if (!initialFormData.password) {
      newErrors.password = 'Password wajib diisi';
      valid = false;
    } else if (initialFormData.password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter';
      valid = false;
    }
    
    if (initialFormData.password !== initialFormData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak sama';
      valid = false;
    }
    
    return { valid, errors: newErrors };
  };

  return (
    <div>
      {/* Add your JSX here */}
    </div>
  );
}