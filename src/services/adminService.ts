// src/services/adminService.ts
import { api } from '@/lib/http-client';

export interface AdminResponse {
  id: string;
  email: string;
  role: 'ADMIN' | 'SUPERADMIN';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  volunteerInfo?: VolunteerInfo | null;
}

interface VolunteerInfo {
  id: string;
  namaLengkap: string;
  email: string;
  profileImage?: string;
  wilayah?: {
    id: number;
    nama: string;
  }
}

export interface CreateAdminParams {
  email: string;
  password: string;
  role: 'ADMIN' | 'SUPERADMIN';
}

export const adminService = {
  /**
   * Get all admins
   */
  getAllAdmins: () => {
    return api.get<{ message: string; data: AdminResponse[] }>('/auth/admins');
  },

  /**
   * Create a new admin
   * @param data Admin data
   */
  createAdmin: (data: CreateAdminParams) => {
    return api.post<{ message: string; data: AdminResponse }>('/auth/admins', data);
  },

  /**
   * Delete an admin
   * @param id Admin ID
   */
  deleteAdmin: (id: string) => {
    return api.delete<{ message: string }>(`/auth/admins/${id}`);
  },

  /**
   * Reset admin password
   * @param id Admin ID
   */
  resetPassword: (id: string) => {
    return api.post<{ message: string; data: { newPassword: string } }>(`/auth/admins/${id}/reset-password`, {});
  },

  /**
   * Update admin status
   * @param id Admin ID
   * @param status New status
   */
  updateStatus: (id: string, status: 'ACTIVE' | 'INACTIVE') => {
    return api.patch<{ message: string }>(`/auth/admins/${id}/status`, { status });
  }
};

export default adminService;