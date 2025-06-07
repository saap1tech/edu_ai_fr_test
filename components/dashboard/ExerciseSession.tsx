'use client';

import { useLesson } from '@/contexts/LessonContext';
import { Exercise } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '../ui/input';

export function ExerciseSession({ exercises }: { exercises: Exercise[] }) {
  const { answers, handleAnswerChange } = useLesson();

  const renderExercise = (exercise: Exercise, index: number) => {
    switch (exercise.type) {
      case 'grammar':
      case 'vocabulary':
        return (
          <div className="space-y-2">
            {exercise.options?.map((option, i) => (
              <div key={i} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`exercise-${index}`}
                  id={`option-${index}-${i}`}
                  className="h-4 w-4 text-blue-600"
                  value={option}
                  checked={answers[exercise.instruction] === option}
                  onChange={(e) => handleAnswerChange(exercise.instruction, e.target.value)}
                />
                <label htmlFor={`option-${index}-${i}`} className="text-gray-700">
                  {option}
                </label>
              </div>
            ))}
          </div>
        );

      case 'spelling':
        return (
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Type your answer"
              className="w-full p-2 border rounded-md"
              value={answers[exercise.instruction] || ''}
              onChange={(e) => handleAnswerChange(exercise.instruction, e.target.value)}
            />
          </div>
        );

      case 'sentenceOrdering':
        return (
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              Drag and drop functionality will be implemented in a future step. 
              For now, please type the sentence in order.
            </p>
            <Input
              type="text"
              placeholder="Type the sentence in order"
              className="w-full p-2 border rounded-md"
              value={answers[exercise.instruction] || ''}
              onChange={(e) => handleAnswerChange(exercise.instruction, e.target.value)}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {exercise.words?.map((word, i) => (
                <div
                  key={i}
                  className="px-3 py-1 bg-blue-100 rounded-full text-blue-700"
                >
                  {word}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
       <CardHeader>
        <CardTitle className="text-2xl font-bold text-brand-primary">
          Exercises
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {exercises?.map((exercise, index) => (
          <div key={index} className="p-4 border rounded-lg bg-white shadow-sm">
            <div className="mb-4">
              <p className="font-semibold mb-2">{exercise.instruction}</p>
              {/*<p className="text-sm text-gray-500 italic">{exercise.explanation}</p>*/}
            </div>
            {renderExercise(exercise, index)}
          </div>
        ))}
      </CardContent>
    </Card>
  );
} 