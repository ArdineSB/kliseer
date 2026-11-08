import { sql } from '@/lib/db';
import { AUTH_ERROR, emailError, hashPassword, normalizeEmail, passwordError, verifyPassword } from '@/lib/account';
import { claimGuestRow, createSession, destroySession } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Body = { email?: unknown; password?: unknown };

export async function POST(req: Request, ctx: { params: Promise<{ action: string }> }) {
  const { action } = await ctx.params;
  if (action === 'logout') {
    await destroySession();
    return Response.json({ ok: true });
  }
  const body: Body = await req.json().catch(() => ({}));
  const email = typeof body.email === 'string' ? body.email : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (action === 'signup') {
    if (emailError(email)) return Response.json({ error: 'Enter a valid email.' }, { status: 400 });
    if (passwordError(password)) return Response.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    const norm = normalizeEmail(email);
    const [user] = await sql<{ id: number }[]>`insert into users (email, password_hash) values (${norm}, ${hashPassword(password)}) on conflict (email) do nothing returning id`;
    if (!user) return Response.json({ error: AUTH_ERROR }, { status: 409 });
    const [account] = await sql<{ id: number }[]>`select id from sellers where user_id = ${user.id} limit 1`;
    await claimGuestRow(user.id, account?.id ?? null);
    // No guest row to claim (direct signup without visiting data pages): create the seller row.
    const [has] = await sql<{ id: number }[]>`select id from sellers where user_id = ${user.id} limit 1`;
    if (!has) await sql`insert into sellers (user_id) values (${user.id})`;
    await createSession(user.id);
    return Response.json({ ok: true });
  }

  if (action === 'login') {
    const norm = normalizeEmail(email);
    const [user] = await sql<{ id: number; password_hash: string }[]>`select id, password_hash from users where email = ${norm} limit 1`;
    if (!user || !verifyPassword(password, user.password_hash)) return Response.json({ error: AUTH_ERROR }, { status: 401 });
    const [account] = await sql<{ id: number }[]>`select id from sellers where user_id = ${user.id} limit 1`;
    await claimGuestRow(user.id, account?.id ?? null);
    await createSession(user.id);
    return Response.json({ ok: true });
  }

  return Response.json({ error: 'unknown action' }, { status: 404 });
}
