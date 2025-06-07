import { Button } from '../components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import PageWrapper from '../components/layout/PageWrapper';

export default function HomePage() {
  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-gradient-to-b from-blue-100 to-white">
        <Image src="/images/character.png" alt="Friendly Character" width={350} height={350} className="mb-4" />
        <h1 className="text-5xl md:text-7xl font-bold text-brand-primary mb-4">
          Welcome to EduAI!
        </h1>
        <p className="text-lg md:text-xl text-brand-text max-w-2xl mb-8">
          The fun, modern way for kids to learn with AI. Turn any textbook into an exciting adventure with interactive lessons powered by AI.
        </p>
        <div className="flex gap-4">
          <Link href="/login" passHref>
            <Button size="lg" className="bg-brand-accent hover:bg-brand-accent/90 text-white shadow-lg">
              Get Started
            </Button>
          </Link>
          <Link href="/dashboard" passHref>
            <Button size="lg" variant="outline" className="shadow-lg">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}