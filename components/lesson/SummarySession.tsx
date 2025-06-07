'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useLesson } from '@/contexts/LessonContext';

interface SummarySessionProps {
  originalText: string;
  onComplete: () => void;
}

interface SummaryFeedback {
  score: number;
  feedback: string;
  corrections: {
    original: string;
    corrected: string;
    explanation: string;
  }[];
}

export default function SummarySession({
  originalText,
  onComplete,
}: SummarySessionProps) {
  const [summary, setSummary] = useState('');
  const [feedback, setFeedback] = useState<SummaryFeedback | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/lesson/evaluate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userSummary: summary, originalText }),
      });

      if (!response.ok) throw new Error('Failed to evaluate summary');

      const data = await response.json();
      setFeedback(data);
    } catch (error) {
      console.error('Error evaluating summary:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h2 className="mb-4 text-2xl font-bold">Write a Summary</h2>
        <p className="mb-6 text-gray-600">
          Write a brief summary of the lesson in French. Try to include the main points
          and use your own words. Your summary will be evaluated for accuracy and language use.
        </p>

        <div className="space-y-4">
          <Textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Write your summary here..."
            className="min-h-[200px]"
          />

          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || summary.length < 10}
            >
              {isSubmitting ? 'Evaluating...' : 'Submit Summary'}
            </Button>
          </div>
        </div>

        {feedback && (
          <div className="mt-8 space-y-6">
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-blue-900">Your Score</h3>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-2xl ${
                        i < feedback.score ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
              </div>
              <p className="mt-2 text-blue-800">{feedback.feedback}</p>
            </div>

            {feedback.corrections.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Suggested Improvements</h3>
                {feedback.corrections.map((correction, index) => (
                  <div key={index} className="rounded-lg border p-4">
                    <p className="text-red-600 line-through">{correction.original}</p>
                    <p className="text-green-600">{correction.corrected}</p>
                    <p className="mt-2 text-sm text-gray-600">{correction.explanation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>

      {feedback && feedback.score >= 3 && (
        <div className="flex justify-end">
          <Button onClick={onComplete} size="lg">
            Complete Lesson
          </Button>
        </div>
      )}
    </div>
  );
} 