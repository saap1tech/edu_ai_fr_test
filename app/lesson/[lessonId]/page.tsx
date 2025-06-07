"use client";

import React, { useEffect, useState } from 'react';
import { Lesson } from '@/lib/types';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { ReadingSession } from '@/components/dashboard/ReadingSession';
import { ComprehensionSession } from '@/components/dashboard/ComprehensionSession';
import { ExerciseSession } from '@/components/dashboard/ExerciseSession';
import { SummarySession } from '@/components/dashboard/SummarySession';
import { LessonProvider, useLesson } from '@/contexts/LessonContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Confetti from 'react-confetti';

function LessonContent({ lessonId }: { lessonId: string }) {
  const { lesson, setLesson, answers, getScore } = useLesson();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState({ score: 0, total: 0 });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await fetch(`/api/lesson/${lessonId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch lesson data.');
        }
        const data = await response.json();
        setLesson(data as Lesson);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to fetch lesson data');
        }
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) {
      fetchLesson();
    }
  }, [lessonId, setLesson]);

  const handleSubmit = async () => {
    if (!user || !lesson) return;
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/lesson/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId: lesson.id,
          userId: user.uid,
          answers,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit lesson.');
      }

      const results = getScore();
      setScore(results);
      setShowResults(true);

      if (results.score / results.total > 0.7) {
        setShowConfetti(true);
      }

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to submit lesson');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!lesson) return <p className="text-center">Lesson not found.</p>;

  return (
    <div className="container mx-auto py-8">
      {showConfetti && <Confetti />}
      <h1 className="text-4xl font-bold text-brand-primary mb-8">{lesson.title}</h1>
      <div className="space-y-12">
        <ReadingSession content={lesson.content} vocabulary={lesson.vocabulary} />
        <ComprehensionSession questions={lesson.comprehensionQuestions} />
        <ExerciseSession exercises={lesson.exercises} />
        <SummarySession summary={lesson.summary} />

        <div className="mt-12 text-center">
          <Button
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Lesson'}
          </Button>
        </div>
      </div>

      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="bg-slate-200">
          <DialogHeader>
            <DialogTitle>Lesson Complete!</DialogTitle>
            <DialogDescription>
              Great job! Here is how you did:
            </DialogDescription>
          </DialogHeader>
          <div className="my-4 text-center text-4xl font-bold">
            {score.score} / {score.total}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowResults(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = React.use(params);

  return (
    <LessonProvider>
      <LessonContent lessonId={lessonId} />
    </LessonProvider>
  );
} 