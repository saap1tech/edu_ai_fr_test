'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useLesson } from '@/contexts/LessonContext';

interface Exercise {
  id: string;
  type: 'grammar' | 'spelling' | 'sentence-ordering';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
}

interface ExercisesSessionProps {
  exercises: Exercise[];
  onComplete: () => void;
}

function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-move rounded-lg border bg-white p-4 shadow-sm"
    >
      {children}
    </div>
  );
}

export default function ExercisesSession({
  exercises,
  onComplete,
}: ExercisesSessionProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | string[])[]>(
    new Array(exercises.length).fill('')
  );
  const [showFeedback, setShowFeedback] = useState(false);
  const { submitExercise } = useLesson();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const currentExercise = exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === exercises.length - 1;

  const handleSubmit = async (answer: string | string[]) => {
    const newAnswers = [...answers];
    newAnswers[currentExerciseIndex] = answer;
    setAnswers(newAnswers);

    const isCorrect = await submitExercise(
      currentExercise.id,
      answer
    );

    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      if (!isLastExercise) {
        setCurrentExerciseIndex(prev => prev + 1);
      }
    }, 2000);
  };

  const renderExercise = () => {
    switch (currentExercise.type) {
      case 'grammar':
        return (
          <div className="space-y-4">
            <p className="text-lg">{currentExercise.question}</p>
            <div className="grid grid-cols-2 gap-4">
              {currentExercise.options?.map((option) => (
                <Button
                  key={option}
                  variant={answers[currentExerciseIndex] === option ? 'default' : 'outline'}
                  onClick={() => handleSubmit(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        );

      case 'spelling':
        return (
          <div className="space-y-4">
            <p className="text-lg">{currentExercise.question}</p>
            <Input
              type="text"
              value={answers[currentExerciseIndex] as string}
              onChange={(e) => setAnswers(prev => {
                const newAnswers = [...prev];
                newAnswers[currentExerciseIndex] = e.target.value;
                return newAnswers;
              })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(answers[currentExerciseIndex]);
                }
              }}
            />
            <Button onClick={() => handleSubmit(answers[currentExerciseIndex])}>
              Check Answer
            </Button>
          </div>
        );

      case 'sentence-ordering':
        const items = answers[currentExerciseIndex] as string[] || currentExercise.options || [];
        
        return (
          <div className="space-y-4">
            <p className="text-lg">{currentExercise.question}</p>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={({ active, over }) => {
                if (over && active.id !== over.id) {
                  const oldIndex = items.indexOf(active.id as string);
                  const newIndex = items.indexOf(over.id as string);
                  const newItems = arrayMove(items, oldIndex, newIndex);
                  const newAnswers = [...answers];
                  newAnswers[currentExerciseIndex] = newItems;
                  setAnswers(newAnswers);
                }
              }}
            >
              <SortableContext items={items} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {items.map((item) => (
                    <SortableItem key={item} id={item}>
                      {item}
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
            <Button onClick={() => handleSubmit(items)}>
              Check Order
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Exercise {currentExerciseIndex + 1}</h2>
          <span className="text-gray-500">
            {currentExerciseIndex + 1} of {exercises.length}
          </span>
        </div>

        {renderExercise()}

        {showFeedback && (
          <div
            className={`mt-4 rounded-lg p-4 ${
              Array.isArray(currentExercise.correctAnswer)
                ? JSON.stringify(answers[currentExerciseIndex]) === JSON.stringify(currentExercise.correctAnswer)
                : answers[currentExerciseIndex] === currentExercise.correctAnswer
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {Array.isArray(currentExercise.correctAnswer)
              ? JSON.stringify(answers[currentExerciseIndex]) === JSON.stringify(currentExercise.correctAnswer)
              : answers[currentExerciseIndex] === currentExercise.correctAnswer
              ? '✨ Correct! Well done!'
              : `❌ Not quite. The correct answer is: ${
                  Array.isArray(currentExercise.correctAnswer)
                    ? currentExercise.correctAnswer.join(' ')
                    : currentExercise.correctAnswer
                }`}
          </div>
        )}
      </Card>

      {isLastExercise && answers[currentExerciseIndex] !== '' && (
        <div className="flex justify-end">
          <Button onClick={onComplete} size="lg">
            Continue to Summary
          </Button>
        </div>
      )}
    </div>
  );
} 