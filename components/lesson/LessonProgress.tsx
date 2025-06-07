import { Progress } from '@/components/ui/progress';

type SessionType = 'reading' | 'comprehension' | 'exercises' | 'summary';

interface LessonProgressProps {
  currentSession: SessionType;
  completedSessions: Set<SessionType>;
}

const sessions: SessionType[] = ['reading', 'comprehension', 'exercises', 'summary'];

export default function LessonProgress({
  currentSession,
  completedSessions,
}: LessonProgressProps) {
  const currentIndex = sessions.indexOf(currentSession);
  const progress = ((completedSessions.size + (currentIndex > 0 ? 1 : 0)) / sessions.length) * 100;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        {sessions.map((session, index) => {
          const isCompleted = completedSessions.has(session);
          const isCurrent = session === currentSession;
          
          return (
            <div
              key={session}
              className={`
                h-3 w-3 rounded-full
                ${isCompleted ? 'bg-green-500' : isCurrent ? 'bg-blue-500' : 'bg-gray-200'}
              `}
            />
          );
        })}
      </div>
      <Progress value={progress} className="w-24" />
    </div>
  );
} 