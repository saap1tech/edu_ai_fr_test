import UserAuthForm from '../../../components/auth/UserAuthForm';
import PageWrapper from '../../../components/layout/PageWrapper';

export default function LoginPage() {
  return (
    <PageWrapper>
      <h1 className="text-3xl font-bold text-brand-primary mb-2">Welcome!</h1>
      <p className="text-gray-600 mb-8">Sign in or create an account to start your adventure.</p>
      <UserAuthForm />
    </PageWrapper>
  );
}