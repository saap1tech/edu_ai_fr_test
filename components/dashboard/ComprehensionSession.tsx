'use client';

import { useLesson } from '@/contexts/LessonContext';
import { ComprehensionQuestion } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ComprehensionSessionProps {
  questions: ComprehensionQuestion[];
}

export function ComprehensionSession({ questions }: ComprehensionSessionProps) {
  const { answers, handleAnswerChange } = useLesson();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-brand-primary">
          Comprehension Questions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map((q, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <p className="font-semibold mb-4">{q.question}</p>
            <div className="space-y-2">
              {q.answers.map((answer, i) => (
                <div key={i} className="flex items-center">
                  <input
                    type="radio"
                    id={`q-${index}-option-${i}`}
                    name={`question-${index}`}
                    value={answer}
                    checked={answers[q.question] === answer}
                    onChange={(e) => handleAnswerChange(q.question, e.target.value)}
                    className="h-4 w-4 text-brand-accent"
                  />
                  <label htmlFor={`q-${index}-option-${i}`} className="ml-2">
                    {answer}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
} 