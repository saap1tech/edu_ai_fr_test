import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LessonPlan } from '@/lib/types';
import { BookOpen } from 'lucide-react';
import StarRating from '../shared/StarRating';

interface LessonCardProps {
  lesson: LessonPlan;
}

export default function LessonCard({ lesson }: LessonCardProps) {
  // Mock progress, you'd fetch this from userProfile
  const progress = { stars: 3, completed: false };

  return (
    <Card className="flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-brand-accent">
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="text-2xl text-brand-primary">{lesson.title}</CardTitle>
            <BookOpen className="h-8 w-8 text-brand-secondary" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">A new adventure awaits! Ready to practice?</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <StarRating rating={progress.stars} />
        <Link href={`/lesson/${lesson.id}`} passHref>
          <Button className="bg-brand-accent hover:bg-brand-accent/90 text-white">Start Lesson</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}