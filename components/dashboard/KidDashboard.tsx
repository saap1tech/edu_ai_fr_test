"use client";

import LessonList from './LessonList';

export default function KidDashboard() {
  return (
    <div className='p-8'>
      <h1 className="text-4xl font-bold text-brand-primary mb-8">Your Lessons</h1>
      <LessonList />
    </div>
  );
} 