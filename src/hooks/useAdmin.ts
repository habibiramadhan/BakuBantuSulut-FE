// src/hooks/useAdmin.ts
import { useState, useCallback } from 'react';
import { useToast } from '@/contexts/ToastContext';
import adminService, { AdminResponse, CreateAdminParams } from '@/services/adminService';
import { handleApiError } from '@/lib/api-error-utils';

interface UseAdminReturn {
  admins: AdminResponse[];
  isLoading: boolean;
  isSaving: boolean;
  fetchAdmins: () => Promise<AdminResponse[]>;
  createAdmin: (data: CreateAdminParams) => Promise<boolean>;
  deleteAdmin: (id: string) => Promise<boolean>;
  resetPassword: (id: string) => Promise<string | null>;
  updateStatus: (id: string, status: 'ACTIVE' | 'INACTIVE') => Promise<boolean>;
}

export function useAdmin(): UseAdminReturn {
  const [admins, setAdmins] = useState<AdminResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  const fetchAdmins = useCallback(async (): Promise<AdminResponse[]> => {
    try {
      setIsLoading(true);
      const response = await adminService.getAllAdmins();
      setAdmins(response.data);
      return response.data;
    } catch (error) {
      handleApiError(error, toast);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const createAdmin = useCallback(async (data: CreateAdminParams): Promise<boolean> => {
    try {
      setIsSaving(true);
      const response = await adminService.createAdmin(data);
      
      // Update local state
      setAdmins(prev => [...prev, response.data]);
      
      toast.success('Admin baru berhasil ditambahkan');
      return true;
    } catch (error) {
      handleApiError(error, toast);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  const deleteAdmin = useCallback(async (id: string): Promise<boolean> => {
    try {
      setIsSaving(true);
      await adminService.deleteAdmin(id);
      
      // Update local state
      setAdmins(prev => prev.filter(admin => admin.id !== id));
      
      toast.success('Admin berhasil dihapus');
      return true;
    } catch (error) {
      handleApiError(error, toast);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  const resetPassword = useCallback(async (id: string): Promise<string | null> => {
    try {
      setIsSaving(true);
      const response = await adminService.resetPassword(id);
      
      toast.success('Password admin berhasil direset');
      return response.data.newPassword;
    } catch (error) {
      handleApiError(error, toast);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  const updateStatus = useCallback(async (id: string, status: 'ACTIVE' | 'INACTIVE'): Promise<boolean> => {
    try {
      setIsSaving(true);
      await adminService.updateStatus(id, status);
      
      // Update local state
      setAdmins(prev => 
        prev.map(admin => admin.id === id ? { ...admin, status } : admin)
      );
      
      const statusText = status === 'ACTIVE' ? 'aktif' : 'tidak aktif';
      toast.success(`Status admin berhasil diubah menjadi ${statusText}`);
      return true;
    } catch (error) {
      handleApiError(error, toast);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  return {
    admins,
    isLoading,
    isSaving,
    fetchAdmins,
    createAdmin,
    deleteAdmin,
    resetPassword,
    updateStatus
  };
}

export default useAdmin;