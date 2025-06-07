import { Award } from 'lucide-react';

interface BadgeProps {
  label: string;
}

export default function Badge({ label }: BadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-full font-semibold text-sm">
      <Award className="h-4 w-4" />
      <span>{label}</span>
    </div>
  );
}