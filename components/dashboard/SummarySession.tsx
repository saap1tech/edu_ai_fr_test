'use client';

interface SummarySessionProps {
  summary: string;
}

export function SummarySession({ summary }: SummarySessionProps) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">Summary</h3>
      <p>{summary}</p>
    </div>
  );
} 