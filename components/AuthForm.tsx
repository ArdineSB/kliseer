'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

type Mode = 'login' | 'signup';
type State = 'idle' | 'submitting' | 'error';

const COPY: Record<Mode, { title: string; lede: string; submit: string; alt: string; altHref: string; altLabel: string }> = {
  login: {
    title: 'Log in',
    lede: 'Welcome back.',
    submit: 'Log in',
    alt: 'New to Kliseer?',
    altHref: '/create-account',
    altLabel: 'Create account',
  },
  signup: {
    title: 'Create account',
    lede: 'Start finding prospects.',
    submit: 'Create account',
    alt: 'Already have an account?',
    altHref: '/login',
    altLabel: 'Log in',
  },
};

export function AuthForm({ mode }: { mode: Mode }) {
  const copy = COPY[mode];
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState<State>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    // Client-side checks mirror the server rules (G4 copy verbatim).
    if (mode === 'signup' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError('Enter a valid email.');
    if (mode === 'signup' && password.length < 8) return setError('Password must be at least 8 characters.');
    setState('submitting');
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? 'Email or password is not valid.');
        setState('error');
        return;
      }
      router.push('/');
      router.refresh();
    } catch {
      setError('Email or password is not valid.');
      setState('error');
    }
  }

  return (
    <div className="auth-wrap">
      <main className="auth-card">
        <div className="brand" style={{ padding: 0, marginBottom: 28 }}>
          <span className="brand-mark" aria-hidden="true">K</span>Kliseer
        </div>
        <h1>{copy.title}</h1>
        <p className="lede" style={{ marginBottom: 24 }}>{copy.lede}</p>
        <form onSubmit={onSubmit} noValidate>
          <div className="field wide" style={{ marginBottom: 16 }}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={state === 'submitting'}
              required
            />
          </div>
          <div className="field wide" style={{ marginBottom: 20 }}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={state === 'submitting'}
              required
            />
          </div>
          {error && (
            <p className="field-error" role="alert" style={{ color: 'var(--status-error)', fontSize: 13, margin: '0 0 16px' }}>
              {error}
            </p>
          )}
          <button type="submit" className="btn btn-primary auth-submit" disabled={state === 'submitting' || !email.trim() || !password}>
            {state === 'submitting' ? 'Submitting…' : copy.submit}
          </button>
        </form>
        {mode === 'login' && (
          <Link href="/" className="btn btn-outline" style={{ marginTop: 12, width: '100%' }}>Explore Demo</Link>
        )}
        <p className="muted" style={{ fontSize: 13, marginTop: 24, textAlign: 'center' }}>
          {copy.alt} <Link href={copy.altHref} className="link">{copy.altLabel}</Link>
        </p>
      </main>
    </div>
  );
}
