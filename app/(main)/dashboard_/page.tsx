import PageWrapper from '@/components/layout/PageWrapper';
import UploadLessonButton from '@/components/dashboard/UploadLessonButton';
import LessonList from '@/components/dashboard/LessonList';

export default function DashboardPage() {
  return (
    <PageWrapper>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-brand-primary">Your Lessons</h1>
        <UploadLessonButton />
      </div>
      
      <LessonList />
    </PageWrapper>
  );
}