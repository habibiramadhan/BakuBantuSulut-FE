// src/app/dashboard/volunteers/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { DashboardSection } from '@/components/pages/dashboard';
import VolunteersTable from '@/components/pages/volunteer/VolunteersTable';
import VolunteerStats from '@/components/pages/volunteer/VolunteerStats';
import AddVolunteerModal from '@/components/pages/volunteer/AddVolunteerModal';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/contexts/ToastContext';
import { useVolunteer } from '@/hooks/useVolunteer';

export default function VolunteersPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const toast = useToast();
  const { 
    volunteers, 
    isLoading, 
    fetchVolunteers, 
    addVolunteer 
  } = useVolunteer();

  // Wrapper function to handle fetchVolunteers that returns Promise<VolunteerResponse[]>
  const handleFetchVolunteers = useCallback(async () => {
    try {
      await fetchVolunteers();
    } catch (error) {
      console.error('Failed to fetch volunteers:', error);
    }
  }, [fetchVolunteers]);

  useEffect(() => {
    handleFetchVolunteers();
  }, [handleFetchVolunteers]);

  const handleAddVolunteer = () => {
    setShowAddModal(true);
  };

  // This is a void function that doesn't return anything
  const handleVolunteerAdded = (formData: globalThis.FormData) => {
    // We use void here to explicitly indicate we're ignoring the Promise result
    void addVolunteer(formData).then(success => {
      if (success) {
        setShowAddModal(false);
        toast.success('Relawan berhasil ditambahkan');
        // Refresh the volunteers list
        void handleFetchVolunteers();
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relawan</h1>
          <p className="mt-1 text-sm text-gray-500">
            Kelola data dan informasi relawan yang tergabung dengan bakubantu
          </p>
        </div>
        <Button 
          variant="primary" 
          onClick={handleAddVolunteer}
          leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          }
        >
          Tambah Relawan
        </Button>
      </div>

      {/* Stats Overview */}
      <VolunteerStats volunteers={volunteers} />

      {/* Volunteers Table */}
      <DashboardSection
        title="Daftar Relawan"
        description="Berikut adalah daftar relawan yang terdaftar di sistem."
      >
        <VolunteersTable 
          volunteers={volunteers} 
          isLoading={isLoading} 
          onRefresh={handleFetchVolunteers} 
        />
      </DashboardSection>

      {/* Add Volunteer Modal */}
      {showAddModal && (
        <AddVolunteerModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleVolunteerAdded}
        />
      )}
    </div>
  );
}