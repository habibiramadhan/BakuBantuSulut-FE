// src/services/orphanageService.ts
import { api } from '@/lib/http-client';
import { Orphanage, Wilayah, Yayasan } from '@/types/orphanage';

/**
 * Service for orphanage related API calls
 * Contains methods for fetching orphanages, wilayah, and yayasan data
 */
export const orphanageService = {
  /**
   * Get all active orphanages
   */
  getActiveOrphanages: () => {
    return api.get<{ message: string; data: Orphanage[] }>('/panti/active');
  },

  /**
   * Get orphanage by ID
   * @param id Orphanage ID
   */
  getOrphanageById: (id: number) => {
    return api.get<{ message: string; data: Orphanage }>(`/panti/${id}`);
  },

  /**
   * Get all active wilayah (regions)
   */
  getActiveWilayah: () => {
    return api.get<{ message: string; data: Wilayah[] }>('/wilayah/active');
  },

  /**
   * Get all active yayasan (foundations)
   */
  getActiveYayasan: () => {
    return api.get<{ message: string; data: Yayasan[] }>('/yayasan/active');
  }
};

export default orphanageService;