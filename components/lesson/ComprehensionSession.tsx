'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useLesson } from '@/contexts/LessonContext';

interface ComprehensionQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface ComprehensionSessionProps {
  questions: ComprehensionQuestion[];
  onComplete: () => void;
}

export default function ComprehensionSession({
  questions,
  onComplete,
}: ComprehensionSessionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(''));
  const [showFeedback, setShowFeedback] = useState(false);
  const { submitComprehension } = useLesson();

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswer = async (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);

    const isCorrect = await submitComprehension(
      currentQuestion.question,
      answer
    );

    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      if (!isLastQuestion) {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, 2000);
  };

  const isAllAnswered = answers.every(answer => answer !== '');

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Question {currentQuestionIndex + 1}</h2>
          <span className="text-gray-500">
            {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>

        <div className="space-y-6">
          <p className="text-lg text-gray-800">{currentQuestion.question}</p>

          <RadioGroup
            value={answers[currentQuestionIndex]}
            onValueChange={handleAnswer}
            className="space-y-4"
          >
            {currentQuestion.options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option} className="text-base">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {showFeedback && (
            <div
              className={`mt-4 rounded-lg p-4 ${
                answers[currentQuestionIndex] === currentQuestion.correctAnswer
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {answers[currentQuestionIndex] === currentQuestion.correctAnswer
                ? '✨ Correct! Well done!'
                : `❌ Not quite. The correct answer is: ${currentQuestion.correctAnswer}`}
            </div>
          )}
        </div>
      </Card>

      {isLastQuestion && isAllAnswered && (
        <div className="flex justify-end">
          <Button onClick={onComplete} size="lg">
            Continue to Exercises
          </Button>
        </div>
      )}
    </div>
  );
}
