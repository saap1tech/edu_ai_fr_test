import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
}

export default function StarRating({ rating, maxRating = 5 }: StarRatingProps) {
  return (
    <div className="flex items-center">
      {Array.from({ length: maxRating }, (_, i) => (
        <Star
          key={i}
          className={`h-6 w-6 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
}