'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { VocabularyItem } from '@/contexts/LessonContext';

interface ReadingSessionProps {
  content: string;
  vocabulary: VocabularyItem[];
  onComplete: () => void;
}

export default function ReadingSession({
  content,
  vocabulary,
  onComplete,
}: ReadingSessionProps) {
  const [selectedWord, setSelectedWord] = useState<VocabularyItem | null>(null);
  const { speak, stop, isSpeaking } = useTextToSpeech();

  const handleWordClick = (word: VocabularyItem) => {
    setSelectedWord(word);
    speak(word.word);
  };

  const paragraphs = content.split('\n').filter(Boolean);

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="prose prose-lg max-w-none">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-800">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            onClick={() => {
              stop();
              speak(content);
            }}
          >
            {isSpeaking ? 'Stop' : 'Read Aloud'}
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-2xl font-bold">Vocabulary</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {vocabulary.map((word) => (
            <div
              key={word.word}
              className={`
                cursor-pointer rounded-lg border p-4 transition-colors
                ${selectedWord?.word === word.word ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'}
              `}
              onClick={() => handleWordClick(word)}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-blue-600">{word.word}</h3>
                <span className="text-sm text-gray-500">{word.pronunciation}</span>
              </div>
              <p className="mt-2 text-gray-600">{word.translation}</p>
              <p className="mt-2 text-sm italic text-gray-500">{word.example}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onComplete} size="lg">
          Continue to Comprehension
        </Button>
      </div>
    </div>
  );
}
