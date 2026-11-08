import 'server-only';
import { createHash, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { sql } from './db';
import { SESSION_DAYS } from './account';

const SESSION_COOKIE = 'kliseer_session';
const GUEST_COOKIE = 'kliseer_guest';
export const GUEST_DEMO_SELLER = 1; // Harborline read-only demo row; not a guest row.

const sha = (v: string) => createHash('sha256').update(v).digest('hex');

export type Viewer = { sellerId: number; loggedIn: boolean };

/**
 * Resolve the seller for this request: session cookie wins, then guest cookie.
 * No cookie → null (pages create a guest lazily via `ensureGuest`).
 */
export async function getViewer(): Promise<Viewer | null> {
  const jar = await cookies();
  const session = jar.get(SESSION_COOKIE)?.value;
  if (session) {
    const [row] = await sql<{ seller_id: number }[]>`
      select s.id as seller_id from sessions se
      join sellers s on s.user_id = se.user_id
      where se.token_hash = ${sha(session)} and se.expires_at > now() limit 1`;
    if (row) return { sellerId: row.seller_id, loggedIn: true };
  }
  const guest = jar.get(GUEST_COOKIE)?.value;
  if (guest) {
    const [row] = await sql<{ id: number }[]>`
      select id from sellers where guest_token_hash = ${sha(guest)} limit 1`;
    if (row) return { sellerId: row.id, loggedIn: false };
  }
  return null;
}

/** Create the per-request seller row. Sessions are user-bound; guests are token-bound. */
export async function createSession(userId: number): Promise<void> {
  const token = randomBytes(32).toString('base64url');
  await sql`insert into sessions (user_id, token_hash, expires_at) values (${userId}, ${sha(token)}, now() + ${SESSION_DAYS}::int * interval '1 day')`;
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: SESSION_DAYS * 86400, secure: process.env.NODE_ENV === 'production' });
}

/**
 * Guest row for the visitor's proxy-issued token. The cookie itself was set in proxy.ts
 * (page renders may not set cookies); we only persist the hash → seller mapping here.
 */
export async function createGuest(): Promise<number> {
  const jar = await cookies();
  const token = jar.get(GUEST_COOKIE)?.value;
  if (!token) throw new Error('No guest cookie. The proxy layer must issue one.');
  const [row] = await sql<{ id: number }[]>`
    insert into sellers (guest_token_hash) values (${sha(token)})
    on conflict (guest_token_hash) do update set updated_at = now()
    returning id`;
  return row.id;
}

/** Viewer or a fresh guest. Never returns null. */
export async function ensureSellerId(): Promise<number> {
  return (await getViewer())?.sellerId ?? (await createGuest());
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const session = jar.get(SESSION_COOKIE)?.value;
  if (session) await sql`delete from sessions where token_hash = ${sha(session)}`;
  jar.delete(SESSION_COOKIE);
  // Guest cookie stays: after logout the same visitor resumes their guest data.
}

/**
 * Attach an existing guest seller to a user on signup/login (Q10/G2).
 * Account with any filled section keeps its row (guest chat deleted);
 * empty account adopts the guest row and chat.
 */
export async function claimGuestRow(userId: number, accountId: number | null): Promise<void> {
  const jar = await cookies();
  const token = jar.get(GUEST_COOKIE)?.value;
  const guestHash = token ? sha(token) : null;
  if (token) jar.delete(GUEST_COOKIE);
  if (!guestHash) return;
  const [guest] = await sql<{ id: number; company: Record<string, unknown>; icp: Record<string, unknown>; target: Record<string, unknown> }[]>`
    select id, company, icp, target from sellers where guest_token_hash = ${guestHash} limit 1`;
  if (!guest) return;
  if (accountId !== null && (['company', 'icp', 'target'] as const).some((k) => Object.keys(guest[k]).length > 0)) {
    // Non-empty guest content is dropped in favor of the account (keep-account wins).
    await sql`delete from chat_messages where seller_id = ${guest.id}`;
    await sql`delete from sellers where id = ${guest.id}`;
    return;
  }
  if (accountId !== null) {
    // Empty account adopts the guest row; move its chat is unnecessary (row itself moves).
    await sql`delete from sellers where id = ${accountId}`;
  }
  await sql`update sellers set user_id = ${userId}, guest_token_hash = null where id = ${guest.id}`;
}
