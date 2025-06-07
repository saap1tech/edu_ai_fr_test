'use client';

import { Vocabulary } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume2 } from 'lucide-react';

interface ReadingSessionProps {
  content: string[];
  vocabulary: Vocabulary[];
}

export function ReadingSession({ content, vocabulary }: ReadingSessionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-brand-primary">
          Reading Passage
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none text-lg mb-6">
          {content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <h3 className="text-xl font-semibold mb-4">Vocabulary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {vocabulary.map((item, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="font-bold text-brand-accent">{item.word}</div>
              <div className="text-sm text-gray-500">[{item.pronunciation}]</div>
              <div className="text-md">{item.translation}</div>
              <p className="text-sm italic text-gray-600 mt-1">
                {`"${item.exampleSentence}"`}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 