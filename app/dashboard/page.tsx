"use client";

import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from '../../components/dashboard/AdminDashboard';
import KidDashboard from '../../components/dashboard/KidDashboard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    // This should technically be handled by the layout, but as a fallback:
    return <p>Redirecting to login...</p>;
  }

  return user.role === 'admin' ? <AdminDashboard /> : <KidDashboard />;
} 