import postgres from 'postgres';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

// Reuse one pool across Next.js dev hot reloads.
const g = globalThis as unknown as { __sql?: postgres.Sql };
export const sql = g.__sql ?? postgres(process.env.DATABASE_URL, { max: 5 });
if (process.env.NODE_ENV !== 'production') g.__sql = sql;

export const SELLER_ID = 1; // ponytail: single user, no auth. Add login + seller per user when there is more than one user.
