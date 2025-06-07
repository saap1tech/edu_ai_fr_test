"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { collection, doc, getDoc, getDocs, query, where, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';
import { Lesson, ComprehensionQuestion, Exercise } from '@/lib/types';

export interface VocabularyItem {
  word: string;
  translation: string;
  pronunciation: string;
  example: string;
}

interface AnswerState {
  [key: string]: string; // Using question text or instruction as a unique ID
}

interface LessonContextType {
  lesson: Lesson | null;
  answers: AnswerState;
  setLesson: (lesson: Lesson | null) => void;
  handleAnswerChange: (questionId: string, answer: string) => void;
  getScore: () => { score: number; total: number };
}

const LessonContext = createContext<LessonContextType | undefined>(undefined);

export function LessonProvider({ children }: { children: ReactNode }) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [answers, setAnswers] = useState<AnswerState>({});

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const getScore = () => {
    if (!lesson) return { score: 0, total: 0 };

    let score = 0;
    const allQuestions = [
      ...(lesson.comprehensionQuestions || []),
      ...(lesson.exercises || []),
    ];

    for (const question of allQuestions) {
      const questionId = 'question' in question ? question.question : question.instruction;
      if (answers[questionId] === question.correctAnswer) {
        score++;
      }
    }
    
    return { score, total: allQuestions.length };
  };

  const value = {
    lesson,
    answers,
    setLesson,
    handleAnswerChange,
    getScore,
  };

  return (
    <LessonContext.Provider value={value}>
      {children}
    </LessonContext.Provider>
  );
}

export function useLesson() {
  const context = useContext(LessonContext);
  if (context === undefined) {
    throw new Error('useLesson must be used within a LessonProvider');
  }
  return context;
}