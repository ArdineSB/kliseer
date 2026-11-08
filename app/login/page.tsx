import { redirect } from 'next/navigation';
import { AuthForm } from '@/components/AuthForm';
import { getViewer } from '@/lib/session';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Log in · Kliseer' };

export default async function LoginPage() {
  if ((await getViewer())?.loggedIn) redirect('/app/');
  return <AuthForm mode="login" />;
}
