"use client";
import Header from "../../components/layout/Header";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-brand-background">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-background">
      <Header />
      <main className="flex-grow container py-8">
        {children}
      </main>
    </div>
  );
}