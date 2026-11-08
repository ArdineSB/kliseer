import { sql } from './db';
import { llm, LLM_MODEL } from './llm';
import { renderDraft } from './account';
import { LlmUnavailable } from './chat';

export type DraftContact = { name: string; email: string | null };

/** Upsert the stored draft. The token {contact.name} stays in the saved text (Q8). */
export async function saveDraft(sellerId: number, companyId: number, subject: string, body: string) {
  await sql`
    insert into email_drafts (seller_id, company_id, subject, body, updated_at)
    values (${sellerId}, ${companyId}, ${subject}, ${body}, now())
    on conflict (seller_id, company_id) do update set subject = excluded.subject, body = excluded.body, updated_at = now()`;
}

/**
 * LLM writes the draft from real signal and seller context. Contact name is stored as
 * the {contact.name} token, so swapping the contact later changes the name only.
 * One paragraph of interpretation is separate; the LLM never computes scores (G8).
 */
export async function generateDraft(sellerId: number, companyId: number, contact: DraftContact, context: { company: string; state: string; stars: { keyword: number | null; freshness: number | null; place: number | null; targetFit: number | null }; lastSignals: { date: string; summary: string }[]; seller: { name: string; products: string | string[] } }): Promise<{ subject: string; body: string }> {
  if (!process.env.LLM_API_KEY || !LLM_MODEL) throw new LlmUnavailable('LLM unavailable');
  const products = Array.isArray(context.seller.products) ? context.seller.products.join(', ') : context.seller.products;
  const res = await llm.chat.completions.create({
    model: LLM_MODEL,
    temperature: 0.4,
    messages: [
      {
        role: 'system',
        content: `You write short cold outreach emails for Kliseer, a US building-construction sales prospecting tool. Use only the facts given; never invent projects, dates, or contacts. Write "{contact.name}" where the contact name belongs (greeting and body) — it is replaced at display time. Reply with JSON only: {"subject": string, "body": string}. Subject under 60 characters, body under 1600 characters, plain text, one short signature line for the seller.`,
      },
      {
        role: 'user',
        content: JSON.stringify({
          task: 'Draft a first-touch email.',
          seller: { name: context.seller.name, products },
          prospect: { company: context.company, state: context.state, signals: context.lastSignals },
          fit: context.stars,
          contact,
        }),
      },
    ],
  });
  const raw = res.choices[0]?.message?.content ?? '';
  const m = raw.match(/\{[\s\S]*\}/);
  if (!m) throw new LlmUnavailable('LLM unavailable');
  const parsed = JSON.parse(m[0]) as { subject?: unknown; body?: unknown };
  if (typeof parsed.subject !== 'string' || typeof parsed.body !== 'string' || !parsed.subject.trim() || !parsed.body.trim()) throw new LlmUnavailable('LLM unavailable');
  const out = { subject: parsed.subject.slice(0, 200), body: parsed.body.slice(0, 4000) };
  await saveDraft(sellerId, companyId, out.subject, out.body);
  return out;
}

/** Stored text keeps the token; display replaces it once (Q8). */
export function viewDraft(draft: { subject: string; body: string }, contactName: string): { subject: string; body: string } {
  return { subject: renderDraft(draft.subject, contactName), body: renderDraft(draft.body, contactName) };
}
