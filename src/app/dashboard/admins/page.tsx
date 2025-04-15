// src/app/dashboard/admins/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
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
  const [admins, setAdmins] = useState<Admin[]>([
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
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'ADMIN',
    region: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    region: '',
    password: '',
    confirmPassword: ''
  });

  // Get unique regions for the filter
  const regions = Array.from(new Set(admins.map(a => a.region)));

  // Filtered admins based on search and filters
  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          admin.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || admin.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || admin.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: '',
      email: '',
      region: '',
      password: '',
      confirmPassword: ''
    };
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nama lengkap wajib diisi';
      valid = false;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
      valid = false;
    }
    
    if (!formData.region.trim()) {
      newErrors.region = 'Wilayah wajib diisi';
      valid = false;
    }
    
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter';
      valid = false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak sama';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddAdmin = () => {
    if (!validateForm()) return;
    
    // In a real app, this would be an API call
    const newAdminData: Admin = {
      id: `${admins.length + 1}`,
      name: formData.name,
      email: formData.email,
      role: formData.role as 'ADMIN' | 'SUPERADMIN',
      region: formData.region,
      status: 'active',
      lastLogin: '-',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setAdmins([...admins, newAdminData]);
    setFormData({
      name: '',
      email: '',
      role: 'ADMIN',
      region: '',
      password: '',
      confirmPassword: ''
    });
    setShowAddForm(false);
    toast.success('Admin baru berhasil ditambahkan');
  };

  const handleStatusChange = (id: string, newStatus: 'active' | 'inactive') => {
    setAdmins(admins.map(admin => 
      admin.id === id ? { ...admin, status: newStatus } : admin
    ));
    
    toast.success(`Status admin berhasil diubah menjadi ${newStatus === 'active' ? 'aktif' : 'tidak aktif'}`);
  };

  // Status badge colors
  const getStatusBadge = (status: Admin['status']) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Aktif</span>;
      case 'inactive':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Tidak Aktif</span>;
      default:
        return null;
    }
  };

  // Role badge colors
  const getRoleBadge = (role: Admin['role']) => {
    switch (role) {
      case 'SUPERADMIN':
        return <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">Super Admin</span>;
      case 'ADMIN':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Admin</span>;
      default:
        return null;
    }
  }};