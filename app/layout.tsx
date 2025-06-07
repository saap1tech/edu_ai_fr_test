import { Comic_Neue } from 'next/font/google';
import './globals.css';
import ClientLayout from './ClientLayout';

const comicNeue = Comic_Neue({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-comic-neue',
});

export const metadata = {
  title: 'EduAI - Fun Learning for Kids with AI',
  description: 'An interactive web app for children to learn from PDFs.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${comicNeue.variable} font-sans bg-brand-background`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}