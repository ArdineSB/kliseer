import { sql } from './db';

/**
 * Delete guest seller rows older than 7 days, and their chat.
 * A row without guest_token_hash is not a guest. Seller 1 (Harborline) is not a guest.
 */
export async function purgeExpiredGuests(): Promise<number> {
  const gone = await sql<{ id: number }[]>`
    select id from sellers
    where user_id is null
      and guest_token_hash is not null
      and created_at <= now() - interval '7 days'`;
  if (!gone.length) return 0;
  const ids = gone.map((r) => r.id);
  await sql`delete from chat_messages where seller_id in ${sql(ids)}`;
  await sql`delete from sellers where id in ${sql(ids)} and guest_token_hash is not null and user_id is null`;
  return ids.length;
}
