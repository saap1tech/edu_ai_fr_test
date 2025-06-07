import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-background p-4">
      <div className="w-full max-w-md mx-auto text-center">
        <Image src="/images/logo.svg" alt="EduAI Logo" width={80} height={80} className="mx-auto mb-6" />
        {children}
      </div>
    </div>
  );
}