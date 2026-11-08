'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { BrandLockup } from './BrandLockup';

type Mode = 'login' | 'signup';
type State = 'idle' | 'submitting' | 'error';

// Copy from the approved auth frames (G1/G4; user-approved text in FigCraft).
const COPY: Record<Mode, { title: string; lede: string; submit: string; alt: string; altLabel: string }> = {
  login: {
    title: 'Log in',
    lede: 'Continue to your Kliseer workspace.',
    submit: 'Log in',
    alt: 'New to Kliseer?',
    altLabel: 'Create account',
  },
  signup: {
    title: 'Create account',
    lede: 'Tell Kliseer what you sell. Let’s find who needs it.',
    submit: 'Create account',
    alt: 'Already have an account?',
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

  const busy = state === 'submitting';

  return (
    <div className="auth-wrap">
      <main className="auth-canvas">
        <div className="auth-form">
          <div className="auth-brand"><BrandLockup size={39} /></div>
          <header className="auth-heading">
            <h1>{copy.title}</h1>
            <p>{copy.lede}</p>
          </header>
          <form onSubmit={onSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={busy}
                required
              />
            </div>
            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                placeholder={mode === 'login' ? 'Enter your password' : 'At least 8 characters'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={busy}
                required
              />
            </div>
            {error && <p className="auth-error" role="alert">{error}</p>}
            <button type="submit" className="btn btn-primary auth-submit" disabled={busy || !email.trim() || !password}>
              {busy ? 'Submitting…' : copy.submit}
            </button>
          </form>
          {mode === 'login' && (
            <Link href="/" className="btn btn-outline auth-explore">Explore Demo</Link>
          )}
          <p className="auth-switch">
            {copy.alt} <Link href={mode === 'login' ? '/create-account' : '/login'} className="link">{copy.altLabel}</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
