"use client";

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { LogOut } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  const { user } = useAuth();

  const handleLogout = async () => {
    await auth.signOut();
  };

  if (!user) {
    return null;
  }

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <div className="text-2xl font-bold text-brand-primary">EduAI</div>
        </Link>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">
            Welcome, {user.displayName || 'User'}!
          </span>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}