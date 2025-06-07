"use client";

import { useEffect, useState } from 'react';
import { User } from '@/lib/types';
import UploadLessonButton from './UploadLessonButton';
import LoadingSpinner from '../shared/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LessonList from './LessonList';
import Link from 'next/link';

export default function AdminDashboard() {
  const { firebaseUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!firebaseUser) return;
      try {
        const token = await firebaseUser.getIdToken();
        const response = await fetch('/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch users.');
        }

        const data = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [firebaseUser]);

  return (
    <div className='p-8'>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-brand-primary">Admin Dashboard</h1>
        <UploadLessonButton />
      </div>

      <Tabs defaultValue="lessons" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        <TabsContent value="lessons">
          <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <h2 className="text-2xl font-bold mb-4">All Lessons</h2>
            <LessonList />
          </div>
        </TabsContent>
        <TabsContent value="users">
          <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <h2 className="text-2xl font-bold mb-4">Users</h2>
            {loading && <LoadingSpinner />}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
              <div className="space-y-4">
                {users.map((user) => (
                  <Link href={`/progress/${user.uid}`} key={user.uid}>
                    <div className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div>
                        <p className="font-semibold">{user.displayName || 'No Name'}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <p className="text-sm font-medium capitalize text-gray-700">{user.role}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 