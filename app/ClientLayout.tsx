"use client";

import { usePathname, useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import { Toaster } from 'react-hot-toast';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

function AppContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user && pathname !== '/login') {
    router.push('/login');
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (user && pathname === '/login') {
    router.push('/dashboard');
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      {user && pathname !== '/login' && <Header />}
      <main>{children}</main>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AppContent>{children}</AppContent>
    </AuthProvider>
  );
} 