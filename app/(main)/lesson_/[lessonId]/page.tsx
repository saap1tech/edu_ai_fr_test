'use client';

import { useState } from 'react';
import { useLesson } from '@/contexts/LessonContext';
import ReadingSession from '@/components/lesson/ReadingSession';
import ComprehensionSession from '@/components/lesson/ComprehensionSession';
import ExercisesSession from '@/components/lesson/ExercisesSession';
import SummarySession from '@/components/lesson/SummarySession';
import LessonProgress from '@/components/lesson/LessonProgress';

type SessionType = 'reading' | 'comprehension' | 'exercises' | 'summary';

export default function LessonPage() {
  const { currentLesson } = useLesson();
  const [currentSession, setCurrentSession] = useState<SessionType>('reading');
  const [completedSessions, setCompletedSessions] = useState<Set<SessionType>>(new Set());

  if (!currentLesson) {
    return null;
  }

  const completeSession = (session: SessionType) => {
    setCompletedSessions(prev => new Set([...prev, session]));
  };

  const goToNextSession = () => {
    const sessions: SessionType[] = ['reading', 'comprehension', 'exercises', 'summary'];
    const currentIndex = sessions.indexOf(currentSession);
    if (currentIndex < sessions.length - 1) {
      setCurrentSession(sessions[currentIndex + 1]);
    }
  };

  const renderSession = () => {
    switch (currentSession) {
      case 'reading':
        return (
          <ReadingSession
            content={currentLesson.content}
            vocabulary={currentLesson.vocabulary}
            onComplete={() => {
              completeSession('reading');
              goToNextSession();
            }}
          />
        );
      case 'comprehension':
        return (
          <ComprehensionSession
            questions={currentLesson.comprehensionQuestions}
            onComplete={() => {
              completeSession('comprehension');
              goToNextSession();
            }}
          />
        );
      case 'exercises':
        return (
          <ExercisesSession
            exercises={currentLesson.exercises}
            onComplete={() => {
              completeSession('exercises');
              goToNextSession();
            }}
          />
        );
      case 'summary':
        return (
          <SummarySession
            originalText={currentLesson.content}
            onComplete={() => {
              completeSession('summary');
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{currentLesson.title}</h1>
        <LessonProgress
          currentSession={currentSession}
          completedSessions={completedSessions}
        />
      </div>
      {renderSession()}
    </div>
  );
}