// src/components/pages/admin/AddAdminModal.tsx
import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/contexts/ToastContext';

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string, password: string, role: 'ADMIN' | 'SUPERADMIN') => Promise<void>;
  isSubmitting: boolean;
}

const AddAdminModal: React.FC<AddAdminModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting
}) => {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'SUPERADMIN'>('ADMIN');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      email?: string;
      password?: string;
    } = {};
    
    // Email validation
    if (!email) {
      newErrors.email = 'Email harus diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    // Password validation
    if (!password) {
      newErrors.password = 'Password harus diisi';
    } else if (password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    await onSubmit(email, password, role);
    
    // Clear form
    setEmail('');
    setPassword('');
    setRole('ADMIN');
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all">
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
              Tambah Admin Baru
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Buat akun admin baru untuk sistem BakuBantu
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email admin"
              error={errors.email}
              required
              leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              }
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              error={errors.password}
              required
              leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              }
            />
            
            <Select
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'ADMIN' | 'SUPERADMIN')}
              options={[
                { value: 'ADMIN', label: 'Admin' },
                { value: 'SUPERADMIN', label: 'Super Admin' }
              ]}
            />
            
            <div className="mt-6 flex justify-end space-x-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Tambah Admin
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAdminModal;