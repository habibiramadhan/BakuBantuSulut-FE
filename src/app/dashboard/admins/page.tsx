// src/app/dashboard/admins/page.tsx (updated)
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardSection } from '@/components/pages/dashboard';
import { useToast } from '@/contexts/ToastContext';
import { 
  AdminsTable, 
  AddAdminModal, 
  DeleteConfirmModal, 
  PasswordResetModal,
  AdminMobileView,
  AdminHeader
} from '@/components/pages/admin';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminsPage() {
  const {
    admins,
    isLoading,
    isSaving,
    fetchAdmins,
    createAdmin,
    deleteAdmin,
    resetPassword,
    updateStatus
  } = useAdmin();
  
  const toast = useToast();
  const router = useRouter();
  const { hasPermission } = useAuth();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check if user has permission to access this page
  useEffect(() => {
    if (!hasPermission('SUPERADMIN')) {
      router.push('/dashboard');
      toast.error('Anda tidak memiliki akses ke halaman ini');
      return;
    }
    
    // Fetch admins on component mount
    fetchAdmins();
  }, [hasPermission, router, toast, fetchAdmins]);

  const handleAddAdmin = async (email: string, password: string, role: 'ADMIN' | 'SUPERADMIN') => {
    const success = await createAdmin({ email, password, role });
    if (success) {
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setAdminToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!adminToDelete) return;
    
    const success = await deleteAdmin(adminToDelete);
    if (success) {
      setIsDeleteModalOpen(false);
      setAdminToDelete(null);
    }
  };

  const handleResetPassword = async (id: string) => {
    const newPasswordFromApi = await resetPassword(id);
    if (newPasswordFromApi) {
      setNewPassword(newPasswordFromApi);
      setIsResetModalOpen(true);
    }
  };

  const handleToggleStatus = async (id: string, newStatus: 'ACTIVE' | 'INACTIVE') => {
    await updateStatus(id, newStatus);
  };

  // Calculate stats
  const activeAdmins = admins.filter(admin => admin.status === 'ACTIVE').length;
  const inactiveAdmins = admins.filter(admin => admin.status === 'INACTIVE').length;

  return (
    <div className="space-y-6">
      <AdminHeader
        totalAdmins={admins.length}
        activeAdmins={activeAdmins}
        inactiveAdmins={inactiveAdmins}
        onAddClick={() => setIsAddModalOpen(true)}
      />

      <DashboardSection
        title="Daftar Admin"
        description="Kelola akun admin untuk sistem BakuBantu"
      >
        {isMobile ? (
          <AdminMobileView
            admins={admins}
            onDelete={handleDeleteClick}
            onResetPassword={handleResetPassword}
            onToggleStatus={handleToggleStatus}
          />
        ) : (
          <AdminsTable 
            admins={admins}
            isLoading={isLoading}
            onDelete={handleDeleteClick}
            onResetPassword={handleResetPassword}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </DashboardSection>

      {/* Add Admin Modal */}
      <AddAdminModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddAdmin}
        isSubmitting={isSaving}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isSaving}
      />

      {/* Password Reset Modal */}
      <PasswordResetModal 
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        newPassword={newPassword}
      />
    </div>
  );
}