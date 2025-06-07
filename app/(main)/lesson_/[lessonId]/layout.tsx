'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useLesson } from '@/contexts/LessonContext';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function LessonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { lessonId } = useParams();
  const { fetchLesson, loading, error } = useLesson();

  useEffect(() => {
    if (lessonId) {
      fetchLesson(lessonId as string);
    }
  }, [lessonId, fetchLesson]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
} 