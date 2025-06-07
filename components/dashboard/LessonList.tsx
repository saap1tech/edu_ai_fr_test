'use client';

import { useState, useEffect } from 'react';
import { Lesson } from '@/lib/types';
import LoadingSpinner from '../shared/LoadingSpinner';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { BookOpen } from 'lucide-react';

export default function LessonList() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLessons() {
      try {
        const response = await fetch('/api/lessons');
        if (!response.ok) {
          throw new Error('Failed to fetch lessons');
        }
        const data = await response.json();
        setLessons(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchLessons();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {lessons.map(lesson => (
        <Link href={`/lesson/${lesson.id}`} key={lesson.id}>
          <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-brand-primary">{lesson.title}</CardTitle>
              <CardDescription>{lesson.summary.substring(0, 100)}...</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-gray-500">
                <strong>File:</strong> {lesson.pdfFileName}
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-brand-accent hover:bg-brand-accent/90">
                <BookOpen className="mr-2 h-4 w-4" />
                Start Lesson
              </Button>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
} 