import { redirect } from 'next/navigation';
import { AuthForm } from '@/components/AuthForm';
import { getViewer } from '@/lib/session';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Create account · Kliseer' };

export default async function CreateAccountPage() {
  if ((await getViewer())?.loggedIn) redirect('/app/');
  return <AuthForm mode="signup" />;
}
